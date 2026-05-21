"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/icon";
import RoomCard from "@/components/room-card";
import RoomImage from "@/components/room-image";
import type { Room } from "@/lib/rooms";
import { siteContent } from "@/lib/site-content";

const bedTypes = ["1 King", "1 Queen", "2 Queen"] as const;
const roomTypes = ["Suite", "Deluxe", "Premium"] as const;
const amenityOptions = [
  "A/C",
  "Wi-Fi",
  "Mini Bar",
  "Balcony",
  "Bathtub",
] as const;
const viewTypes = ["City View", "Garden View", "Pool View"] as const;

function FilterPanel({
  searchTerm,
  checkIn,
  checkOut,
  priceRange,
  maxGuests,
  selectedBedType,
  selectedRoomType,
  selectedAmenities,
  selectedViewType,
  onCheckInChange,
  onCheckOutChange,
  onSearchTermChange,
  onPriceRangeChange,
  onMaxGuestsChange,
  onBedTypeChange,
  onRoomTypeChange,
  onViewTypeChange,
  onAmenityToggle,
  onReset,
  onClose,
}: {
  searchTerm: string;
  checkIn: string;
  checkOut: string;
  priceRange: [number, number];
  maxGuests: number;
  selectedBedType: string;
  selectedRoomType: string;
  selectedAmenities: string[];
  selectedViewType: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onSearchTermChange?: (value: string) => void;
  onPriceRangeChange: (value: number) => void;
  onMaxGuestsChange: (value: number) => void;
  onBedTypeChange: (value: string) => void;
  onRoomTypeChange: (value: string) => void;
  onViewTypeChange: (value: string) => void;
  onAmenityToggle: (amenity: string) => void;
  onReset: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] text-[#8b4513] text-[12px] tracking-[1.2px] uppercase">
          <p className="leading-[16px]">FILTER ROOMS</p>
        </div>
        {onClose ? (
          <button
            aria-label="Close filters"
            className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-surface-container text-outline-clay hover:text-primary hover:border-primary transition-colors"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" className="text-[26px]" />
          </button>
        ) : null}
      </div>

      <div>
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[14px] mb-[12px]">
          <p className="leading-[20px]">Search Rooms</p>
        </div>
        <input
          className="w-full bg-white border border-[#f0eded] px-[12px] py-[8px] font-['Montserrat:Regular',sans-serif] text-[14px] text-[#2f2f2f]"
          onChange={(event) => onSearchTermChange?.(event.target.value)}
          placeholder="Search by room name, type, or description"
          value={searchTerm}
        />
      </div>

      <div>
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[14px] mb-[12px]">
          <p className="leading-[20px]">Date Range</p>
        </div>
        <div className="grid grid-cols-1 gap-[8px]">
          <div className="flex flex-col">
            <label className="font-label-micro text-outline-clay uppercase font-bold text-[10px] mb-1">
              Check-in
            </label>
            <input
              className="w-full bg-white border border-[#f0eded] px-[12px] py-[8px] font-['Montserrat:Regular',sans-serif] text-[14px] text-[#2f2f2f]"
              onChange={(event) => onCheckInChange(event.target.value)}
              type="date"
              value={checkIn}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-label-micro text-outline-clay uppercase font-bold text-[10px] mb-1">
              Check-out
            </label>
            <input
              className="w-full bg-white border border-[#f0eded] px-[12px] py-[8px] font-['Montserrat:Regular',sans-serif] text-[14px] text-[#2f2f2f]"
              onChange={(event) => onCheckOutChange(event.target.value)}
              type="date"
              value={checkOut}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[14px] mb-[12px]">
          <p className="leading-[20px]">Price Range</p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <input
            className="w-full h-[4px] bg-[#f0eded] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[16px] [&::-webkit-slider-thumb]:h-[16px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4a1e00] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-[16px] [&::-moz-range-thumb]:h-[16px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4a1e00] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            max="1000"
            min="0"
            onChange={(event) =>
              onPriceRangeChange(Number.parseInt(event.target.value, 10))
            }
            step="50"
            type="range"
            value={priceRange[1]}
            style={{
              background: `linear-gradient(to right, #4a1e00 0%, #4a1e00 ${(priceRange[1] / 1000) * 100}%, #f0eded ${(priceRange[1] / 1000) * 100}%, #f0eded 100%)`,
            }}
          />
          <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] text-[#54433b] text-[12px]">
            <p className="leading-[16px]">
              GHS {priceRange[0]} - GHS {priceRange[1]}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[14px] mb-[12px]">
          <p className="leading-[20px]">Max Guests</p>
        </div>
        <select
          className="w-full bg-white border border-[#f0eded] px-[12px] py-[8px] font-['Montserrat:Regular',sans-serif] text-[14px] text-[#2f2f2f]"
          onChange={(event) =>
            onMaxGuestsChange(Number.parseInt(event.target.value, 10))
          }
          value={maxGuests}
        >
          <option value={1}>1 Guest</option>
          <option value={2}>2 Guests</option>
          <option value={3}>3 Guests</option>
          <option value={4}>4+ Guests</option>
        </select>
      </div>

      <div>
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[14px] mb-[12px]">
          <p className="leading-[20px]">Bed Type</p>
        </div>
        <div className="flex flex-col gap-[8px]">
          {bedTypes.map((bed) => (
            <label
              className="flex items-center gap-[8px] cursor-pointer"
              key={bed}
            >
              <input
                checked={selectedBedType === bed}
                className="w-[16px] h-[16px]"
                name="bedType"
                onChange={(event) => onBedTypeChange(event.target.value)}
                type="radio"
                value={bed}
              />
              <span className="font-['Montserrat:Regular',sans-serif] text-[14px] text-[#54433b]">
                {bed}
              </span>
            </label>
          ))}
          <button
            className="text-left font-['Montserrat:Regular',sans-serif] text-[12px] text-[#8b4513] underline"
            onClick={() => onBedTypeChange("")}
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      <div>
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[14px] mb-[12px]">
          <p className="leading-[20px]">Room Type</p>
        </div>
        <div className="flex flex-col gap-[8px]">
          {roomTypes.map((type) => (
            <label
              className="flex items-center gap-[8px] cursor-pointer"
              key={type}
            >
              <input
                checked={selectedRoomType === type}
                className="w-[16px] h-[16px]"
                name="roomType"
                onChange={(event) => onRoomTypeChange(event.target.value)}
                type="radio"
                value={type}
              />
              <span className="font-['Montserrat:Regular',sans-serif] text-[14px] text-[#54433b]">
                {type}
              </span>
            </label>
          ))}
          <button
            className="text-left font-['Montserrat:Regular',sans-serif] text-[12px] text-[#8b4513] underline"
            onClick={() => onRoomTypeChange("")}
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      <div>
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[14px] mb-[12px]">
          <p className="leading-[20px]">Amenities</p>
        </div>
        <div className="flex flex-col gap-[8px]">
          {amenityOptions.map((amenity) => (
            <label
              className="flex items-center gap-[8px] cursor-pointer"
              key={amenity}
            >
              <input
                checked={selectedAmenities.includes(amenity)}
                className="w-[16px] h-[16px]"
                onChange={() => onAmenityToggle(amenity)}
                type="checkbox"
              />
              <span className="font-['Montserrat:Regular',sans-serif] text-[14px] text-[#54433b]">
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[14px] mb-[12px]">
          <p className="leading-[20px]">View Type</p>
        </div>
        <div className="flex flex-col gap-[8px]">
          {viewTypes.map((view) => (
            <label
              className="flex items-center gap-[8px] cursor-pointer"
              key={view}
            >
              <input
                checked={selectedViewType === view}
                className="w-[16px] h-[16px]"
                name="viewType"
                onChange={(event) => onViewTypeChange(event.target.value)}
                type="radio"
                value={view}
              />
              <span className="font-['Montserrat:Regular',sans-serif] text-[14px] text-[#54433b]">
                {view}
              </span>
            </label>
          ))}
          <button
            className="text-left font-['Montserrat:Regular',sans-serif] text-[12px] text-[#8b4513] underline"
            onClick={() => onViewTypeChange("")}
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      <button
        className="bg-[#4a1e00] content-stretch flex flex-col items-center justify-center px-[16px] py-[12px] relative shrink-0 cursor-pointer hover:bg-[#6b2f00] transition-colors"
        onClick={onReset}
        type="button"
      >
        <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[10px] text-center text-white uppercase whitespace-nowrap">
          <p className="leading-[14px]">CLEAR ALL FILTERS</p>
        </div>
      </button>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const renderPageButton = (pageNum: number) => {
    const isActive = pageNum === currentPage;

    return (
      <button
        key={pageNum}
        className={`content-stretch flex items-center justify-center p-px relative shrink-0 size-[40px] ${
          isActive ? "bg-[rgba(74,30,0,0.05)]" : ""
        }`}
        onClick={() => onPageChange(pageNum)}
        type="button"
      >
        <div
          aria-hidden="true"
          className={`absolute border border-solid inset-0 pointer-events-none ${
            isActive ? "border-[#4a1e00]" : "border-[#f0eded]"
          }`}
        />
        <div
          className={`flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center whitespace-nowrap ${
            isActive
              ? "font-['Nimbus_Sans:Bold',sans-serif] text-[#4a1e00]"
              : "font-['Nimbus_Sans:Regular',sans-serif] text-[#2f2f2f]"
          }`}
        >
          <p className="leading-[24px]">{pageNum}</p>
        </div>
      </button>
    );
  };

  return (
    <div
      className="content-stretch flex gap-[8px] items-center justify-center relative size-full"
      data-name="Pagination"
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) =>
        renderPageButton(pageNum),
      )}
      {currentPage < totalPages && (
        <button
          className="content-stretch flex h-[40px] items-center justify-center pb-[12.5px] pt-[11.5px] px-[17px] relative shrink-0"
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          <div
            aria-hidden="true"
            className="absolute border border-[#f0eded] border-solid inset-0 pointer-events-none"
          />
          <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#2f2f2f] text-[12px] text-center uppercase whitespace-nowrap">
            <p className="leading-[16px]">NEXT</p>
          </div>
        </button>
      )}
    </div>
  );
}

export default function RoomCatalog({
  initialFilters,
  rooms,
}: {
  initialFilters?: {
    checkIn?: string;
    checkOut?: string;
    maxGuests?: number;
    searchTerm?: string;
    selectedBedType?: string;
    selectedRoomType?: string;
    selectedViewType?: string;
  };
  rooms: readonly Room[];
}) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchTerm, setSearchTerm] = useState(
    initialFilters?.searchTerm ?? "",
  );
  const [checkIn, setCheckIn] = useState(initialFilters?.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(initialFilters?.checkOut ?? "");
  const [selectedBedType, setSelectedBedType] = useState<string>(
    initialFilters?.selectedBedType ?? "",
  );
  const [selectedRoomType, setSelectedRoomType] = useState<string>(
    initialFilters?.selectedRoomType ?? "",
  );
  const [maxGuests, setMaxGuests] = useState<number>(
    initialFilters?.maxGuests ?? 1,
  );
  const [selectedViewType, setSelectedViewType] = useState<string>(
    initialFilters?.selectedViewType ?? "",
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const roomsPerPage = 6;

  const filteredRooms = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return rooms.filter((room) => {
      if (
        normalizedSearch &&
        ![
          room.name,
          room.description,
          room.roomType,
          room.bedType,
          room.viewType,
          ...room.amenities,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      ) {
        return false;
      }
      if (room.priceValue < priceRange[0] || room.priceValue > priceRange[1]) {
        return false;
      }
      if (selectedBedType && room.bedType !== selectedBedType) return false;
      if (selectedRoomType && room.roomType !== selectedRoomType) return false;
      if (room.maxGuests < maxGuests) return false;
      if (selectedViewType && room.viewType !== selectedViewType) return false;
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((amenity) => room.amenities.includes(amenity))
      ) {
        return false;
      }
      return true;
    });
  }, [
    rooms,
    priceRange,
    selectedBedType,
    selectedRoomType,
    maxGuests,
    selectedViewType,
    selectedAmenities,
    searchTerm,
  ]);

  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage,
  );

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSearchTerm("");
    setCheckIn("");
    setCheckOut("");
    setSelectedBedType("");
    setSelectedRoomType("");
    setMaxGuests(1);
    setSelectedViewType("");
    setSelectedAmenities([]);
    setCurrentPage(1);
  };

  const updatePriceRange = (value: number) => {
    setPriceRange([0, value]);
    setCurrentPage(1);
  };

  const updateCheckIn = (value: string) => {
    setCheckIn(value);
    setCurrentPage(1);
  };

  const updateSearchTerm = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const updateCheckOut = (value: string) => {
    setCheckOut(value);
    setCurrentPage(1);
  };

  const updateMaxGuests = (value: number) => {
    setMaxGuests(value);
    setCurrentPage(1);
  };

  const updateBedType = (value: string) => {
    setSelectedBedType(value);
    setCurrentPage(1);
  };

  const updateRoomType = (value: string) => {
    setSelectedRoomType(value);
    setCurrentPage(1);
  };

  const updateViewType = (value: string) => {
    setSelectedViewType(value);
    setCurrentPage(1);
  };

  return (
    <>
      <section className="relative py-[72px] md:py-[80px] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <RoomImage
            alt="Hero background"
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={rooms[0]?.image ?? siteContent.home.hero.imageSrc}
          />
        </div>
        <div className="absolute inset-0 bg-[#6c2f00]/90 mix-blend-multiply" />
        <div className="max-w-[1152px] mx-auto px-[24px] relative z-10">
          <div className="flex flex-col gap-3 items-center mb-[24px]">
            <div className="bg-[rgba(238,220,130,0.9)] content-stretch flex items-start justify-center px-[16px] py-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0">
              <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] shrink-0 text-[#2f2f2f] text-[10px] text-center tracking-[1px] uppercase whitespace-nowrap">
                <p className="leading-[15px]">AVAILABLE LODGINGS</p>
              </div>
            </div>
            <div className="content-stretch drop-shadow-[0px_4px_1.5px_rgba(0,0,0,0.1),0px_10px_4px_rgba(0,0,0,0.04)] flex flex-col items-center shrink-0 max-w-4xl">
              <div className="flex flex-col font-['Eczar:Bold',sans-serif] font-bold justify-center leading-[0] shrink-0 text-[40px] sm:text-[48px] md:text-[56px] text-center text-white">
                <p className="leading-[1.05]">{siteContent.rooms.heroTitle}</p>
              </div>
            </div>
            <div className="content-stretch drop-shadow-[0px_2px_1px_rgba(0,0,0,0.06),0px_4px_1.5px_rgba(0,0,0,0.07)] flex flex-col items-center max-w-[672px] shrink-0">
              <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center leading-[0] shrink-0 text-[15px] md:text-[16px] text-center text-white">
                <p className="leading-[24px] mb-0">
                  {siteContent.rooms.heroDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1152px] mx-auto px-[24px] py-[56px] md:py-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          <div className="lg:hidden flex items-center justify-between gap-3">
            <button
              className="bg-[#4a1e00] text-white px-4 py-3 font-label-caps text-[11px] font-bold uppercase tracking-widest"
              onClick={() => setIsFiltersOpen(true)}
              type="button"
            >
              Filters
            </button>
            <button
              className="border border-surface-container px-4 py-3 font-label-caps text-[11px] font-bold uppercase tracking-widest text-charred-wood"
              onClick={resetFilters}
              type="button"
            >
              Reset
            </button>
          </div>

          <aside className="hidden lg:block bg-white border border-[#f0eded] p-[24px] h-fit sticky top-[24px]">
            <FilterPanel
              searchTerm={searchTerm}
              checkIn={checkIn}
              checkOut={checkOut}
              maxGuests={maxGuests}
              onAmenityToggle={toggleAmenity}
              onBedTypeChange={updateBedType}
              onCheckInChange={updateCheckIn}
              onCheckOutChange={updateCheckOut}
              onSearchTermChange={updateSearchTerm}
              onMaxGuestsChange={updateMaxGuests}
              onPriceRangeChange={updatePriceRange}
              onReset={resetFilters}
              onRoomTypeChange={updateRoomType}
              onViewTypeChange={updateViewType}
              priceRange={priceRange}
              selectedAmenities={selectedAmenities}
              selectedBedType={selectedBedType}
              selectedRoomType={selectedRoomType}
              selectedViewType={selectedViewType}
            />
          </aside>

          <div className="flex flex-col gap-8 md:gap-12">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic text-[#2f2f2f] text-[16px]">
                <p className="leading-[24px]">
                  {filteredRooms.length} Rooms Available
                </p>
              </div>
              <p className="lg:hidden text-[12px] text-outline-clay font-body-md">
                Use filters to narrow the list for mobile browsing.
              </p>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="bg-white border border-[#f0eded] p-[48px] text-center">
                <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] text-[#54433b] text-[16px]">
                  <p className="leading-[24px] mb-0">
                    No rooms match your current filters.
                  </p>
                  <p className="leading-[24px]">
                    Please adjust your search criteria.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-[32px]">
                  {paginatedRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    totalPages={totalPages}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {isFiltersOpen ? (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <button
            aria-label="Close filters"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsFiltersOpen(false)}
            type="button"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-white shadow-2xl">
            <div className="p-6 pt-5">
              <FilterPanel
                searchTerm={searchTerm}
                checkIn={checkIn}
                checkOut={checkOut}
                maxGuests={maxGuests}
                onAmenityToggle={toggleAmenity}
                onBedTypeChange={updateBedType}
                onCheckInChange={updateCheckIn}
                onCheckOutChange={updateCheckOut}
                onClose={() => setIsFiltersOpen(false)}
                onSearchTermChange={updateSearchTerm}
                onMaxGuestsChange={updateMaxGuests}
                onPriceRangeChange={updatePriceRange}
                onReset={resetFilters}
                onRoomTypeChange={updateRoomType}
                onViewTypeChange={updateViewType}
                priceRange={priceRange}
                selectedAmenities={selectedAmenities}
                selectedBedType={selectedBedType}
                selectedRoomType={selectedRoomType}
                selectedViewType={selectedViewType}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
