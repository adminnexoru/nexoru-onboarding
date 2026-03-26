"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import ScheduleSessionCard from "@/components/onboarding/ScheduleSessionCard";
import ScheduleSessionPageSkeleton from "@/components/onboarding/ScheduleSessionPageSkeleton";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type ExistingMeetingResponse = {
  ok: boolean;
  data?: {
    meeting?: {
      id: string;
      meetingReference: string;
      status: string;
    } | null;
  };
};

type SummaryState = {
  businessName: string;
  industry: string;
  goal: string;
  packageName: string;
};

type Slot = {
  start: string;
  end: string;
  label: string;
};

type AvailabilityResponse = {
  ok: boolean;
  data?: {
    date: string;
    timezone: string;
    durationMinutes: number;
    slots: Slot[];
  };
};

type SessionResponse = {
  ok: boolean;
  data?: {
    businessProfile?: {
      commercialName?: string | null;
      industry?: string | null;
    } | null;
    primaryGoal?: {
      primaryGoalLabel?: string | null;
    } | null;
    recommendedPackage?: {
      name?: string | null;
    } | null;
  };
};

function getTodayInMexico() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

export default function ScheduleSessionPage() {
  const router = useRouter();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [summary, setSummary] = useState<SummaryState>({
    businessName: "",
    industry: "",
    goal: "",
    packageName: "",
  });

  const [selectedDate, setSelectedDate] = useState(getTodayInMexico());
  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
  const token = getOnboardingSessionToken();

  if (!token) {
    router.push("/onboarding/start");
    return;
  }

  setSessionToken(token);

  Promise.all([
    fetch(`/api/onboarding/session/${token}`, {
      cache: "no-store",
    }).then((res) => res.json()),
    fetch(`/api/onboarding/schedule/${token}`, {
      cache: "no-store",
    }).then((res) => res.json()).catch(() => null),
  ])
    .then(([sessionRes, meetingRes]: [SessionResponse, ExistingMeetingResponse | null]) => {
      if (!sessionRes?.ok || !sessionRes.data) {
        router.push("/onboarding/start");
        return;
      }

      if (meetingRes?.ok && meetingRes.data?.meeting?.status === "SCHEDULED") {
        router.push("/onboarding/schedule-confirmation");
        return;
      }

      setSummary({
        businessName: sessionRes.data.businessProfile?.commercialName || "Pendiente",
        industry: sessionRes.data.businessProfile?.industry || "Pendiente",
        goal: sessionRes.data.primaryGoal?.primaryGoalLabel || "Pendiente",
        packageName: sessionRes.data.recommendedPackage?.name || "Pendiente",
      });
    })
    .catch(() => {
      router.push("/onboarding/start");
    })
    .finally(() => {
      setIsPageLoading(false);
    });
}, [router]);

  useEffect(() => {
  if (!selectedDate || !sessionToken) return;

  const controller = new AbortController();

  const loadAvailability = async () => {
    try {
      setIsLoadingSlots(true);
      setSubmitError("");
      setSelectedSlot(null);

      const response = await fetch(
        `/api/onboarding/schedule/availability?sessionToken=${encodeURIComponent(
          sessionToken
        )}&date=${encodeURIComponent(selectedDate)}`,
        {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        }
      );

      const result =
        (await response.json().catch(() => null)) as AvailabilityResponse | null;

      if (!response.ok || !result?.ok || !result.data) {
        throw new Error("No fue posible cargar disponibilidad.");
      }

      setTimezone(result.data.timezone);
      setDurationMinutes(result.data.durationMinutes);
      setSlots(result.data.slots || []);
    } catch (error) {
      if (controller.signal.aborted) return;

      console.error("SCHEDULE_AVAILABILITY_LOAD_ERROR:", error);
      setSlots([]);
      setSubmitError("No fue posible cargar los horarios disponibles.");
    } finally {
      if (!controller.signal.aborted) {
        setIsLoadingSlots(false);
      }
    }
  };

  loadAvailability();

  return () => controller.abort();
}, [selectedDate, sessionToken]);

  const canSubmit = useMemo(() => {
    return !!selectedSlot && !isSubmitting && !isLoadingSlots;
  }, [selectedSlot, isSubmitting, isLoadingSlots]);

  const handleSubmit = async () => {
    if (!sessionToken || !selectedSlot || !canSubmit) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/onboarding/schedule/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          start: selectedSlot.start,
          end: selectedSlot.end,
          timezone,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error?.message || "No fue posible reservar la sesión."
        );
      }

      router.push("/onboarding/schedule-confirmation");
    } catch (error) {
      console.error("SCHEDULE_BOOK_ERROR:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No fue posible reservar la sesión."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <AppShell
        step={10}
        totalSteps={10}
        progress={90}
        summary={{
          businessName: "",
          industry: "",
          goal: "",
          packageName: "",
        }}
        isLoading
        hideSummary
      >
        <ScheduleSessionPageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell
      step={10}
      totalSteps={10}
      progress={90}
      summary={summary}
      hideSummary
    >
      <ScheduleSessionCard
        selectedDate={selectedDate}
        timezone={timezone}
        durationMinutes={durationMinutes}
        slots={slots}
        selectedSlot={selectedSlot}
        isLoadingSlots={isLoadingSlots}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onDateChange={setSelectedDate}
        onSelectSlot={setSelectedSlot}
        onBack={() => router.push("/onboarding/executive-summary")}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}