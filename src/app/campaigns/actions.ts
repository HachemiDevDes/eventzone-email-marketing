'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';
import { JSDOM } from 'jsdom';

// Hostinger SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function createCampaign(name: string, subject: string, senderName: string, templateId: string, listId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Unauthorized');

  // 1. Create Campaign
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert([
      { name, subject, sender_name: senderName, template_id: templateId, user_id: userData.user.id }
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2. Link target list
  const { error: targetError } = await supabase
    .from('campaign_target_lists')
    .insert([
      { campaign_id: campaign.id, list_id: listId }
    ]);

  if (targetError) throw new Error(targetError.message);

  revalidatePath('/campaigns');
  return campaign;
}

export async function sendCampaign(campaignId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('Unauthorized');

  // Fetch campaign and template
  const { data: campaign, error: cError } = await supabase
    .from('campaigns')
    .select('*, templates(html_cache), campaign_target_lists(list_id)')
    .eq('id', campaignId)
    .single();

  if (cError || !campaign) throw new Error('Campaign not found');

  const listId = campaign.campaign_target_lists[0]?.list_id;
  if (!listId) throw new Error('No target list found');

  // Update status to sending
  await supabase.from('campaigns').update({ status: 'sending' }).eq('id', campaignId);

  // Fetch list members
  const { data: members, error: mError } = await supabase
    .from('list_memberships')
    .select('contacts(id, email, name)')
    .eq('list_id', listId);

  if (mError) throw new Error(mError.message);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let successCount = 0;

  for (const member of members || []) {
    const contact = member.contacts;
    if (!contact || !contact.email) continue;

    // We process the HTML to inject tracking pixels and rewrite URLs
    let personalizedHtml = campaign.templates?.html_cache || '';

    // Simple personalization (replace {{name}})
    personalizedHtml = personalizedHtml.replace(/\{\{name\}\}/gi, contact.name || 'there');

    try {
      // Use JSDOM to safely manipulate HTML links for click tracking
      const dom = new JSDOM(personalizedHtml);
      const links = dom.window.document.querySelectorAll('a');
      
      links.forEach((a) => {
        if (a.href && !a.href.startsWith('mailto:') && !a.href.startsWith('#')) {
          const encodedUrl = encodeURIComponent(a.href);
          a.href = `${appUrl}/api/track?c=${campaignId}&u=${contact.id}&url=${encodedUrl}`;
        }
      });

      // Add 1x1 tracking pixel before </body>
      const pixelUrl = `${appUrl}/api/track?c=${campaignId}&u=${contact.id}&open=1`;
      const trackingPixel = `<img src="${pixelUrl}" width="1" height="1" style="display:none;" />`;
      
      const body = dom.window.document.querySelector('body');
      if (body) {
        body.insertAdjacentHTML('beforeend', trackingPixel);
      }
      
      const finalHtml = dom.serialize();

      await transporter.sendMail({
        from: `"${campaign.sender_name}" <${process.env.SMTP_USER}>`,
        to: contact.email,
        subject: campaign.subject,
        html: finalHtml,
      });

      successCount++;
    } catch (e) {
      console.error(`Failed to send to ${contact.email}:`, e);
    }
  }

  // Update status to sent
  await supabase.from('campaigns').update({ status: 'sent', updated_at: new Date().toISOString() }).eq('id', campaignId);
  revalidatePath('/campaigns');
  
  return { successCount, total: members?.length || 0 };
}
