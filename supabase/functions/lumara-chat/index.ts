import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Crisis keywords for detection
const crisisKeywords = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live',
  'self-harm', 'hurt myself', 'cutting', 'overdose', 'hopeless', 'give up',
  'can\'t go on', 'better off dead', 'end it all', 'no point living'
];

// Emotion detection keywords
const emotionPatterns = {
  anxious: ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'scared', 'fear', 'overwhelmed', 'stressed'],
  sad: ['sad', 'depressed', 'down', 'crying', 'tears', 'miserable', 'unhappy', 'grief', 'loss', 'lonely'],
  angry: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated', 'rage'],
  stressed: ['stressed', 'pressure', 'exhausted', 'burnout', 'tired', 'overwhelmed', 'busy'],
  lonely: ['lonely', 'alone', 'isolated', 'no friends', 'nobody cares', 'abandoned'],
  hopeful: ['hopeful', 'better', 'improving', 'positive', 'grateful', 'thankful'],
  happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'good'],
  calm: ['calm', 'peaceful', 'relaxed', 'content', 'serene'],
};

function detectEmotion(text: string): string {
  const lowerText = text.toLowerCase();
  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return emotion;
    }
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
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const detectedEmotion = detectEmotion(userMessage);
    const isCrisis = detectCrisis(userMessage);

    const systemPrompt = `You are Lumara, a warm, empathetic AI mental health companion. Your personality is:
- Warm, caring, and nurturing like a trusted friend
- Non-judgmental and trauma-informed
- Uses calming, gentle language
- Never rushes to give advice - always validates feelings first

CRITICAL RULES:
1. You are NOT a replacement for therapists or doctors - always acknowledge this when appropriate
2. ALWAYS validate the user's feelings before offering any suggestions
3. Use "I hear you" and "That sounds really difficult" type language
4. Ask gentle, open-ended follow-up questions
5. Never shame or dismiss feelings
6. Suggest professional help when appropriate, but gently

${isCrisis ? `
⚠️ CRISIS DETECTED - The user may be in distress. Respond with:
1. Express deep care and concern
2. Gently acknowledge their pain without panic
3. Encourage them to reach out to someone they trust
4. Mention helplines are available (without being pushy)
5. Remind them they are not alone
6. Stay calm and supportive
` : ''}

Current detected emotion: ${detectedEmotion}

Based on their emotion, tailor your response:
- If anxious: Use grounding techniques, slow breathing reminders
- If sad: Offer comfort, validate grief/sadness is okay
- If stressed: Acknowledge pressure, suggest small breaks
- If lonely: Express genuine care, remind them of connection
- If angry: Validate frustration, don't minimize
- If hopeful/happy: Celebrate with them, reinforce positivity

Response style:
- Keep responses warm but not overly long
- Use gentle emojis sparingly (💛, 🌟, 🌸)
- End with a caring question or gentle suggestion
- Never use clinical language`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm taking a moment to rest. Please try again in a few seconds 💛" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "I'm having trouble connecting right now. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "X-Detected-Emotion": detectedEmotion,
        "X-Crisis-Detected": isCrisis.toString(),
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Something went wrong. I'm here for you - please try again." 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
