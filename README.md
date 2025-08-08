# tenniszero.org - AI Startup Builder

🚀 **Build Your AI Startup Fast** - A comprehensive SvelteKit-based platform for launching AI startups quickly with built-in CMS, admin dashboard, and multilingual support.

## ✨ Features

### 🎯 Core Features
- **🏠 Homepage Builder** - Dynamic homepage with CMS-managed content
- **📝 Blog System** - Full-featured blog with markdown support and TOC
- **🌍 Multilingual Support** - Built-in i18n with language switching
- **📱 Responsive Design** - Mobile-first design with dark mode support
- **⚡ Fast Performance** - SvelteKit with SSR and optimized builds

### 🛠️ Admin Features
- **🎛️ Admin Dashboard** - Complete admin interface at `/vibbyai`
- **📄 CMS Integration** - Sveltia CMS for content management
- **⚙️ Init Setup** - WordPress-style configuration wizard
- **🔧 Environment Management** - Automated .env configuration
- **📊 Analytics Integration** - Microsoft Clarity support

### 🔐 Technical Features
- **🗄️ Supabase Integration** - Database and authentication (optional)
- **📧 Email Services** - Nodemailer integration
- **🎨 Modern UI** - TailwindCSS with custom components
- **🔒 Security** - Automatic encryption key generation
- **📈 SEO Optimized** - Meta tags, sitemaps, and structured data

## ⚠️ Important: Project Design Rules

**Before making any changes, please read [PROJECT_RULES.md](./PROJECT_RULES.md)**

Key rules to remember:
- 🚨 **CMS page MUST use iframe embedding** (`/vibbyai/cms`)
- 📊 **Data source strategy is CMS_ONLY** (no GitHub API fallback)
- 🎨 **Maintain consistent backend layout structure**
- 🔧 **Use Svelte 5 compatible syntax only**
- 🚫 **No Drizzle ORM** - Keep technical stack simple

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/gstarwd/tenniszero.org.git
cd tenniszero.org

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
open http://localhost:5173
```

### Initial Setup

1. **Visit the setup wizard**: `http://localhost:5173/vibbyai/init`
2. **Configure basic settings**: Environment, site URL
3. **Setup database**: Supabase connection (optional)
4. **Configure services**: Email, analytics (optional)
5. **Complete setup**: All configurations saved automatically

## 📁 Project Structure

```
src/
├── routes/                 # SvelteKit routes
│   ├── vibbyai/           # Admin dashboard
│   ├── api/               # API endpoints
│   ├── blog/              # Blog pages
│   └── [lang]/            # Multilingual routes
├── lib/
│   ├── components/        # Reusable components
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── content-loader.ts  # Content management
├── content/               # CMS content files
├── static/                # Static assets
└── app.html              # HTML template
```

## 🎛️ Admin Dashboard

Access the admin dashboard at `/vibbyai` with the following features:

### 📊 Dashboard Overview
- System status and metrics
- Quick access to common tasks
- Recent activity summary

### 📝 Content Management
- **CMS Integration**: Embedded Sveltia CMS at `/vibbyai/cms`
- **Content Strategy**: Local file-based content
- **GitHub Integration**: Optional GitHub-based content

### ⚙️ Settings
- **Technical Settings**: Head scripts, analytics
- **SEO Management**: Search engine console links
- **Profile Management**: User account settings

## 🌍 Multilingual Support

### Supported Languages
- **English** (en) - Default
- **Chinese** (zh) - Simplified Chinese
- **Extensible**: Easy to add more languages

### Content Structure
```
src/content/
├── en/                    # English content
│   ├── home/
│   ├── blog/
│   └── pages/
└── zh/                    # Chinese content
    ├── home/
    ├── blog/
    └── pages/
```

## 🔧 Configuration

### Environment Variables
```bash
# Basic Configuration
NODE_ENV=development
PUBLIC_SITE_URL=http://localhost:5173

# Supabase (Optional)
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key

# Security (Auto-generated)
ENCRYPTION_SECRET=auto-generated-48-char-key

# Services (Optional)
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Deployment Platforms
- **Vercel** (Recommended)
- **Netlify**
- **Node.js servers**

### Environment Setup
1. Configure environment variables in your deployment platform
2. Set up Supabase database (if using)
3. Configure domain and SSL
4. Set up analytics and monitoring

## 🛠️ Development

### Available Scripts
```bash
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm preview        # Preview production build
pnpm check          # Run type checking
```

### Code Style
- **TypeScript**: Strict mode enabled
- **Svelte 5**: Latest Svelte version
- **TailwindCSS**: Utility-first CSS
- **Component-based**: Modular architecture

## 📚 API Reference

### Core APIs
- `GET /api/ping` - Health check
- `POST /api/env-config` - Environment configuration
- `GET /api/content/*` - Content retrieval

### Admin APIs
- `POST /api/admin/test-github` - GitHub integration test
- `POST /api/admin/update-content-source` - Content source update

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Follow the project rules in PROJECT_RULES.md
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check this README and PROJECT_RULES.md
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

---

**Built with ❤️ using SvelteKit, TailwindCSS, and modern web technologies.**
