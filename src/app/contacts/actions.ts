'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addContact(email: string, name: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert([
      { email, name, user_id: userData.user.id }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/contacts');
  return data;
}

export async function bulkImportContacts(contacts: { email: string; name: string }[]) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error('Unauthorized');
  }

  const inserts = contacts.map(c => ({
    email: c.email,
    name: c.name,
    user_id: userData.user.id
  }));

  // Perform bulk upsert on email to avoid duplicate errors failing the whole batch
  const { data, error } = await supabase
    .from('contacts')
    .upsert(inserts, { onConflict: 'user_id, email', ignoreDuplicates: true })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/contacts');
  return data;
}

export async function deleteContact(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from('contacts').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/contacts');
}
