"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();

  const ppId = useMemo(() => searchParams.get("pp_id") || "", [searchParams]);
  const returnedStatus = useMemo(
    () => (searchParams.get("status") || "").toLowerCase(),
    [searchParams],
  );

  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState(returnedStatus || "processing");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const syncPaymentAfterReturn = async () => {
      if (!ppId) {
        setStatus("failed");
        setMessage("Missing payment reference (pp_id).");
        setIsProcessing(false);
        return;
      }

      try {
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/payments/piprapay/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pp_id: ppId }),
          },
        );

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || verifyData?.success === false) {
          setStatus("failed");
          setMessage(verifyData?.message || "Payment verification failed.");
          setIsProcessing(false);
          return;
        }

        const verifiedStatus = String(
          verifyData?.data?.status || returnedStatus || "unknown",
        ).toLowerCase();
        setStatus(verifiedStatus);

        if (verifiedStatus !== "completed") {
          setMessage(`Payment status: ${verifiedStatus}`);
          setIsProcessing(false);
          return;
        }

        setMessage("Payment verified and booking confirmed.");
      } catch (error) {
        setStatus("failed");
        setMessage("Could not finalize payment confirmation.");
      } finally {
        setIsProcessing(false);
      }
    };

    syncPaymentAfterReturn();
  }, [ppId, returnedStatus]);

  const isCompleted = status === "completed";
  const isFailed = status === "failed" || status === "verify_failed";

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm ring-1 ring-stone-900/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Payment Status
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">
            {isCompleted
              ? "Payment Completed"
              : isFailed
                ? "Payment Not Completed"
                : "Processing Payment"}
          </h1>

          <p className="mt-3 text-sm text-stone-600">{message}</p>

          {ppId && (
            <p className="mt-2 text-xs text-stone-500">
              Reference: <span className="font-medium">{ppId}</span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/my-bookings"
              className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              View My Bookings
            </Link>
            <Link
              href="/rooms"
              className="inline-flex h-10 items-center justify-center rounded-full border border-stone-300 bg-white px-5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
            >
              Browse Rooms
            </Link>
          </div>

          {isProcessing && (
            <p className="mt-4 text-xs text-stone-500">
              Please wait. Do not close this page.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessPage;
