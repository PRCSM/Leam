"use client";

import { DashHead } from "@/components/dashboard/DashboardShell";
import { LineChart, StackedBars, Stat } from "@/components/dashboard/Charts";
import { REVENUE_SERIES } from "@/lib/data";

const GROWTH = [
  { x: "May", y: 3120 },
  { x: "Jun", y: 3480 },
  { x: "Jul", y: 3910 },
  { x: "Aug", y: 4250 },
  { x: "Sep", y: 4790 },
  { x: "Oct", y: 5320 },
];
const TOP_ROOMS = [
  { t: "Behind the Scenes — Ep. 109", a: 412, r: "71%" },
  { t: "Listener stage: hot takes", a: 356, r: "64%" },
  { t: "Behind the Scenes — Ep. 110", a: 331, r: "69%" },
  { t: "Live taping with Mira (ticketed)", a: 298, r: "83%" },
];

export default function AnalyticsPage() {
  return (
    <>
      <DashHead title="Analytics" sub="Last 6 months · sample data" />
      <div className="stat-grid">
        <Stat label="Members" value="5,320" delta="+11%" />
        <Stat label="Monthly retention" value="91.4%" delta="+1.2%" />
        <Stat label="Room → chat rate" value="62%" delta="+4%" />
        <Stat label="Ticket conversion" value="7.8%" delta="-0.6%" />
      </div>
      <div className="panel dash-panel">
        <StackedBars
          title="Revenue by stream"
          data={REVENUE_SERIES}
          xKey="m"
          series={[
            { key: "subs", label: "Memberships" },
            { key: "tickets", label: "Tickets" },
            { key: "merch", label: "Merch" },
          ]}
        />
      </div>
      <div className="dash-cols">
        <div className="panel dash-panel">
          <LineChart title="Community size" points={GROWTH} />
        </div>
        <div className="panel dash-panel">
          <div className="panel-head">
            <b>Top rooms</b>
            <span className="tiny faint">attendance · stayed to end</span>
          </div>
          <table className="data-table">
            <tbody>
              {TOP_ROOMS.map((r) => (
                <tr key={r.t}>
                  <td>{r.t}</td>
                  <td className="num">{r.a}</td>
                  <td className="num">{r.r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
