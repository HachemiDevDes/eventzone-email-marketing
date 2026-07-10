import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { waitUntil } from '@vercel/functions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
// Need service role to bypass RLS since the recipient is not authenticated

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const campaignId = searchParams.get('c');
  const contactId = searchParams.get('u');
  const url = searchParams.get('url');
  const isOpen = searchParams.get('open');

  if (!campaignId || !contactId) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  // Define the tracking task
  const trackEvent = async () => {
    try {
      await supabase.from('events').insert([
        {
          campaign_id: campaignId,
          contact_id: contactId,
          event_type: isOpen ? 'open' : 'click',
          target_url: url || null,
        }
      ]);
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  };

  // Run in background without blocking response
  waitUntil(trackEvent());

  if (isOpen) {
    // Return a 1x1 transparent GIF for open tracking
    const transparentGif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    return new NextResponse(transparentGif, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  }

  if (url) {
    // Redirect to the target URL instantly
    return NextResponse.redirect(url, 302);
  }

  return new NextResponse('Invalid request', { status: 400 });
}
