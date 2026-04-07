import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { SelectedEntry } from "./types.ts";
import { EVENTS, DIVINE, TYPE_COLORS, TYPE_LABELS } from "./data.ts";

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
  const [worldData, setWorldData] = useState<WorldTopology | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [year, setYear] = useState(MIN_YEAR);
  const [selected, setSelected] = useState<SelectedEntry | null>(null);
  const [showDivine, setShowDivine] = useState(false);

  // Load world atlas
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((data: WorldTopology) => {
        setWorldData(data);
        setReady(true);
      })
      .catch((e: Error) => setLoadError(e.message));
  }, []);

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
    if (!ready || !worldData || !svgRef.current) return;
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
  }, [ready, worldData, makeProjection]);

  // Draw event and divine markers — runs on interaction state changes
  useEffect(() => {
    if (!ready || !svgRef.current) return;
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
  }, [ready, year, selected, showDivine, makeProjection]);

  const visCount = EVENTS.filter((e) => e.year <= year).length;

  return (
    <div style={s.root}>
      <style>{sliderCss}</style>

      <header style={s.header}>
        <div>
          <div style={s.title}>The Spread of Horsemanship</div>
          <div style={s.subtitle}>Archaeological &amp; historical record · ~3500 BCE – 1800 CE</div>
        </div>
        <div style={s.headerRight}>
          <label style={s.divineToggle}>
            <input
              type="checkbox"
              checked={showDivine}
              onChange={(e) => setShowDivine(e.target.checked)}
              style={{ marginRight: 6, accentColor: "#9040c8" }}
            />
            Divine associations
          </label>
          <div style={s.legend}>
            {Object.entries(TYPE_COLORS).map(([t, c]) => (
              <div key={t} style={s.legendItem}>
                <div style={{ ...s.legendDot, background: c }} />
                <span>{TYPE_LABELS[t]}</span>
              </div>
            ))}
            {showDivine && (
              <div style={s.legendItem}>
                <svg width="10" height="10" viewBox="-6 -8 12 16">
                  <polygon points="0,-8 6,0 0,8 -6,0" fill="#9040c8" />
                </svg>
                <span>Divine</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={s.body}>
        <div style={s.mapWrap}>
          {loadError && (
            <div style={s.mapMsg}>
              <span style={{ color: "#e06858" }}>Map error: {loadError}</span>
            </div>
          )}
          {!ready && !loadError && <div style={s.mapMsg}>Loading geographic data…</div>}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            style={s.svg}
          />
        </div>

        {selected && (
          <aside style={s.panel}>
            <div style={s.panelHead}>
              <div style={{ flex: 1 }}>
                <div style={s.panelName}>{selected.label}</div>
                <div style={s.panelSub}>{selected.sublabel}</div>
                {isHistoricalEvent(selected) && (
                  <div
                    style={{
                      ...s.panelYear,
                      color: TYPE_COLORS[selected.type],
                    }}
                  >
                    {formatYear(selected.year)}
                    {selected.uncertainty ? ` ± ${selected.uncertainty} yrs` : ""}
                  </div>
                )}
                {!isHistoricalEvent(selected) && (
                  <div style={{ ...s.panelYear, color: "#9040c8" }}>Divine / mythological</div>
                )}
              </div>
              <button onClick={() => setSelected(null)} style={s.closeBtn}>
                ×
              </button>
            </div>
            <p style={s.panelDesc}>{selected.description}</p>
            <div style={s.refsWrap}>
              <div style={s.refsHead}>References</div>
              {selected.refs.map((r, i) => (
                <div key={i} style={s.refLine}>
                  {r}
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      <footer style={s.footer}>
        <div style={s.timeRow}>
          <div style={s.yearBig}>{formatYear(year)}</div>
          <div style={s.sliderWrap}>
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
              style={{ width: "100%" }}
            />
            <div style={s.ticks}>
              {([-4000, -3000, -2000, -1000, 0, 500, 1000, 1500] as const).map((y) => (
                <span key={y} style={s.tick}>
                  {y < 0 ? `${-y} BCE` : y === 0 ? "1 CE" : `${y}`}
                </span>
              ))}
            </div>
          </div>
          <div style={s.counter}>
            {visCount} / {EVENTS.length}
            <br />
            <span style={{ color: "#2a4050", fontSize: "9px" }}>events shown</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const sliderCss = `
  input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
  input[type=range]::-webkit-slider-runnable-track { background: #1a2d3d; height: 3px; border-radius: 2px; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #e8c97a; margin-top: -5.5px; cursor: pointer; border: 2px solid #0d1117; }
  input[type=range]::-moz-range-track { background: #1a2d3d; height: 3px; border-radius: 2px; }
  input[type=range]::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #e8c97a; cursor: pointer; border: 2px solid #0d1117; }
`;

const s: Record<string, React.CSSProperties> = {
  root: {
    background: "#0d1117",
    color: "#c8b898",
    fontFamily: "Georgia, 'Times New Roman', serif",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "9px 16px",
    borderBottom: "1px solid #14202d",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    background: "#090d13",
  },
  title: {
    color: "#e8c97a",
    fontSize: "15px",
    fontWeight: "bold",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
  },
  subtitle: {
    color: "#3a5060",
    fontSize: "10px",
    marginTop: "2px",
    letterSpacing: "0.04em",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  divineToggle: {
    display: "flex",
    alignItems: "center",
    fontSize: "11px",
    color: "#7080a0",
    cursor: "pointer",
  },
  legend: {
    display: "flex",
    gap: "9px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "9px",
    color: "#4a6070",
  },
  legendDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  body: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },
  mapWrap: { flex: 1, position: "relative", overflow: "hidden", background: "#071220" },
  mapMsg: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3a5060",
    fontSize: "12px",
    letterSpacing: "0.06em",
    pointerEvents: "none",
  },
  svg: { width: "100%", height: "100%", display: "block" },
  panel: {
    width: "272px",
    flexShrink: 0,
    background: "#0a0f18",
    borderLeft: "1px solid #14202d",
    padding: "13px",
    overflowY: "auto",
    fontSize: "11px",
  },
  panelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
    gap: "8px",
  },
  panelName: { color: "#e8c97a", fontSize: "13px", fontWeight: "bold", lineHeight: "1.3" },
  panelSub: { color: "#3a5060", fontSize: "10px", fontStyle: "italic", marginTop: "2px" },
  panelYear: { fontSize: "11px", marginTop: "4px", fontWeight: "bold" },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#3a5060",
    fontSize: "20px",
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
    flexShrink: 0,
  },
  panelDesc: { color: "#7a9aaa", lineHeight: "1.7", margin: "0 0 12px 0", fontSize: "11px" },
  refsWrap: { borderTop: "1px solid #14202d", paddingTop: "10px" },
  refsHead: {
    color: "#2a4050",
    fontSize: "8.5px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "7px",
  },
  refLine: {
    color: "#2a4050",
    fontSize: "9px",
    lineHeight: "1.65",
    marginBottom: "6px",
    fontStyle: "italic",
  },
  footer: {
    padding: "9px 16px 8px",
    borderTop: "1px solid #14202d",
    background: "#090d13",
    flexShrink: 0,
  },
  timeRow: { display: "flex", alignItems: "center", gap: "12px" },
  yearBig: {
    color: "#e8c97a",
    fontSize: "15px",
    fontWeight: "bold",
    minWidth: "100px",
    textAlign: "right",
    letterSpacing: "0.02em",
    flexShrink: 0,
  },
  sliderWrap: { flex: 1 },
  ticks: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "8.5px",
    color: "#1e3040",
    marginTop: "4px",
  },
  tick: {},
  counter: {
    color: "#3a5060",
    fontSize: "11px",
    textAlign: "center",
    minWidth: "64px",
    lineHeight: "1.4",
    flexShrink: 0,
  },
};
