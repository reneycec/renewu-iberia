import json
import re

def enrich_chapter_html(content):
    if not content:
        return content

    # Clean raw <p> wrappers if present
    raw = content.replace("<p>", "").replace("</p>", "\n\n")
    raw = raw.replace("&quot;", '"').replace("&amp;", '&').replace("&lt;", '<').replace("&gt;", '>')

    paragraphs = [p.strip() for p in raw.split("\n\n") if p.strip()]
    enriched_blocks = []

    i = 0
    while i < len(paragraphs):
        p = paragraphs[i]

        # 1. Detect Comparison Table (Calvinismo vs Arminianismo)
        if "Calvinismo" in p and "Arminianismo" in p and ("Fundador:" in p or "Denominaciones:" in p or "Depravación Total:" in p):
            table_html = """
<div class="my-6 overflow-hidden rounded-2xl border-2 border-[#D6B858]/60 shadow-lg bg-white dark:bg-gray-900">
  <div class="bg-[#1A1A19] text-[#D6B858] p-3 text-center font-extrabold uppercase tracking-widest text-xs border-b border-[#D6B858]/40">
    ⚖️ Cuadro Comparativo Teológico: Calvinismo vs Arminianismo
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-amber-200 dark:divide-amber-900/50 text-xs">
    <!-- Columna Calvinismo -->
    <div class="p-4 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
      <h4 class="font-black text-amber-900 dark:text-amber-300 text-sm border-b border-amber-200 pb-1 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-amber-600"></span> Calvinismo (Monergismo)
      </h4>
      <p><strong>Fundador:</strong> Juan Calvino (1509-1564)</p>
      <p><strong>Denominaciones:</strong> Presbiterianos, algunos Bautistas, Reformados.</p>
      <p><strong>Depravación Total:</strong> Las personas no pueden elegir a Dios. La voluntad de Dios solo determina la salvación.</p>
      <p><strong>Elección Incondicional:</strong> Dios elige a los salvos antes de la fundación del mundo sin base en respuesta humana.</p>
      <p><strong>Expiación Limitada:</strong> Jesús solo murió por los pecados de los elegidos.</p>
      <p><strong>Gracia Irresistible:</strong> El llamado de Dios a los elegidos no se puede rechazar.</p>
      <p><strong>Perseverancia:</strong> Las personas elegidas por Dios no pueden perderse jamás.</p>
    </div>
    <!-- Columna Arminianismo -->
    <div class="p-4 bg-yellow-50/30 dark:bg-yellow-950/20 space-y-3">
      <h4 class="font-black text-amber-800 dark:text-amber-200 text-sm border-b border-amber-200 pb-1 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#D6B858]"></span> Arminianismo (Sinergismo)
      </h4>
      <p><strong>Fundador:</strong> Jacobo Arminio (1560-1609)</p>
      <p><strong>Denominaciones:</strong> Metodistas, Iglesia Cristiana, Nazarenos, otros.</p>
      <p><strong>Depravación Total:</strong> Las personas necesitan al Espíritu Santo para responder a Dios por fe voluntaria.</p>
      <p><strong>Elección Condicional:</strong> Dios salva a quienes escuchan y responden al evangelio con fe perseverante.</p>
      <p><strong>Expiación Ilimitada:</strong> Jesús expió los pecados de toda la humanidad para quien crea.</p>
      <p><strong>Gracia Resistible:</strong> El Espíritu Santo atrae a todos, pero las personas pueden resistir su gracia.</p>
      <p><strong>Perseverancia por Fe:</strong> El creyente debe perseverar en fe activa para no apartarse.</p>
    </div>
  </div>
</div>"""
            enriched_blocks.append(table_html)
            i += 1
            continue

        # 2. Detect Chapter / Section Sub-Headings
        headings_keywords = [
            "UNA TERCERA VÍA: ENSEÑANZA FALSA PELIGROSA",
            "EL CREDO ARMINIANO, 1610",
            "MI OPINIÓN SOBRE EL CALVINISMO VERSUS ARMINIANISMO SOBRE LA APOSTASÍA",
            "Artículo 1.", "Artículo 2.", "Artículo 3.", "Artículo 4.", "Artículo 5.",
            "CAPÍTULO UNO", "CAPÍTULO DOS", "CAPÍTULO TRES", "CAPÍTULO CUATRO", "CAPÍTULO CINCO"
        ]
        is_heading = any(hk in p for hk in headings_keywords) or (p.isupper() and len(p) < 80)

        if is_heading:
            enriched_blocks.append(
                f'<h3 class="text-base md:text-lg font-extrabold text-[#1A1A19] dark:text-[#D6B858] border-l-4 border-[#D6B858] pl-3 py-1 my-4 bg-amber-500/10 rounded-r-xl shadow-2xs">{p}</h3>'
            )
            i += 1
            continue

        # 3. Detect Reflection Questions List
        if re.search(r'^\d+\.\s+¿', p) or "PREGUNTAS DE REFLEXIÓN" in p:
            if "PREGUNTAS DE REFLEXIÓN" in p:
                enriched_blocks.append(
                    f'<div class="my-4 p-3 bg-[#1A1A19] text-[#D6B858] font-bold text-xs uppercase tracking-widest rounded-xl text-center shadow-md">✍️ {p}</div>'
                )
            else:
                enriched_blocks.append(
                    f'<div class="my-2.5 p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs font-medium text-amber-950 dark:text-amber-100 flex items-start gap-2.5 shadow-xs"><span class="w-6 h-6 rounded-full bg-[#D6B858] text-[#1A1A19] font-black flex items-center justify-center shrink-0 text-[11px]">?</span><div>{p}</div></div>'
                )
            i += 1
            continue

        # 4. Detect Scripture Quote Callouts
        scripture_patterns = [r'Juan \d+', r'1 Juan \d+', r'Marcos \d+', r'Efesios \d+', r'Mateo \d+', r'Judas \d+', r'2 Pedro \d+', r'Génesis \d+']
        has_scripture = any(re.search(pat, p) for pat in scripture_patterns) and ('"' in p or '“' in p or ':' in p)

        if has_scripture and len(p) < 500:
            enriched_blocks.append(
                f'<blockquote class="my-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-[#D6B858] text-xs md:text-sm font-serif italic text-amber-950 dark:text-amber-100 shadow-xs space-y-1"><span class="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D6B858] block not-italic">📖 Pasaje Bíblico Destacado</span><p>{p}</p></blockquote>'
            )
            i += 1
            continue

        # 5. Detect Bullet List items
        if p.startswith("•") or p.startswith("- "):
            bullets = [b.strip() for b in p.split("\n") if b.strip()]
            list_items = "".join(f'<li class="flex items-start gap-2"><span class="text-[#D6B858] font-bold">•</span><span>{b.lstrip("•- ").strip()}</span></li>' for b in bullets)
            enriched_blocks.append(f'<ul class="my-3 space-y-1.5 text-xs text-gray-800 dark:text-gray-200 pl-2">{list_items}</ul>')
            i += 1
            continue

        # Default Standard Paragraph
        enriched_blocks.append(f'<p className="mb-4 leading-relaxed font-serif text-justify text-gray-900 dark:text-gray-100">{p}</p>')
        i += 1

    return "\n".join(enriched_blocks)


with open('data/books_store.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

for book in books:
    for chap in book.get('chapters', []):
        chap['content'] = enrich_chapter_html(chap.get('content', ''))

with open('data/books_store.json', 'w', encoding='utf-8') as f:
    json.dump(books, f, ensure_ascii=False, indent=2)

print("Rich HTML formatting applied to data/books_store.json!")
