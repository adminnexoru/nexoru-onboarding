import { z } from "zod";

export const createOnboardingSessionSchema = z.object({
  source: z.string().optional(),
});

export const sessionTokenParamsSchema = z.object({
  token: z.string().min(10),
});

export const businessProfilePayloadSchema = z.object({
  sessionToken: z.string().min(10),
  businessProfile: z.object({
    legalName: z.string().trim().optional().nullable(),
    commercialName: z.string().trim().min(1, "Commercial name is required"),
    industry: z.string().trim().min(1, "Industry is required"),
    country: z.string().trim().min(1, "Country is required"),
    city: z.string().trim().min(1, "City is required"),
    websiteOrInstagram: z.string().trim().optional().nullable(),
    whatsapp: z.string().trim().min(1, "WhatsApp is required"),
    operatingHours: z.string().trim().optional().nullable(),
  }),
});

export type BusinessProfilePayload = z.infer<
  typeof businessProfilePayloadSchema
>;