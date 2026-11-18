# Wraps liftbook.html in a full HTML page so it runs on any website (outside Claude).
# Usage: python3 build-standalone.py  →  writes standalone/index.html
import os
src = open(os.path.join(os.path.dirname(__file__), "liftbook.html")).read()
import base64
_b = lambda f: base64.b64encode(open(os.path.join(os.path.dirname(__file__), "design", "brand", f), "rb").read()).decode()
ICONS = (f'<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,{_b("relief-favicon.svg")}">\n'
         f'<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,{_b("relief-favicon-32.png")}">\n'
         f'<link rel="apple-touch-icon" href="data:image/png;base64,{_b("relief-icon-180.png")}">\n')  # the Relief mark (design/brand/)
head = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#111317">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Relief">
'''+ICONS+'''
<style>:root{color-scheme:dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,-apple-system,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
'''
os.makedirs(os.path.join(os.path.dirname(__file__), "standalone"), exist_ok=True)
open(os.path.join(os.path.dirname(__file__), "standalone", "index.html"), "w").write(head + src + "\n</body>\n</html>\n")
print("wrote standalone/index.html")
