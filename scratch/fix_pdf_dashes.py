import json
import re

def clean_spanish_text(text):
    if not isinstance(text, str):
        return text

    # Fix em-dash mismappings in Spanish words
    rules = [
        (r'Esp—ritu', 'Espíritu'),
        (r'esp—ritu', 'espíritu'),
        (r'visi—n', 'visión'),
        (r'visi—nes', 'visiones'),
        (r'ense—a', 'enseña'),
        (r'ense—an', 'enseñan'),
        (r'ense—anza', 'enseñanza'),
        (r'ense—anzas', 'enseñanzas'),
        (r'salvaci—n', 'salvación'),
        (r'teolog—a', 'teología'),
        (r'evang—lica', 'evangélica'),
        (r'evang—lico', 'evangélico'),
        (r'evang—licos', 'evangélicos'),
        (r'categor—a', 'categoría'),
        (r'podr—an', 'podrían'),
        (r'podr—a', 'podría'),
        (r'teol—gico', 'teológico'),
        (r'teol—gica', 'teológica'),
        (r'declaraci—n', 'declaración'),
        (r'asegurar—', 'asegurará'),
        (r'tendr—', 'tendrá'),
        (r' A—n', ' Aún'),
        (r' a—n', ' aún'),
        (r'—l ', 'él '),
        (r'—l,', 'él,'),
        (r'—l\.', 'él.'),
        (r'mayor—a', 'mayoría'),
        (r'te—logos', 'teólogos'),
        (r'Aqué ', 'Aquí '),
        (r'Aqu— ', 'Aquí '),
        (r'Depravaci—n', 'Depravación'),
        (r'gu—a', 'guía'),
        (r'Elecci—n', 'Elección'),
        (r'Expiaci—n', 'Expiación'),
        (r'muri—', 'murió'),
        (r'expi—', 'expió'),
        (r'posici—n', 'posición'),
        (r'posici—nes', 'posiciones'),
        (r'preocupaci—n', 'preocupación'),
        (r'rebeli—n', 'rebelión'),
        (r'V—A', 'VÍA'),
        (r'se—or', 'señor'),
        (r'Se—or', 'Señor'),
        (r'demonio—', 'demonio'),
        (r'art—culo', 'artículo'),
        (r'art—culos', 'artículos'),
        (r'cr—ticos', 'críticos'),
        (r'n—meros', 'números'),
        (r'—conos', 'íconos'),
        (r'—Qu—', '¿Qué'),
        (r'—Cu—l', '¿Cuál'),
        (r'—Cu—les', '¿Cuáles'),
        (r'—C—mo', '¿Cómo'),
        (r'—qu—', '¿qué'),
        (r'—qué', '¿qué'),
        (r'—quien', '¿quién'),
        (r'—dónde', '¿dónde'),
        (r'—cómo', '¿cómo'),
        (r'—cuál', '¿cuál'),
        (r'—cuántos', '¿cuántos'),
        (r'—cuánto', '¿cuánto'),
        (r'—\?', '?'),
        (r'—\s*\?', '?'),
        (r'—í', '?'),
        (r'—\s*í', '?'),
        (r'—', ' — '),
        (r'\s+', ' ')
    ]

    for pat, repl in rules:
        text = re.sub(pat, repl, text)

    # Clean up double spaces in HTML tags
    text = text.replace('<p> ', '<p>').replace(' </p>', '</p>')
    return text

def fix_obj(obj):
    if isinstance(obj, str):
        return clean_spanish_text(obj)
    elif isinstance(obj, list):
        return [fix_obj(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: fix_obj(v) for k, v in obj.items()}
    return obj

with open('data/books_store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

fixed_data = fix_obj(data)

with open('data/books_store.json', 'w', encoding='utf-8') as f:
    json.dump(fixed_data, f, ensure_ascii=False, indent=2)

print("PDF em-dashes and characters in data/books_store.json have been cleaned!")
