// main.js — loads the CSVs and draws every chart.
// Each chart lives in its own file in js/charts/; this file only connects them to the page.
import { loadData } from './lib/data.js';
import { setupScrolly } from './lib/scrolly.js';
import { drawHeroDots } from './charts/heroDots.js';
import { drawHeroRoute } from './charts/heroRoute.js';
import { drawHeroLines } from './charts/heroLines.js';
import { drawHeroRoom } from './charts/heroRoom.js';
import { drawGrowth } from './charts/growth.js';
import { drawG287 } from './charts/g287.js';
import { drawDetainers } from './charts/detainers.js';
import { createArrestMap } from './charts/arrestMap.js';
import { drawHoldroom } from './charts/holdroom.js';
import { createDetentionMap } from './charts/detentionMap.js';
import { drawCustody } from './charts/custody.js';
import { createGlobe, GLOBE_LEGEND } from './charts/globe.js';
import { drawShareMonthly } from './charts/shareMonthly.js';
import { drawFacilityCounts } from './charts/facilityCounts.js';
import { drawStateShare } from './charts/stateShare.js';
import { drawCitizenship } from './charts/citizenship.js';
import { drawCitizenshipArrests } from './charts/citizenshipArrests.js';
import { drawDetainerOutcomes } from './charts/detainerOutcomes.js';

const $ = id => document.getElementById(id);

// Reading progress bar under the masthead
function progress() {
  const bar = document.querySelector('.progress'), h = document.documentElement;
  const update = () => { bar.style.width = (100 * h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) + '%'; };
  addEventListener('scroll', update, { passive: true }); update();
}

// What each chart needs: data tables and map shapes. Only what's on this page gets loaded.
export const NEEDS = {
  'herodots': [['growth']], 'heroroute': [['facilities', 'route'], ['us-states']], 'herolines': [['custody']],
  'c-growth': [['growth']], 'c-share': [['share_monthly']], 'c-287g': [['g287']], 'c-det': [['detainers']],
  'c-hold': [['holdroom']], 'c-custody': [['custody']], 'c-faccount': [['facility_counts']], 'c-states': [['states']],
  'c-cit': [['citizenship']], 'c-det-outcomes': [['detainer_outcomes']], 'c-cit-arrests': [['citizenship_arrests']],
  'sc-arrests': [['counties', 'cities'], ['maryland']], 'sc-detention': [['facilities', 'route'], ['us-states']],
  'sc-globe': [['destinations', 'routes', 'countries'], ['world']],
};

async function init() {
  const on = Object.entries(NEEDS).filter(([id]) => $(id));
  const keys = [...new Set(on.flatMap(([, n]) => n[0]))], geo = [...new Set(on.flatMap(([, n]) => n[1] || []))];
  const D = await loadData('data/', keys, geo);
  progress();

  // Charts whose layout depends on width are redrawn when the width changes.
  // Each story page has only some of the charts, so draw a chart only if its container is on the page.
  const has = id => !!$(id);
  const statics = [
    ['herodots', () => drawHeroDots($('herodots'), D.growth)],
    ['heroroute', () => drawHeroRoute($('heroroute'), D)],
    ['herolines', () => drawHeroLines($('herolines'), D.custody)],
    ['heroroom', () => drawHeroRoom($('heroroom'))],
    ['c-growth', () => drawGrowth($('c-growth'), D.growth)],
    ['c-share', () => drawShareMonthly($('c-share'), D.share_monthly)],
    ['c-287g', () => drawG287($('c-287g'), D.g287)],
    ['c-det', () => drawDetainers($('c-det'), D.detainers)],
    ['c-hold', () => drawHoldroom($('c-hold'), D.holdroom)],
    ['c-custody', () => drawCustody($('c-custody'), D.custody)],
    ['c-faccount', () => drawFacilityCounts($('c-faccount'), D.facility_counts)],
    ['c-states', () => drawStateShare($('c-states'), D.states)],
    ['c-cit', () => drawCitizenship($('c-cit'), D.citizenship)],
    ['c-det-outcomes', () => drawDetainerOutcomes($('c-det-outcomes'), D.detainer_outcomes)],
    ['c-cit-arrests', () => drawCitizenshipArrests($('c-cit-arrests'), D.citizenship_arrests)],
  ].filter(([id]) => has(id)).map(([, f]) => f);
  statics.forEach(f => f());

  // Scrollytelling 1: the Maryland arrest map changes with each step.
  if (has('sc-arrests')) {
    const STEP_MODES = ['all', 'norecord', 'office', 'community', 'norecord'];
    const scMap = createArrestMap($('m-arrests'), D);
    $('sc-scale').innerHTML = scMap.legendHTML();
    setupScrolly($('sc-arrests'), s => {
      scMap.setMode(STEP_MODES[s], s === 4);
      $('sc-scale').style.opacity = s === 4 ? 1 : 0;
    });
  }

  // Scrollytelling 2: where people were held.
  if (has('sc-detention')) {
    const det = createDetentionMap($('m-detention'), D);
    setupScrolly($('sc-detention'), s => det.setStep(s));
  }

  // Scrollytelling 3: the deportation globe.
  if (has('sc-globe')) {
    const globe = createGlobe($('m-globe'), D);
    document.querySelectorAll('.globe-legend').forEach(el => { el.innerHTML = GLOBE_LEGEND; });
    setupScrolly($('sc-globe'), s => globe.setStep(s));
  }

  let lastW = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === lastW) return;          // ignore mobile address-bar height changes
    lastW = innerWidth;
    clearTimeout(init.t);
    init.t = setTimeout(() => { statics.forEach(f => f()); }, 150);
  });
}

init().catch(err => {
  console.error(err);
  document.querySelectorAll('.viz').forEach(v => { v.innerHTML = '<p class="noscript">This chart could not load its data. The page must be served over HTTP (see README).</p>'; });
});
