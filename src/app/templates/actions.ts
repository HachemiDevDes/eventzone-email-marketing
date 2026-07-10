'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveTemplate(id: string | null, name: string, contentBlocks: any, htmlCache: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error('Unauthorized');
  }

  let result;

  if (id) {
    result = await supabase
      .from('templates')
      .update({ name, content_blocks: contentBlocks, html_cache: htmlCache, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  } else {
    result = await supabase
      .from('templates')
      .insert([{ name, content_blocks: contentBlocks, html_cache: htmlCache, user_id: userData.user.id }])
      .select()
      .single();
  }

  if (result.error) {
    throw new Error(result.error.message);
  }

  revalidatePath('/templates');
  return result.data;
}

export async function deleteTemplate(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from('templates').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/templates');
}
