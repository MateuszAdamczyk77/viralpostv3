-- =============================================
-- Migration: Initial Schema Setup
-- Purpose: Create core tables for AI Slideshow Generator
-- Created: 2025-01-06 12:00:00 UTC
-- =============================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =============================================
-- Table: collections
-- Purpose: Store user image collections
-- =============================================
create table public.collections (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.collections is 'User-created image collections that can be used to generate slideshows';

-- Enable RLS on collections table
alter table public.collections enable row level security;

-- =============================================
-- Table: images
-- Purpose: Store metadata for uploaded and AI-generated images
-- =============================================
create table public.images (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  collection_id uuid references public.collections(id) on delete cascade not null,
  storage_key text not null unique,
  original_filename text,
  mime_type text not null,
  file_size bigint not null,
  width integer,
  height integer,
  image_type text not null check (image_type in ('uploaded', 'ai')),
  ai_prompt text,
  created_at timestamptz default now() not null
);

comment on table public.images is 'Metadata for all images (uploaded and AI-generated) stored in collections';

-- Enable RLS on images table
alter table public.images enable row level security;

-- =============================================
-- Table: slideshows
-- Purpose: Store slideshow metadata and configuration
-- =============================================
create table public.slideshows (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  collection_id uuid references public.collections(id) on delete cascade not null,
  title text not null,
  subtitle_prompt text,
  style_template text default 'default' not null,
  status text default 'draft' not null check (status in ('draft', 'generating', 'ready', 'error')),
  video_url text,
  video_duration integer,
  render_job_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.slideshows is 'Slideshow configurations created from image collections';

-- Enable RLS on slideshows table
alter table public.slideshows enable row level security;

-- =============================================
-- Table: slides
-- Purpose: Store individual slide data within slideshows
-- =============================================
create table public.slides (
  id uuid default gen_random_uuid() primary key,
  slideshow_id uuid references public.slideshows(id) on delete cascade not null,
  image_id uuid references public.images(id) on delete cascade not null,
  subtitle text not null,
  duration_seconds integer default 4 not null check (duration_seconds > 0 and duration_seconds <= 30),
  slide_order integer not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.slides is 'Individual slides within a slideshow with their subtitles and timing';

-- Enable RLS on slides table
alter table public.slides enable row level security;

-- =============================================
-- Table: user_integrations
-- Purpose: Store third-party service integration tokens (TikTok OAuth)
-- =============================================
create table public.user_integrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  service_name text not null check (service_name in ('tiktok')),
  encrypted_access_token text not null,
  encrypted_refresh_token text,
  token_expires_at timestamptz,
  scope text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, service_name)
);

comment on table public.user_integrations is 'Third-party service integrations for users (OAuth tokens)';

-- Enable RLS on user_integrations table
alter table public.user_integrations enable row level security;

-- =============================================
-- Table: files
-- Purpose: Track file uploads and virus scanning status
-- =============================================
create table public.files (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  bucket text not null,
  storage_key text not null unique,
  original_filename text,
  mime_type text not null,
  file_size bigint not null,
  width integer,
  height integer,
  is_infected boolean default false not null,
  scan_status text default 'pending' not null check (scan_status in ('pending', 'clean', 'infected', 'error')),
  created_at timestamptz default now() not null
);

comment on table public.files is 'File upload tracking with virus scan results for security';

-- Enable RLS on files table
alter table public.files enable row level security;

-- =============================================
-- Create indexes for performance optimization
-- =============================================

-- Multi-tenant indexes for RLS performance
create index idx_collections_owner_id on public.collections(owner_id);
create index idx_collections_owner_created on public.collections(owner_id, created_at desc);

create index idx_images_owner_id on public.images(owner_id);
create index idx_images_collection_id on public.images(collection_id);
create index idx_images_owner_collection on public.images(owner_id, collection_id);

create index idx_slideshows_owner_id on public.slideshows(owner_id);
create index idx_slideshows_collection_id on public.slideshows(collection_id);
create index idx_slideshows_owner_created on public.slideshows(owner_id, created_at desc);

create index idx_slides_slideshow_id on public.slides(slideshow_id);
create index idx_slides_slideshow_order on public.slides(slideshow_id, slide_order);

create index idx_user_integrations_user_id on public.user_integrations(user_id);
create index idx_user_integrations_service on public.user_integrations(user_id, service_name);

create index idx_files_owner_id on public.files(owner_id);
create index idx_files_storage_key on public.files(storage_key);

-- =============================================
-- Create updated_at trigger function
-- =============================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.handle_updated_at() is 'Trigger function to automatically update updated_at timestamps';

-- Apply updated_at triggers to relevant tables
create trigger collections_updated_at
  before update on public.collections
  for each row execute function public.handle_updated_at();

create trigger slideshows_updated_at
  before update on public.slideshows
  for each row execute function public.handle_updated_at();

create trigger slides_updated_at
  before update on public.slides
  for each row execute function public.handle_updated_at();

create trigger user_integrations_updated_at
  before update on public.user_integrations
  for each row execute function public.handle_updated_at(); 