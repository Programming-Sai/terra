export type RoomFeature = {
  label: string;
  icon: string;
};

export type Room = {
  id: string | number;
  slug: string;
  name: string;
  priceValue: number;
  image: string;
  gallery: string[];
  alt: string;
  bedType: string;
  maxGuests: number;
  roomType: "Suite" | "Deluxe" | "Premium";
  amenities: string[];
  viewType: "City View" | "Garden View" | "Pool View";
  size: string;
  cancellationPolicy: string;
  features: RoomFeature[];
  description: string;
};

const stockImages = {
  bedroom:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  bathroom:
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  living:
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
  suite:
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
  balcony:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
};

export const roomInventory: Room[] = [
  {
    id: 1,
    slug: "the-silt-suite",
    name: "The Silt Suite",
    priceValue: 650,
    image: stockImages.bedroom,
    gallery: [stockImages.bedroom, stockImages.bathroom, stockImages.living],
    alt: "Cozy bedroom with warm bedding",
    bedType: "1 King",
    maxGuests: 2,
    roomType: "Suite",
    amenities: ["A/C", "Wi-Fi", "Mini Bar"],
    viewType: "City View",
    size: "35 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "1 King", icon: "bed" },
      { label: "A/C", icon: "ac_unit" },
      { label: "Wi-Fi", icon: "wifi" },
    ],
    description:
      "Standard suite with city views, featuring high-quality linens and a desk area.",
  },
  {
    id: 2,
    slug: "modern-retreat",
    name: "Modern Retreat",
    priceValue: 750,
    image: stockImages.bathroom,
    gallery: [stockImages.bathroom, stockImages.suite, stockImages.living],
    alt: "Elegant bathroom with stone finishes",
    bedType: "1 Queen",
    maxGuests: 2,
    roomType: "Suite",
    amenities: ["A/C", "Wi-Fi", "Bathtub"],
    viewType: "Garden View",
    size: "38 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "1 Queen", icon: "bed" },
      { label: "Bathtub", icon: "bathtub" },
      { label: "Wi-Fi", icon: "wifi" },
    ],
    description:
      "Elegant suite with stone finishes and modern amenities for ultimate comfort.",
  },
  {
    id: 3,
    slug: "spacious-living",
    name: "Spacious Living",
    priceValue: 850,
    image: stockImages.living,
    gallery: [stockImages.living, stockImages.bedroom, stockImages.balcony],
    alt: "Spacious living area in a suite",
    bedType: "2 Queen",
    maxGuests: 4,
    roomType: "Deluxe",
    amenities: ["A/C", "Wi-Fi", "Living Area", "Mini Bar"],
    viewType: "Garden View",
    size: "48 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "2 Queen", icon: "bed" },
      { label: "Living Area", icon: "weekend" },
      { label: "Mini Bar", icon: "local_bar" },
    ],
    description:
      "Spacious suite with separate living area, perfect for families or extended stays.",
  },
  {
    id: 4,
    slug: "silt-suite-ii",
    name: "Silt Suite II",
    priceValue: 700,
    image: stockImages.suite,
    gallery: [stockImages.suite, stockImages.bedroom, stockImages.bathroom],
    alt: "Modern suite with comfortable bedding",
    bedType: "1 King",
    maxGuests: 2,
    roomType: "Suite",
    amenities: ["A/C", "Wi-Fi", "Desk"],
    viewType: "City View",
    size: "36 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "1 King", icon: "bed" },
      { label: "Desk", icon: "desk" },
      { label: "Wi-Fi", icon: "wifi" },
    ],
    description:
      "Comfortable suite with modern furnishings and excellent city views.",
  },
  {
    id: 5,
    slug: "basalt-retreat",
    name: "Basalt Retreat",
    priceValue: 900,
    image: stockImages.balcony,
    gallery: [stockImages.balcony, stockImages.bathroom, stockImages.suite],
    alt: "Suite with balcony and outdoor light",
    bedType: "1 King",
    maxGuests: 2,
    roomType: "Premium",
    amenities: ["A/C", "Wi-Fi", "Mini Bar", "Balcony"],
    viewType: "Pool View",
    size: "42 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "1 King", icon: "bed" },
      { label: "Balcony", icon: "balcony" },
      { label: "Mini Bar", icon: "local_bar" },
    ],
    description:
      "Premium suite with private balcony overlooking the pool area.",
  },
  {
    id: 6,
    slug: "lodge-suite",
    name: "Lodge Suite",
    priceValue: 800,
    image: stockImages.bedroom,
    gallery: [stockImages.bedroom, stockImages.suite, stockImages.living],
    alt: "Warm lodge-style bedroom",
    bedType: "1 King",
    maxGuests: 2,
    roomType: "Deluxe",
    amenities: ["A/C", "Wi-Fi", "Mini Bar", "Sitting Area"],
    viewType: "Garden View",
    size: "40 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "1 King", icon: "bed" },
      { label: "Sitting Area", icon: "weekend" },
      { label: "Mini Bar", icon: "local_bar" },
    ],
    description:
      "Deluxe suite with traditional lodge aesthetics and modern comfort.",
  },
  {
    id: 7,
    slug: "terrace-twin",
    name: "Terrace Twin",
    priceValue: 720,
    image: stockImages.balcony,
    gallery: [stockImages.balcony, stockImages.living, stockImages.suite],
    alt: "Twin room with terrace access",
    bedType: "2 Queen",
    maxGuests: 4,
    roomType: "Suite",
    amenities: ["A/C", "Wi-Fi", "Mini Bar", "Balcony"],
    viewType: "City View",
    size: "44 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "2 Queen", icon: "bed" },
      { label: "Balcony", icon: "balcony" },
      { label: "Wi-Fi", icon: "wifi" },
    ],
    description:
      "Twin layout with a small terrace, ideal for travel companions or longer city stays.",
  },
  {
    id: 8,
    slug: "travelling-executive",
    name: "Travelling Executive",
    priceValue: 980,
    image: stockImages.bathroom,
    gallery: [stockImages.bathroom, stockImages.suite, stockImages.bedroom],
    alt: "Executive suite with premium finishes",
    bedType: "1 Queen",
    maxGuests: 2,
    roomType: "Premium",
    amenities: ["A/C", "Wi-Fi", "Bathtub", "Desk"],
    viewType: "Pool View",
    size: "39 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "1 Queen", icon: "bed" },
      { label: "Bathtub", icon: "bathtub" },
      { label: "Desk", icon: "desk" },
    ],
    description:
      "Premium room with refined finishes and a workspace built for business travelers.",
  },
  {
    id: 9,
    slug: "horizon-family",
    name: "Horizon Family",
    priceValue: 950,
    image: stockImages.living,
    gallery: [stockImages.living, stockImages.balcony, stockImages.bedroom],
    alt: "Large family living suite",
    bedType: "2 Queen",
    maxGuests: 4,
    roomType: "Deluxe",
    amenities: ["A/C", "Wi-Fi", "Living Area", "Balcony"],
    viewType: "Garden View",
    size: "52 sqm",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    features: [
      { label: "2 Queen", icon: "bed" },
      { label: "Living Area", icon: "weekend" },
      { label: "Balcony", icon: "balcony" },
    ],
    description:
      "A larger family-friendly suite with room to relax, gather, and unwind.",
  },
];
