// Part 2 title screen: every ICE facility that held someone arrested in Maryland since Jan. 20, 2025,
// sized by people held, on a dark map, with the most common five-stop route drawn in red.
// Data: facilities.csv, route.csv, geo/us-states.json
let played = false;   // animate on the first draw only, not on every resize

export function drawHeroRoute(svgEl, D) {
  const animate = !played && !matchMedia('(prefers-reduced-motion: reduce)').matches; played = true;
  const box = svgEl.getBoundingClientRect(), W = box.width, H = box.height, narrow = W < 700;
  const svg = d3.select(svgEl).attr('viewBox', `0 0 ${W} ${H}`); svg.selectAll('*').remove();
  // the map sits to the right of the headline on wide screens and in the top half on phones
  const ext = narrow ? [[12, 12], [W - 12, H - 12]] : [[W * 0.36, 70], [W - 30, H - 40]];
  const proj = d3.geoAlbersUsa().fitExtent(ext, D.geo.us), path = d3.geoPath(proj);
  svg.append('g').selectAll('path').data(D.geo.us.features).join('path').attr('d', path)
    .attr('fill', '#161616').attr('stroke', '#3a3a3a').attr('stroke-width', .7);
  const r = d3.scaleSqrt().domain([0, d3.max(D.facilities, d => d.people)]).range([0, narrow ? 22 : 34]);
  const pts = D.facilities.filter(d => d.lat != null && d.lon != null).map(d => ({ ...d, p: proj([d.lon, d.lat]) })).filter(d => d.p)
    .sort((a, b) => b.people - a.people);
  const bal = proj([-76.6197, 39.298]), far = d3.max(pts, d => Math.hypot(d.p[0] - bal[0], d.p[1] - bal[1])) || 1;
  const dots = svg.append('g').selectAll('circle').data(pts).join('circle').attr('cx', d => d.p[0]).attr('cy', d => d.p[1])
    .attr('fill', 'rgba(229,62,52,.28)').attr('stroke', 'rgba(229,62,52,.75)').attr('stroke-width', .8)
    .attr('r', animate ? 0 : d => Math.max(1.6, r(d.people)));
  if (animate) dots.transition().delay(d => 300 + 1500 * Math.hypot(d.p[0] - bal[0], d.p[1] - bal[1]) / far).duration(600).ease(d3.easeCubicOut)
    .attr('r', d => Math.max(1.6, r(d.people)));
  // the most common five-stop route, stop to stop
  const stops = D.route.slice().sort((a, b) => a.stop - b.stop).map(d => proj([d.lon, d.lat])).filter(Boolean);
  const arc = (a, b) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    return `M${a[0]},${a[1]} Q${mx - dy * .25},${my + dx * .25} ${b[0]},${b[1]}`;
  };
  // the route draws itself stop by stop after the facilities appear
  const legs = svg.append('g').selectAll('path').data(d3.pairs(stops)).join('path').attr('d', ([a, b]) => arc(a, b))
    .attr('fill', 'none').attr('stroke', '#ff5a4e').attr('stroke-width', 2).attr('stroke-linecap', 'round');
  const stopDots = svg.append('g').selectAll('circle').data(stops).join('circle').attr('cx', d => d[0]).attr('cy', d => d[1]).attr('r', 3.2).attr('fill', '#fff');
  if (animate) {
    const lens = legs.nodes().map(n => n.getTotalLength()), total = d3.sum(lens), start = 2200, dur = 2600;
    let t0 = start;
    legs.each(function (_, i) {
      const len = lens[i], d = dur * len / total, delay = t0; t0 += d;
      d3.select(this).attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len)
        .transition().delay(delay).duration(d).ease(d3.easeLinear).attr('stroke-dashoffset', 0);
    });
    let acc = start;
    stopDots.attr('opacity', 0).transition().delay((_, i) => { const v = acc; if (i < lens.length) acc += dur * lens[i] / total; return v; })
      .duration(200).attr('opacity', 1);
  }
  const lab = (p, t, dx, anchor, dy = 4) => p && svg.append('text').attr('x', p[0] + dx).attr('y', p[1] + dy).attr('text-anchor', anchor)
    .attr('fill', '#e8e8e8').style('font', '600 12px Poppins, sans-serif').text(t);
  narrow ? lab(proj([-76.6197, 39.298]), 'Baltimore', 0, 'end', -16) : lab(proj([-76.6197, 39.298]), 'Baltimore', 10, 'start');
  const alex = lab(proj([-92.4838, 31.2601]), 'Alexandria, La.', -10, 'end');
  if (animate && alex) alex.attr('opacity', 0).transition().delay(4800).duration(400).attr('opacity', 1);
}
