"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const PLANS = { free: { label: "Starter", fee: 0.08, monthly: 0 }, pro: { label: "Pro", fee: 0.05, monthly: 19 } } as const;
const PROCESSING = 0.029;
const PER_TXN = 0.3;

export function EarningsCalculator() {
  const [members, setMembers] = useState(250);
  const [price, setPrice] = useState(9.99);
  const [tickets, setTickets] = useState(40);
  const [ticketPrice, setTicketPrice] = useState(12);
  const [plan, setPlan] = useState<keyof typeof PLANS>("free");

  const p = PLANS[plan];
  const gross = members * price + tickets * ticketPrice;
  const txns = members + tickets;
  const processing = gross * PROCESSING + txns * PER_TXN;
  const platform = gross * p.fee;
  const net = Math.max(0, gross - processing - platform - p.monthly);
  const fmt = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="calc" data-reveal>
      <div className="calc-inputs">
        <div className="calc-plan" role="radiogroup" aria-label="Plan">
          {(Object.keys(PLANS) as (keyof typeof PLANS)[]).map((k) => (
            <button key={k} role="radio" aria-checked={plan === k} className={cn("chip", plan === k && "is-active")} onClick={() => setPlan(k)}>
              {PLANS[k].label} · {PLANS[k].fee * 100}% fee
            </button>
          ))}
        </div>
        <Range label="Paying members" value={members} min={0} max={5000} step={10} onChange={setMembers} />
        <Range label="Monthly price" value={price} min={1} max={50} step={0.5} onChange={setPrice} prefix="$" decimals={2} />
        <Range label="Tickets sold per month" value={tickets} min={0} max={1000} step={5} onChange={setTickets} />
        <Range label="Ticket price" value={ticketPrice} min={1} max={100} step={1} onChange={setTicketPrice} prefix="$" />
      </div>
      <div className="calc-out" aria-live="polite">
        <span className="small muted">Estimated monthly take-home</span>
        <b className="calc-net">{fmt(net)}</b>
        <dl>
          <div>
            <dt>Gross</dt>
            <dd>{fmt(gross)}</dd>
          </div>
          <div>
            <dt>Platform fee ({p.fee * 100}%)</dt>
            <dd>−{fmt(platform)}</dd>
          </div>
          <div>
            <dt>Card processing (2.9% + 30¢, est.)</dt>
            <dd>−{fmt(processing)}</dd>
          </div>
          {p.monthly > 0 && (
            <div>
              <dt>Plan</dt>
              <dd>−{fmt(p.monthly)}</dd>
            </div>
          )}
        </dl>
        <span className="tiny faint">Illustrative estimate. Taxes and currency conversion not included.</span>
      </div>
    </div>
  );
}

function Range({ label, value, min, max, step, onChange, prefix = "", decimals = 0 }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; prefix?: string; decimals?: number }) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="range">
      <div className="range-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {prefix}
          {value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ ["--p" as string]: `${((value - min) / (max - min)) * 100}%` }} />
    </div>
  );
}
