// lib/favorites.ts
import { createClient } from '@/lib/supabase/client';

const LOCAL_KEY = 'oguru_favorites';

export function getLocalFavoriteIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setLocalFavoriteIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
}

export async function toggleFavorite(businessId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Local-first (works logged out)
  const local = getLocalFavoriteIds();
  const isFav = local.includes(businessId);
  const next = isFav ? local.filter((id) => id !== businessId) : [...local, businessId];
  setLocalFavoriteIds(next);

  if (!user) return !isFav;

  if (isFav) {
    await supabase
      .from('customer_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('business_id', businessId);
    return false;
  }

  await supabase.from('customer_favorites').upsert({
    user_id: user.id,
    business_id: businessId,
  });
  return true;
}

export async function getFavoriteBusinessIds(): Promise<string[]> {
  const local = getLocalFavoriteIds();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return local;

  const { data } = await supabase
    .from('customer_favorites')
    .select('business_id')
    .eq('user_id', user.id);

  const remote = (data ?? []).map((r) => r.business_id);
  const merged = Array.from(new Set([...local, ...remote]));
  setLocalFavoriteIds(merged);
  return merged;
}
