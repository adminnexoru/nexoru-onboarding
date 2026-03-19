"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PrimaryGoalSelector from "@/components/onboarding/PrimaryGoalSelector";

export default function PrimaryGoalPage() {
  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "",
    packageName: "",
  });

  useEffect(() => {
    const raw = sessionStorage.getItem("nexoru_business_profile");

    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      setSummary((prev) => ({
        ...prev,
        businessName: parsed.commercialName || "Pendiente",
        industry: parsed.industry || "Pendiente",
      }));
    } catch (error) {
      console.error("Error reading business profile from sessionStorage", error);
    }
  }, []);

  return (
    <AppShell
      step={3}
      totalSteps={5}
      progress={40}
      summary={{
        businessName: summary.businessName,
        industry: summary.industry,
        goal: summary.goal,
        packageName: summary.packageName,
      }}
    >
      <PrimaryGoalSelector
        onSummaryChange={({ goal, packageName }) =>
          setSummary((prev) => ({
            ...prev,
            goal: goal || "",
            packageName: packageName || "",
          }))
        }
      />
    </AppShell>
  );
}