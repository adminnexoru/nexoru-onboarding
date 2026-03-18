"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import BusinessProfileForm from "@/components/onboarding/BusinessProfileForm";

export default function BusinessProfilePage() {
  const [summary, setSummary] = useState({
    businessName: "",
    industry: "",
    goal: "",
    packageName: "",
  });

  return (
    <AppShell
      step={2}
      totalSteps={5}
      progress={20}
      summary={{
        businessName: summary.businessName,
        industry: summary.industry,
        goal: summary.goal,
        packageName: summary.packageName,
      }}
    >
      <BusinessProfileForm
        onSummaryChange={({ businessName, industry }) =>
          setSummary((prev) => ({
            ...prev,
            businessName: businessName || "",
            industry: industry || "",
          }))
        }
      />
    </AppShell>
  );
}