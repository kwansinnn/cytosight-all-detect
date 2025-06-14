-- Drop existing foreign key constraints that reference auth.users
ALTER TABLE public.discussion_threads 
DROP CONSTRAINT IF EXISTS discussion_threads_user_id_fkey;

ALTER TABLE public.discussion_comments 
DROP CONSTRAINT IF EXISTS discussion_comments_user_id_fkey;

ALTER TABLE public.discussion_favorites 
DROP CONSTRAINT IF EXISTS discussion_favorites_user_id_fkey;

-- Add new foreign key constraints that reference profiles table
ALTER TABLE public.discussion_threads 
ADD CONSTRAINT discussion_threads_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.discussion_comments 
ADD CONSTRAINT discussion_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.discussion_favorites 
ADD CONSTRAINT discussion_favorites_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;