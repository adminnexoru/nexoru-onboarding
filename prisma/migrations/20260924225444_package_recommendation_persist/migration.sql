-- CreateTable
CREATE TABLE "OnboardingPackageRecommendation" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "packageCode" TEXT,
    "packageName" TEXT NOT NULL,
    "packageDescription" TEXT NOT NULL,
    "setupPrice" DECIMAL(10,2),
    "monthlyPrice" DECIMAL(10,2),
    "rationale" TEXT[],
    "strategicAnalysis" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "recommendationSource" TEXT NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "totalTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingPackageRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingPackageRecommendation_sessionId_key" ON "OnboardingPackageRecommendation"("sessionId");

-- AddForeignKey
ALTER TABLE "OnboardingPackageRecommendation" ADD CONSTRAINT "OnboardingPackageRecommendation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboardingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
