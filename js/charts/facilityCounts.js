// How many different ICE facilities each person passed through, people arrested in Maryland since Jan. 20, 2025.
// Red: three or more facilities, the share named in the headline.
// Data: facility_counts.csv (facilities, people, share)
import { COLORS, fmt, pct, makeSvg } from '../lib/util.js';

export function drawFacilityCounts(host, rows) {
  const order = ['1', '2', '3', '4', '5', '6 or more'];
  const data = order.map(k => rows.find(r => String(r.facilities) === k)).filter(Boolean);
  const narrow = host.clientWidth < 520, h = data.length * 40 + 16, left = narrow ? 134 : 150, right = 104;
  const { svg, W } = makeSvg(host, h);
  const x = d3.scaleLinear().domain([0, d3.max(data, d => d.people)]).range([left, W - right]);
  data.forEach((d, i) => {
    const k = String(d.facilities), yy = 8 + i * 40, five = !['1', '2'].includes(k);
    svg.append('text').attr('x', left - 8).attr('y', yy + 19).attr('text-anchor', 'end').text(k === '1' ? '1 facility' : `${k} facilities`);
    svg.append('rect').attr('x', left).attr('y', yy + 6).attr('height', 18).attr('width', Math.max(1, x(d.people) - left)).attr('fill', five ? COLORS.red : COLORS.gray);
    svg.append('text').attr('class', 'label').attr('x', x(d.people) + 6).attr('y', yy + 19).text(`${fmt(d.people)} (${pct(d.share)})`);
  });
}
