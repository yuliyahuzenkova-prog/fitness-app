# Inserts the translation files from i18n/ into liftbook.html (between the i18n markers).
# Usage: python3 build-i18n.py   (then python3 build-standalone.py for the website file)
import os
here = os.path.dirname(os.path.abspath(__file__))
order = ["uk1.js", "uk2.js", "uk3.js", "uk-names.js", "uk-cues.js", "uk-guides1.js", "uk-guides2.js", "uk-guides3.js", "uk4.js", "uk-docs.js", "uk-rx.js", "uk-build.js"]
order += ["keys.js"] + sorted(f for f in os.listdir(os.path.join(here, "i18n")) if f.startswith("tr-"))
block = "\n".join(open(os.path.join(here, "i18n", f), encoding="utf-8").read().rstrip() for f in order)
path = os.path.join(here, "liftbook.html")
s = open(path, encoding="utf-8").read()
start, end = "// <i18n:start>", "// <i18n:end>"
a, b = s.index(start) + len(start), s.index(end)
s = s[:a] + "\n" + block + "\n" + s[b:]
open(path, "w", encoding="utf-8").write(s)
print("inserted", len(block), "characters of translations")
