<!--
Sync Impact Report
- Version change: 1.0.0 → 1.0.1 → 1.1.0
- Modified principles:
  - V. Seguridad y Privacidad por Defecto (1.0.0 → 1.0.1, PATCH, from
    branch fix/rls-supabase) — added a concrete requirement that every
    migration creating one or more tables MUST enable Row Level Security
    on each new table; rationale extended to explain why (Prisma
    connects as the `postgres` role, which bypasses RLS, but Supabase's
    auto-exposed REST/GraphQL API authenticates as `anon`/`authenticated`,
    which do not bypass RLS and receive full CRUD grants by default on
    any new public-schema table). This clarified and extended the
    existing principle's scope; it did not redefine or remove anything,
    hence PATCH.
- Added principles:
  - VI. El Wizard Como Único Punto de Calificación y Propuesta (1.0.1 →
    1.1.0, MINOR, from branch 001-whatsapp-followup-agent) — every
    catalog service is contracted through the wizard, which is the sole
    place that qualifies a prospect, generates a proposal, and schedules;
    every other channel (WhatsApp, email, landing) only informs, follows
    up, or redirects to the wizard, never qualifies or proposes on its
    own. This is a new principle (product-scope boundary, not previously
    covered by any existing principle), hence MINOR rather than PATCH.
- Added sections: none
- Removed sections: none
- Templates requiring follow-up: verified specs/001-whatsapp-followup-agent/spec.md
  for consistency with Principle VI (see that feature's /speckit-clarify
  completion report) — out of scope per this command's Scope Guard to
  edit it here even if it had been inconsistent; it was not.
- Deferred TODOs: none. Both amendments above were developed independently
  from the same 1.0.0 base on separate branches (fix/rls-supabase and
  001-whatsapp-followup-agent) and reconciled here while rebasing the
  latter onto main after fix/rls-supabase merged first. Final version is
  1.1.0, carrying both changes; no content was dropped from either side.
-->

# NEXORU Constitution

## Core Principles

### I. Minimal Operational Cost
El costo operativo del stack MUST mantenerse mínimo. Se MUST preferir servicios
con free tier que permita uso comercial. Toda nueva dependencia de pago (SaaS,
API, infraestructura) MUST incluir una justificación explícita de costo/beneficio
en el plan de la feature (`/speckit-plan`) antes de adoptarse.

Rationale: Nexoru opera con márgenes ajustados en etapa temprana; cada dependencia
de pago no justificada erosiona la viabilidad del producto.

### II. Comunicación Directa, Sin Intermediarios
Toda integración de mensajería con clientes MUST usar la WhatsApp Cloud API de
Meta de forma directa contra un webhook propio. NO se permite introducir
ManyChat, Zapier u otros intermediarios de automatización de mensajería en
flujos nuevos. Los mensajes MUST priorizarse dentro de la ventana de servicio
de 24 horas; las plantillas iniciadas por Nexoru (fuera de ventana) SOLO se
usan cuando aportan valor claro y medible al prospecto o cliente.

Rationale: Los intermediarios agregan costo recurrente, latencia y un punto de
falla externo que Nexoru no controla; el webhook propio permite auditar y
optimizar el costo por conversación.

### III. Supabase Como Única Fuente de Verdad
Supabase MUST ser el único sistema de registro para conversaciones, prospectos,
citas y propuestas. Google Sheets SOLO puede usarse como destino de exportación
de solo lectura, nunca como fuente primaria de datos ni como dependencia de un
flujo automatizado. Toda automatización (endpoints, jobs, cron) MUST
implementarse en código propio, versionado en el repositorio y gestionado bajo
Spec Kit.

Rationale: Una única fuente de verdad elimina inconsistencias entre sistemas y
hace que el estado del negocio sea auditable y reproducible desde el repositorio.

### IV. Adaptador Único de IA y Selección de Modelo por Costo
Toda llamada a un LLM MUST pasar por un único adaptador de IA; proveedor,
modelo y prompts MUST ser configurables sin cambiar código de negocio. Cada
tarea MUST usar el modelo más barato que cumpla el requisito: Haiku para
clasificación y extracción, Sonnet reservado para análisis y generación de
propuestas. Los prompts de sistema MUST usar prompt caching cuando el proveedor
lo soporte. El uso de tokens y el costo estimado por conversación MUST
registrarse en Supabase.

Rationale: Centralizar el acceso a LLMs permite cambiar de proveedor o modelo
sin reescribir lógica de negocio, y el registro de costo por conversación hace
visible el gasto de IA como métrica de producto.

### V. Seguridad y Privacidad por Defecto
Cero secretos MUST vivir en el repositorio; toda credencial MUST estar en
variables de entorno. Todo webhook MUST validar la firma de Meta antes de
procesar el payload. Los logs NO MUST contener PII sin enmascarar; los números
de teléfono MUST enmascararse antes de registrarse. El tratamiento de datos de
prospectos MUST cumplir el aviso de privacidad vigente del negocio. Toda
migración que cree una o más tablas MUST incluir `ALTER TABLE ... ENABLE ROW
LEVEL SECURITY` para cada tabla nueva.

Rationale: Nexoru maneja datos personales de prospectos de terceros; una fuga
de credenciales o de PII compromete tanto a Nexoru como a sus clientes. Prisma
se conecta a Supabase con el rol `postgres` (`BYPASSRLS = true`), por lo que
activar RLS no afecta a la aplicación; sin embargo, los roles `anon` y
`authenticated` que usa el API REST/GraphQL auto-expuesto de Supabase no
tienen `BYPASSRLS` y reciben privilegios CRUD completos por defecto en
cualquier tabla nueva de `public` — sin esta regla, cada tabla nueva nace
expuesta fuera de la aplicación.

### VI. El Wizard Como Único Punto de Calificación y Propuesta
Todo servicio del catálogo de NEXORU MUST contratarse a través de un wizard.
El wizard MUST ser el único punto donde se califica al prospecto, se genera
la propuesta y se agenda. Los demás canales (WhatsApp, correo, landing) MUST
limitarse a informar, dar seguimiento o redirigir al wizard; NO MUST
calificar ni proponer por su cuenta.

Rationale: Concentrar la calificación y la propuesta en un solo sistema evita
lógica de negocio duplicada o inconsistente entre canales, y es lo que
permite reconstruir un canal de seguimiento como WhatsApp (ver
`specs/001-whatsapp-followup-agent/spec.md`) sin depender de ManyChat/Zapier,
sin tener que replicar en él la lógica de calificación que ya vive en el
wizard.

## Calidad y Flujo de Entrega

TypeScript MUST usarse en modo estricto en todo el código nuevo. El webhook de
WhatsApp, el flujo de agendado y la generación de propuestas MUST tener
cobertura de tests. Todo cambio MUST integrarse vía rama feature + Pull Request
+ entorno de preview verificado antes de promover a producción. La interfaz y
los mensajes generados por el agente hacia el usuario final MUST estar en
español de México; el código fuente, los commits y la documentación técnica
MUST estar en inglés. Se MUST preferir la solución más simple que resuelva el
problema: no se agregan capas de abstracción, servicios o dependencias sin una
necesidad demostrada en el plan o la especificación de la feature.

## Governance

Esta constitución prevalece sobre cualquier otra práctica, plantilla o
preferencia individual dentro del repositorio. Toda modificación a este
documento MUST hacerse mediante `/speckit-constitution`, registrando un Sync
Impact Report y siguiendo versionado semántico: MAJOR para eliminación o
redefinición incompatible de un principio, MINOR para la adición de un
principio o sección, PATCH para aclaraciones o correcciones de redacción sin
cambio de sentido. Todo Pull Request MUST verificar cumplimiento de estos
principios antes de hacer merge; cualquier excepción MUST justificarse
explícitamente en la descripción del PR. Para guía operativa de desarrollo día
a día, ver `CLAUDE.md`.

**Version**: 1.1.0 | **Ratified**: 2026-09-24 | **Last Amended**: 2026-09-25
