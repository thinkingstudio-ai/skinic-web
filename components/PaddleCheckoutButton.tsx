"use client";
import { useEffect, useRef, useState } from "react";
import type { Paddle } from "@paddle/paddle-js";

type Props = {
  priceId: string;
  tier: "starter" | "pro" | "starter_app" | "pro_app" | "enterprise";
  userId: string;
  userEmail: string;
  label: string;
};

export default function PaddleCheckoutButton({ priceId, tier, userId, userEmail, label }: Props) {
  const paddleRef = useRef<Paddle | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    import("@paddle/paddle-js").then(({ initializePaddle }) => {
      initializePaddle({
        environment: "production",
        token,
      }).then((paddle) => {
        if (paddle) {
          paddleRef.current = paddle;
          setReady(true);
        }
      });
    });
  }, []);

  function openCheckout() {
    if (!paddleRef.current) return;
    paddleRef.current.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { user_id: userId, tier },
      settings: {
        successUrl: `https://skinic.app/dashboard/plan?upgraded=${tier}`,
        displayMode: "overlay",
        theme: "dark",
      },
    });
  }

  return (
    <button
      onClick={openCheckout}
      disabled={!ready}
      className="w-full text-center py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
    >
      {ready ? label : "Loading..."}
    </button>
  );
}
