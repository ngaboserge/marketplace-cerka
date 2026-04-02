# Cerka Materials Marketplace

> Real-time construction material pricing and supplier network for Rwanda

## Overview

Cerka Materials Marketplace is an independent platform providing transparent construction material pricing and connecting buyers with verified suppliers across Rwanda. It features community-driven price intelligence and market insights.

## Features

### Price Intelligence
- **Real-time Prices** - Current market prices for 30+ construction materials
- **Price Trends** - Historical data and trend analysis
- **Market Signals** - Automated alerts for price changes and market conditions
- **Location-based Pricing** - Prices by district and location across Rwanda

### Supplier Network
- **Verified Suppliers** - Connect with trusted, verified material suppliers
- **Quote System** - Request and receive competitive quotes
- **Supplier Ratings** - Review and rate supplier performance
- **Delivery Tracking** - Track orders and delivery status

### Community Features
- **Price Submissions** - Contribute real market prices from your purchases
- **Quality Scoring** - Reliability scores for price contributors
- **Market Insights** - AI-generated market analysis and forecasts
- **Discussion Forums** - Community discussions about market conditions

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Maps**: Google Maps API
- **Internationalization**: i18next

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd materials-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-materials-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-materials-anon-key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migration: `supabase/migrations/001_materials_marketplace_schema.sql`
   - Enable Row Level Security (RLS)

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project for materials marketplace
   - Note the project URL and anon key

2. **Run Migrations**
   - Copy the SQL from `supabase/migrations/001_materials_marketplace_schema.sql`
   - Run it in the Supabase SQL editor
   - This includes 30+ pre-seeded materials

3. **Configure Authentication**
   - Enable email/password authentication
   - Set up email templates
   - Configure redirect URLs

## Project Structure

```
materials-marketplace/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components
│   │   ├── layout/         # Layout components
│   │   ├── charts/         # Chart components
│   │   └── intelligence/   # AI/Intelligence components
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── materials/      # Materials & pricing pages
│   │   ├── buyers/         # Buyer pages
│   │   ├── suppliers/      # Supplier pages
│   │   ├── marketplace/    # Marketplace pages
│   │   ├── intelligence/   # Intelligence & signals pages
│   │   └── admin/          # Admin pages
│   ├── services/           # API services
│   ├── store/              # State management
│   ├── lib/                # Utilities and configurations
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── i18n/               # Internationalization
├── public/                 # Static assets
├── supabase/              # Database migrations
└── docs/                  # Documentation
```

## Key Features Implementation

### Price Intelligence System
- **Aggregation Engine**: Combines multiple price submissions into reliable averages
- **Quality Scoring**: Evaluates price submission reliability and accuracy
- **Trend Analysis**: Identifies price patterns and market movements
- **Signal Detection**: Automated alerts for significant market changes

### Supplier Verification
- **Document Verification**: Business license and tax ID verification
- **Performance Tracking**: Order completion rates and customer satisfaction
- **Rating System**: Multi-dimensional ratings (quality, delivery, communication)
- **Compliance Monitoring**: Ongoing verification of supplier credentials

### Market Intelligence
- **AI Narratives**: Automated explanations of price trends and market conditions
- **Predictive Analytics**: Forecast future price movements
- **Seasonal Analysis**: Identify seasonal patterns in material pricing
- **Regional Insights**: Location-specific market analysis

## Materials Catalog

The platform tracks 30+ construction materials across categories:

- **Cement & Concrete**: Portland cement, ready-mix concrete
- **Aggregates**: Sand, gravel, bricks, concrete blocks
- **Steel & Metal**: Rebar, wire mesh, structural steel
- **Roofing**: Iron sheets, tiles, timber
- **Wood & Timber**: Planks, plywood, beams
- **Finishing**: Paint, tiles, hardware
- **Electrical**: Wiring, switches, outlets
- **Plumbing**: Pipes, fixtures, fittings

## API Documentation

### Price Submissions API
```typescript
// Submit a new price
POST /api/price-submissions
{
  "material_id": "uuid",
  "price": 25000,
  "quantity": 1,
  "location": "Kigali",
  "photo_url": "optional"
}
```

### Materials API
```typescript
// Get all materials
GET /api/materials

// Get material by ID
GET /api/materials/:id

// Get aggregated prices
GET /api/materials/:id/prices?location=Kigali
```

### Suppliers API
```typescript
// Search suppliers
GET /api/suppliers?material=cement&location=Kigali

// Create listing
POST /api/suppliers/listings
{
  "material_id": "uuid",
  "price": 25000,
  "description": "High quality cement"
}
```

## Deployment

### Production Build
```bash
npm run build
```

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Custom Server**
   - Build the project: `npm run build`
   - Serve the `dist` directory

### Environment Variables for Production
```env
VITE_SUPABASE_URL=https://your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_URL=https://your-domain.com
VITE_GOOGLE_MAPS_API_KEY=your-maps-key
```

## Data Sources & Quality

### Price Data Collection
- **User Submissions**: Community-contributed prices with photo verification
- **Supplier Listings**: Direct pricing from verified suppliers
- **Market Surveys**: Periodic market research and validation
- **Partner Integration**: Data from construction companies and retailers

### Quality Assurance
- **Automated Validation**: Price range checks and outlier detection
- **Community Moderation**: User reporting and peer review
- **Admin Review**: Manual verification of flagged submissions
- **Reliability Scoring**: Contributor reputation system

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions:
- Email: materials@cerka.rw
- Documentation: [materials.cerka.rw/docs](https://materials.cerka.rw/docs)
- Issues: Create an issue in this repository

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI price predictions
- [ ] Integration with ERP systems
- [ ] Blockchain-based price verification
- [ ] Regional expansion beyond Rwanda
- [ ] B2B procurement platform
- [ ] Supply chain financing

---

Made with ❤️ in Rwanda 🇷🇼