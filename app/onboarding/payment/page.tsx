"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PaymentCard from "@/components/onboarding/PaymentCard";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type SessionResponse = {
  ok: boolean;
  data?: {
    businessProfile?: {
      commercialName?: string;
      industry?: string;
    } | null;
    primaryGoal?: {
      primaryGoalLabel?: string;
    } | null;
    recommendedPackage?: {
      id: string;
      name: string;
      setupPrice: string;
      monthlyPrice: string;
    } | null;
    selectedAddons?: Array<{
      id: string;
      addonId: string;
      createdAt?: string;
      addon: {
        id: string;
        code: string;
        name: string;
        description?: string | null;
        priceType: string;
        priceAmount?: string | null;
      };
    }>;
  };
};

export default function PaymentPage() {
  const router = useRouter();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
  });

  const [packageData, setPackageData] = useState({
    packageName: "Pendiente",
    setupPrice: "0",
    monthlyPrice: "0",
  });

  const [selectedAddons, setSelectedAddons] = useState<
    Array<{
      id: string;
      addonId: string;
      createdAt?: string;
      addon: {
        id: string;
        code: string;
        name: string;
        description?: string | null;
        priceType: string;
        priceAmount?: string | null;
      };
    }>
  >([]);

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      router.push("/onboarding/start");
      return;
    }

    setSessionToken(token);

    fetch(`/api/onboarding/session/${token}`)
      .then((res) => res.json())
      .then((res: SessionResponse) => {
        if (!res?.ok || !res.data) {
          router.push("/onboarding/start");
          return;
        }

        const businessName =
          res.data.businessProfile?.commercialName || "Pendiente";
        const industry = res.data.businessProfile?.industry || "Pendiente";
        const goal = res.data.primaryGoal?.primaryGoalLabel || "Pendiente";
        const packageName = res.data.recommendedPackage?.name || "Pendiente";
        const setupPrice = res.data.recommendedPackage?.setupPrice || "0";
        const monthlyPrice = res.data.recommendedPackage?.monthlyPrice || "0";
        const addons = res.data.selectedAddons || [];

        setSummary({
          businessName,
          industry,
          goal,
          packageName,
        });

        setPackageData({
          packageName,
          setupPrice,
          monthlyPrice,
        });

        setSelectedAddons(addons);
      })
      .catch((error) => {
        console.error("PAYMENT_PAGE_LOAD_ERROR:", error);
        router.push("/onboarding/start");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const totalInitial = useMemo(() => {
    const baseSetup = Number(packageData.setupPrice || 0);

    const addonsTotal = selectedAddons.reduce((acc, item) => {
      if (!item.addon?.priceAmount) return acc;
      return acc + Number(item.addon.priceAmount);
    }, 0);

    return String(baseSetup + addonsTotal);
  }, [packageData.setupPrice, selectedAddons]);

  const handleContinue = async () => {
    if (!sessionToken) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/onboarding/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "No fue posible generar el pago.");
      }

      const paymentUrl = result?.data?.paymentAttempt?.paymentUrl;

      if (paymentUrl) {
        router.push(paymentUrl);
        return;
      }

      router.push("/onboarding/executive-summary");
    } catch (error) {
      console.error("PAYMENT_SUBMIT_ERROR:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No fue posible generar el pago."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell
      step={5}
      totalSteps={5}
      progress={100}
      summary={summary}
      isLoading={isLoading}
    >
      <PaymentCard
        packageName={packageData.packageName}
        setupPrice={packageData.setupPrice}
        monthlyPrice={packageData.monthlyPrice}
        selectedAddons={selectedAddons}
        totalInitial={totalInitial}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onBack={() => router.push("/onboarding/scope-confirmation")}
        onContinue={handleContinue}
      />
    </AppShell>
  );
}