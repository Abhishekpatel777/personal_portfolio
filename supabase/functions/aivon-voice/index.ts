const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const tourMessages = [
  "Introduction: Meet Abhishek Patel—a MERN stack developer focused on turning practical ideas into polished digital products.",
  "About Abhishek: Abhishek combines thoughtful frontend work with reliable backend development and a strong product mindset.",
  "Technical Skills: Here is the toolkit he uses to build complete products, from responsive interfaces to APIs and databases.",
  "Experience: This section highlights the real-world responsibilities, collaboration, and engineering experience behind his work.",
  "Featured Work: These projects demonstrate how Abhishek approaches product problems across the full stack—not just how the final screens look.",
  "Start a Conversation: That concludes the tour. If Abhishek feels like the right fit, you can connect with him right here.",
];

const approvedMessages = new Set([
  "Hello there! Aivon at your service. Let me show you around Abhishek's digital workspace.",
  "Welcome! I'm Aivon, your guide to Abhishek's skills, experience, and creations.",
  "Greetings, visitor! I'm Aivon. You've just entered Abhishek's corner of the web.",
  "Hi! I'm Aivon, Abhishek's personal assistant. Feel free to explore everything he has built.",
  "A new visitor detected—welcome! I'm Aivon, and I'll be accompanying you through this portfolio.",
  "It's great to have you here! I'm Aivon, your personal guide to Abhishek's work.",
  "Welcome aboard! Aivon here. Let's discover what Abhishek has been creating.",
  "Tour complete. You can ask me to revisit any section whenever you like.",
  "The guided tour has been paused. Choose any section whenever you're ready.",
  "How can I help? Choose a destination or let me give you the guided tour.",
  "Abhishek brings full-stack capability, a product-focused mindset, and the persistence to turn ideas into dependable, polished experiences.",
  "Here are Abhishek's featured projects. Open any card to explore the product, technology, and implementation details.",
  "This is Abhishek's technical toolkit, covering the frontend, backend, databases, and development tools he works with.",
  "Here is Abhishek's professional experience and the practical engineering responsibilities he has handled.",
  "Opening Abhishek's resume. It contains a concise overview of his experience, skills, and education.",
  "You can contact Abhishek here. He is open to meaningful opportunities, collaborations, and product conversations.",
  ...tourMessages,
]);

const rateLimits = new Map<string, { count: number; resetsAt: number }>();

function isApprovedMessage(text: string) {
  if (approvedMessages.has(text)) return true;
  return /^(Good morning|Good afternoon|Good evening)! I'm Aivon, Abhishek's personal assistant\. Welcome to his portfolio\.$/.test(text);
}

function isRateLimited(request: Request) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = rateLimits.get(client);
  if (!current || current.resetsAt <= now) {
    rateLimits.set(client, { count: 1, resetsAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 15;
}

Deno.serve(async request => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  if (isRateLimited(request)) return Response.json({ error: "Too many voice requests" }, { status: 429, headers: corsHeaders });

  try {
    const { text } = await request.json();
    if (typeof text !== "string" || !isApprovedMessage(text)) {
      return Response.json({ error: "Unsupported Aivon dialogue" }, { status: 400, headers: corsHeaders });
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) return Response.json({ error: "Voice service is not configured" }, { status: 503, headers: corsHeaders });

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "cedar",
        input: text,
        instructions: "Create Aivon's unique signature voice: an original cinematic heroic machine commander. Use a deep adult male bass-baritone with immense presence, calm noble authority, measured pacing, deliberate pauses, clean powerful projection, crisp consonants, and controlled metallic resonance. Give the delivery a distinctive three-beat cadence: grounded opening, confident statement, resonant finish. The speaker should feel ancient, wise, protective, courageous, and unmistakably robotic—powerful without sounding angry or villainous. Use clear neutral international English that is easy for an Indian audience to understand. Keep every word exceptionally clean and intelligible. Add a polished machine-like harmonic edge, never a sickly or damaged texture. No rasp, hoarseness, throat noise, vocal fry, breathiness, growling, whispering, shouting, or muddy distortion. This must be an original voice and must not imitate or reference any existing fictional character or performer.",
        response_format: "mp3",
        speed: 0.9,
      }),
    });

    if (!response.ok) {
      const requestId = response.headers.get("x-request-id");
      console.error("Aivon voice generation failed", response.status, requestId);
      return Response.json({ error: "Voice generation failed", requestId }, { status: 502, headers: corsHeaders });
    }

    return new Response(response.body, {
      // Supabase Functions JS returns binary responses as a Blob when the
      // content type is application/octet-stream. Preserve the actual format
      // in a companion header for clients that need it.
      headers: {
        ...corsHeaders,
        "Content-Type": "application/octet-stream",
        "X-Audio-Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch {
    return Response.json({ error: "Invalid voice request" }, { status: 400, headers: corsHeaders });
  }
});
