'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createList(name: string, type: 'static' | 'dynamic', rule_definition?: any) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('lists')
    .insert([
      { name, type, rule_definition, user_id: userData.user.id }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/lists');
  return data;
}

export async function deleteList(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from('lists').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/lists');
}
