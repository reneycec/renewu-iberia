import json
import re

REPL_MAP = [
    (r"Introducci[\ufffd\?\uFFFD]n", "Introducción"),
    (r"Salvaci[\ufffd\?\uFFFD]n", "Salvación"),
    (r"Cuesti[\ufffd\?\uFFFD]n", "Cuestión"),
    (r"Gu[\ufffd\?\uFFFD]a", "Guía"),
    (r"Discusi[\ufffd\?\uFFFD]n", "Discusión"),
    (r"informaci[\ufffd\?\uFFFD]n", "información"),
    (r"electr[\ufffd\?\uFFFD]nico", "electrónico"),
    (r"b[\ufffd\?\uFFFD]blicas", "bíblicas"),
    (r"b[\ufffd\?\uFFFD]blica", "bíblica"),
    (r"b[\ufffd\?\uFFFD]blico", "bíblico"),
    (r"Versi[\ufffd\?\uFFFD]n", "Versión"),
    (r"Traducci[\ufffd\?\uFFFD]n", "Traducción"),
    (r"direcci[\ufffd\?\uFFFD]n", "dirección"),
    (r"im[\ufffd\?\uFFFD]genes", "imágenes"),
    (r"rese[\ufffd\?\uFFFD]as", "reseñas"),
    (r"Cap[\ufffd\?\uFFFD]tulo", "Capítulo"),
    (r"CAP[\ufffd\?\uFFFD]TULO", "CAPÍTULO"),
    (r"ense[\ufffd\?\uFFFD]anzas", "enseñanzas"),
    (r"ense[\ufffd\?\uFFFD]a", "enseña"),
    (r"Jes[\ufffd\?\uFFFD]s", "Jesús"),
    (r"conversi[\ufffd\?\uFFFD]n", "conversión"),
    (r"est[\ufffd\?\uFFFD]", "está"),
    (r"realizaci[\ufffd\?\uFFFD]n", "realización"),
    (r" a trav[\ufffd\?\uFFFD]s", " a través"),
    (r"posici[\ufffd\?\uFFFD]n", "posición"),
    (r"teolog[\ufffd\?\uFFFD]a", "teología"),
    (r"evang[\ufffd\?\uFFFD]lica", "evangélica"),
    (r"m[\ufffd\?\uFFFD]s", "más"),
    (r"tambi[\ufffd\?\uFFFD]n", "también"),
    (r"as[\ufffd\?\uFFFD]", "así"),
    (r"s[\ufffd\?\uFFFD]", "sí"),
    (r"relaci[\ufffd\?\uFFFD]n", "relación"),
    (r"comuni[\ufffd\?\uFFFD]n", "comunión"),
    (r"coraz[\ufffd\?\uFFFD]n", "corazón"),
    (r"se[\ufffd\?\uFFFD]alado", "señalado"),
    (r"naci[\ufffd\?\uFFFD]n", "nación"),
    (r"bendici[\ufffd\?\uFFFD]n", "bendición"),
    (r"d[\ufffd\?\uFFFD]a", "día"),
    (r"d[\ufffd\?\uFFFD]as", "días"),
    (r"qui[\ufffd\?\uFFFD]n", "quién"),
    (r"qu[\ufffd\?\uFFFD]", "qué"),
    (r"qu[\ufffd\?\uFFFD] pasa", "qué pasa"),
    (r"c[\ufffd\?\uFFFD]mo", "cómo"),
    (r"d[\ufffd\?\uFFFD]nde", "dónde"),
    (r"cu[\ufffd\?\uFFFD]l", "cuál"),
    (r"cu[\ufffd\?\uFFFD]les", "cuáles"),
    (r"cu[\ufffd\?\uFFFD]ndo", "cuándo"),
    (r"cu[\ufffd\?\uFFFD]nto", "cuánto"),
    (r"cu[\ufffd\?\uFFFD]ntos", "cuántos"),
    (r"[\ufffd\?\uFFFD]Pueden", "¿Pueden"),
    (r"[\ufffd\?\uFFFD]Estamos", "¿Estamos"),
    (r"[\ufffd\?\uFFFD]Puede", "¿Puede"),
    (r"[\ufffd\?\uFFFD]Ense", "¿Ense"),
    (r"[\ufffd\?\uFFFD]C", "¿C"),
    (r"[\ufffd\?\uFFFD]P", "¿P"),
    (r"[\ufffd\?\uFFFD]E", "¿E"),
    (r"[\ufffd\?\uFFFD]Q", "¿Q"),
    (r"[\ufffd\?\uFFFD]", "—"),
]

def fix_text(text):
    if not isinstance(text, str):
        return text
    for pattern, repl in REPL_MAP:
        text = re.sub(pattern, repl, text)
    return text

def fix_obj(obj):
    if isinstance(obj, str):
        return fix_text(obj)
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

print("data/books_store.json has been repaired!")
