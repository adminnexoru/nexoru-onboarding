"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import BusinessProfileForm from "@/components/onboarding/BusinessProfileForm";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type BusinessProfileData = {
  legalName: string;
  commercialName: string;
  industry: string;
  country: string;
  city: string;
  websiteOrInstagram: string;
  whatsapp: string;
  operatingHours: string;
};

const emptyBusinessProfile: BusinessProfileData = {
  legalName: "",
  commercialName: "",
  industry: "",
  country: "",
  city: "",
  websiteOrInstagram: "",
  whatsapp: "",
  operatingHours: "",
};

export default function BusinessProfilePage() {
  const [sessionToken, setSessionToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [initialValues, setInitialValues] =
    useState<BusinessProfileData>(emptyBusinessProfile);

  const [summary, setSummary] = useState({
    businessName: "",
    industry: "",
    goal: "",
    packageName: "",
  });

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      window.location.href = "/onboarding/start";
      return;
    }

    setSessionToken(token);

    const loadSession = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(`/api/onboarding/session/${token}`);
        const result = await response.json();

        if (!response.ok || !result?.ok) {
          throw new Error(result?.error || "No fue posible cargar la sesión");
        }

        const session = result.data;

        const businessProfile = session.businessProfile;

        if (businessProfile) {
          const nextValues = {
            legalName: businessProfile.legalName || "",
            commercialName: businessProfile.commercialName || "",
            industry: businessProfile.industry || "",
            country: businessProfile.country || "",
            city: businessProfile.city || "",
            websiteOrInstagram: businessProfile.websiteOrInstagram || "",
            whatsapp: businessProfile.whatsapp || "",
            operatingHours: businessProfile.operatingHours || "",
          };

          setInitialValues(nextValues);
          setSummary((prev) => ({
            ...prev,
            businessName: nextValues.commercialName || "Pendiente",
            industry: nextValues.industry || "Pendiente",
          }));
        }
      } catch (err) {
        console.error(err);
        setLoadError("No fue posible cargar la sesión actual.");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  if (loading) {
    return (
      <AppShell
        step={2}
        totalSteps={5}
        progress={20}
        summary={summary}
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-gray-500">Cargando sesión...</p>
        </div>
      </AppShell>
    );
  }

  if (loadError) {
    return (
      <AppShell
        step={2}
        totalSteps={5}
        progress={20}
        summary={summary}
      >
        <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-red-600">{loadError}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      step={2}
      totalSteps={5}
      progress={20}
      summary={summary}
    >
      <BusinessProfileForm
        sessionToken={sessionToken}
        initialValues={initialValues}
        onSummaryChange={(data) => {
          setSummary((prev) => ({
            ...prev,
            businessName: data.businessName || prev.businessName,
            industry: data.industry || prev.industry,
          }));
        }}
      />
    </AppShell>
  );
}