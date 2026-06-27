import { Suspense } from "react";
import AuthPageClient from "@/components/AuthPageClient";

export default function SigninPage() {
  return (
    <Suspense>
      <AuthPageClient mode="signin" />
    </Suspense>
  );
}
