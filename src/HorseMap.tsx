import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { SelectedEntry } from "./types.ts";
import { EVENTS, DIVINE, TYPE_COLORS, TYPE_LABELS } from "./data.ts";
import worldAtlas from "world-atlas/countries-110m.json";

const W = 940;
const H = 490;
const MIN_YEAR = -4000;
const MAX_YEAR = 1800;

function formatYear(y: number): string {
  return y < 0 ? `${Math.abs(y).toLocaleString()} BCE` : `${y.toLocaleString()} CE`;
}

function isHistoricalEvent(entry: SelectedEntry): entry is import("./types.ts").HistoricalEvent {
  return "type" in entry;
}

type WorldTopology = Topology<{ countries: GeometryCollection }>;

export default function HorseMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const worldData = worldAtlas as unknown as WorldTopology;
  const [year, setYear] = useState(MIN_YEAR);
  const [selected, setSelected] = useState<SelectedEntry | null>(null);
  const [showDivine, setShowDivine] = useState(false);

  const makeProjection = useCallback(
    () =>
      d3
        .geoNaturalEarth1()
        .scale(150)
        .translate([W / 2, H / 2 + 12]),
    [],
  );

  // Draw base map
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.select<SVGGElement>("#basemap").remove();
    const g = svg.insert<SVGGElement>("g", ":first-child").attr("id", "basemap");

    const proj = makeProjection();
    const pathGen = d3.geoPath(proj);

    g.append("path")
      .datum({ type: "Sphere" } as d3.GeoPermissibleObjects)
      .attr("d", pathGen)
      .attr("fill", "#111d38");

    g.append("path")
      .datum(d3.geoGraticule()())
      .attr("d", pathGen)
      .attr("fill", "none")
      .attr("stroke", "#243658")
      .attr("stroke-width", 0.4);

    const countries = topojson.feature(worldData, worldData.objects.countries);
    g.selectAll<SVGPathElement, d3.GeoPermissibleObjects>("path.land")
      .data(countries.type === "FeatureCollection" ? countries.features : [])
      .join("path")
      .attr("class", "land")
      .attr("d", pathGen)
      .attr("fill", "#c4b99a")
      .attr("stroke", "#a89878")
      .attr("stroke-width", 0.4);

    g.append("path")
      .datum({ type: "Sphere" } as d3.GeoPermissibleObjects)
      .attr("d", pathGen)
      .attr("fill", "none")
      .attr("stroke", "#a89878")
      .attr("stroke-width", 1);
  }, [worldData, makeProjection]);

  // Draw event and divine markers
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.select<SVGGElement>("#eventlayer").remove();
    const g = svg.append<SVGGElement>("g").attr("id", "eventlayer");

    const proj = makeProjection();
    const visible = EVENTS.filter((e) => e.year <= year);
    const maxYearSeen = visible.length ? Math.max(...visible.map((e) => e.year)) : null;

    for (const evt of visible) {
      const coords = proj([evt.lng, evt.lat]);
      if (!coords) continue;
      const [x, y] = coords;
      const col = TYPE_COLORS[evt.type];
      const isSel = selected?.id === evt.id;
      const isNew = evt.year === maxYearSeen;

      const eg = g
        .append("g")
        .attr("transform", `translate(${x},${y})`)
        .style("cursor", "pointer")
        .on("click", () => setSelected((s) => (s?.id === evt.id ? null : evt)));

      if (isNew) {
        eg.append("circle")
          .attr("r", 16)
          .attr("fill", "none")
          .attr("stroke", col)
          .attr("stroke-width", 1.2)
          .attr("opacity", 0.2);
        eg.append("circle")
          .attr("r", 10)
          .attr("fill", "none")
          .attr("stroke", col)
          .attr("stroke-width", 1.2)
          .attr("opacity", 0.4);
      }

      eg.append("circle")
        .attr("r", isSel ? 8 : 6)
        .attr("fill", col)
        .attr("stroke", isSel ? "#faf8f3" : "#111d38")
        .attr("stroke-width", isSel ? 2 : 1)
        .attr("opacity", 0.95);

      if (visible.length <= 10 || isSel) {
        eg.append("text")
          .attr("x", 10)
          .attr("y", 4)
          .text(evt.label)
          .attr("fill", isSel ? "#faf8f3" : "#d4cbb8")
          .attr("font-size", "10px")
          .attr("font-family", "'Source Serif 4', Georgia, serif")
          .attr("font-weight", isSel ? "600" : "400")
          .style("pointer-events", "none")
          .style("text-shadow", "0 1px 3px rgba(0,0,0,0.6)");
      }
    }

    if (showDivine) {
      for (const deity of DIVINE) {
        const coords = proj([deity.lng, deity.lat]);
        if (!coords) continue;
        const [x, y] = coords;
        const isSel = selected?.id === deity.id;

        const dg = g
          .append("g")
          .attr("transform", `translate(${x},${y})`)
          .style("cursor", "pointer")
          .on("click", () => setSelected((s) => (s?.id === deity.id ? null : deity)));

        dg.append("polygon")
          .attr("points", "0,-9 7,0 0,9 -7,0")
          .attr("fill", isSel ? "#c080e0" : "#8a3a8a")
          .attr("stroke", isSel ? "#faf8f3" : "#111d38")
          .attr("stroke-width", isSel ? 2 : 1)
          .attr("opacity", 0.92);

        if (isSel) {
          dg.append("text")
            .attr("x", 10)
            .attr("y", 4)
            .text(deity.label)
            .attr("fill", "#c080e0")
            .attr("font-size", "10px")
            .attr("font-family", "'Source Serif 4', Georgia, serif")
            .attr("font-weight", "600")
            .style("pointer-events", "none")
            .style("text-shadow", "0 1px 3px rgba(0,0,0,0.6)");
        }
      }
    }
  }, [year, selected, showDivine, makeProjection]);

  const visCount = EVENTS.filter((e) => e.year <= year).length;

  return (
    <div className="bg-parchment font-body text-ink flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="border-border bg-ivory flex shrink-0 items-center gap-6 border-b px-6 py-2.5">
        <div className="flex shrink-0 items-baseline gap-3">
          <h1 className="font-display text-ink text-xl leading-none font-bold tracking-wide whitespace-nowrap">
            The Spread of Horsemanship
          </h1>
          <span className="text-ink-faint text-xs tracking-wide whitespace-nowrap">
            c. 3500 BCE – 1800 CE
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <label className="text-ink-muted hover:text-ink flex cursor-pointer items-center gap-1.5 text-xs whitespace-nowrap transition-colors">
            <input
              type="checkbox"
              checked={showDivine}
              onChange={(e) => setShowDivine(e.target.checked)}
              className="accent-divine"
            />
            Divine associations
          </label>
          <div className="flex items-center gap-2.5">
            {Object.entries(TYPE_COLORS).map(([t, c]) => (
              <div key={t} className="text-ink-faint flex items-center gap-1 text-[0.6875rem]">
                <div className="size-2 shrink-0 rounded-full" style={{ background: c }} />
                <span>{TYPE_LABELS[t]}</span>
              </div>
            ))}
            {showDivine && (
              <div className="text-ink-faint flex items-center gap-1 text-[0.6875rem]">
                <svg width="9" height="9" viewBox="-7 -9 14 18">
                  <polygon points="0,-9 7,0 0,9 -7,0" fill="#8a3a8a" />
                </svg>
                <span>Divine</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Map + Panel */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="bg-bg-map relative flex-1 overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="block h-full w-full"
          />
        </div>

        {selected && (
          <aside className="border-border bg-ivory w-72 shrink-0 overflow-y-auto border-l p-5 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex-1">
                <h2 className="font-display text-ink text-lg leading-snug font-bold">
                  {selected.label}
                </h2>
                <p className="text-ink-muted mt-0.5 text-sm italic">{selected.sublabel}</p>
                {isHistoricalEvent(selected) && (
                  <p
                    className="mt-1.5 text-sm font-semibold"
                    style={{ color: TYPE_COLORS[selected.type] }}
                  >
                    {formatYear(selected.year)}
                    {selected.uncertainty ? ` ± ${selected.uncertainty} yrs` : ""}
                  </p>
                )}
                {!isHistoricalEvent(selected) && (
                  <p className="text-divine mt-1.5 text-sm font-semibold">Divine / mythological</p>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-ink-faint hover:text-ink shrink-0 cursor-pointer rounded border-none bg-transparent p-1 text-lg leading-none transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-ink-light mb-4 text-sm leading-relaxed">{selected.description}</p>
            <div className="border-border-light border-t pt-3">
              <h3 className="text-ink-faint mb-2 text-[0.625rem] font-semibold tracking-[0.15em] uppercase">
                References
              </h3>
              {selected.refs.map((r, i) => (
                <p key={i} className="text-ink-muted mb-2 text-xs leading-relaxed italic">
                  {r}
                </p>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Timeline footer */}
      <footer className="border-border bg-ivory shrink-0 border-t px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="font-display text-terracotta min-w-28 shrink-0 text-right text-xl font-bold tracking-wide">
            {formatYear(year)}
          </div>
          <div className="flex-1">
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={10}
              value={year}
              onChange={(e) => {
                setYear(Number(e.target.value));
                setSelected(null);
              }}
              className="w-full"
            />
            <div className="text-ink-faint mt-1 flex justify-between text-[0.6875rem]">
              {([-4000, -3000, -2000, -1000, 0, 500, 1000, 1500] as const).map((y) => (
                <span key={y}>{y < 0 ? `${-y} BCE` : y === 0 ? "1 CE" : `${y}`}</span>
              ))}
            </div>
          </div>
          <div className="text-ink-muted min-w-16 shrink-0 text-center text-sm leading-snug">
            {visCount} / {EVENTS.length}
            <br />
            <span className="text-ink-faint text-xs">events shown</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
