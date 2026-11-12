// Custodial vs. non-custodial ICE arrests in Maryland, by month, January 2024-July 2026.
// Custodial = ICE "Custodial Arrest" (incl. Criminal Alien Program) + 287(g). Data: custody.csv
import { COLORS, fmt, monthLabel, makeSvg, tooltip, row, yGrid, marker } from '../lib/util.js';

export function drawCustody(host, rows) {
  const data = rows.filter(d => d.month >= '2024-01' && !d.partial_month);
  const narrow = host.clientWidth < 560, h = narrow ? 270 : 330, m = { t: 30, r: 16, b: 26, l: 38 };
  const { svg, W } = makeSvg(host, h), tip = tooltip(host);
  const x = d3.scalePoint().domain(data.map(d => d.month)).range([m.l, W - m.r]);
  const y = d3.scaleLinear().domain([0, 800]).range([h - m.b, m.t]);
  yGrid(svg, y, [0, 200, 400, 600, 800], m.l, W - m.r);
  data.forEach(d => { if (/-(01)$/.test(d.month)) svg.append('text').attr('x', x(d.month)).attr('y', h - 7).attr('text-anchor', 'middle').text(d.month.slice(0, 4)); });
  const xAt = date => x(date.slice(0, 7)) + x.step() * (+date.slice(8) - 1) / 30;
  // on small screens the two markers get one short line each, on different heights, so they don't collide
  marker(svg, xAt('2025-01-20'), m.t - 22, h - m.b, 'Jan. 20, 2025', narrow ? null : 'Trump takes office', narrow ? 'left' : 'right');
  marker(svg, xAt('2026-02-17'), narrow ? m.t - 8 : m.t - 22, h - m.b, narrow ? '287(g) ban' : 'Feb. 17', narrow ? null : '287(g) ban', 'left');
  const lines = [['non_custodial', COLORS.orange, 'Non-custodial'], ['custodial', COLORS.purple, 'Custodial']];
  lines.forEach(([k, c, label]) => {
    svg.append('path').attr('d', d3.line().x(d => x(d.month)).y(d => y(d[k])).curve(d3.curveMonotoneX)(data))
      .attr('fill', 'none').attr('stroke', c).attr('stroke-width', 3).attr('stroke-linecap', 'round');
  });
  const pk = data.reduce((a, b) => (b.non_custodial > a.non_custodial ? b : a));
  if (!narrow) svg.append('text').attr('class', 'label halo').attr('x', x(pk.month) - 8).attr('y', y(pk.non_custodial) + 4).attr('text-anchor', 'end').text(`${fmt(pk.non_custodial)}, ${monthLabel(pk.month)}`);
  svg.append('rect').attr('x', m.l).attr('y', m.t).attr('width', W - m.l - m.r).attr('height', h - m.t - m.b).attr('fill', 'transparent')
    .on('mousemove', ev => {
      const [px] = d3.pointer(ev); const i = Math.max(0, Math.min(data.length - 1, Math.round((px - m.l) / x.step()))); const d = data[i];
      tip.show(x(d.month) / W * host.clientWidth, y(d.non_custodial) / h * host.clientHeight,
        `<b>${monthLabel(d.month)}</b>${row('Non-custodial', fmt(d.non_custodial))}${row('Custodial', fmt(d.custodial))}`);
    })
    .on('mouseleave', tip.hide);
}
