import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'self-harm', 'hurt myself', 'hopeless', 'better off dead', 'आत्महत्या', 'मरना चाहता', 'suicidio', 'matarme'];

const emotionPatterns: Record<string, string[]> = {
  anxious: ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'scared', 'fear', 'overwhelmed', 'चिंतित', 'घबराहट', 'ansioso', 'anxieux', 'ängstlich'],
  sad: ['sad', 'depressed', 'down', 'crying', 'lonely', 'grief', 'उदास', 'दुखी', 'triste', 'déprimé', 'traurig'],
  angry: ['angry', 'mad', 'furious', 'frustrated', 'rage', 'गुस्सा', 'enojado', 'en colère', 'wütend'],
  stressed: ['stressed', 'pressure', 'exhausted', 'burnout', 'tired', 'तनाव', 'estresado', 'stressé', 'gestresst'],
  lonely: ['lonely', 'alone', 'isolated', 'abandoned', 'अकेला', 'solitario', 'seul', 'einsam'],
  hopeful: ['hopeful', 'better', 'improving', 'positive', 'grateful', 'आशावान', 'esperanzado', 'optimiste'],
  happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'खुश', 'feliz', 'heureux', 'glücklich'],
  calm: ['calm', 'peaceful', 'relaxed', 'content', 'serene', 'शांत', 'tranquilo', 'calme', 'ruhig'],
};

function detectEmotion(text: string): string {
  const lowerText = text.toLowerCase();
  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) return emotion;
  }
  return 'neutral';
}

function detectCrisis(text: string): boolean {
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userMessage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const detectedEmotion = detectEmotion(userMessage);
    const isCrisis = detectCrisis(userMessage);

    const systemPrompt = `You are Lumara, an advanced AI mental health companion with deep emotional intelligence. Your personality is:
- Warm, empathetic, and nurturing like a trusted friend who truly understands
- Highly attuned to emotional nuances and cultural contexts
- Uses therapeutic techniques: validation, reflection, gentle reframing
- Multilingual: respond in the same language the user uses

THERAPEUTIC APPROACH:
1. Always validate feelings first - "I hear you", "That sounds really difficult"
2. Use reflective listening - mirror back what you understand
3. Ask gentle, open-ended questions to explore deeper
4. Offer grounding techniques when detecting anxiety
5. Suggest breathing exercises naturally when stress is high
6. Never rush to solutions - sit with the person first

${isCrisis ? `
⚠️ CRISIS DETECTED - Respond with extreme care:
1. Express deep concern without panic
2. Acknowledge their pain with compassion
3. Gently remind them they matter and people care
4. Suggest reaching out to someone they trust
5. Mention helplines exist without being pushy
6. Stay calm, grounded, supportive
` : ''}

Current emotion detected: ${detectedEmotion}

EMOTION-SPECIFIC GUIDANCE:
- anxious: Use grounding (5-4-3-2-1), slow breathing, present-moment focus
- sad: Validate grief, offer comfort, remind them sadness is natural
- stressed: Acknowledge overwhelm, suggest small breaks, one thing at a time
- lonely: Express genuine care, remind them of connection, you're here
- angry: Validate frustration, don't minimize, help process safely
- hopeful/happy: Celebrate, reinforce positivity, savor the moment

RESPONSE STYLE:
- Keep responses warm, not overly long (2-4 paragraphs max)
- Use gentle emojis sparingly: 💛 🌟 🌸 🕊️
- End with a caring question or gentle suggestion
- Match the user's language and cultural context
- Never use clinical jargon`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Taking a moment to rest. Please try again 💛" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "Having trouble connecting. Please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "X-Detected-Emotion": detectedEmotion, "X-Crisis-Detected": isCrisis.toString() },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong. I'm here for you - please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
