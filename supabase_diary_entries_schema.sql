-- Create the diary_entries table
CREATE TABLE public.diary_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    content TEXT NOT NULL,
    analysis_result JSONB
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to SELECT only their own entries
CREATE POLICY "Allow users to select their own entries"
ON public.diary_entries
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Allow users to INSERT entries for themselves
CREATE POLICY "Allow users to insert their own entries"
ON public.diary_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Allow users to UPDATE only their own entries
CREATE POLICY "Allow users to update their own entries"
ON public.diary_entries
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Allow users to DELETE only their own entries
CREATE POLICY "Allow users to delete their own entries"
ON public.diary_entries
FOR DELETE
USING (auth.uid() = user_id);

-- Optional: Create an index for user_id for faster lookups
CREATE INDEX idx_diary_entries_user_id ON public.diary_entries(user_id);

-- Grant usage on the schema to the authenticated role (if not already granted)
-- GRANT USAGE ON SCHEMA public TO authenticated; -- Supabase usually handles this

-- Grant permissions to the authenticated role for the diary_entries table
-- These are often managed by Supabase based on RLS, but can be explicit:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.diary_entries TO authenticated;

COMMENT ON TABLE public.diary_entries IS 'Stores diary entries for users.';
COMMENT ON COLUMN public.diary_entries.id IS 'Unique identifier for the diary entry.';
COMMENT ON COLUMN public.diary_entries.user_id IS 'Identifier of the user who owns this entry, references auth.users.';
COMMENT ON COLUMN public.diary_entries.created_at IS 'Timestamp of when the entry was created.';
COMMENT ON COLUMN public.diary_entries.content IS 'The textual content of the diary entry.';
COMMENT ON COLUMN public.diary_entries.analysis_result IS 'JSONB field to store results from any text analysis performed on the content.';

-- Note:
-- 1. Make sure the `uuid-ossp` extension is enabled in your Supabase project for `uuid_generate_v4()`.
--    It's usually enabled by default. You can check/enable it under Database -> Extensions in the Supabase dashboard.
--    Or run: CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
--
-- 2. The policies assume you are using Supabase's built-in `auth.uid()` function to get the ID of the currently authenticated user.
--
-- 3. The `WITH CHECK` clause in INSERT and UPDATE policies ensures that the `user_id` being inserted/updated matches the authenticated user's ID.
--    The `USING` clause in SELECT, UPDATE, and DELETE policies restricts which rows the operations can apply to.
--
-- 4. The optional index on `user_id` is recommended for performance, as queries will frequently filter by this column due to RLS policies.
--
-- 5. The GRANT statements for schema usage and table permissions are often handled by Supabase automatically when you enable RLS and define policies.
--    However, they are included for completeness and can be necessary in some setups or if you manage roles more granularly.
--    Supabase typically grants these to the `authenticated` role when RLS is in place.
--    You usually don't need to run these GRANT statements manually if using Supabase's default roles and RLS.
--
-- To apply this schema:
-- Go to your Supabase project dashboard -> SQL Editor -> New query, paste the content of this file, and click "RUN".
-- Review the output to ensure everything executed successfully.
--
-- It's good practice to test these policies thoroughly after application.
-- For example, try to:
-- - Create an entry as user A.
-- - Log in as user B and try to read user A's entry (should fail).
-- - Log in as user A and try to read user A's entry (should succeed).
-- - Attempt to insert an entry with a user_id different from auth.uid() (should fail due to WITH CHECK).
--
-- The `auth.users(id)` reference for `user_id` correctly links to the built-in Supabase authentication users table.
-- The `analysis_result` column is `JSONB` as requested, allowing for structured, queryable JSON data.
-- `created_at` defaults to the current transaction timestamp.
-- `id` defaults to a new UUID v4.
-- `content` is `TEXT` and `NOT NULL`.
-- `user_id` is `UUID` and `NOT NULL`.
