# After an ICE arrest in Maryland

Interactive data story by Mehedi Marof, Capital News Service. Live at https://mehedimarof.github.io/after-an-ice-arrest-in-maryland-most-people-were-held-out-of-state-many-were-moved-again-and-again/

Part of a three-story series on ICE in Maryland:
- Who ICE arrested in Maryland: https://mehedimarof.github.io/ices-arrests-in-maryland-nearly-doubled-this-year-the-growth-is-people-with-no-criminal-record/
- After an ICE arrest in Maryland: https://mehedimarof.github.io/after-an-ice-arrest-in-maryland-most-people-were-held-out-of-state-many-were-moved-again-and-again/
- Maryland's 287(g) ban and the routes it left open: https://mehedimarof.github.io/maryland-banned-287g-local-law-enforcers-still-can-help-if-they-want-to/ (coming soon)

Data: ICE arrest, detainer and detention records obtained by the [Deportation Data Project](https://deportationdata.org/data/processed/ice.html) through Freedom of Information Act lawsuits, covering Oct. 1, 2022, through Aug. 6, 2026. The tables below were produced by the CNS analysis notebook (separate repository).

## Files

```
index.html     the story
css/           page and chart styles
js/main.js     loads this page's data and draws its charts
js/lib/        data loading, scrollytelling (Scrollama), shared chart helpers
js/charts/     one file per chart (shared across the series; this page uses only some)
data/          the tables this story's charts read
assets/        images
```

Data tables in this repo:

| File |
|---|
| `data/citizenship_arrests.csv` |
| `data/countries.csv` |
| `data/destinations.csv` |
| `data/facilities.csv` |
| `data/facility_counts.csv` |
| `data/holdroom.csv` |
| `data/route.csv` |
| `data/routes.csv` |

## Run locally

The page loads CSV files, so it must be served over HTTP: `python3 -m http.server` in this folder, then open http://localhost:8000.

## Publish

Settings → Pages → Deploy from a branch → `main` / root.

Libraries: D3 7.8.5 (cdnjs) and Scrollama 3.2.0 (jsDelivr). Fonts: Source Serif 4 and Poppins (Google Fonts).
