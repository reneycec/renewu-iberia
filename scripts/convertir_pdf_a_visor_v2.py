#!/usr/bin/env python3
"""
convertir_pdf_a_visor_v2.py
===========================
Convierte archivos PDF en formato JSON/HTML listo para el visor de libros de RenewU.
Detecta capítulos automáticamente con patrones configurables.

INSTALACIÓN:
    pip install pdfplumber
"""

import json
import re
import sys
import argparse
import html

try:
    import pdfplumber
except ImportError:
    print("ERROR: pdfplumber no está instalado.")
    print("   Instálalo con: pip install pdfplumber")
    sys.exit(1)


# ===================== PATRONES PREDEFINIDOS =====================
PATRONES_PREDEFINIDOS = {
    "auto": None,
    "capitulo": r"^(Capitulo|CAPITULO|Capítulo|CAPÍTULO|Chapter|CHAPTER|Chapitre)\s*[IVX\d]+",
    "indice": r"^(Índice|INDICE|Índice General|ÍNDICE GENERAL|Tabla de Contenido|TABLA DE CONTENIDO|Tabla de Contenidos|TABLA DE CONTENIDOS|Contenido|CONTENIDO|contenido|Contenidos|CONTENIDOS|contenidos|Indice|indice)\b",
    "contenido": r"^(Contenido|CONTENIDO|contenido|Contenidos|CONTENIDOS|contenidos|Tabla de Contenido|TABLA DE CONTENIDO)\b",
    "unidad": r"^(Unidad|UNIDAD|Unit|UNIT|Unidade)\s*[IVX\d]+",
    "tema": r"^(Tema|TEMA|Topic|TOPIC|Tópico|Leccion|Lección|LESSON)\s*[IVX\d]+",
    "modulo": r"^(Modulo|Módulo|MODULE|Module|MODULO|MÓDULO)\s*[IVX\d]+",
    "seccion": r"^(Seccion|Sección|SECTION|Section|Seccao|SECCAO)\s*[IVX\d]+",
    "parte": r"^(Parte|PARTE|Part|PART|Partie|PARTIE)\s*[IVX\d]+",
    "numero_romano": r"^[IVX]+[\.\)\s]",
    "numero_arabigo": r"^\d+[\.\)\s][A-ZÁÉÍÓÚÑ]",
    "mayusculas": r"^[A-ZÁÉÍÓÚÑ\s]{10,60}$",
}


def extraer_texto_por_paginas(ruta_pdf):
    """Extrae el texto de cada página del PDF."""
    paginas = []
    with pdfplumber.open(ruta_pdf) as pdf:
        for i, pagina in enumerate(pdf.pages, start=1):
            texto = pagina.extract_text()
            if texto and texto.strip():
                paginas.append({
                    "numero": i,
                    "texto": texto.strip()
                })
    return paginas


def reparar_caracteres_espanol(texto):
    """Corrige mapeos erróneos de fuentes PDF donde acentos y eñes fueron reemplazados por em-dash o U+FFFD."""
    if not texto:
        return ""

    reemplazos = [
        (r'Esp—ritu', 'Espíritu'), (r'esp—ritu', 'espíritu'),
        (r'visi—n', 'visión'), (r'visi—nes', 'visiones'),
        (r'ense—a', 'enseña'), (r'ense—an', 'enseñan'), (r'ense—anza', 'enseñanza'), (r'ense—anzas', 'enseñanzas'),
        (r'salvaci—n', 'salvación'), (r'teolog—a', 'teología'),
        (r'evang—lica', 'evangélica'), (r'evang—lico', 'evangélico'), (r'evang—licos', 'evangélicos'),
        (r'categor—a', 'categoría'), (r'podr—an', 'podrían'), (r'podr—a', 'podría'),
        (r'teol—gico', 'teológico'), (r'teol—gica', 'teológica'), (r'declaraci—n', 'declaración'),
        (r'asegurar—', 'asegurará'), (r'tendr—', 'tendrá'), (r' A—n', ' Aún'), (r' a—n', ' aún'),
        (r'—l ', 'él '), (r'—l,', 'él,'), (r'—l\.', 'él.'), (r'mayor—a', 'mayoría'), (r'te—logos', 'teólogos'),
        (r'Aqué ', 'Aquí '), (r'Aqu— ', 'Aquí '), (r'Depravaci—n', 'Depravación'), (r'gu—a', 'guía'),
        (r'Elecci—n', 'Elección'), (r'Expiaci—n', 'Expiación'), (r'muri—', 'murió'), (r'expi—', 'expió'),
        (r'posici—n', 'posición'), (r'posici—nes', 'posiciones'), (r'preocupaci—n', 'preocupación'),
        (r'rebeli—n', 'rebelión'), (r'V—A', 'VÍA'), (r'se—or', 'señor'), (r'Se—or', 'Señor'),
        (r'art—culo', 'artículo'), (r'art—culos', 'artículos'), (r'cr—ticos', 'críticos'), (r'n—meros', 'números'),
        (r'—conos', 'íconos'), (r'—Qu—', '¿Qué'), (r'—Cu—l', '¿Cuál'), (r'—Cu—les', '¿Cuáles'), (r'—C—mo', '¿Cómo'),
        (r'—qu—', '¿qué'), (r'—qué', '¿qué'), (r'—quien', '¿quién'), (r'—dónde', '¿dónde'), (r'—cómo', '¿cómo'),
        (r'—cuál', '¿cuál'), (r'—cuántos', '¿cuántos'), (r'—cuánto', '¿cuánto'), (r'—\?', '?'), (r'—í', '?'),
    ]

    for pat, repl in reemplazos:
        texto = re.sub(pat, repl, texto)
    return texto


def remover_tabla_contenido_impresa(texto):
    """Remueve únicamente líneas aisladas de índice/tabla de contenidos sin eliminar el texto principal del libro."""
    if not texto:
        return ""

    lineas = texto.split('\n')
    lineas_limpias = []
    en_bloque_toc = False

    for linea in lineas:
        l_str = linea.strip()
        if re.match(r'^(CONTENIDO|ÍNDICE|CONTENTS|TABLE OF CONTENTS)\b', l_str, re.IGNORECASE):
            en_bloque_toc = True
            continue

        if en_bloque_toc:
            if re.search(r'\.{3,}\s*\d+$', l_str) or re.match(r'^(Capítulo|Chapter)\s+\d+.*?\d+$', l_str, re.IGNORECASE):
                continue
            else:
                en_bloque_toc = False

        lineas_limpias.append(linea)

    return '\n'.join(lineas_limpias).strip()


def limpiar_texto_para_html(texto):
    """Convierte texto plano a párrafos HTML sin alterar acentos ni caracteres en español."""
    if not texto:
        return ""

    texto = remover_tabla_contenido_impresa(texto)
    texto = reparar_caracteres_espanol(texto)
    lineas = texto.split('\n')
    parrafos = []
    parrafo_actual = []

    for linea in lineas:
        linea_limpia = linea.strip()
        if not linea_limpia:
            if parrafo_actual:
                parrafos.append(' '.join(parrafo_actual))
                parrafo_actual = []
        else:
            parrafo_actual.append(linea_limpia)

    if parrafo_actual:
        parrafos.append(' '.join(parrafo_actual))

    html_parrafos = []
    for p in parrafos:
        if p:
            p_safe = reparar_caracteres_espanol(p).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            html_parrafos.append(f"<p>{p_safe}</p>")

    return '\n'.join(html_parrafos)


def detectar_capitulos_con_patron(paginas, patron_regex, min_paginas_capitulo=1):
    """Detecta capítulos usando un patrón regex específico."""
    capitulos = []
    capitulo_actual = {
        "titulo": "Introducción",
        "paginas": [],
        "inicio": 1
    }

    for pagina in paginas:
        lineas = pagina["texto"].split('\n')
        primera_linea = lineas[0].strip() if lineas else ""

        es_capitulo = bool(re.search(patron_regex, primera_linea, re.IGNORECASE))

        if es_capitulo and capitulo_actual["paginas"]:
            if len(capitulo_actual["paginas"]) >= min_paginas_capitulo:
                capitulos.append(capitulo_actual)

            capitulo_actual = {
                "titulo": primera_linea,
                "paginas": [pagina],
                "inicio": pagina["numero"]
            }
        else:
            capitulo_actual["paginas"].append(pagina)

    if capitulo_actual["paginas"]:
        capitulos.append(capitulo_actual)

    return capitulos


def detectar_mejor_patron(paginas):
    """Prueba todos los patrones y elige el mejor."""
    mejores_resultados = []

    for nombre, patron in PATRONES_PREDEFINIDOS.items():
        if patron is None:
            continue
        try:
            caps = detectar_capitulos_con_patron(paginas, patron, min_paginas_capitulo=1)
            if len(caps) >= 2:
                promedio_paginas = sum(len(c["paginas"]) for c in caps) / len(caps)
                mejores_resultados.append({
                    "patron": nombre,
                    "regex": patron,
                    "capitulos": len(caps),
                    "promedio": promedio_paginas,
                    "resultados": caps
                })
        except Exception:
            continue

    if not mejores_resultados:
        return None, None

    mejores_resultados.sort(key=lambda x: (x["capitulos"], x["promedio"]), reverse=True)

    mejor = mejores_resultados[0]
    return mejor["regex"], mejor["resultados"]


def dividir_en_capitulos(paginas, num_capitulos):
    """Divide el libro en N capítulos aproximadamente iguales."""
    total = len(paginas)
    por_capitulo = max(1, total // num_capitulos)

    capitulos = []
    for i in range(num_capitulos):
        inicio = i * por_capitulo
        fin = inicio + por_capitulo if i < num_capitulos - 1 else total
        paginas_capitulo = paginas[inicio:fin]

        lineas = paginas_capitulo[0]["texto"].split('\n') if paginas_capitulo else ["Capítulo"]
        titulo_candidato = lineas[0].strip()[:80]

        texto_completo = "\n".join(p["texto"] for p in paginas_capitulo)

        capitulos.append({
            "titulo": titulo_candidato or f"Capítulo {i + 1}",
            "texto": texto_completo,
            "pagina_inicio": paginas_capitulo[0]["numero"] if paginas_capitulo else 1
        })

    return capitulos


def convertir_a_json(ruta_pdf, titulo_libro="Libro", autor="Autor", year="2026",
                     num_capitulos=5, patron_nombre="auto", patron_custom=None,
                     min_paginas=1):
    """Convierte el PDF al formato JSON del visor."""
    paginas = extraer_texto_por_paginas(ruta_pdf)

    capitulos_raw = []
    patron_usado = None

    if patron_custom:
        try:
            capitulos_raw = detectar_capitulos_con_patron(paginas, patron_custom, min_paginas)
            patron_usado = patron_custom
        except re.error:
            capitulos_raw = dividir_en_capitulos(paginas, num_capitulos)
    elif patron_nombre in PATRONES_PREDEFINIDOS and patron_nombre != "auto":
        patron = PATRONES_PREDEFINIDOS[patron_nombre]
        capitulos_raw = detectar_capitulos_con_patron(paginas, patron, min_paginas)
        patron_usado = patron
    else:
        patron_usado, capitulos_raw = detectar_mejor_patron(paginas)
        if not capitulos_raw or len(capitulos_raw) < 2:
            capitulos_raw = dividir_en_capitulos(paginas, num_capitulos)
            patron_usado = "division_manual"

    capitulos = []
    for i, cap in enumerate(capitulos_raw):
        if "paginas" in cap:
            texto_completo = "\n".join(p["texto"] for p in cap["paginas"])
            titulo = cap["titulo"]
        else:
            texto_completo = cap["texto"]
            titulo = cap["titulo"]

        contenido_html = limpiar_texto_para_html(texto_completo)

        capitulos.append({
            "title": titulo or f"Capítulo {i + 1}",
            "content": contenido_html
        })

    libro_json = {
        "title": titulo_libro,
        "author": autor,
        "year": year,
        "pages": capitulos
    }

    return libro_json, patron_usado


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    parser = argparse.ArgumentParser(
        description="Convierte un PDF al formato del visor de libros"
    )
    parser.add_argument("pdf", help="Ruta al archivo PDF")
    parser.add_argument("--titulo", "-t", default="Mi Libro", help="Título del libro")
    parser.add_argument("--autor", "-a", default="Autor Desconocido", help="Autor del libro")
    parser.add_argument("--year", "-y", default="2026", help="Año de publicación")
    parser.add_argument("--patron", "-p", default="auto", choices=list(PATRONES_PREDEFINIDOS.keys()))
    parser.add_argument("--custom", "-c", default=None)
    parser.add_argument("--capitulos", "-n", type=int, default=5)
    parser.add_argument("--min-paginas", "-m", type=int, default=1)
    parser.add_argument("--modo", choices=["auto", "manual"], default="auto")
    parser.add_argument("--output", "-o", default=None)

    args = parser.parse_args()

    if args.modo == "manual":
        args.patron = "auto"
        args.custom = None

    libro, patron_usado = convertir_a_json(
        args.pdf,
        titulo_libro=args.titulo,
        autor=args.autor,
        year=args.year,
        num_capitulos=args.capitulos,
        patron_nombre=args.patron,
        patron_custom=args.custom,
        min_paginas=args.min_paginas
    )

    if args.output:
        output_file = args.output
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(libro, f, ensure_ascii=False, indent=2)
    else:
        # Print directly to stdout for server process capture
        print(json.dumps(libro, ensure_ascii=False))


if __name__ == "__main__":
    main()
