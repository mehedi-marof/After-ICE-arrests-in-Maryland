// Share of ICE arrests involving people with no criminal record, Maryland vs. U.S., by month, January 2024-July 2026.
// Data: share_monthly.csv (month, us_share, md_share, md_arrests)
import { COLORS, pct, monthLabel, makeSvg, tooltip, row, yGrid, marker, fmt } from '../lib/util.js';

export function drawShareMonthly(host, rows) {
  const data = rows.filter(d => d.month >= '2024-01' && d.month <= '2026-07'), h = 260, m = { t: 22, r: 112, b: 24, l: 38 };
  const { svg, W } = makeSvg(host, h), tip = tooltip(host);
  const x = d3.scalePoint().domain(data.map(d => d.month)).range([m.l, W - m.r]), y = d3.scaleLinear().domain([0, 1]).range([h - m.b, m.t]);
  yGrid(svg, y, [0, 0.25, 0.5, 0.75, 1], m.l, W - m.r, pct);
  data.forEach(d => { if (d.month.endsWith('-01')) svg.append('text').attr('x', x(d.month)).attr('y', h - 6).attr('text-anchor', 'middle').text(d.month.slice(0, 4)); });
  marker(svg, x('2025-01'), m.t - 4, h - m.b, 'Jan. 2025', 'Trump takes office', 'right');
  const series = [['us_share', COLORS.gray, 'U.S.'], ['md_share', COLORS.red, 'Maryland']];
  series.forEach(([k, c, label]) => {
    svg.append('path').attr('d', d3.line().x(d => x(d.month)).y(d => y(d[k])).curve(d3.curveMonotoneX)(data)).attr('fill', 'none').attr('stroke', c).attr('stroke-width', k === 'md_share' ? 2.8 : 2.2);
    const last = data[data.length - 1];
    svg.append('text').attr('class', 'label halo').attr('x', x(last.month) + 6).attr('y', y(last[k]) + 4).style('fill', c === COLORS.gray ? COLORS.muted : c).text(`${label} ${pct(last[k])}`);
  });
  svg.append('rect').attr('x', m.l).attr('y', m.t).attr('width', W - m.l - m.r).attr('height', h - m.t - m.b).attr('fill', 'transparent')
    .on('mousemove', ev => { const [px] = d3.pointer(ev); const i = Math.max(0, Math.min(data.length - 1, Math.round((px - m.l) / x.step()))); const d = data[i];
      tip.show(x(d.month) / W * host.clientWidth, y(d.md_share) / h * host.clientHeight,
        `<b>${monthLabel(d.month)}</b>${row('Maryland', pct(d.md_share))}${row('U.S.', pct(d.us_share))}${row('Maryland arrests', fmt(d.md_arrests))}`); })
    .on('mouseleave', tip.hide);
}
