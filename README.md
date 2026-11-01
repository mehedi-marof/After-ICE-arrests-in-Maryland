# After an ICE arrest in Maryland, most people were held out of state. Many were moved again and again

Interactive data story by Mehedi Marof, Capital News Service.

Live: https://mehedi-marof.github.io/After-ICE-arrests-in-Maryland/

Part of a three-story series on ICE in Maryland:
- ICE's arrests in Maryland nearly doubled this year. The growth is people with no criminal record: https://mehedi-marof.github.io/ICE-arrests-in-maryland-nearly-doubled/
- After an ICE arrest in Maryland, most people were held out of state. Many were moved again and again: https://mehedi-marof.github.io/After-ICE-arrests-in-Maryland/
- Maryland banned 287(g). Jails still can help if they want to: https://mehedi-marof.github.io/maryland-police-can-still-help-ICE/ (coming soon)

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