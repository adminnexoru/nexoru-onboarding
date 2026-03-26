-- CreateEnum
CREATE TYPE "OnboardingMeetingStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "OnboardingMeeting" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "organizationId" TEXT,
    "meetingReference" TEXT NOT NULL,
    "status" "OnboardingMeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "scheduledEndAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "calendarEventId" TEXT,
    "calendarHtmlLink" TEXT,
    "googleMeetLink" TEXT,
    "contactNameSnapshot" TEXT NOT NULL,
    "contactWhatsappSnapshot" TEXT NOT NULL,
    "contactEmailSnapshot" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingMeeting_sessionId_key" ON "OnboardingMeeting"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingMeeting_meetingReference_key" ON "OnboardingMeeting"("meetingReference");

-- CreateIndex
CREATE INDEX "OnboardingMeeting_scheduledAt_idx" ON "OnboardingMeeting"("scheduledAt");

-- CreateIndex
CREATE INDEX "OnboardingMeeting_status_idx" ON "OnboardingMeeting"("status");

-- AddForeignKey
ALTER TABLE "OnboardingMeeting" ADD CONSTRAINT "OnboardingMeeting_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
