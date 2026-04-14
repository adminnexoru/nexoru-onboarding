import { z } from "zod";

export const createOnboardingSessionSchema = z.object({});

export const sessionTokenParamsSchema = z.object({
  token: z.string().min(1, "Token inválido"),
});

export const businessProfilePayloadSchema = z.object({
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

export const primaryGoalPayloadSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
  primaryGoalCode: z.string().min(1, "El objetivo principal es obligatorio"),
});

export const currentProcessPayloadSchema = z.object({
  sessionToken: z.string().min(1, "sessionToken is required"),
  currentProcess: z.string().min(1, "currentProcess is required"),
  manualSteps: z.string().optional().default(""),
  toolsUsed: z.string().optional().default(""),
  painPoints: z.string().optional().default(""),
});

export const volumeOperationsPayloadSchema = z.object({
  sessionToken: z.string().min(1, "Session token is required"),
  monthlyConversations: z.number().int().min(0).nullable(),
  monthlyTickets: z.number().int().min(0).nullable(),
  monthlyBookings: z.number().int().min(0).nullable(),
  averageTicketValue: z.number().min(0).nullable(),
  teamSizeOperating: z.number().int().min(0),
  peakDemandNotes: z.string().max(2000).optional().nullable(),
});

export const packageRecommendationPayloadSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
});