"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import BusinessProfileForm from "@/components/onboarding/BusinessProfileForm";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type BusinessProfileValues = {
  legalName: string;
  commercialName: string;
  industry: string;
  country: string;
  city: string;
  websiteOrInstagram: string;
  whatsapp: string;
  operatingHours: string;
};

const emptyBusinessProfile: BusinessProfileValues = {
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
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [initialValues, setInitialValues] =
    useState<BusinessProfileValues>(emptyBusinessProfile);

  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
  });

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      router.push("/onboarding/start");
      return;
    }

    setSessionToken(token);

    fetch(`/api/onboarding/session/${token}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res?.ok) return;

        const session = res.data;
        const businessProfile = session.businessProfile;

        setSummary({
          businessName:
            businessProfile?.commercialName ||
            session.organization?.commercialName ||
            "Pendiente",
          industry:
            businessProfile?.industry ||
            session.organization?.industry ||
            "Pendiente",
          goal: session.primaryGoal?.primaryGoalLabel || "Pendiente",
          packageName: session.recommendedPackage?.name || "Pendiente",
        });

        setInitialValues({
          legalName: businessProfile?.legalName ?? "",
          commercialName: businessProfile?.commercialName ?? "",
          industry: businessProfile?.industry ?? "",
          country: businessProfile?.country ?? "",
          city: businessProfile?.city ?? "",
          websiteOrInstagram: businessProfile?.websiteOrInstagram ?? "",
          whatsapp: businessProfile?.whatsapp ?? "",
          operatingHours: businessProfile?.operatingHours ?? "",
        });
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (values: BusinessProfileValues) => {
    if (!sessionToken) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/onboarding/business-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          ...values,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Error al guardar perfil");
      }

      setInitialValues(values);

      setSummary((prev) => ({
        ...prev,
        businessName: values.commercialName || "Pendiente",
        industry: values.industry || "Pendiente",
      }));

      router.push("/onboarding/primary-goal");
    } catch (error) {
      console.error("BUSINESS_PROFILE_ERROR:", error);
      alert("No fue posible guardar la información. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell step={2} totalSteps={5} progress={20} summary={summary}>
      <BusinessProfileForm
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        onBack={() => router.push("/onboarding/start")}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}