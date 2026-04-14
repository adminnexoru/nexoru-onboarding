import { z } from "zod";

export const serializedAddonSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  setupPrice: z.string().nullable(),
  monthlyPrice: z.string().nullable(),
});

export const serializedSelectedAddonSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  addonId: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  addon: serializedAddonSchema,
});

export const serializedPackageIncludedItemSchema = z.object({
  id: z.string(),
  packageId: z.string(),
  label: z.string(),
  sortOrder: z.number(),
});

export const serializedPackageExcludedItemSchema = z.object({
  id: z.string(),
  packageId: z.string(),
  label: z.string(),
  sortOrder: z.number(),
});

export const serializedPackageAddonSchema = z.object({
  id: z.string(),
  packageId: z.string(),
  addonId: z.string(),
  addon: serializedAddonSchema,
});

export const serializedRecommendedPackageSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  setupPrice: z.string().nullable(),
  monthlyPrice: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  includedItems: z.array(serializedPackageIncludedItemSchema),
  excludedItems: z.array(serializedPackageExcludedItemSchema),
  packageAddons: z.array(serializedPackageAddonSchema),
});

export const serializedBusinessProfileSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  legalName: z.string(),
  commercialName: z.string(),
  industry: z.string(),
  country: z.string(),
  city: z.string(),
  websiteOrInstagram: z.string(),
  whatsapp: z.string(),
  operatingHours: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const serializedPrimaryGoalSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  primaryGoalCode: z.string(),
  primaryGoalLabel: z.string(),
  primaryGoalDescription: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const serializedSecondaryNeedSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  needCode: z.string(),
  needLabel: z.string(),
  createdAt: z.union([z.string(), z.date()]),
});

export const serializedCurrentProcessSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  currentProcess: z.string(),
  manualSteps: z.string(),
  toolsUsed: z.string(),
  painPoints: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const serializedVolumeOperationsSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  monthlyConversations: z.number().nullable(),
  monthlyTickets: z.number().nullable(),
  monthlyBookings: z.number().nullable(),
  averageTicketValue: z.string().nullable(),
  teamSizeOperating: z.number(),
  peakDemandNotes: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const serializedScopeConfirmationSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  acceptedScope: z.boolean(),
  confirmedAt: z.union([z.string(), z.date()]),
});

export const serializedPaymentAttemptSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  provider: z.string(),
  status: z.string(),
  setupAmount: z.string(),
  paymentReference: z.string().nullable(),
  paymentUrl: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const serializedOnboardingSessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  status: z.string(),
  currentStep: z.string(),
  organizationId: z.string().nullable(),
  recommendedPackageId: z.string().nullable(),
  setupPriceSnapshot: z.string().nullable(),
  monthlyPriceSnapshot: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  businessProfile: serializedBusinessProfileSchema.nullable(),
  primaryGoal: serializedPrimaryGoalSchema.nullable(),
  secondaryNeeds: z.array(serializedSecondaryNeedSchema),
  currentProcess: serializedCurrentProcessSchema.nullable(),
  volumeOperations: serializedVolumeOperationsSchema.nullable(),
  selectedAddons: z.array(serializedSelectedAddonSchema),
  scopeConfirmation: serializedScopeConfirmationSchema.nullable(),
  paymentAttempts: z.array(serializedPaymentAttemptSchema),
  recommendedPackage: serializedRecommendedPackageSchema.nullable(),
});

export const scopeConfirmationRequestSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
  acceptedScope: z.literal(true),
  selectedAddonIds: z.array(z.string().min(1)).default([]),
});

export const scopeConfirmationResponseSchema = z.object({
  scopeConfirmation: serializedScopeConfirmationSchema,
  selectedAddons: z.array(serializedSelectedAddonSchema),
  session: z.object({
    id: z.string(),
    status: z.string(),
    currentStep: z.string(),
    updatedAt: z.union([z.string(), z.date()]),
  }),
});

export const paymentRequestSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
});

export const paymentSelectedAddonSchema = z.object({
  addonId: z.string(),
  code: z.string(),
  name: z.string(),
  setupPrice: z.string().nullable(),
  monthlyPrice: z.string().nullable(),
});

export const paymentResponseSchema = z.object({
  paymentAttempt: z.object({
    id: z.string(),
    provider: z.string(),
    status: z.string(),
    setupAmount: z.string(),
    paymentReference: z.string().nullable(),
    paymentUrl: z.string().nullable(),
    createdAt: z.union([z.string(), z.date()]),
  }),
  session: z.object({
    id: z.string(),
    currentStep: z.string(),
    status: z.string(),
  }),
  pricing: z.object({
    packageSetup: z.string(),
    addonsSetupTotal: z.string(),
    totalSetupAmount: z.string(),
  }),
  selectedAddons: z.array(paymentSelectedAddonSchema),
});

export const packageRecommendationRequestSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
});

export const packageRecommendationResponseSchema = z.object({
  packageCode: z.string().nullable(),
  packageName: z.string(),
  packageDescription: z.string(),
  setupPrice: z.string().nullable(),
  monthlyPrice: z.string().nullable(),
  rationale: z.array(z.string()),
  strategicAnalysis: z.string(),
  notes: z.string(),
  recommendationSource: z.enum(["openai", "fallback"]),
});

export const businessProfileRequestSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
  legalName: z.string().optional().default(""),
  commercialName: z.string().min(1, "El nombre comercial es obligatorio"),
  industry: z.string().min(1, "La industria es obligatoria"),
  country: z.string().min(1, "El país es obligatorio"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  websiteOrInstagram: z.string().optional().default(""),
  whatsapp: z.string().min(1, "El WhatsApp principal es obligatorio"),
  operatingHours: z.string().optional().default(""),
});

export const businessProfileResponseSchema = z.object({
  businessProfile: serializedBusinessProfileSchema,
  session: z.object({
    id: z.string(),
    currentStep: z.string(),
    status: z.string(),
    organizationId: z.string().nullable(),
    updatedAt: z.union([z.string(), z.date()]),
  }),
});

export const primaryGoalRequestSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
  primaryGoalCode: z.string().min(1, "El objetivo principal es obligatorio"),
});

export const primaryGoalResponseSchema = z.object({
  primaryGoal: serializedPrimaryGoalSchema,
  recommendedPackage: z
    .object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      setupPrice: z.string().nullable(),
      monthlyPrice: z.string().nullable(),
    })
    .nullable(),
  session: z.object({
    id: z.string(),
    currentStep: z.string(),
    status: z.string(),
    recommendedPackageId: z.string().nullable(),
    setupPriceSnapshot: z.string().nullable(),
    monthlyPriceSnapshot: z.string().nullable(),
    updatedAt: z.union([z.string(), z.date()]),
  }),
});

export const currentProcessRequestSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
  currentProcess: z.string().min(1, "El proceso actual es obligatorio"),
  manualSteps: z.string().optional().default(""),
  toolsUsed: z.string().optional().default(""),
  painPoints: z.string().optional().default(""),
});

export const currentProcessResponseSchema = z.object({
  currentProcess: serializedCurrentProcessSchema,
  session: z.object({
    id: z.string(),
    currentStep: z.string(),
    status: z.string(),
    updatedAt: z.union([z.string(), z.date()]),
  }),
});

export const volumeOperationsRequestSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
  monthlyConversations: z.number().int().min(0).nullable(),
  monthlyTickets: z.number().int().min(0).nullable(),
  monthlyBookings: z.number().int().min(0).nullable(),
  averageTicketValue: z.number().min(0).nullable(),
  teamSizeOperating: z.number().int().min(0),
  peakDemandNotes: z.string().max(2000).optional().nullable().default(""),
});

export const volumeOperationsResponseSchema = z.object({
  volumeOperations: serializedVolumeOperationsSchema,
  session: z.object({
    id: z.string(),
    currentStep: z.string(),
    status: z.string(),
    updatedAt: z.union([z.string(), z.date()]),
  }),
});

export type SerializedAddon = z.infer<typeof serializedAddonSchema>;
export type SerializedSelectedAddon = z.infer<
  typeof serializedSelectedAddonSchema
>;
export type SerializedRecommendedPackage = z.infer<
  typeof serializedRecommendedPackageSchema
>;
export type SerializedOnboardingSession = z.infer<
  typeof serializedOnboardingSessionSchema
>;
export type ScopeConfirmationRequest = z.infer<
  typeof scopeConfirmationRequestSchema
>;
export type ScopeConfirmationResponse = z.infer<
  typeof scopeConfirmationResponseSchema
>;
export type PaymentRequest = z.infer<typeof paymentRequestSchema>;
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
export type PackageRecommendationRequest = z.infer<
  typeof packageRecommendationRequestSchema
>;
export type PackageRecommendationResponse = z.infer<
  typeof packageRecommendationResponseSchema
>;
export type BusinessProfileRequest = z.infer<
  typeof businessProfileRequestSchema
>;
export type BusinessProfileResponse = z.infer<
  typeof businessProfileResponseSchema
>;
export type PrimaryGoalRequest = z.infer<typeof primaryGoalRequestSchema>;
export type PrimaryGoalResponse = z.infer<typeof primaryGoalResponseSchema>;
export type CurrentProcessRequest = z.infer<
  typeof currentProcessRequestSchema
>;
export type CurrentProcessResponse = z.infer<
  typeof currentProcessResponseSchema
>;
export type VolumeOperationsRequest = z.infer<
  typeof volumeOperationsRequestSchema
>;
export type VolumeOperationsResponse = z.infer<
  typeof volumeOperationsResponseSchema
>;