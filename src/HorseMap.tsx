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

  // Draw base map — runs once on data load
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
      .attr("fill", "#071220");

    g.append("path")
      .datum(d3.geoGraticule()())
      .attr("d", pathGen)
      .attr("fill", "none")
      .attr("stroke", "#0c1e2e")
      .attr("stroke-width", 0.5);

    const countries = topojson.feature(worldData, worldData.objects.countries);
    g.selectAll<SVGPathElement, d3.GeoPermissibleObjects>("path.land")
      .data(countries.type === "FeatureCollection" ? countries.features : [])
      .join("path")
      .attr("class", "land")
      .attr("d", pathGen)
      .attr("fill", "#182838")
      .attr("stroke", "#243848")
      .attr("stroke-width", 0.4);

    g.append("path")
      .datum({ type: "Sphere" } as d3.GeoPermissibleObjects)
      .attr("d", pathGen)
      .attr("fill", "none")
      .attr("stroke", "#243848")
      .attr("stroke-width", 1);
  }, [worldData, makeProjection]);

  // Draw event and divine markers — runs on interaction state changes
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
          .attr("r", 14)
          .attr("fill", "none")
          .attr("stroke", col)
          .attr("stroke-width", 1)
          .attr("opacity", 0.25);
        eg.append("circle")
          .attr("r", 9)
          .attr("fill", "none")
          .attr("stroke", col)
          .attr("stroke-width", 1)
          .attr("opacity", 0.45);
      }

      eg.append("circle")
        .attr("r", isSel ? 7.5 : 5.5)
        .attr("fill", col)
        .attr("stroke", isSel ? "#fff" : "#071220")
        .attr("stroke-width", isSel ? 1.5 : 0.7)
        .attr("opacity", 0.92);

      if (visible.length <= 10 || isSel) {
        eg.append("text")
          .attr("x", 9)
          .attr("y", 4)
          .text(evt.label)
          .attr("fill", isSel ? "#fff" : "#8fa5b5")
          .attr("font-size", "9.5px")
          .attr("font-family", "Georgia, serif")
          .style("pointer-events", "none");
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
          .attr("points", "0,-8 6,0 0,8 -6,0")
          .attr("fill", isSel ? "#dda0ff" : "#9040c8")
          .attr("stroke", isSel ? "#fff" : "#071220")
          .attr("stroke-width", isSel ? 1.5 : 0.7)
          .attr("opacity", 0.9);

        if (isSel) {
          dg.append("text")
            .attr("x", 9)
            .attr("y", 4)
            .text(deity.label)
            .attr("fill", "#dda0ff")
            .attr("font-size", "9.5px")
            .attr("font-family", "Georgia, serif")
            .style("pointer-events", "none");
        }
      }
    }
  }, [year, selected, showDivine, makeProjection]);

  const visCount = EVENTS.filter((e) => e.year <= year).length;

  return (
    <div className="bg-bg-primary text-text-body flex h-screen flex-col overflow-hidden font-serif">
      <header className="border-border-dark bg-bg-header flex shrink-0 items-center justify-between border-b px-4 py-[0.5625rem]">
        <div>
          <div className="text-gold text-[0.9375rem] font-bold tracking-[0.07em] uppercase">
            The Spread of Horsemanship
          </div>
          <div className="text-text-muted mt-[0.125rem] text-[0.625rem] tracking-[0.04em]">
            Archaeological &amp; historical record · ~3500 BCE – 1800 CE
          </div>
        </div>
        <div className="flex items-center gap-[1.125rem]">
          <label className="text-text-toggle flex cursor-pointer items-center text-[0.6875rem]">
            <input
              type="checkbox"
              checked={showDivine}
              onChange={(e) => setShowDivine(e.target.checked)}
              className="accent-divine mr-1.5"
            />
            Divine associations
          </label>
          <div className="flex flex-wrap items-center gap-[0.5625rem]">
            {Object.entries(TYPE_COLORS).map(([t, c]) => (
              <div key={t} className="text-text-label flex items-center gap-1 text-[0.5625rem]">
                <div className="size-2 shrink-0 rounded-full" style={{ background: c }} />
                <span>{TYPE_LABELS[t]}</span>
              </div>
            ))}
            {showDivine && (
              <div className="text-text-label flex items-center gap-1 text-[0.5625rem]">
                <svg width="10" height="10" viewBox="-6 -8 12 16">
                  <polygon points="0,-8 6,0 0,8 -6,0" fill="#9040c8" />
                </svg>
                <span>Divine</span>
              </div>
            )}
          </div>
        </div>
      </header>

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
          <aside className="border-border-dark bg-bg-panel w-[17rem] shrink-0 overflow-y-auto border-l p-[0.8125rem] text-[0.6875rem]">
            <div className="mb-[0.625rem] flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-gold text-[0.8125rem] leading-snug font-bold">
                  {selected.label}
                </div>
                <div className="text-text-muted mt-[0.125rem] text-[0.625rem] italic">
                  {selected.sublabel}
                </div>
                {isHistoricalEvent(selected) && (
                  <div
                    className="mt-1 text-[0.6875rem] font-bold"
                    style={{ color: TYPE_COLORS[selected.type] }}
                  >
                    {formatYear(selected.year)}
                    {selected.uncertainty ? ` ± ${selected.uncertainty} yrs` : ""}
                  </div>
                )}
                {!isHistoricalEvent(selected) && (
                  <div className="text-divine mt-1 text-[0.6875rem] font-bold">
                    Divine / mythological
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-text-muted shrink-0 cursor-pointer border-none bg-transparent p-0 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-text-desc mb-3 text-[0.6875rem] leading-[1.7]">
              {selected.description}
            </p>
            <div className="border-border-dark border-t pt-[0.625rem]">
              <div className="text-text-dim mb-[0.4375rem] text-[0.53125rem] tracking-[0.1em] uppercase">
                References
              </div>
              {selected.refs.map((r, i) => (
                <div
                  key={i}
                  className="text-text-dim mb-[0.375rem] text-[0.5625rem] leading-[1.65] italic"
                >
                  {r}
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      <footer className="border-border-dark bg-bg-header shrink-0 border-t px-4 pt-[0.5625rem] pb-2">
        <div className="flex items-center gap-3">
          <div className="text-gold min-w-[6.25rem] shrink-0 text-right text-[0.9375rem] font-bold tracking-[0.02em]">
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
            <div className="text-text-tick mt-1 flex justify-between text-[0.53125rem]">
              {([-4000, -3000, -2000, -1000, 0, 500, 1000, 1500] as const).map((y) => (
                <span key={y}>{y < 0 ? `${-y} BCE` : y === 0 ? "1 CE" : `${y}`}</span>
              ))}
            </div>
          </div>
          <div className="text-text-muted min-w-16 shrink-0 text-center text-[0.6875rem] leading-[1.4]">
            {visCount} / {EVENTS.length}
            <br />
            <span className="text-text-dim text-[0.5625rem]">events shown</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
