-- Fix profiles table RLS to require authentication
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Require authentication for all profile access
CREATE POLICY "Authenticated users only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Users can still only view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Make policy-files storage bucket private
UPDATE storage.buckets 
SET public = false 
WHERE name = 'policy-files';

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload policy files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view approved policy files" ON storage.objects;
DROP POLICY IF EXISTS "Policy owners can update files" ON storage.objects;
DROP POLICY IF EXISTS "Policy owners can delete files" ON storage.objects;

-- Add RLS policies for storage.objects
CREATE POLICY "Authenticated users can upload policy files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'policy-files' 
  AND auth.uid() IS NOT NULL
);

-- Allow access only to files of approved/active policies
CREATE POLICY "Users can view approved policy files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'policy-files' 
  AND (
    -- Allow authenticated users to see files from approved/active policies
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.policies 
      WHERE file_url LIKE '%' || storage.objects.name 
      AND status IN ('approved', 'active')
    )
  )
  OR (
    -- Allow policy owners to see their own draft files
    EXISTS (
      SELECT 1 FROM public.policies 
      WHERE file_url LIKE '%' || storage.objects.name 
      AND created_by = auth.uid()
    )
  )
);

-- Allow policy owners to update their files
CREATE POLICY "Policy owners can update files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'policy-files'
  AND EXISTS (
    SELECT 1 FROM public.policies 
    WHERE file_url LIKE '%' || storage.objects.name 
    AND created_by = auth.uid()
  )
);

-- Allow policy owners to delete their files
CREATE POLICY "Policy owners can delete files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'policy-files'
  AND EXISTS (
    SELECT 1 FROM public.policies 
    WHERE file_url LIKE '%' || storage.objects.name 
    AND created_by = auth.uid()
  )
);