-- Create storage bucket for discussion images
INSERT INTO storage.buckets (id, name, public) VALUES ('discussion-images', 'discussion-images', true);

-- Create discussion threads table
CREATE TABLE public.discussion_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discussion comments table
CREATE TABLE public.discussion_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discussion favorites table
CREATE TABLE public.discussion_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, thread_id)
);

-- Enable Row Level Security
ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussion_threads
CREATE POLICY "Discussion threads are viewable by everyone" 
ON public.discussion_threads 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own discussion threads" 
ON public.discussion_threads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussion threads" 
ON public.discussion_threads 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussion threads" 
ON public.discussion_threads 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for discussion_comments
CREATE POLICY "Discussion comments are viewable by everyone" 
ON public.discussion_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.discussion_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.discussion_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.discussion_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for discussion_favorites
CREATE POLICY "Users can view their own favorites" 
ON public.discussion_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
ON public.discussion_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.discussion_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Storage policies for discussion images
CREATE POLICY "Discussion images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'discussion-images');

CREATE POLICY "Users can upload discussion images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'discussion-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own discussion images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'discussion-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own discussion images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'discussion-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add update triggers
CREATE TRIGGER update_discussion_threads_updated_at
BEFORE UPDATE ON public.discussion_threads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussion_comments_updated_at
BEFORE UPDATE ON public.discussion_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();