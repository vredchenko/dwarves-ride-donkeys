# Can'd War Vessels Ride On Donkeys

An interactive map tracing the spread of horsemanship across human history — from the Pontic steppe domestication horizon (~3500 BCE) through the Plains Nations' transformation in the 1680s.

Live at [candwarvesridedonkeys.tinkerlab.dev](https://candwarvesridedonkeys.tinkerlab.dev)

## What it shows

- **14 historical events** spanning domestication, chariot, cavalry, saddle, and stirrup technology, each with sources
- **7 divine associations** (Epona, Poseidon Hippios, the Ashvins, Sleipnir, Hayagriva, Tianma, the Dioscuri) toggled separately
- A timeline slider from 4000 BCE to 1800 CE
- Click any marker for description and references

## Stack

- React 18 + TypeScript
- D3 v7 (map projection, SVG rendering)
- topojson-client (world-atlas 110m)
- Vite
- Bun

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
```

Output in `dist/`. Deployed automatically to GitHub Pages on push to `main`.

## Data & references

All events include primary and secondary archaeological/historical sources. Uncertainty ranges on dates reflect genuine scholarly dispute rather than imprecision. See individual marker popups for full citations.

Notable contested points:

- Botai/Dereivka riding evidence (~3500 BCE): debated since the original Dereivka 'cult stallion' may be a later intrusive burial
- Lynn White Jr.'s stirrup-feudalism thesis (1962): historically important but considered overstated as monocausal
- Plains Nations adoption speed: the two-generation figure is well attested but varies by nation

## Contributing

Data additions and corrections welcome via PR. Each event in `src/data.ts` requires at minimum one peer-reviewed source.
