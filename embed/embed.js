// embed.js: draws one chart on a stand-alone embed page and tells the parent page how tall it is.
// The chart is picked by <body data-chart="...">. Charts and data are the same files the story uses.
import { loadData } from '../js/lib/data.js';
import { drawHoldroom } from '../js/charts/holdroom.js';
import { drawFacilityCounts } from '../js/charts/facilityCounts.js';
import { drawCitizenshipArrests } from '../js/charts/citizenshipArrests.js';
import { createDetentionMap } from '../js/charts/detentionMap.js';
import { createGlobe, GLOBE_LEGEND } from '../js/charts/globe.js';

const $ = id => document.getElementById(id);
const chart = document.body.dataset.chart;

function postHeight() {
  const h = Math.ceil(document.documentElement.getBoundingClientRect().height);
  parent.postMessage({ type: 'cns-embed-height', src: location.href, height: h }, '*');
}
new ResizeObserver(postHeight).observe(document.body);
addEventListener('load', postHeight);

function onWidth(draw) {
  let w = innerWidth;
  addEventListener('resize', () => { if (innerWidth === w) return; w = innerWidth; clearTimeout(onWidth.t); onWidth.t = setTimeout(() => { draw(); postHeight(); }, 150); });
}

// Tap-through version of a scrollytelling map: one button per card.
function stepper(map) {
  const buttons = [...document.querySelectorAll('.controls button')];
  const show = i => {
    const s = window.STEPS[i];
    map.setStep(i);
    $('step-text').innerHTML = s.text;
    $('step-legend').innerHTML = s.globe ? GLOBE_LEGEND : s.legend;
    buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
  };
  buttons.forEach((b, i) => b.addEventListener('click', () => show(i)));
  show(0);
}

async function init() {
  if (chart === 'holdroom') {
    const D = await loadData('../data/', ['holdroom'], []);
    const draw = () => drawHoldroom($('viz'), D.holdroom); draw(); onWidth(draw);
  } else if (chart === 'facilities') {
    const D = await loadData('../data/', ['facility_counts'], []);
    const draw = () => drawFacilityCounts($('viz'), D.facility_counts); draw(); onWidth(draw);
  } else if (chart === 'countries') {
    const D = await loadData('../data/', ['citizenship_arrests'], []);
    const draw = () => drawCitizenshipArrests($('viz'), D.citizenship_arrests); draw(); onWidth(draw);
  } else if (chart === 'held') {
    const D = await loadData('../data/', ['facilities', 'route'], ['us-states']);
    stepper(createDetentionMap($('viz'), D));
  } else if (chart === 'sent') {
    const D = await loadData('../data/', ['destinations', 'routes', 'countries'], ['world']);
    stepper(createGlobe($('viz'), D));
  }
  postHeight();
}
init().catch(err => { console.error(err); $('viz').innerHTML = '<p class="chart-note">This chart could not load.</p>'; });
