import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/lib/api/responses";

export type SerializedDate = Date | string;
export type SerializedDecimal = string | null;

export type SerializedBusinessProfile = {
  id: string;
  sessionId: string;
  legalName: string;
  commercialName: string;
  industry: string;
  country: string;
  city: string;
  websiteOrInstagram: string;
  whatsapp: string;
  operatingHours: string;
  createdAt: SerializedDate;
  updatedAt: SerializedDate;
};

export type SerializedPrimaryGoal = {
  id: string;
  sessionId: string;
  primaryGoalCode: string;
  primaryGoalLabel: string;
  primaryGoalDescription: string;
  createdAt: SerializedDate;
  updatedAt: SerializedDate;
};

export type SerializedSecondaryNeed = {
  id: string;
  sessionId: string;
  needCode: string;
  needLabel: string;
  createdAt: SerializedDate;
};

export type SerializedCurrentProcess = {
  id: string;
  sessionId: string;
  currentProcess: string;
  manualSteps: string;
  toolsUsed: string;
  painPoints: string;
  createdAt: SerializedDate;
  updatedAt: SerializedDate;
};

export type SerializedVolumeOperations = {
  id: string;
  sessionId: string;
  monthlyConversations: number | null;
  monthlyTickets: number | null;
  monthlyBookings: number | null;
  averageTicketValue: SerializedDecimal;
  teamSizeOperating: number;
  peakDemandNotes: string;
  createdAt: SerializedDate;
  updatedAt: SerializedDate;
};

export type SerializedSelectedAddon = {
  id: string;
  sessionId: string;
  addonId: string;
  createdAt: SerializedDate;
  addon: {
    id: string;
    code: string;
    name: string;
    description: string;
    setupPrice: SerializedDecimal;
    monthlyPrice: SerializedDecimal;
  };
};

export type SerializedScopeConfirmation = {
  id: string;
  sessionId: string;
  acceptedScope: boolean;
  confirmedAt: SerializedDate;
};

export type SerializedPaymentAttempt = {
  id: string;
  sessionId: string;
  provider: string;
  status: string;
  setupAmount: SerializedDecimal;
  paymentReference: string | null;
  paymentUrl: string | null;
  createdAt: SerializedDate;
  updatedAt: SerializedDate;
};

export type SerializedPackageIncludedItem = {
  id: string;
  packageId: string;
  label: string;
  sortOrder: number;
};

export type SerializedPackageExcludedItem = {
  id: string;
  packageId: string;
  label: string;
  sortOrder: number;
};

export type SerializedPackageAddon = {
  id: string;
  packageId: string;
  addonId: string;
  addon: {
    id: string;
    code: string;
    name: string;
    description: string;
    setupPrice: SerializedDecimal;
    monthlyPrice: SerializedDecimal;
  };
};

export type SerializedRecommendedPackage = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  setupPrice: SerializedDecimal;
  monthlyPrice: SerializedDecimal;
  isActive: boolean;
  sortOrder: number;
  createdAt: SerializedDate;
  updatedAt: SerializedDate;
  includedItems: SerializedPackageIncludedItem[];
  excludedItems: SerializedPackageExcludedItem[];
  packageAddons: SerializedPackageAddon[];
};

export type SerializedOnboardingSession = {
  id: string;
  sessionToken: string;
  status: string;
  currentStep: string;
  organizationId: string | null;
  recommendedPackageId: string | null;
  setupPriceSnapshot: SerializedDecimal;
  monthlyPriceSnapshot: SerializedDecimal;
  createdAt: SerializedDate;
  updatedAt: SerializedDate;
  businessProfile: SerializedBusinessProfile | null;
  primaryGoal: SerializedPrimaryGoal | null;
  secondaryNeeds: SerializedSecondaryNeed[];
  currentProcess: SerializedCurrentProcess | null;
  volumeOperations: SerializedVolumeOperations | null;
  selectedAddons: SerializedSelectedAddon[];
  scopeConfirmation: SerializedScopeConfirmation | null;
  paymentAttempts: SerializedPaymentAttempt[];
  recommendedPackage: SerializedRecommendedPackage | null;
};

export type GetOnboardingSessionResponse =
  ApiSuccessResponse<SerializedOnboardingSession>;

export type OnboardingApiErrorResponse = ApiErrorResponse;