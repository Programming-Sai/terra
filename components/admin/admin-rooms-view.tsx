"use client";
/* eslint-disable @next/next/no-img-element */

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import type { AdminRoomRecord } from "@/lib/admin-data";
import type { AmenityRecord } from "@/lib/amenities";
import { roomInventory } from "@/lib/rooms";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";

type RoomStatus = "Available" | "Maintenance" | "Deleted";
type CurrentOccupancy = "Vacant" | "Occupied" | "Under Maintenance" | "Deleted";

type RoomRecord = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  status: RoomStatus;
  amenities: string[];
  description: string;
  image: string;
  totalBookings: number;
  currentOccupancy: CurrentOccupancy;
};

type RoomApiRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_per_night: number;
  bed_type: string;
  max_guests: number;
  room_type: string;
  view_type: string;
  size: string;
  images: string[];
  amenities: string[];
  features: unknown[];
  cancellation_policy: string | null;
  is_active: boolean;
  availability_status: string;
  availability_blocks: unknown[];
  featured: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .flatMap((item) => {
      if (typeof item === "string") {
        return [item];
      }

      if (isRecord(item) && typeof item.label === "string") {
        return [item.label];
      }

      return [];
    })
    .map((item) => item.trim())
    .filter(Boolean);
}

type RoomFormState = {
  id: string | null;
  slug: string;
  name: string;
  description: string;
  images: string[];
  price_per_night: string;
  bed_type: string;
  max_guests: string;
  room_type: string;
  view_type: string;
  size: string;
  amenities: string[];
  features: string[];
  cancellation_policy: string;
  is_active: boolean;
  availability_status: string;
  featured: boolean;
};

const emptyRoomForm = (): RoomFormState => ({
  id: null,
  slug: "",
  name: "",
  description: "",
  images: [],
  price_per_night: "",
  bed_type: "",
  max_guests: "",
  room_type: "",
  view_type: "",
  size: "",
  amenities: [],
  features: [],
  cancellation_policy: "",
  is_active: true,
  availability_status: "available",
  featured: false,
});

const MAX_ROOM_IMAGES = Math.max(
  1,
  Number(process.env.NEXT_PUBLIC_MAX_ROOM_IMAGES ?? "6") || 6,
);

const mockRooms: RoomRecord[] = [
  {
    id: "1",
    name: "The Silt Suite",
    type: "Suite",
    capacity: 2,
    pricePerNight: 650,
    status: "Available",
    amenities: ["Wi-Fi", "Air Conditioning", "Mini Bar", "Balcony"],
    description: "Elegant suite with panoramic views of the surrounding landscape",
    image: roomInventory[0]?.image ?? "",
    totalBookings: 45,
    currentOccupancy: "Vacant",
  },
  {
    id: "2",
    name: "Basalt Retreat",
    type: "Standard",
    capacity: 2,
    pricePerNight: 500,
    status: "Available",
    amenities: ["Wi-Fi", "Air Conditioning", "Work Desk"],
    description: "Cozy room with mountain views and modern amenities",
    image: roomInventory[1]?.image ?? "",
    totalBookings: 38,
    currentOccupancy: "Occupied",
  },
  {
    id: "3",
    name: "Lodge Suite",
    type: "Family Suite",
    capacity: 4,
    pricePerNight: 800,
    status: "Available",
    amenities: ["Wi-Fi", "Air Conditioning", "Kitchenette", "Living Area"],
    description: "Spacious family accommodation with separate living area",
    image: roomInventory[2]?.image ?? "",
    totalBookings: 32,
    currentOccupancy: "Vacant",
  },
  {
    id: "4",
    name: "Premium Suite",
    type: "Premium",
    capacity: 2,
    pricePerNight: 1200,
    status: "Maintenance",
    amenities: ["Wi-Fi", "Air Conditioning", "Jacuzzi", "Private Garden"],
    description: "Luxurious suite with premium amenities and private access",
    image: roomInventory[3]?.image ?? "",
    totalBookings: 28,
    currentOccupancy: "Under Maintenance",
  },
  {
    id: "5",
    name: "Garden View",
    type: "Standard",
    capacity: 2,
    pricePerNight: 550,
    status: "Available",
    amenities: ["Wi-Fi", "Air Conditioning", "Garden View"],
    description: "Comfortable room overlooking the garden areas",
    image: roomInventory[4]?.image ?? "",
    totalBookings: 42,
    currentOccupancy: "Occupied",
  },
  {
    id: "6",
    name: "Executive Suite",
    type: "Executive",
    capacity: 3,
    pricePerNight: 950,
    status: "Available",
    amenities: ["Wi-Fi", "Air Conditioning", "Office Space", "Mini Bar"],
    description: "Perfect for business travelers with dedicated workspace",
    image: roomInventory[5]?.image ?? "",
    totalBookings: 25,
    currentOccupancy: "Vacant",
  },
];

function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <span className="font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
          Admin Management
        </span>
        <h1 className="mt-2 font-eczar text-[36px] font-bold text-charred-wood">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl font-body-md text-[14px] leading-relaxed text-on-surface-variant">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}

function MetricCard({
  value,
  label,
  accentClassName,
}: {
  value: ReactNode;
  label: string;
  accentClassName?: string;
}) {
  return (
    <div className="border border-surface-container bg-white p-6">
      <div
        className={`mb-1 font-nimbus text-[32px] font-bold ${accentClassName ?? "text-charred-wood"}`}
      >
        {value}
      </div>
      <p className="font-body-md text-[14px] text-outline-clay">{label}</p>
    </div>
  );
}

function badgeClass(status: RoomStatus) {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-green-100 text-green-800";
    case "maintenance":
      return "bg-amber-100 text-amber-800";
    case "deleted":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-surface-container text-outline-clay";
  }
}

function roomStatusFromFlags(isActive: boolean, availabilityStatus: string): RoomStatus {
  if (!isActive) {
    return "Deleted";
  }

  return availabilityStatus === "available" ? "Available" : "Maintenance";
}

function roomOccupancyFromFlags(
  isActive: boolean,
  availabilityStatus: string,
  currentOccupancy: CurrentOccupancy = "Vacant",
): CurrentOccupancy {
  if (!isActive) {
    return "Deleted";
  }

  return availabilityStatus === "available" ? currentOccupancy : "Under Maintenance";
}

function RoomModal({
  room,
  onClose,
  onEdit,
}: {
  room: RoomRecord;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-white">
        <div className="bg-primary p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-eczar text-[28px] font-bold">{room.name}</h2>
              <p className="mt-1 font-body-md text-sm">{room.type}</p>
            </div>
            <button
              aria-label="Close room details"
              className="text-white transition-colors hover:text-dry-grass"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" className="text-[28px]" />
            </button>
          </div>
        </div>

        {room.image ? (
          <div className="h-56 overflow-hidden bg-surface-bone">
            <img
              alt={`${room.name} preview`}
              className="h-full w-full object-cover"
              src={room.image}
            />
          </div>
        ) : null}

        <div className="space-y-6 p-6">
          <section>
            <h3 className="mb-4 font-eczar text-[20px] font-bold text-charred-wood">
              Description
            </h3>
            <p className="font-body-md text-[14px] leading-relaxed text-on-surface-variant">
              {room.description}
            </p>
          </section>

          <section className="border-y border-surface-container py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Capacity" value={`${room.capacity} Guests`} />
              <Detail label="Price Per Night" value={`GHS ${room.pricePerNight}`} />
              <Detail label="Status" value={room.status} />
              <Detail label="Current Occupancy" value={room.currentOccupancy} />
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-eczar text-[20px] font-bold text-charred-wood">
              Amenities
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {room.amenities.map((amenity) => (
                <div
                  className="flex items-center gap-2 font-body-md text-[14px] text-charred-wood"
                  key={amenity}
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {amenity}
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-surface-container pt-6">
            <p className="mb-1 font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
              Active Bookings
            </p>
            <div className="font-nimbus text-[32px] font-bold text-charred-wood">
              {room.totalBookings}
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-surface-container pt-6 sm:flex-row">
            <button
              className="flex-1 bg-primary px-6 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red"
              onClick={onEdit}
              type="button"
            >
              Edit Room
            </button>
            <button
              className="flex-1 border-2 border-primary bg-white px-6 py-3 font-label-caps text-sm font-bold uppercase text-primary transition-colors hover:bg-surface-bone"
              type="button"
            >
              View Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteBlockedModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[205] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl overflow-hidden bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="bg-amber-600 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-eczar text-[28px] font-bold">Delete Blocked</h2>
              <p className="mt-1 font-body-md text-sm">Room is currently occupied.</p>
            </div>
            <button
              aria-label="Close delete blocked message"
              className="text-white transition-colors hover:text-dry-grass"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" className="text-[28px]" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <p className="font-body-md text-[15px] leading-relaxed text-on-surface-variant">
            {message}
          </p>
          <div className="flex justify-end">
            <button
              className="bg-primary px-6 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
        {label}
      </p>
      <p className="font-body-md text-[14px] text-charred-wood">{value}</p>
    </div>
  );
}

function isOccupiedRoom(room: RoomRecord) {
  return room.currentOccupancy === "Occupied";
}

function InlineSpinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}

function TagInput({
  label,
  value,
  placeholder,
  helpText,
  onChange,
}: {
  label: string;
  value: string[];
  placeholder: string;
  helpText?: string;
  onChange: (nextValue: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const tags = value;

  function commitDraft() {
    const nextTag = draft.trim();

    if (!nextTag) return;

    if (!tags.some((item) => item.toLowerCase() === nextTag.toLowerCase())) {
      onChange([...tags, nextTag]);
    }

    setDraft("");
  }

  return (
    <div className="lg:col-span-2">
      <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
        {label}
      </label>
      <div className="border border-surface-container bg-white px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((item) => (
            <button
              key={item}
              className="inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1 font-body-md text-[13px] text-charred-wood transition-colors hover:bg-primary-fixed hover:text-primary"
              onClick={() => onChange(tags.filter((current) => current !== item))}
              type="button"
            >
              <span>{item}</span>
              <span className="text-outline-clay">x</span>
            </button>
          ))}
          <input
            className="min-w-[180px] flex-1 bg-transparent px-1 py-1 font-body-md text-[14px] text-charred-wood outline-none"
            onBlur={commitDraft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                commitDraft();
              }
              if (event.key === "Backspace" && !draft && tags.length > 0) {
                onChange(tags.slice(0, -1));
              }
            }}
            placeholder={tags.length === 0 ? placeholder : undefined}
            value={draft}
          />
        </div>
      </div>
  <p className="mt-2 font-body-md text-[12px] text-outline-clay">
        {helpText ?? "Press Enter or comma to add a tag."}
      </p>
    </div>
  );
}

function TagSelectInput({
  label,
  value,
  options,
  helpText,
  onChange,
}: {
  label: string;
  value: string[];
  options: string[];
  helpText?: string;
  onChange: (nextValue: string[]) => void;
}) {
  const [selectedValue, setSelectedValue] = useState("");
  const tags = value;
  const availableOptions = options.filter(
    (option) =>
      !tags.some((item) => item.toLowerCase() === option.toLowerCase()),
  );
  const visibleSelectedValue = availableOptions.some(
    (option) => option.toLowerCase() === selectedValue.toLowerCase(),
  )
    ? selectedValue
    : "";

  function addSelectedOption() {
    if (!selectedValue) return;

    const normalized = selectedValue.trim();
    if (!normalized) return;

    if (!tags.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
      onChange([...tags, normalized]);
    }

    setSelectedValue("");
  }

  return (
    <div className="lg:col-span-2">
      <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
        {label}
      </label>
      <div className="border border-surface-container bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <label className="mb-2 block font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
              Select Amenity
            </label>
            <select
              className="w-full border border-surface-container bg-surface-bone px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
              onChange={(event) => setSelectedValue(event.target.value)}
              value={visibleSelectedValue}
            >
              <option value="">Choose an amenity</option>
              {availableOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            className="inline-flex cursor-pointer items-center justify-center border border-primary bg-primary px-5 py-3 font-label-caps text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!visibleSelectedValue}
            onClick={addSelectedOption}
            type="button"
          >
            Add Amenity
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((item) => (
            <button
              key={item}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-surface-container bg-surface-bone px-3 py-1.5 font-body-md text-[13px] text-charred-wood transition-colors hover:border-primary hover:bg-primary-fixed hover:text-primary"
              onClick={() =>
                onChange(
                  tags.filter(
                    (current) => current.toLowerCase() !== item.toLowerCase(),
                  ),
                )
              }
              type="button"
            >
              <span>{item}</span>
              <span className="text-outline-clay">x</span>
            </button>
          ))}
        </div>

        {availableOptions.length > 0 ? (
          <p className="mt-3 font-body-md text-[12px] text-outline-clay">
            Choose from the approved amenities list. Click a tag to remove it.
          </p>
        ) : (
          <p className="mt-3 font-body-md text-[12px] text-outline-clay">
            All approved amenities have already been added.
          </p>
        )}
      </div>
      <p className="mt-2 font-body-md text-[12px] text-outline-clay">
        {helpText ?? "Select an amenity from the list and click Add."}
      </p>
    </div>
  );
}

function SortableRoomImage({
  image,
  index,
  onSetMainImage,
  onRemoveImage,
}: {
  image: string;
  index: number;
  onSetMainImage: (index: number) => void;
  onRemoveImage: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden border bg-surface-bone ${
        index === 0 ? "border-primary" : "border-surface-container"
      } ${isDragging ? "opacity-70" : ""}`}
      onClick={() => onSetMainImage(index)}
    >
      <button
        aria-label={`Drag room image ${index + 1}`}
        className="absolute inset-0 z-[1] cursor-grab"
        type="button"
        {...attributes}
        {...listeners}
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
      <img
        alt={`Room image ${index + 1}`}
        className={`h-28 w-full object-cover transition-transform group-hover:scale-[1.02] ${
          index === 0 ? "md:h-44" : ""
        }`}
        src={image}
      />
      <div className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-between bg-black/55 px-2 py-1 text-[11px] text-white">
        <span>{index === 0 ? "Main" : `#${index + 1}`}</span>
        <button
          className="rounded bg-white/10 px-2 py-1 font-label-caps uppercase"
          onClick={(event) => {
            event.stopPropagation();
            onRemoveImage(index);
          }}
          type="button"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function RoomEditorModal({
  form,
  isLoading,
  isSaving,
  error,
  invalidFields,
  amenityOptions,
  imageUrlDraft,
  isUploadingImages,
  sensors,
  mode,
  onClose,
  onSubmit,
  onChange,
  onAddImageUrl,
  onImageUrlDraftChange,
  onFilesSelected,
  onSetMainImage,
  onRemoveImage,
  onDragEndImage,
}: {
  form: RoomFormState;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  invalidFields: Array<keyof RoomFormState>;
  amenityOptions: string[];
  imageUrlDraft: string;
  isUploadingImages: boolean;
  sensors: ReturnType<typeof useSensors>;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: () => void;
  onChange: <K extends keyof RoomFormState>(field: K, value: RoomFormState[K]) => void;
  onAddImageUrl: () => void;
  onImageUrlDraftChange: (value: string) => void;
  onFilesSelected: (files: FileList | null) => void;
  onSetMainImage: (index: number) => void;
  onRemoveImage: (index: number) => void;
  onDragEndImage: (event: DragEndEvent) => void;
}) {
  const title = mode === "create" ? "Add New Room" : "Edit Room";
  const mainImage = form.images[0];
  const hasError = (field: keyof RoomFormState) => invalidFields.includes(field);
  const controlClass = (field: keyof RoomFormState) =>
    `w-full border bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors ${
      hasError(field)
        ? "border-red-400 focus:border-red-500"
        : "border-surface-container focus:border-primary"
    }`;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="bg-primary p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-eczar text-[28px] font-bold">{title}</h2>
              <p className="mt-1 font-body-md text-sm text-white/80">
                {mode === "create"
                  ? "Create a new room record and publish it to the lodge inventory."
                  : "Update the room record and persist the changes to the database."}
              </p>
            </div>
            <button
              aria-label="Close room editor"
              className="text-white transition-colors hover:text-dry-grass"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" className="text-[28px]" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {isLoading ? (
            <div className="rounded-sm border border-surface-container bg-surface-bone p-6 font-body-md text-[14px] text-on-surface-variant">
              Loading room details...
            </div>
          ) : null}

          <section className="grid gap-6 border-b border-surface-container pb-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <label className="block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                    Room Images
                  </label>
                  <span className="font-body-md text-[12px] text-outline-clay">
                    Drag to reorder, click to make main
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                  <div className="overflow-hidden border border-surface-container bg-surface-bone">
                  {mainImage ? (
                    <img
                      alt={form.name || "Room preview"}
                      className="h-80 w-full object-cover"
                      src={mainImage}
                    />
                  ) : (
                    <div className="flex h-80 items-center justify-center px-6 text-center">
                      <div>
                        <div className="font-eczar text-[24px] font-bold text-charred-wood">
                          Main room image
                        </div>
                        <p className="mt-2 font-body-md text-[14px] text-on-surface-variant">
                          Upload the hero image first or choose one from the gallery below.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="rounded-sm border border-dashed border-surface-container bg-surface-bone p-4">
                    <div className="flex items-center gap-3">
                      <input
                        accept="image/*"
                        className="block w-full text-[14px] text-on-surface-variant file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:font-label-caps file:text-[12px] file:font-bold file:uppercase file:text-white hover:file:bg-laterite-red"
                        disabled={isUploadingImages || isSaving || form.images.length >= MAX_ROOM_IMAGES}
                        multiple
                        onChange={(event) => onFilesSelected(event.target.files)}
                        type="file"
                      />
                      {isUploadingImages ? <InlineSpinner /> : null}
                    </div>
                    <p className="mt-2 font-body-md text-[12px] text-outline-clay">
                      Upload images from your device. They will be used in the room gallery.
                    </p>
                    <p className="mt-1 font-body-md text-[12px] text-outline-clay">
                      Limit: up to {MAX_ROOM_IMAGES} images per room.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      className="min-w-0 flex-1 border border-surface-container bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
                      onChange={(event) => onImageUrlDraftChange(event.target.value)}
                      placeholder="Paste image URL"
                      value={imageUrlDraft}
                    />
                    <button
                      className="bg-primary px-4 py-3 font-label-caps text-[12px] font-bold uppercase text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={
                        !imageUrlDraft.trim() ||
                        isUploadingImages ||
                        isSaving ||
                        form.images.length >= MAX_ROOM_IMAGES
                      }
                      onClick={onAddImageUrl}
                      type="button"
                    >
                      Add
                    </button>
                  </div>

                  {form.images.length > 0 ? (
                    <div className="font-body-md text-[12px] text-outline-clay">
                      {form.images.length} image{form.images.length === 1 ? "" : "s"} in gallery
                    </div>
                  ) : null}
                </div>
              </div>

              {form.images.length > 0 ? (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEndImage}
                  sensors={sensors}
                >
                  <SortableContext items={form.images} strategy={rectSortingStrategy}>
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {form.images.map((image, index) => (
                        <SortableRoomImage
                          image={image}
                          index={index}
                          key={`${image}-${index}`}
                          onRemoveImage={onRemoveImage}
                          onSetMainImage={onSetMainImage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Room Name
              </label>
              <input
                className={controlClass("name")}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="The Silt Suite"
                value={form.name}
              />
            </div>

            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Slug
              </label>
              <input
                className={controlClass("slug")}
                onChange={(event) => onChange("slug", event.target.value)}
                placeholder="the-silt-suite"
                value={form.slug}
              />
              <p className="mt-2 font-body-md text-[12px] text-outline-clay">
                Prefilled from the room name. You can adjust it if needed.
              </p>
            </div>

            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Room Type
              </label>
              <select
                className={controlClass("room_type")}
                onChange={(event) => onChange("room_type", event.target.value)}
                value={form.room_type}
              >
                <option value="">Select room type</option>
                <option value="Standard">Standard</option>
                <option value="Suite">Suite</option>
                <option value="Family Suite">Family Suite</option>
                <option value="Premium">Premium</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Bed Type
              </label>
              <select
                className={controlClass("bed_type")}
                onChange={(event) => onChange("bed_type", event.target.value)}
                value={form.bed_type}
              >
                <option value="">Select bed type</option>
                <option value="King Bed">King Bed</option>
                <option value="Queen Bed">Queen Bed</option>
                <option value="Double Bed">Double Bed</option>
                <option value="Twin Beds">Twin Beds</option>
                <option value="Single Bed">Single Bed</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                View Type
              </label>
              <select
                className={controlClass("view_type")}
                onChange={(event) => onChange("view_type", event.target.value)}
                value={form.view_type}
              >
                <option value="">Select view type</option>
                <option value="Garden View">Garden View</option>
                <option value="Pool View">Pool View</option>
                <option value="City View">City View</option>
                <option value="Mountain View">Mountain View</option>
                <option value="Ocean View">Ocean View</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Size
              </label>
              <select
                className={controlClass("size")}
                onChange={(event) => onChange("size", event.target.value)}
                value={form.size}
              >
                <option value="">Select room size</option>
                <option value="24 sqm">24 sqm</option>
                <option value="30 sqm">30 sqm</option>
                <option value="38 sqm">38 sqm</option>
                <option value="45 sqm">45 sqm</option>
                <option value="52 sqm">52 sqm</option>
                <option value="60 sqm">60 sqm</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Max Guests
              </label>
              <input
                className={controlClass("max_guests")}
                min={1}
                onChange={(event) => onChange("max_guests", event.target.value)}
                placeholder="2"
                type="number"
                value={form.max_guests}
              />
            </div>

            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Price Per Night
              </label>
              <input
                className={controlClass("price_per_night")}
                min={0}
                onChange={(event) => onChange("price_per_night", event.target.value)}
                placeholder="650"
                type="number"
                value={form.price_per_night}
              />
            </div>
          </section>

          <section className="grid gap-6 border-b border-surface-container pb-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Description
              </label>
              <textarea
                className={`min-h-[120px] w-full border bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors ${
                  hasError("description")
                    ? "border-red-400 focus:border-red-500"
                    : "border-surface-container focus:border-primary"
                }`}
                onChange={(event) => onChange("description", event.target.value)}
                placeholder="Elegant suite with panoramic views..."
                value={form.description}
              />
            </div>

            <TagSelectInput
              helpText="Choose from the approved amenities list."
              label="Amenities"
              onChange={(nextValue) => onChange("amenities", nextValue)}
              options={amenityOptions}
              value={form.amenities}
            />

            <TagInput
              helpText="Use these for room highlights or special selling points."
              label="Features"
              onChange={(nextValue) => onChange("features", nextValue)}
              placeholder="Balcony"
              value={form.features}
            />

            <div className="lg:col-span-2">
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Cancellation Policy
              </label>
              <textarea
                className="min-h-[96px] w-full border border-surface-container bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
                onChange={(event) =>
                  onChange("cancellation_policy", event.target.value)
                }
                placeholder="Free cancellation up to 24 hours before check-in."
                value={form.cancellation_policy}
              />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div>
              <label className="mb-2 block font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Availability Status
              </label>
              <select
                className="w-full border border-surface-container bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
                onChange={(event) =>
                  onChange("availability_status", event.target.value)
                }
                value={form.availability_status}
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-sm border border-surface-container px-4 py-4">
              <input
                checked={form.is_active}
                className="h-4 w-4 accent-primary"
                onChange={(event) => onChange("is_active", event.target.checked)}
                type="checkbox"
              />
              <span className="font-body-md text-[14px] text-charred-wood">
                Active room
                <span className="block text-[12px] text-outline-clay">
                  Visible on the site. Turn this off to hide the room from booking flow.
                </span>
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-sm border border-surface-container px-4 py-4">
              <input
                checked={form.featured}
                className="h-4 w-4 accent-primary"
                onChange={(event) => onChange("featured", event.target.checked)}
                type="checkbox"
              />
              <span className="font-body-md text-[14px] text-charred-wood">
                Featured room
                <span className="block text-[12px] text-outline-clay">
                  Promoted on the home page and room highlights only.
                </span>
              </span>
            </label>

            <div className="rounded-sm border border-surface-container bg-surface-bone p-4 lg:col-span-1">
              <p className="font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                Availability
              </p>
              <p className="mt-2 font-body-md text-[13px] text-on-surface-variant">
                <strong>Available</strong> means guests can book it now.
              </p>
              <p className="mt-1 font-body-md text-[13px] text-on-surface-variant">
                <strong>Maintenance</strong> or <strong>Unavailable</strong> keeps it out of booking flow.
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-surface-container pt-6 sm:flex-row">
            <button
              aria-busy={isSaving}
              className="flex-1 bg-primary px-6 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSaving || isLoading}
              onClick={onSubmit}
              type="button"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isSaving ? <InlineSpinner /> : null}
                {isSaving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Room"
                    : "Save Changes"}
              </span>
            </button>
            <button
              className="flex-1 border-2 border-primary bg-white px-6 py-3 font-label-caps text-sm font-bold uppercase text-primary transition-colors hover:bg-surface-bone"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
          </div>
          {error ? (
            <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 font-body-md text-[14px] text-red-800">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type AdminRoomsViewProps = {
  rooms?: AdminRoomRecord[];
  amenities?: AmenityRecord[];
};

function slugifyRoomName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function roomToFormState(room: RoomApiRecord): RoomFormState {
  return {
    id: room.id,
    slug: room.slug,
    name: room.name,
    description: room.description,
    images: room.images,
    price_per_night: String(room.price_per_night),
    bed_type: room.bed_type,
    max_guests: String(room.max_guests),
    room_type: room.room_type,
    view_type: room.view_type,
    size: room.size,
    amenities: toStringList(room.amenities),
    features: toStringList(room.features),
    cancellation_policy: room.cancellation_policy ?? "",
    is_active: room.is_active,
    availability_status: room.availability_status,
    featured: room.featured,
  };
}

function isRoomApiRecord(value: unknown): value is RoomApiRecord {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.slug === "string" &&
    typeof value.name === "string" &&
    typeof value.description === "string" &&
    typeof value.price_per_night === "number" &&
    typeof value.bed_type === "string" &&
    typeof value.max_guests === "number" &&
    typeof value.room_type === "string" &&
    typeof value.view_type === "string" &&
    typeof value.size === "string" &&
    Array.isArray(value.images) &&
    Array.isArray(value.amenities) &&
    Array.isArray(value.features) &&
    typeof value.is_active === "boolean" &&
    typeof value.availability_status === "string" &&
    Array.isArray(value.availability_blocks) &&
    typeof value.featured === "boolean"
  );
}

function formStateToPayload(form: RoomFormState) {
  return {
    slug: form.slug.trim(),
    name: form.name.trim(),
    description: form.description.trim(),
    images: form.images,
    price_per_night: Number(form.price_per_night),
    bed_type: form.bed_type.trim(),
    max_guests: Number(form.max_guests),
    room_type: form.room_type.trim(),
    view_type: form.view_type.trim(),
    size: form.size.trim(),
    amenities: form.amenities.map((item) => item.trim()).filter(Boolean),
    features: form.features.map((item) => item.trim()).filter(Boolean),
    cancellation_policy: form.cancellation_policy.trim() || null,
    is_active: form.is_active,
    availability_status: form.availability_status,
    featured: form.featured,
  };
}

export function AdminRoomsView({
  rooms: roomsProp = mockRooms,
  amenities = [],
}: AdminRoomsViewProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [roomItems, setRoomItems] = useState<RoomRecord[]>(roomsProp);
  const [selectedRoom, setSelectedRoom] = useState<RoomRecord | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editorError, setEditorError] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<Array<keyof RoomFormState>>([]);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUrlDraft, setImageUrlDraft] = useState("");
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [deleteBlockedMessage, setDeleteBlockedMessage] = useState<string | null>(null);
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState<RoomRecord | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState<RoomFormState>(emptyRoomForm());
  const router = useRouter();
  const pageSize = 6;
  const amenityOptions = useMemo(() => {
    const options = amenities
      .filter((amenity) => amenity.is_active)
      .map((amenity) => amenity.title.trim())
      .filter(Boolean);

    const unique = new Map<string, string>();
    for (const option of options) {
      const key = option.toLowerCase();
      if (!unique.has(key)) {
        unique.set(key, option);
      }
    }

    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b));
  }, [amenities]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredRooms = useMemo(() => {
    return roomItems.filter((room) => {
      const query = searchTerm.toLowerCase();
      return (
        room.name.toLowerCase().includes(query) ||
        room.type.toLowerCase().includes(query)
      );
    });
  }, [roomItems, searchTerm]);

  const pageCount = Math.max(Math.ceil(filteredRooms.length / pageSize), 1);
  const displayPage = Math.min(page, pageCount);

  const paginatedRooms = useMemo(() => {
    const start = (displayPage - 1) * pageSize;
    return filteredRooms.slice(start, start + pageSize);
  }, [displayPage, filteredRooms]);

  function openCreateRoom() {
    setEditorMode("create");
    setEditorError(null);
    setInvalidFields([]);
    setImageUrlDraft("");
    setSlugTouched(false);
    setForm(emptyRoomForm());
    setEditorOpen(true);
  }

  async function openEditRoom(room: RoomRecord) {
    setEditorMode("edit");
    setEditorError(null);
    setInvalidFields([]);
    setIsLoadingRoom(true);
    setEditorOpen(true);

    try {
      const response = await fetch(`/api/rooms/${room.id}`);
      const payload = await response.json().catch(() => null);

      if (!response.ok || !isRoomApiRecord(payload)) {
        const message =
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : "Unable to load room details.";
        setEditorError(message);
        return;
      }

      setForm(roomToFormState(payload));
      setImageUrlDraft("");
      setSlugTouched(true);
    } catch {
      setEditorError("Unable to load room details.");
    } finally {
      setIsLoadingRoom(false);
    }
  }

  function moveImage(fromIndex: number, toIndex: number) {
    setForm((currentForm) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= currentForm.images.length ||
        toIndex >= currentForm.images.length
      ) {
        return currentForm;
      }

      const nextImages = [...currentForm.images];
      const [moved] = nextImages.splice(fromIndex, 1);
      nextImages.splice(toIndex, 0, moved);

      return {
        ...currentForm,
        images: nextImages,
      };
    });
  }

  function setMainImage(index: number) {
    moveImage(index, 0);
  }

  function handleImageDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const fromIndex = form.images.findIndex((image) => image === active.id);
    const toIndex = form.images.findIndex((image) => image === over.id);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      images: arrayMove(currentForm.images, fromIndex, toIndex),
    }));
  }

  async function readFilesAsDataUrls(files: FileList) {
    const fileList = Array.from(files);

    const readableFiles = fileList.filter((file) => file.type.startsWith("image/"));
    if (readableFiles.length === 0) {
      return [];
    }

    const results = await Promise.all(
      readableFiles.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error(`Failed to read ${file.name}.`));
            reader.readAsDataURL(file);
          }),
      ),
    );

    return results;
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    setEditorError(null);

    try {
      if (form.images.length >= MAX_ROOM_IMAGES) {
        setEditorError(`A room can only have up to ${MAX_ROOM_IMAGES} images.`);
        return;
      }

      const imageDataUrls = await readFilesAsDataUrls(files);
      if (imageDataUrls.length === 0) return;

      const remainingSlots = MAX_ROOM_IMAGES - form.images.length;
      if (imageDataUrls.length > remainingSlots) {
        setEditorError(`A room can only have up to ${MAX_ROOM_IMAGES} images.`);
        return;
      }

      setForm((currentForm) => ({
        ...currentForm,
        images: [...currentForm.images, ...imageDataUrls],
      }));
    } catch {
      setEditorError("Unable to upload images.");
    } finally {
      setIsUploadingImages(false);
    }
  }

  function handleAddImageUrl() {
    const nextUrl = imageUrlDraft.trim();
    if (!nextUrl) return;

    if (form.images.length >= MAX_ROOM_IMAGES) {
      setEditorError(`A room can only have up to ${MAX_ROOM_IMAGES} images.`);
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      images: [...currentForm.images, nextUrl],
    }));
    setImageUrlDraft("");
  }

  function removeImage(index: number) {
    setForm((currentForm) => ({
      ...currentForm,
      images: currentForm.images.filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  async function handleSaveRoom() {
    setIsSaving(true);
    setEditorError(null);
    setInvalidFields([]);

    try {
      const payload = formStateToPayload(form);
      const slug = payload.slug || slugifyRoomName(payload.name);

      if (payload.images.length > MAX_ROOM_IMAGES) {
        setEditorError(`A room can only have up to ${MAX_ROOM_IMAGES} images.`);
        return;
      }

      const nextInvalidFields: Array<keyof RoomFormState> = [];
      if (!payload.name) nextInvalidFields.push("name");
      if (!slug) nextInvalidFields.push("slug");
      if (!payload.description) nextInvalidFields.push("description");
      if (!payload.bed_type) nextInvalidFields.push("bed_type");
      if (!payload.room_type) nextInvalidFields.push("room_type");
      if (!payload.view_type) nextInvalidFields.push("view_type");
      if (!payload.size) nextInvalidFields.push("size");
      if (!payload.price_per_night) nextInvalidFields.push("price_per_night");
      if (!payload.max_guests) nextInvalidFields.push("max_guests");

      if (nextInvalidFields.length > 0) {
        setInvalidFields(nextInvalidFields);
        setEditorError("Please complete the highlighted room fields.");
        return;
      }

      const requestBody = {
        ...payload,
        slug,
      };

      const response = await fetch(
        editorMode === "create" ? "/api/rooms" : `/api/rooms/${form.id}`,
        {
          method: editorMode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Unable to save room.";
        setEditorError(message);
        return;
      }

      if (editorMode === "create") {
        if (!isRoomApiRecord(result)) {
          setEditorError("Unable to save room.");
          return;
        }

        const created = result;
          setRoomItems((currentRooms) => [
            {
              id: created.id,
              name: created.name,
              type: created.room_type,
              capacity: created.max_guests,
              pricePerNight: created.price_per_night,
              status: roomStatusFromFlags(created.is_active, created.availability_status),
              amenities: created.amenities,
              description: created.description,
              image: created.images[0] ?? "",
              totalBookings: 0,
              currentOccupancy: roomOccupancyFromFlags(
                created.is_active,
                created.availability_status,
              ),
            },
            ...currentRooms,
          ]);
      } else {
        if (!isRoomApiRecord(result)) {
          setEditorError("Unable to save room.");
          return;
        }

        const updated = result;
        setRoomItems((currentRooms) =>
          currentRooms.map((room) =>
            room.id === updated.id
                ? {
                    id: updated.id,
                    name: updated.name,
                    type: updated.room_type,
                    capacity: updated.max_guests,
                    pricePerNight: updated.price_per_night,
                    status: roomStatusFromFlags(updated.is_active, updated.availability_status),
                    amenities: updated.amenities,
                    description: updated.description,
                    image: updated.images[0] ?? room.image,
                    totalBookings: room.totalBookings,
                    currentOccupancy: roomOccupancyFromFlags(
                      updated.is_active,
                      updated.availability_status,
                      room.currentOccupancy === "Under Maintenance" ? "Vacant" : room.currentOccupancy,
                    ),
                  }
              : room,
          ),
        );
      }

      setEditorOpen(false);
      setForm(emptyRoomForm());
      setImageUrlDraft("");
      setSlugTouched(false);
      setInvalidFields([]);
      router.refresh();
    } catch {
      setEditorError("Unable to save room.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteRoom(room: RoomRecord) {
    try {
      setDeletingRoomId(room.id);
      const response = await fetch(`/api/rooms/${room.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : "Unable to delete room.";
        if (response.status === 409) {
          setDeleteBlockedMessage(message);
        } else {
          setEditorError(message);
          setEditorOpen(true);
        }
        return;
      }

      setRoomItems((currentRooms) =>
        currentRooms.filter((item) => item.id !== room.id),
      );

      if (selectedRoom?.id === room.id) {
        setSelectedRoom(null);
      }

      setDeleteConfirmRoom(null);
      router.refresh();
    } catch {
      setEditorError("Unable to delete room.");
      setEditorOpen(true);
      setDeleteConfirmRoom(null);
    } finally {
      setDeletingRoomId(null);
    }
  }

  return (
    <div>
      <PageHeader
        action={
          <button
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red"
            onClick={openCreateRoom}
            type="button"
          >
            <Icon name="add" className="text-[18px]" />
            <span>Add New Room</span>
          </button>
        }
        description="Manage room inventory, pricing, and availability from one place."
        title="Rooms Management"
      /> 

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard label="Total Rooms" value={roomItems.length} />
        <MetricCard
          accentClassName="text-green-700"
          label="Available Rooms"
          value={roomItems.filter((room) => room.currentOccupancy === "Vacant").length}
        />
        <MetricCard
          accentClassName="text-blue-700"
          label="Occupied Rooms"
          value={roomItems.filter(isOccupiedRoom).length}
        />
        <MetricCard
          accentClassName="text-amber-700"
          label="Under Maintenance"
          value={roomItems.filter((room) => room.status === "Maintenance").length}
        />
      </section>

      <section className="mb-6 border border-surface-container bg-white p-6">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline-clay"
          />
          <input
            className="w-full border border-surface-container bg-white py-3 pl-11 pr-4 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
            placeholder="Search rooms by name or type..."
            value={searchTerm}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {paginatedRooms.map((room) => (
          <article
            className="overflow-hidden border border-surface-container bg-white shadow-sm transition-shadow hover:shadow-md"
            key={room.id}
          >
            <div className="bg-surface-bone p-0">
              <div className="relative h-44 overflow-hidden bg-charred-wood">
                {room.image ? (
                  <img
                    alt={`${room.name} preview`}
                    className="h-full w-full object-cover"
                    src={room.image}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-charred-wood via-primary to-laterite-red text-white">
                    <Icon name="bed" className="text-[44px]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white/90 p-2 text-primary shadow-sm">
                        <Icon name="bed" className="text-[20px]" />
                      </div>
                      <div>
                        <h2 className="font-eczar text-[20px] font-bold text-white">
                          {room.name}
                        </h2>
                        <p className="font-body-md text-[12px] text-white/85">
                          {room.type}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${badgeClass(room.status)}`}
                    >
                      {room.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <p className="font-body-md text-[14px] leading-relaxed text-on-surface-variant">
                {room.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Detail label="Capacity" value={`${room.capacity} Guests`} />
                <Detail label="Price/Night" value={`GHS ${room.pricePerNight}`} />
              </div>

              <div>
                <p className="mb-2 font-label-caps text-[12px] font-bold uppercase tracking-widest text-outline-clay">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 3).map((amenity) => (
                    <span
                      className="rounded-sm bg-surface-bone px-2 py-1 font-body-md text-[12px] text-on-surface-variant"
                      key={amenity}
                    >
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 ? (
                    <span className="rounded-sm bg-surface-bone px-2 py-1 font-body-md text-[12px] text-outline-clay">
                      +{room.amenities.length - 3} more
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Detail label="Current" value={room.currentOccupancy} />
                <Detail label="Active Bookings" value={String(room.totalBookings)} />
              </div>

              <div className="flex gap-2 border-t border-surface-container pt-4">
                <button
                  className="flex flex-1 items-center justify-center gap-2 bg-primary px-4 py-3 font-label-caps text-xs font-bold uppercase text-white transition-colors hover:bg-laterite-red"
                  onClick={() => setSelectedRoom(room)}
                  type="button"
                >
                  <Icon name="visibility" className="text-[18px]" />
                  View
                </button>
                <button
                  className="border border-surface-container bg-white px-4 py-3 text-primary transition-colors hover:bg-surface-bone"
                  onClick={() => openEditRoom(room)}
                  type="button"
                >
                  <Icon name="edit" className="text-[18px]" />
                </button>
                <button
                  className="border border-red-300 bg-white px-4 py-3 text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={deletingRoomId === room.id}
                  onClick={() => setDeleteConfirmRoom(room)}
                  type="button"
                >
                  {deletingRoomId === room.id ? (
                    <InlineSpinner />
                  ) : (
                    <Icon name="delete" className="text-[18px]" />
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <AdminPagination
        itemLabel="rooms"
        onPageChange={setPage}
        page={displayPage}
        pageCount={pageCount}
        pageSize={pageSize}
        total={filteredRooms.length}
      />

      {selectedRoom ? (
        <RoomModal
          onClose={() => setSelectedRoom(null)}
          onEdit={() => openEditRoom(selectedRoom)}
          room={selectedRoom}
        />
      ) : null}

      {deleteBlockedMessage ? (
        <DeleteBlockedModal
          message={deleteBlockedMessage}
          onClose={() => setDeleteBlockedMessage(null)}
        />
      ) : null}

      {deleteConfirmRoom ? (
        <AdminConfirmModal
          busy={deletingRoomId === deleteConfirmRoom.id}
          confirmLabel="Delete Room"
          description={`Delete ${deleteConfirmRoom.name} from live inventory?`}
          onClose={() => setDeleteConfirmRoom(null)}
          onConfirm={() => handleDeleteRoom(deleteConfirmRoom)}
          title="Delete Room"
        />
      ) : null}

      {editorOpen ? (
        <RoomEditorModal
          error={editorError}
          amenityOptions={amenityOptions}
          invalidFields={invalidFields}
          form={form}
          isLoading={isLoadingRoom}
          isSaving={isSaving}
          imageUrlDraft={imageUrlDraft}
          isUploadingImages={isUploadingImages}
          sensors={sensors}
          mode={editorMode}
          onChange={(field, value) => {
            setForm((currentForm) => {
              const nextForm = { ...currentForm, [field]: value };

              if (
                field === "name" &&
                editorMode === "create" &&
                !slugTouched &&
                String(value).trim()
              ) {
                nextForm.slug = slugifyRoomName(String(value));
              }

              if (field === "slug") {
                setSlugTouched(true);
              }

              return nextForm;
            });
            setInvalidFields((current) =>
              current.filter((item) => item !== field),
            );
          }}
          onClose={() => {
      setEditorOpen(false);
      setEditorError(null);
      setInvalidFields([]);
      setImageUrlDraft("");
      setSlugTouched(false);
      setForm(emptyRoomForm());
          }}
          onAddImageUrl={handleAddImageUrl}
          onDragEndImage={handleImageDragEnd}
          onFilesSelected={handleFilesSelected}
          onImageUrlDraftChange={setImageUrlDraft}
          onRemoveImage={removeImage}
          onSetMainImage={setMainImage}
          onSubmit={handleSaveRoom}
        />
      ) : null}
    </div>
  );
}
