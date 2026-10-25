// @ts-nocheck -- ported prototype; strict index checks disabled
import { useEffect, useMemo, useState, type ReactNode } from "react";

type Tone = "success" | "warning" | "danger" | "neutral" | "blue";
type IconName =
  | "arrow"
  | "bolt"
  | "box"
  | "calendar"
  | "camera"
  | "chevron"
  | "clock"
  | "coins"
  | "download"
  | "fingerprint"
  | "leaf"
  | "lock"
  | "moon"
  | "route"
  | "shield"
  | "sparkle"
  | "sun"
  | "train"
  | "trend"
  | "user"
  | "users";

type UserProfile = {
  name: string;
  email: string;
  idType: "Google" | "Aadhaar" | "Where Is My Cargo Smart Card";
  idLabel: string;
  role: string;
  photo?: string | undefined;
};

const terminals = [
  { name: "Dadri", km: 0 },
  { name: "Rewari", km: 127 },
  { name: "Phulera", km: 321 },
  { name: "Palanpur", km: 641 },
  { name: "Sanand", km: 817 },
  { name: "Vadodara", km: 949 },
  { name: "Surat", km: 1_109 },
  { name: "JNPT", km: 1_504 },
];

const cargoTypes = ["Containerised", "Automotive", "Cement", "Steel", "FMCG", "Chemicals"];

const seedPool = [
  { shipper: "Bharat Auto", lane: "Dadri → JNPT", tonnes: 680, days: 3 },
  { shipper: "Nova Cement", lane: "Rewari → Sanand", tonnes: 520, days: 2 },
  { shipper: "Indus Steel", lane: "Dadri → JNPT", tonnes: 860, days: 4 },
  { shipper: "Vertex Foods", lane: "Phulera → Surat", tonnes: 340, days: 3 },
  { shipper: "Meridian Exports", lane: "Palanpur → JNPT", tonnes: 590, days: 5 },
  { shipper: "Aster Motors", lane: "Sanand → JNPT", tonnes: 440, days: 2 },
  { shipper: "Orbit Retail", lane: "Dadri → Vadodara", tonnes: 275, days: 4 },
  { shipper: "Prism Polymers", lane: "Rewari → JNPT", tonnes: 610, days: 3 },
  { shipper: "Kaveri Textiles", lane: "Phulera → JNPT", tonnes: 390, days: 6 },
  { shipper: "Zenith Paper", lane: "Palanpur → Surat", tonnes: 310, days: 4 },
  { shipper: "Northstar FMCG", lane: "Dadri → Sanand", tonnes: 460, days: 3 },
  { shipper: "Sapphire Glass", lane: "Vadodara → JNPT", tonnes: 370, days: 2 },
];

const rakeRows = [
  { id: "R-001", lane: "Dadri → JNPT", shippers: 6, load: 3430, fill: 98, deadline: "18 Jun, 14:00" },
  { id: "R-002", lane: "Rewari → JNPT", shippers: 5, load: 3150, fill: 90, deadline: "18 Jun, 21:30" },
  { id: "R-003", lane: "Phulera → Surat", shippers: 4, load: 2730, fill: 78, deadline: "19 Jun, 09:00" },
  { id: "R-004", lane: "Sanand → JNPT", shippers: 3, load: 2205, fill: 63, deadline: "19 Jun, 17:30" },
  { id: "R-005", lane: "Palanpur → JNPT", shippers: 3, load: 1680, fill: 48, deadline: "20 Jun, 08:00" },
  { id: "R-006", lane: "Dadri → Vadodara", shippers: 2, load: 1085, fill: 31, deadline: "21 Jun, 12:00" },
];

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7z" />,
    box: <><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="m3 8 9 5 9-5" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    calendar: <><path d="M6 2v4M18 2v4M3 9h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></>,
    camera: <><path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" /><circle cx="12" cy="13" r="3" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    coins: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    fingerprint: <><path d="M12 11a2 2 0 0 1 2 2c0 3-1 6-2 8" /><path d="M8 13a4 4 0 0 1 8 0c0 2-.3 4-.9 6" /><path d="M5 13a7 7 0 0 1 14 0c0 1.8-.2 3.5-.6 5" /><path d="M4 8a9 9 0 0 1 16 0M8.2 20c.5-1.5.8-3.5.8-6" /></>,
    leaf: <><path d="M20 4S8 3 5 11c-2 5 2 9 7 7 8-3 8-14 8-14Z" /><path d="M5 20c3-5 7-8 12-11" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h3c4 0 2-8 6-10" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    sparkle: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    train: <><rect x="5" y="2" width="14" height="16" rx="4" /><path d="M8 22l3-4M16 18l3 4M8 7h8M8 12h.01M16 12h.01" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="card-header">
      <div>
        <div className="card-title">{title}</div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: IconName;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return <button type={type} className={`button button-${variant}`} onClick={onClick}>{icon && <Icon name={icon} size={17} />}{children}</button>;
}

function Input({
  label,
  value,
  onChange,
  options,
  type = "text",
  suffix,
  min,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options?: string[];
  type?: string;
  suffix?: string;
  min?: number;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="input-wrap">
        {options ? (
          <select value={value} onChange={(event) => onChange(event.target.value)}>
            {options.map((option) => <option key={option}>{option}</option>)}
          </select>
        ) : (
          <input type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} />
        )}
        {suffix && <span className="input-suffix">{suffix}</span>}
      </span>
    </label>
  );
}

function Pill({ children, tone = "neutral", dot = false }: { children: ReactNode; tone?: Tone; dot?: boolean }) {
  return <span className={`pill pill-${tone}`}>{dot && <span className="pill-dot" />}{children}</span>;
}

function KpiCard({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: IconName; tone: Tone }) {
  return (
    <Card className="kpi-card">
      <div className={`kpi-icon kpi-icon-${tone}`}><Icon name={icon} size={20} /></div>
      <div className="kpi-content">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-detail">{detail}</div>
      </div>
    </Card>
  );
}

function TableRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>;
}

function QuoteMetric({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="quote-metric">
      <span className="metric-icon"><Icon name={icon} size={17} /></span>
      <span><span className="metric-label">{label}</span><strong>{value}</strong></span>
    </div>
  );
}

function ShipperScreen() {
  const [company, setCompany] = useState("Acme Logistics");
  const [origin, setOrigin] = useState("Dadri");
  const [destination, setDestination] = useState("JNPT");
  const [cargoType, setCargoType] = useState("Containerised");
  const [weight, setWeight] = useState("480");
  const [days, setDays] = useState("3");
  const [pool, setPool] = useState(seedPool);
  const [quote, setQuote] = useState({ origin: "Dadri", destination: "JNPT", weight: 480, days: 3 });
  const [notice, setNotice] = useState("Based on current pooled demand");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cargo")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Cargo API unavailable")))
      .then((data) => {
        if (!cancelled && Array.isArray(data.loads) && data.loads.length) {
          setPool((current) => [...data.loads, ...current]);
          setNotice(`${data.loads.length} saved cargo load${data.loads.length === 1 ? "" : "s"} loaded from backend`);
        }
      })
      .catch(() => { if (!cancelled) setNotice("Backend unavailable · showing sample cargo loads"); });
    return () => { cancelled = true; };
  }, []);

  const quoteData = useMemo(() => {
    const from = terminals.find((terminal) => terminal.name === quote.origin)?.km ?? 0;
    const to = terminals.find((terminal) => terminal.name === quote.destination)?.km ?? 0;
    const distance = Math.max(120, Math.abs(to - from));
    const rail = Math.round(distance * quote.weight * 1.22 / 1000) * 1000;
    const road = Math.round(distance * quote.weight * 2.08 / 1000) * 1000;
    const saving = Math.round((1 - rail / road) * 100);
    const date = new Date(2025, 5, 18 + Math.max(1, quote.days - 2));
    return { distance, rail, road, saving, date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) };
  }, [quote]);

  const addToPool = () => {
    const newWeight = Math.max(1, Number(weight) || 1);
    const newDays = Math.max(1, Number(days) || 1);
    const newLoad = { shipper: company || "New shipper", lane: `${origin} → ${destination}`, tonnes: newWeight, days: newDays };
    setQuote({ origin, destination, weight: newWeight, days: newDays });
    setNotice(`Saving ${newWeight.toLocaleString("en-IN")} t to the ${origin}–${destination} cargo pool…`);
    fetch("/api/cargo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: newLoad.shipper, cargoType, origin, destination, tonnes: newWeight, days: newDays }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Cargo could not be saved");
        setPool((current) => [data.load, ...current]);
        setNotice(`${newWeight.toLocaleString("en-IN")} t saved to the ${origin}–${destination} pool`);
      })
      .catch((error) => setNotice(`${error instanceof Error ? error.message : "Backend unavailable"} · sample loads remain available`));
  };

  const generateSamples = () => {
    const companies = ["Arka Freight", "BluePeak India", "Crest Manufacturing", "Delta Commodities", "Eastern Cargo"];
    const generated = Array.from({ length: 40 }, (_, index) => {
      const from = index % (terminals.length - 2);
      const to = Math.min(terminals.length - 1, from + 2 + (index % 3));
      return {
        shipper: companies[index % companies.length],
        lane: `${terminals[from].name} → ${terminals[to].name}`,
        tonnes: 240 + ((index * 83) % 650),
        days: 2 + (index % 5),
      };
    });
    setPool(generated);
    setNotice("40 synthetic loads generated across the corridor");
  };

  return (
    <div className="shipper-grid screen-enter">
      <Card className="post-card">
        <CardHeader title="Post cargo" subtitle="Add your load to a shared Where Is My Cargo pool." action={<span className="section-icon"><Icon name="box" /></span>} />
        <div className="form-grid">
          <Input label="Company" value={company} onChange={setCompany} />
          <Input label="Cargo type" value={cargoType} onChange={setCargoType} options={cargoTypes} />
          <Input label="Origin terminal" value={origin} onChange={setOrigin} options={terminals.map((terminal) => terminal.name)} />
          <Input label="Destination terminal" value={destination} onChange={setDestination} options={terminals.map((terminal) => terminal.name)} />
          <Input label="Weight" value={weight} onChange={setWeight} type="number" min={1} suffix="tonnes" />
          <Input label="Deliver within" value={days} onChange={setDays} type="number" min={1} suffix="days" />
        </div>
        <div className="button-row">
          <Button icon="sparkle" onClick={addToPool}>Add to pool</Button>
          <Button variant="secondary" onClick={generateSamples}>Generate 40 sample loads</Button>
        </div>
        <div className="secure-note"><Icon name="bolt" size={15} /> AI matches loads by lane and earliest deadline</div>
      </Card>

      <div className="right-stack">
        <Card className="quote-card">
          <CardHeader title="Your quote" action={<Pill tone="success" dot>Live estimate</Pill>} />
          <div className="quote-lane">
            <div><span>FROM</span><strong>{quote.origin}</strong></div>
            <div className="lane-rule"><span className="lane-train"><Icon name="train" size={16} /></span></div>
            <div className="align-right"><span>TO</span><strong>{quote.destination}</strong></div>
          </div>
          <div className="distance-label">{quoteData.distance.toLocaleString("en-IN")} km on Where Is My Cargo corridor</div>
          <div className="quote-metrics">
            <QuoteMetric icon="calendar" label="Guaranteed slot" value={quoteData.date} />
            <QuoteMetric icon="clock" label="Transit estimate" value={`${Math.max(1, Math.ceil(quoteData.distance / 650))} days`} />
          </div>
          <div className="price-panel">
            <div><span>Rail price</span><strong>₹{quoteData.rail.toLocaleString("en-IN")}</strong></div>
            <div className="road-price"><span>Road equivalent</span><strong>₹{quoteData.road.toLocaleString("en-IN")}</strong></div>
            <Pill tone="success">You save {quoteData.saving}%</Pill>
          </div>
          <div className="quote-note"><Icon name="sparkle" size={15} /> {notice}</div>
        </Card>

        <Card className="pool-card">
          <CardHeader title={`Pool (${pool.length} loads)`} subtitle="Synthetic demand visible on your active lanes" action={<Pill tone="blue">{pool.reduce((sum, load) => sum + load.tonnes, 0).toLocaleString("en-IN")} t</Pill>} />
          <div className="table-scroll pool-scroll">
            <table>
              <thead><tr><th>Shipper</th><th>Lane</th><th>Tonnes</th><th>Days</th></tr></thead>
              <tbody>
                {pool.map((load, index) => (
                  <TableRow key={`${load.shipper}-${index}`}>
                    <td><strong>{load.shipper}</strong></td>
                    <td>{load.lane}</td>
                    <td>{load.tonnes.toLocaleString("en-IN")}</td>
                    <td><span className="days-cell">{load.days}d</span></td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RakeStatus({ fill }: { fill: number }) {
  if (fill >= 85) return <Pill tone="success" dot>Ready to dispatch</Pill>;
  if (fill >= 50) return <Pill tone="warning" dot>Filling</Pill>;
  return <Pill tone="danger" dot>Needs demand</Pill>;
}

function VirtualRakesScreen() {
  const [copilotPrompt, setCopilotPrompt] = useState("");
  const [copilotMessages, setCopilotMessages] = useState([
    { role: "assistant", text: "I’m monitoring all six virtual rakes. Ask me what to dispatch, where to source demand, or which deadline is at risk." },
  ]);

  const downloadRakes = () => {
    const header = ["Rake ID", "Lane", "Shippers", "Load tonnes", "Fill percent", "Deadline", "Status"];
    const rows = rakeRows.map((rake) => [
      rake.id,
      rake.lane,
      rake.shippers,
      rake.load,
      rake.fill,
      rake.deadline,
      rake.fill >= 85 ? "Ready to dispatch" : rake.fill >= 50 ? "Filling" : "Needs demand",
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "where-is-my-cargo-virtual-rakes.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const askCopilot = (question = copilotPrompt) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    const lowerQuestion = cleanQuestion.toLowerCase();
    let answer = "R-002 is the best next action: it is at 90% fill and needs only 350 t before its 18 Jun deadline.";
    if (lowerQuestion.includes("dispatch")) {
      answer = "Dispatch R-001 first. It is 98% full with 3,430 t and has the earliest deadline at 18 Jun, 14:00. Hold R-002 for one more matching load.";
    } else if (lowerQuestion.includes("fill") || lowerQuestion.includes("demand")) {
      answer = "Prioritise Dadri–Vadodara demand for R-006 and Palanpur–JNPT demand for R-005. Together they have 4,235 t of unused capacity.";
    } else if (lowerQuestion.includes("risk") || lowerQuestion.includes("deadline")) {
      answer = "R-002 has the highest near-term deadline risk. It needs 350 t before 21:30. R-004 is the next watch item at 63% fill.";
    }
    setCopilotMessages((current) => [...current, { role: "user", text: cleanQuestion }, { role: "assistant", text: answer }]);
    setCopilotPrompt("");
  };

  return (
    <div className="virtual-rakes-screen screen-enter">
      <Card className="rakes-card">
        <CardHeader
          title="Consolidated virtual rakes"
          subtitle="Loads on the same lane are packed earliest-deadline-first into rakes of 3,500 tonnes."
          action={<div className="header-button-group"><Pill tone="blue"><Icon name="sparkle" size={14} /> AI consolidated</Pill><Button variant="secondary" icon="download" onClick={downloadRakes}>CSV</Button></div>}
        />
        <div className="rake-summary">
          <div><span>6</span> active rakes</div>
          <div><span>14,280 t</span> allocated</div>
          <div><span>68%</span> network fill</div>
        </div>
        <div className="table-scroll">
          <table className="rakes-table">
            <caption className="sr-only">Accessible data table listing virtual rake lanes, loads, fill percentages, deadlines, and dispatch status.</caption>
            <thead><tr><th>Rake ID</th><th>Lane</th><th>Shippers</th><th>Load (t)</th><th>Fill</th><th>Deadline</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rakeRows.map((rake) => (
                <TableRow key={rake.id} className="rake-data-row">
                  <td><span className="rake-id"><Icon name="train" size={16} />{rake.id}</span></td>
                  <td><strong>{rake.lane}</strong></td>
                  <td><span className="shippers"><Icon name="users" size={15} />{rake.shippers}</span></td>
                  <td>{rake.load.toLocaleString("en-IN")}</td>
                  <td>
                    <div className="fill-cell">
                      <div className="progress"><span className={rake.fill >= 85 ? "full" : rake.fill >= 50 ? "mid" : "low"} style={{ width: `${rake.fill}%` }} /></div>
                      <strong>{rake.fill}%</strong>
                    </div>
                  </td>
                  <td><span className="deadline"><Icon name="clock" size={14} />{rake.deadline}</span></td>
                  <td><RakeStatus fill={rake.fill} /></td>
                  <td><span className="row-arrow"><Icon name="chevron" size={17} /></span></td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rake-mobile-list" aria-label="Virtual rake data">
          {rakeRows.map((rake) => (
            <article className="rake-mobile-card" key={rake.id}>
              <div><span className="rake-id"><Icon name="train" size={16} />{rake.id}</span><RakeStatus fill={rake.fill} /></div>
              <strong>{rake.lane}</strong>
              <dl><div><dt>Load</dt><dd>{rake.load.toLocaleString("en-IN")} t</dd></div><div><dt>Fill</dt><dd>{rake.fill}%</dd></div><div><dt>Shippers</dt><dd>{rake.shippers}</dd></div><div><dt>Deadline</dt><dd>{rake.deadline}</dd></div></dl>
            </article>
          ))}
        </div>
        <div className="table-footer"><span>Updated 2 minutes ago</span><span>Capacity: 3,500 tonnes per rake</span></div>
      </Card>
      <Card className="copilot-card">
        <CardHeader title="Virtual Rakes AI Copilot" subtitle="Ask for dispatch, fill, and deadline recommendations." action={<span className="copilot-status"><i /> Live</span>} />
        <div className="copilot-suggestions">
          {["What should dispatch first?", "How can I improve fill?", "Which deadline is at risk?"].map((question) => <button key={question} onClick={() => askCopilot(question)}>{question}</button>)}
        </div>
        <div className="copilot-messages" aria-live="polite">
          {copilotMessages.slice(-5).map((message, index) => <div className={`copilot-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === "assistant" && <Icon name="sparkle" size={14} />}</span><p>{message.text}</p></div>)}
        </div>
        <div className="copilot-compose">
          <input value={copilotPrompt} onChange={(event) => setCopilotPrompt(event.target.value)} onKeyDown={(event) => event.key === "Enter" && askCopilot()} placeholder="Ask about the active rakes…" aria-label="Ask the Virtual Rakes AI Copilot" />
          <Button icon="arrow" onClick={() => askCopilot()}>Ask</Button>
        </div>
      </Card>
    </div>
  );
}

function SliderControl({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <label className="slider-control">
      <span className="slider-head"><span>{label}</span><strong>{value}{suffix}</strong></span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ "--fill": `${percentage}%` } as React.CSSProperties} />
      <span className="slider-range"><span>{min}{suffix}</span><span>{max}{suffix}</span></span>
    </label>
  );
}

function getUtilTone(value: number): Tone {
  if (value >= 88) return "danger";
  if (value >= 70) return "warning";
  return "success";
}

function OperatorScreen() {
  const [demand, setDemand] = useState(100);
  const [trains, setTrains] = useState(28);
  const [capacity, setCapacity] = useState(8);
  const [assumptions, setAssumptions] = useState({ roadCo2: "62", railCo2: "18", roadCost: "2.08", railCost: "1.22" });

  const pathUtil = Math.round(Math.min(100, Math.max(22, 56 + (demand - 100) * 0.35 - (trains - 28) * 1.15)));
  const terminalLoad = Math.round(Math.min(100, Math.max(18, 61 + (demand - 100) * 0.3 - (capacity - 8) * 6)));
  const nodeLoads = terminals.map((_, index) => Math.round(Math.min(98, Math.max(20, terminalLoad + ((index * 17) % 29) - 12))));
  const loadTone = (value: number): Tone => value >= 82 ? "danger" : value >= 62 ? "warning" : "success";
  const toneLabel = (value: number) => value >= 82 ? "High" : value >= 62 ? "Moderate" : "Healthy";
  const impactData = [
    { label: "Road CO₂", value: Number(assumptions.roadCo2) || 0, tone: "red" },
    { label: "Rail CO₂", value: Number(assumptions.railCo2) || 0, tone: "green" },
    { label: "Road cost", value: (Number(assumptions.roadCost) || 0) * 20, tone: "amber" },
    { label: "Rail cost", value: (Number(assumptions.railCost) || 0) * 20, tone: "blue" },
  ];
  const maxImpact = Math.max(...impactData.map((item) => item.value), 1);

  return (
    <div className="operator screen-enter">
      <div className="kpi-grid">
        <KpiCard label="Cargo pooled" value="14,820 t" detail="+12.4% vs last week" icon="box" tone="blue" />
        <KpiCard label="Avg rake fill" value="74%" detail="+8.1% with consolidation" icon="trend" tone="success" />
        <KpiCard label="Cost saved est." value="₹41.2 L" detail="Across active loads" icon="coins" tone="warning" />
        <KpiCard label="CO₂ saved est." value="362 t" detail="Road-to-rail shift" icon="leaf" tone="success" />
      </div>

      <div className="dashboard-grid">
        <Card className="map-card">
          <CardHeader title="Corridor map & congestion" subtitle="Predicted terminal load across the Where Is My Cargo corridor" action={<div className="legend"><span><i className="green" />Healthy</span><span><i className="amber" />Moderate</span><span><i className="red" />High</span></div>} />
          <div className="corridor">
            <div className="corridor-line" />
            {terminals.map((terminal, index) => {
              const tone = loadTone(nodeLoads[index]);
              return (
                <div className={`terminal terminal-${tone}`} key={terminal.name}>
                  <span className="terminal-load">{nodeLoads[index]}%</span>
                  <span className="terminal-node"><Icon name="train" size={15} /></span>
                  <span className="terminal-name">{terminal.name}</span>
                  <span className="terminal-km">{terminal.km.toLocaleString("en-IN")} km</span>
                </div>
              );
            })}
          </div>
          <div className="map-insight"><span className="insight-icon"><Icon name="sparkle" size={16} /></span><span><strong>AI forecast</strong> Demand peaks around Sanand–Vadodara between 18:00–22:00. Consider adding 2 train paths.</span></div>
        </Card>

        <Card className="sim-card">
          <CardHeader title="What-if simulator" subtitle="Adjust network inputs to model capacity." action={<span className="section-icon"><Icon name="bolt" /></span>} />
          <div className="sliders">
            <SliderControl label="Demand" value={demand} min={50} max={200} suffix="%" onChange={setDemand} />
            <SliderControl label="Trains per day" value={trains} min={5} max={60} suffix="" onChange={setTrains} />
            <SliderControl label="Terminal capacity" value={capacity} min={2} max={14} suffix=" rakes/day" onChange={setCapacity} />
          </div>
          <div className="sim-outputs">
            <div className="output-row">
              <div><span>Train path utilisation</span><strong>{pathUtil}%</strong></div>
              <Pill tone={getUtilTone(pathUtil)} dot>{toneLabel(pathUtil)}</Pill>
            </div>
            <div className="output-row">
              <div><span>Avg terminal load</span><strong>{terminalLoad}%</strong></div>
              <Pill tone={getUtilTone(terminalLoad)} dot>{toneLabel(terminalLoad)}</Pill>
            </div>
          </div>
        </Card>
      </div>

      <Card className="assumptions-card">
        <CardHeader title="Impact assumptions (editable)" subtitle="Tune baseline factors used in savings estimates." />
        <div className="impact-layout">
          <div className="assumption-grid">
            <Input label="Road CO₂" value={assumptions.roadCo2} onChange={(roadCo2) => setAssumptions({ ...assumptions, roadCo2 })} type="number" suffix="g/t-km" />
            <Input label="Rail CO₂" value={assumptions.railCo2} onChange={(railCo2) => setAssumptions({ ...assumptions, railCo2 })} type="number" suffix="g/t-km" />
            <Input label="Road cost" value={assumptions.roadCost} onChange={(roadCost) => setAssumptions({ ...assumptions, roadCost })} type="number" suffix="₹/t-km" />
            <Input label="Rail cost" value={assumptions.railCost} onChange={(railCost) => setAssumptions({ ...assumptions, railCost })} type="number" suffix="₹/t-km" />
          </div>
          <div className="impact-chart" role="img" aria-label={`Impact comparison. Road carbon ${assumptions.roadCo2}, rail carbon ${assumptions.railCo2}, road cost ${assumptions.roadCost}, rail cost ${assumptions.railCost}.`}>
            <div className="chart-title"><span>Live comparison</span><Pill tone="success">Updates instantly</Pill></div>
            <div className="chart-bars">
              {impactData.map((item) => <div className="chart-column" key={item.label}><span className={`chart-value chart-${item.tone}`}>{item.label.includes("cost") ? (item.value / 20).toFixed(2) : item.value}</span><div className="chart-track"><span className={`chart-bar chart-${item.tone}`} style={{ height: `${Math.max(8, item.value / maxImpact * 100)}%` }} /></div><strong>{item.label}</strong></div>)}
            </div>
          </div>
        </div>
        <div className="footnote">Placeholder values for illustration; replace with sourced figures.</div>
      </Card>
    </div>
  );
}

const tabs = ["1. Shipper", "2. Virtual rakes", "3. Operator dashboard", "4. My dashboard"];

function OpeningScene() {
  return (
    <div className="opening-scene" aria-label="Where Is My Cargo loading">
      <div className="opening-glow" />
      <div className="opening-content">
        <div className="opening-logo">
          <img src="/cargo-train-logo.png" alt="Where Is My Cargo freight train" />
        </div>
        <div className="opening-brand">WHERE IS MY CARGO</div>
        <div className="opening-tag">Intelligent freight. Authorised access.</div>
        <div className="opening-loader"><span /></div>
      </div>
    </div>
  );
}

function AccessDenied({ onReset }: { onReset: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onReset, 3000);
    return () => window.clearTimeout(timer);
  }, [onReset]);

  return (
    <div className="denied-screen">
      <div className="denied-panel">
        <span className="denied-icon"><Icon name="lock" size={30} /></span>
        <span className="access-eyebrow">ACCESS BLOCKED</span>
        <div className="denied-title">Authorisation not found</div>
        <div className="denied-copy">This identity is not approved for Where Is My Cargo. Your session has been closed and you will be returned to the secure gateway.</div>
        <div className="denied-timer"><span /> Session terminated · returning in 3 seconds</div>
      </div>
    </div>
  );
}

function LoginScreen({ onAuthorised, onDenied }: { onAuthorised: (profile: UserProfile) => void; onDenied: () => void }) {
  const [method, setMethod] = useState<"google" | "aadhaar">("google");
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [governmentIdType, setGovernmentIdType] = useState<"Aadhaar" | "Where Is My Cargo Smart Card">("Aadhaar");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Shipper");
  const [photo, setPhoto] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [formError, setFormError] = useState("");

  const verifyBiometric = () => {
    setBiometricScanning(true);
    setFormError("");
    window.setTimeout(() => {
      setBiometricScanning(false);
      setBiometricVerified(true);
    }, 900);
  };

  const makeProfile = (idType: UserProfile["idType"], idLabel: string): UserProfile => ({
    name: name.trim() || (method === "google" ? (email.split("@")[0] ?? "").replace(/[._]/g, " ") : "Where Is My Cargo Operator"),
    email: email.trim() || "verified.user@whereismycargo.demo",
    idType,
    idLabel,
    role,
    photo,
  });

  const submitGoogle = () => {
    if (!biometricVerified) {
      setFormError("Complete the biometric check before continuing.");
      return;
    }
    if (isRegistering) {
      if (!name.trim() || !/^[^\s@]+@gmail\.com$/i.test(email) || !photo) {
        setFormError("Add your name, a valid Gmail address, and profile photo.");
        return;
      }
      onAuthorised(makeProfile("Google", email.trim()));
      return;
    }
    const approved = ["operator.dfc@gmail.com", "controller.dfc@gmail.com", "planner.dfc@gmail.com"];
    approved.includes(email.trim().toLowerCase()) ? onAuthorised(makeProfile("Google", email.trim())) : onDenied();
  };

  const submitAadhaar = () => {
    if (!biometricVerified) {
      setFormError("Complete the biometric check before continuing.");
      return;
    }
    const compactId = aadhaar.replace(/[\s-]/g, "");
    if (isRegistering) {
      const validId = governmentIdType === "Aadhaar" ? compactId.length === 12 : /^DFC[A-Z0-9]{8,12}$/i.test(compactId);
      if (!name.trim() || !validId || otp !== "246810" || !photo) {
        setFormError("Complete all identity fields, upload a profile photo, and enter demo OTP 246810.");
        return;
      }
      onAuthorised(makeProfile(governmentIdType, `•••• ${compactId.slice(-4)}`));
      return;
    }
    const approved = governmentIdType === "Aadhaar"
      ? compactId === "424242424242"
      : compactId.toUpperCase() === "DFCWR12345678";
    approved && otp === "246810" ? onAuthorised(makeProfile(governmentIdType, `•••• ${compactId.slice(-4)}`)) : onDenied();
  };

  const updateAadhaar = (value: string) => {
    if (governmentIdType === "Aadhaar") {
      const digits = value.replace(/\D/g, "").slice(0, 12);
      setAadhaar(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
    } else {
      setAadhaar(value.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 15));
    }
  };

  const handlePhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const switchMode = () => {
    setIsRegistering((current) => !current);
    setFormError("");
    setBiometricVerified(false);
    setOtpSent(false);
  };

  return (
    <div className="login-screen">
      <div className="login-art">
        <div className="login-art-grid" />
        <div className="login-art-content">
          <img src="/cargo-train-logo.png" alt="" className="login-logo" />
          <span className="login-art-kicker">WHERE IS MY CARGO</span>
          <div className="login-art-title">Where Is<br />My Cargo.</div>
          <div className="login-art-copy">AI-assisted slot booking and rake consolidation from Dadri to JNPT.</div>
          <div className="login-network"><span><i /> Secure network online</span><strong>1,504 km · 8 terminals</strong></div>
        </div>
      </div>
      <div className="login-side">
        <div className="login-panel">
          <div className="login-mobile-brand"><img src="/cargo-train-logo.png" alt="" /><span>Where Is My Cargo</span></div>
          <span className="access-eyebrow">AUTHORISED PERSONNEL ONLY</span>
          <div className="login-title">{isRegistering ? "Create secure profile" : "Secure access gateway"}</div>
          <div className="login-copy">{isRegistering ? "Register a synthetic Gmail or government identity with photo and biometric verification." : "Verify your approved identity to enter the Where Is My Cargo operations platform."}</div>

          <div className="auth-tabs">
            <button className={method === "google" ? "auth-tab active" : "auth-tab"} onClick={() => setMethod("google")}>Google account</button>
            <button className={method === "aadhaar" ? "auth-tab active" : "auth-tab"} onClick={() => setMethod("aadhaar")}>Government ID</button>
          </div>

          {isRegistering && (
            <div className="registration-profile">
              <label className="photo-upload">
                <span className="profile-photo-preview">{photo ? <img src={photo} alt="Profile preview" /> : <Icon name="camera" size={22} />}</span>
                <span><strong>{photo ? "Photo added" : "Add profile photo"}</strong><small>JPG or PNG · synthetic prototype</small></span>
                <input type="file" accept="image/png,image/jpeg" onChange={(event) => handlePhoto(event.target.files?.[0])} />
              </label>
              <div className="registration-fields">
                <label className="login-field"><span>Full name</span><span className="login-input"><Icon name="user" size={17} /><input value={name} placeholder="Your full name" onChange={(event) => setName(event.target.value)} /></span></label>
                <label className="login-field"><span>Primary role</span><span className="login-input"><Icon name="users" size={17} /><select value={role} onChange={(event) => setRole(event.target.value)}><option>Shipper</option><option>Rake Planner</option><option>Corridor Operator</option><option>Terminal Manager</option></select></span></label>
              </div>
            </div>
          )}

          {method === "google" ? (
            <div className="auth-form">
              <label className="login-field">
                <span>Approved Google email</span>
                <span className="login-input"><span className="google-g">G</span><input type="email" placeholder="name@gmail.com" value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitGoogle()} /></span>
              </label>
              <BiometricCheck verified={biometricVerified} scanning={biometricScanning} onVerify={verifyBiometric} />
              <button className="login-button google-button" onClick={submitGoogle}><span className="google-g">G</span>{isRegistering ? "Create Gmail profile" : "Continue with Google"}</button>
              <div className="demo-access"><strong>Prototype account</strong><button onClick={() => setEmail("operator.dfc@gmail.com")}>Use operator.dfc@gmail.com</button></div>
            </div>
          ) : (
            <div className="auth-form">
              <label className="login-field">
                <span>Identity type</span>
                <span className="login-input"><Icon name="shield" size={17} /><select value={governmentIdType} onChange={(event) => { setGovernmentIdType(event.target.value as "Aadhaar" | "Where Is My Cargo Smart Card"); setAadhaar(""); setOtpSent(false); }}><option>Aadhaar</option><option>Where Is My Cargo Smart Card</option></select></span>
              </label>
              <label className="login-field">
                <span>{governmentIdType === "Aadhaar" ? "Aadhaar number" : "Dedicated smart card number"}</span>
                <span className="login-input"><Icon name="shield" size={17} /><input inputMode={governmentIdType === "Aadhaar" ? "numeric" : "text"} placeholder={governmentIdType === "Aadhaar" ? "XXXX XXXX XXXX" : "DFCWR12345678"} value={aadhaar} onChange={(event) => updateAadhaar(event.target.value)} /></span>
              </label>
              {otpSent ? (
                <>
                  <label className="login-field">
                    <span>6-digit secure OTP</span>
                    <span className="login-input"><Icon name="lock" size={17} /><input inputMode="numeric" placeholder="Enter OTP" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} /></span>
                  </label>
                  <BiometricCheck verified={biometricVerified} scanning={biometricScanning} onVerify={verifyBiometric} />
                  <button className="login-button" onClick={submitAadhaar}><Icon name="shield" size={17} />{isRegistering ? "Create verified profile" : "Verify and enter"}</button>
                </>
              ) : (
                <button className="login-button" onClick={() => aadhaar.replace(/\s/g, "").length >= 12 ? setOtpSent(true) : setFormError("Enter a valid identity number first.")}><Icon name="shield" size={17} />Request secure OTP</button>
              )}
              <div className="demo-access"><strong>Synthetic demo only</strong><button onClick={() => { setAadhaar(governmentIdType === "Aadhaar" ? "4242 4242 4242" : "DFCWR12345678"); setOtp("246810"); setOtpSent(true); }}>Use demo {governmentIdType === "Aadhaar" ? "ID" : "smart card"} and OTP</button></div>
            </div>
          )}

          {formError && <div className="form-error" role="alert">{formError}</div>}
          <button className="registration-toggle" onClick={switchMode}>{isRegistering ? "Already registered? Sign in" : "New to Where Is My Cargo? Add a new user"}</button>
          <div className="security-notice"><Icon name="lock" size={15} /><span><strong>Restricted system.</strong> Unauthorised attempts are rejected. This prototype does not store identity data—never enter a real Aadhaar number.</span></div>
          <div className="login-footer">Where Is My Cargo secure gateway · Synthetic demonstration</div>
        </div>
      </div>
    </div>
  );
}

function BiometricCheck({ verified, scanning, onVerify }: { verified: boolean; scanning: boolean; onVerify: () => void }) {
  return (
    <button className={`biometric-check ${verified ? "verified" : ""}`} onClick={onVerify} disabled={scanning || verified}>
      <span className="biometric-icon"><Icon name="fingerprint" size={22} /></span>
      <span><strong>{verified ? "Biometric verified" : scanning ? "Scanning…" : "Verify biometric"}</strong><small>{verified ? "Identity match confirmed" : "Use Face ID, fingerprint, or device passkey"}</small></span>
      <Pill tone={verified ? "success" : "blue"}>{verified ? "Complete" : "Required"}</Pill>
    </button>
  );
}

function PersonalDashboard({ profile, onProfileChange }: { profile: UserProfile; onProfileChange: (profile: UserProfile) => void }) {
  const initials = profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const updateProfilePhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onProfileChange({ ...profile, photo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="personal-dashboard screen-slide">
      <Card className="profile-hero">
        <div className="profile-photo-editor">
          <div className="profile-avatar">{profile.photo ? <img src={profile.photo} alt={`${profile.name} profile`} /> : initials}</div>
          <label className="profile-photo-action"><Icon name="camera" size={14} /><span>{profile.photo ? "Replace photo" : "Add photo"}</span><input type="file" accept="image/png,image/jpeg" onChange={(event) => updateProfilePhoto(event.target.files?.[0])} /></label>
          {profile.photo && <button className="profile-photo-remove" onClick={() => onProfileChange({ ...profile, photo: undefined })}>Remove</button>}
        </div>
        <div className="profile-identity"><span className="eyebrow">VERIFIED WHERE IS MY CARGO USER</span><div className="profile-name">{profile.name}</div><div className="profile-meta">{profile.role} · {profile.email}</div><div className="profile-pills"><Pill tone="success"><Icon name="fingerprint" size={13} /> Biometric verified</Pill><Pill tone="blue"><Icon name="shield" size={13} /> {profile.idType}</Pill></div></div>
        <div className="profile-security"><span>Security score</span><strong>100%</strong><small>Photo, identity and biometric complete</small></div>
      </Card>
      <div className="personal-kpis">
        <KpiCard label="My active loads" value="7" detail="2 dispatch-ready" icon="box" tone="blue" />
        <KpiCard label="Booked capacity" value="2,840 t" detail="Across 4 virtual rakes" icon="train" tone="success" />
        <KpiCard label="My savings" value="₹8.6 L" detail="Estimated this quarter" icon="coins" tone="warning" />
        <KpiCard label="CO₂ avoided" value="74 t" detail="Verified rail shift" icon="leaf" tone="success" />
      </div>
      <div className="personal-grid">
        <Card>
          <CardHeader title="My freight timeline" subtitle="Recent activity across your assigned corridor movements." />
          <div className="activity-list">
            <div><span className="activity-icon success"><Icon name="train" /></span><span><strong>R-001 ready to dispatch</strong><small>Dadri → JNPT · 680 t allocated</small></span><time>Now</time></div>
            <div><span className="activity-icon blue"><Icon name="calendar" /></span><span><strong>Slot confirmed</strong><small>19 Jun · Sanand terminal</small></span><time>2h</time></div>
            <div><span className="activity-icon warning"><Icon name="bolt" /></span><span><strong>AI consolidation updated</strong><small>Saved an estimated ₹1.2 L</small></span><time>Yesterday</time></div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Identity & access" subtitle="Your synthetic verification record." />
          <dl className="identity-list"><div><dt>Identity method</dt><dd>{profile.idType}</dd></div><div><dt>Verified ID</dt><dd>{profile.idLabel}</dd></div><div><dt>Access role</dt><dd>{profile.role}</dd></div><div><dt>Device support</dt><dd>Web · Android · iOS</dd></div></dl>
        </Card>
      </div>
    </div>
  );
}

function Platform({ onSignOut, profile, onProfileChange }: { onSignOut: () => void; profile: UserProfile; onProfileChange: (profile: UserProfile) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <div className="app-shell" data-theme={darkTheme ? "dark" : "light"}>
      <header className="topbar">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark"><img src="/cargo-train-logo.png" alt="" /></span>
            <span><strong>Where Is My Cargo</strong><small>Western Freight Corridor</small></span>
          </div>
          <div className="header-actions">
            <div className="tagline"><span className="tagline-dot" />AI slot booking & rake consolidation for the Dedicated Freight Corridor</div>
            <button className="theme-button" onClick={() => setDarkTheme((current) => !current)} aria-label={darkTheme ? "Use light theme" : "Use dark gradient theme"}><Icon name={darkTheme ? "sun" : "moon"} size={16} /></button>
            <button className="header-profile" onClick={() => setActiveTab(3)}><span className="header-avatar">{profile.photo ? <img src={profile.photo} alt="" /> : profile.name[0]}</span><span><strong>{profile.name}</strong><small>{profile.role}</small></span></button>
            <button className="signout-button" onClick={onSignOut}><Icon name="lock" size={14} />Sign out</button>
          </div>
        </div>
      </header>
      <nav className="tabs-wrap" aria-label="Application screens">
        <div className="tabs">
          {tabs.map((tab, index) => <button key={tab} className={activeTab === index ? "tab active" : "tab"} onClick={() => setActiveTab(index)}>{tab}</button>)}
        </div>
      </nav>
      <main>
        <div className="page-intro">
          <div>
            <span className="eyebrow">{activeTab === 0 ? "SHIPPER WORKSPACE" : activeTab === 1 ? "RAKE PLANNING" : activeTab === 2 ? "NETWORK CONTROL" : "PERSONAL WORKSPACE"}</span>
            <div className="page-title">{activeTab === 0 ? "Book smarter freight" : activeTab === 1 ? "Turn pooled cargo into full rakes" : activeTab === 2 ? "Operate the corridor with foresight" : `Welcome back, ${profile.name.split(" ")[0]}`}</div>
            <div className="page-copy">{activeTab === 0 ? "Pool cargo, secure a rail slot, and get an instant synthetic quote." : activeTab === 1 ? "Review AI-packed rakes and prioritise dispatch-ready demand." : activeTab === 2 ? "Monitor performance and test capacity scenarios in real time." : "Track your freight, savings, access, and recent corridor activity."}</div>
          </div>
          <div className="network-badge"><span><i /> Network live</span><strong>Where Is My Cargo corridor · 1,504 km</strong></div>
        </div>
        {activeTab === 0 && <ShipperScreen />}
        {activeTab === 1 && <VirtualRakesScreen />}
        {activeTab === 2 && <OperatorScreen />}
        {activeTab === 3 && <PersonalDashboard profile={profile} onProfileChange={onProfileChange} />}
      </main>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState<"opening" | "login" | "denied" | "platform">("opening");
  const [profile, setProfile] = useState<UserProfile>({
    name: "Where Is My Cargo Operator",
    email: "operator.dfc@gmail.com",
    idType: "Google",
    idLabel: "operator.dfc@gmail.com",
    role: "Corridor Operator",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setStage("login"), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  if (stage === "opening") return <OpeningScene />;
  if (stage === "denied") return <AccessDenied onReset={() => setStage("login")} />;
  if (stage === "login") return <LoginScreen onAuthorised={(user) => { setProfile(user); setStage("platform"); }} onDenied={() => setStage("denied")} />;
  return <Platform profile={profile} onProfileChange={setProfile} onSignOut={() => setStage("login")} />;
}