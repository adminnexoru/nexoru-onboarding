"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import ScopeConfirmationCard from "@/components/onboarding/ScopeConfirmationCard";

function getScopeByPackage(packageName: string) {
  if (packageName === "Nexoru Base 0") {
    return {
      includedItems: [
        "Automatización básica de respuestas",
        "Menú inicial de opciones",
        "Flujos básicos de atención",
        "Registro simple de leads o contactos",
        "Base operativa mínima para crecer después",
      ],
      excludedItems: [
        "IA conversacional avanzada",
        "Integraciones complejas",
        "Pagos automatizados",
        "Lógica de loyalty o booking",
      ],
      optionalAddons: ["Base de datos", "Dashboard", "Pagos", "Campañas"],
    };
  }

  if (packageName === "Nexoru Sales OS") {
    return {
      includedItems: [
        "Automatización del flujo comercial principal",
        "Base estructurada para leads o clientes",
        "Seguimiento automatizado del proceso",
        "Configuración operativa inicial de ventas",
        "Lógica base para escalar a una operación comercial más robusta",
      ],
      excludedItems: [
        "ERP o integraciones empresariales complejas",
        "Personalizaciones fuera del flujo definido",
        "Campañas masivas avanzadas",
        "Desarrollos totalmente a medida fuera del catálogo",
      ],
      optionalAddons: [
        "Pagos",
        "Dashboard",
        "Agenda",
        "Delivery",
        "Campañas",
      ],
    };
  }

  if (packageName === "Nexoru Loyalty OS") {
    return {
      includedItems: [
        "Flujo base de registro de usuarios",
        "Operación central del programa de loyalty",
        "Base de datos estructurada para puntos y actividad",
        "Redención base",
        "Lógica inicial de operación loyalty",
      ],
      excludedItems: [
        "Integración ERP",
        "Motor promocional complejo",
        "Campañas avanzadas",
        "Customizaciones fuera del diseño del sistema",
      ],
      optionalAddons: [
        "Dashboard",
        "Campañas",
        "Pagos",
        "Envíos",
        "Automatización adicional",
      ],
    };
  }

  if (packageName === "Nexoru Booking OS") {
    return {
      includedItems: [
        "Flujo base de reservas o sesiones",
        "Control de disponibilidad inicial",
        "Registro estructurado de reservas",
        "Base operativa para confirmaciones",
        "Arquitectura inicial de booking",
      ],
      excludedItems: [
        "Integraciones enterprise",
        "Reglas avanzadas de pricing dinámico",
        "Marketplaces externos",
        "Desarrollos fuera del alcance estandarizado",
      ],
      optionalAddons: [
        "Pagos",
        "Recordatorios avanzados",
        "Dashboard",
        "Ubicación",
        "Campañas",
      ],
    };
  }

  return {
    includedItems: ["Alcance por definir"],
    excludedItems: ["Fuera de alcance por definir"],
    optionalAddons: [],
  };
}

export default function ScopeConfirmationPage() {
  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
  });

  const [scope, setScope] = useState({
    includedItems: [] as string[],
    excludedItems: [] as string[],
    optionalAddons: [] as string[],
  });

  useEffect(() => {
    const businessProfileRaw = sessionStorage.getItem("nexoru_business_profile");
    const primaryGoalRaw = sessionStorage.getItem("nexoru_primary_goal");
    const packageRecommendationRaw = sessionStorage.getItem(
      "nexoru_package_recommendation"
    );

    let businessProfile: any = null;
    let primaryGoal: any = null;
    let packageRecommendation: any = null;

    if (businessProfileRaw) {
      try {
        businessProfile = JSON.parse(businessProfileRaw);
      } catch (error) {
        console.error("Error reading business profile", error);
      }
    }

    if (primaryGoalRaw) {
      try {
        primaryGoal = JSON.parse(primaryGoalRaw);
      } catch (error) {
        console.error("Error reading primary goal", error);
      }
    }

    if (packageRecommendationRaw) {
      try {
        packageRecommendation = JSON.parse(packageRecommendationRaw);
      } catch (error) {
        console.error("Error reading package recommendation", error);
      }
    }

    const packageName = packageRecommendation?.packageName || "Pendiente";

    setSummary({
      businessName: businessProfile?.commercialName || "Pendiente",
      industry: businessProfile?.industry || "Pendiente",
      goal: primaryGoal?.goalLabel || "Pendiente",
      packageName,
    });

    setScope(getScopeByPackage(packageName));
  }, []);

  return (
    <AppShell
      step={5}
      totalSteps={5}
      progress={95}
      summary={{
        businessName: summary.businessName,
        industry: summary.industry,
        goal: summary.goal,
        packageName: summary.packageName,
      }}
    >
      <ScopeConfirmationCard
        packageName={summary.packageName}
        includedItems={scope.includedItems}
        excludedItems={scope.excludedItems}
        optionalAddons={scope.optionalAddons}
      />
    </AppShell>
  );
}