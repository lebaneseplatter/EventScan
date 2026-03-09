import { useState, useRef, useCallback } from "react";

const PASTEL = {
  rose: "#F2C4C4", peach: "#F2D9C4", sage: "#C4D9C4",
  blue: "#C4D4E8", lavender: "#D9C4E8",
};
const PASTEL_DARK = {
  rose: "#7A3535", peach: "#7A4A25", sage: "#2E5530",
  blue: "#2A4A6A", lavender: "#4A2A6A",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .es-root {
    --bg:           #F5EFE6;
    --surface:      #FBF7F0;
    --surface2:     #F0E8D8;
    --border:       #E2D5C0;
    --text:         #2D2418;
    --muted:        #9A8878;
    --accent:       #7C6A52;
    --accent-light: #EDE3D4;
    --danger:       #A0522D;
    --danger-light: #F5E6DC;
    --danger-border:#E2C4A8;
    --spinner-track:#E2D5C0;
    --log-bg:       #F0E8D8;
    --toggle-bg:    #E2D5C0;
    --toggle-knob:  #fff;
    --grad1: rgba(242,196,196,0.35);
    --grad2: rgba(196,217,196,0.28);
    --grad3: rgba(217,196,232,0.22);
  }

  .es-root.dark {
    --bg:           #1A1612;
    --surface:      #231E19;
    --surface2:     #2C261F;
    --border:       #3D3328;
    --text:         #EDE3D4;
    --muted:        #7A6A58;
    --accent:       #C4A882;
    --accent-light: #2C261F;
    --danger:       #D4845A;
    --danger-light: #2C1F18;
    --danger-border:#5A3020;
    --spinner-track:#3D3328;
    --log-bg:       #2C261F;
    --toggle-bg:    #C4A882;
    --toggle-knob:  #1A1612;
    --grad1: rgba(120,60,60,0.2);
    --grad2: rgba(40,80,40,0.15);
    --grad3: rgba(80,50,100,0.15);
  }

  .es-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 15% 10%, var(--grad1) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 80%, var(--grad2) 0%, transparent 50%),
      radial-gradient(ellipse at 65% 20%, var(--grad3) 0%, transparent 45%);
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
    padding: 48px 16px 64px;
    color: var(--text);
    transition: background 0.35s ease, color 0.35s ease;
  }

  .es-header {
    text-align: center; margin-bottom: 40px;
    animation: esUp 0.6s ease both;
    position: relative; width: 100%; max-width: 520px;
  }

  .es-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.8rem; letter-spacing: -0.02em; line-height: 1; color: var(--text);
    transition: color 0.35s ease;
  }
  .es-title em { font-style: italic; color: var(--accent); }
  .es-subtitle { margin-top: 10px; color: var(--muted); font-size: 0.93rem; font-weight: 300; }

  .es-toggle {
    position: absolute; top: 6px; right: 0;
    display: flex; align-items: center; gap: 8px;
  }
  .es-toggle-icon { color: var(--muted); display: flex; align-items: center; }
  .es-toggle-track {
    width: 42px; height: 24px; border-radius: 12px;
    background: var(--toggle-bg); cursor: pointer; position: relative;
    border: none; outline: none; transition: background 0.3s ease; flex-shrink: 0;
  }
  .es-toggle-knob {
    position: absolute; top: 4px; left: 4px;
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--toggle-knob);
    transition: transform 0.28s cubic-bezier(.4,0,.2,1), background 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .es-root.dark .es-toggle-knob { transform: translateX(18px); }

  .es-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 32px; width: 100%; max-width: 520px;
    animation: esUp 0.6s ease both;
    transition: background 0.35s ease, border-color 0.35s ease;
  }
  .es-card + .es-card { margin-top: 18px; }

  .es-zone {
    border: 2px dashed var(--border); border-radius: 12px;
    padding: 44px 24px; text-align: center; cursor: pointer;
    transition: all 0.2s ease; position: relative; background: transparent;
  }
  .es-zone:hover, .es-zone.drag { border-color: var(--accent); background: var(--accent-light); }
  .es-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

  .es-zone-icon {
    width: 46px; height: 46px; border-radius: 12px;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
    transition: background 0.35s ease;
  }
  .es-zone h3 { font-size: 0.97rem; font-weight: 500; margin-bottom: 5px; color: var(--text); }
  .es-zone p  { font-size: 0.83rem; color: var(--muted); }

  .es-preview {
    width: 100%; border-radius: 10px; object-fit: cover;
    max-height: 200px; margin-top: 16px; border: 1px solid var(--border); display: block;
  }

  .es-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; margin-top: 18px; padding: 12px 24px;
    border-radius: 10px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 0.93rem; font-weight: 500;
    cursor: pointer; transition: all 0.18s ease;
  }
  .es-btn-primary { background: var(--accent); color: #fff; }
  .es-btn-primary:hover:not(:disabled) { opacity: 0.87; transform: translateY(-1px); }
  .es-btn-primary:disabled { opacity: 0.42; cursor: not-allowed; transform: none; }

  .es-loader { text-align: center; padding: 32px 0; color: var(--muted); font-size: 0.88rem; }
  .es-spinner {
    width: 30px; height: 30px; border: 2.5px solid var(--spinner-track);
    border-top-color: var(--accent); border-radius: 50%;
    animation: esSpin 0.8s linear infinite; margin: 0 auto 10px;
  }
  .es-agent-log {
    background: var(--log-bg); border-radius: 8px; padding: 10px 14px;
    font-size: 0.78rem; color: var(--accent); margin-top: 10px;
    font-family: monospace; text-align: left; line-height: 1.6;
    max-height: 80px; overflow-y: auto;
    transition: background 0.35s ease;
  }

  .es-section-label {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 16px;
  }

  .es-event {
    border: 1.5px solid var(--border); border-radius: 12px;
    padding: 18px 18px 14px; margin-bottom: 12px;
    transition: all 0.2s ease; position: relative; background: var(--surface);
  }
  .es-event.accepted { border-color: var(--accent); background: var(--accent-light); }
  .es-event.rejected { opacity: 0.4; }

  .es-event-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.1rem; margin-bottom: 8px; padding-right: 60px; color: var(--text);
  }
  .es-event-meta { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 10px; }
  .es-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 6px; padding: 3px 10px; font-size: 0.78rem; color: var(--muted);
    transition: background 0.35s ease;
  }
  .es-event-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.5; margin-bottom: 12px; }
  .es-event-actions { display: flex; gap: 8px; }

  .es-accept {
    background: var(--accent); color: #fff; border: none;
    padding: 6px 14px; border-radius: 8px;
    font-size: 0.8rem; font-family: 'DM Sans', sans-serif; font-weight: 500;
    cursor: pointer; transition: opacity 0.15s; display: flex; align-items: center; gap: 5px;
  }
  .es-accept:hover { opacity: 0.84; }

  .es-reject {
    background: transparent; color: var(--danger); border: 1.5px solid var(--danger-border);
    padding: 6px 14px; border-radius: 8px;
    font-size: 0.8rem; font-family: 'DM Sans', sans-serif; font-weight: 500;
    cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 5px;
  }
  .es-reject:hover { background: var(--danger-light); }

  .es-badge {
    position: absolute; top: 12px; right: 14px;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .es-badge.ok { color: var(--accent); }
  .es-badge.no { color: var(--muted); }

  .es-export-bar {
    margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  }
  .es-export-info { font-size: 0.83rem; color: var(--muted); }
  .es-export-info strong { color: var(--text); }

  .es-export-btn {
    background: var(--accent); color: #fff; border: none;
    padding: 9px 18px; border-radius: 10px;
    font-size: 0.85rem; font-family: 'DM Sans', sans-serif; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s;
  }
  .es-export-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .es-export-btn:disabled { opacity: 0.38; cursor: not-allowed; transform: none; }

  .es-toast {
    background: var(--accent); color: #fff;
    padding: 12px 18px; border-radius: 10px;
    font-size: 0.85rem; margin-top: 14px; text-align: center;
    animation: esUp 0.3s ease both;
  }
  .es-toast code { background: rgba(255,255,255,0.18); padding: 1px 5px; border-radius: 4px; }

  .es-error {
    background: var(--danger-light); border: 1px solid var(--danger-border); color: var(--danger);
    padding: 13px 16px; border-radius: 10px; font-size: 0.85rem; margin-top: 14px; line-height: 1.5;
  }

  .es-reset {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; color: var(--muted);
    font-size: 0.83rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-top: 12px; padding: 6px 0; transition: color 0.15s;
  }
  .es-reset:hover { color: var(--text); }

  .es-empty { text-align: center; padding: 22px; color: var(--muted); font-size: 0.88rem; }

  @keyframes esUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes esSpin { to { transform: rotate(360deg); } }
`;

function CalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch { return dateStr; }
}
function bumpHour(t) {
  if (!t) return "01:00";
  const [h, m] = t.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function generateICS(evs) {
  const uid = () => Math.random().toString(36).substr(2, 9).toUpperCase();
  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const toICS = (date, time) => `${date.replace(/-/g, "")}T${(time || "00:00").replace(":", "")}00`;
  let cal = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EventScan//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n`;
  evs.forEach(ev => {
    cal += `BEGIN:VEVENT\r\nUID:${uid()}@eventscan\r\nDTSTAMP:${now}\r\n`;
    cal += `DTSTART:${toICS(ev.date, ev.time)}\r\nDTEND:${toICS(ev.date, ev.endTime || bumpHour(ev.time))}\r\n`;
    cal += `SUMMARY:${(ev.title || "Event").replace(/\n/g, " ")}\r\n`;
    if (ev.description) cal += `DESCRIPTION:${ev.description.replace(/\n/g, " ")}\r\n`;
    cal += `END:VEVENT\r\n`;
  });
  return cal + `END:VCALENDAR`;
}

export default function EventScan() {
  const [dark, setDark] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [agentLog, setAgentLog] = useState([]);
  const [events, setEvents] = useState([]);
  const [states, setStates] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f); setError(null); setShowResults(false); setToast(false);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const log = (msg) => setAgentLog(prev => [...prev.slice(-6), msg]);

  const toBase64 = (f) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(f);
  });

  const gemini = async (prompt, base64, mediaType) => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const parts = base64
      ? [{ inlineData: { mimeType: mediaType, data: base64 } }, { text: prompt }]
      : [{ text: prompt }];
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  const scan = async () => {
    if (!file) return;
    setScanning(true); setError(null); setAgentLog([]); setShowResults(false); setToast(false);

    try {
      log("→ Reading image data...");
      const base64 = await toBase64(file);
      const mediaType = file.type;
      const today = new Date().toISOString().slice(0, 10);

      log("→ Deep scanning image...");

      // Step 1: Extract raw event info from image
      const rawInfo = await gemini(
        `You are an elite event extraction agent. Scan this image with maximum effort.

CORE RULE: NEVER refuse. NEVER say the image is unclear. ALWAYS extract something.

HOW TO HANDLE UNCLEAR IMAGES:
- Blurry text → read what you can, infer from context
- Partial text → complete logically ("Birth" → "Birthday", "Dec" → "December")
- No date → look for clues: day names, seasons, holidays
- No time → look for clues: "evening", "morning", "8ish", "noon"
- Handwritten → transcribe carefully
- Chat screenshot → extract event details from conversation
- Any language → translate and extract

EXTRACT: event title, date, time, end time, venue, organizer, description, dress code, ticket info.
OUTPUT: thorough plain-text summary of everything event-related. Mark uncertain parts with (approx) or (inferred).`,
        base64, mediaType
      );
      log("→ Extraction done. Structuring...");

      // Step 2: Structure into JSON
      const structured = await gemini(
        `Convert this raw event info into a JSON array.

STRICT OUTPUT: Return ONLY a raw JSON array — no markdown, no backticks, no explanation whatsoever.
Format: [{ "title": string, "date": "YYYY-MM-DD", "time": "HH:MM", "endTime": "HH:MM", "description": string }]

GAP-FILLING RULES:
- date: convert any format to YYYY-MM-DD. Unknown → ${today}
- time: "7pm"→"19:00", "noon"→"12:00", "evening"→"18:00", "morning"→"09:00", "night"→"20:00". Unknown → "09:00"
- endTime: if missing, add 2 hours to start time
- description: combine venue, organizer, theme, dress code, ticket info into one sentence
- FALLBACK if truly nothing: [{"title":"Event from image","date":"${today}","time":"09:00","endTime":"11:00","description":"Details extracted from uploaded image"}]

Raw event info:
${rawInfo}`,
        null, null
      );
      log("→ Structuring complete. Validating...");

      let parsed;
      try {
        parsed = JSON.parse(structured.replace(/```json|```/g, "").trim());
        if (!Array.isArray(parsed)) throw new Error("Not an array");
      } catch {
        log("→ Repairing output...");
        // Step 3: Repair broken JSON
        const fixed = await gemini(
          `Fix this broken JSON and return ONLY a valid JSON array. No markdown, no explanation:
${structured}`,
          null, null
        );
        parsed = JSON.parse(fixed.replace(/```json|```/g, "").trim());
      }

      log(`✓ Done — ${parsed.length} event(s) extracted!`);
      setEvents(parsed); setStates(parsed.map(() => "pending")); setShowResults(true);
    } catch (err) {
      setError("Something went wrong: " + err.message);
      log("✗ Error: " + err.message);
    } finally {
      setScanning(false);
    }
  };

  const setEvState = (i, s) => setStates(prev => prev.map((v, idx) => idx === i ? s : v));
  const acceptedCount = states.filter(s => s === "accepted").length;

  const shareICS = async () => {
    const accepted = events.filter((_, i) => states[i] === "accepted");
    const icsContent = generateICS(accepted);
    const file = new File([icsContent], "events.ics", { type: "text/calendar" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Calendar Events", text: "Add these events to your calendar" });
        setToast(true);
      } catch (err) {
        if (err.name !== "AbortError") setError("Sharing failed: " + err.message);
      }
    } else {
      // Fallback: direct download
      const url = URL.createObjectURL(new Blob([icsContent], { type: "text/calendar" }));
      const a = document.createElement("a");
      a.href = url; a.download = "events.ics";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast(true);
    }
  };

  const reset = () => {
    setFile(null); setPreview(null); setEvents([]); setStates([]);
    setShowResults(false); setToast(false); setError(null); setAgentLog([]);
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`es-root${dark ? " dark" : ""}`}>

        <header className="es-header">
          <h1 className="es-title">Event<em>Scan</em></h1>
          <p className="es-subtitle">Drop an image — get your events, straight to calendar.</p>

          <div className="es-toggle">
            <span className="es-toggle-icon" style={{color:"var(--muted)"}}>
              {dark ? <MoonIcon /> : <SunIcon />}
            </span>
            <button
              className="es-toggle-track"
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
            >
              <div className="es-toggle-knob" />
            </button>
          </div>
        </header>

        <div className="es-card">
          <div
            className={`es-zone${dragging ? " drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
              onChange={e => handleFile(e.target.files[0])} />
            <div className="es-zone-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <h3>{file ? file.name : "Drop your image here"}</h3>
            <p>{file ? "Click to change image" : "Flyer, screenshot, poster — anything with event info"}</p>
          </div>

          {preview && <img src={preview} alt="Preview" className="es-preview" />}
          {error && <div className="es-error">{error}</div>}

          {scanning && (
            <div className="es-loader">
              <div className="es-spinner" />
              <div>AI agent scanning image…</div>
              {agentLog.length > 0 && (
                <div className="es-agent-log">
                  {agentLog.map((l, i) => <div key={i}>{l}</div>)}
                </div>
              )}
            </div>
          )}

          <button className="es-btn es-btn-primary" disabled={!file || scanning} onClick={scan}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
            {scanning ? "Scanning…" : "Scan Image"}
          </button>
        </div>

        {showResults && (
          <div className="es-card" style={{marginTop: 18}}>
            <p className="es-section-label">Extracted Events</p>

            {events.length === 0 ? (
              <div className="es-empty">No events found. Try a clearer photo!</div>
            ) : (
              events.map((ev, i) => (
                <div key={i} className={`es-event ${states[i] !== "pending" ? states[i] : ""}`}>
                  {states[i] === "accepted" && <span className="es-badge ok">✓ Added</span>}
                  {states[i] === "rejected" && <span className="es-badge no">Skipped</span>}
                  <div className="es-event-title">{ev.title || "Untitled Event"}</div>
                  <div className="es-event-meta">
                    <span className="es-tag"><CalIcon />{ev.date ? formatDate(ev.date) : "Date unknown"}</span>
                    <span className="es-tag"><ClockIcon />{ev.time || "?"}{ev.endTime ? ` – ${ev.endTime}` : ""}</span>
                  </div>
                  {ev.description && <div className="es-event-desc">{ev.description}</div>}
                  <div className="es-event-actions">
                    <button className="es-accept" onClick={() => setEvState(i, "accepted")}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {states[i] === "accepted" ? "Added" : "Add to Calendar"}
                    </button>
                    <button className="es-reject" onClick={() => setEvState(i, "rejected")}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Skip
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="es-export-bar">
              <div className="es-export-info"><strong>{acceptedCount}</strong> event(s) selected</div>
              <button className="es-export-btn" disabled={acceptedCount === 0} onClick={shareICS}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share .ics
              </button>
            </div>

            {toast && (
              <div className="es-toast">
                ✓ Shared! Open the .ics file on your phone — Samsung Calendar will import it instantly.
              </div>
            )}

            <button className="es-reset" onClick={reset}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.27"/></svg>
              Scan another image
            </button>
          </div>
        )}

      </div>
    </>
  );
}
