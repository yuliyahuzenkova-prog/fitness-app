# Liftbook roadmap

## Parked until we build the native phone app

### Automatic health and wearable sync
Remind the owner about this when we start building Liftbook as a native app (iOS / Android).

A web page can't read these sources, so for now Liftbook imports files instead
(Apple Health export.xml, Garmin/Whoop CSV, or numbers typed in on the Stats tab).

When we build the app:
1. **Apple Health (HealthKit)**: read steps, sleep, resting heart rate, active calories, heart rate during workouts; write finished workouts back.
2. **Health Connect (Android)**: the same data types.
3. **Garmin**: Garmin Connect Developer Program (Health API), needs a partner application and a small server.
4. **Whoop**: Whoop Developer Platform (OAuth), recovery, sleep, strain.

Keep the current data shape (`health.days["YYYY-MM-DD"] = { steps, sleep, rhr, kcal }`) so the
readiness check and charts keep working with synced data. Keep file import as a fallback.

## AI coach on the website version
The AI coach works only in the Claude version for now (it uses the viewer's Claude account).
To offer it on the Netlify website, add a small server function that holds an Anthropic API key
(never put the key in the HTML) and pays per use. Same prompt and workout format as `coachRules()`.
