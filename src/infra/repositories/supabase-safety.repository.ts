import type { SafetyRepository } from '@/domain/repositories/safety.repository';
import type { BlockedUser } from '@/domain/models/safety';
import { supabase } from '@/lib/supabase';

export class SupabaseSafetyRepository implements SafetyRepository {
  async getBlockedUsers(): Promise<BlockedUser[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('blocked_users')
      .select('*')
      .eq('user_id', session.user.id)
      .order('blocked_at', { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((b) => ({
      id: b.id,
      userId: b.blocked_user_id,
      displayName: b.display_name,
      photoUrl: b.photo_url,
      status: b.status as BlockedUser['status'],
      reason: b.reason ?? undefined,
      blockedAt: b.blocked_at,
    }));
  }

  async blockUser(userId: string, reason?: string): Promise<BlockedUser> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data: candidate } = await supabase
      .from('profiles')
      .select('display_name, photo_url')
      .eq('id', userId)
      .maybeSingle();

    const { data, error } = await supabase
      .from('blocked_users')
      .insert({
        user_id: session.user.id,
        blocked_user_id: userId,
        display_name: candidate?.display_name ?? 'Unknown',
        photo_url: candidate?.photo_url ?? '',
        status: 'blocked',
        reason,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.blocked_user_id,
      displayName: data.display_name,
      photoUrl: data.photo_url,
      status: data.status as BlockedUser['status'],
      reason: data.reason ?? undefined,
      blockedAt: data.blocked_at,
    };
  }

  async reportUser(userId: string, reason: string): Promise<BlockedUser> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data: candidate } = await supabase
      .from('profiles')
      .select('display_name, photo_url')
      .eq('id', userId)
      .maybeSingle();

    const { data, error } = await supabase
      .from('blocked_users')
      .insert({
        user_id: session.user.id,
        blocked_user_id: userId,
        display_name: candidate?.display_name ?? 'Unknown',
        photo_url: candidate?.photo_url ?? '',
        status: 'reported',
        reason,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.blocked_user_id,
      displayName: data.display_name,
      photoUrl: data.photo_url,
      status: data.status as BlockedUser['status'],
      reason: data.reason ?? undefined,
      blockedAt: data.blocked_at,
    };
  }

  async unblockUser(userId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('user_id', session.user.id)
      .eq('blocked_user_id', userId);

    if (error) throw new Error(error.message);
  }
}
