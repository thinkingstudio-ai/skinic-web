import CustomersClient from "@/app/dashboard/customers/CustomersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StudioCustomersPage() {
  return <CustomersClient />;
}
