/*
# Create core tables: profiles, conversations, messages, notifications + storage bucket

## Overview
Creates the database schema for the MIRROR social connection app with real-time chat,
push notifications, and profile photo management. All tables are user-scoped with RLS.

## New Tables
1. profiles — extends auth.users with app-specific profile data
2. conversations — chat threads between two connected users
3. conversation_reads — tracks read state per user per conversation
4. messages — individual messages in conversations
5. notifications — in-app notification feed
6. blocked_users — safety/block list

## Storage
- Creates avatars bucket (public) for profile photos

## Security
- RLS enabled on all tables, ownership-scoped policies, authenticated-only grants
- Storage bucket has public read, authenticated write policies
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  display_name text NOT NULL DEFAULT '',
  age integer NOT NULL DEFAULT 0,
  bio text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  pronouns text,
  languages text[] NOT NULL DEFAULT '{}',
  interests text[] NOT NULL DEFAULT '{}',
  relationship_intent text NOT NULL DEFAULT 'friendship-first',
  values text[] NOT NULL DEFAULT '{}',
  lifestyle text[] NOT NULL DEFAULT '{}',
  communication_style text NOT NULL DEFAULT 'thoughtful',
  photo_url text NOT NULL DEFAULT '',
  gallery text[] NOT NULL DEFAULT '{}',
  profile_completion integer NOT NULL DEFAULT 0,
  is_verified boolean NOT NULL DEFAULT false,
  onboarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "read_all_profiles" ON profiles;
CREATE POLICY "read_all_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id text NOT NULL DEFAULT '',
  user1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON conversations TO authenticated;

DROP POLICY IF EXISTS "select_own_conversations" ON conversations;
CREATE POLICY "select_own_conversations" ON conversations FOR SELECT
  TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "insert_own_conversations" ON conversations;
CREATE POLICY "insert_own_conversations" ON conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "update_own_conversations" ON conversations;
CREATE POLICY "update_own_conversations" ON conversations FOR UPDATE
  TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id)
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Conversation reads table
CREATE TABLE IF NOT EXISTS conversation_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE conversation_reads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON conversation_reads TO authenticated;

DROP POLICY IF EXISTS "select_own_reads" ON conversation_reads;
CREATE POLICY "select_own_reads" ON conversation_reads FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reads" ON conversation_reads;
CREATE POLICY "insert_own_reads" ON conversation_reads FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reads" ON conversation_reads;
CREATE POLICY "update_own_reads" ON conversation_reads FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON messages TO authenticated;

DROP POLICY IF EXISTS "select_conversation_messages" ON messages;
CREATE POLICY "select_conversation_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'system',
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  action_user_id text,
  action_user_photo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON notifications TO authenticated;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Blocked users table
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_user_id text NOT NULL DEFAULT '',
  display_name text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'blocked',
  reason text,
  blocked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON blocked_users TO authenticated;

DROP POLICY IF EXISTS "select_own_blocks" ON blocked_users;
CREATE POLICY "select_own_blocks" ON blocked_users FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_blocks" ON blocked_users;
CREATE POLICY "insert_own_blocks" ON blocked_users FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_blocks" ON blocked_users;
CREATE POLICY "delete_own_blocks" ON blocked_users FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_user_id ON blocked_users(user_id);

-- Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatar_public_read" ON storage.objects;
CREATE POLICY "avatar_public_read" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatar_auth_upload" ON storage.objects;
CREATE POLICY "avatar_auth_upload" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatar_auth_update" ON storage.objects;
CREATE POLICY "avatar_auth_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatar_auth_delete" ON storage.objects;
CREATE POLICY "avatar_auth_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'avatars');

-- Updated_at trigger for profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();