// Part 1 title screen: an illustration of an empty ICE check-in waiting room at night.
// Drawn in SVG, black and gray with one red accent (the "now serving" number). No data.
let played = false;

export function drawHeroRoom(svgEl) {
  const animate = !played && !matchMedia('(prefers-reduced-motion: reduce)').matches; played = true;
  const box = svgEl.getBoundingClientRect(), W = box.width, H = box.height, narrow = W < 1200;
  const root = d3.select(svgEl).attr('viewBox', `0 0 ${W} ${H}`); root.selectAll('*').remove();
  // the drawing has its own 800 x 600 canvas, placed right of the words on wide screens and on top on smaller ones
  const area = narrow ? { x: 0, y: 0, w: W, h: H } : { x: Math.max(W * 0.48, 720), y: 60, w: W - Math.max(W * 0.48, 720) - 30, h: H - 100 };
  const svg = root.append('svg').attr('x', area.x).attr('y', area.y).attr('width', area.w).attr('height', area.h)
    .attr('viewBox', '0 0 800 600').attr('preserveAspectRatio', W < 700 ? 'xMidYMid slice' : 'xMidYMid meet');
  const defs = svg.append('defs');
  const cone = defs.append('linearGradient').attr('id', 'hr-cone').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1);
  cone.append('stop').attr('offset', 0).attr('stop-color', '#fff').attr('stop-opacity', .16);
  cone.append('stop').attr('offset', 1).attr('stop-color', '#fff').attr('stop-opacity', 0);
  // the drawing fades into the black page at its edges, so it has no visible frame
  const fade = defs.append('radialGradient').attr('id', 'hr-fade').attr('cx', .5).attr('cy', .48).attr('r', .58);
  fade.append('stop').attr('offset', .45).attr('stop-color', '#fff');
  fade.append('stop').attr('offset', 1).attr('stop-color', '#000');
  defs.append('mask').attr('id', 'hr-mask').attr('maskUnits', 'userSpaceOnUse').attr('x', -400).attr('y', -100).attr('width', 1600).attr('height', 800)
    .append('rect').attr('x', 0).attr('y', 0).attr('width', 800).attr('height', 600).attr('fill', 'url(#hr-fade)');
  const art = svg.append('g').attr('mask', 'url(#hr-mask)');

  // room: back wall, floor, baseboard, floor tiles in perspective
  art.append('rect').attr('width', 800).attr('height', 372).attr('fill', '#171717');
  art.append('rect').attr('y', 372).attr('width', 800).attr('height', 228).attr('fill', '#101010');
  art.append('rect').attr('y', 366).attr('width', 800).attr('height', 6).attr('fill', '#232323');
  const vx = 400, vy = 250;
  d3.range(-12, 13).forEach(i => art.append('line').attr('x1', vx + i * 18).attr('y1', 372).attr('x2', vx + i * 120).attr('y2', 600)
    .attr('stroke', '#191919').attr('stroke-width', 1));
  [400, 440, 492, 560].forEach(yy => art.append('line').attr('x1', 0).attr('x2', 800).attr('y1', yy).attr('y2', yy).attr('stroke', '#191919'));

  // ceiling light and its glow
  const light = art.append('g');
  light.append('polygon').attr('points', '330,34 470,34 640,372 160,372').attr('fill', 'url(#hr-cone)');
  light.append('rect').attr('x', 330).attr('y', 26).attr('width', 140).attr('height', 8).attr('rx', 2).attr('fill', '#e9e9e9');

  // service window with the blind pulled down, and a counter
  art.append('rect').attr('x', 296).attr('y', 150).attr('width', 208).attr('height', 150).attr('fill', '#202020').attr('stroke', '#4a4a4a').attr('stroke-width', 3);
  d3.range(0, 13).forEach(i => art.append('line').attr('x1', 302).attr('x2', 498).attr('y1', 158 + i * 11).attr('y2', 158 + i * 11).attr('stroke', '#2e2e2e').attr('stroke-width', 2));
  art.append('rect').attr('x', 282).attr('y', 300).attr('width', 236).attr('height', 12).attr('fill', '#2b2b2b');
  art.append('rect').attr('x', 350).attr('y', 282).attr('width', 100).attr('height', 14).attr('fill', '#151515').attr('stroke', '#3a3a3a');   // pass-through slot

  // "now serving" display: the only red in the picture
  art.append('text').attr('x', 400).attr('y', 92).attr('text-anchor', 'middle').attr('fill', '#7a7a7a')
    .style('font', '600 11px Poppins, sans-serif').style('letter-spacing', '.18em').text('NOW SERVING');
  art.append('rect').attr('x', 344).attr('y', 100).attr('width', 112).attr('height', 38).attr('rx', 3).attr('fill', '#050505').attr('stroke', '#333');
  const num = art.append('text').attr('x', 400).attr('y', 128).attr('text-anchor', 'middle').attr('fill', '#ff3b2f')
    .style('font', '700 26px ui-monospace, Menlo, monospace').style('letter-spacing', '.08em').text('A027');

  // a notice taped to the wall, and a clock
  const note = art.append('g').attr('transform', 'translate(560,170) rotate(2)');
  note.append('rect').attr('width', 70).attr('height', 92).attr('fill', '#2a2a2a');
  d3.range(0, 8).forEach(i => note.append('rect').attr('x', 10).attr('y', 14 + i * 9).attr('width', i % 3 === 2 ? 30 : 50).attr('height', 3).attr('fill', '#3d3d3d'));
  art.append('circle').attr('cx', 170).attr('cy', 110).attr('r', 22).attr('fill', '#1b1b1b').attr('stroke', '#444').attr('stroke-width', 3);
  art.append('line').attr('x1', 170).attr('y1', 110).attr('x2', 170).attr('y2', 96).attr('stroke', '#888').attr('stroke-width', 2.5).attr('stroke-linecap', 'round');
  art.append('line').attr('x1', 170).attr('y1', 110).attr('x2', 181).attr('y2', 114).attr('stroke', '#888').attr('stroke-width', 2).attr('stroke-linecap', 'round');

  // three rows of empty chairs, nearer rows larger
  const chair = (g, x, s) => {
    const c = g.append('g').attr('transform', `translate(${x},0) scale(${s})`);
    c.append('rect').attr('x', -26).attr('y', -64).attr('width', 52).attr('height', 40).attr('rx', 8).attr('fill', '#2b2b2b').attr('stroke', '#3c3c3c');   // back
    c.append('rect').attr('x', -28).attr('y', -22).attr('width', 56).attr('height', 12).attr('rx', 5).attr('fill', '#333').attr('stroke', '#444');        // seat
    c.append('line').attr('x1', -20).attr('x2', -24).attr('y1', -10).attr('y2', 24).attr('stroke', '#3a3a3a').attr('stroke-width', 3);
    c.append('line').attr('x1', 20).attr('x2', 24).attr('y1', -10).attr('y2', 24).attr('stroke', '#3a3a3a').attr('stroke-width', 3);
  };
  const rows = [{ y: 420, s: .72, n: 6, gap: 84 }, { y: 486, s: .86, n: 6, gap: 100 }, { y: 566, s: 1.02, n: 6, gap: 120 }];
  const rowGs = rows.map(r => {
    const g = art.append('g').attr('transform', `translate(0,${r.y})`);
    g.append('rect').attr('x', 400 - (r.n * r.gap) / 2).attr('y', 24 * r.s - 4).attr('width', r.n * r.gap).attr('height', 5 * r.s).attr('fill', '#262626');   // the beam the chairs sit on
    d3.range(r.n).forEach(i => chair(g, 400 - ((r.n - 1) * r.gap) / 2 + i * r.gap, r.s));
    return g;
  });
  // a ticket left on the floor
  art.append('g').attr('transform', 'translate(520,588) rotate(-14)').call(g => {
    g.append('rect').attr('width', 34).attr('height', 18).attr('fill', '#d8d8d8');
    g.append('text').attr('x', 17).attr('y', 13).attr('text-anchor', 'middle').attr('fill', '#333').style('font', '700 9px ui-monospace, Menlo, monospace').text('A026');
  });

  if (animate) {
    rowGs.forEach((g, i) => g.attr('opacity', 0).transition().delay(300 + i * 350).duration(700).attr('opacity', 1));
    // the light flickers once as the page opens
    light.attr('opacity', .2).transition().delay(200).duration(80).attr('opacity', 1)
      .transition().duration(60).attr('opacity', .35).transition().duration(90).attr('opacity', 1);
    // the counter ticks up to the number on the display
    let n = 19; num.text('A0' + n);
    const tick = setInterval(() => { n += 1; num.text('A0' + n); if (n >= 27) clearInterval(tick); }, 420);
  }
}
