import json
import re

def clean_toc_from_chapter(content):
    if not content:
        return content

    # Regex pattern to match CONTENIDO / ÍNDICE table blocks with chapter titles and page numbers
    toc_pattern = r'\s*CONTENIDO\s+Capítulo\s+1\s+.*?(?:Notas al pie\s+\d+|Apéndice.*?\d+)'
    cleaned = re.sub(toc_pattern, '', content, flags=re.DOTALL | re.IGNORECASE)

    # Fallback pattern for INDICE / TABLA DE CONTENIDO blocks
    toc_pattern_2 = r'\s*(?:CONTENIDO|ÍNDICE|TABLA DE CONTENIDOS)\s+Cap[íi]tulo\s+1\b.*?\d+'
    cleaned = re.sub(toc_pattern_2, '', cleaned, flags=re.DOTALL | re.IGNORECASE)

    return cleaned.strip()

with open('data/books_store.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

for book in books:
    if book.get('chapters') and len(book['chapters']) > 0:
        first_chap = book['chapters'][0]
        if first_chap.get('content'):
            first_chap['content'] = clean_toc_from_chapter(first_chap['content'])

with open('data/books_store.json', 'w', encoding='utf-8') as f:
    json.dump(books, f, ensure_ascii=False, indent=2)

print("Printed TOC table stripped successfully from data/books_store.json!")
