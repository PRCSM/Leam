"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/* Categorical order validated for the dark surface (#111111):
   L 0.48–0.67, chroma ≥ 0.1, adjacent CVD ΔE ≥ 19, contrast ≥ 3:1. */
export const SERIES_COLORS = ["#A47F2C", "#5B8DEF", "#E0702F"] as const;

type Series = { key: string; label: string };

/** Stacked monthly bars with legend, hover tooltip and a table view. */
export function StackedBars<T extends Record<string, number | string>>({ data, xKey, series, unit = "K", title }: { data: T[]; xKey: keyof T; series: Series[]; unit?: string; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const W = 640;
  const H = 260;
  const pad = { t: 12, r: 8, b: 28, l: 40 };
  const totals = data.map((d) => series.reduce((s, k) => s + Number(d[k.key]), 0));
  const max = Math.ceil(Math.max(...totals) / 10) * 10;
  const bw = (W - pad.l - pad.r) / data.length;
  const barW = Math.min(36, bw * 0.5);
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const ticks = [0, max / 2, max];
  const fmt = (v: number) => `$${v.toFixed(1)}${unit}`;

  return (
    <figure className="chart">
      <figcaption className="chart-head">
        <b>{title}</b>
        <div className="chart-legend">
          {series.map((s, i) => (
            <span key={s.key}>
              <i style={{ background: SERIES_COLORS[i] }} /> {s.label}
            </span>
          ))}
          <button className="chip" aria-pressed={table} onClick={() => setTable((t) => !t)}>
            {table ? "Chart" : "Table"}
          </button>
        </div>
      </figcaption>
      {table ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              {series.map((s) => (
                <th key={s.key}>{s.label}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={String(d[xKey])}>
                <td>{String(d[xKey])}</td>
                {series.map((s) => (
                  <td key={s.key}>{fmt(Number(d[s.key]))}</td>
                ))}
                <td>{fmt(totals[i])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="chart-plot" onMouseLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}, ${data.length} months. Use the Table button for values.`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.07)" />
                <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="chart-axis">
                  ${t}
                  {unit}
                </text>
              </g>
            ))}
            {data.map((d, i) => {
              const cx = pad.l + bw * i + bw / 2;
              let acc = 0;
              return (
                <g key={i} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={0} aria-label={`${d[xKey]}: ${fmt(totals[i])}`}>
                  <rect x={cx - bw / 2} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
                  {hover === i && <rect x={cx - bw / 2 + 4} y={pad.t} width={bw - 8} height={H - pad.t - pad.b} rx={6} fill="rgba(255,255,255,0.04)" />}
                  {series.map((s, k) => {
                    const v = Number(d[s.key]);
                    const y0 = y(acc);
                    acc += v;
                    const y1 = y(acc);
                    const top = k === series.length - 1;
                    const h = Math.max(0, y0 - y1 - 2); // 2px surface gap between segments
                    return <rect key={s.key} x={cx - barW / 2} y={y1} width={barW} height={h} rx={top ? 4 : 0} fill={SERIES_COLORS[k]} />;
                  })}
                  <text x={cx} y={H - 8} textAnchor="middle" className="chart-axis">
                    {String(d[xKey])}
                  </text>
                </g>
              );
            })}
          </svg>
          {hover !== null && (
            <div className="chart-tip" style={{ left: `${((pad.l + bw * hover + bw / 2) / W) * 100}%` }} role="status">
              <b>{String(data[hover][xKey])}</b>
              {series.map((s, k) => (
                <span key={s.key}>
                  <i style={{ background: SERIES_COLORS[k] }} /> {s.label} <em>{fmt(Number(data[hover][s.key]))}</em>
                </span>
              ))}
              <span className="chart-tip-total">
                Total <em>{fmt(totals[hover])}</em>
              </span>
            </div>
          )}
        </div>
      )}
    </figure>
  );
}

/** Single-series line with crosshair tooltip. */
export function LineChart({ points, title, format = (v: number) => v.toLocaleString() }: { points: { x: string; y: number }[]; title: string; format?: (v: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 220;
  const pad = { t: 14, r: 12, b: 28, l: 48 };
  const max = Math.max(...points.map((p) => p.y)) * 1.1;
  const min = 0;
  const x = (i: number) => pad.l + ((W - pad.l - pad.r) * i) / (points.length - 1);
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - (v - min) / (max - min));
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.y)}`).join(" ");
  const area = `${d} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  return (
    <figure className="chart">
      <figcaption className="chart-head">
        <b>{title}</b>
      </figcaption>
      <div
        className="chart-plot"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (points.length - 1));
          setHover(Math.max(0, Math.min(points.length - 1, i)));
        }}
        onMouseLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: from ${format(points[0].y)} to ${format(points[points.length - 1].y)}`}>
          <defs>
            <linearGradient id="lc-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={SERIES_COLORS[1]} stopOpacity="0.22" />
              <stop offset="1" stopColor={SERIES_COLORS[1]} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(max * t)} y2={y(max * t)} stroke="rgba(255,255,255,0.07)" />
              <text x={pad.l - 8} y={y(max * t) + 4} textAnchor="end" className="chart-axis">
                {format(Math.round(max * t))}
              </text>
            </g>
          ))}
          <path d={area} fill="url(#lc-fill)" />
          <path d={d} fill="none" stroke={SERIES_COLORS[1]} strokeWidth={2} strokeLinejoin="round" />
          {points.map((p, i) => (
            <text key={p.x} x={x(i)} y={H - 8} textAnchor="middle" className="chart-axis">
              {i % 2 === 0 || i === points.length - 1 ? p.x : ""}
            </text>
          ))}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="rgba(255,255,255,0.25)" />
              <circle cx={x(hover)} cy={y(points[hover].y)} r={5} fill={SERIES_COLORS[1]} stroke="#111" strokeWidth={2} />
            </g>
          )}
        </svg>
        {hover !== null && (
          <div className="chart-tip" style={{ left: `${(x(hover) / W) * 100}%` }} role="status">
            <b>{points[hover].x}</b>
            <span>
              <em>{format(points[hover].y)}</em>
            </span>
          </div>
        )}
      </div>
    </figure>
  );
}

export function Stat({ label, value, delta, className }: { label: string; value: string; delta?: string; className?: string }) {
  const up = delta?.startsWith("+");
  return (
    <div className={cn("stat", className)}>
      <span className="small muted">{label}</span>
      <b>{value}</b>
      {delta && <span className={cn("tiny", up ? "delta-up" : "delta-down")}>{up ? "▲" : "▼"} {delta.replace(/^[+-]/, "")} vs last month</span>}
    </div>
  );
}
