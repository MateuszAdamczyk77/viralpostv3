-- =============================================
-- Migration: Row Level Security Policies
-- Purpose: Create RLS policies for multi-tenant security
-- Created: 2025-01-06 12:05:00 UTC
-- =============================================

-- =============================================
-- Collections Table RLS Policies
-- =============================================

-- Allow authenticated users to select their own collections
create policy "Users can view their own collections"
on public.collections
for select
to authenticated
using ( (select auth.uid()) = owner_id );

-- Allow authenticated users to insert collections they own
create policy "Users can create their own collections"
on public.collections
for insert
to authenticated
with check ( (select auth.uid()) = owner_id );

-- Allow authenticated users to update their own collections
create policy "Users can update their own collections"
on public.collections
for update
to authenticated
using ( (select auth.uid()) = owner_id )
with check ( (select auth.uid()) = owner_id );

-- Allow authenticated users to delete their own collections
create policy "Users can delete their own collections"
on public.collections
for delete
to authenticated
using ( (select auth.uid()) = owner_id );

-- =============================================
-- Images Table RLS Policies
-- =============================================

-- Allow authenticated users to select their own images
create policy "Users can view their own images"
on public.images
for select
to authenticated
using ( (select auth.uid()) = owner_id );

-- Allow authenticated users to insert images they own
create policy "Users can create their own images"
on public.images
for insert
to authenticated
with check ( (select auth.uid()) = owner_id );

-- Allow authenticated users to update their own images
create policy "Users can update their own images"
on public.images
for update
to authenticated
using ( (select auth.uid()) = owner_id )
with check ( (select auth.uid()) = owner_id );

-- Allow authenticated users to delete their own images
create policy "Users can delete their own images"
on public.images
for delete
to authenticated
using ( (select auth.uid()) = owner_id );

-- =============================================
-- Slideshows Table RLS Policies
-- =============================================

-- Allow authenticated users to select their own slideshows
create policy "Users can view their own slideshows"
on public.slideshows
for select
to authenticated
using ( (select auth.uid()) = owner_id );

-- Allow authenticated users to insert slideshows they own
create policy "Users can create their own slideshows"
on public.slideshows
for insert
to authenticated
with check ( (select auth.uid()) = owner_id );

-- Allow authenticated users to update their own slideshows
create policy "Users can update their own slideshows"
on public.slideshows
for update
to authenticated
using ( (select auth.uid()) = owner_id )
with check ( (select auth.uid()) = owner_id );

-- Allow authenticated users to delete their own slideshows
create policy "Users can delete their own slideshows"
on public.slideshows
for delete
to authenticated
using ( (select auth.uid()) = owner_id );

-- =============================================
-- Slides Table RLS Policies
-- Users can access slides if they own the parent slideshow
-- =============================================

-- Allow authenticated users to select slides from their own slideshows
create policy "Users can view slides from their own slideshows"
on public.slides
for select
to authenticated
using ( 
  slideshow_id in (
    select id from public.slideshows
    where owner_id = (select auth.uid())
  )
);

-- Allow authenticated users to insert slides into their own slideshows
create policy "Users can create slides in their own slideshows"
on public.slides
for insert
to authenticated
with check ( 
  slideshow_id in (
    select id from public.slideshows
    where owner_id = (select auth.uid())
  )
);

-- Allow authenticated users to update slides in their own slideshows
create policy "Users can update slides in their own slideshows"
on public.slides
for update
to authenticated
using ( 
  slideshow_id in (
    select id from public.slideshows
    where owner_id = (select auth.uid())
  )
)
with check ( 
  slideshow_id in (
    select id from public.slideshows
    where owner_id = (select auth.uid())
  )
);

-- Allow authenticated users to delete slides from their own slideshows
create policy "Users can delete slides from their own slideshows"
on public.slides
for delete
to authenticated
using ( 
  slideshow_id in (
    select id from public.slideshows
    where owner_id = (select auth.uid())
  )
);

-- =============================================
-- User Integrations Table RLS Policies
-- =============================================

-- Allow authenticated users to select their own integrations
create policy "Users can view their own integrations"
on public.user_integrations
for select
to authenticated
using ( (select auth.uid()) = user_id );

-- Allow authenticated users to insert their own integrations
create policy "Users can create their own integrations"
on public.user_integrations
for insert
to authenticated
with check ( (select auth.uid()) = user_id );

-- Allow authenticated users to update their own integrations
create policy "Users can update their own integrations"
on public.user_integrations
for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

-- Allow authenticated users to delete their own integrations
create policy "Users can delete their own integrations"
on public.user_integrations
for delete
to authenticated
using ( (select auth.uid()) = user_id );

-- =============================================
-- Files Table RLS Policies
-- =============================================

-- Allow authenticated users to select their own files
create policy "Users can view their own files"
on public.files
for select
to authenticated
using ( (select auth.uid()) = owner_id );

-- Allow authenticated users to insert files they own
create policy "Users can create their own files"
on public.files
for insert
to authenticated
with check ( (select auth.uid()) = owner_id );

-- Allow authenticated users to update their own files
create policy "Users can update their own files"
on public.files
for update
to authenticated
using ( (select auth.uid()) = owner_id )
with check ( (select auth.uid()) = owner_id );

-- Allow authenticated users to delete their own files
create policy "Users can delete their own files"
on public.files
for delete
to authenticated
using ( (select auth.uid()) = owner_id ); 