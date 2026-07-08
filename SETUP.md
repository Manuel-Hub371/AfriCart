# AfriCart Setup Guide

## Project Overview

AfriCart is a modern multi-vendor marketplace built with:
- **Next.js 15** (App Router)
- **TypeScript** 
- **Tailwind CSS**
- **shadcn/ui components**
- **Lucide React icons**

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
OnlineStore/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Homepage with all sections
│
├── components/
│   ├── ui/                   # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── dropdown-menu.tsx
│   │
│   ├── navigation/
│   │   └── navbar.tsx        # Sticky navigation bar
│   │
│   ├── home/                 # Homepage sections
│   │   ├── hero-section.tsx
│   │   ├── featured-categories.tsx
│   │   ├── featured-products.tsx
│   │   ├── popular-stores.tsx
│   │   ├── best-sellers.tsx
│   │   ├── new-arrivals.tsx
│   │   ├── special-deals.tsx
│   │   └── newsletter.tsx
│   │
│   ├── products/
│   │   └── product-card.tsx  # Reusable product card
│   │
│   └── footer/
│       └── footer.tsx         # Site footer with links
│
├── lib/
│   └── utils.ts               # Utility functions (cn helper)
│
└── Configuration Files
    ├── tailwind.config.ts     # Tailwind configuration
    ├── tsconfig.json          # TypeScript configuration
    ├── next.config.ts         # Next.js configuration
    ├── postcss.config.mjs     # PostCSS configuration
    └── package.json           # Project dependencies
```

## Key Features Implemented

### Navigation Bar
- Fixed top navigation
- Logo and brand name
- Search bar (desktop and mobile)
- Shopping cart with item counter
- Notifications with badge
- User profile dropdown menu
- Mobile hamburger menu
- Responsive design

### Homepage Sections

1. **Hero Section**
   - Large headline and subheading
   - Call-to-action buttons
   - Visual product grid illustration
   - Gradient background

2. **Featured Categories**
   - 8 product categories with icons
   - Product count display
   - Hover effects
   - Responsive grid layout

3. **Featured Products**
   - 8 product cards
   - Product images (gradient placeholders)
   - Store names
   - Star ratings and review counts
   - Pricing with discounts
   - Add to cart buttons
   - Wishlist buttons

4. **Popular Stores**
   - Store cards with banners
   - Store logos
   - Rating and follower counts
   - Product counts
   - Visit store buttons

5. **Best Sellers**
   - Top-selling products
   - Similar card design to featured products

6. **New Arrivals**
   - Recently added products
   - 8-product grid

7. **Special Deals**
   - Promotional banner
   - Live countdown timer
   - Discount badges
   - Visual product cards
   - Call-to-action button

8. **Newsletter**
   - Email subscription form
   - Icon and headline
   - Privacy message
   - Primary color background

9. **Footer**
   - 5-column layout (responsive)
   - Brand section with social links
   - Marketplace links
   - Customer support links
   - Seller resources
   - Legal links
   - Copyright notice

## Design System

### Colors
- **Primary:** Emerald Green (#16A34A)
- **Secondary:** White, Gray tones
- **Accent Colors:** Orange (deals), Red (alerts), Blue (info)

### Typography
- **Font Family:** Inter (Google Fonts)
- **Headings:** Bold, large sizes (3xl-6xl)
- **Body:** Regular weight, readable sizes

### Spacing
- Based on 8px system
- Consistent padding and margins
- Generous whitespace

### Components
- Rounded corners (rounded-lg, rounded-xl)
- Soft shadows (shadow-sm, shadow-lg)
- Subtle hover effects
- Smooth transitions (transition-colors, transition-shadow)

## Mobile Responsiveness

### Breakpoints (Tailwind)
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px

### Mobile Features
- Hamburger menu
- Stacked navigation
- Mobile-optimized search bar
- Touch-friendly buttons
- Responsive grids (1-2-4 columns)

## Component Customization

### Product Card
Located in `components/products/product-card.tsx`

Props:
- `id`: Product ID
- `name`: Product name
- `storeName`: Seller name
- `rating`: Star rating (0-5)
- `reviews`: Review count
- `price`: Current price
- `originalPrice`: Optional original price
- `discount`: Optional discount percentage
- `image`: Image gradient class

### Button Variants
- `default`: Primary green button
- `outline`: White with border
- `secondary`: Gray button
- `ghost`: Transparent
- `link`: Text link style

### Button Sizes
- `default`: Standard height
- `sm`: Small
- `lg`: Large
- `icon`: Square icon button

## Next Steps

### Backend Integration
1. Connect to API for products
2. Implement authentication
3. Add cart functionality
4. Setup payment processing
5. Create seller dashboard

### Additional Features
- Product detail pages
- Store pages
- User profile pages
- Checkout flow
- Order tracking
- Admin dashboard

### Optimization
- Add actual product images
- Implement lazy loading
- Setup CDN for assets
- Add SEO metadata
- Implement analytics

## Troubleshooting

### Installation Issues
- Ensure Node.js 18+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

### Build Errors
- Check TypeScript errors: `npm run lint`
- Verify all imports are correct
- Ensure all dependencies are installed

### Styling Issues
- Verify Tailwind is configured correctly
- Check `globals.css` imports
- Ensure PostCSS is working

## Support

For issues or questions:
1. Check the documentation
2. Review component code
3. Open an issue on GitHub
4. Contact the development team

---

**Built with ❤️ using Next.js and Tailwind CSS**
