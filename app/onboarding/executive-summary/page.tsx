"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import ExecutiveSummaryCard from "@/components/onboarding/ExecutiveSummaryCard";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";
import ExecutiveSummaryPageSkeleton from "@/components/onboarding/ExecutiveSummaryPageSkeleton";

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

type PaymentAttemptItem = {
  id: string;
  sessionId: string;
  provider: string;
  status: string;
  setupAmount: string | null;
  paymentReference: string | null;
  paymentUrl: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
      name: string;
      setupPrice: string | null;
      monthlyPrice: string | null;
    } | null;
    selectedAddons?: SelectedAddonItem[];
    paymentAttempts?: PaymentAttemptItem[];
  };
};

function toNumber(value: string | null | undefined) {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function ExecutiveSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
    packageSetupPrice: "0",
    packageMonthlyPrice: "0",
    selectedAddons: [] as SelectedAddonItem[],
    paymentAttemptSetupAmount: "0",
    paymentReference: "",
  });

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      router.push("/onboarding/start");
      return;
    }

    const paymentRef = searchParams.get("payment_ref");

    fetch(`/api/onboarding/session/${token}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((res: SessionResponse) => {
        if (!res?.ok || !res.data) {
          router.push("/onboarding/start");
          return;
        }

        const paymentAttempts = res.data.paymentAttempts || [];
        const selectedAttempt =
          paymentAttempts.find(
            (item) => item.paymentReference === paymentRef
          ) || paymentAttempts[0] || null;

        setSummary({
          businessName: res.data.businessProfile?.commercialName || "Pendiente",
          industry: res.data.businessProfile?.industry || "Pendiente",
          goal: res.data.primaryGoal?.primaryGoalLabel || "Pendiente",
          packageName: res.data.recommendedPackage?.name || "Pendiente",
          packageSetupPrice: res.data.recommendedPackage?.setupPrice || "0",
          packageMonthlyPrice: res.data.recommendedPackage?.monthlyPrice || "0",
          selectedAddons: res.data.selectedAddons || [],
          paymentAttemptSetupAmount: selectedAttempt?.setupAmount || "0",
          paymentReference: selectedAttempt?.paymentReference || "",
        });
      })
      .catch((error) => {
        console.error("EXECUTIVE_SUMMARY_LOAD_ERROR:", error);
        router.push("/onboarding/start");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, searchParams]);

  const addonsSetupTotal = useMemo(() => {
    return summary.selectedAddons.reduce((acc, item) => {
      return acc + toNumber(item.addon.setupPrice);
    }, 0);
  }, [summary.selectedAddons]);

  const addonsMonthlyTotal = useMemo(() => {
    return summary.selectedAddons.reduce((acc, item) => {
      return acc + toNumber(item.addon.monthlyPrice);
    }, 0);
  }, [summary.selectedAddons]);

  const totalMonthly = useMemo(() => {
    return String(
      toNumber(summary.packageMonthlyPrice) + addonsMonthlyTotal
    );
  }, [summary.packageMonthlyPrice, addonsMonthlyTotal]);

    if (isLoading) {
    return (
        <AppShell
        step={5}
        totalSteps={5}
        progress={98}
        summary={{
            businessName: "",
            industry: "",
            goal: "",
            packageName: "",
        }}
        isLoading
        >
        <ExecutiveSummaryPageSkeleton />
        </AppShell>
    );
    }
    return (
    <AppShell
        step={5}
        totalSteps={5}
        progress={98}
        summary={{
        businessName: summary.businessName,
        industry: summary.industry,
        goal: summary.goal,
        packageName: summary.packageName,
        }}
    >
        <ExecutiveSummaryCard
        businessName={summary.businessName}
        industry={summary.industry}
        goal={summary.goal}
        packageName={summary.packageName}
        packageSetupPrice={summary.packageSetupPrice}
        packageMonthlyPrice={summary.packageMonthlyPrice}
        selectedAddons={summary.selectedAddons}
        addonsSetupTotal={String(addonsSetupTotal)}
        addonsMonthlyTotal={String(addonsMonthlyTotal)}
        totalSetupPrice={summary.paymentAttemptSetupAmount}
        totalMonthlyPrice={totalMonthly}
        paymentReference={summary.paymentReference}
        />
    </AppShell>
    );
}