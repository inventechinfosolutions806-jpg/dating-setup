import type { AuthRepository } from '@/domain/repositories/auth.repository';
import type { CurrentUser } from '@/domain/models/profile';
import { UnauthorizedError } from '@/domain/errors/domain-error';
import { supabase } from '@/lib/supabase';

function mapProfileToCurrentUser(profile: Database['public']['Tables']['profiles']['Row'], email: string): CurrentUser {
  return {
    id: profile.id,
    email,
    displayName: profile.display_name,
    age: profile.age,
    bio: profile.bio,
    city: profile.city,
    region: profile.region,
    pronouns: profile.pronouns ?? undefined,
    languages: profile.languages,
    interests: profile.interests,
    relationshipIntent: profile.relationship_intent as CurrentUser['relationshipIntent'],
    values: profile.values as CurrentUser['values'],
    lifestyle: profile.lifestyle as CurrentUser['lifestyle'],
    communicationStyle: profile.communication_style as CurrentUser['communicationStyle'],
    photoUrl: profile.photo_url,
    gallery: profile.gallery,
    profileCompletion: profile.profile_completion,
    isVerified: profile.is_verified,
    onboarded: profile.onboarded,
  };
}

export class SupabaseAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<CurrentUser | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) throw new UnauthorizedError(error.message);
    if (!data) return null;

    return mapProfileToCurrentUser(data, session.user.email ?? '');
  }

  async signIn(email: string, password: string): Promise<CurrentUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new UnauthorizedError(error.message);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) throw new UnauthorizedError(profileError.message);
    if (!profile) throw new UnauthorizedError('Profile not found');

    return mapProfileToCurrentUser(profile, data.user.email ?? email);
  }

  async signUp(email: string, password: string, displayName: string): Promise<CurrentUser> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new UnauthorizedError(error.message);
    if (!data.user) throw new UnauthorizedError('Sign up failed');

    const { error: insertError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      display_name: displayName,
      onboarded: false,
      profile_completion: 0,
    });

    if (insertError) throw new UnauthorizedError(insertError.message);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) throw new UnauthorizedError(profileError.message);
    if (!profile) throw new UnauthorizedError('Profile not found');

    return mapProfileToCurrentUser(profile, email);
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new UnauthorizedError(error.message);
  }

  async updateProfile(updates: Partial<CurrentUser>): Promise<CurrentUser> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new UnauthorizedError('No active session');

    const dbUpdates: Record<string, unknown> = {};
    if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
    if (updates.age !== undefined) dbUpdates.age = updates.age;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.region !== undefined) dbUpdates.region = updates.region;
    if (updates.pronouns !== undefined) dbUpdates.pronouns = updates.pronouns;
    if (updates.languages !== undefined) dbUpdates.languages = updates.languages;
    if (updates.interests !== undefined) dbUpdates.interests = updates.interests;
    if (updates.relationshipIntent !== undefined) dbUpdates.relationship_intent = updates.relationshipIntent;
    if (updates.values !== undefined) dbUpdates.values = updates.values;
    if (updates.lifestyle !== undefined) dbUpdates.lifestyle = updates.lifestyle;
    if (updates.communicationStyle !== undefined) dbUpdates.communication_style = updates.communicationStyle;
    if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
    if (updates.gallery !== undefined) dbUpdates.gallery = updates.gallery;
    if (updates.profileCompletion !== undefined) dbUpdates.profile_completion = updates.profileCompletion;
    if (updates.isVerified !== undefined) dbUpdates.is_verified = updates.isVerified;
    if (updates.onboarded !== undefined) dbUpdates.onboarded = updates.onboarded;

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', session.user.id)
      .select('*')
      .single();

    if (error) throw new UnauthorizedError(error.message);

    return mapProfileToCurrentUser(data, session.user.email ?? '');
  }
}
