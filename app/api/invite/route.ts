// app/api/invite/route.ts
// Handles "Invite to Oguru" viral loop — writes to waitlist_signups
// and returns a shareable invite URL.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      business_name,
      business_type,
      google_place_id,
      inviter_email,
      notes,
    } = body;

    if (!business_name) {
      return NextResponse.json(
        { error: 'business_name is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Check for duplicate invite
    const { data: existing } = await supabase
      .from('waitlist_signups')
      .select('id')
      .eq('business_name', business_name)
      .eq('email', inviter_email ?? 'anonymous')
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        already_invited: true,
        message: `You've already invited ${business_name}!`,
      });
    }

    // Insert new invite
    const { error } = await supabase.from('waitlist_signups').insert({
      email: inviter_email ?? 'anonymous',
      country_code: 'AU',
      business_name,
      business_type: business_type ?? 'café',
      notes:
        notes ??
        `Invited via Oguru app${google_place_id ? ` (Place ID: ${google_place_id})` : ''}`,
    });

    if (error) {
      console.error('[/api/invite] Insert error:', error.message);
      return NextResponse.json(
        { error: 'Failed to save invite' },
        { status: 500 }
      );
    }

    // Generate shareable link
    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oguru-phi.vercel.app'}/claim?ref=${encodeURIComponent(business_name)}`;

    return NextResponse.json({
      success: true,
      already_invited: false,
      message: `Invite sent! Share this link with ${business_name}:`,
      share_url: shareUrl,
    });
  } catch (err) {
    console.error('[/api/invite] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
