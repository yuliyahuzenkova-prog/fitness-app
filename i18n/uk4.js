Object.assign(UK, {
"Forearms": "Передпліччя", "Hip muscles": "Бічні м'язи стегна", "Feet": "Стопи", "Calves": "Литки", "Shins": "Гомілки", "Mobility": "Рухливість",
"Hip flexors": "Згиначі стегна", "Cardio": "Кардіо", "Whole body": "Усе тіло", "Muscles worked": "М'язи, що працюють",
});
Object.assign(UK, {
"How did this exercise feel?": "Як відчувалася ця вправа?",
"Weights marked “Starting estimate” come from your body weight and experience. Change them if they feel too light or too heavy, and tap how each exercise felt. The app learns from what you log.": "Ваги з позначкою «Стартова оцінка» розраховано з твоєї ваги та досвіду. Змінюй їх, якщо здається занадто легко чи важко, і відзначай, як відчувалася кожна вправа. Застосунок вчиться з того, що ти записуєш.",
"Based on your body weight and experience. Change it if it feels too light or too heavy. The app learns from what you log.": "На основі твоєї ваги та досвіду. Зміни, якщо здається занадто легко чи важко. Застосунок вчиться з того, що ти записуєш.",
});
UK_RX.unshift(
  [/^Starting estimate: (.+?)( per hand)?\.$/, (m) => `Стартова оцінка: ${unitify(m[1])}${m[2] ? " на кожну руку" : ""}.`],
  [/^That was too hard, and you're still finding your level, so drop to (.+)\.$/, (m) => `Було занадто важко, а ти ще шукаєш свій рівень, тож зменш до ${unitify(m[1])}.`],
  [/^That felt easy, and you're still finding your level, so jump to (.+)\.$/, (m) => `Було легко, а ти ще шукаєш свій рівень, тож переходь на ${unitify(m[1])}.`],
);
Object.assign(UK, { "Set": "Підхід", "Previous": "Минулого разу", "First workout": "Перше тренування", "First record": "Перший рекорд", "Finished the plan": "План завершено" });
UK_RX.unshift(
  [/^(\d+ workouts|\d+-week streak|\d+ records|Finished Phase \d)$/, (m) => BADGE_UK(m[1])],
);
Object.assign(UK, { "Your week starts after setup": "Тиждень почнеться після налаштування" });
Object.assign(UK, { "Front view": "Спереду", "Back view": "Ззаду", "Main muscles": "Основні м'язи", "Helping muscles": "Допоміжні м'язи" });
Object.assign(UK, {
  "All of them": "Усі", "Everything": "Усе", "Barbell Romanian deadlift": "Румунська тяга зі штангою",
  "Heavier now. Stop if your shoulder hurts. Reps per arm.": "Тепер важче. Зупинись, якщо болить плече. Повторення на кожну руку.",
  "Gentle on the shoulders. Body in one straight line.": "Щадить плечі. Тіло — одна пряма лінія.",
  "Slower now: 3 s down. Only if pain-free.": "Тепер повільніше: 3 с вниз. Лише якщо не болить.",
  "Bar close to your legs, hips back, knees only softly bent.": "Гриф близько до ніг, таз назад, коліна лише злегка зігнуті.",
  "Heavier now. Same soft knees, flat back.": "Тепер важче. Так само м'які коліна, рівна спина.",
});
// AI coach
Object.assign(UK, {
  "Adjust today's workout": "Зміни сьогоднішнє тренування",
  "I only have 20 minutes": "У мене лише 20 хвилин",
  "Something hurts today": "Сьогодні щось болить",
  "Explain my progress": "Поясни мій прогрес",
  "Review my week": "Оціни мій тиждень",
  "Ask your coach": "Запитай тренера",
  "Change today's workout, ask about pain, or get your progress explained.": "Зміни сьогоднішнє тренування, запитай про біль або отримай пояснення прогресу.",
  "Open chat": "Відкрити чат",
  "AI coach: open Relief inside Claude to chat with it.": "ШІ-тренер: відкрий Relief у Claude, щоб поспілкуватися з ним.",
  "Coach": "Тренер",
  "AI": "ШІ",
  "New chat": "Новий чат",
  "Hi! I can see your profile, plan, workouts and check-ins. Ask me anything, or tell me how to change today's workout.": "Привіт! Я бачу твій профіль, план, тренування й щотижневі звіти. Питай що завгодно або скажи, як змінити сьогоднішнє тренування.",
  "Ask your coach…": "Напиши тренеру…",
  "Message": "Повідомлення",
  "Send": "Надіслати",
  "Stop": "Зупинити",
  "Thinking…": "Думаю…",
  "Thinking": "Думаю",
  "Building your workout…": "Складаю тренування…",
  "Uses your Claude account. The coach can make mistakes and isn't medical advice.": "Використовує твій акаунт Claude. Тренер може помилятися, і це не медична порада.",
  "Suggested workout": "Запропоноване тренування",
  "Some exercises weren't in the app's library and were left out.": "Деяких вправ немає в бібліотеці застосунку, тож їх пропущено.",
  "Start this workout": "Почати це тренування",
  "Made with your coach": "Складено з тренером",
  "Coach workout": "Тренування від тренера",
  "The coach needs your permission to use Claude. Reload the page to be asked again.": "Тренеру потрібен дозвіл на використання Claude. Онови сторінку, щоб побачити запит знову.",
  "Too many questions at once. Wait a minute, then try again.": "Забагато запитань одразу. Зачекай хвилину й спробуй знову.",
  "Too much to send. Tap “New chat” and try again.": "Забагато даних. Натисни «Новий чат» і спробуй знову.",
  "The coach can't help with that one. Try asking another way.": "Із цим тренер не допоможе. Спробуй запитати інакше.",
  "The AI coach is turned off for this account.": "ШІ-тренера вимкнено для цього акаунта.",
  "Your Claude session expired. Reload the page.": "Сесія Claude завершилася. Онови сторінку.",
  "Something went wrong. Try again.": "Щось пішло не так. Спробуй знову.",
  "The coach couldn't answer. Try again in a moment.": "Тренер не зміг відповісти. Спробуй трохи згодом.",
});
Object.assign(UK, { "Switch to dark mode": "Увімкнути темну тему", "Switch to light mode": "Увімкнути світлу тему" });
Object.assign(UK, {
  "Delete all my data": "Видалити всі мої дані",
  "Start from scratch: removes your profile, plan, workouts, check-ins, body weight, health data, progress photos and coach chat from this device. This can't be undone, so save a backup first if you might want it later.": "Почати з нуля: видаляє профіль, план, тренування, щотижневі звіти, вагу тіла, дані про здоров'я, фото прогресу й чат із тренером з цього пристрою. Це не можна скасувати, тож спершу збережи резервну копію, якщо вона може знадобитися.",
  "Start from scratch: removes your profile, plan, workouts, check-ins, body weight, health data, progress photos and coach chat from this device and your Claude account. This can't be undone, so save a backup first if you might want it later.": "Почати з нуля: видаляє профіль, план, тренування, щотижневі звіти, вагу тіла, дані про здоров'я, фото прогресу й чат із тренером з цього пристрою та твого акаунта Claude. Це не можна скасувати, тож спершу збережи резервну копію, якщо вона може знадобитися.",
  "Are you sure? Everything will be deleted.": "Точно? Усе буде видалено.",
  "Yes, delete everything": "Так, видалити все",
  "Deleting your data…": "Видаляю твої дані…",
  "All your data was deleted": "Усі твої дані видалено",
});
// Coach review
Object.assign(UK, {
  "Coach review": "Огляд від тренера",
  "Review my plan": "Переглянути мій план",
  "Check my posture from photos": "Перевірити поставу за фото",
  "Check my posture with the coach": "Перевірити поставу з тренером",
  "The coach reads everything you filled in, including your own notes, and suggests changes. You choose what to apply.": "Тренер читає всі твої відповіді разом із нотатками й пропонує зміни. Що застосувати — вирішуєш ти.",
  "Add progress photos on the Me tab to get a posture check too.": "Додай фото прогресу на вкладці «Я», щоб тренер перевірив і поставу.",
  "The coach is looking at your photos…": "Тренер дивиться на твої фото…",
  "The coach is reading your profile and plan…": "Тренер читає твій профіль і план…",
  "This can take up to a minute.": "Це може тривати до хвилини.",
  "Send your photos to Claude?": "Надіслати фото в Claude?",
  "Your latest front, side and back photos will be sent to Claude on your account so the coach can look at your posture. They aren't saved in Relief's data or shared with anyone else. It's a rough check from photos, not a diagnosis.": "Твої останні фото спереду, збоку та ззаду буде надіслано в Claude через твій акаунт, щоб тренер подивився на поставу. Вони не зберігаються в даних Relief і нікому не передаються. Це приблизна перевірка за фото, а не діагноз.",
  "Send photos": "Надіслати фото",
  "What the coach noticed": "Що помітив тренер",
  "not sure": "не впевнено", "fairly sure": "досить упевнено", "sure": "упевнено",
  "Apply": "Застосувати", "Apply all": "Застосувати все", "Added ✓": "Додано ✓",
  "Swap": "Заміна", "Remove": "Прибрати", "Add to every workout:": "Додати в кожне тренування:",
  "No changes needed. Your plan already fits what you told the app.": "Змін не потрібно. План уже відповідає твоїм відповідям.",
  "Undo coach changes": "Скасувати зміни тренера",
  "Changes added to your plan": "Зміни додано в план", "Change added to your plan": "Зміну додано в план",
  "Coach changes undone": "Зміни тренера скасовано",
  "Photos can't be sent to Claude here.": "Тут не можна надіслати фото в Claude.",
  "Photos stay on this device only, and nobody else who opens this app can see them. They're only sent anywhere if you ask the coach to check your posture and confirm. Clearing your browser data deletes them.": "Фото зберігаються лише на цьому пристрої, і ніхто інший, хто відкриває застосунок, їх не бачить. Вони надсилаються кудись, лише якщо ти попросиш тренера перевірити поставу й підтвердиш. Очищення даних браузера їх видаляє.",
});
Object.assign(UK, { "Drag to turn": "Потягни, щоб повернути", "View": "Вигляд" });
// 3D technique hints
Object.assign(UK, {
  "Keep your back straight": "Спина рівна", "Body in one straight line": "Тіло в одну лінію", "Knees, hips and shoulders in line": "Коліна, таз і плечі в лінію",
  "Sit down slowly": "Повільно сідай", "Stand up": "Вставай", "Hold": "Тримай", "Lower slowly": "Повільно опускайся", "Push away": "Відштовхни",
  "Push back up": "Підіймайся", "Step back and lower slowly": "Крок назад, повільно опускайся", "Step up": "Зашагни", "Step down slowly": "Повільно зійди",
  "Hips back, lower slowly": "Таз назад, повільно вниз", "Stand tall": "Випрямись", "Lift": "Піднімай", "Hinge down slowly": "Повільно нахиляйся",
  "Lift your hips": "Підніми таз", "Stand tall, squeeze": "Випрямись, стисни сідниці", "Hips back slowly": "Повільно таз назад", "Push up": "Відштовхнись",
  "Lower your head slowly": "Повільно опусти голову", "Press up": "Вижми вгору", "Pull": "Тягни", "Return slowly": "Повільно повертай",
  "Pull your chest up": "Підтягни груди", "Slide up slowly": "Повільно ковзай угору", "Slide up into a Y": "Ковзай угору в «Y»", "Slide down": "Ковзай униз", "Pull apart": "Розтягни",
  "Jump out": "Стрибок у сторони", "Jump in": "Стрибок разом", "Pull down": "Тягни вниз", "Pull up": "Підтягуйся", "Hang": "Вис",
  "Lift your arms": "Підніми руки", "Reach out slowly": "Повільно витягнись", "Return": "Повертайся", "Round your back": "Округли спину",
  "Arch your back slowly": "Повільно прогни спину", "Tap": "Торкнись плеча", "Press out": "Вижми вперед", "Rise up": "Піднімись на носки",
  "Lift your toes": "Підніми носки", "Open your knee": "Розкрий коліно", "Close slowly": "Повільно закрий", "Lift your leg": "Підніми ногу",
  "Lean in": "Подайся вперед", "Ease off": "Розслабся", "Ease off slowly": "Повільно розслабся", "Tuck your chin": "Прибери підборіддя", "Relax": "Розслабся", "Pull to your face": "Тягни до обличчя",
  "Lean through": "Подайся вперед", "Lower the leg slowly": "Повільно опускай ногу", "Step back": "Крок назад", "Step back slowly": "Повільно назад", "Lower slowly, 3–5 s": "Повільно опускайся, 3–5 с", "Step back up": "Знову стань угору", "Pause": "Пауза", "Breathe in": "вдих", "Breathe out": "видих", "Breathe normally": "дихай рівно",
});
Object.assign(UK, { "Lift your arch, toes relaxed": "Підніми склепіння, пальці розслаблені", "Relax slowly": "Повільно розслаб", "Scrunch the towel": "Збирай рушник пальцями", "Relax your toes": "Розслаб пальці" });
Object.assign(UK, { "Figure": "Фігура", "Smooth": "Гладка", "Sleek": "Темна", "Cartoon": "Мультяшна", "Anatomy": "Анатомічна" });
Object.assign(UK, { "Recent": "Нещодавні", "Choose an exercise": "Обери вправу", "Legs": "Ноги", "Push": "Жим", "Pull": "Тяга", "Core": "Кор", "Other": "Інше", "Most improved": "Найбільший прогрес", "A–Z": "А–Я", "No exercises match.": "Нічого не знайдено." });
Object.assign(UK, { "All": "Усі" });
Object.assign(UK, {
  "Cycling to work or errands": "Велосипед на роботу чи в справах", "Taking the stairs": "Ходьба сходами", "Housework and cleaning": "Хатні справи й прибирання",
  "Playing with kids": "Ігри з дітьми", "Carrying shopping": "Носіння покупок", "Fitness": "Фітнес", "Gym classes": "Групові заняття в залі",
  "Indoor cycling": "Сайклінг", "Home workouts": "Тренування вдома", "Rowing": "Веслування", "Martial arts or boxing": "Бойові мистецтва чи бокс",
  "Social dance (salsa, bachata, tango)": "Парні танці (сальса, бачата, танго)", "Ballet or contemporary": "Балет чи контемпорарі",
  "Zumba or dance fitness": "Зумба чи денс-фітнес",
  "Nothing to back up yet. Set up your profile or log a workout first. You can still restore a backup you saved earlier.": "Поки нема чого зберігати. Спершу заповни профіль або запиши тренування. Відновити раніше збережену копію можна вже зараз.",
});
Object.assign(UK, { "Back muscles": "Спина" });
Object.assign(UK, { "Workouts, in rotation": "Тренування по черзі" });
Object.assign(UK, {
  "Workout": "Тренування", "Extra workout": "Додаткове тренування",
  "To train more often every week, change your days in your profile.": "Щоб тренуватися частіше щотижня, зміни кількість днів у профілі.",
  "One extra workout is fine now and then.": "Одне додаткове тренування час від часу — нормально.",
  "Workouts follow your plan's order automatically.": "Тренування йдуть у порядку плану автоматично.",
  "Workouts follow your plan's order automatically:": "Тренування йдуть у порядку плану автоматично:",
});
Object.assign(UK, { "Day off": "Вихідний", "Move": "Рух" });
Object.assign(UK, { "Settings": "Налаштування", "Language": "Мова", "Units": "Одиниці", "No pain": "Немає болю", "Worst pain": "Дуже сильний" });
Object.assign(UK, { "Edit": "Змінити", "Editing": "Редагування", "Remove": "Прибрати", "Workout updated": "Тренування оновлено", "sec": "с", "min": "хв",
  "No exercises left. Save to keep it empty, or cancel. To remove the whole workout, use Delete.": "Вправ не лишилося. Збережи порожнім або скасуй. Щоб видалити все тренування, натисни «Видалити»." });
Object.assign(UK, { "Change this week's answers": "Змінити відповіді за тиждень", "Back to this week": "Повернутися до цього тижня", "Save": "Зберегти", "Cancel": "Скасувати", "Body weight": "Вага тіла", "Body weight saved": "Вагу збережено" });
Object.assign(UK, { "Realistic": "Реалістична" });
Object.assign(UK, { "Chrome": "Хром", "Chrome woman": "Хром — жінка" });
Object.assign(UK, { "You took last week off": "Минулого тижня була перерва", "No workouts last week — that happens. Want to repeat last week's step so you ease back in, instead of jumping to heavier work?": "Минулого тижня тренувань не було — таке буває. Повторимо той самий крок, щоб плавно повернутися в ритм, а не одразу брати важче?", "Ease back in": "Повторити тиждень" });
Object.assign(UK, {
  "What should we call you?": "Як до тебе звертатися?",
  "How old are you?": "Скільки тобі років?",
  "Age helps set a safe starting point and your calorie estimate.": "Вік допомагає обрати безпечний старт і порахувати калорії.",
  "What's your sex?": "Твоя стать?",
  "Your height and weight": "Твій зріст і вага",
  "Used for your calorie and protein estimates. Only you see them.": "Потрібні для розрахунку калорій і білка. Бачиш їх лише ти.",
  "What else keeps you active?": "Що ще тримає тебе в русі?",
  "What's your main goal?": "Яка твоя головна мета?",
  "Anything else you'd like along the way?": "Що ще хочеться отримати дорогою?",
  "Which areas do you most want to change?": "Що найбільше хочеться змінити?",
  "Do you have a goal weight?": "Маєш бажану вагу?",
  "How much have you trained before?": "Який у тебе досвід тренувань?",
  "How much time do you have?": "Скільки часу маєш?",
  "What equipment can you use?": "Який інвентар маєш?",
  "This keeps your plan safe. It stays private to you.": "Це робить план безпечним. Бачиш це лише ти.",
  "Any pain or past injuries?": "Є біль або старі травми?",
  "Anything about your body or posture?": "Щось про тіло чи поставу?",
  "Anything else we should know?": "Щось ще варто знати?",
  "All optional. A sentence or two helps your plan fit you better.": "Усе необов'язково. Пара речень допоможе точніше підлаштувати план.",
  "Photos and measurements": "Фото й заміри", "Almost done": "Майже готово",
  "Optional, but the best way to see changes the scale misses.": "Необов'язково, але це найкращий спосіб побачити зміни, яких не покажуть ваги.",
});
Object.assign(UK, { "30 seconds less": "На 30 секунд менше", "30 seconds more": "На 30 секунд більше", "−30 s": "−30 с", "+30 s": "+30 с" });
Object.assign(UK, { "Unit (optional)": "Одиниця (необовʼязково)", "Parameter name": "Назва параметра", "Unit": "Одиниця" });
Object.assign(UK, { "Your data is saved on this phone, in this browser.": "Дані зберігаються на цьому телефоні, у цьому браузері." });
Object.assign(UK, { "On my feet at work": "На ногах на роботі", "Dancing": "Танці", "Cycling (road or mountain bike)": "Велоспорт (шосе чи гори)", "Cricket": "Крикет", "Hockey": "Хокей", "Baseball": "Бейсбол", "Rugby": "Регбі", "Golf": "Гольф", "Table tennis": "Настільний теніс", "Martial arts or boxing": "Бойові мистецтва чи бокс", "Hiking": "Походи", "Yoga": "Йога", "Pilates": "Пілатес", "Stretching": "Розтяжка", "Fitness": "Фітнес" });
Object.assign(UK, { "Sport and activity": "Спорт і активність" });
Object.assign(UK, {
  "Tap last time's numbers to copy them. Tap the set number to mark a warm-up or rate your effort.": "Торкнись цифр «Минулого разу», щоб скопіювати їх. Торкнись номера підходу, щоб позначити розминку або оцінити зусилля.",
  "Warm-up": "Розминка", "Warm-up set": "Розминковий підхід", "Effort, 1–10": "Зусилля, 1–10",
  "7 = 3 reps left · 8 = 2 left · 9 = 1 left · 10 = nothing left": "7 = ще 3 повтори в запасі · 8 = ще 2 · 9 = ще 1 · 10 = більше не можу",
  "Strength estimate": "Оцінка сили",
  "Your estimated one-rep max (the most you could lift once) from your best set in the last 8 weeks. You don't need to test it: it's worked out from sets of 12 reps or fewer.": "Розрахунковий максимум на одне повторення (найбільша вага, яку ти піднімеш один раз) за найкращим підходом за останні 8 тижнів. Перевіряти його не треба: він рахується з підходів до 12 повторів.",
  "per hand": "на кожну руку",
  "Levels compare you with typical lifters of your sex and body weight, for the main barbell lifts. A rough guide, not a target: steady progress matters more.": "Рівні порівнюють тебе з типовими атлетами твоєї статі й ваги в основних вправах зі штангою. Це приблизний орієнтир, а не ціль: важливіший стабільний прогрес.",
  "Add your body weight to see how your lifts compare.": "Додай свою вагу, щоб побачити порівняння.",
  "Log a weighted exercise with 12 reps or fewer to see your estimate.": "Запиши вправу з вагою до 12 повторів, щоб побачити оцінку.",
  "Beginner": "Початківець", "Novice": "Новачок", "Intermediate": "Середній", "Advanced": "Просунутий", "Elite": "Еліта",
  "Training more or less than usual?": "Тренуєшся більше чи менше, ніж зазвичай?",
  "After about 3 weeks of workouts, this compares each week with what you're used to, so you can build up steadily without sudden jumps.": "Приблизно після 3 тижнів тренувань тут з'явиться порівняння кожного тижня з тим, до чого ти звикаєш, щоб навантаження росло поступово, без різких стрибків.",
  "Less than usual": "Менше, ніж зазвичай",
  "That's fine for a busy or lighter week. When you get back to it, build up again over a week or two instead of jumping straight back.": "Для зайнятого чи легшого тижня це нормально. Коли повернешся, нарощуй навантаження протягом тижня-двох, а не одразу до колишнього.",
  "Your usual range": "Твоя звична зона",
  "Steady. Building up gradually like this is the safest way to get stronger.": "Рівно. Поступове нарощування — найбезпечніший шлях до сили.",
  "A bit more than usual": "Трохи більше, ніж зазвичай",
  "Fine for a short push. Keep an eye on sleep and soreness, and don't add more next week.": "Для короткого ривка це нормально. Стеж за сном і болем у м'язах і не додавай ще наступного тижня.",
  "Much more than usual": "Значно більше, ніж зазвичай",
  "A sudden jump like this raises the risk of overuse injuries. Keep the next few days lighter, or swap one workout for a walk.": "Такий різкий стрибок підвищує ризик травм від перевантаження. Кілька наступних днів тренуйся легше або заміни одне тренування прогулянкою.",
  "Less": "Менше", "Usual": "Звично", "More": "Більше",
  "Counts your working sets (warm-ups don't count), weighted by effort when you rate it.": "Рахуються робочі підходи (розминка не враховується), з поправкою на зусилля, якщо ти його оцінюєш.",
});
