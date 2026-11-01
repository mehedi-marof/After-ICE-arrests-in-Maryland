// The data pipeline for the page: every chart reads a CSV from data/.
// These files are written by the analysis notebook (maryland_ice_notebook.qmd), Part 5.

const FILES = {
  growth: 'growth.csv', custody: 'custody.csv', g287: 'g287.csv', detainers: 'detainers.csv',
  counties: 'counties.csv', cities: 'cities.csv', holdroom: 'holdroom.csv', facilities: 'facilities.csv', route: 'route.csv',
  destinations: 'destinations.csv', routes: 'routes.csv', countries: 'countries.csv',
  share_monthly: 'share_monthly.csv', facility_counts: 'facility_counts.csv', states: 'states.csv', citizenship: 'citizenship.csv', citizenship_arrests: 'citizenship_arrests.csv',
  detainer_outcomes: 'detainer_outcomes.csv',
};

// Each story page loads only the tables its charts use (keys), so each story repo can ship only those files.
export async function loadData(base = 'data/', keys = Object.keys(FILES), geo = ['maryland', 'us-states', 'world']) {
  const entries = await Promise.all(Object.entries(FILES).filter(([key]) => keys.includes(key)).map(async ([key, file]) => {
    // autoType turns "2024-01" into a Date; months and quarters stay text so charts can compare them
    const parse = r => { const keep = { month: r.month, quarter: r.quarter }; const o = d3.autoType(r);
      for (const k in keep) if (keep[k] !== undefined) o[k] = keep[k]; return o; };
    const rows = await d3.csv(base + file, key === 'counties' ? null : parse);
    return [key, rows];
  }));
  const D = Object.fromEntries(entries);
  // pandas writes True/False and R writes TRUE/FALSE; d3.autoType only converts lowercase
  for (const [key, rows] of Object.entries(D)) if (key !== 'counties')
    rows.forEach(r => { for (const k in r) if (/^(true|false)$/i.test(r[k])) r[k] = /^true$/i.test(r[k]); });
  if (D.counties) D.counties = D.counties.map(r => ({ ...r, pop_2020: +r.pop_2020, arrests: +r.arrests, no_record: +r.no_record,
    no_record_2024: +r.no_record_2024, per_10k: +r.per_10k, eastern_shore: /^true$/i.test(r.eastern_shore) }));
  const shapes = await Promise.all(geo.map(f => d3.json(base + `geo/${f}.json`)));
  const names = { maryland: 'md', 'us-states': 'us', world: 'world' };
  D.geo = Object.fromEntries(geo.map((f, i) => [names[f], shapes[i]]));
  return D;
}

