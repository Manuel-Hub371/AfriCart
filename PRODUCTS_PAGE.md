# AfriCart - Products Page Documentation

## Overview

The Products Page is a fully-featured product listing interface with advanced filtering, sorting, and browsing capabilities designed for a multi-vendor marketplace.

## Page URL

`/products` - Main product listing page

## Features

### ✅ Breadcrumb Navigation
- Shows current location in site hierarchy
- Clickable path: Home > Products > [Category]
- Helps users understand their location

### ✅ Page Header
- Displays total product count
- Shows active filter count
- Clean, prominent title and description

### ✅ Category Navigation
- Horizontal scrollable menu
- 8 product categories with icons
- Product count per category
- Active category highlighting
- Mobile-friendly horizontal scroll

**Categories:**
1. All Products
2. Electronics
3. Fashion
4. Home & Living
5. Beauty
6. Sports
7. Books
8. Automotive

### ✅ Advanced Filter Sidebar

**Desktop:** Fixed sidebar on left  
**Mobile:** Bottom sheet drawer

**Filter Sections:**

1. **Categories**
   - Hierarchical category tree
   - Subcategories with product counts
   - Expandable/collapsible sections

2. **Price Range**
   - Min/max price inputs
   - Interactive slider
   - Real-time price display
   - Range: $0 - $5,000

3. **Customer Rating**
   - 5-star to 1-star filters
   - Star icons for visual clarity
   - Review count indicators

4. **Vendor Filter**
   - List of marketplace sellers
   - Verified badge indicators
   - Checkboxes for multi-select

5. **Brand Filter**
   - Popular brand checkboxes
   - Multi-brand selection
   - Alphabetically organized

6. **Availability**
   - In Stock
   - Out of Stock
   - Available for Delivery

7. **Discount Filter**
   - On Sale items
   - 10%+ discount
   - 25%+ discount
   - 50%+ discount

**Filter Features:**
- Clear All button
- Collapsible sections
- Active filter count
- Persistent state
- Mobile-optimized drawer

### ✅ Sort Dropdown

**Sort Options:**
- Featured (default)
- Newest
- Best Selling
- Highest Rated
- Price: Low to High
- Price: High to Low

**Features:**
- Clean dropdown UI
- Icon indicator
- Desktop and mobile views

### ✅ Product Grid

**Layout:**
- **Desktop:** 4 columns
- **Tablet:** 3 columns
- **Mobile:** 2 columns

**Grid Features:**
- Responsive design
- Consistent spacing
- Equal card heights
- Hover effects

### ✅ Enhanced Product Cards

Each product card displays:

**Visual Elements:**
- Large product image
- Multiple image indicator (e.g., "4 images")
- Discount badge (e.g., "-31%")
- Stock status badge
- Wishlist heart icon
- Quick view eye icon

**Product Information:**
- Product name (2-line clamp)
- Vendor name with verified badge
- Star rating (visual stars)
- Review count
- Current price (large, bold)
- Original price (crossed out)

**Interactive Elements:**
- Add to Cart button
- Wishlist button (hover visible)
- Quick View button (hover visible)
- Clickable product name
- Clickable vendor name

**States:**
- In Stock (active cart button)
- Out of Stock (disabled, gray button)
- Hover effect (shadow elevation)

### ✅ Quick View Modal

Triggered by clicking the eye icon on product cards.

**Displays:**
- Large product image
- Product name
- Vendor name with verification
- Star rating and reviews
- Price and discount
- Stock status badge
- Product description
- Add to Cart button
- Add to Wishlist button
- Link to full product page

**Features:**
- Modal overlay
- Close button
- Responsive layout (2-column on desktop)
- Click outside to close
- Smooth animations

### ✅ Pagination

**Elements:**
- Previous/Next buttons
- Numbered page buttons
- Current page highlighting
- Ellipsis for large page counts
- First/last page shortcuts

**Example:**
```
← Previous  1 ... 3 4 [5] 6 7 ... 1318  Next →
```

**Features:**
- Smart pagination (shows relevant pages)
- Disabled states
- Hover effects
- Keyboard accessible

### ✅ Empty State

Shown when no products match filters.

**Displays:**
- Large icon
- "No Products Found" message
- Helpful description
- Clear Filters button

### ✅ Mobile Experience

**Mobile Filter/Sort Bar:**
- Sticky at top
- Filter button (opens drawer)
- Sort button (opens dropdown)
- Side-by-side layout

**Mobile Filter Sheet:**
- Slides from bottom
- Full-height drawer
- All filter options
- Apply/Clear buttons at bottom
- Swipe to dismiss

**Mobile Product Grid:**
- 2 columns
- Touch-friendly spacing
- Optimized card size
- Fast tap interactions

## Component Architecture

### Page Components

1. **ProductsPage** (`app/products/page.tsx`)
   - Main page layout
   - State management
   - Desktop/mobile views

2. **Breadcrumb** (`components/products/breadcrumb.tsx`)
   - Navigation path display
   - Props: items array

3. **CategoryMenu** (`components/products/category-menu.tsx`)
   - Horizontal category bar
   - Active category state

4. **FilterSidebar** (`components/products/filter-sidebar.tsx`)
   - All filter sections
   - Collapsible UI
   - State management

5. **SortDropdown** (`components/products/sort-dropdown.tsx`)
   - Sort options selector
   - Icon + dropdown

6. **ProductCard** (`components/products/product-card.tsx`)
   - Individual product display
   - Multiple states
   - Interactive elements

7. **ProductGrid** (`components/products/product-grid.tsx`)
   - Product card layout
   - Responsive grid
   - Product data

8. **Pagination** (`components/products/pagination.tsx`)
   - Page navigation
   - Smart page display

9. **MobileFilterSheet** (`components/products/mobile-filter-sheet.tsx`)
   - Mobile filter drawer
   - Sheet component wrapper

10. **QuickViewModal** (`components/products/quick-view-modal.tsx`)
    - Product preview modal
    - Full product info

11. **EmptyState** (`components/products/empty-state.tsx`)
    - No results display
    - Clear action button

## UI Components Used

- **Button** - Actions and navigation
- **Card** - Product containers
- **Badge** - Status indicators
- **Input** - Price range inputs
- **Select** - Sort dropdown
- **Checkbox** - Filter selections
- **Slider** - Price range slider
- **Sheet** - Mobile filter drawer

## State Management

### Current Implementation
- React useState for local state
- Component-level state management
- Props passing for shared state

### Future Enhancements
- URL query params for filters
- Persistent filter state
- API integration
- Real-time product updates

## Responsive Breakpoints

```
Mobile:    < 640px   (2 columns)
Tablet:    640-1024px (3 columns)
Desktop:   > 1024px   (4 columns, sidebar visible)
```

## Performance Optimizations

1. **Lazy Loading**
   - Product images
   - Infinite scroll option
   - On-demand filter loading

2. **Code Splitting**
   - Modal components
   - Filter drawer
   - Route-based splitting

3. **Optimization Tips**
   - Use Next.js Image component
   - Implement virtual scrolling for large lists
   - Cache filter results
   - Debounce search inputs
   - Optimize re-renders

## Accessibility

✅ **Keyboard Navigation**
- Tab through filters
- Enter to select
- Escape to close modals

✅ **Screen Readers**
- Semantic HTML
- ARIA labels
- Alt text for images

✅ **Focus Management**
- Visible focus states
- Logical tab order
- Focus trap in modals

## API Integration Guide

### Expected API Endpoints

```typescript
// Get products with filters
GET /api/products?
  category=electronics&
  minPrice=0&
  maxPrice=1000&
  rating=4&
  vendor=techstore&
  sort=price-low&
  page=1&
  limit=20

// Response
{
  products: Product[],
  total: number,
  page: number,
  pages: number,
  filters: {
    categories: Category[],
    brands: string[],
    vendors: Vendor[],
    priceRange: { min: number, max: number }
  }
}
```

### Product Type

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  vendor: {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
  };
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
  brand: string;
}
```

## Customization Guide

### Colors
Edit `tailwind.config.ts`:
```typescript
primary: '#16A34A', // Change to your brand color
```

### Product Grid Columns
Edit `components/products/product-grid.tsx`:
```tsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
// Change xl:grid-cols-5 for 5 columns on large screens
```

### Filter Options
Edit `components/products/filter-sidebar.tsx` to add/remove filter sections.

### Sort Options
Edit `components/products/sort-dropdown.tsx` to modify sorting methods.

## Testing Checklist

- [ ] Filter products by category
- [ ] Adjust price range slider
- [ ] Select rating filter
- [ ] Apply multiple filters
- [ ] Clear all filters
- [ ] Sort products
- [ ] Navigate pages
- [ ] Click Quick View
- [ ] Add to cart from grid
- [ ] Add to cart from modal
- [ ] Mobile filter drawer opens
- [ ] Mobile sort works
- [ ] Responsive grid layout
- [ ] Empty state displays
- [ ] Breadcrumb navigation
- [ ] Category menu scroll
- [ ] Hover effects work

## Known Limitations

1. **Static Data**
   - Currently using mock product data
   - Need backend integration

2. **Filter State**
   - Not persisted in URL
   - Lost on page refresh

3. **Images**
   - Using gradient placeholders
   - Need real product images

## Future Enhancements

1. **Advanced Features**
   - Save filters as preset
   - Compare products
   - Bulk actions
   - Product recommendations
   - Recently viewed products

2. **Performance**
   - Infinite scroll
   - Virtual list rendering
   - Image optimization
   - CDN integration

3. **UX Improvements**
   - Filter suggestions
   - Auto-complete search
   - Visual filter preview
   - Drag-to-compare

4. **Analytics**
   - Track filter usage
   - Popular products
   - Conversion tracking
   - A/B testing

## Support

For issues or questions about the products page, refer to:
- Main README.md
- SETUP.md for development setup
- Component source code comments

---

**Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui**
