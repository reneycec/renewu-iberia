"""
Book Translator v2.0 - Traductor de libros teológicos del inglés al español (México)
Reestructurado con mejores prácticas POO: Dependency Injection, SRP, Protocolos,
persistencia de progreso, rate limiting, y manejo robusto de errores.
"""
import os
import re
import json
import time
import sys
import argparse
import asyncio
import logging
from pathlib import Path
from abc import ABC, abstractmethod
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Tuple, Protocol, runtime_checkable
from openai import AsyncOpenAI
from docx import Document

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ================= CONFIGURACION =================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger(__name__)


# ================= MODELOS DE DOMINIO (inmutables y claros) =================

@dataclass(frozen=True)
class Chapter:
    """Capítulo inmutable del libro original. No se modifica después de parsear."""
    index: int
    title: str
    paragraphs: Tuple[str, ...]  # Tuple en vez de List → inmutable

    @property
    def word_count(self) -> int:
        return sum(len(p.split()) for p in self.paragraphs)


@dataclass
class TranslationSection:
    """Sección traducida de un capítulo."""
    heading: Optional[str]
    text: str
    footnotes: List[str] = field(default_factory=list)


@dataclass
class TranslatedChapter:
    """Capítulo completamente traducido."""
    index: int
    original_title: str
    translated_title: str
    sections: List[TranslationSection]

    @property
    def full_text(self) -> str:
        return "\n\n".join(s.text for s in self.sections)


@dataclass
class TranslatedBook:
    """Libro completamente traducido."""
    title: str
    source_language: str
    target_language: str
    chapters: List[TranslatedChapter]


@dataclass
class TranslatorConfig:
    """Configuración centralizada. Valida en construcción."""
    api_key: str = field(default_factory=lambda: os.getenv("OPENAI_API_KEY", ""))
    model: str = "gpt-4o"
    chunk_size_words: int = 2000
    max_retries: int = 3
    base_retry_delay: float = 3.0
    temperature: float = 0.0
    max_tokens: int = 8192
    max_concurrent_requests: int = 3
    requests_per_minute: int = 50
    max_expansion_ratio: float = 1.15
    min_expansion_ratio: float = 0.70
    save_checkpoint_every_n_chapters: int = 1

    system_prompt: str = """Eres un traductor experto de teología sistemática y bíblica
al español de México con rigor académico.

## REGLAS DE TRADUCCIÓN
1. **Registro**: Formal académico, no coloquial
2. **Terminología técnica**:
   - "justification" → "justificación forense" (contexto paulino)
   - "propitiation" → "propiciación" (no "expiación")
   - "sanctification" → "santificación" (proceso, no evento)
   - "atonement" → "expiación"
   - "grace" → "gracia"
   - "covenant" → "pacto"
   - "redemption" → "redención"
   - "election" → "elección"
   - "predestination" → "predestinación"
   - "regeneration" → "regeneración"
   - "imputation" → "imputación"
3. **Citas bíblicas**: Traducir desde griego/hebreo si es posible; si no, usar RVR1960
4. **Nombres propios**: Latinizar según convención hispana
5. **Notas al pie**: Mantener formato, traducir contenido
6. **Índices**: Conservar estructura, traducir títulos

## FORMATO DE RESPUESTA
- Devuelve SOLO el texto traducido
- NO agregues comentarios, explicaciones ni markdown
- Conserva la estructura de párrafos original
- Mantén los números de nota al pie en su posición correcta"""

    def validate(self) -> List[str]:
        """Valida la configuración al inicio, no en runtime."""
        errors = []
        if not self.api_key:
            errors.append("OPENAI_API_KEY no configurada")
        if self.chunk_size_words < 100:
            errors.append(f"chunk_size_words muy pequeño: {self.chunk_size_words}")
        if self.max_expansion_ratio < self.min_expansion_ratio:
            errors.append("max_expansion_ratio no puede ser menor que min_expansion_ratio")
        if self.max_concurrent_requests < 1:
            errors.append("max_concurrent_requests debe ser >= 1")
        return errors


# ================= PROTOCOLOS (Interfaces) =================

@runtime_checkable
class BookParserProtocol(Protocol):
    """Cualquier parser de libros debe implementar esto."""
    def parse(self, filepath: Path) -> List[Chapter]: ...


@runtime_checkable
class TranslatorProtocol(Protocol):
    """Cualquier servicio de traducción debe implementar esto."""
    async def translate_section(
        self, text: str, context: "TranslationContext"
    ) -> str: ...


@runtime_checkable
class ValidatorProtocol(Protocol):
    """Cualquier validador debe implementar esto."""
    def validate(self, original: str, translated: str) -> List[str]: ...


@runtime_checkable
class ExporterProtocol(Protocol):
    """Cualquier exportador debe implementar esto."""
    def export(self, book: TranslatedBook, output_path: Path) -> None: ...


# ================= CONTEXTO DE TRADUCCIÓN (value object) =================

@dataclass(frozen=True)
class TranslationContext:
    """Contexto inmutable que viaja con cada petición de traducción.
    Evita pasar 6 parámetros separados al servicio AI."""
    chapter_title: str
    chapter_index: int
    total_chapters: int
    section_index: int
    total_sections: int
    memory_context: str
    book_title: str = ""


# ================= MEMORIA DE TRADUCCIÓN (persistible) =================

class TranslationMemory:
    """
    Sistema de memoria de traducción para consistencia entre capítulos.
    Persistible a disco para sobrevivir crashes y reanudaciones.
    """

    def __init__(self):
        self.terms: Dict[str, str] = {}
        self.names: Dict[str, str] = {}
        self.citations: Dict[str, str] = {}
        self._applied_count: int = 0

    def get_context_string(self) -> str:
        """Genera contexto para inyectar en el prompt de traducción."""
        if not self.terms and not self.names and not self.citations:
            return ""

        lines = ["## MEMORIA DE TRADUCCIÓN (mantén consistencia)"]

        if self.terms:
            lines.append("\n### Términos técnicos:")
            for orig, trans in sorted(self.terms.items()):
                lines.append(f'  - "{orig}" → "{trans}"')

        if self.names:
            lines.append("\n### Nombres propios:")
            for orig, trans in sorted(self.names.items()):
                lines.append(f'  - "{orig}" → "{trans}"')

        if self.citations:
            lines.append("\n### Citas bíblicas (mantén formato):")
            for orig, trans in list(self.citations.items())[:10]:
                lines.append(f'  - "{orig}" → "{trans}"')

        return "\n".join(lines)

    def learn_from_pair(self, original: str, translated: str) -> None:
        """Extrae decisiones de traducción del par original/traducido."""
        self._learn_names(original)
        self._learn_citations(original, translated)

    def _learn_names(self, original: str) -> None:
        """Detecta nombres propios teológicos conocidos en el original."""
        known_names = {
            "Calvin": "Calvino", "Luther": "Lutero", "Augustine": "Agustín",
            "Aquinas": "Tomás de Aquino", "Spurgeon": "Spurgeon",
            "Sproul": "Sproul", "Piper": "Piper", "Grudem": "Grudem",
            "Bavinck": "Bavinck", "Berkhof": "Berkhof", "Owen": "Owen",
            "Hodge": "Hodge", "Warfield": "Warfield", "Bonhoeffer": "Bonhoeffer",
            "Barth": "Barth", "Turretin": "Turretino",
        }
        for eng, spa in known_names.items():
            if eng in original:
                self.names[eng] = spa

    def _learn_citations(self, original: str, translated: str) -> None:
        """Extrae citas bíblicas del par para mantenerlas consistentes."""
        pattern = re.compile(
            r'((?:\d\s+)?(?:Gen|Exod|Lev|Num|Deut|Josh|Judg|Sam|Kings|Chr|'
            r'Ezra|Neh|Esth?|Job|Ps(?:alm)?s?|Prov|Eccl|Song|Isa|Jer|Lam|'
            r'Ezek|Dan|Hos|Joel|Amos|Obad|Jonah|Mic|Nah|Hab|Zeph|Hag|Zech|Mal|'
            r'Matt|Mark|Luke|John|Acts|Rom|Cor|Gal|Eph|Phil|Col|Thess|Tim|'
            r'Titus|Phlm|Heb|James|Pet|Jude|Rev)\.?\s+\d+[:：]\d+(?:\s*[-–]\s*\d+)?)',
            re.IGNORECASE
        )
        orig_citations = pattern.findall(original)
        trans_citations = pattern.findall(translated)

        # Solo emparejar si hay igual cantidad
        if len(orig_citations) == len(trans_citations):
            for o, t in zip(orig_citations, trans_citations):
                o_clean = o.strip()
                t_clean = t.strip()
                if o_clean not in self.citations:
                    self.citations[o_clean] = t_clean

    def update_terms(self, new_terms: Dict[str, str]) -> None:
        """Actualiza términos técnicos (puede llamarse desde validador)."""
        self.terms.update(new_terms)

    def save(self, path: Path) -> None:
        """Persiste memoria a JSON para reanudación."""
        data = {
            "terms": self.terms,
            "names": self.names,
            "citations": dict(list(self.citations.items())[:50]),
        }
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        logger.info(f"💾 Memoria guardada: {path.name}")

    @classmethod
    def load(cls, path: Path) -> "TranslationMemory":
        """Carga memoria desde JSON."""
        memory = cls()
        if path.exists():
            data = json.loads(path.read_text(encoding="utf-8"))
            memory.terms = data.get("terms", {})
            memory.names = data.get("names", {})
            memory.citations = data.get("citations", {})
            logger.info(f"💾 Memoria cargada: {len(memory.terms)} términos, "
                        f"{len(memory.names)} nombres, {len(memory.citations)} citas")
        return memory


# ================= CHECKPOINT (persistencia de progreso) =================

class CheckpointManager:
    """
    Guarda progreso después de cada capítulo para poder reanudar
    traducciones interrumpidas. Resuelve el problema de perder
    15 capítulos traducidos si falla el capítulo 16.
    """

    def __init__(self, checkpoint_dir: Path):
        self.checkpoint_dir = checkpoint_dir
        self.checkpoint_dir.mkdir(parents=True, exist_ok=True)

    def _checkpoint_path(self, book_name: str) -> Path:
        return self.checkpoint_dir / f"{book_name}_checkpoint.json"

    def save_progress(
        self,
        book_name: str,
        last_chapter_index: int,
        total_chapters: int,
        translated_chapters_data: List[dict],
        memory: TranslationMemory
    ) -> None:
        """Guarda progreso después de cada capítulo."""
        data = {
            "book_name": book_name,
            "last_chapter_index": last_chapter_index,
            "total_chapters": total_chapters,
            "translated_chapters": translated_chapters_data,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        }
        path = self._checkpoint_path(book_name)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

        # También guardar memoria
        memory_path = self.checkpoint_dir / f"{book_name}_memory.json"
        memory.save(memory_path)

        logger.info(f"💾 Checkpoint: capítulo {last_chapter_index + 1}/{total_chapters}")

    def load_progress(self, book_name: str) -> Optional[dict]:
        """Carga progreso previo si existe."""
        path = self._checkpoint_path(book_name)
        if path.exists():
            data = json.loads(path.read_text(encoding="utf-8"))
            logger.info(
                f"💾 Checkpoint encontrado: capítulo "
                f"{data['last_chapter_index'] + 1}/{data['total_chapters']} "
                f"({data['timestamp']})"
            )
            return data
        return None

    def clear(self, book_name: str) -> None:
        """Limpia checkpoint después de traducción exitosa."""
        path = self._checkpoint_path(book_name)
        memory_path = self.checkpoint_dir / f"{book_name}_memory.json"
        for p in [path, memory_path]:
            if p.exists():
                p.unlink()


# ================= PARSERS =================

class DocxBookParser:
    """
    Parser para archivos DOCX con estructura de capítulos o texto continuo.
    Detecta automáticamente Heading 1/2/3, Título 1/2, patrones de 'Capítulo'/'Chapter'
    o divide inteligentemente en secciones si es un texto continuo.
    """

    CHAPTER_REGEX = re.compile(
        r'^(?:Cap[íi]tulo|Chapter|Secci[óo]n|Section|Parte|Part|\b[0-9]+\b|\b[IVXLCDM]+\b)[\s.:\n-]',
        re.IGNORECASE
    )

    def parse(self, filepath: Path) -> List[Chapter]:
        if filepath.suffix.lower() != ".docx":
            raise ValueError(f"Formato no soportado: {filepath.suffix}. Se requiere un archivo .docx")

        if not filepath.exists():
            raise FileNotFoundError(f"Archivo no encontrado: {filepath}")

        try:
            doc = Document(filepath)
        except Exception as e:
            raise ValueError(f"Error al abrir el archivo DOCX: {e}") from e

        chapters: List[Chapter] = []
        current_paragraphs: List[str] = []
        current_title = "Introducción"
        chapter_index = 0

        # Detectar si el documento utiliza estilos de encabezado explícitos
        has_headings = any(
            para.style and (
                para.style.name.startswith("Heading") or
                para.style.name.startswith("Título") or
                para.style.name.lower() in ("title", "título", "header")
            )
            for para in doc.paragraphs
        )

        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue

            style_name = para.style.name if para.style else ""
            is_heading_style = (
                style_name.startswith("Heading 1") or
                style_name.startswith("Heading 2") or
                style_name.startswith("Heading 3") or
                style_name.startswith("Título 1") or
                style_name.startswith("Título 2") or
                style_name.lower() in ("title", "título")
            )
            is_chapter_regex = bool(self.CHAPTER_REGEX.match(text)) and len(text) < 120

            if (has_headings and is_heading_style) or (not has_headings and is_chapter_regex):
                if current_paragraphs:
                    chapters.append(Chapter(
                        index=chapter_index,
                        title=current_title,
                        paragraphs=tuple(current_paragraphs)
                    ))
                    chapter_index += 1

                current_title = text or f"Capítulo {chapter_index + 1}"
                current_paragraphs = []
            else:
                current_paragraphs.append(text)

        # Último capítulo
        if current_paragraphs:
            chapters.append(Chapter(
                index=chapter_index,
                title=current_title,
                paragraphs=tuple(current_paragraphs)
            ))

        # Fallback de seguridad: si no se detectaron encabezados ni patrones, usar el texto completo
        if not chapters:
            all_paras = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            if all_paras:
                chapters = [Chapter(index=0, title="Documento Completo", paragraphs=tuple(all_paras))]
            else:
                raise ValueError("El documento DOCX no contiene texto extraíble.")

        # Si el documento tiene secciones muy extensas (> 5000 palabras) en pocos bloques, dividir virtualmente
        final_chapters: List[Chapter] = []
        idx = 0
        for ch in chapters:
            if ch.word_count > 5000 and len(chapters) <= 2:
                words_acc = 0
                chunk_paras = []
                part_num = 1
                for p in ch.paragraphs:
                    chunk_paras.append(p)
                    words_acc += len(p.split())
                    if words_acc >= 2500:
                        final_chapters.append(Chapter(
                            index=idx,
                            title=f"{ch.title} - Parte {part_num}",
                            paragraphs=tuple(chunk_paras)
                        ))
                        idx += 1
                        part_num += 1
                        chunk_paras = []
                        words_acc = 0
                if chunk_paras:
                    final_chapters.append(Chapter(
                        index=idx,
                        title=f"{ch.title} - Parte {part_num}",
                        paragraphs=tuple(chunk_paras)
                    ))
                    idx += 1
            else:
                final_chapters.append(Chapter(
                    index=idx,
                    title=ch.title,
                    paragraphs=ch.paragraphs
                ))
                idx += 1

        logger.info(f"📖 Documento parseado: {len(final_chapters)} capítulo(s)/sección(es), "
                     f"{sum(ch.word_count for ch in final_chapters)} palabras totales")

        return final_chapters


# ================= DIVISOR SEMÁNTICO =================

class SemanticSplitter:
    """
    Divide párrafos de un capítulo en secciones manejables para la API.
    Maneja correctamente el caso de párrafos individuales más grandes
    que el tamaño de chunk (los divide por oraciones).
    """

    SENTENCE_PATTERN = re.compile(r'(?<=[.!?])\s+(?=[A-Z])')

    def __init__(self, max_words: int = 2000):
        if max_words < 100:
            raise ValueError(f"max_words demasiado pequeño: {max_words}")
        self.max_words = max_words

    def split(self, paragraphs: Tuple[str, ...]) -> List[str]:
        """Agrupa párrafos en secciones respetando el límite de palabras."""
        sections: List[str] = []
        buffer: List[str] = []
        buffer_words = 0

        for para in paragraphs:
            para_words = len(para.split())

            # Caso 1: párrafo solo excede el límite → dividir por oraciones
            if para_words > self.max_words:
                # Vaciar buffer actual primero
                if buffer:
                    sections.append("\n\n".join(buffer))
                    buffer = []
                    buffer_words = 0

                # Dividir párrafo grande por oraciones
                sentence_chunks = self._split_by_sentences(para)
                sections.extend(sentence_chunks)
                continue

            # Caso 2: agregar al buffer excedería el límite
            if buffer_words + para_words > self.max_words and buffer:
                sections.append("\n\n".join(buffer))
                buffer = [para]
                buffer_words = para_words
            else:
                buffer.append(para)
                buffer_words += para_words

        # Último buffer
        if buffer:
            sections.append("\n\n".join(buffer))

        return sections

    def _split_by_sentences(self, text: str) -> List[str]:
        """Divide un párrafo largo en chunks de oraciones."""
        sentences = self.SENTENCE_PATTERN.split(text)
        chunks: List[str] = []
        current: List[str] = []
        current_words = 0

        for sentence in sentences:
            sent_words = len(sentence.split())
            if current_words + sent_words > self.max_words and current:
                chunks.append(" ".join(current))
                current = [sentence]
                current_words = sent_words
            else:
                current.append(sentence)
                current_words += sent_words

        if current:
            chunks.append(" ".join(current))

        return chunks


# ================= EXTRACTOR DE NOTAS AL PIE =================

class FootnoteExtractor:
    """
    Responsabilidad única: extraer y limpiar notas al pie del texto.
    Separado de BookProcessor para cumplir SRP.
    """

    # Detecta [1], [2], etc. seguidos de contenido
    FOOTNOTE_PATTERN = re.compile(
        r'$$(\d+)$$\s*(.*?)(?=\s*$$\d+$$|\s*$)',
        re.DOTALL
    )

    @staticmethod
    def extract(text: str) -> Tuple[List[str], str]:
        """
        Extrae notas al pie y devuelve (notas, texto_limpio).
        Las notas se extraen del final del texto donde típicamente aparecen.
        """
        footnotes: List[str] = []

        # Buscar bloque de notas al pie al final del texto
        # Patrón: línea que empieza con [número]
        lines = text.split("\n")
        footnote_start = -1

        for i, line in enumerate(lines):
            stripped = line.strip()
            if re.match(r'^$$\d+$$', stripped):
                if footnote_start == -1:
                    footnote_start = i

        if footnote_start >= 0:
            footnote_lines = lines[footnote_start:]
            body_lines = lines[:footnote_start]

            for line in footnote_lines:
                match = re.match(r'^$$(\d+)$$\s*(.*)', line.strip())
                if match:
                    footnotes.append(f"[{match.group(1)}] {match.group(2)}")

            clean_text = "\n".join(body_lines).strip()
        else:
            clean_text = text.strip()

        return footnotes, clean_text


# ================= VALIDADOR ACADÉMICO =================

class AcademicValidator:
    """
    Valida la calidad de la traducción académica.
    Stateless: no mantiene estado entre validaciones.
    """

    BIBLICAL_PATTERN = re.compile(
        r'\b((?:\d\s+)?(?:Gen(?:esis)?|Exod(?:us)?|Lev(?:iticus)?|Num(?:bers)?|'
        r'Deut(?:eronomy)?|Josh(?:ua)?|Judg(?:es)?|(?:1|2)\s*Sam(?:uel)?|'
        r'(?:1|2)\s*Kings|(?:1|2)\s*Chr(?:on)?|Ezra|Neh(?:emiah)?|'
        r'Est(?:her)?|Job|Ps(?:alm)?s?|Prov(?:erbs)?|Eccl(?:esiastes)?|'
        r'Song(?:\s+of\s+(?:Solomon|Songs))?|Isa(?:iah)?|Jer(?:emiah)?|'
        r'Lam(?:entations)?|Ezek(?:iel)?|Dan(?:iel)?|Hos(?:ea)?|Joel|'
        r'Amos|Obad(?:iah)?|Jonah|Mic(?:ah)?|Nah(?:um)?|Hab(?:akkuk)?|'
        r'Zeph(?:aniah)?|Hag(?:gai)?|Zech(?:ariah)?|Mal(?:achi)?|'
        r'Matt(?:hew)?|Mark|Luke|John|Acts|Rom(?:ans)?|'
        r'(?:1|2)\s*Cor(?:inthians)?|Gal(?:atians)?|Eph(?:esians)?|'
        r'Phil(?:ippians)?|Col(?:ossians)?|(?:1|2)\s*Thess(?:alonians)?|'
        r'(?:1|2)\s*Tim(?:othy)?|Titus|Phlm|Philem(?:on)?|Heb(?:rews)?|'
        r'James|(?:1|2)\s*Pet(?:er)?|(?:1|2|3)\s*John|Jude|Rev(?:elation)?)'
        r'\.?\s+\d+[:：]\d+(?:\s*[-–]\s*\d+)?)',
        re.IGNORECASE
    )

    REQUIRED_TERMS: Dict[str, str] = {
        "justification": "justificación",
        "propitiation": "propiciación",
        "sanctification": "santificación",
        "atonement": "expiación",
        "redemption": "redención",
        "regeneration": "regeneración",
        "imputation": "imputación",
        "election": "elección",
        "predestination": "predestinación",
        "covenant": "pacto",
        "grace": "gracia",
    }

    ENGLISH_INDICATORS = (
        " the ", " and ", " is ", " are ", " was ", " were ",
        " that ", " which ", " this ", " with ",
    )

    def __init__(self, max_expansion: float = 1.15, min_expansion: float = 0.70):
        self.max_expansion = max_expansion
        self.min_expansion = min_expansion

    def validate(self, original: str, translated: str) -> List[str]:
        """Ejecuta todas las validaciones y devuelve lista de errores."""
        errors: List[str] = []

        self._validate_citations(original, translated, errors)
        self._validate_terminology(original, translated, errors)
        self._validate_expansion(original, translated, errors)
        self._validate_residual_english(translated, errors)
        self._validate_not_empty(translated, errors)

        return errors

    def _validate_citations(self, original: str, translated: str, errors: List[str]) -> None:
        orig_count = len(self.BIBLICAL_PATTERN.findall(original))
        trans_count = len(self.BIBLICAL_PATTERN.findall(translated))
        if orig_count > 0 and abs(orig_count - trans_count) > 1:
            errors.append(
                f"Citas bíblicas: original={orig_count}, traducido={trans_count}"
            )

    def _validate_terminology(self, original: str, translated: str, errors: List[str]) -> None:
        original_lower = original.lower()
        translated_lower = translated.lower()
        for eng, spa in self.REQUIRED_TERMS.items():
            if eng in original_lower and spa not in translated_lower:
                errors.append(f"Término '{eng}' no traducido como '{spa}'")

    def _validate_expansion(self, original: str, translated: str, errors: List[str]) -> None:
        if not original:
            return
        ratio = len(translated) / len(original)
        if ratio > self.max_expansion:
            errors.append(f"Expansión excesiva: {ratio:.0%} (límite {self.max_expansion:.0%})")
        elif ratio < self.min_expansion:
            errors.append(f"Contracción excesiva: {ratio:.0%} (mínimo {self.min_expansion:.0%})")

    def _validate_residual_english(self, translated: str, errors: List[str]) -> None:
        hits = sum(1 for ind in self.ENGLISH_INDICATORS if ind in translated.lower())
        if hits >= 5:
            errors.append(f"Posible texto en inglés sin traducir ({hits} indicadores)")

    def _validate_not_empty(self, translated: str, errors: List[str]) -> None:
        if not translated.strip():
            errors.append("Traducción vacía")
        elif len(translated.split()) < 5:
            errors.append("Traducción sospechosamente corta (< 5 palabras)")


# ================= SERVICIO AI CON RATE LIMITING =================

class RateLimiter:
    """
    Token bucket simple para respetar rate limits de la API.
    Evita el error 429 (Too Many Requests).
    """

    def __init__(self, requests_per_minute: int = 50):
        self.interval = 60.0 / max(requests_per_minute, 1)
        self._last_request: float = 0.0
        self._lock = asyncio.Lock()

    async def acquire(self) -> None:
        """Espera el tiempo necesario antes de hacer otra petición."""
        async with self._lock:
            now = time.monotonic()
            elapsed = now - self._last_request
            if elapsed < self.interval:
                await asyncio.sleep(self.interval - elapsed)
            self._last_request = time.monotonic()


class AIService:
    """
    Servicio de traducción con reintentos, backoff exponencial
    y rate limiting. Reutiliza la lógica probada del SubtitleTranslator.
    """

    def __init__(self, config: TranslatorConfig):
        if not config.api_key:
            raise RuntimeError("OPENAI_API_KEY no configurada")
        self.client = AsyncOpenAI(api_key=config.api_key)
        self.config = config
        self.rate_limiter = RateLimiter(config.requests_per_minute)
        self._total_tokens_used: int = 0

    @property
    def total_tokens_used(self) -> int:
        return self._total_tokens_used

    async def translate_section(self, text: str, context: TranslationContext) -> str:
        """Traduce una sección con reintentos, backoff y rate limiting."""
        user_prompt = self._build_prompt(text, context)

        for attempt in range(self.config.max_retries):
            try:
                await self.rate_limiter.acquire()

                res = await self.client.chat.completions.create(
                    model=self.config.model,
                    messages=[
                        {"role": "system", "content": self.config.system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=self.config.temperature,
                    max_tokens=self.config.max_tokens
                )

                # Trackear uso de tokens
                if res.usage:
                    self._total_tokens_used += res.usage.total_tokens

                result = res.choices[0].message.content.strip()
                result = self._clean_response(result)

                logger.info(
                    f"   ✅ Sección {context.section_index}/{context.total_sections} "
                    f"traducida ({len(result.split())} palabras)"
                )
                return result

            except Exception as e:
                delay = self.config.base_retry_delay * (2 ** attempt)
                logger.warning(
                    f"   Sección {context.section_index}: Error "
                    f"(intento {attempt + 1}/{self.config.max_retries}): {type(e).__name__}: {e}"
                )
                if attempt < self.config.max_retries - 1:
                    logger.info(f"   Reintentando en {delay:.0f}s...")
                    await asyncio.sleep(delay)
                else:
                    logger.error(f"   ❌ Sección {context.section_index}: Fallo definitivo")
                    return f"[TRADUCCIÓN FALLIDA]\n{text}"

        return f"[TRADUCCIÓN FALLIDA]\n{text}"  # Unreachable pero safe

    def _build_prompt(self, text: str, context: TranslationContext) -> str:
        """Construye el prompt de usuario con todo el contexto necesario."""
        parts = [
            f'Traduce el siguiente texto teológico del inglés al español de México.',
            f'',
            f'CONTEXTO: Libro "{context.book_title}", Capítulo "{context.chapter_title}" '
            f'({context.chapter_index}/{context.total_chapters}), '
            f'Sección {context.section_index}/{context.total_sections}',
        ]

        if context.memory_context:
            parts.append(f'\n{context.memory_context}')

        parts.append(f'\nTEXTO A TRADUCIR:\n{text}')

        return "\n".join(parts)

    @staticmethod
    def _clean_response(text: str) -> str:
        """Limpia artefactos markdown de la respuesta."""
        text = re.sub(r"^```\w*\n?", "", text, flags=re.MULTILINE)
        text = re.sub(r"\n?```$", "", text, flags=re.MULTILINE)
        # Quitar prefijos comunes del modelo
        text = re.sub(r"^(Here is the translation|Here's the translation|"
                       r"Traducción|Translation):?\s*\n?", "", text,
                       flags=re.IGNORECASE | re.MULTILINE)
        return text.strip()


# ================= PROCESADOR DE LIBROS =================

class BookProcessor:
    """
    Procesa un libro completo capítulo por capítulo.
    Coordina: splitting → traducción → validación → memoria → checkpoint.
    Todas las dependencias se inyectan (DIP).
    """

    def __init__(
        self,
        translator: TranslatorProtocol,
        splitter: SemanticSplitter,
        validator: ValidatorProtocol,
        footnote_extractor: FootnoteExtractor,
        memory: TranslationMemory,
        checkpoint_manager: Optional[CheckpointManager] = None,
        save_every: int = 1,
    ):
        self.translator = translator
        self.splitter = splitter
        self.validator = validator
        self.footnote_extractor = footnote_extractor
        self.memory = memory
        self.checkpoint_manager = checkpoint_manager
        self.save_every = save_every

    async def process_book(
        self,
        chapters: List[Chapter],
        book_title: str,
        resume_from: int = 0
    ) -> TranslatedBook:
        """Procesa todos los capítulos, con soporte de reanudación."""
        translated_chapters: List[TranslatedChapter] = []
        all_errors: List[str] = []

        total = len(chapters)
        start = resume_from

        if start > 0:
            logger.info(f"🔄 Reanudando desde capítulo {start + 1}/{total}")

        logger.info(f"📚 Procesando: '{book_title}' ({total - start} capítulos pendientes)")

        for i in range(start, total):
            chapter = chapters[i]
            logger.info(f"\n{'─' * 50}")
            logger.info(f"📖 Capítulo {i + 1}/{total}: '{chapter.title}' "
                         f"({chapter.word_count} palabras)")

            trans_chapter, chapter_errors = await self._process_chapter(
                chapter, book_title, total
            )
            translated_chapters.append(trans_chapter)
            all_errors.extend(chapter_errors)

            # Checkpoint
            if self.checkpoint_manager and (i + 1) % self.save_every == 0:
                self._save_checkpoint(book_title, i, total, translated_chapters)

        if all_errors:
            logger.warning(f"\n📋 Total incidencias: {len(all_errors)}")

        return TranslatedBook(
            title=book_title,
            source_language="en",
            target_language="es-MX",
            chapters=translated_chapters
        )

    async def _process_chapter(
        self,
        chapter: Chapter,
        book_title: str,
        total_chapters: int
    ) -> Tuple[TranslatedChapter, List[str]]:
        """Procesa un capítulo individual. Retorna capítulo traducido + errores."""
        sections_text = self.splitter.split(chapter.paragraphs)
        total_sections = len(sections_text)

        logger.info(f"   Dividido en {total_sections} secciones")

        # Traducir título
        title_context = TranslationContext(
            chapter_title=chapter.title,
            chapter_index=chapter.index + 1,
            total_chapters=total_chapters,
            section_index=0,
            total_sections=total_sections,
            memory_context="",
            book_title=book_title,
        )
        translated_title = await self.translator.translate_section(
            chapter.title, title_context
        )

        translated_sections: List[TranslationSection] = []
        chapter_errors: List[str] = []

        for j, section_text in enumerate(sections_text):
            context = TranslationContext(
                chapter_title=chapter.title,
                chapter_index=chapter.index + 1,
                total_chapters=total_chapters,
                section_index=j + 1,
                total_sections=total_sections,
                memory_context=self.memory.get_context_string(),
                book_title=book_title,
            )

            translated = await self.translator.translate_section(section_text, context)

            # Validar
            errors = self.validator.validate(section_text, translated)
            if errors:
                for err in errors:
                    logger.warning(f"   ⚠️  Sección {j + 1}: {err}")
                chapter_errors.extend(errors)

            # Actualizar memoria
            self.memory.learn_from_pair(section_text, translated)

            # Extraer notas al pie
            footnotes, clean_text = self.footnote_extractor.extract(translated)

            translated_sections.append(TranslationSection(
                heading=None,
                text=clean_text,
                footnotes=footnotes,
            ))

        if not chapter_errors:
            logger.info(f"   ✅ Capítulo validado sin incidencias")

        return TranslatedChapter(
            index=chapter.index,
            original_title=chapter.title,
            translated_title=translated_title,
            sections=translated_sections,
        ), chapter_errors

    def _save_checkpoint(
        self,
        book_name: str,
        last_index: int,
        total: int,
        chapters: List[TranslatedChapter]
    ) -> None:
        """Serializa progreso para reanudación."""
        if not self.checkpoint_manager:
            return

        chapters_data = []
        for ch in chapters:
            sections_data = []
            for sec in ch.sections:
                sections_data.append({
                    "heading": sec.heading,
                    "text": sec.text,
                    "footnotes": sec.footnotes,
                })
            chapters_data.append({
                "index": ch.index,
                "original_title": ch.original_title,
                "translated_title": ch.translated_title,
                "sections": sections_data,
            })

        self.checkpoint_manager.save_progress(
            book_name, last_index, total, chapters_data, self.memory
        )


# ================= EXPORTADOR DE LIBROS =================

class DocxBookExporter:
    """
    Exporta el libro traducido a DOCX preservando estilos.
    Implementa ExporterProtocol.
    """

    def export(self, book: TranslatedBook, output_path: Path) -> None:
        doc = Document()

        # ─── Portada ───
        doc.add_heading(book.title, 0)
        doc.add_paragraph(f"Traducción al español de México")
        doc.add_paragraph(
            f"Traducido de {book.source_language} a {book.target_language}"
        )
        doc.add_paragraph(
            "Traducción generada con asistencia de IA — Revisión humana obligatoria"
        )

        # ─── Índice ───
        doc.add_page_break()
        doc.add_heading("Índice", level=1)
        for ch in book.chapters:
            doc.add_paragraph(ch.translated_title, style="List Number")

        # ─── Contenido ───
        for ch in book.chapters:
            doc.add_page_break()
            doc.add_heading(ch.translated_title, level=1)

            for section in ch.sections:
                if section.heading:
                    doc.add_heading(section.heading, level=2)

                # Respetar párrafos separados por doble salto
                for para_text in section.text.split("\n\n"):
                    stripped = para_text.strip()
                    if stripped:
                        doc.add_paragraph(stripped)

                # Notas al pie
                if section.footnotes:
                    doc.add_paragraph("")  # Separador visual
                    for note in section.footnotes:
                        doc.add_paragraph(note, style="Footnote Text")

        # ─── Guardar ───
        output_path.parent.mkdir(parents=True, exist_ok=True)
        doc.save(output_path)
        logger.info(f"📗 Libro exportado: {output_path}")


# ================= PIPELINE PRINCIPAL (ORQUESTADOR) =================

class BookTranslationPipeline:
    """
    Orquestador principal que coordina todo el flujo.
    Composición clara: cada componente se inyecta, ninguno se crea internamente.
    """

    def __init__(
        self,
        config: TranslatorConfig,
        parser: BookParserProtocol,
        processor: BookProcessor,
        exporter: ExporterProtocol,
    ):
        self.config = config
        self.parser = parser
        self.processor = processor
        self.exporter = exporter

    async def process(self, input_path: Path) -> Optional[Path]:
        """Ejecuta el pipeline completo de 5 fases."""

        # ─── FASE 0: Validar configuración ───
        config_errors = self.config.validate()
        if config_errors:
            for err in config_errors:
                logger.error(f"❌ Configuración inválida: {err}")
            return None

        book_name = input_path.stem

        # ─── FASE 1: Ingesta ───
        logger.info(f"\n{'═' * 50}")
        logger.info(f"🔍 FASE 1 — INGESTA: {input_path.name}")
        logger.info(f"{'═' * 50}")

        try:
            chapters = self.parser.parse(input_path)
        except (ValueError, FileNotFoundError) as e:
            logger.error(f"❌ Error al parsear: {e}")
            return None

        book_title = chapters[0].title if chapters else book_name

        # ─── Verificar checkpoint ───
        resume_from = 0
        if self.processor.checkpoint_manager:
            checkpoint = self.processor.checkpoint_manager.load_progress(book_name)
            if checkpoint:
                resume_from = checkpoint["last_chapter_index"] + 1
                if resume_from >= len(chapters):
                    logger.info("✅ Traducción ya completada según checkpoint")
                    return None

                if getattr(self, 'auto_yes', False):
                    logger.info(f"🔄 Reanudando automáticamente desde el capítulo {resume_from}")
                else:
                    resp = input(
                        f"Se encontró progreso previo (hasta capítulo {resume_from}). "
                        f"¿Reanudar? (S/N): "
                    ).strip().upper()
                    if resp != "S":
                        resume_from = 0
                        self.processor.checkpoint_manager.clear(book_name)

        # ─── FASE 2: Pre-procesamiento ───
        logger.info(f"\n{'═' * 50}")
        logger.info(f"⚙️  FASE 2 — PRE-PROCESAMIENTO")
        logger.info(f"{'═' * 50}")
        total_words = sum(ch.word_count for ch in chapters)
        logger.info(f"   Palabras totales: {total_words}")
        logger.info(f"   Capítulos: {len(chapters)}")
        logger.info(f"   Chunk size: {self.config.chunk_size_words} palabras")
        logger.info(f"   Modelo: {self.config.model}")

        # ─── FASE 3: Traducción ───
        logger.info(f"\n{'═' * 50}")
        logger.info(f"🌐 FASE 3 — TRADUCCIÓN")
        logger.info(f"{'═' * 50}")

        start_time = time.time()

        translated_book = await self.processor.process_book(
            chapters, book_title, resume_from=resume_from
        )

        elapsed = time.time() - start_time

        # ─── FASE 4: Validación final ───
        logger.info(f"\n{'═' * 50}")
        logger.info(f"✅ FASE 4 — VALIDACIÓN FINAL")
        logger.info(f"{'═' * 50}")

        all_errors = self._final_validation(chapters, translated_book)

        if all_errors:
            report_path = input_path.with_name(f"{book_name}_VALIDACION.txt")
            report_content = (
                f"REPORTE DE VALIDACIÓN — {book_title}\n"
                f"{'=' * 50}\n\n"
                f"Total incidencias: {len(all_errors)}\n\n"
            )
            for i, err in enumerate(all_errors, 1):
                report_content += f"{i}. {err}\n"
            report_path.write_text(report_content, encoding="utf-8")
            logger.warning(f"   📋 Reporte: {report_path.name}")
        else:
            logger.info("   ✅ Sin incidencias")

        # ─── FASE 5: Exportación ───
        logger.info(f"\n{'═' * 50}")
        logger.info(f"📤 FASE 5 — EXPORTACIÓN")
        logger.info(f"{'═' * 50}")

        out_path = input_path.with_name(f"{book_name}_ES.docx")
        self.exporter.export(translated_book, out_path)

        # Limpiar checkpoint tras éxito
        if self.processor.checkpoint_manager:
            self.processor.checkpoint_manager.clear(book_name)

        # Resumen final
        tokens = self.processor.translator.total_tokens_used
        logger.info(f"\n{'═' * 50}")
        logger.info(f"✅ COMPLETADO")
        logger.info(f"   Archivo: {out_path.name}")
        logger.info(f"   Tiempo: {elapsed:.0f}s ({elapsed / 60:.1f} min)")
        logger.info(f"   Tokens usados: {tokens:,}")
        logger.info(f"   Capítulos traducidos: {len(translated_book.chapters)}")
        logger.info(f"{'═' * 50}")

        return out_path

    def _final_validation(
        self,
        original_chapters: List[Chapter],
        translated_book: TranslatedBook
    ) -> List[str]:
        """Ejecuta validación cruzando originales con traducciones."""
        errors: List[str] = []

        for orig, trans in zip(original_chapters, translated_book.chapters):
            orig_text = "\n".join(orig.paragraphs)
            trans_text = trans.full_text

            section_errors = self.processor.validator.validate(orig_text, trans_text)
            for err in section_errors:
                errors.append(f"Cap. {orig.index + 1} ('{orig.title}'): {err}")

        return errors


# ================= FACTORY (configura todo el grafo de dependencias) =================

class PipelineFactory:
    """
    Factory que construye el pipeline completo con todas sus dependencias.
    Único punto de configuración del sistema — facilita testing y cambios.
    """

    @staticmethod
    def create(
        config: Optional[TranslatorConfig] = None,
        checkpoint_dir: Optional[Path] = None
    ) -> BookTranslationPipeline:
        """Construye el pipeline con todas las dependencias inyectadas."""

        config = config or TranslatorConfig()

        # Validar configuración tempranamente
        config_errors = config.validate()
        if config_errors:
            raise ValueError(f"Configuración inválida: {'; '.join(config_errors)}")

        # Componentes
        parser = DocxBookParser()
        splitter = SemanticSplitter(max_words=config.chunk_size_words)
        validator = AcademicValidator(
            max_expansion=config.max_expansion_ratio,
            min_expansion=config.min_expansion_ratio,
        )
        footnote_extractor = FootnoteExtractor()
        memory = TranslationMemory()

        # Checkpoint (opcional)
        checkpoint_mgr = None
        if checkpoint_dir:
            checkpoint_mgr = CheckpointManager(checkpoint_dir)

        # Servicio AI
        translator = AIService(config)

        # Procesador de libros
        processor = BookProcessor(
            translator=translator,
            splitter=splitter,
            validator=validator,
            footnote_extractor=footnote_extractor,
            memory=memory,
            checkpoint_manager=checkpoint_mgr,
            save_every=config.save_checkpoint_every_n_chapters,
        )

        # Exportador
        exporter = DocxBookExporter()

        # Pipeline
        return BookTranslationPipeline(
            config=config,
            parser=parser,
            processor=processor,
            exporter=exporter,
        )


# ================= INTERFAZ CLI =================

class CLIApp:
    """Interfaz de línea de comandos robusta para la terminal."""

    def run(self):
        parser = argparse.ArgumentParser(
            description="Traductor de Libros y Documentos Teológicos DOCX (Inglés -> Español de México)"
        )
        parser.add_argument("file", nargs="?", help="Ruta al archivo .docx a traducir")
        parser.add_argument("--model", "-m", default="gpt-4o-mini", help="Modelo de OpenAI (default: gpt-4o-mini)")
        parser.add_argument("--chunk", "-c", type=int, default=2000, help="Tamaño de chunk en palabras (default: 2000)")
        parser.add_argument("--api-key", "-k", help="Clave API de OpenAI (o usar env OPENAI_API_KEY)")
        parser.add_argument("--yes", "-y", action="store_true", help="Omitir confirmaciones interactivas en terminal")

        args = parser.parse_args()

        print("═" * 55)
        print("  TRADUCTOR DE LIBROS Y DOCUMENTOS DOCX v2.1")
        print("  Inglés → Español (México) | Terminal CLI")
        print("═" * 55)

        # Cargar API Key
        api_key = (
            args.api_key or
            os.getenv("OPENAI_API_KEY") or
            os.getenv("VITE_OPENAI_API_KEY") or
            os.getenv("DEEP_API_KEY", "")
        )
        if not api_key:
            api_key = input("\n🔑 No se detectó OPENAI_API_KEY. Ingresa tu API Key de OpenAI: ").strip()

        # Configuración
        config = TranslatorConfig(
            api_key=api_key,
            model=args.model,
            chunk_size_words=args.chunk
        )

        # Seleccionar archivo
        path_str = args.file
        while not path_str:
            path_str = input("\n📄 Ingresa o arrastra la ruta del archivo .docx: ").strip().strip('"')

        target = Path(path_str)
        if not target.exists() or target.suffix.lower() != ".docx":
            logger.error(f"❌ El archivo no existe o no tiene extensión .docx: '{target}'")
            return

        # Confirmación
        print(f"\n  Documento:   {target.name}")
        print(f"  Ruta:        {target.absolute()}")
        print(f"  Modelo AI:   {config.model}")
        print(f"  Chunk size:  {config.chunk_size_words} palabras")
        print(f"  Checkpoints: ./checkpoints")

        if not args.yes:
            confirm = input("\n¿Iniciar traducción ahora? (S/N): ").strip().upper()
            if confirm != "S":
                print("Operación cancelada por el usuario.")
                return

        # Ejecutar pipeline
        checkpoint_dir = Path("./checkpoints")
        try:
            pipeline = PipelineFactory.create(
                config=config,
                checkpoint_dir=checkpoint_dir,
            )
            pipeline.auto_yes = args.yes
            asyncio.run(pipeline.process(target))
        except Exception as e:
            logger.error(f"❌ Error durante la traducción: {e}")


if __name__ == "__main__":
    CLIApp().run()
