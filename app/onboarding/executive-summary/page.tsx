"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import ExecutiveSummaryCard from "@/components/onboarding/ExecutiveSummaryCard";

export default function ExecutiveSummaryPage() {
  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
    setupPrice: "-",
    monthlyPrice: "-",
    selectedAddons: [] as string[],
  });

  useEffect(() => {
    const businessProfileRaw = sessionStorage.getItem("nexoru_business_profile");
    const primaryGoalRaw = sessionStorage.getItem("nexoru_primary_goal");
    const packageRecommendationRaw = sessionStorage.getItem(
      "nexoru_package_recommendation"
    );
    const scopeConfirmationRaw = sessionStorage.getItem(
      "nexoru_scope_confirmation"
    );

    let businessProfile: any = null;
    let primaryGoal: any = null;
    let packageRecommendation: any = null;
    let scopeConfirmation: any = null;

    if (businessProfileRaw) {
      try {
        businessProfile = JSON.parse(businessProfileRaw);
      } catch (error) {
        console.error("Error reading business profile", error);
      }
    }

    if (primaryGoalRaw) {
      try {
        primaryGoal = JSON.parse(primaryGoalRaw);
      } catch (error) {
        console.error("Error reading primary goal", error);
      }
    }

    if (packageRecommendationRaw) {
      try {
        packageRecommendation = JSON.parse(packageRecommendationRaw);
      } catch (error) {
        console.error("Error reading package recommendation", error);
      }
    }

    if (scopeConfirmationRaw) {
      try {
        scopeConfirmation = JSON.parse(scopeConfirmationRaw);
      } catch (error) {
        console.error("Error reading scope confirmation", error);
      }
    }

    setSummary({
      businessName: businessProfile?.commercialName || "Pendiente",
      industry: businessProfile?.industry || "Pendiente",
      goal: primaryGoal?.goalLabel || "Pendiente",
      packageName: packageRecommendation?.packageName || "Pendiente",
      setupPrice: packageRecommendation?.setupPrice || "-",
      monthlyPrice: packageRecommendation?.monthlyPrice || "-",
      selectedAddons: scopeConfirmation?.selectedAddons || [],
    });
  }, []);

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
        setupPrice={summary.setupPrice}
        monthlyPrice={summary.monthlyPrice}
        selectedAddons={summary.selectedAddons}
      />
    </AppShell>
  );
}