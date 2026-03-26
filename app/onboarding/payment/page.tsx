"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PaymentCard from "@/components/onboarding/PaymentCard";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";
import PaymentPageSkeleton from "@/components/onboarding/PaymentPageSkeleton";

type SelectedAddonItem = {
  id: string;
  sessionId: string;
  addonId: string;
  createdAt?: string | Date;
  addon: {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    setupPrice: string | null;
    monthlyPrice: string | null;
  };
};

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
      setupPrice: string | null;
      monthlyPrice: string | null;
    } | null;
    selectedAddons?: SelectedAddonItem[];
  };
};

function toNumber(value: string | null | undefined) {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

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

  const [selectedAddons, setSelectedAddons] = useState<SelectedAddonItem[]>([]);

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      router.push("/onboarding/start");
      return;
    }

    setSessionToken(token);

    fetch(`/api/onboarding/session/${token}`, {
      cache: "no-store",
    })
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

  const addonsSetupTotal = useMemo(() => {
    return selectedAddons.reduce((acc, item) => {
      return acc + toNumber(item.addon?.setupPrice);
    }, 0);
  }, [selectedAddons]);

  const addonsMonthlyTotal = useMemo(() => {
    return selectedAddons.reduce((acc, item) => {
      return acc + toNumber(item.addon?.monthlyPrice);
    }, 0);
  }, [selectedAddons]);

  const totalInitial = useMemo(() => {
    const baseSetup = toNumber(packageData.setupPrice);
    return String(baseSetup + addonsSetupTotal);
  }, [packageData.setupPrice, addonsSetupTotal]);

  const totalMonthly = useMemo(() => {
    const baseMonthly = toNumber(packageData.monthlyPrice);
    return String(baseMonthly + addonsMonthlyTotal);
  }, [packageData.monthlyPrice, addonsMonthlyTotal]);

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
        throw new Error(result?.error || "No fue posible generar el resumen ejecutivo.");
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
          : "No fue posible generar el resumen ejecutivo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
    if (isLoading) {
    return (
        <AppShell
        step={8}
        totalSteps={10}
        progress={70}
        summary={{
            businessName: "",
            industry: "",
            goal: "",
            packageName: "",
        }}
        isLoading
        >
        <PaymentPageSkeleton />
        </AppShell>
    );
    }
    return (
    <AppShell
        step={8}
        totalSteps={10}
        progress={70}
        summary={summary}
    >
        <PaymentCard
        packageName={packageData.packageName}
        setupPrice={packageData.setupPrice}
        monthlyPrice={packageData.monthlyPrice}
        selectedAddons={selectedAddons}
        addonsSetupTotal={String(addonsSetupTotal)}
        addonsMonthlyTotal={String(addonsMonthlyTotal)}
        totalInitial={totalInitial}
        totalMonthly={totalMonthly}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onBack={() => router.push("/onboarding/scope-confirmation")}
        onContinue={handleContinue}
        />
    </AppShell>
    );
}