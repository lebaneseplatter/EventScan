import { useState, useRef, useCallback } from "react";



const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* LIGHT — slate + amber duotone */
  .es-root {
    --bg:           #1E1C1A;
    --surface:      #272422;
    --surface2:     #302C29;
    --border:       #3E3830;
    --text:         #EDE0CE;
    --muted:        #7A6E62;
    --accent:       #C9973A;
    --accent2:      #5B8FA8;
    --accent-light: #302C29;
    --danger:       #C0604A;
    --danger-light: #2C1F1A;
    --danger-border:#5A2E22;
    --spinner-track:#3E3830;
    --log-bg:       #302C29;
    --toggle-bg:    #3E3830;
    --toggle-knob:  #C9973A;
    --card-shadow:  0 2px 12px rgba(0,0,0,0.4);
  }

  /* LIGHT mode */
  .es-root.light {
    --bg:           #2A2622;
    --surface:      #322D28;
    --surface2:     #3A342E;
    --border:       #4A4238;
    --text:         #F0E4D0;
    --muted:        #8A7A6A;
    --accent:       #D4A44A;
    --accent2:      #6A9FBA;
    --accent-light: #3A342E;
    --danger:       #C8684E;
    --danger-light: #321E18;
    --danger-border:#622E20;
    --spinner-track:#4A4238;
    --log-bg:       #3A342E;
    --toggle-bg:    #D4A44A;
    --toggle-knob:  #1E1C1A;
    --card-shadow:  0 2px 16px rgba(0,0,0,0.5);
  }

  .es-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 10% 0%, rgba(201,151,58,0.12) 0%, transparent 55%),
      radial-gradient(ellipse at 90% 100%, rgba(91,143,168,0.1) 0%, transparent 55%);
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
    padding: 44px 16px 64px;
    color: var(--text);
    transition: background 0.35s ease, color 0.35s ease;
  }

  .es-header {
    text-align: center; margin-bottom: 36px;
    animation: esUp 0.6s ease both;
    position: relative; width: 100%; max-width: 560px;
  }

  .es-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.6rem; letter-spacing: -0.02em; line-height: 1; color: var(--text);
    transition: color 0.35s ease;
  }
  .es-title em { font-style: italic; color: var(--accent); }
  .es-subtitle { margin-top: 8px; color: var(--muted); font-size: 0.9rem; font-weight: 300; }

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
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
  .es-root.light .es-toggle-knob { transform: translateX(18px); }

  .es-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; width: 100%; max-width: 560px;
    animation: esUp 0.6s ease both;
    box-shadow: var(--card-shadow);
    transition: background 0.35s ease, border-color 0.35s ease;
  }
  .es-card + .es-card { margin-top: 16px; }

  .es-zone {
    border: 2px dashed var(--border); border-radius: 12px;
    padding: 40px 24px; text-align: center; cursor: pointer;
    transition: all 0.2s ease; position: relative; background: transparent;
  }
  .es-zone:hover, .es-zone.drag { border-color: var(--accent); background: var(--accent-light); }
  .es-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

  .es-zone-icon {
    width: 44px; height: 44px; border-radius: 11px;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;
  }
  .es-zone h3 { font-size: 0.95rem; font-weight: 500; margin-bottom: 4px; color: var(--text); }
  .es-zone p  { font-size: 0.82rem; color: var(--muted); }

  .es-preview {
    width: 100%; border-radius: 10px; object-fit: cover;
    max-height: 190px; margin-top: 14px; border: 1px solid var(--border); display: block;
  }

  .es-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; margin-top: 16px; padding: 12px 24px;
    border-radius: 10px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 0.93rem; font-weight: 500;
    cursor: pointer; transition: all 0.18s ease;
  }
  .es-btn-primary { background: var(--accent); color: #1A1612; }
  .es-btn-primary:hover:not(:disabled) { opacity: 0.87; transform: translateY(-1px); }
  .es-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  .es-loader { text-align: center; padding: 28px 0; color: var(--muted); font-size: 0.88rem; }
  .es-spinner {
    width: 28px; height: 28px; border: 2.5px solid var(--spinner-track);
    border-top-color: var(--accent); border-radius: 50%;
    animation: esSpin 0.8s linear infinite; margin: 0 auto 10px;
  }
  .es-agent-log {
    background: var(--log-bg); border-radius: 8px; padding: 9px 13px;
    font-size: 0.75rem; color: var(--accent); margin-top: 10px;
    font-family: monospace; text-align: left; line-height: 1.6;
    max-height: 72px; overflow-y: auto;
  }

  .es-section-label {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 14px;
  }

  /* Horizontal scroll row */
  .es-events-row {
    display: flex; gap: 12px;
    overflow-x: auto; padding-bottom: 10px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  .es-events-row::-webkit-scrollbar { height: 4px; }
  .es-events-row::-webkit-scrollbar-track { background: transparent; }
  .es-events-row::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .es-event {
    flex: 0 0 240px; scroll-snap-align: start;
    border: 1.5px solid var(--border); border-radius: 12px;
    padding: 16px; position: relative; background: var(--surface2);
    transition: all 0.2s ease; display: flex; flex-direction: column; gap: 10px;
  }
  .es-event.accepted { border-color: var(--accent); background: var(--accent-light); }
  .es-event.rejected { opacity: 0.35; }

  .es-event-title {
    font-family: 'DM Serif Display', serif;
    font-size: 0.98rem; line-height: 1.3; color: var(--text);
    padding-right: 48px;
  }

  .es-event-meta { display: flex; flex-direction: column; gap: 5px; }
  .es-tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.76rem; color: var(--muted);
  }
  .es-tag svg { flex-shrink: 0; }

  .es-tag-location { color: var(--accent2); }

  .es-event-actions { display: flex; gap: 7px; margin-top: auto; }

  .es-accept {
    background: var(--accent); color: #1A1612; border: none;
    padding: 6px 12px; border-radius: 7px; flex: 1;
    font-size: 0.78rem; font-family: 'DM Sans', sans-serif; font-weight: 600;
    cursor: pointer; transition: opacity 0.15s; display: flex; align-items: center; justify-content: center; gap: 4px;
  }
  .es-accept:hover { opacity: 0.84; }

  .es-reject {
    background: transparent; color: var(--muted); border: 1.5px solid var(--border);
    padding: 6px 10px; border-radius: 7px;
    font-size: 0.78rem; font-family: 'DM Sans', sans-serif; font-weight: 500;
    cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 4px;
  }
  .es-reject:hover { border-color: var(--danger); color: var(--danger); }

  .es-badge {
    position: absolute; top: 10px; right: 10px;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 2px 7px; border-radius: 4px;
  }
  .es-badge.ok { background: var(--accent); color: #1A1612; }
  .es-badge.no { background: var(--surface); color: var(--muted); }

  .es-export-bar {
    margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  }
  .es-export-info { font-size: 0.82rem; color: var(--muted); }
  .es-export-info strong { color: var(--text); }

  .es-export-btn {
    background: var(--accent); color: #1A1612; border: none;
    padding: 9px 18px; border-radius: 10px;
    font-size: 0.85rem; font-family: 'DM Sans', sans-serif; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s;
  }
  .es-export-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .es-export-btn:disabled { opacity: 0.32; cursor: not-allowed; transform: none; }

  .es-toast {
    background: var(--accent); color: #1A1612;
    padding: 11px 16px; border-radius: 10px;
    font-size: 0.83rem; font-weight: 500; margin-top: 12px; text-align: center;
    animation: esUp 0.3s ease both;
  }

  .es-error {
    background: var(--danger-light); border: 1px solid var(--danger-border); color: var(--danger);
    padding: 12px 15px; border-radius: 10px; font-size: 0.84rem; margin-top: 12px; line-height: 1.5;
  }

  .es-reset {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; color: var(--muted);
    font-size: 0.82rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-top: 10px; padding: 5px 0; transition: color 0.15s;
  }
  .es-reset:hover { color: var(--text); }

  .es-empty { text-align: center; padding: 20px; color: var(--muted); font-size: 0.87rem; }


  /* Edit modal */
  .es-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 999; padding: 20px; animation: esUp 0.2s ease both;
  }
  .es-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px; width: 100%; max-width: 360px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
  }
  .es-modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.15rem; color: var(--text); margin-bottom: 18px;
  }
  .es-field { margin-bottom: 13px; }
  .es-field label { display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
  .es-field input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 11px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    outline: none; transition: border-color 0.15s;
  }
  .es-field input:focus { border-color: var(--accent); }
  .es-modal-actions { display: flex; gap: 8px; margin-top: 18px; }
  .es-modal-save {
    flex: 1; background: var(--accent); color: #1A1612; border: none;
    padding: 9px; border-radius: 9px; font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
  }
  .es-modal-save:hover { opacity: 0.85; }
  .es-modal-cancel {
    background: transparent; color: var(--muted); border: 1.5px solid var(--border);
    padding: 9px 16px; border-radius: 9px; font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; cursor: pointer; transition: all 0.15s;
  }
  .es-modal-cancel:hover { border-color: var(--text); color: var(--text); }
  .es-edit-btn {
    background: transparent; color: var(--muted); border: 1.5px solid var(--border);
    padding: 6px 10px; border-radius: 7px;
    font-size: 0.78rem; font-family: 'DM Sans', sans-serif; font-weight: 500;
    cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 4px;
  }
  .es-edit-btn:hover { border-color: var(--accent); color: var(--accent); }
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
function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
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
  const [dark, setDark] = useState(true);
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
  const [editing, setEditing] = useState(null);
  const [editDraft, setEditDraft] = useState({});
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
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
        `Extract event info from this image. Never refuse — always infer if unclear.
Find: title, date, time, end time, location/venue. Output plain text only.`,
        base64, mediaType
      );
      log("→ Extraction done. Structuring...");

      // Step 2: Structure into JSON
      const structured = await gemini(
        `Convert to JSON array. Return ONLY raw JSON, no markdown.
Format: [{"title":string,"date":"YYYY-MM-DD","time":"HH:MM","endTime":"HH:MM","location":string,"description":string}]
Rules: date unknown→${today}, time unknown→"09:00", endTime missing→add 2hrs, location missing→"", description→1 short sentence or "".
FALLBACK: [{"title":"Event","date":"${today}","time":"09:00","endTime":"11:00","location":"","description":""}]

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
  const startEdit = (i) => { setEditing(i); setEditDraft({...events[i]}); };
  const saveEdit = () => { setEvents(prev => prev.map((ev, idx) => idx === editing ? editDraft : ev)); setEditing(null); };
  const acceptedCount = states.filter(s => s === "accepted").length;

  const downloadICS = (icsContent) => {
    const url = URL.createObjectURL(new Blob([icsContent], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url; a.download = "events.ics";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast(true);
  };

  const shareICS = async () => {
    const accepted = events.filter((_, i) => states[i] === "accepted");
    const icsContent = generateICS(accepted);
    const file = new File([icsContent], "events.ics", { type: "text/calendar" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Calendar Events", text: "Add these events to your calendar" });
        setToast(true);
      } catch (err) {
        if (err.name === "AbortError") return;
        // Share failed (desktop) — fall back to download
        downloadICS(icsContent);
      }
    } else {
      downloadICS(icsContent);
    }
  };

  const reset = () => {
    setFile(null); setPreview(null); setEvents([]); setStates([]);
    setShowResults(false); setToast(false); setError(null); setAgentLog([]);
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`es-root${dark ? "" : " light"}`}>

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
              <div className="es-events-row">
                {events.map((ev, i) => (
                  <div key={i} className={`es-event ${states[i] !== "pending" ? states[i] : ""}`}>
                    {states[i] === "accepted" && <span className="es-badge ok">✓ Added</span>}
                    {states[i] === "rejected" && <span className="es-badge no">Skip</span>}
                    <div className="es-event-title">{ev.title || "Untitled Event"}</div>
                    <div className="es-event-meta">
                      <span className="es-tag"><CalIcon />{ev.date ? formatDate(ev.date) : "Date unknown"}</span>
                      <span className="es-tag"><ClockIcon />{ev.time || "?"}{ev.endTime ? ` – ${ev.endTime}` : ""}</span>
                      {ev.location && <span className="es-tag es-tag-location"><PinIcon />{ev.location}</span>}
                    </div>
                    <div className="es-event-actions">
                      <button className="es-accept" onClick={() => setEvState(i, "accepted")}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {states[i] === "accepted" ? "Added" : "Add"}
                      </button>
                      <button className="es-reject" onClick={() => setEvState(i, "rejected")}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Skip
                      </button>
                      <button className="es-edit-btn" onClick={() => startEdit(i)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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


      {editing !== null && (
        <div className="es-modal-overlay" onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div className="es-modal">
            <div className="es-modal-title">Edit Event</div>
            <div className="es-field">
              <label>Title</label>
              <input value={editDraft.title || ""} onChange={e => setEditDraft(d => ({...d, title: e.target.value}))} />
            </div>
            <div className="es-field">
              <label>Date (YYYY-MM-DD)</label>
              <input value={editDraft.date || ""} onChange={e => setEditDraft(d => ({...d, date: e.target.value}))} />
            </div>
            <div className="es-field">
              <label>Start Time (HH:MM)</label>
              <input value={editDraft.time || ""} onChange={e => setEditDraft(d => ({...d, time: e.target.value}))} />
            </div>
            <div className="es-field">
              <label>End Time (HH:MM)</label>
              <input value={editDraft.endTime || ""} onChange={e => setEditDraft(d => ({...d, endTime: e.target.value}))} />
            </div>
            <div className="es-field">
              <label>Location</label>
              <input value={editDraft.location || ""} onChange={e => setEditDraft(d => ({...d, location: e.target.value}))} />
            </div>
            <div className="es-modal-actions">
              <button className="es-modal-cancel" onClick={() => setEditing(null)}>Cancel</button>
              <button className="es-modal-save" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
}
