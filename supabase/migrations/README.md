# Database Migrations

This directory contains Supabase migrations for the AI Slideshow Generator application.

## Migration Files

### 0001_initial_schema.sql
- Creates core database tables for the application
- Sets up proper indexes for performance
- Enables Row Level Security (RLS) on all tables
- Creates utility functions and triggers

**Tables Created:**
- `collections` - User image collections
- `images` - Image metadata (uploaded and AI-generated)
- `slideshows` - Slideshow configurations
- `slides` - Individual slides within slideshows
- `user_integrations` - Third-party service tokens (TikTok OAuth)
- `files` - File upload tracking with virus scanning

### 0002_rls_policies.sql
- Implements comprehensive RLS policies for multi-tenant security
- Ensures users can only access their own data
- Follows principle of least privilege
- Separate policies for each operation (SELECT, INSERT, UPDATE, DELETE)

**Security Features:**
- Owner-based access control using `auth.uid()`
- Hierarchical access for slides (through slideshow ownership)
- Encrypted token storage for integrations
- File virus scanning status tracking

### 0003_storage_setup.sql
- Creates Supabase Storage buckets for different file types
- Sets up storage-specific RLS policies
- Configures file size limits and MIME type restrictions

**Storage Buckets:**
- `public` - Marketing assets (50MB limit)
- `private` - User content (50MB limit)
- `transient` - Temporary uploads (50MB limit)
- `renders` - Video outputs (500MB limit)

## Running Migrations

To apply these migrations to your Supabase project:

```bash
# Make sure you're in the viralpost directory
cd viralpost

# Run migrations (requires Supabase CLI)
supabase db reset --linked
# or apply specific migration
supabase db push
```

## Security Considerations

- All tables use UUIDs as primary keys
- Foreign key constraints maintain referential integrity
- RLS policies prevent cross-tenant data access
- Storage policies enforce user-specific folder structure
- Sensitive data (OAuth tokens) is encrypted at application level

## Performance Optimizations

- Composite indexes on `(owner_id, id)` for multi-tenant queries
- Specialized indexes for common query patterns
- Updated_at triggers for automatic timestamp management
- Efficient RLS policies using subqueries for hierarchical access 