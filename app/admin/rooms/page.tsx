import { AdminRoomsView } from "@/components/admin/admin-rooms-view";
import { getAdminRoomsData } from "@/lib/admin-data";
import { getAdminAmenities } from "@/lib/amenities";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const [rooms, amenities] = await Promise.all([
    getAdminRoomsData(),
    getAdminAmenities(),
  ]);

  return <AdminRoomsView amenities={amenities} rooms={rooms} />;
}
