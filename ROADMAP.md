# Liftbook roadmap

## Native app: after the first release (v1 ships without these — owner decision, v365)

### Automatic health and wearable sync
The native app now exists (app/, Capacitor). Raise this with the owner once v1 is in the stores.

A web page can't read these sources, so for now Liftbook imports files instead
(Apple Health export.xml, Garmin/Whoop CSV, or numbers typed in on the Stats tab).

When we build the app:
1. **Apple Health (HealthKit)**: read steps, sleep, resting heart rate, active calories, heart rate during workouts; write finished workouts back.
2. **Health Connect (Android)**: the same data types.
3. **Garmin**: Garmin Connect Developer Program (Health API), needs a partner application and a small server.
4. **Whoop**: Whoop Developer Platform (OAuth), recovery, sleep, strain.

Keep the current data shape (`health.days["YYYY-MM-DD"] = { steps, sleep, rhr, kcal }`) so the
readiness check and charts keep working with synced data. Keep file import as a fallback.

### Apple Watch companion (owner agreed: after v1, together with Apple Health)
A watch app can't reuse the web code: it is a separate native watchOS app (SwiftUI) that talks to
the phone app over WatchConnectivity, added as a watchOS target to `app/ios`. Build it in the same
release as HealthKit, since heart rate and saving workouts to Apple Health are the same work.
1. **Current exercise and set** on the wrist; mark a set done with one tap (syncs back to the phone's log).
2. **Rest timer** with a haptic tap when rest is over, so the phone can stay in the bag.
3. **Heart rate during the workout** (HKWorkoutSession) and the finished workout saved to Apple Health.
Keep the phone as the source of truth: the watch only shows the current workout and sends set results.
Install the watchOS platform in Xcode (Settings → Components) only when this work starts.

## AI coach on the website version
The AI coach works only in the Claude version for now (it uses the viewer's Claude account).
To offer it on the Netlify website, add a small server function that holds an Anthropic API key
(never put the key in the HTML) and pays per use. Same prompt and workout format as `coachRules()`.
