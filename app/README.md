# Relief — застосунок для iPhone і Android

Це той самий Relief (`liftbook.html`), загорнутий у нативний застосунок за допомогою [Capacitor](https://capacitorjs.com). Код застосунку не дублюється: `npm run build` бере `standalone/index.html` і кладе його в `app/www/`, підмінивши three.js з інтернету на локальний файл. Застосунок працює без інтернету й сам нічого нікуди не надсилає.

- Bundle ID / applicationId: `com.betterfityou.relief` (міняється в `capacitor.config.json`, `ios/App/App.xcodeproj` і `android/app/build.gradle` — тільки **до** першого завантаження в магазин).
- iPhone, iOS 16.4+ (з цієї версії працює 3D-фігура), лише вертикально, без iPad.
- Android 7.0+ (API 24), лише вертикально.
- Плагіни: Filesystem + Share (резервна копія й картинки «Поділитися» через системне меню), StatusBar (колір статус-бару за темою), SplashScreen.
- Іконки й заставка згенеровані з `design/brand/` у `app/assets/` (`npx capacitor-assets generate --ios --android …`, див. нижче).

## Що встановити на Mac один раз

1. **Xcode** з App Store (безкоштовно), відкрий його раз і погодься з ліцензією.
2. **Node.js 22** — https://nodejs.org (LTS).
3. **Python 3** вже є на macOS (`python3 --version`); якщо ні — https://www.python.org.
4. **Android Studio** — https://developer.android.com/studio (лише для Android).
5. Склонуй репозиторій: `git clone https://github.com/yuliyahuzenkova-prog/fitness-app.git`

## Зібрати й запустити

```bash
cd fitness-app/app
npm ci            # перший раз і після оновлень package.json
npm run ios       # збирає веб-частину, синхронізує й відкриває Xcode
npm run android   # те саме для Android Studio
```

`npm run sync` — лише оновити веб-частину в обох проєктах (після кожної зміни `liftbook.html`).

## iPhone → App Store

1. У Xcode зліва вибери **App** → вкладка **Signing & Capabilities** → **Team**: свій акаунт розробника. Bundle Identifier — `com.betterfityou.relief`.
2. Підключи iPhone кабелем, вибери його вгорі й натисни ▶ — застосунок встановиться на телефон. (На телефоні: Налаштування → Конфіденційність і безпека → Режим розробника → увімкнути.)
3. На https://appstoreconnect.apple.com → **Apps** → **+** → **New App**: платформа iOS, назва, мова, Bundle ID `com.betterfityou.relief`, SKU (будь-який, напр. `relief-ios`).
   Назва в App Store має бути унікальною; якщо «Relief» зайнята — напр. «Relief: Strength & Posture».
4. У Xcode вгорі вибери **Any iOS Device (arm64)** → меню **Product → Archive**. Коли архів готовий — **Distribute App → App Store Connect → Upload**.
5. Через 10–30 хв збірка з'явиться в App Store Connect → **TestFlight**. Можна поставити собі через TestFlight і перевірити.
6. Заповни сторінку застосунку: опис, ключові слова, скріншоти (iPhone 6.9″: 1320 × 2868 або 1290 × 2796), **Privacy Policy URL**, **Support URL**, категорія **Health & Fitness**, вікова категорія.
7. **App Privacy** → «Data Not Collected»: Relief нічого не збирає, усе на пристрої.
8. Вибери збірку → **Add for Review** → **Submit**. Перевірка зазвичай 1–3 дні.

Кожна наступна версія: збільш **Build** (і за потреби **Version**) у Xcode → General, далі кроки 4–8.

## Android → Google Play

1. Акаунт розробника: https://play.google.com/console ($25 один раз). **Важливо:** нові особисті акаунти мають пройти закрите тестування — щонайменше 12 тестувальників упродовж 14 днів — перш ніж відкрити застосунок усім.
2. `npm run android` відкриє Android Studio. Перевір на телефоні (USB-налагодження) або в емуляторі: ▶.
3. **Build → Generate Signed App Bundle or APK → Android App Bundle** → створи новий ключ (keystore). **Збережи файл ключа й паролі в надійному місці і не клади їх у репозиторій** — без цього ключа не вийде оновити застосунок.
4. У Play Console: **Create app** → заповни **App content** (політика конфіденційності, Data safety: «No data collected», вікова категорія, цільова аудиторія), сторінку магазину (опис, іконка 512 × 512 — `design/brand/relief-icon-512.png`, банер 1024 × 500, скріншоти).
5. **Testing → Closed testing** → завантаж `.aab` → додай тестувальників → після 14 днів **Production**.

Кожна наступна версія: збільш `versionCode` (і `versionName`) у `android/app/build.gradle`, далі крок 3 і завантаження.

## Сторінка в App Store

- Тексти, URL, App Privacy, вікова категорія, примітка для рецензента — `app/store/app-store-listing.md` (англійською й українською).
- Скріншоти iPhone 6.9″ (1320 × 2868) — `app/store/screenshots/en/` і `uk/`, 01–07. Перезняти: `tools/anim-qa`: `node qa/storeshots.js en`, `node qa/storeshots.js uk`, потім `node qa/storeframes.js`.
- Політика конфіденційності, умови й підтримка — `standalone/privacy/`, `standalone/terms/`, `standalone/support/` (генерує `node tools/build-site-pages.js` з текстів застосунку). На Netlify завантажуй **усю папку `standalone`**, тоді працюють https://better-fit-you.netlify.app/privacy/ і /support/.
- Запити на камеру й фото перекладені на 7 мов: `ios/App/App/<мова>.lproj/InfoPlist.strings`.

## Іконки й заставка

Джерела — `app/assets/` (зроблені з `design/brand/relief-icon.svg`): `icon-only.png` (iOS), `icon-foreground.png` + `icon-background.png` (адаптивна іконка Android), `splash.png` / `splash-dark.png`. Після зміни знака:

```bash
npx capacitor-assets generate --ios --android --iconBackgroundColor '#111317' --iconBackgroundColorDark '#111317' --splashBackgroundColor '#111317' --splashBackgroundColorDark '#111317'
```
