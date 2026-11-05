// Pairs the ordered Ukrainian lists with the app's exercise data and guides (runs once at start-up)
function exerciseTextLists() {
  const names = [], cues = [];
  const addN = (n) => { if (!names.includes(n)) names.push(n); }, addC = (c) => { if (c && !cues.includes(c)) cues.push(c); };
  for (const slot of Object.keys(LIB)) libItems(slot).forEach((x) => { addN(x[0]); addC(x[2]); });
  for (const l of Object.values(PREHAB)) l.forEach((x) => (Array.isArray(x) ? [x] : Object.values(x)).forEach((y) => { addN(y[0]); addC(y[3]); }));
  for (const r of Object.values(ROUTINES)) for (const d of Object.values(r.days)) d.forEach((e) => addN(e.name));
  ["Bike intervals", "Rower or bike intervals", "Brisk walk or marching in place", "Bodyweight circuit"].forEach(addN);
  ["30 s fast, 60 s easy, repeat. Fast should feel hard but steady.", "Fast enough that talking is a bit hard. Supportive shoes on.", "40 s on, 20 s off: squats, mountain climbers, march or jumping jacks. Repeat."].forEach(addC);
  for (const r of Object.values(ROUTINES)) addC(r.note);
  return { names, cues };
}
function buildUk() {
  const UK = I18N.uk.d; // always the Ukrainian dictionary, whichever language is active
  Object.assign(UK, UK_NAMES, UK_CUES);
  for (const [id, g] of Object.entries(GUIDES)) {
    const u = GUIDES_UK[id]; if (!u) { console.warn("No Ukrainian guide for", id); continue; }
    UK[g.feel] = u[0]; UK[g.setup] = u[1]; UK[g.breathe] = u[3]; UK[g.easier] = u[5]; UK[g.harder] = u[6];
    g.steps.forEach((s, i) => u[2][i] && (UK[s] = u[2][i]));
    g.mistakes.forEach((s, i) => u[4][i] && (UK[s] = u[4][i]));
  }
}
