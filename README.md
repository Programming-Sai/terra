<p align="center">
  <a href="https://terra-amber-omega.vercel.app/" target="_blank" rel="noopener noreferrer">
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

Terra Lodge is a Next.js 16 App Router hotel/lodge experience built for a calm, premium booking flow. The app includes a redesigned home page, reusable room listings, detailed room pages, a checkout flow with Paystack integration, contact/about pages, a shared icon system, centralized availability search behavior across the site, and a protected admin area for managing rooms, bookings, customers, payments, and settings.

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
- Neon/Postgres data layer
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
- [app/admin/layout.tsx](app/admin/layout.tsx) defines the admin route shell.
- [app/admin/page.tsx](app/admin/page.tsx) redirects `/admin` to the dashboard.
- [app/admin/login/page.tsx](app/admin/login/page.tsx) renders the standalone admin login screen.
- [app/admin/dashboard/page.tsx](app/admin/dashboard/page.tsx) renders the admin dashboard.
- [app/admin/bookings/page.tsx](app/admin/bookings/page.tsx) renders the bookings manager.
- [app/admin/customers/page.tsx](app/admin/customers/page.tsx) renders the customers manager.
- [app/admin/payments/page.tsx](app/admin/payments/page.tsx) renders the payments manager.
- [app/admin/rooms/page.tsx](app/admin/rooms/page.tsx) renders the room inventory manager.
- [app/admin/settings/page.tsx](app/admin/settings/page.tsx) renders the admin settings screen.
- [components/admin/admin-shell.tsx](components/admin/admin-shell.tsx) contains the responsive admin shell and protected navigation.
- [components/admin/admin-dashboard-view.tsx](components/admin/admin-dashboard-view.tsx) contains the admin dashboard charts and tables.
- [components/admin/admin-bookings-view.tsx](components/admin/admin-bookings-view.tsx) contains the bookings manager UI.
- [components/admin/admin-customers-view.tsx](components/admin/admin-customers-view.tsx) contains the customers manager UI.
- [components/admin/admin-payments-view.tsx](components/admin/admin-payments-view.tsx) contains the payments manager UI.
- [components/admin/admin-rooms-view.tsx](components/admin/admin-rooms-view.tsx) contains the room editor, image ordering, tag inputs, and room CRUD UI.
- [components/admin/admin-settings-view.tsx](components/admin/admin-settings-view.tsx) contains the admin settings UI.
- [components/admin/admin-pagination.tsx](components/admin/admin-pagination.tsx) contains the reusable admin pagination controls.
- [lib/rooms.ts](lib/rooms.ts) contains the centralized room inventory and stock image URLs.
- [lib/admin-auth.ts](lib/admin-auth.ts) contains the admin session helpers and env-based login credentials.
- [lib/admin-data.ts](lib/admin-data.ts) contains the data shaping layer for the admin dashboard and lists.
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

## Admin Area

The admin area is available under `/admin` and uses a protected route shell.

- `/admin/login` is a standalone login page.
- `/admin/dashboard` shows live revenue, booking, occupancy, and recent booking data.
- `/admin/bookings` manages bookings with filters, pagination, and detail modals.
- `/admin/customers` derives customer records from booking history.
- `/admin/payments` derives payment rows from booking/payment states and references.
- `/admin/rooms` provides room create/edit/delete flows, image ordering, tag inputs, and structured metadata fields.
- `/admin/settings` provides operational settings UI with low-friction persistence for the current build.

Admin auth is env-driven:

- `ADMIN_LOGIN_EMAIL`
- `ADMIN_LOGIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Room image uploads are currently stored as URL or base64 strings in Neon, and the room editor enforces a configurable image cap via:

- `NEXT_PUBLIC_MAX_ROOM_IMAGES`

Customer status is derived from booking history:

- `Active` if the customer has recent booking activity
- `VIP` if booking count or spend crosses the configured threshold in the data layer
- `Inactive` if the customer has not booked for a longer period

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

Room images created in the admin editor are stored as ordered URL or base64 strings in the room record, so the first image acts as the main image and the rest remain in gallery order.

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

The current app expects these environment variables:

- `NEON_URL`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_KEY`
- `RESEND_ME`
- `ADMIN_LOGIN_EMAIL`
- `ADMIN_LOGIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_MAX_ROOM_IMAGES`

Set them in `.env` or `.env.local` for local development.

Example:

```bash
NEON_URL=postgresql://username:password@your-neon-host.neon.tech/your_database?sslmode=require
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_KEY=re_xxx
RESEND_ME=onboarding@resend.dev
ADMIN_LOGIN_EMAIL=admin@terrasanta.com
ADMIN_LOGIN_PASSWORD=TerraSanta@2026
ADMIN_SESSION_SECRET=terra-lodge-admin-session-secret
NEXT_PUBLIC_MAX_ROOM_IMAGES=6
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
