// What happened to ICE detainers sent to seven Maryland county jails since Jan. 20, 2025.
// Each bar is one jail's detainers, split into: ICE took custody, jail declined, other or not yet recorded.
// Duplicates and replacement detainers are left out. Data: detainer_outcomes.csv (notebook section 2.4)
import { COLORS, fmt, pct, makeSvg, tooltip, row } from '../lib/util.js';

export const DET_COLORS = { custody: '#333333', declined: COLORS.red, other: COLORS.lightgray };

export function drawDetainerOutcomes(host, rows) {
  const narrow = host.clientWidth < 520, rh = narrow ? 44 : 36, h = rows.length * rh + 26;
  const left = narrow ? 0 : 128, right = narrow ? 44 : 56;
  const { svg, W } = makeSvg(host, h), tip = tooltip(host);
  const x = d3.scaleLinear().domain([0, 1]).range([left, W - right]);
  const keys = [['custody', 'ICE took custody'], ['declined', 'Jail declined'], ['other', 'Other or not yet recorded']];
  // axis: 0, 50%, 100% of each jail's detainers
  [0, 0.5, 1].forEach(v => {
    svg.append('text').attr('class', 'axis-label').attr('x', x(v)).attr('y', h - 6)
      .attr('text-anchor', v === 0 ? 'start' : v === 1 ? 'end' : 'middle').style('fill', COLORS.muted).style('font-size', '12px')
      .text(v === 0.5 ? '50% of detainers' : pct(v));
  });
  rows.forEach((d, i) => {
    const y = 4 + i * rh, by = narrow ? y + 18 : y + 6, bh = narrow ? 18 : 20;
    svg.append('text').attr('class', 'label').attr('x', narrow ? 0 : left - 10).attr('y', narrow ? y + 13 : by + 15)
      .attr('text-anchor', narrow ? 'start' : 'end').text(d.jail);
    let x0 = 0;
    keys.forEach(([k], j) => {
      const share = d[k] / d.detainers, gap = j < 2 && d[k] > 0 ? 2 : 0;
      const w = Math.max(0, x(x0 + share) - x(x0) - gap);
      if (d[k] > 0) svg.append('rect').attr('x', x(x0)).attr('y', by).attr('width', w).attr('height', bh).attr('fill', DET_COLORS[k]);
      if (w > 30 && k !== 'other') svg.append('text').attr('x', x(x0) + 6).attr('y', by + bh / 2 + 5)
        .style('fill', '#fff').style('font-size', '13px').style('font-weight', 600).text(fmt(d[k]));
      x0 += share;
    });
    svg.append('text').attr('x', W - right + 8).attr('y', by + bh / 2 + 5).style('fill', COLORS.muted).style('font-size', '13px').text(fmt(d.detainers));
    svg.append('rect').attr('x', 0).attr('y', y).attr('width', W).attr('height', rh).attr('fill', 'transparent')
      .on('mousemove', ev => tip.show(d3.pointer(ev, host)[0], (by + bh) / h * host.clientHeight,
        `<b>${d.jail}</b>${row('Detainers', fmt(d.detainers))}${row('ICE took custody', `${fmt(d.custody)} (${pct(d.custody / d.detainers)})`)}${row('Jail declined', `${fmt(d.declined)} (${pct(d.declined / d.detainers)})`)}${row('Other or not yet recorded', fmt(d.other))}`))
      .on('mouseleave', tip.hide);
  });
}
