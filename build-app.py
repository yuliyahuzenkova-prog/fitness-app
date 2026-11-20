# Builds the web part of the native app (iOS / Android, Capacitor) from standalone/index.html.
# Usage (from app/): npm run build   →  writes app/www/index.html and app/www/three.min.js
# The only change from the website: three.js is a local file instead of the jsDelivr CDN, so the app
# works offline and makes no network requests of its own. Everything else (IN_APP, nativeSave,
# nativeTheme) is decided at run time in liftbook.html.
import os, shutil, sys
root = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(root, "standalone", "index.html"), encoding="utf-8").read()
CDN = '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"></script>'
if src.count(CDN) != 1:
    sys.exit("build-app.py: the three.js script tag changed; update CDN here and the version in app/package.json")
three = os.path.join(root, "app", "node_modules", "three", "build", "three.min.js")
if not os.path.exists(three):
    sys.exit("build-app.py: run `npm install` in app/ first")
www = os.path.join(root, "app", "www")
os.makedirs(www, exist_ok=True)
shutil.copyfile(three, os.path.join(www, "three.min.js"))
out = src.replace(CDN, '<script src="three.min.js"></script>')
# the website's "add to home screen" tags mean nothing inside the app
out = "\n".join(l for l in out.split("\n") if "apple-mobile-web-app" not in l)
open(os.path.join(www, "index.html"), "w", encoding="utf-8").write(out)
print("wrote app/www/index.html and app/www/three.min.js")
