// Share of ICE arrests involving people with no prior conviction or pending charge, by state, since Jan. 20, 2025.
// Top 10 of the states and territories with at least 1,000 arrests (D.C. left out). Data: states.csv
import { COLORS, fmt, pct, makeSvg, tooltip, row } from '../lib/util.js';

export function drawStateShare(host, rows) {
  const us = rows.find(d => d.state === 'United States');
  const data = rows.filter(d => d.state !== 'United States').sort((a, b) => b.share_no_record - a.share_no_record).slice(0, 10);
  const narrow = host.clientWidth < 520, rh = 26, top = 26, h = data.length * rh + top + 26;
  const left = narrow ? 104 : 130, right = 44;
  const { svg, W } = makeSvg(host, h), tip = tooltip(host);
  const x = d3.scaleLinear().domain([0, 0.8]).range([left, W - right]);
  [0, 0.2, 0.4, 0.6, 0.8].forEach(v => {
    svg.append('line').attr('x1', x(v)).attr('x2', x(v)).attr('y1', top - 4).attr('y2', h - 18).attr('stroke', '#ececec');
    svg.append('text').attr('x', x(v)).attr('y', top - 10).attr('text-anchor', 'middle').text(pct(v));
  });
  data.forEach((d, i) => {
    const y = top + i * rh, md = d.state === 'Maryland', hi = md || d.state === 'New York' || d.state === 'West Virginia';
    svg.append('text').attr('class', md ? 'label' : null).attr('x', left - 8).attr('y', y + 16).attr('text-anchor', 'end')
      .style('font-size', '12px').text(d.state);
    svg.append('rect').attr('x', left).attr('y', y + 4).attr('height', rh - 8).attr('width', x(d.share_no_record) - left)
      .attr('fill', md ? COLORS.red : hi ? '#8a8a8a' : COLORS.lightgray);
    svg.append('text').attr('class', md ? 'label' : null).attr('x', x(d.share_no_record) + 5).attr('y', y + 16).style('font-size', '12px').text(pct(d.share_no_record));
    svg.append('rect').attr('x', 0).attr('y', y).attr('width', W).attr('height', rh).attr('fill', 'transparent')
      .on('mousemove', () => tip.show(x(d.share_no_record) / W * host.clientWidth, (y + 6) / h * host.clientHeight,
        `<b>${d.state}</b>${row('No record', pct(d.share_no_record))}${row('Arrests', fmt(d.arrests))}`))
      .on('mouseleave', tip.hide);
  });
  // the national share as a reference line
  svg.append('line').attr('x1', x(us.share_no_record)).attr('x2', x(us.share_no_record)).attr('y1', top - 4).attr('y2', h - 18)
    .attr('stroke', COLORS.ink).attr('stroke-dasharray', '4 3');
  svg.append('text').attr('class', 'label halo').attr('x', x(us.share_no_record) + 5).attr('y', h - 4).style('font-size', '12px')
    .text(`U.S. ${pct(us.share_no_record)}`);
}
