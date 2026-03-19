"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import VolumeOperationsForm from "@/components/onboarding/VolumeOperationsForm";

export default function VolumeOperationsPage() {
  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
  });

  useEffect(() => {
    const businessProfileRaw = sessionStorage.getItem("nexoru_business_profile");
    const primaryGoalRaw = sessionStorage.getItem("nexoru_primary_goal");

    if (businessProfileRaw) {
      try {
        const businessProfile = JSON.parse(businessProfileRaw);

        setSummary((prev) => ({
          ...prev,
          businessName: businessProfile.commercialName || "Pendiente",
          industry: businessProfile.industry || "Pendiente",
        }));
      } catch (error) {
        console.error("Error reading business profile", error);
      }
    }

    if (primaryGoalRaw) {
      try {
        const primaryGoal = JSON.parse(primaryGoalRaw);

        setSummary((prev) => ({
          ...prev,
          goal: primaryGoal.goalLabel || "Pendiente",
          packageName: primaryGoal.suggestedPackage || "Pendiente",
        }));
      } catch (error) {
        console.error("Error reading primary goal", error);
      }
    }
  }, []);

  return (
    <AppShell
      step={5}
      totalSteps={5}
      progress={80}
      summary={{
        businessName: summary.businessName,
        industry: summary.industry,
        goal: summary.goal,
        packageName: summary.packageName,
      }}
    >
      <VolumeOperationsForm />
    </AppShell>
  );
}