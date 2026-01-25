// client/src/app/payment/redirect/page.js
"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function RedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const order_id = searchParams.get("order_id");

  useEffect(() => {
    if (order_id) {
      router.replace(`/api/payment/order-success?order_id=${order_id}`);
    }
  }, [order_id, router]);

  return <div style={{ padding: "2rem" }}>Redirecting to order summary...</div>;
}

export default function PaymentRedirect() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading...</div>}>
      <RedirectHandler />
    </Suspense>
  );
}
