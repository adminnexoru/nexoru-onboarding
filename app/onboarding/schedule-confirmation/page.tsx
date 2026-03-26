"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import ScheduleSessionPageSkeleton from "@/components/onboarding/ScheduleSessionPageSkeleton";
import ScheduleConfirmationCard from "@/components/onboarding/ScheduleConfirmationCard";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type SummaryState = {
  businessName: string;
  industry: string;
  goal: string;
  packageName: string;
};

type MeetingResponse = {
  ok: boolean;
  data?: {
    meeting?: {
      id: string;
      meetingReference: string;
      status: string;
      scheduledAt: string;
      scheduledEndAt: string;
      timezone: string;
      calendarHtmlLink: string | null;
      googleMeetLink: string | null;
    } | null;
    session?: {
      id: string;
      sessionToken: string;
      status: string;
      currentStep: string;
    };
    summary?: {
      businessName: string;
      industry: string;
      goal: string;
      packageName: string;
    };
  };
};

type MeetingItem = NonNullable<NonNullable<MeetingResponse["data"]>["meeting"]>;

export default function ScheduleConfirmationPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [summary, setSummary] = useState<SummaryState>({
    businessName: "",
    industry: "",
    goal: "",
    packageName: "",
  });

  const [meeting, setMeeting] = useState<MeetingItem | null>(null);

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      router.push("/onboarding/start");
      return;
    }

    fetch(`/api/onboarding/schedule/${token}`, {
      method: "GET",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((res: MeetingResponse) => {
        if (!res?.ok || !res.data?.meeting) {
          throw new Error("No fue posible cargar la confirmación.");
        }

        setMeeting(res.data.meeting);

        setSummary({
          businessName: res.data.summary?.businessName || "Pendiente",
          industry: res.data.summary?.industry || "Pendiente",
          goal: res.data.summary?.goal || "Pendiente",
          packageName: res.data.summary?.packageName || "Pendiente",
        });
      })
      .catch((error) => {
        console.error("SCHEDULE_CONFIRMATION_LOAD_ERROR:", error);
        setPageError("No fue posible cargar la confirmación de la sesión.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const whatsappLink = useMemo(() => {
    if (!meeting?.meetingReference) return null;

    const waNumber = process.env.NEXT_PUBLIC_NEXORU_WHATSAPP_NUMBER;

    if (!waNumber) return null;

    const cleanNumber = waNumber.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hola Nexoru, ya agendé mi sesión. Mi referencia es ${meeting.meetingReference}.`
    );

    return `https://wa.me/${cleanNumber}?text=${message}`;
  }, [meeting]);

  if (isLoading) {
    return (
      <AppShell
        step={10}
        totalSteps={10}
        progress={100}
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

  if (pageError || !meeting) {
    return (
      <AppShell
        step={10}
        totalSteps={10}
        progress={100}
        summary={summary}
        hideSummary
      >
        <div className="rounded-[28px] border border-[#FECACA] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
            {pageError || "No fue posible cargar la confirmación."}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push("/onboarding/schedule-session")}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#202430] px-6 text-sm font-semibold text-white"
            >
              Volver a agenda
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

        return (
        <AppShell
            step={10}
            totalSteps={10}
            progress={100}
            summary={summary}
            hideSummary
        >
            <ScheduleConfirmationCard
            meetingReference={meeting.meetingReference}
            scheduledAt={meeting.scheduledAt}
            scheduledEndAt={meeting.scheduledEndAt}
            timezone={meeting.timezone}
            whatsappLink={whatsappLink}
            />
        </AppShell>
        );
}