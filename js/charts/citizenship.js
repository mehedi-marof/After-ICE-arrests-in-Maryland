// Citizenship of people ICE arrested in Maryland since Jan. 20, 2025 (top 10), and how many of those arrests
// had ended with the person leaving the country by early August 2026. Data: citizenship.csv
import { COLORS, fmt, pct, makeSvg, tooltip, row } from '../lib/util.js';

export function drawCitizenship(host, rows) {
  const narrow = host.clientWidth < 520, rh = 34, h = rows.length * rh + 10;
  const left = narrow ? 92 : 112, right = narrow ? 92 : 150;
  const { svg, W } = makeSvg(host, h), tip = tooltip(host);
  const x = d3.scaleLinear().domain([0, d3.max(rows, d => d.arrests)]).range([left, W - right]);
  rows.forEach((d, i) => {
    const y = 4 + i * rh;
    svg.append('text').attr('x', left - 8).attr('y', y + 17).attr('text-anchor', 'end').text(d.citizenship);
    svg.append('rect').attr('x', left).attr('y', y + 5).attr('height', 17).attr('width', Math.max(1, x(d.arrests) - left)).attr('fill', COLORS.lightgray);
    svg.append('rect').attr('x', left).attr('y', y + 5).attr('height', 17).attr('width', Math.max(1, x(d.departed) - left)).attr('fill', COLORS.blue);
    svg.append('text').attr('class', 'label').attr('x', x(d.arrests) + 6).attr('y', y + 18)
      .text(narrow ? fmt(d.arrests) : `${fmt(d.arrests)} · ${pct(d.share_departed)} left`);
    svg.append('rect').attr('x', 0).attr('y', y).attr('width', W).attr('height', rh).attr('fill', 'transparent')
      .on('mousemove', () => tip.show(x(d.arrests) / W * host.clientWidth, (y + 10) / h * host.clientHeight,
        `<b>${d.citizenship}</b>${row('Arrests', fmt(d.arrests))}${row('Left the country', `${fmt(d.departed)} (${pct(d.share_departed)})`)}${row('No record', pct(d.share_no_record))}`))
      .on('mouseleave', tip.hide);
  });
}
