import { Bot, BriefcaseBusiness, Download, FolderKanban, Mail, MessageCircle, Pin, Play, Radio, Sparkles, Square, Volume2, VolumeX, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { requestAivonVoice } from "../lib/aivonVoice";

type Blast = { id: number; startX: number; startY: number; endX: number; endY: number };
type FlightDirection = "idle" | "landing";
type TeleportPhase = "idle" | "vanish" | "arrive";
type TourStep = { selector: string; label: string; message: string };

const TOUR_STEPS: TourStep[] = [
  { selector: "#top", label: "Introduction", message: "Meet Abhishek Patel—a MERN stack developer focused on turning practical ideas into polished digital products." },
  { selector: "#about", label: "About Abhishek", message: "Abhishek combines thoughtful frontend work with reliable backend development and a strong product mindset." },
  { selector: "#skills", label: "Technical Skills", message: "Here is the toolkit he uses to build complete products, from responsive interfaces to APIs and databases." },
  { selector: "#experience", label: "Experience", message: "This section highlights the real-world responsibilities, collaboration, and engineering experience behind his work." },
  { selector: "#projects", label: "Featured Work", message: "These projects demonstrate how Abhishek approaches product problems across the full stack—not just how the final screens look." },
  { selector: "#contact", label: "Start a Conversation", message: "That concludes the tour. If Abhishek feels like the right fit, you can connect with him right here." },
];

const AIVON_VOICE_VERSION = "aivon-cinematic-v1";

function createCompanionGreeting(arcane = false) {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  if (arcane) {
    const messages = [
      `${timeGreeting}, traveler. I am the Arcane Guide—welcome to Abhishek's enchanted archives.`,
      "The archives are awake. I am your Arcane Guide through Abhishek's work, skills, and creations.",
      "Welcome, curious traveler. Climb aboard—there is plenty of magic hidden in Abhishek's portfolio.",
      "A new visitor has crossed the threshold. I am the Arcane Guide, and these archives are yours to explore.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  const messages = [
    `${timeGreeting}! I'm Aivon, Abhishek's personal assistant. Welcome to his portfolio.`,
    "Hello there! Aivon at your service. Let me show you around Abhishek's digital workspace.",
    "Welcome! I'm Aivon, your guide to Abhishek's skills, experience, and creations.",
    "Greetings, visitor! I'm Aivon. You've just entered Abhishek's corner of the web.",
    "Hi! I'm Aivon, Abhishek's personal assistant. Feel free to explore everything he has built.",
    "A new visitor detected—welcome! I'm Aivon, and I'll be accompanying you through this portfolio.",
    "It's great to have you here! I'm Aivon, your personal guide to Abhishek's work.",
    "Welcome aboard! Aivon here. Let's discover what Abhishek has been creating.",
  ];
  const previous = Number(window.localStorage.getItem("aivon-last-greeting"));
  const available = messages.map((_, index) => index).filter(index => index !== previous);
  const index = available[Math.floor(Math.random() * available.length)];
  window.localStorage.setItem("aivon-last-greeting", String(index));
  return messages[index];
}

export function CursorCompanion() {
  const companionRef = useRef<HTMLDivElement>(null);
  const broomTrailRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 240, y: 70 });
  const target = useRef({ x: 240, y: 70 });
  const cursorTarget = useRef({ x: 240, y: 70 });
  const dock = useRef({ x: 240, y: 70 });
  const frame = useRef(0);
  const directionRef = useRef<FlightDirection>("idle");
  const teleportTimer = useRef<number | undefined>(undefined);
  const teleportEndTimer = useRef<number | undefined>(undefined);
  const scrollStopTimer = useRef<number | undefined>(undefined);
  const scrollInProgress = useRef(false);
  const teleportActive = useRef(false);
  const teleportPending = useRef(false);
  const messageTimer = useRef<number | undefined>(undefined);
  const tourTimer = useRef<number | undefined>(undefined);
  const highlightTimer = useRef<number | undefined>(undefined);
  const highlightedElement = useRef<Element | null>(null);
  const voiceEnabledRef = useRef(false);
  const voiceStartTimer = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioCache = useRef(new Map<string, string>());
  const voiceRequestId = useRef(0);
  const lastScrollY = useRef(0);
  const blastId = useRef(0);
  const lastBroomStar = useRef({ x: 240, y: 70, time: 0 });
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [parked, setParked] = useState(false);
  const [direction, setDirection] = useState<FlightDirection>("idle");
  const [blasts, setBlasts] = useState<Blast[]>([]);
  const [showGreeting, setShowGreeting] = useState(true);
  const [assistantMessage, setAssistantMessage] = useState(() => createCompanionGreeting(document.documentElement.dataset.theme === "arcane"));
  const [messageVersion, setMessageVersion] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [teleportPhase, setTeleportPhase] = useState<TeleportPhase>("idle");
  const [portalPosition, setPortalPosition] = useState<{ x: number; y: number } | null>(null);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const isArcane = theme === "arcane";
  const assistantName = isArcane ? "Arcane Guide" : "Aivon";

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setTheme(root.dataset.theme || "dark"));
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const message = createCompanionGreeting(isArcane);
    setAssistantMessage(message);
    setMessageVersion(version => version + 1);
    setShowGreeting(true);
    window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setShowGreeting(false), 7600);
  }, [isArcane]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(finePointer.matches && !reducedMotion.matches && window.innerWidth >= 768);
    update(); finePointer.addEventListener("change", update); reducedMotion.addEventListener("change", update); window.addEventListener("resize", update);
    return () => { finePointer.removeEventListener("change", update); reducedMotion.removeEventListener("change", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    ["/aegis-companion-v3.png", "/aegis-landing.png", "/arcane-witch-companion.png"].forEach(src => { const image = new Image(); image.src = src; });
  }, []);

  useEffect(() => {
    setVoiceAvailable("Audio" in window || ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window));
    return () => {
      window.clearTimeout(voiceStartTimer.current);
      window.speechSynthesis?.cancel();
      voiceAudioRef.current?.pause();
      voiceAudioCache.current.forEach(url => URL.revokeObjectURL(url));
      voiceAudioCache.current.clear();
      void audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(messageTimer.current);
      window.clearTimeout(tourTimer.current);
      window.clearTimeout(highlightTimer.current);
      highlightedElement.current?.classList.remove("aivon-section-highlight");
    };
  }, []);

  useEffect(() => {
    if (!tourActive) return;
    const step = TOUR_STEPS[tourIndex];
    if (!step) {
      setTourActive(false);
      clearSectionHighlight();
      speak("Tour complete. You can ask me to revisit any section whenever you like.", 6500);
      return;
    }
    setMenuOpen(false);
    focusSection(step.selector);
    speak(`${step.label}: ${step.message}`, 7100);
    tourTimer.current = window.setTimeout(() => setTourIndex(index => index + 1), 7300);
    return () => window.clearTimeout(tourTimer.current);
  }, [tourActive, tourIndex]);

  useEffect(() => {
    if (!enabled) return;
    function updateDock() {
      const anchor = document.querySelector("[data-aegis-dock]")?.getBoundingClientRect();
      if (!anchor) return;
      dock.current = { x: anchor.right + 100, y: anchor.top + anchor.height / 2 + 20 };
      if (parked || position.current.x === 240) {
        target.current = { ...dock.current };
        cursorTarget.current = { ...dock.current };
        if (!parked) position.current = { ...dock.current };
      }
    }
    updateDock(); window.addEventListener("resize", updateDock);
    return () => window.removeEventListener("resize", updateDock);
  }, [enabled, parked]);

  useEffect(() => {
    if (!enabled) return;
    function move(event: PointerEvent) {
      if (parked) return;
      cursorTarget.current = { x: event.clientX + 58, y: event.clientY - 58 };
      if (scrollInProgress.current || teleportActive.current) return;
      target.current = cursorTarget.current;
    }
    function blast(event: PointerEvent) {
      if (parked || (event.target instanceof Element && event.target.closest("[data-aegis-control]"))) return;
      const id = ++blastId.current;
      const emitter = { x: -25, y: -2 };
      const next = { id, startX: position.current.x + emitter.x, startY: position.current.y + emitter.y, endX: event.clientX, endY: event.clientY };
      setBlasts(items => [...items.slice(-3), next]);
      window.setTimeout(() => setBlasts(items => items.filter(item => item.id !== id)), 620);
    }
    function triggerTeleport() {
      if (parked) return;
      const marginX = Math.min(120, window.innerWidth * .18);
      const marginY = Math.min(110, window.innerHeight * .2);
      let arrival = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const candidate = {
          x: marginX + Math.random() * Math.max(1, window.innerWidth - marginX * 2),
          y: marginY + Math.random() * Math.max(1, window.innerHeight - marginY * 2),
        };
        arrival = candidate;
        if (Math.hypot(candidate.x - cursorTarget.current.x, candidate.y - cursorTarget.current.y) > 210) break;
      }
      window.clearTimeout(teleportTimer.current);
      window.clearTimeout(teleportEndTimer.current);
      teleportActive.current = true;
      setPortalPosition(arrival);
      setTeleportPhase("vanish");
      teleportTimer.current = window.setTimeout(() => {
        position.current = { ...arrival };
        target.current = { ...arrival };
        setTeleportPhase("arrive");
      }, 230);
      teleportEndTimer.current = window.setTimeout(() => {
        teleportActive.current = false;
        setTeleportPhase("idle");
        setPortalPosition(null);
        target.current = { ...cursorTarget.current };
      }, 1050);
    }
    function isFullyOutsideViewport() {
      const rect = companionRef.current?.getBoundingClientRect();
      if (!rect) return false;
      return rect.right <= 0 || rect.left >= window.innerWidth || rect.bottom <= 0 || rect.top >= window.innerHeight;
    }
    function detectScrollJump() {
      if (parked) { lastScrollY.current = window.scrollY; return; }
      const delta = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      if (Math.abs(delta) < 1) return;
      scrollInProgress.current = true;
      teleportPending.current = true;
      position.current.y -= delta;
      target.current = { ...position.current };
      window.clearTimeout(scrollStopTimer.current);
      scrollStopTimer.current = window.setTimeout(() => {
        scrollInProgress.current = false;
        if (!teleportPending.current) return;
        teleportPending.current = false;
        if (isFullyOutsideViewport()) triggerTeleport();
        else target.current = { ...cursorTarget.current };
      }, 220);
    }
    function animate() {
      position.current.x += (target.current.x - position.current.x) * 0.035;
      position.current.y += (target.current.y - position.current.y) * 0.035;
      if (parked && directionRef.current !== "landing" && Math.hypot(dock.current.x - position.current.x, dock.current.y - position.current.y) < 10) {
        directionRef.current = "landing";
        setDirection("landing");
      }
      if (companionRef.current) companionRef.current.style.transform = `translate3d(${position.current.x - (isArcane ? 94 : 44)}px, ${position.current.y - (isArcane ? 62 : 52)}px, 0)`;
      if (isArcane && !parked && broomTrailRef.current) {
        const now = performance.now();
        const traveled = Math.hypot(position.current.x - lastBroomStar.current.x, position.current.y - lastBroomStar.current.y);
        if (traveled > 4 && now - lastBroomStar.current.time > 72) {
          const star = document.createElement("i");
          star.className = "arcane-broom-star";
          star.textContent = Math.random() > .45 ? "✦" : "✧";
          star.style.left = `${position.current.x - 84 + (Math.random() - .5) * 14}px`;
          star.style.top = `${position.current.y + 32 + (Math.random() - .5) * 12}px`;
          star.style.setProperty("--star-drift", `${-22 - Math.random() * 28}px`);
          star.style.setProperty("--star-fall", `${10 + Math.random() * 22}px`);
          star.style.setProperty("--star-turn", `${Math.round((Math.random() - .5) * 220)}deg`);
          star.style.setProperty("--star-size", `${7 + Math.random() * 7}px`);
          broomTrailRef.current.appendChild(star);
          window.setTimeout(() => star.remove(), 1050);
          lastBroomStar.current = { x: position.current.x, y: position.current.y, time: now };
        }
      }
      frame.current = requestAnimationFrame(animate);
    }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", blast, { passive: true });
    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", detectScrollJump, { passive: true });
    frame.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", blast); window.removeEventListener("scroll", detectScrollJump); window.clearTimeout(scrollStopTimer.current); window.clearTimeout(teleportTimer.current); window.clearTimeout(teleportEndTimer.current); cancelAnimationFrame(frame.current); broomTrailRef.current?.replaceChildren(); };
  }, [enabled, parked, isArcane]);

  function playRobotActivationTone() {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;
    [190, 430, 285].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 1 ? "sawtooth" : "square";
      oscillator.frequency.setValueAtTime(frequency, now + index * .045);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.12, now + index * .045 + .07);
      gain.gain.setValueAtTime(.0001, now + index * .045);
      gain.gain.exponentialRampToValueAtTime(.055, now + index * .045 + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, now + index * .045 + .09);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + index * .045);
      oscillator.stop(now + index * .045 + .1);
    });
  }

  function cancelVoicePlayback() {
    voiceRequestId.current += 1;
    window.clearTimeout(voiceStartTimer.current);
    voiceAudioRef.current?.pause();
    voiceAudioRef.current = null;
    window.speechSynthesis?.cancel();
    setVoiceLoading(false);
  }

  function connectCinematicVoice(player: HTMLAudioElement) {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume();

    const source = context.createMediaElementSource(player);
    const lowWeight = context.createBiquadFilter();
    lowWeight.type = "lowshelf";
    lowWeight.frequency.value = 170;
    lowWeight.gain.value = 4.5;

    const clarity = context.createBiquadFilter();
    clarity.type = "peaking";
    clarity.frequency.value = 2100;
    clarity.Q.value = .75;
    clarity.gain.value = 2.2;

    const cleanGain = context.createGain();
    cleanGain.gain.value = .88;

    const harmonicCurve = new Float32Array(512);
    for (let index = 0; index < harmonicCurve.length; index += 1) {
      const input = index * 2 / (harmonicCurve.length - 1) - 1;
      harmonicCurve[index] = Math.tanh(input * 1.3) / Math.tanh(1.3);
    }
    const harmonics = context.createWaveShaper();
    harmonics.curve = harmonicCurve;
    harmonics.oversample = "2x";
    const harmonicGain = context.createGain();
    harmonicGain.gain.value = .12;

    const metalBand = context.createBiquadFilter();
    metalBand.type = "bandpass";
    metalBand.frequency.value = 620;
    metalBand.Q.value = 1.1;
    const metalDelay = context.createDelay(.12);
    metalDelay.delayTime.value = .032;
    const metalGain = context.createGain();
    metalGain.gain.value = .085;

    const bus = context.createGain();
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 18;
    compressor.ratio.value = 3.2;
    compressor.attack.value = .006;
    compressor.release.value = .22;
    const master = context.createGain();
    master.gain.value = .9;

    source.connect(lowWeight).connect(clarity);
    clarity.connect(cleanGain).connect(bus);
    clarity.connect(harmonics).connect(harmonicGain).connect(bus);
    clarity.connect(metalBand).connect(metalDelay).connect(metalGain).connect(bus);
    bus.connect(compressor).connect(master).connect(context.destination);
  }

  function speakWithBrowserVoice(message: string) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    utterance.rate = .86;
    utterance.pitch = .76;
    utterance.volume = .95;
    const englishVoices = synthesis.getVoices().filter(voice => voice.lang.toLowerCase().startsWith("en"));
    const preferredNames = [/\b(daniel|aaron|alex)\b/i, /google uk english male/i, /microsoft (guy|david|mark)/i, /\brishi\b/i];
    utterance.voice = preferredNames.map(pattern => englishVoices.find(voice => pattern.test(voice.name))).find(Boolean) ?? englishVoices.find(voice => voice.lang.toLowerCase() === "en-in") ?? englishVoices[0] ?? null;
    utterance.lang = utterance.voice?.lang || "en-US";
    voiceStartTimer.current = window.setTimeout(() => {
      if (voiceEnabledRef.current) synthesis.speak(utterance);
    }, 145);
  }

  async function speakAloud(message: string) {
    if (!voiceEnabledRef.current) return;
    cancelVoicePlayback();
    const requestId = voiceRequestId.current;
    setVoiceLoading(true);
    playRobotActivationTone();
    try {
      const cacheKey = `${AIVON_VOICE_VERSION}:${message}`;
      let audioUrl = voiceAudioCache.current.get(cacheKey);
      if (!audioUrl) {
        const audio = await requestAivonVoice(message);
        if (requestId !== voiceRequestId.current || !voiceEnabledRef.current) return;
        audioUrl = URL.createObjectURL(audio);
        voiceAudioCache.current.set(cacheKey, audioUrl);
      }
      if (requestId !== voiceRequestId.current || !voiceEnabledRef.current) return;
      const player = new Audio(audioUrl);
      player.preload = "auto";
      voiceAudioRef.current = player;
      connectCinematicVoice(player);
      setVoiceLoading(false);
      await player.play();
    } catch {
      if (requestId !== voiceRequestId.current || !voiceEnabledRef.current) return;
      setVoiceLoading(false);
      speakWithBrowserVoice(message);
    }
  }

  function speak(message: string, duration = 6200) {
    window.clearTimeout(messageTimer.current);
    setAssistantMessage(message);
    setMessageVersion(version => version + 1);
    setShowGreeting(true);
    void speakAloud(message);
    messageTimer.current = window.setTimeout(() => setShowGreeting(false), duration);
  }

  function toggleVoice() {
    if (!voiceAvailable) return;
    const next = !voiceEnabledRef.current;
    voiceEnabledRef.current = next;
    setVoiceEnabled(next);
    if (next) void speakAloud(assistantMessage);
    else cancelVoicePlayback();
  }

  function clearSectionHighlight() {
    window.clearTimeout(highlightTimer.current);
    highlightedElement.current?.classList.remove("aivon-section-highlight");
    highlightedElement.current = null;
  }

  function focusSection(selector: string) {
    const section = document.querySelector(selector);
    if (!section) return;
    clearSectionHighlight();
    highlightedElement.current = section;
    section.classList.add("aivon-section-highlight");
    section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    highlightTimer.current = window.setTimeout(clearSectionHighlight, 4600);
  }

  function cancelTour() {
    window.clearTimeout(tourTimer.current);
    if (voiceEnabledRef.current) cancelVoicePlayback();
    setTourActive(false);
    clearSectionHighlight();
  }

  function startTour() {
    cancelTour();
    setMenuOpen(false);
    setParked(false);
    directionRef.current = "idle";
    setDirection("idle");
    setTourIndex(0);
    setTourActive(true);
  }

  function stopTour() {
    cancelTour();
    speak("The guided tour has been paused. Choose any section whenever you're ready.");
  }

  function runCommand(selector: string, message: string) {
    cancelTour();
    setMenuOpen(false);
    focusSection(selector);
    speak(message);
  }

  function openResume() {
    cancelTour();
    setMenuOpen(false);
    speak("Opening Abhishek's resume. It contains a concise overview of his experience, skills, and education.");
    window.open("/Abhishek_Patel_MERN_Resume.pdf", "_blank", "noopener,noreferrer");
  }

  function toggleMenu() {
    const next = !menuOpen;
    setMenuOpen(next);
    if (next) speak("How can I help? Choose a destination or let me give you the guided tour.", 7000);
  }

  function toggleParked() {
    const next = !parked;
    setShowGreeting(false);
    window.clearTimeout(teleportTimer.current);
    window.clearTimeout(teleportEndTimer.current);
    window.clearTimeout(scrollStopTimer.current);
    scrollInProgress.current = false;
    teleportActive.current = false;
    teleportPending.current = false;
    setTeleportPhase("idle");
    setPortalPosition(null);
    directionRef.current = "idle";
    setDirection("idle");
    setParked(next);
    if (next) target.current = { ...dock.current };
  }

  const assistantControls = <>
    {menuOpen && <aside data-aegis-control className="fixed bottom-[4.8rem] left-4 right-4 z-[75] overflow-hidden rounded-3xl border border-accent/25 bg-background/95 shadow-[0_24px_80px_rgba(0,0,0,.55)] backdrop-blur-2xl md:left-5 md:right-auto md:w-[370px]" role="dialog" aria-label={`Ask ${assistantName}`}>
      <div className="flex items-start justify-between border-b border-border/80 px-5 py-4">
        <div><p className="flex items-center gap-2 text-sm font-bold text-text-primary">{isArcane ? <Sparkles className="h-4 w-4 text-accent" /> : <Bot className="h-4 w-4 text-accent" />} Ask {assistantName}</p><p className="mt-1 text-[11px] text-text-secondary">Your interactive guide to this portfolio</p></div>
        <button type="button" onClick={() => setMenuOpen(false)} className="rounded-lg p-1.5 text-text-secondary transition hover:bg-surface hover:text-text-primary" aria-label={`Close ${assistantName} menu`}><X className="h-4 w-4" /></button>
      </div>
      <div className="space-y-3 p-4">
        <button type="button" onClick={tourActive ? stopTour : startTour} className="flex w-full items-center gap-3 rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/12 to-amber-500/10 px-4 py-3 text-left transition hover:border-accent/55 hover:from-accent/18">
          {tourActive ? <Square className="h-5 w-5 fill-current text-rose-300" /> : <Play className="h-5 w-5 fill-current text-accent" />}
          <span><strong className="block text-sm text-text-primary">{tourActive ? "Stop guided tour" : "Give me the 60-second tour"}</strong><small className="text-[10px] text-text-secondary">{tourActive ? `Step ${Math.min(tourIndex + 1, TOUR_STEPS.length)} of ${TOUR_STEPS.length}` : "A concise, guided journey through the portfolio"}</small></span>
        </button>
        <div className="grid grid-cols-2 gap-2">
          <AivonCommand icon={<Sparkles />} label="Why hire Abhishek?" onClick={() => runCommand("#about", "Abhishek brings full-stack capability, a product-focused mindset, and the persistence to turn ideas into dependable, polished experiences.")} />
          <AivonCommand icon={<FolderKanban />} label="Best projects" onClick={() => runCommand("#projects", "Here are Abhishek's featured projects. Open any card to explore the product, technology, and implementation details.")} />
          <AivonCommand icon={<Zap />} label="Technical skills" onClick={() => runCommand("#skills", "This is Abhishek's technical toolkit, covering the frontend, backend, databases, and development tools he works with.")} />
          <AivonCommand icon={<BriefcaseBusiness />} label="Experience" onClick={() => runCommand("#experience", "Here is Abhishek's professional experience and the practical engineering responsibilities he has handled.")} />
          <AivonCommand icon={<Download />} label="Open resume" onClick={openResume} />
          <AivonCommand icon={<Mail />} label="Contact Abhishek" onClick={() => runCommand("#contact", "You can contact Abhishek here. He is open to meaningful opportunities, collaborations, and product conversations.")} />
        </div>
      </div>
    </aside>}
    <div data-aegis-control className="fixed bottom-5 left-4 z-[70] flex items-center gap-2 md:left-5" onPointerDown={(event) => event.stopPropagation()}>
      <button type="button" onClick={toggleMenu} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2.5 text-xs font-bold shadow-premium backdrop-blur-xl transition ${menuOpen ? "border-accent/60 bg-accent/15 text-accent" : "border-accent/30 bg-background/90 text-text-primary hover:border-accent/55"}`} aria-expanded={menuOpen}><MessageCircle className="h-4 w-4 text-accent" />Ask {assistantName}</button>
      <button type="button" onClick={toggleVoice} disabled={!voiceAvailable} className={`inline-flex items-center gap-2 rounded-full border bg-background/90 px-3 py-2.5 text-xs font-semibold shadow-premium backdrop-blur-xl transition disabled:cursor-not-allowed disabled:opacity-45 ${voiceEnabled ? "border-accent/45 text-accent" : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"}`} aria-pressed={voiceEnabled} aria-label={voiceEnabled ? `Turn ${assistantName}'s voice off` : `Turn ${assistantName}'s voice on`} title={voiceAvailable ? (voiceEnabled ? `Mute ${assistantName}` : `Enable ${assistantName}'s voice`) : "Speech is not supported in this browser"}>{voiceEnabled ? <Volume2 className={`h-4 w-4 ${voiceLoading ? "animate-pulse" : ""}`} /> : <VolumeX className="h-4 w-4" />}<span className="hidden sm:inline">{voiceLoading ? "Synthesizing" : voiceEnabled ? "AI voice on" : "AI voice off"}</span></button>
      {enabled && <button type="button" onClick={toggleParked} className="hidden items-center gap-2 rounded-full border border-accent/25 bg-background/85 px-3 py-2.5 text-xs font-semibold text-text-secondary shadow-premium backdrop-blur-xl transition hover:border-accent/50 hover:text-text-primary md:inline-flex" title={parked ? `Let ${assistantName} follow the cursor` : `Send ${assistantName} back beside your name`}>{parked ? <Radio className="h-4 w-4 text-accent" /> : <Pin className="h-4 w-4 text-accent" />}{parked ? `Follow ${assistantName}` : `Park ${assistantName}`}</button>}
    </div>
  </>;

  if (enabled === null) return null;
  if (!enabled) return <>{showGreeting && <div key={messageVersion} className={`aivon-mobile-welcome ${isArcane ? "arcane-witch-welcome" : ""}`} role="status" aria-live="polite"><img src={isArcane ? "/arcane-witch-companion.png" : "/aegis-companion-v3.png"} alt={isArcane ? "The Arcane Guide flying on her broom" : "Aivon, Abhishek's personal assistant"} /><div><span>{isArcane ? "ARCANE GUIDE · ARCHIVE KEEPER" : "AIVON · PERSONAL ASSISTANT"}</span><p>{assistantMessage}</p></div></div>}{assistantControls}</>;
  return <><div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
    <svg className="absolute h-0 w-0" aria-hidden="true">
      <filter id="aegis-fire-distort" x="-15%" y="-80%" width="130%" height="260%"><feTurbulence type="fractalNoise" baseFrequency="0.018 0.11" numOctaves="2" seed="7" result="noise"><animate attributeName="baseFrequency" dur="0.42s" values="0.018 0.11;0.032 0.17;0.018 0.11" repeatCount="indefinite" /></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="B" /></filter>
      <filter id="aegis-fire-grade" x="-18%" y="-18%" width="136%" height="136%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values=".2 .6 1.2 0 .03  .05 .45 .55 0 .02  .015 .015 .01 0 0  0 0 0 1 0" result="fireColor" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1  0 0 0 0 .72  0 0 0 0 .12  -.72 -.08 .92 0 0" result="blueMask" />
        <feComponentTransfer in="blueMask" result="strongBlueMask"><feFuncA type="table" tableValues="0 .1 .62 1 1" /></feComponentTransfer>
        <feGaussianBlur in="strongBlueMask" stdDeviation="3.2" result="energyBloomMask" />
        <feFlood floodColor="#ff571c" floodOpacity=".92" result="energyBloomColor" />
        <feComposite in="energyBloomColor" in2="energyBloomMask" operator="in" result="energyBloom" />
        <feComposite in="fireColor" in2="strongBlueMask" operator="in" result="fireLights" />
        <feMerge><feMergeNode in="energyBloom" /><feMergeNode in="SourceGraphic" /><feMergeNode in="fireLights" /></feMerge>
      </filter>
      <filter id="aegis-arcane-grade" x="-18%" y="-18%" width="136%" height="136%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values=".42 .16 .72 0 .02  .08 .2 .24 0 .01  .08 .12 .96 0 .03  0 0 0 1 0" result="arcaneColor" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1  0 0 0 0 .72  0 0 0 0 .12  -.72 -.08 .92 0 0" result="arcaneMask" />
        <feComponentTransfer in="arcaneMask" result="strongArcaneMask"><feFuncA type="table" tableValues="0 .06 .48 .92 1" /></feComponentTransfer>
        <feGaussianBlur in="strongArcaneMask" stdDeviation="3" result="arcaneBloomMask" />
        <feFlood floodColor="#be7eff" floodOpacity=".8" result="arcaneBloomColor" />
        <feComposite in="arcaneBloomColor" in2="arcaneBloomMask" operator="in" result="arcaneBloom" />
        <feComposite in="arcaneColor" in2="strongArcaneMask" operator="in" result="arcaneLights" />
        <feMerge><feMergeNode in="arcaneBloom" /><feMergeNode in="SourceGraphic" /><feMergeNode in="arcaneLights" /></feMerge>
      </filter>
    </svg>
    <div ref={broomTrailRef} className="arcane-broom-trail absolute inset-0" aria-hidden="true" />
    {portalPosition && <ScreenBreakEffect position={portalPosition} phase={teleportPhase} />}
    <div ref={companionRef} className={`aegis-companion aivon-teleport-${teleportPhase} absolute left-0 top-0 h-[118px] w-[96px] will-change-transform ${isArcane ? "arcane-witch" : ""} ${parked ? "aegis-parked" : ""}`}>
      <div className={`aegis-body aegis-pose-${direction} relative h-full w-full`} aria-hidden="true"><span className="aegis-thruster absolute bottom-1 left-1/2 h-7 w-9 -translate-x-1/2 rounded-full bg-accent/35 blur-md" /><span className="aegis-energy-grade absolute inset-0"><img src={isArcane ? "/arcane-witch-companion.png" : direction === "landing" ? "/aegis-landing.png" : "/aegis-companion-v3.png"} alt="" className="aegis-pose-image" /></span></div>
      {showGreeting && <div key={messageVersion} className="aivon-intro" role="status" aria-live="polite"><span>{isArcane ? "ARCANE GUIDE · ARCHIVE KEEPER" : "AIVON · PERSONAL ASSISTANT"}</span><p>{assistantMessage}</p></div>}
    </div>
    {blasts.map(item => <BlastEffect key={item.id} blast={item} />)}
  </div>{assistantControls}</>;
}

function AivonCommand({ icon, label, onClick }: { icon: React.ReactElement<{ className?: string }>; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="group flex min-h-20 flex-col items-start justify-between rounded-2xl border border-border/90 bg-surface/55 p-3 text-left transition hover:-translate-y-0.5 hover:border-accent/35 hover:bg-surface"><span className="text-accent [&>svg]:h-4 [&>svg]:w-4">{icon}</span><span className="text-xs font-semibold leading-tight text-text-secondary transition group-hover:text-text-primary">{label}</span></button>;
}

function ScreenBreakEffect({ position, phase }: { position: { x: number; y: number }; phase: TeleportPhase }) {
  return <span className={`aivon-screen-break aivon-screen-break-${phase}`} style={{ left: position.x, top: position.y }} aria-hidden="true">
    <i className="aivon-break-hole" />
    <svg viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="29" className="aivon-impact-ring" />
      <g className="aivon-cracks">
        <path d="M100 100 92 72 101 48 94 18" /><path d="M100 100 119 76 127 52 151 25" />
        <path d="M100 100 132 97 151 84 186 82" /><path d="M100 100 129 118 156 122 184 143" />
        <path d="M100 100 111 136 106 158 119 190" /><path d="M100 100 83 133 64 150 55 187" />
        <path d="M100 100 70 112 49 106 15 122" /><path d="M100 100 75 84 55 66 20 60" />
        <path d="M92 72 72 63 65 43" /><path d="M132 97 147 105 165 99" /><path d="M83 133 84 158 72 170" /><path d="M70 112 46 130 28 132" />
      </g>
    </svg>
    <span className="aivon-glass-shards">{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</span>
  </span>;
}

function BlastEffect({ blast }: { blast: Blast }) {
  const dx = blast.endX - blast.startX; const dy = blast.endY - blast.startY; const length = Math.hypot(dx, dy); const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return <><span className="aegis-fire-wave fixed" style={{ left: blast.startX, top: blast.startY - 27, width: length, height: 54, transform: `rotate(${angle}deg)`, transformOrigin: "0 27px" }}><i className="aegis-fire-core" /></span><span className="aegis-impact fixed h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ left: blast.endX, top: blast.endY }} /><span className="aegis-spark fixed h-2 w-2 rounded-full" style={{ left: blast.endX - 4, top: blast.endY - 4 }} /></>;
}
