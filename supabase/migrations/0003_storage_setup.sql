-- =============================================
-- Migration: Storage Setup
-- Purpose: Create storage buckets and policies for file uploads
-- Created: 2025-01-06 12:10:00 UTC
-- =============================================

-- =============================================
-- Create Storage Buckets
-- =============================================

-- Create public bucket for marketing assets and public images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public', 
  'public',
  true,
  52428800, -- 50MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create private bucket for user-generated content
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'private', 
  'private',
  false,
  52428800, -- 50MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create transient bucket for temporary uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'transient', 
  'transient',
  false,
  52428800, -- 50MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create renders bucket for Creatomate video outputs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'renders', 
  'renders',
  false,
  524288000, -- 500MB limit for videos
  array['video/mp4', 'video/webm']
);

-- =============================================
-- Storage RLS Policies
-- =============================================

-- Public bucket - anyone can read, only authenticated users can upload
create policy "Public bucket read access"
on storage.objects
for select
to public
using ( bucket_id = 'public' );

create policy "Authenticated users can upload to public bucket"
on storage.objects
for insert
to authenticated
with check ( bucket_id = 'public' );

-- Private bucket - users can only access their own files
create policy "Users can view their own private files"
on storage.objects
for select
to authenticated
using ( 
  bucket_id = 'private' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "Users can upload to their private folder"
on storage.objects
for insert
to authenticated
with check ( 
  bucket_id = 'private' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "Users can update their own private files"
on storage.objects
for update
to authenticated
using ( 
  bucket_id = 'private' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
)
with check ( 
  bucket_id = 'private' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own private files"
on storage.objects
for delete
to authenticated
using ( 
  bucket_id = 'private' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
);

-- Transient bucket - similar to private but for temporary files
create policy "Users can access their own transient files"
on storage.objects
for select
to authenticated
using ( 
  bucket_id = 'transient' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "Users can upload to transient bucket"
on storage.objects
for insert
to authenticated
with check ( 
  bucket_id = 'transient' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "Users can delete their transient files"
on storage.objects
for delete
to authenticated
using ( 
  bucket_id = 'transient' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
);

-- Renders bucket - users can only access their own rendered videos
create policy "Users can view their own rendered videos"
on storage.objects
for select
to authenticated
using ( 
  bucket_id = 'renders' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
);

create policy "System can store rendered videos"
on storage.objects
for insert
to service_role
with check ( bucket_id = 'renders' );

create policy "Users can delete their own rendered videos"
on storage.objects
for delete
to authenticated
using ( 
  bucket_id = 'renders' and 
  (select auth.uid())::text = (storage.foldername(name))[1]
); 