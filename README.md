# HealthPeDhyan - Healthy Choices Made Easy

A production-ready web application that helps people in India discover healthier products and shop through affiliate links (Amazon, Flipkart, etc.).

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Framer Motion
- **Backend**: Next.js Route Handlers (Node.js)
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Authentication**: NextAuth.js with role-based access (Admin, Editor)
- **Image Optimization**: Next.js Image with sharp
- **SEO**: Metadata API, JSON-LD schemas, sitemap/robots
- **Analytics**: GA4 integration
- **Testing**: Jest (unit), Playwright (E2E)
- **Container**: Docker + docker-compose
- **CI/CD**: GitHub Actions

## Features

### Public Features
- 🏠 Landing page with hero, product highlights, and blog
- 🛒 Product catalog with faceted filters (palm-oil-free, low-sugar, whole grain)
- 📦 Product detail pages with health badges and affiliate links
- 📝 Blog/articles system with MDX support
- 🔬 Evidence library with scientific references
- 🧪 Ingredient explorer with health impact information
- 📋 Health standards and methodology page
- ♿ Accessible, SEO-optimized, responsive design

### Admin Features
- 🔐 Secure authentication with role-based access
- ✏️ CRUD operations for products, brands, categories, badges, articles, evidence, ingredients
- 🖼️ Image management with optimization
- 📊 Draft/publish workflow
- 📝 Markdown editor for articles

### Technical Features
- ⚡ ISR (Incremental Static Regeneration) for performance
- 🔍 Full-text search with PostgreSQL
- 🔗 Automatic affiliate link building
- 📊 GA4 event tracking for affiliate clicks
- 🎨 Floating announcement banner (dismissible, localStorage)
- 🌐 Complete sitemap.xml generation
- 🤖 robots.txt configuration
- 🎯 JSON-LD structured data (Product, Article, Organization)

## Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Docker & docker-compose (optional)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Health
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/healthpedhyan?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# Affiliate Parameters
AFFILIATE_AMAZON_TAG="your-amazon-tag"
AFFILIATE_FLIPKART_PARAM="your-flipkart-affid"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Admin Credentials (for seeding)
ADMIN_EMAIL="admin@healthpedhyan.com"
ADMIN_PASSWORD="changeme123"
ADMIN_NAME="Admin User"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="HealthPeDhyan"
```

### 4. Set up the database

Run Prisma migrations:

```bash
pnpm db:migrate
```

Seed the database with sample data:

```bash
pnpm db:seed
```

This creates:
- Admin user (use credentials from `.env`)
- 5 sample products
- 4 badges
- 3 blog articles
- 4 ingredient factsheets
- 6 evidence entries
- Affiliate links

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Using Docker

### Development with Docker Compose

```bash
# Start all services (PostgreSQL + app)
docker-compose up

# Run migrations and seed
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

### Production Build

```bash
# Build the Docker image
docker build -t healthpedhyan .

# Run the container
docker run -p 3000:3000 -e DATABASE_URL="..." healthpedhyan
```

## Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate       # Run migrations (dev)
pnpm db:migrate:prod  # Run migrations (production)
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database (CAUTION!)

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript compiler check

# Testing
pnpm test             # Run Jest unit tests
pnpm test:watch       # Run Jest in watch mode
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:ui      # Run Playwright with UI
```

## Project Structure

```
Health/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (routes)/         # Public routes
│   │   ├── admin/            # Admin CMS routes
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   └── layout/           # Layout components (Header, Footer, Banner)
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # NextAuth config
│   │   ├── seo.ts            # SEO utilities & JSON-LD
│   │   ├── affiliate.ts      # Affiliate link builder
│   │   └── utils.ts          # Common utilities
│   └── types/                # TypeScript types
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed script
├── e2e/                      # Playwright E2E tests
├── public/                   # Static assets
├── .github/workflows/        # CI/CD pipelines
├── docker-compose.yml        # Docker Compose config
├── Dockerfile                # Docker image config
└── README.md                 # This file
```

## Database Schema

### Core Models

- **User**: Admin/Editor accounts
- **Product**: Product catalog with health metrics
- **Brand**: Product brands
- **Category**: Product categories
- **Badge**: Health badges (Palm Oil Free, Low Sugar, etc.)
- **ProductBadge**: Product-to-badge many-to-many
- **IngredientFlag**: Ingredient warnings (Palm Oil, HFCS, etc.)
- **ProductIngredientFlag**: Product-to-flag many-to-many
- **AffiliateLink**: Affiliate links (Amazon, Flipkart, etc.)
- **Article**: Blog posts
- **Evidence**: Scientific references
- **Ingredient**: Ingredient factsheets

See `prisma/schema.prisma` for the complete schema.

## Affiliate Links

Affiliate URLs are built server-side using environment variables:

```typescript
import { buildAffiliateUrl } from '@/lib/affiliate';

const url = buildAffiliateUrl(
  'https://amazon.in/product',
  'AMAZON'
);
// Returns: https://amazon.in/product?tag=your-amazon-tag
```

### GA4 Event Tracking

Affiliate clicks trigger custom events:

```javascript
gtag('event', 'affiliate_click', {
  product_id: 'abc123',
  merchant: 'AMAZON',
  url: 'https://...'
});
```

## SEO Features

### Metadata
Every page has optimized metadata (title, description, OG tags, Twitter cards).

### JSON-LD Schemas
- **Home**: Organization + WebSite
- **Products**: Product schema
- **Articles**: Article schema
- **All pages**: Breadcrumbs

### Sitemap
Auto-generated at `/sitemap.xml` including:
- Static pages
- All products
- Published articles
- Ingredient pages

## Testing

### Unit Tests (Jest)

```bash
pnpm test
```

Example test location: `src/lib/__tests__/affiliate.test.ts`

### E2E Tests (Playwright)

```bash
pnpm test:e2e
```

Example test location: `e2e/home.spec.ts`

### CI/CD

GitHub Actions runs:
1. Linting
2. Type checking
3. Unit tests
4. Build validation

See `.github/workflows/ci.yml`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

**Database**: Use [Neon](https://neon.tech), [Railway](https://railway.app), or [Supabase](https://supabase.com) for PostgreSQL.

### Other Platforms

- **Fly.io**: `fly launch`
- **Render**: Connect GitHub repo
- **Railway**: Connect GitHub repo

### Environment Variables

Make sure to set all variables from `.env.example` in your deployment platform.

## Admin Access

After seeding, log in at `/admin/login` with credentials from `.env`:

- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:
- Email: hello@healthpedhyan.com
- GitHub Issues: [Create an issue](https://github.com/your-org/healthpedhyan/issues)

---

Built with ❤️ for healthier choices
