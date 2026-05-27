import { notFound } from "next/navigation";
import { PaymentReceiptView } from "@/components/admin/payment-receipt-view";
import { getAdminPaymentReceiptData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function PaymentReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingCode: string }>;
  searchParams?: Promise<{ download?: string }>;
}) {
  const { bookingCode } = await params;
  const receipt = await getAdminPaymentReceiptData(bookingCode);

  if (!receipt) {
    notFound();
  }

  const query = (await searchParams) ?? {};
  const autoPrint = query.download === "1" || query.download === "true";

  return <PaymentReceiptView autoPrint={autoPrint} receipt={receipt} />;
}
