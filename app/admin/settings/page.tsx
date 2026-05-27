import { AdminSettingsView } from "@/components/admin/admin-settings-view";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminSettingsPage() {
  const initialSettings = await getSiteSettings();

  return <AdminSettingsView initialSettings={initialSettings} />;
}
