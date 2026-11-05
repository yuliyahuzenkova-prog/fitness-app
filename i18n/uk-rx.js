// Pattern rules for text that contains numbers, names or dates
const ukPl = (n, one, few, many) => { const a = Math.abs(n), i = Math.floor(a); if (a !== i) return few; const t = i % 100, u = i % 10; return t > 10 && t < 20 ? many : u === 1 ? one : u >= 2 && u <= 4 ? few : many; };
const UNIT_UK = { kg: "кг", lb: "фунт", cm: "см", in: "дюйм", s: "с", min: "хв", h: "год", bpm: "уд/хв", kcal: "ккал", reps: "повт.", workouts: "трен.", years: "років", steps: "кроків" };
const unitify = (s) => s.replace(/(\d)\s?(kg|lb|cm|in|s|min|h|bpm|kcal|reps|workouts|years)(?![A-Za-z])/g, (m, d, u) => `${d} ${UNIT_UK[u]}`);
const TTl = (x) => { for (const k of PAIN_AREAS) if (k.toLowerCase() === x.toLowerCase()) return TT(k).toLowerCase(); return TT(x); };
const workoutsUk = (n) => `${n} ${ukPl(+n, "тренування", "тренування", "тренувань")}`;
const daysUk = (n) => `${n} ${ukPl(+n, "день", "дні", "днів")}`;
const weeksUk = (n) => `${n} ${ukPl(+n, "тиждень", "тижні", "тижнів")}`;
const DAYS_RX = "Mon|Tue|Wed|Thu|Fri|Sat|Sun";
const FELT_UK = { "too easy": "занадто легко", "just right": "саме те", "too hard": "занадто важко" };
const LOWS_UK = { "low energy": "низька енергія", "poor sleep": "поганий сон", "high stress": "високий стрес", "very sore muscles": "сильний біль у м'язах", "low motivation": "низька мотивація" };
const BADGE_UK = (b) => {
  let m;
  if ((m = b.match(/^(\d+) workouts$/))) return workoutsUk(m[1]);
  if ((m = b.match(/^(\d+)-week streak$/))) return `${weeksUk(m[1])} поспіль`;
  if ((m = b.match(/^(\d+) records$/))) return `${m[1]} ${ukPl(+m[1], "рекорд", "рекорди", "рекордів")}`;
  if ((m = b.match(/^Finished Phase (\d)$/))) return `Завершено фазу ${m[1]}`;
  return { "First workout": "Перше тренування", "First record": "Перший рекорд", "Finished the plan": "План завершено" }[b] || b;
};
const ITEM_UK = (p) => { let m; if (p in UK) return UK[p]; if ((m = p.match(/^(.+) \((.+)\)$/)) && (m[1] in UK || m[2] in UK)) return `${TT(m[1])} (${TT(m[2])})`; return null; };
Object.assign(UK, {
  "Today's workout is done ✓": "Сьогоднішнє тренування виконано ✓", "Today is a move day": "Сьогодні день руху", "Today is a rest day": "Сьогодні день відпочинку",
  "lighter week": "легший тиждень", "lighter: your last 2 workouts felt too hard": "легше: останні 2 тренування були занадто важкими", "lighter: from your check-in": "легше: за твоєю перевіркою",
  "Answer a few questions about your goal, experience, equipment, schedule and injuries, and get a personal plan right away. It takes about 3 minutes.": "Дай відповідь на кілька запитань про мету, досвід, інвентар, розклад і травми та одразу отримай персональний план. Це займе близько 3 хвилин.",
  "Based on your last 4 days of workouts. Muscles need about 48 hours to recover after hard training.": "На основі тренувань за останні 4 дні. М'язам потрібно близько 48 годин, щоб відновитися після важкого тренування.",
  "Optional, but the best way to see changes the scale misses. Redo them at the end of each plan phase (every 6 weeks).": "Необов'язково, але це найкращий спосіб побачити зміни, які не показують ваги. Повторюй наприкінці кожної фази плану (кожні 6 тижнів).",
  "Total weight lifted each week (sets × reps × kg). Going up over time means you're getting stronger.": "Загальна піднята вага щотижня (підходи × повторення × кг). Якщо вона росте — ти сильнішаєш.",
  "Total weight lifted each week (sets × reps × lb). Going up over time means you're getting stronger.": "Загальна піднята вага щотижня (підходи × повторення × фунти). Якщо вона росте — ти сильнішаєш.",
  "Try 1–2 more reps.": "Спробуй на 1–2 повторення більше.", "Try holding 5 s longer.": "Спробуй утримати на 5 с довше.",
  "Long term · 6 months": "Довгий термін · 6 місяців", "Language": "Мова",
});
UK_RX.push(
  [/^Animation of (.+)$/, (m) => `Анімація: ${TT(m[1])}`],
  [/^How to do (.+)$/, (m) => `Як виконувати: ${TT(m[1])}`],
  [/^Start anyway: (.+)$/, (m) => `Все одно почати: ${TT(m[1])}`],
  [/^Start ((?:Full|Upper|Lower) body [ABC]|Day [AB])$/, (m) => `Почати: ${TT(m[1])}`],
  [/^Do (.+) instead$/, (m) => `Зробити «${TT(m[1])}» натомість`],
  [new RegExp(`^(${DAYS_RX}): (.+)\\. Tap to change\\.$`), (m) => `${TT(m[1])}: ${TT(m[2])}. Торкнись, щоб змінити.`],
  [/^(.+): choose$/, (m) => `${m[1].replace(new RegExp(`^(${DAYS_RX})`), (d) => TT(d))}: вибери`],
  [/^⚠️ (.+)$/, (m) => `⚠️ ${trCore(m[1]) ?? m[1]}`],
  [/^([☆★]) (.+)$/, (m) => `${m[1]} ${BADGE_UK(m[2])}`],
  [/^(\d+) of (\d+) workouts$/, (m) => `${m[1]} з ${workoutsUk(m[2])}`],
  [/^(\d+) of (\d+)$/, (m) => `${m[1]} з ${m[2]}`],
  [/^Step (\d+) of (\d+)$/, (m) => `Крок ${m[1]} з ${m[2]}`],
  [/^Set (\d+)$/, (m) => `Підхід ${m[1]}`],
  [/^Phase (\d)$/, (m) => `Фаза ${m[1]}`],
  [/^Weeks (\d+)–(\d+)$/, (m) => `Тижні ${m[1]}–${m[2]}`],
  [/^Week (\d+)( · lighter)?$/, (m) => `Тиждень ${m[1]}${m[2] ? " · легший" : ""}`],
  [/^Week (\d+), this week$/, (m) => `Тиждень ${m[1]}, цей тиждень`],
  [/^e\.g\. ([\d.]+)$/, (m) => `напр. ${m[1].replace(".", ",")}`],
  [/^Type your weight first, like (.+)\.$/, (m) => `Спершу впиши вагу, наприклад ${m[1].replace(".", ",")}.`],
  [/^Week (\d+) of (\d+)$/, (m) => `Тиждень ${m[1]} з ${m[2]}`],
  [/^Shorter term · Week (\d+) of this phase$/, (m) => `Короткий термін · Тиждень ${m[1]} цієї фази`],
  [/^Short term · Phase (\d) of (\d) · (\d+) weeks$/, (m) => `Короткий термін · Фаза ${m[1]} з ${m[2]} · ${weeksUk(m[3])}`],
  [/^Your plan · (\d+) weeks$/, (m) => `Твій план · ${weeksUk(m[1])}`],
  [/^(\d+) sets × (.+) reps$/, (m) => `${m[1]} ${ukPl(+m[1], "підхід", "підходи", "підходів")} × ${m[2]} повт.`],
  [/^Phase (\d) (\S+) · Week (\d+)( \(lighter\))?$/, (m) => `Фаза ${m[1]} ${TT(m[2])} · Тиждень ${m[3]}${m[4] ? " (легший)" : ""}`],
  [/^Phase (\d) · Week (\d+)(?: \((.+?)\))? · (Gym|Home)( · quick version)?$/, (m) => `Фаза ${m[1]} · Тиждень ${m[2]}${m[3] ? ` (${TT(m[3])})` : ""} · ${TT(m[4])}${m[5] ? " · скорочена версія" : ""}`],
  [/^Restart plan from week 1$/, () => "Почати план з 1-го тижня"],
  [/^Tap again to restart from week 1$/, () => "Торкнись ще раз, щоб почати з 1-го тижня"],
  [/^Today · (.+)$/, (m) => `Сьогодні · ${TT(m[1])}`],
  [/^(Today's workout is done ✓|Today is a move day|Today is a rest day) · Next workout: (.+)$/, (m) => `${TT(m[1])} · Наступне тренування: ${m[2] === "next week" ? "наступного тижня" : TT(m[2])}`],
  [/^Next up · (.+)$/, (m) => `Далі · ${TT(m[1])}`],
  [/^Day ([AB]) · (.+)$/, (m) => `День ${m[1]} · ${TT(m[2])}`],
  [/^(.+) · Day ([AB])$/, (m) => `${TT(m[1])} · День ${m[2]}`],
  [/^(.+), in turn$/, (m) => `${m[1].split(", ").map(TT).join(", ")} по черзі`],
  [/^(.+) · this week$/, (m) => `${m[1]} · цей тиждень`],
  [/^Week 1 starts this week, on Monday (.+)\. Have a look through the plan first\.$/, (m) => `Тиждень 1 починається цього тижня, у понеділок ${m[1]}. Спершу переглянь план.`],
  [/^(\d+) strength workouts?(?: and (\d+) move days?)? a week, (\d+) minutes each\. Built from your profile, so it updates when you edit your answers\.$/,
    (m) => `${m[1]} ${ukPl(+m[1], "силове тренування", "силові тренування", "силових тренувань")}${m[2] ? ` і ${daysUk(m[2])} руху` : ""} на тиждень, по ${m[3]} хв. План створено з твого профілю, тож він оновлюється, коли ти змінюєш відповіді.`],
  [/^Your other activities \((.+)\) fit on move or rest days\. Avoid a hard lower-body workout the day before a long session\.$/,
    (m) => `Твої інші активності (${m[1].split(", ").map(TT).join(", ")}) добре лягають на дні руху або відпочинку. Уникай важкого тренування ніг напередодні довгого заняття.`],
  [/^30–45 minutes of something easy and fun: (?:(.+), or a |a )brisk walk, bike ride or swim, plus 10 minutes of the posture and feet exercises\.$/,
    (m) => `30–45 хвилин чогось легкого й приємного: ${m[1] ? m[1].split(", ").map(TT).join(", ") + " або " : ""}швидка ходьба, велосипед чи плавання, плюс 10 хвилин вправ для постави й стоп.`],
  [/^This week has (\d+) workouts?\. Your plan suggests (\d+)\.$/, (m) => `Цього тижня ${workoutsUk(m[1])}. План радить ${m[2]}.`],
  [/^You did (\d+) of (\d+) workouts\. That's normal\. Want to repeat last week's step so you don't jump ahead too fast\?$/,
    (m) => `Виконано ${m[1]} з ${m[2]} запланованих тренувань. Це нормально. Повторити крок минулого тижня, щоб не забігати наперед?`],
  [/^You reported (.+)\. Gentler exercises for those areas are switched on for 2 weeks\. If it keeps hurting, see a physiotherapist\.$/,
    (m) => `Відзначено біль: ${m[1].split(", ").map((x) => x.replace(/^(.+) \((.+)\)$/, (_, a, d) => `${TTl(a)} (${d})`)).join(", ")}. М'якші вправи для цих зон увімкнено на 2 тижні. Якщо біль не минає, звернися до фізіотерапевта.`],
  [/^Recovery looks low \((.+)\)\. Keep weights the same today, or tap “Make it quick”\.$/,
    (m) => `Відновлення слабке (${m[1].replace(/([\d.]+) h sleep/, "сон $1 год").replace(/resting heart rate (\d+), usually (\d+)/, "пульс у спокої $1, зазвичай $2")}). Сьогодні залиш ті самі ваги або натисни «Скоротити».`],
  [/^Recovery looks good \(([\d.]+) h sleep\)\. Go for it\.$/, (m) => `Відновлення добре (сон ${m[1]} год). Уперед!`],
  [/^(.+)\. Go a bit lighter today, or pick a different workout below\.$/, (m) => `${m[1].split(", ").map((x) => x.replace(/^(.+) (\d+%)$/, (_, a, p) => `${TT(a)} ${p}`)).join(", ")}. Сьогодні працюй трохи легше або вибери інше тренування нижче.`],
  [/^Last time: (.+?)\.(?: It felt (too easy|just right|too hard)\.)?$/, (m) => `Минулого разу: ${unitify(m[1])}.${m[2] ? ` Відчуття: ${FELT_UK[m[2]]}.` : ""}`],
  [/^You hit every rep, so try (.+)\.$/, (m) => `Усі повторення виконано, тож спробуй ${unitify(m[1])}.`],
  [/^Repeat (.+) until you hit every rep\.$/, (m) => `Повтори ${unitify(m[1])}, доки не виконаєш усі повторення.`],
  [/^That was tough, so drop to (.+) and focus on form\.$/, (m) => `Було важко, тож зменш до ${unitify(m[1])} і зосередься на техніці.`],
  [/^Stay at (.+) until it feels smoother\.$/, (m) => `Залишайся на ${unitify(m[1])}, доки не стане легше.`],
  [/^You'd normally add weight, but recovery looks low today, so stay at (.+)\.$/, (m) => `Зазвичай варто додати вагу, але сьогодні відновлення слабке, тож залишайся на ${unitify(m[1])}.`],
  [/^Every rep and it felt easy, so jump to (.+)\.$/, (m) => `Усі повторення, і було легко, тож переходь на ${unitify(m[1])}.`],
  [/^Heaviest yet: (.+)$/, (m) => `Найбільша вага: ${unitify(m[1])}`],
  [/^Best set yet: (.+)$/, (m) => `Найкращий підхід: ${unitify(m[1])}`],
  [/^Most reps yet: (\d+)$/, (m) => `Найбільше повторень: ${m[1]}`],
  [/^Longest yet: (.+)$/, (m) => `Найдовше: ${unitify(m[1])}`],
  [/^The app will switch to gentler exercises for (.+) for the next 2 weeks\.$/, (m) => `Застосунок перейде на м'якші вправи для зон: ${m[1].split(", ").map(TTl).join(", ")} на наступні 2 тижні.`],
  [/^(\d+) set so far$/, (m) => `${m[1]} ${ukPl(+m[1], "рекорд", "рекорди", "рекордів")} поки що`],
  [/^Bar chart, this week (.+)$/, (m) => `Стовпчикова діаграма, цей тиждень: ${unitify(m[1])}`],
  [/^Chart, latest (.+)$/, (m) => `Графік, останнє значення: ${unitify(m[1])}`],
  [/^Calories include ([−+]\d+) kcal from your weekly check-ins\.$/, (m) => `Калорії враховують ${m[1]} ккал з твоїх щотижневих перевірок.`],
  [/^Saved (.+?): (.+)\.$/, (m) => `Збережено ${m[1]}: ${m[2].split(", ").map((x) => {
    let k;
    if ((k = x.match(/^(\d+) workouts?$/))) return workoutsUk(k[1]);
    if ((k = x.match(/^(\d+) check-ins?$/))) return `${k[1]} ${ukPl(+k[1], "перевірка", "перевірки", "перевірок")}`;
    if ((k = x.match(/^(\d+) body weight entr(y|ies)$/))) return `${k[1]} ${ukPl(+k[1], "запис ваги", "записи ваги", "записів ваги")}`;
    if ((k = x.match(/^(\d+) days? of health data$/))) return `${daysUk(k[1])} даних про здоров'я`;
    if ((k = x.match(/^(\d+) photos?$/))) return `${k[1]} фото`;
    return TT(x);
  }).join(", ")}.`],
  [/^Last backup on this device: (.+?)\.( It's a good idea to save one now\.)?$/, (m) => `Остання копія на цьому пристрої: ${m[1]}.${m[2] ? " Варто зберегти її зараз." : ""}`],
  [/^(.+)\. Answer them to improve your estimates\.$/, (m) => `${TT(m[1])}. Дай відповіді, щоб покращити розрахунки.`],
  [/^Rest (\d+:\d\d)$/, (m) => `Відпочинок ${m[1]}`],
  [/^Weekly check-in · week of (.+)$/, (m) => `Щотижнева перевірка · тиждень від ${m[1]}`],
  [/^last: (.+)$/, (m) => `минулого разу: ${m[1]}`],
  [/^Since (.+):$/, (m) => `З ${m[1]}:`],
  [/^· last 4 weeks:$/, () => "· останні 4 тижні:"],
  [/^Your weight has barely moved over the last 3 check-ins \((.+) a week\)\. Eat about 150 kcal less a day \(for example, skip one snack\), or add about 2,000 steps a day\.$/,
    (m) => `Твоя вага майже не змінилася за останні 3 перевірки (${unitify(m[1])} на тиждень). Їж приблизно на 150 ккал менше на день (наприклад, пропусти один перекус) або додай близько 2000 кроків на день.`],
  [/^(.+) a week is faster than the safe 0\.25–1% a week\. Eat about 150 kcal more a day to protect your muscle and energy\.$/,
    (m) => `${unitify(m[1])} на тиждень — це швидше за безпечні 0,25–1% на тиждень. Їж приблизно на 150 ккал більше на день, щоб зберегти м'язи й енергію.`],
  [/^(.+) a week, right in the safe range\. Keep doing what you're doing\.$/, (m) => `${unitify(m[1])} на тиждень — саме в безпечному діапазоні. Продовжуй у тому ж дусі.`],
  [/^Your weight has barely moved \((.+) a week\)\. Muscle needs a small surplus\. Eat about 150 kcal more a day, like a glass of milk or a handful of nuts\.$/,
    (m) => `Твоя вага майже не змінюється (${unitify(m[1])} на тиждень). М'язам потрібен невеликий надлишок. Їж приблизно на 150 ккал більше на день, наприклад склянку молока або жменю горіхів.`],
  [/^(.+) a week is more than muscle can use\. Eat about 150 kcal less a day so the extra isn't stored as fat\.$/,
    (m) => `${unitify(m[1])} на тиждень — більше, ніж можуть використати м'язи. Їж приблизно на 150 ккал менше на день, щоб надлишок не відкладався в жир.`],
  [/^(.+) a week, a slow and steady gain\. Keep going\.$/, (m) => `${unitify(m[1])} на тиждень — повільний і стабільний набір. Продовжуй.`],
  [/^(.+) a week\. If you didn't plan this, check that you're eating enough for your training\.$/, (m) => `${unitify(m[1])} на тиждень. Якщо це не було заплановано, перевір, чи достатньо їси для своїх тренувань.`],
  [/^After (\d+) more weekly check-ins? with your weight, you'll get advice on your calories\.$/, (m) => `Ще ${m[1]} ${ukPl(+m[1], "щотижнева перевірка", "щотижневі перевірки", "щотижневих перевірок")} з вагою — і ти отримаєш поради щодо калорій.`],
  [/^Waist (.+) a week\. You're losing fat and keeping muscle\. Keep going\.$/, (m) => `Талія ${unitify(m[1])} на тиждень. Ти втрачаєш жир і зберігаєш м'язи. Продовжуй.`],
  [/^This week you reported (.+)\. A lighter week \(1 fewer set per exercise\) helps you recover and come back stronger\.$/,
    (m) => `Цього тижня в перевірці: ${m[1].split(", ").map((x) => LOWS_UK[x] || x).join(", ")}. Легший тиждень (на 1 підхід менше в кожній вправі) допоможе відновитися й повернутися з новими силами.`],
  [/^Pain is (\d+)\/10( and getting worse)?$/, (m) => `Біль ${m[1]}/10${m[2] ? " і посилюється" : ""}`],
  [/^Gentler exercises for (.+) are switched on for 2 weeks\. (.+)$/, (m) => `М'якші вправи для зон: ${m[1].split(", ").map(TTl).join(", ")} увімкнено на 2 тижні. ${trCore(m[2]) ?? m[2]}`],
  [/^You've done less than 60% of your workouts for 2 weeks\. A plan you can stick to beats a perfect one\. Try (\d+) days a week\.$/,
    (m) => `Виконано менше 60% тренувань 2 тижні поспіль. План, якого можна дотримуватися, кращий за ідеальний. Спробуй ${daysUk(m[1])} на тиждень.`],
  [/^Switch to (\d+) days a week$/, (m) => `Перейти на ${daysUk(m[1])} на тиждень`],
  [/^([\d.]+) (cm|in) smaller since your first check-in\. That's real progress\.$/, (m) => `На ${m[1]} ${UNIT_UK[m[2]]} менше від першої перевірки. Це справжній прогрес.`],
  [/^Calorie target (raised|lowered) by (\d+)\. See it on the Me tab\.$/, (m) => `Ціль калорій ${m[1] === "raised" ? "збільшено" : "зменшено"} на ${m[2]}. Подивись на вкладці «Я».`],
  [/^Your plan now has (\d+) training days a week\.$/, (m) => `Тепер у плані ${daysUk(m[1])} тренувань на тиждень.`],
  [/^Imported (\d+) days? of health data$/, (m) => `Імпортовано ${daysUk(m[1])} даних про здоров'я`],
  [/^Reading Apple Health export… (\d+)%$/, (m) => `Читаємо експорт Apple Health… ${m[1]}%`],
  [/^Reading (.+)…$/, (m) => `Читаємо ${m[1]}…`],
  [/^Remove (.+)$/, (m) => `Прибрати: ${TT(m[1])}`],
  [/^Added "(.+)"$/, (m) => `Додано «${m[1]}»`],
  [/^Swapped\. Your plan now uses (.+)\.$/, (m) => `Замінено. Тепер у плані: ${TT(m[1])}.`],
  [/^Restoring workouts… (\d+) of (\d+)$/, (m) => `Відновлюємо тренування… ${m[1]} з ${m[2]}`],
  [/^(Front|Side|Back) photo saved on this device$/, (m) => `Фото ${{ Front: "спереду", Side: "збоку", Back: "ззаду" }[m[1]]} збережено на цьому пристрої`],
  [/^Please answer "(.+)"\.$/, (m) => `Будь ласка, дай відповідь: «${TT(m[1])}».`],
  [/^(.+) should be between (\d+) and (\d+)\.$/, (m) => `${TT(m[1])}: має бути від ${m[2]} до ${m[3]}.`],
  [/^Check your (.+)\. Enter it in (kg|lb)\.$/, (m) => `Перевір: ${TT(m[1].replace(/^./, (c) => c.toUpperCase()))}. Вкажи в ${UNIT_UK[m[2]]}.`],
  [/^Check your height\. Enter it in (cm|feet and inches)\.$/, (m) => `Перевір зріст. Вкажи в ${m[1] === "cm" ? "см" : "футах і дюймах"}.`],
  [/^Enter your weight in (kg|lb), like (.+)\.$/, (m) => `Введи вагу в ${UNIT_UK[m[1]]}, наприклад ${m[2].replace(".", ",")}. Можна з комою.`],
  [/^Plates on each side of the (\d+) (kg|lb) bar: (.+)$/, (m) => `Млинці з кожного боку грифа ${m[1]} ${UNIT_UK[m[2]]}: ${m[3].replace(/\((.+) (kg|lb) short\)/, (_, a, u) => `(бракує ${a} ${UNIT_UK[u]})`)}`],
  [/^Lighter than the (\d+) (kg|lb) bar\. Use dumbbells or a lighter bar\.$/, (m) => `Легше за гриф ${m[1]} ${UNIT_UK[m[2]]}. Використай гантелі або легший гриф.`],
  [/^Just the empty (\d+) (kg|lb) bar\.$/, (m) => `Лише порожній гриф ${m[1]} ${UNIT_UK[m[2]]}.`],
  [/^(\d+) ft (\d+) in$/, (m) => `${m[1]} фут ${m[2]} дюйм`],
  [/^([−+-]?[\d.,–]+) (kg|lb|cm|in|s|h|bpm|kcal|reps|min|years|workouts)$/, (m) => `${m[1]} ${UNIT_UK[m[2]]}`],
  [/^([\d.,]+ (?:kg|lb)) × (\d+)$/, (m) => `${unitify(m[1])} × ${m[2]}`],
  [/^(\d+) × (.+)$/, (m) => `${m[1]} × ${unitify(m[2])}`],
  [/^([−+]\d+) s$/, (m) => `${m[1]} с`],
  [/^((?:[\d.]+(?:×[\d.]+)?s?(?:, )?)+)(?: (kg|lb|min|reps))?$/, (m) => `${m[1].replace(/(\d)s/g, "$1 с")}${m[2] ? " " + UNIT_UK[m[2]] : ""}`],
  // A list of known items ("Knees, Lower back") or several known sentences in a row
  [/^[^.]+(?:, [^.]+)+$/, (m) => { const parts = m[0].split(", "); if (parts.some((p) => p.length > 45)) return null; const out = parts.map((p) => ITEM_UK(p)); return out.some((x) => x != null) ? parts.map((p, i) => out[i] ?? p).join(", ") : null; }],
  [/^.+[.!?] .+$/, (m) => { const parts = m[0].split(/(?<=[.!?])\s+/); if (parts.length < 2) return null; const out = parts.map((p) => trCore(p)); return out.every((x) => x != null) ? out.join(" ") : null; }],
);
UK_RX.push(
  [/^Suggested changes · Phase (\d)$/, (m) => `Запропоновані зміни · Фаза ${m[1]}`],
  [/^Your plan has (\d+) changes? from the coach\.(\s*)$/, (m) => `У плані ${m[1]} ${ukPl(+m[1], "зміна", "зміни", "змін")} від тренера.${m[2]}`],
);
UK_RX.push(
  [/^All (\d+) →$/, (m) => `Усі ${m[1]} →`],
  [/^(\d+) exercises$/, (m) => `${m[1]} ${ukPl(+m[1], "вправа", "вправи", "вправ")}`],
  [/^Search (\d+) exercises$/, (m) => `Пошук серед ${m[1]} ${ukPl(+m[1], "вправи", "вправ", "вправ")}`],
  [/^Last: (.+) · Best\s*$/, (m) => `Востаннє: ${m[1]} · Рекорд `],
);
UK_RX.push(
  [/^This week already has (\d+) workouts: your plan's (\d+) plus 1 extra\.$/, (m) => `Цього тижня вже ${m[1]} ${ukPl(+m[1], "тренування", "тренування", "тренувань")}: ${m[2]} за планом і 1 додаткове.`],
  [/^Your plan has (\d+) workouts a week\.$/, (m) => `У твоєму плані ${m[1]} ${ukPl(+m[1], "тренування", "тренування", "тренувань")} на тиждень.`],
  [/^(\d+) strength workouts a week is the most that helps at your level\. Make other days move days instead\.$/, (m) => `${m[1]} силових тренування на тиждень — максимум, що дає користь на твоєму рівні. Інші дні зроби днями руху.`],
  [/^Train (\d+) days a week$/, (m) => `Тренуватися ${m[1]} ${ukPl(+m[1], "день", "дні", "днів")} на тиждень`],
  [/^This week has (\d+) extra workouts?\. Keep the others a little lighter if you feel tired\.$/, (m) => `Цього тижня ${m[1]} ${ukPl(+m[1], "додаткове тренування", "додаткові тренування", "додаткових тренувань")}. Якщо втомишся, роби інші трохи легшими.`],
  [/^Your plan now has (\d+) days a week$/, (m) => `Тепер у плані ${m[1]} ${ukPl(+m[1], "день", "дні", "днів")} на тиждень`],
);
UK_RX.push(
  [/^Weight, set (\d+)$/, (m) => `Вага, підхід ${m[1]}`], [/^Reps, set (\d+)$/, (m) => `Повторення, підхід ${m[1]}`], [/^Seconds, set (\d+)$/, (m) => `Секунди, підхід ${m[1]}`],
  [/^Minutes, set (\d+)$/, (m) => `Хвилини, підхід ${m[1]}`], [/^Remove set (\d+)$/, (m) => `Прибрати підхід ${m[1]}`],
);
UK_RX.push(
  [/^Set (\d+): warm-up and effort$/, (m) => `Підхід ${m[1]}: розминка й зусилля`], [/^Warm-up set: warm-up and effort$/, () => "Розминковий підхід: розминка й зусилля"],
  [/^Copy last time: (.+)$/, (m) => `Скопіювати минулий раз: ${m[1].replace(".", ",")}`], [/^Effort (\d+)$/, (m) => `Зусилля ${m[1]}`],
  [/^\+ (\d+) warm-up$/, (m) => `+ ${m[1]} розмин.`], [/^from (.+) × (\d+)$/, (m) => `з ${unitify(m[1])} × ${m[2]}`],
  [/^([\d.]+) × body weight$/, (m) => `${m[1].replace(".", ",")} × власна вага`], [/^(\d+)% of usual$/, (m) => `${m[1]}% від звичного`],
  [/^Last 7 days: (\d+) sets · usual: (\d+) a week$/, (m) => `Останні 7 днів: ${m[1]} ${ukPl(+m[1], "підхід", "підходи", "підходів")} · зазвичай: ${m[2]} на тиждень`],
  [/^≈ (.+)$/, (m) => `≈ ${unitify(m[1])}`],
);
