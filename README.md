<p align="center">
  <a href="https://terra.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img
      src="https://raw.githubusercontent.com/Programming-Sai/terra/snapmock/output_laptop.png"
      srcset="
        https://raw.githubusercontent.com/Programming-Sai/terra/snapmock/output_mobile.png  767w,
        https://raw.githubusercontent.com/Programming-Sai/terra/snapmock/output_tablet.png 1023w,
        https://raw.githubusercontent.com/Programming-Sai/terra/snapmock/output_laptop.png 1280w
      "
      sizes="(max-width: 767px) 100vw,
             (max-width: 1023px) 80vw,
             60vw"
      alt="Terra Preview"
      style="width:100%; height:auto;"
    />
  </a>
</p>

# Terra Lodge

Terra Lodge is a Next.js 16 App Router hotel/lodge experience built for a calm, premium booking flow. The app includes a redesigned home page, reusable room listings, detailed room pages, a checkout flow with UI-only payment states, contact/about pages, a shared icon system, and centralized availability search behavior across the site.

## What This Project Includes

- A Terra Lodge branded landing page with:
  - hero section
  - availability search
  - amenities
  - featured rooms
  - testimonials
  - location map
- Dedicated content pages:
  - About
  - Rooms
  - Room detail
  - Checkout
  - Contact
- Shared layout shell with:
  - responsive header
  - footer
  - floating action button
- Centralized reusable UI:
  - room cards
  - room catalog
  - room detail view
  - checkout view
  - availability search widget
  - icon component
- Remote image support for:
  - Googleusercontent hero/section images
  - Unsplash room imagery
- URL-driven booking state:
  - room search filters can be prefilled from query params
  - checkout feedback modals can be opened from the URL
- Development-only test checkout outcomes:
  - success
  - failure
  - cancellation

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase client setup
- `@fontsource/material-symbols-outlined` for the shared icon system
- `react-datepicker` available in the project dependencies

## Project Structure

- [app/layout.tsx](app/layout.tsx) defines the shared app shell, metadata, header, footer, FAB, and global icon font import.
- [app/page.tsx](app/page.tsx) is the Terra Lodge home page.
- [app/about/page.tsx](app/about/page.tsx) is the about page.
- [app/contact/page.tsx](app/contact/page.tsx) is the contact page.
- [app/rooms/page.tsx](app/rooms/page.tsx) renders the rooms catalogue using query-string filters.
- [app/room/[roomId]/page.tsx](app/room/[roomId]/page.tsx) renders an individual room detail page.
- [app/checkout/[roomId]/page.tsx](app/checkout/[roomId]/page.tsx) renders checkout and modal feedback UI.
- [components/availability-search.tsx](components/availability-search.tsx) contains the shared availability form used in the home page, location section, and FAB modal.
- [components/fab.tsx](components/fab.tsx) contains the floating action button, check availability modal, WhatsApp shortcut, and back-to-top action.
- [components/header.tsx](components/header.tsx) contains the route-aware top navigation.
- [components/footer.tsx](components/footer.tsx) contains the shared site footer.
- [components/icon.tsx](components/icon.tsx) contains the shared Material Symbols icon wrapper.
- [components/room-card.tsx](components/room-card.tsx) contains the reusable room card with `View Details` and `Book Now`.
- [components/room-catalog.tsx](components/room-catalog.tsx) contains the rooms page catalog, filters, pagination, and availability-prefilled state.
- [components/room-detail-view.tsx](components/room-detail-view.tsx) contains the room detail gallery and booking summary UI.
- [components/checkout-view.tsx](components/checkout-view.tsx) contains the checkout page UI and the feedback modals.
- [components/home-sections.tsx](components/home-sections.tsx) contains the split home page sections.
- [lib/rooms.ts](lib/rooms.ts) contains the centralized room inventory and stock image URLs.
- [lib/supabase/client.ts](lib/supabase/client.ts) contains the browser Supabase client.
- [lib/supabase/server.ts](lib/supabase/server.ts) contains the server Supabase helper.
- [next.config.ts](next.config.ts) configures remote image hosts.
- [types/fontsource.d.ts](types/fontsource.d.ts) declares the font package module for TypeScript.

## Key Features

### Home Page

- Large hero section with a branded background image
- Shared availability search form
- Amenities section
- Featured rooms section showing the best deals
- Testimonials with rating-aware star rendering
- Location section with an embedded Google Map
- Compact availability widget beside the map

### Rooms Page

- Centralized room catalogue backed by `lib/rooms.ts`
- Filters for:
  - check-in
  - check-out
  - price range
  - guests
  - bed type
  - room type
  - amenities
  - view type
- Pagination
- Empty state when no rooms match
- Query-string prefilling from the home availability search and FAB modal

### Room Detail Page

- Large image gallery
- Thumbnail switching
- Room description
- Amenities list
- Cancellation policy
- Booking summary panel
- Link to checkout

### Checkout Page

- Booking summary
- Price breakdown
- Guest form
- Paystack-styled UI
- URL-driven feedback modals
- Development-only payment outcome selector

### Contact Page

- Contact form
- Contact information cards
- Operating hours
- Embedded map

### Shared Interaction Patterns

- The top navigation highlights the active route.
- Room cards always offer:
  - `View Details`
  - `Book Now`
- The FAB includes:
  - WhatsApp shortcut
  - `Check Availability`
  - `Back to Top`
- The `Check Availability` actions navigate to the rooms page with selected values in the URL.
- The FAB availability modal closes after navigation begins.
- Checkout feedback modals are controlled by URL params such as `?modal=success`.

## Availability Flow

The same availability values are shared across the app:

- check-in date
- check-out date
- guest count
- room type

These values are used in:

- the home page hero search
- the location-section search widget
- the FAB availability modal
- the rooms page filter prefilling

The compact widget layout is intentionally different from the full hero form:

- dates are stacked vertically
- guest and room type dropdowns sit side by side
- the submit button remains below the fields

## Checkout Modal Behavior

The checkout page supports URL-based modal states:

- `/checkout/[roomId]?modal=success`
- `/checkout/[roomId]?modal=failure`
- `/checkout/[roomId]?modal=cancellation`

In development, the checkout page also shows a test-only payment outcome selector so the UI can be exercised without a real payment provider.

## Image Handling

The app uses `next/image` and remote image optimization.

Allowed remote image hosts:

- `lh3.googleusercontent.com`
- `images.unsplash.com`

If you add another remote image source, update [next.config.ts](next.config.ts) so the host is whitelisted.

## Icon System

The app uses a centralized Material Symbols icon wrapper:

- font package imported in [app/layout.tsx](app/layout.tsx)
- wrapper component in [components/icon.tsx](components/icon.tsx)

This keeps icon usage consistent across:

- header
- footer
- availability search
- FAB
- room cards
- room detail page
- checkout page

## Environment Variables

The current code expects these Supabase environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Set them in `.env.local` for local development.

Example:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Add your environment variables to `.env.local`.

3. Start the app:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Notes

- The app shell already includes the shared header, footer, and FAB in [app/layout.tsx](app/layout.tsx).
- Room data is centralized in [lib/rooms.ts](lib/rooms.ts) so the home page, rooms page, room detail page, and checkout page stay in sync.
- The checkout flow is intentionally UI-only for now.
- The shared header is route-aware and highlights the current page.
- Tailwind editor warnings are intentionally muted in `.vscode/settings.json` for this project setup.

## Build Status

The app has been validated with:

- `npm run lint`
- `npm run build`
