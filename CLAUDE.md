# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm check

# Database migration
pnpm db:migrate  # or npm run migrate:database
```

### Testing and Validation
```bash
# Check project rules compliance
pnpm check:rules

# Verify Svelte components
pnpm check:watch
```

## Critical Project Rules

**⚠️ MUST READ PROJECT_RULES.md BEFORE ANY CHANGES**

### Core Design Principles
1. **CMS Page Design**: `/vibbyai/cms` MUST use iframe embedding to Sveltia CMS (`src="/admin"`)
2. **Data Source Strategy**: CONTENT_STRATEGY is `CMS_ONLY` - no GitHub API fallback
3. **Svelte 5 Only**: Use `$state`, `$derived`, `onclick` syntax (no deprecated `$:` or `on:click`)
4. **Documentation**: ALL documentation goes in `docs/` directory only (never create `doc/` or similar)

### Forbidden Actions
- Changing CMS iframe to independent page or card layout
- Re-enabling GitHub API or adding multiple data source fallbacks
- Using Svelte 4 syntax or deprecated features
- Creating documentation directories other than `docs/`

## Architecture Overview

### Multi-Site Platform
This is a **unified platform that can operate as 3 different site types**:
- **site-tool**: Tools/SaaS landing page
- **site-blog**: Blog-focused site
- **site-game**: Gaming platform

Site type is determined by `PUBLIC_SITE_TYPE` environment variable and controls which homepage component renders.

### Data Storage Strategy
**Hybrid approach with clear separation**:
- **Static Content** (CMS): `src/content/` → Blog posts, pages, settings, UI text
- **Dynamic Data** (Database): Supabase → User data, backlinks, SEO progress, API keys
- **Priority Order**: Environment Variables → Database → Local Files → Defaults

### Key Directory Structure
```
src/
├── routes/
│   ├── vibbyai/          # Admin dashboard (protected)
│   ├── api/              # API endpoints
│   ├── [lang]/           # Multilingual routes (en, zh)
│   └── blog/             # Blog system
├── lib/
│   ├── components/       # Reusable UI components
│   │   ├── site-*/       # Site-type specific components
│   │   └── ui/           # shadcn/ui components
│   ├── services/         # Business logic
│   ├── stores/           # Svelte stores
│   └── types/            # TypeScript definitions
├── content/              # CMS content files
└── static/admin/         # Sveltia CMS configuration
```

## Content Management

### CMS Integration
- **Sveltia CMS** embedded at `/vibbyai/cms` via iframe
- **Content Files**: `src/content/` organized by language and type
- **Configuration**: `static/admin/config.yml`

### Multi-language Support
Content organized by language:
```
src/content/
├── blog/           # Default English blogs
├── home/           # Homepage content
├── pages/          # Static pages
└── ui-text.json    # UI translations
```

Language-specific content uses `.zh.md` suffix for Chinese.

## Database Architecture

### Supabase Integration
Primary tables:
- `site_config`: Site-wide configuration
- `backlink_items`: SEO backlink management
- `seo_progress`: SEO task tracking
- `cms_content`: Dynamic CMS content
- `system_logs`: Application logging

### Migration System
- **SQL Scripts**: `supabase/migrations/`
- **Migration Tool**: `scripts/migrate-to-database.ts`
- **Fallback Strategy**: Database → File → Defaults

## Component Architecture

### Site-Type Components
- `ToolHomePage.svelte`: Tools/SaaS homepage
- `GameHomePage.svelte`: Gaming platform homepage  
- `BlogHomePage.svelte`: Blog-focused homepage

Selected dynamically based on `siteConfig.type`.

### Layout System
- **Root Layout**: `src/routes/+layout.svelte` (loads all configs)
- **Language Layout**: `src/routes/[lang]/+layout.svelte`
- **Admin Layout**: `src/routes/vibbyai/+layout.svelte` (dashboard)

### Authentication
- **Simple Auth**: File-based for admin access
- **Supabase Auth**: Database-driven user management
- **Session Management**: `locals.session` in server load functions

## API Patterns

### Standard Response Format
```typescript
// Success
return json({ success: true, data: result });

// Error
return json({ error: 'Error message' }, { status: 500 });
```

### Database API Pattern
All data APIs implement multi-tier storage:
1. Try database first
2. Fallback to file if database fails (development)
3. Environment variable override (highest priority)

Example: `/api/site-config`, `/api/backlink-data`, `/api/seo-progress`

## Development Guidelines

### Svelte 5 Syntax
```svelte
<!-- Correct -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>

<!-- Incorrect (deprecated) -->
<script>
  let count = 0;
  $: doubled = count * 2;
</script>

<button on:click={() => count++}>
```

### Error Handling
- **Server Errors**: Console log + graceful fallback
- **Client Errors**: User-friendly messages
- **Database Errors**: Fallback to file system in development

### Performance Considerations
- **SSR**: All content is server-side rendered
- **Build Target**: Vercel adapter with `includeFiles: ['src/content/**/*']`
- **Image Optimization**: Use Vercel's built-in optimization

## Deployment (Vercel)

### Environment Variables
Required for production:
```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_SITE_TYPE=site-tool  # or site-blog, site-game
```

### Build Configuration
- **Adapter**: `@sveltejs/adapter-vercel`
- **Content Files**: Included in serverless functions
- **Static Assets**: Optimized for CDN delivery

### Migration Checklist
1. Run `pnpm db:migrate` to populate Supabase
2. Set environment variables in Vercel dashboard
3. Verify all APIs return proper responses
4. Test site-type switching functionality

## Common Issues

### Database Connection
If Supabase connection fails, APIs gracefully fall back to file system in development. Check environment variables and network connectivity.

### Content Not Loading
Verify content files exist in `src/content/` and follow proper naming conventions. Check console for file system errors.

### Build Failures
Run `pnpm check` locally to catch TypeScript errors. Ensure all imports use correct paths and types are properly defined.

### CMS Access Issues
Sveltia CMS requires proper YAML configuration in `static/admin/config.yml`. Iframe must have appropriate sandbox permissions.