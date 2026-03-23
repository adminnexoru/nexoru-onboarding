"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import ScopeConfirmationCard from "@/components/onboarding/ScopeConfirmationCard";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type SummaryState = {
  businessName: string;
  industry: string;
  goal: string;
  packageName: string;
};

type ScopePageData = {
  packageName: string;
  includedItems: string[];
  excludedItems: string[];
  optionalAddons: {
    id: string;
    code: string;
    name: string;
    description: string;
    priceType: string;
    priceAmount: string | null;
  }[];
  acceptedScope: boolean;
  selectedAddonIds: string[];
};

export default function ScopeConfirmationPage() {
  const router = useRouter();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [summary, setSummary] = useState<SummaryState>({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
  });

  const [scopeData, setScopeData] = useState<ScopePageData>({
    packageName: "Pendiente",
    includedItems: [],
    excludedItems: [],
    optionalAddons: [],
    acceptedScope: false,
    selectedAddonIds: [],
  });

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      router.push("/onboarding/start");
      return;
    }

    setSessionToken(token);

    const loadSession = async () => {
      try {
        const response = await fetch(`/api/onboarding/session/${token}`);
        const result = await response.json();

        if (!response.ok || !result?.ok) {
          router.push("/onboarding/start");
          return;
        }

        const session = result.data;

        setSummary({
          businessName:
            session.businessProfile?.commercialName || "Pendiente",
          industry: session.businessProfile?.industry || "Pendiente",
          goal: session.primaryGoal?.primaryGoalLabel || "Pendiente",
          packageName: session.recommendedPackage?.name || "Pendiente",
        });

        setScopeData({
          packageName: session.recommendedPackage?.name || "Pendiente",
          includedItems:
            session.recommendedPackage?.includedItems?.map(
              (item: { label: string }) => item.label
            ) || [],
          excludedItems:
            session.recommendedPackage?.excludedItems?.map(
              (item: { label: string }) => item.label
            ) || [],
          optionalAddons:
            session.recommendedPackage?.packageAddons?.map(
              (item: {
                addon: {
                  id: string;
                  code: string;
                  name: string;
                  description?: string | null;
                  priceType: string;
                  priceAmount?: string | null;
                };
              }) => ({
                id: item.addon.id,
                code: item.addon.code,
                name: item.addon.name,
                description: item.addon.description ?? "",
                priceType: item.addon.priceType,
                priceAmount: item.addon.priceAmount ?? null,
              })
            ) || [],
          acceptedScope: !!session.scopeConfirmation?.acceptedScope,
          selectedAddonIds:
            session.selectedAddons?.map(
              (item: { addonId: string }) => item.addonId
            ) || [],
        });
      } catch (error) {
        console.error("SCOPE_CONFIRMATION_LOAD_ERROR:", error);
        router.push("/onboarding/start");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [router]);

  return (
    <AppShell
      step={5}
      totalSteps={5}
      progress={95}
      summary={summary}
      isLoading={isLoading}
    >
      <ScopeConfirmationCard
        sessionToken={sessionToken ?? ""}
        packageName={scopeData.packageName}
        includedItems={scopeData.includedItems}
        excludedItems={scopeData.excludedItems}
        optionalAddons={scopeData.optionalAddons}
        initialAcceptedScope={scopeData.acceptedScope}
        initialSelectedAddonIds={scopeData.selectedAddonIds}
        onBack={() => router.push("/onboarding/package-recommendation")}
        onSuccess={() => router.push("/onboarding/payment")}
      />
    </AppShell>
  );
}