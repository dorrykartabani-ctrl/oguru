import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// Anthropic model to use for campaign generation.
// claude-haiku-4-5 is fast/cheap and plenty for short marketing copy;
// swap to claude-sonnet-5 if you want richer, more nuanced copy.
const MODEL = 'claude-haiku-4-5-20251001';

type GeneratedCampaign = {
  pushNotification: string;
  socialCaption: string;
  suggestedOffer: {
    title: string;
    description: string;
    emoji: string;
  };
  bestSendTime: string;
  reasoning: string;
};

function buildPrompt(params: {
  situation: string;
  businessName: string;
  businessTypes: string[];
  currency: string;
  products: { name: string; price: string; category: string }[];
}) {
  const { situation, businessName, businessTypes, currency, products } = params;

  const productList = products.length
    ? products.map((p) => `- ${p.name} (${p.category}) — ${p.price}`).join('\n')
    : 'No menu items on file yet.';

  return `You are a marketing assistant for independent cafés and small food/beverage vendors on the OGuru app. A vendor has described a situation and needs ready-to-send marketing content.

BUSINESS: ${businessName}
BUSINESS TYPE(S): ${businessTypes.join(', ') || 'café'}
CURRENCY: ${currency}
CURRENT MENU (sample):
${productList}

VENDOR'S SITUATION:
"${situation}"

Write marketing content for this situation. Keep it authentic, warm, and specific to the situation — not generic. Use at most one emoji in the push notification. Prices/discounts should be realistic for a small café and consistent with the menu above where relevant.

Respond with ONLY valid JSON, no markdown fences, no preamble, matching exactly this shape:
{
  "pushNotification": "short push notification copy, under 140 characters",
  "socialCaption": "a slightly longer social media caption, can include line breaks as \\n, suitable for Instagram/Facebook",
  "suggestedOffer": {
    "title": "short offer title, e.g. '20% Off Matcha Today'",
    "description": "one sentence describing the offer",
    "emoji": "single emoji that fits the offer"
  },
  "bestSendTime": "a specific suggested send time and brief reason, e.g. '2:30 PM — right before the afternoon slump'",
  "reasoning": "one short sentence on why this approach fits the situation"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI is not configured yet. Missing ANTHROPIC_API_KEY on the server.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const situation = (body?.situation ?? '').toString().trim();

    if (!situation) {
      return NextResponse.json({ error: 'Please describe your situation.' }, { status: 400 });
    }
    if (situation.length > 500) {
      return NextResponse.json(
        { error: 'Please keep the description under 500 characters.' },
        { status: 400 }
      );
    }

    // Authenticate the vendor and load their business context.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
    }

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (businessError || !business || business.status !== 'approved') {
      return NextResponse.json({ error: 'No approved business found for this account.' }, { status: 403 });
    }

    const { data: products } = await supabase
      .from('products')
      .select('name, price_cents, category')
      .eq('business_id', business.id)
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
      .limit(15);

    const currency = business.currency || 'AUD';
    const formatter = new Intl.NumberFormat('en-AU', { style: 'currency', currency });

    const productList = (products || []).map((p) => ({
      name: p.name,
      category: p.category,
      price: formatter.format(p.price_cents / 100),
    }));

    const prompt = buildPrompt({
      situation,
      businessName: business.trading_name || business.legal_name,
      businessTypes: business.business_types || [],
      currency,
      products: productList,
    });

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic API error:', anthropicRes.status, errText);
      return NextResponse.json(
        { error: 'The AI service is temporarily unavailable. Please try again shortly.' },
        { status: 502 }
      );
    }

    const anthropicData = await anthropicRes.json();
    const textBlock = anthropicData?.content?.find((c: { type: string }) => c.type === 'text');
    const rawText: string = textBlock?.text ?? '';

    let parsed: GeneratedCampaign;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', rawText);
      return NextResponse.json(
        { error: 'Got an unexpected response from the AI. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ campaign: parsed });
  } catch (err) {
    console.error('generate-campaign error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
