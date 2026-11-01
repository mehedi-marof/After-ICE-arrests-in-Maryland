// Citizenship of ICE arrests in Maryland since Jan. 20, 2025: top 10 countries plus all others.
// The four highlighted countries (Guatemala, El Salvador, Honduras, Mexico) are 78% of arrests. Data: citizenship_arrests.csv
import { COLORS, fmt, pct, makeSvg, tooltip, row } from '../lib/util.js';

export function drawCitizenshipArrests(host, rows) {
  const narrow = host.clientWidth < 520, rh = 28, h = rows.length * rh + 12;
  const left = narrow ? 104 : 124, right = narrow ? 150 : 190;
  const { svg, W } = makeSvg(host, h), tip = tooltip(host);
  const x = d3.scaleLinear().domain([0, d3.max(rows, d => d.arrests)]).range([left, W - right]);
  rows.forEach((d, i) => {
    const y = 4 + i * rh + (d.citizenship === 'Other countries' ? 6 : 0), hi = d.top4 === true || d.top4 === 'TRUE';
    svg.append('text').attr('class', hi ? 'label' : null).attr('x', left - 8).attr('y', y + 16).attr('text-anchor', 'end').text(d.citizenship);
    svg.append('rect').attr('x', left).attr('y', y + 4).attr('height', 17).attr('width', Math.max(1, x(d.arrests) - left)).attr('fill', hi ? COLORS.red : COLORS.lightgray);
    svg.append('text').attr('class', hi ? 'label' : null).attr('x', x(d.arrests) + 6).attr('y', y + 17).text(`${fmt(d.arrests)} (${pct(d.share)})`);
    svg.append('rect').attr('x', 0).attr('y', y).attr('width', W).attr('height', rh).attr('fill', 'transparent')
      .on('mousemove', () => tip.show(x(d.arrests) / W * host.clientWidth, (y + 10) / h * host.clientHeight,
        `<b>${d.citizenship}</b>${row('Arrests', fmt(d.arrests))}${row('Share', pct(d.share))}`))
      .on('mouseleave', tip.hide);
  });
  // bracket around the four highlighted countries
  const hiRows = rows.filter(d => d.top4 === true || d.top4 === 'TRUE');
  const total = d3.sum(hiRows, d => d.share), bx = Math.min(W - 52, x(d3.max(hiRows, d => d.arrests)) + (narrow ? 104 : 118)), y0 = 8, y1 = 4 + hiRows.length * rh - 4;
  svg.append('path').attr('d', `M${bx - 8},${y0} H${bx} V${y1} H${bx - 8}`).attr('fill', 'none').attr('stroke', COLORS.red).attr('stroke-width', 1.5);
  svg.append('text').attr('class', 'label').attr('x', bx + 8).attr('y', (y0 + y1) / 2 + 5).attr('text-anchor', 'start')
    .style('fill', COLORS.red).style('font-size', '15px').text(`${Math.round(total * 100)}%`);
}
