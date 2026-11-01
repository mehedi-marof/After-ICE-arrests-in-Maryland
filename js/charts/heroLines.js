// Part 2 title screen: ICE arrests in Maryland by month, January 2024-July 2026, on black.
// Red = non-custodial arrests (street, home, work, ICE offices); gray = custodial arrests from jails and prisons.
// The red line draws itself once on load. Data: custody.csv
let played = false;

export function drawHeroLines(svgEl, rows) {
  const animate = !played && !matchMedia('(prefers-reduced-motion: reduce)').matches; played = true;
  const box = svgEl.getBoundingClientRect(), W = box.width, H = box.height, narrow = W < 1200;
  const svg = d3.select(svgEl).attr('viewBox', `0 0 ${W} ${H}`); svg.selectAll('*').remove();
  const data = rows.filter(d => d.month >= '2024-01' && !d.partial_month);
  // the chart sits right of the words on wide screens and across the top on smaller ones
  const a = narrow ? { x0: 24, x1: W - 24, y0: 70, y1: H - 40 } : { x0: Math.max(W * 0.5, 720), x1: W - 130, y0: 150, y1: H - 140 };
  const x = d3.scalePoint().domain(data.map(d => d.month)).range([a.x0, a.x1]);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.non_custodial) * 1.08]).range([a.y1, a.y0]);
  svg.append('line').attr('x1', a.x0).attr('x2', a.x1).attr('y1', a.y1).attr('y2', a.y1).attr('stroke', '#444');
  const font = (w, s) => `${w} ${s}px Poppins, sans-serif`;
  data.forEach(d => { if (d.month.endsWith('-01')) svg.append('text').attr('x', x(d.month)).attr('y', a.y1 + 18).attr('text-anchor', 'middle')
    .attr('fill', '#888').style('font', font(500, 11)).text(d.month.slice(0, 4)); });
  // Feb. 17, 2026: the 287(g) ban
  const xb = x('2026-02') + x.step() * 16 / 28;
  svg.append('line').attr('x1', xb).attr('x2', xb).attr('y1', a.y0 - 10).attr('y2', a.y1).attr('stroke', '#777').attr('stroke-dasharray', '3 3');
  svg.append('text').attr('x', xb - 6).attr('y', a.y0 - 14).attr('text-anchor', 'end').attr('fill', '#cfcfcf').style('font', font(600, 11)).text('287(g) ban, Feb. 17');
  const line = k => d3.line().x(d => x(d.month)).y(d => y(d[k])).curve(d3.curveMonotoneX)(data);
  svg.append('path').attr('d', line('custodial')).attr('fill', 'none').attr('stroke', '#8a8a8a').attr('stroke-width', 2.5);
  const red = svg.append('path').attr('d', line('non_custodial')).attr('fill', 'none').attr('stroke', '#ff4a3d').attr('stroke-width', 3).attr('stroke-linecap', 'round');
  const last = data[data.length - 1];
  const labels = svg.append('g');
  labels.append('text').attr('x', a.x1 + (narrow ? -4 : 8)).attr('y', y(last.non_custodial) - (narrow ? 12 : -4)).attr('text-anchor', narrow ? 'end' : 'start')
    .attr('fill', '#ff6a5e').style('font', font(600, 12)).text('On the street');
  labels.append('text').attr('x', a.x1 + (narrow ? -4 : 8)).attr('y', y(last.custodial) - (narrow ? 10 : -4)).attr('text-anchor', narrow ? 'end' : 'start')
    .attr('fill', '#bdbdbd').style('font', font(600, 12)).text('From jails');
  if (animate) {
    const len = red.node().getTotalLength();
    red.attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len).transition().delay(400).duration(2600).ease(d3.easeCubicInOut).attr('stroke-dashoffset', 0);
    labels.attr('opacity', 0).transition().delay(2800).duration(500).attr('opacity', 1);
  }
}
