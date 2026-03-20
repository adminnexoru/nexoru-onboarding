-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('STARTED', 'IN_PROGRESS', 'SCOPE_CONFIRMED', 'PAYMENT_READY', 'PAYMENT_INITIATED');

-- CreateEnum
CREATE TYPE "AddonPriceType" AS ENUM ('ONE_TIME', 'MONTHLY', 'CUSTOM');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "legalName" TEXT,
    "commercialName" TEXT,
    "industry" TEXT,
    "country" TEXT,
    "city" TEXT,
    "websiteOrInstagram" TEXT,
    "whatsapp" TEXT,
    "operatingHours" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'STARTED',
    "currentStep" TEXT NOT NULL DEFAULT 'start',
    "organizationId" TEXT,
    "recommendedPackageId" TEXT,
    "setupPriceSnapshot" DECIMAL(10,2),
    "monthlyPriceSnapshot" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingBusinessProfile" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "legalName" TEXT,
    "commercialName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "websiteOrInstagram" TEXT,
    "whatsapp" TEXT NOT NULL,
    "operatingHours" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingBusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingPrimaryGoal" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "primaryGoalCode" TEXT NOT NULL,
    "primaryGoalLabel" TEXT NOT NULL,
    "suggestedPackageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingPrimaryGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingSecondaryNeed" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "needCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingSecondaryNeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingCurrentProcess" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "processDescription" TEXT NOT NULL,
    "manualSteps" TEXT,
    "currentTools" TEXT,
    "painPoints" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingCurrentProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingVolumeOperations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "monthlyConversations" INTEGER,
    "monthlyTickets" INTEGER,
    "monthlyBookings" INTEGER,
    "averageTicketValue" DECIMAL(10,2),
    "teamSizeOperating" INTEGER NOT NULL,
    "peakDemandNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingVolumeOperations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "setupPrice" DECIMAL(10,2) NOT NULL,
    "monthlyPrice" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageIncludedItem" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PackageIncludedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageExcludedItem" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PackageExcludedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceType" "AddonPriceType" NOT NULL,
    "priceAmount" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageAddon" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,

    CONSTRAINT "PackageAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingSelectedAddon" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingSelectedAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageRecommendationRule" (
    "id" TEXT NOT NULL,
    "goalCode" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "minConversations" INTEGER,
    "maxConversations" INTEGER,
    "minTickets" INTEGER,
    "maxTickets" INTEGER,
    "minBookings" INTEGER,
    "maxBookings" INTEGER,
    "minTeamSize" INTEGER,
    "maxTeamSize" INTEGER,
    "notes" TEXT,

    CONSTRAINT "PackageRecommendationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeConfirmation" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "acceptedScope" BOOLEAN NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScopeConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAttempt" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "setupAmount" DECIMAL(10,2) NOT NULL,
    "paymentReference" TEXT,
    "paymentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingSession_sessionToken_key" ON "OnboardingSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingBusinessProfile_sessionId_key" ON "OnboardingBusinessProfile"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingPrimaryGoal_sessionId_key" ON "OnboardingPrimaryGoal"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingSecondaryNeed_sessionId_needCode_key" ON "OnboardingSecondaryNeed"("sessionId", "needCode");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingCurrentProcess_sessionId_key" ON "OnboardingCurrentProcess"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingVolumeOperations_sessionId_key" ON "OnboardingVolumeOperations"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Package_code_key" ON "Package"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Addon_code_key" ON "Addon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PackageAddon_packageId_addonId_key" ON "PackageAddon"("packageId", "addonId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingSelectedAddon_sessionId_addonId_key" ON "OnboardingSelectedAddon"("sessionId", "addonId");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeConfirmation_sessionId_key" ON "ScopeConfirmation"("sessionId");

-- AddForeignKey
ALTER TABLE "OnboardingSession" ADD CONSTRAINT "OnboardingSession_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingSession" ADD CONSTRAINT "OnboardingSession_recommendedPackageId_fkey" FOREIGN KEY ("recommendedPackageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingBusinessProfile" ADD CONSTRAINT "OnboardingBusinessProfile_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingPrimaryGoal" ADD CONSTRAINT "OnboardingPrimaryGoal_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingPrimaryGoal" ADD CONSTRAINT "OnboardingPrimaryGoal_suggestedPackageId_fkey" FOREIGN KEY ("suggestedPackageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingSecondaryNeed" ADD CONSTRAINT "OnboardingSecondaryNeed_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingCurrentProcess" ADD CONSTRAINT "OnboardingCurrentProcess_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingVolumeOperations" ADD CONSTRAINT "OnboardingVolumeOperations_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageIncludedItem" ADD CONSTRAINT "PackageIncludedItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageExcludedItem" ADD CONSTRAINT "PackageExcludedItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageAddon" ADD CONSTRAINT "PackageAddon_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageAddon" ADD CONSTRAINT "PackageAddon_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingSelectedAddon" ADD CONSTRAINT "OnboardingSelectedAddon_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingSelectedAddon" ADD CONSTRAINT "OnboardingSelectedAddon_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageRecommendationRule" ADD CONSTRAINT "PackageRecommendationRule_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeConfirmation" ADD CONSTRAINT "ScopeConfirmation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
