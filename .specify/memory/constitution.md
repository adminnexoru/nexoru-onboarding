<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Modified principles: N/A (initial ratification)
- Added principles:
  - I. Minimal Operational Cost
  - II. Comunicación Directa, Sin Intermediarios
  - III. Supabase Como Única Fuente de Verdad
  - IV. Adaptador Único de IA y Selección de Modelo por Costo
  - V. Seguridad y Privacidad por Defecto
- Added sections: Calidad y Flujo de Entrega, Governance
- Removed sections: none (template placeholders replaced; no third additional
  section was needed beyond Core Principles + Calidad y Flujo de Entrega)
- Templates requiring follow-up: none checked in this pass (out of scope per
  the constitution command's Scope Guard — dependent templates read this file
  at runtime and are not modified here)
- Deferred TODOs: none
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
prospectos MUST cumplir el aviso de privacidad vigente del negocio.

Rationale: Nexoru maneja datos personales de prospectos de terceros; una fuga
de credenciales o de PII compromete tanto a Nexoru como a sus clientes.

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

**Version**: 1.0.0 | **Ratified**: 2026-09-24 | **Last Amended**: 2026-09-24
