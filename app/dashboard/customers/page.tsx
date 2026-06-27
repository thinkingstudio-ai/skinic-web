import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CustomersPage() {
  return <CustomersClient />;
}
