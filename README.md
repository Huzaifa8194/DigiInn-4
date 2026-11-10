# ONYX PLUS GROUP: corporate website

```
Onyx/
  site/       the website (Astro, bilingual FR/EN). Start here.
  assets/
    client/   original photos and logo supplied by the client, renamed by content
    stock/    free Unsplash photos used on the site, with sources.json
  _archive/   earlier homepage attempts (design-01..03, previews, notes), kept for reference
```

## Run the site

```powershell
cd site
npm install
npm run dev        # http://127.0.0.1:4321 , live reload
npm run build      # production output in site/dist
```

`site/dist` is a static folder: it can be deployed to any static host (Vercel, Netlify,
Cloudflare Pages, or an ordinary web server).

All text lives in `site/src/data/site.ts` (French and English side by side). The design record
is `site/DESIGN.md`.

## Client photo names

| Original file | Now |
|---|---|
| logo.jpeg | assets/client/onyx-logo.jpeg |
| Team Pic.jpeg | assets/client/team-kernel-store-4.jpeg |
| Team Pic 2.jpeg | assets/client/team-kernel-store-6.jpeg |
| Workplace pic.jpeg | assets/client/raw-nut-warehouse-inspection.jpeg |
| Indivisual.jpeg | assets/client/kernel-store-portrait.jpeg |
| Indivisual 2.jpeg | assets/client/sorting-line-portrait.jpeg |
| Indivisual 3.jpeg | assets/client/raw-nut-warehouse-portrait.jpeg |
| Indivisual 4.jpeg | assets/client/siat-2026-outdoor.jpeg |
| Indivisual 5.jpeg | assets/client/trade-fair-stand.jpeg |
| Indivisual 6.jpeg | assets/client/siat-2026-forum-banner.jpeg |
