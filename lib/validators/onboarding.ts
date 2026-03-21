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
  secondaryNeedCodes: z.array(z.string()).default([]),
});

