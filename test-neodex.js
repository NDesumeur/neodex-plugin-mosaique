// lancé par le test « local » de NeoDex : la vérification interne, puis pour chaque taille (5, 10, 15, 20) une grille faite main et une au hasard
// résolues, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('gc').__mq, mq = T.st(); ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'mosaique-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  const keep = await pj(`document.getElementById('mqSize').value`);
  for (const n of [5, 10, 15, 20]) {
    await C(`T.size(${n}); return 0;`); await sleep(200);
    const st = await C('return [mq.N, mq.sol.length, document.getElementById("gc").width].join(",");');
    if (!st.startsWith(n + ',' + n)) throw new Error('taille ' + n + ' : la grille devait changer (' + st + ')');
    await shot(n + '-vide');
    await C(`T.solve(); return 0;`); await sleep(1400);
    if (await C('return mq.mode;') !== 'won') throw new Error('taille ' + n + ' : la grille devait être gagnée');
    await shot(n + '-gagne');
    await pj(`(() => { const s = document.getElementById('mqSel'); s.value = -1; s.dispatchEvent(new Event('change')); return 0; })()`); await sleep(200);
    await C(`T.solve(); return 0;`); await sleep(300);
    if (await C('return mq.i + mq.mode;') !== '-1won') throw new Error('taille ' + n + ' : la grille au hasard devait être gagnée');
    if (n === 20) await shot('20-hasard');
  }
  await C(`T.size(${keep}); return 0;`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  await pj(`document.getElementById('gFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 250) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'tailles 5, 10, 15 et 20 gagnées (faites main et au hasard) · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
