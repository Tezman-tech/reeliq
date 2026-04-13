import { useState, useRef, useCallback } from "react";

const PLATFORMS = [
  { id: "tiktok", name: "TikTok", short: "TikTok" },
  { id: "instagram", name: "Instagram Reels", short: "Instagram" },
  { id: "youtube", name: "YouTube Shorts", short: "YouTube" },
  { id: "facebook", name: "Facebook Reels", short: "Facebook" },
];

const INSIGHTS_INFO = {
  "Niche": "The content category your video belongs to based on its style, subject, and description.",
  "Pace": "How frequently your video cuts between shots. Faster pacing typically performs better on TikTok and Reels.",
  "Hook strength": "How strong your opening is. Your hook is the first 3 seconds of your video — it determines whether a viewer keeps watching or scrolls past.",
  "Audio trend": "Whether the sound or music in your video is currently trending on that platform. Trending audio boosts algorithmic reach.",
  "Edit readiness": "How close this footage is to being ready to post based on structure, pacing, and visual flow.",
};

const platformBg = (id) => {
  if (id === "tiktok") return "#010101";
  if (id === "instagram") return "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)";
  if (id === "youtube") return "#FF0000";
  return "#1877F2";
};

const platformBarColor = (id) => {
  if (id === "tiktok") return "#534AB7";
  if (id === "instagram") return "#E1306C";
  if (id === "youtube") return "#FF0000";
  return "#1877F2";
};

const PlatformIcon = ({ id, size = 15 }) => {
  if (id === "tiktok") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.54V6.77a4.85 4.85 0 0 1-1.02-.08z"/>
    </svg>
  );
  if (id === "instagram") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
  if (id === "youtube") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
};

function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 4 }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(s => !s)}
        style={{ cursor: "pointer", color: "#aaa", fontSize: 10, border: "1px solid #ccc", borderRadius: "50%", width: 13, height: 13, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 600, lineHeight: 1 }}
      >i</span>
      {show && (
        <div style={{ position: "absolute", bottom: "120%", left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", color: "#fff", fontSize: 11, padding: "8px 10px", borderRadius: 7, width: 210, lineHeight: 1.6, zIndex: 100, pointerEvents: "none" }}>
          {text}
          <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #1a1a1a" }} />
        </div>
      )}
    </span>
  );
}

function ScoreBar({ score, color, animate }) {
  return (
    <div style={{ flex: 1, height: 6, background: "rgba(128,128,128,0.15)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ height: "100%", width: animate ? `${score}%` : "0%", background: color, borderRadius: 10, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

async function callAI(prompt) {
  const response = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
  });
  const data = await response.json();
  const text = data.content?.map(b => b.text || '').join('') || '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function analyseWithClaude(videoInfo, userHook) {
  const hookSection = userHook ? `\nAlso score this specific hook: "${userHook}"` : "";
  const prompt = `You are a short-form video strategist. A creator uploaded:
- Filename: ${videoInfo.name}
- Duration: ${videoInfo.duration}
- Size: ${videoInfo.size}
- Upload type: ${videoInfo.uploadType === "raw" ? "Raw footage" : "Final edited video"}
- Description: "${videoInfo.description || "None provided"}"
${hookSection}

Respond ONLY with JSON (no markdown):
{
  "tags": ["tag1","tag2","tag3"],
  "niche": "1-3 words",
  "pace": "Slow | Moderate | Fast | Very Fast",
  "hookStrength": "Weak | Moderate | Strong | Very Strong",
  "audioTrend": "Not trending | Somewhat trending | Trending | Viral",
  "editReadiness": "Needs editing | Rough cut | Near final | Ready to post",
  "platforms": {
    "tiktok": { "score": 0-100, "reason": "one sentence" },
    "instagram": { "score": 0-100, "reason": "one sentence" },
    "youtube": { "score": 0-100, "reason": "one sentence" },
    "facebook": { "score": 0-100, "reason": "one sentence" }
  },
  "overallTip": "2 sentence strategic insight",
  "editingSuggestions": ["suggestion 1","suggestion 2","suggestion 3"],
  "hooks": [
    { "text": "hook", "platform": "TikTok", "matchLabel": "High match", "avgViews": "2.1M" },
    { "text": "hook", "platform": "Reels", "matchLabel": "Good match", "avgViews": "890K" },
    { "text": "hook", "platform": "TikTok", "matchLabel": "Trending style", "avgViews": "3.4M" }
  ],
  "userHookScore": ${userHook ? '{ "score": 0-100, "label": "Weak|Fair|Good|Strong|Viral", "tip": "one sentence" }' : 'null'}
}`;
  return callAI(prompt);
}

async function getRefreshedHooks(videoInfo, existingHooks) {
  const existing = existingHooks.map(h => h.text).join(" | ");
  const prompt = `You are a short-form video strategist. Generate 3 completely different and fresh hook suggestions. Do NOT repeat or rephrase any of these: ${existing}

Video context:
- Description: "${videoInfo.description || "None provided"}"
- Niche: ${videoInfo.niche || "general"}

Respond ONLY with JSON (no markdown):
{
  "hooks": [
    { "text": "hook line", "platform": "TikTok", "matchLabel": "High match", "avgViews": "2.1M" },
    { "text": "hook line", "platform": "Reels", "matchLabel": "Good match", "avgViews": "890K" },
    { "text": "hook line", "platform": "TikTok", "matchLabel": "Trending style", "avgViews": "1.2M" }
  ]
}`;
  return callAI(prompt);
}

async function optimiseForPlatform(videoInfo, targetPlatform, currentScore, niche) {
  const prompt = `You are a short-form video strategist. A creator has committed to posting on ${targetPlatform.name} even though their content currently scores ${currentScore}% fit for that platform.

Video details:
- Description: "${videoInfo.description || "None provided"}"
- Niche: ${niche}
- Upload type: ${videoInfo.uploadType === "raw" ? "Raw footage" : "Final edited video"}
- Duration: ${videoInfo.duration}

Respond ONLY with JSON (no markdown):
{
  "platformTip": "2 sentence explanation of how ${targetPlatform.name} rewards content differently",
  "hooks": [
    { "text": "hook rewritten for ${targetPlatform.name}", "why": "one sentence on why this works" },
    { "text": "hook rewritten for ${targetPlatform.name}", "why": "one sentence on why this works" },
    { "text": "hook rewritten for ${targetPlatform.name}", "why": "one sentence on why this works" }
  ],
  "formatTips": ["specific format change", "specific format change", "specific format change"],
  "captionStrategy": "2 sentence caption and hashtag strategy",
  "bestPostingTime": "specific day and time recommendation",
  "projectedLift": 0-25
}`;
  return callAI(prompt);
}

const READY_THRESHOLD = 75;
const FREE_ANALYSES = 5;

export default function ReelIQ() {
  const [uploadType, setUploadType] = useState("final");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [results, setResults] = useState(null);
  const [previousScore, setPreviousScore] = useState(null);
  const [analyseCount, setAnalyseCount] = useState(0);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [error, setError] = useState(null);
  const [hookTab, setHookTab] = useState("ai");
  const [userHook, setUserHook] = useState("");
  const [scoringHook, setScoringHook] = useState(false);
  const [hookScore, setHookScore] = useState(null);
  const [scoresVisible, setScoresVisible] = useState(false);
  const [optimiseTarget, setOptimiseTarget] = useState(null);
  const [optimising, setOptimising] = useState(false);
  const [optimisationResult, setOptimisationResult] = useState(null);
  const [showOptimise, setShowOptimise] = useState(false);
  const [refreshingHooks, setRefreshingHooks] = useState(false);
  const fileRef = useRef(null);

  const analysesRemaining = FREE_ANALYSES - totalAnalyses;
  const hitPaywall = analysesRemaining <= 0;

  const processFile = useCallback((f) => {
    if (!f || !f.type.startsWith("video/")) { setError("Please upload a video file (MP4, MOV, etc.)"); return; }
    setFile(f); setVideoUrl(URL.createObjectURL(f));
    setResults(null); setError(null); setHookScore(null); setScoresVisible(false);
    setOptimisationResult(null); setShowOptimise(false); setOptimiseTarget(null);
    setPreviousScore(null); setAnalyseCount(0);
  }, []);

  const formatSize = (b) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)}KB` : `${(b / (1024 * 1024)).toFixed(1)}MB`;

  const getVideoDuration = (url) => new Promise((resolve) => {
    const v = document.createElement("video");
    v.src = url;
    v.onloadedmetadata = () => { const s = Math.round(v.duration); resolve(s < 60 ? `${s}s` : `${Math.floor(s / 60)}m${s % 60}s`); };
    v.onerror = () => resolve("unknown");
  });

  const getVideoInfo = () => ({ name: file?.name, size: formatSize(file?.size || 0), type: file?.type, uploadType, description: description.trim(), niche: results?.niche || "" });

  const topScore = results ? Math.max(...PLATFORMS.map(p => results.platforms[p.id]?.score || 0)) : 0;
  const isReadyToPost = topScore >= READY_THRESHOLD;

  const analyse = async () => {
    if (!file || hitPaywall) return;
    setAnalysing(true); setError(null); setScoresVisible(false);
    setOptimisationResult(null); setShowOptimise(false); setOptimiseTarget(null);
    try {
      const duration = await getVideoDuration(videoUrl);
      const info = { ...getVideoInfo(), duration };
      const data = await analyseWithClaude(info, "");
      if (results) setPreviousScore(topScore);
      setResults(data);
      setAnalyseCount(c => c + 1);
      setTotalAnalyses(c => c + 1);
      setTimeout(() => setScoresVisible(true), 100);
    } catch (e) { setError("Analysis failed. Please try again."); }
    finally { setAnalysing(false); }
  };

  const scoreHook = async () => {
    if (!userHook.trim() || !file) return;
    setScoringHook(true);
    try {
      const duration = await getVideoDuration(videoUrl);
      const info = { ...getVideoInfo(), duration };
      const data = await analyseWithClaude(info, userHook.trim());
      if (data.userHookScore) setHookScore(data.userHookScore);
    } catch (e) { setError("Scoring failed."); }
    finally { setScoringHook(false); }
  };

  const handleRefreshHooks = async () => {
    if (!results?.hooks) return;
    setRefreshingHooks(true);
    try {
      const data = await getRefreshedHooks(getVideoInfo(), results.hooks);
      setResults(prev => ({ ...prev, hooks: data.hooks }));
    } catch (e) { setError("Refresh failed. Try again."); }
    finally { setRefreshingHooks(false); }
  };

  const runOptimisation = async () => {
    if (!optimiseTarget || !results) return;
    setOptimising(true); setOptimisationResult(null);
    try {
      const duration = await getVideoDuration(videoUrl);
      const info = { ...getVideoInfo(), duration };
      const platform = PLATFORMS.find(p => p.id === optimiseTarget);
      const data = await optimiseForPlatform(info, platform, results.platforms[optimiseTarget]?.score || 0, results.niche);
      setOptimisationResult(data);
    } catch (e) { setError("Optimisation failed. Please try again."); }
    finally { setOptimising(false); }
  };

  const switchType = (type) => {
    setUploadType(type); setFile(null); setVideoUrl(null); setResults(null);
    setError(null); setDescription(""); setHookScore(null); setScoresVisible(false);
    setOptimisationResult(null); setShowOptimise(false); setOptimiseTarget(null);
    setPreviousScore(null); setAnalyseCount(0);
  };

  const matchColor = (label) => {
    if (!label) return { bg: "#F1EFE8", text: "#5F5E5A" };
    const l = label.toLowerCase();
    if (l.includes("high") || l.includes("viral")) return { bg: "#E1F5EE", text: "#0F6E56" };
    if (l.includes("good") || l.includes("strong") || l.includes("trending")) return { bg: "#EEEDFE", text: "#3C3489" };
    return { bg: "#FAECE7", text: "#993C1D" };
  };

  const hookScoreColor = (s) => s >= 80 ? "#0F6E56" : s >= 60 ? "#534AB7" : s >= 40 ? "#BA7517" : "#993C1D";
  const sortedPlatforms = results ? [...PLATFORMS].sort((a, b) => (results.platforms[b.id]?.score || 0) - (results.platforms[a.id]?.score || 0)) : PLATFORMS;
  const isFinal = uploadType === "final";
  const card = { background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "1.25rem" };
  const sectionLabel = { fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 500, marginBottom: 12 };

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", maxWidth: 940, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#534AB7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.4px" }}>
            Reel<span style={{ color: "#534AB7" }}>.</span><span style={{ color: "#534AB7" }}>IQ</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!hitPaywall && totalAnalyses > 0 && (
            <span style={{ fontSize: 11, color: "#888" }}>{analysesRemaining} free {analysesRemaining === 1 ? "analysis" : "analyses"} left</span>
          )}
          <span style={{ fontSize: 11, background: "#EEEDFE", color: "#3C3489", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>Beta</span>
        </div>
      </div>

      {/* Paywall banner */}
      {hitPaywall && (
        <div style={{ background: "#534AB7", borderRadius: 12, padding: "16px 20px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>You've used your 5 free analyses this month</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Upgrade to Pro for unlimited analyses, platform optimisation, hook scoring and more.</div>
          </div>
          <button style={{ background: "#fff", color: "#534AB7", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Upgrade to Pro — A$29/mo
          </button>
        </div>
      )}

      {/* Ready to post banner */}
      {results && isReadyToPost && (
        <div style={{ background: "#E1F5EE", border: "1px solid #9FE1CB", borderRadius: 12, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#085041", marginBottom: 2 }}>
              {analyseCount > 1 ? "Great improvements — this video is ready to post." : "This video is ready to post."}
            </div>
            <div style={{ fontSize: 12, color: "#0F6E56" }}>
              {analyseCount > 1 && previousScore ? `Score improved from ${previousScore}% to ${topScore}% — ` : ""}
              Stop tweaking. Hit publish and let the algorithm do its job.
            </div>
          </div>
        </div>
      )}

      {results && analyseCount > 1 && previousScore && !isReadyToPost && (
        <div style={{ background: "#EEEDFE", border: "1px solid #CECBF6", borderRadius: 12, padding: "12px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: "#3C3489" }}>
            {topScore > previousScore ? `Score improved from ${previousScore}% → ${topScore}%. Keep going — one more round of edits should get you there.` : `Score held at ${topScore}%. Focus on the hook and first 3 seconds — that's your biggest lever.`}
          </div>
        </div>
      )}

      {/* Upload type selector */}
      <div style={{ ...card, marginBottom: 14 }}>
        <div style={sectionLabel}>What are you uploading?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { id: "final", title: "Final edited video", sub: "Your video is cut and ready. Get a verdict before you post.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
            { id: "raw", title: "Raw footage", sub: "Still in the edit? Get direction before you lock your cut.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg> },
          ].map((opt) => {
            const active = uploadType === opt.id;
            return (
              <div key={opt.id} onClick={() => switchType(opt.id)} style={{ border: active ? "1.5px solid #534AB7" : "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "14px", cursor: "pointer", background: active ? "#EEEDFE" : "#f8f8f6", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ color: active ? "#534AB7" : "#888", flexShrink: 0, marginTop: 1 }}>{opt.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: active ? "#3C3489" : "#1a1a1a", marginBottom: 3 }}>{opt.title}</div>
                    <div style={{ fontSize: 11, color: active ? "#534AB7" : "#888", lineHeight: 1.5 }}>{opt.sub}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Upload card */}
          <div style={card}>
            <div style={sectionLabel}>{isFinal ? "Upload your final edit" : "Upload your raw footage"}</div>
            {!file ? (
              <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
                onClick={() => fileRef.current?.click()}
                style={{ border: `1.5px dashed ${dragging ? "#534AB7" : "rgba(0,0,0,0.15)"}`, borderRadius: 10, padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: dragging ? "#EEEDFE" : "#f8f8f6", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{isFinal ? "Drop your final edit here" : "Drop your raw footage here"}</div>
                <div style={{ fontSize: 11, color: "#888", textAlign: "center", lineHeight: 1.6 }}>MP4, MOV up to 500MB · 9:16 recommended</div>
                <div style={{ marginTop: 4, background: "#534AB7", color: "#fff", borderRadius: 8, padding: "7px 18px", fontSize: 12, fontWeight: 500 }}>Browse files</div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 68, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#1a1a2e", aspectRatio: "9/16" }}>
                  <video src={videoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted playsInline />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", marginBottom: 2, wordBreak: "break-all" }}>{file.name}</div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>{formatSize(file.size)} · {file.type.split("/")[1]?.toUpperCase()}</div>
                  <span style={{ background: isFinal ? "#E1F5EE" : "#FAECE7", color: isFinal ? "#0F6E56" : "#993C1D", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{isFinal ? "Final edit" : "Raw footage"}</span>
                  {results?.tags && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>{results.tags.map(t => <span key={t} style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 10, padding: "2px 7px", borderRadius: 20 }}>{t}</span>)}</div>}
                  <button onClick={() => { setFile(null); setVideoUrl(null); setResults(null); setHookScore(null); setDescription(""); setOptimisationResult(null); setShowOptimise(false); setPreviousScore(null); setAnalyseCount(0); }}
                    style={{ marginTop: 8, fontSize: 11, color: "#888", background: "transparent", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 6, padding: "3px 10px", cursor: "pointer", display: "block" }}>Remove</button>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 6, lineHeight: 1.5 }}>
                {isFinal ? "Describe what this video is about" : "Describe your concept and goal"}
                <span style={{ color: "#7F77DD" }}> — sharpens the analysis</span>
              </div>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder={isFinal ? "e.g. A morning routine video showing my 5am workflow as a filmmaker..." : "e.g. Raw B-roll from a Sony FX3 shoot, showcasing low light for a filmmaking audience..."}
                rows={3} style={{ width: "100%", background: "#f8f8f6", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#1a1a1a", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
            </div>
            {error && <div style={{ marginTop: 8, fontSize: 12, color: "#993C1D", background: "#FAECE7", padding: "6px 10px", borderRadius: 6 }}>{error}</div>}
          </div>

          {/* Hook definition box */}
          <div style={{ background: "#EEEDFE", border: "0.5px solid #CECBF6", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#3C3489", marginBottom: 4 }}>What is a hook?</div>
            <div style={{ fontSize: 12, color: "#534AB7", lineHeight: 1.6 }}>
              Your hook is the <strong>first 3 seconds</strong> of your video — not the caption. It's the opening moment that stops someone from scrolling. Strong hooks drive watch time. Weak hooks lose viewers before they start.
            </div>
          </div>

          {/* Content insights */}
          {results && (
            <div style={card}>
              <div style={sectionLabel}>Content insights</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Niche", val: results.niche },
                  { label: "Pace", val: results.pace },
                  { label: "Hook strength", val: results.hookStrength, good: ["Strong","Very Strong"].includes(results.hookStrength) },
                  { label: "Audio trend", val: results.audioTrend, good: ["Trending","Viral"].includes(results.audioTrend) },
                  ...(!isFinal && results.editReadiness ? [{ label: "Edit readiness", val: results.editReadiness }] : []),
                ].map(item => (
                  <div key={item.label} style={{ background: "#f8f8f6", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 3, display: "flex", alignItems: "center" }}>
                      {item.label}
                      {INSIGHTS_INFO[item.label] && <Tooltip text={INSIGHTS_INFO[item.label]} />}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: item.good === true ? "#0F6E56" : item.good === false ? "#A32D2D" : "#1a1a1a" }}>{item.val}</div>
                  </div>
                ))}
              </div>
              {!isFinal && results.editingSuggestions?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>Editing suggestions</div>
                  {results.editingSuggestions.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#534AB7" }}>{i + 1}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.5 }}>{s}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {file && !isReadyToPost && !hitPaywall && (
            <button onClick={analyse} disabled={analysing} style={{ width: "100%", background: analysing ? "#AFA9EC" : "#534AB7", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 500, cursor: analysing ? "not-allowed" : "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {analysing ? (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg>Analysing your {isFinal ? "edit" : "footage"}...</>) : analyseCount === 0 ? `Analyse this ${isFinal ? "video" : "footage"}` : "Re-analyse after edits"}
            </button>
          )}

          {file && isReadyToPost && (
            <div style={{ background: "#E1F5EE", border: "1px solid #9FE1CB", borderRadius: 10, padding: "13px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#085041" }}>Ready to post — go publish it!</div>
              <div style={{ fontSize: 12, color: "#0F6E56", marginTop: 4 }}>Stop optimising. The algorithm rewards consistency over perfection.</div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Platform scores */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={sectionLabel}>Platform fit</div>
              {results && !isReadyToPost && (
                <button onClick={() => { setShowOptimise(!showOptimise); setOptimisationResult(null); }} style={{ fontSize: 11, color: showOptimise ? "#fff" : "#534AB7", background: showOptimise ? "#534AB7" : "#EEEDFE", border: "none", borderRadius: 20, padding: "4px 12px", cursor: "pointer", fontWeight: 500 }}>
                  {showOptimise ? "Back to scores" : "Optimise for a platform"}
                </button>
              )}
            </div>

            {!results ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {PLATFORMS.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: p.id !== "instagram" ? platformBg(p.id) : undefined, backgroundImage: p.id === "instagram" ? platformBg(p.id) : undefined, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><PlatformIcon id={p.id} /></div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", minWidth: 105 }}>{p.name}</div>
                    <div style={{ flex: 1, height: 6, background: "rgba(128,128,128,0.12)", borderRadius: 10 }} />
                    <div style={{ fontSize: 12, color: "#888", minWidth: 28, textAlign: "right" }}>—</div>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: "#888", textAlign: "center", marginTop: 4, lineHeight: 1.6 }}>Upload and analyse to see platform scores</div>
              </div>
            ) : !showOptimise ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {sortedPlatforms.map((p, i) => {
                    const score = results.platforms[p.id]?.score || 0;
                    const reason = results.platforms[p.id]?.reason || "";
                    return (
                      <div key={p.id}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: p.id !== "instagram" ? platformBg(p.id) : undefined, backgroundImage: p.id === "instagram" ? platformBg(p.id) : undefined }}><PlatformIcon id={p.id} /></div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", minWidth: 105, display: "flex", alignItems: "center", gap: 6 }}>
                            {p.name}
                            {i === 0 && !isReadyToPost && <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 10, padding: "1px 6px", borderRadius: 20, fontWeight: 500 }}>Best fit</span>}
                            {isReadyToPost && i === 0 && <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 10, padding: "1px 6px", borderRadius: 20, fontWeight: 500 }}>Ready ✓</span>}
                          </div>
                          <ScoreBar score={score} color={platformBarColor(p.id)} animate={scoresVisible} />
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", minWidth: 32, textAlign: "right" }}>{score}%</div>
                        </div>
                        <div style={{ fontSize: 11, color: "#888", paddingLeft: 42, lineHeight: 1.5 }}>{reason}</div>
                      </div>
                    );
                  })}
                </div>
                {results.overallTip && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "0.5px solid rgba(0,0,0,0.08)", fontSize: 12, color: "#888", lineHeight: 1.7 }}>{results.overallTip}</div>
                )}
              </>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 14, lineHeight: 1.6 }}>Already committed to a platform? Select it and we'll give you a specific plan to make your content win there.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {PLATFORMS.map(p => {
                    const score = results.platforms[p.id]?.score || 0;
                    const selected = optimiseTarget === p.id;
                    return (
                      <div key={p.id} onClick={() => { setOptimiseTarget(p.id); setOptimisationResult(null); }}
                        style={{ border: selected ? "1.5px solid #534AB7" : "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "12px", cursor: "pointer", background: selected ? "#EEEDFE" : "#f8f8f6", transition: "all 0.15s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 7, background: p.id !== "instagram" ? platformBg(p.id) : undefined, backgroundImage: p.id === "instagram" ? platformBg(p.id) : undefined, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><PlatformIcon id={p.id} size={13} /></div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: selected ? "#3C3489" : "#1a1a1a" }}>{p.short}</div>
                        </div>
                        <div style={{ fontSize: 11, color: selected ? "#534AB7" : "#888" }}>Current fit: <span style={{ fontWeight: 500, color: score >= 70 ? "#0F6E56" : score >= 50 ? "#BA7517" : "#993C1D" }}>{score}%</span></div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={runOptimisation} disabled={!optimiseTarget || optimising}
                  style={{ width: "100%", background: !optimiseTarget ? "rgba(128,128,128,0.15)" : "#534AB7", color: !optimiseTarget ? "#888" : "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 500, cursor: !optimiseTarget ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: optimisationResult ? 14 : 0 }}>
                  {optimising ? (<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg>Optimising...</>) : optimiseTarget ? `Optimise for ${PLATFORMS.find(p => p.id === optimiseTarget)?.short}` : "Select a platform above"}
                </button>
                {optimisationResult && (
                  <div>
                    <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Platform insight</div>
                      <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.6 }}>{optimisationResult.platformTip}</div>
                      {optimisationResult.projectedLift > 0 && <div style={{ marginTop: 8 }}><span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>+{optimisationResult.projectedLift}% projected lift</span></div>}
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Hooks rewritten for {PLATFORMS.find(p => p.id === optimiseTarget)?.short}</div>
                      {optimisationResult.hooks?.map((h, i) => (
                        <div key={i} style={{ background: "#f8f8f6", borderRadius: 8, padding: "11px 13px", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                            <div style={{ fontSize: 13, color: "#1a1a1a", fontStyle: "italic", lineHeight: 1.5 }}>"{h.text}"</div>
                            <button onClick={() => navigator.clipboard?.writeText(h.text)} style={{ fontSize: 11, color: "#534AB7", fontWeight: 500, cursor: "pointer", background: "transparent", border: "none", whiteSpace: "nowrap" }}>Copy</button>
                          </div>
                          <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{h.why}</div>
                        </div>
                      ))}
                    </div>
                    {optimisationResult.formatTips?.length > 0 && (
                      <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Format tweaks</div>
                        {optimisationResult.formatTips.map((t, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}><span style={{ fontSize: 9, fontWeight: 600, color: "#534AB7" }}>{i + 1}</span></div>
                            <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.5 }}>{t}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Caption strategy</div>
                        <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.5 }}>{optimisationResult.captionStrategy}</div>
                      </div>
                      <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Best posting time</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a" }}>{optimisationResult.bestPostingTime}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hooks */}
          <div style={card}>
            <div style={sectionLabel}>Hook suggestions</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {[["ai", "AI generated"], ["own", "Score your hook"]].map(([id, lbl]) => (
                <button key={id} onClick={() => setHookTab(id)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: hookTab === id ? "none" : "0.5px solid rgba(0,0,0,0.15)", background: hookTab === id ? "#534AB7" : "transparent", color: hookTab === id ? "#fff" : "#888", cursor: "pointer", fontWeight: hookTab === id ? 500 : 400 }}>{lbl}</button>
              ))}
            </div>

            {hookTab === "ai" && (
              !results ? (
                <div style={{ fontSize: 12, color: "#888", textAlign: "center", padding: "1.5rem 0", lineHeight: 1.7 }}>Analyse your {isFinal ? "video" : "footage"} first<br />to get AI hook suggestions</div>
              ) : (
                <>
                  {results.hooks?.map((hook, i) => {
                    const mc = matchColor(hook.matchLabel);
                    return (
                      <div key={i} style={{ background: "#f8f8f6", borderRadius: 8, padding: "12px 13px", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                          <div style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.5, fontStyle: "italic" }}>"{hook.text}"</div>
                          <button onClick={() => navigator.clipboard?.writeText(hook.text)} style={{ fontSize: 11, color: "#534AB7", fontWeight: 500, cursor: "pointer", background: "transparent", border: "none", whiteSpace: "nowrap" }}>Copy</button>
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ background: mc.bg, color: mc.text, fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 500 }}>{hook.matchLabel}</span>
                          <span style={{ fontSize: 11, color: "#888" }}>{hook.platform}</span>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.2)", display: "inline-block" }} />
                          <span style={{ fontSize: 11, color: "#888" }}>{hook.avgViews} avg views</span>
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={handleRefreshHooks} disabled={refreshingHooks}
                    style={{ width: "100%", background: "transparent", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 8, padding: "9px", fontSize: 12, color: refreshingHooks ? "#aaa" : "#534AB7", fontWeight: 500, cursor: refreshingHooks ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 2 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: refreshingHooks ? "spin 1s linear infinite" : "none" }}>
                      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    {refreshingHooks ? "Getting new hooks..." : "Refresh — get 3 new hooks"}
                  </button>
                </>
              )
            )}

            {hookTab === "own" && (
              <div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8, lineHeight: 1.6 }}>
                  Write your hook and we'll score it. Remember — your hook is the <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>first 3 seconds</strong> of your video, not the caption.
                </div>
                <textarea value={userHook} onChange={e => setUserHook(e.target.value)} placeholder="e.g. 'Nobody tells you this about filmmaking on a budget...'" rows={3}
                  style={{ width: "100%", background: "#f8f8f6", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#1a1a1a", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
                <button onClick={scoreHook} disabled={!userHook.trim() || !file || scoringHook}
                  style={{ marginTop: 8, width: "100%", background: (!userHook.trim() || !file) ? "rgba(128,128,128,0.15)" : "#534AB7", color: (!userHook.trim() || !file) ? "#888" : "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 500, cursor: (!userHook.trim() || !file) ? "not-allowed" : "pointer" }}>
                  {scoringHook ? "Scoring..." : !file ? "Upload a video first" : "Score this hook"}
                </button>
                {hookScore && (
                  <div style={{ marginTop: 12, background: "#f8f8f6", borderRadius: 8, padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ fontSize: 30, fontWeight: 600, color: hookScoreColor(hookScore.score) }}>{hookScore.score}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>{hookScore.label}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>out of 100</div>
                      </div>
                    </div>
                    <div style={{ height: 6, background: "rgba(128,128,128,0.15)", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ height: "100%", width: `${hookScore.score}%`, background: hookScoreColor(hookScore.score), borderRadius: 10, transition: "width 0.8s ease" }} />
                    </div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
                      <span style={{ color: "#1a1a1a", fontWeight: 500 }}>Tip: </span>{hookScore.tip}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

