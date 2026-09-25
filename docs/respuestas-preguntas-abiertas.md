# Answers to open questions from `docs/analisis-solucion-actual.md`

**Source for questions 1, 2, 3, 5, 7, 9**: the six screenshots in `docs/legacy/`, reviewed individually. They cover two ManyChat automations ("Busca Agenda" and "Confirma Agenda") and one Zapier zap ("Confirma Agenda"). None of them show the initial lead-qualification conversation — they only cover the scheduling/reference-confirmation part of the flow. Anything not visible in these six images is marked as such below rather than guessed.

Numbering matches section 6 of `docs/analisis-solucion-actual.md`.

## 1. What does the current WhatsApp/ManyChat conversation actually ask, in what order, and in what words?

These screenshots only show the **scheduling-confirmation** portion of the flow, not the initial qualification conversation (industry/need/urgency/budget) — that part remains unanswered, not visible in any of the six images.

What is visible, across two ManyChat automations under `Whatsapp` in the "Nexoru Business Op..." workspace:

- **"Busca Agenda"** (`docs/legacy/Captura desde 2026-09-24 16-00-22.png`) — triggers on either of two inbound-message conditions ("El usuario envía un mensaje" — one marked "Deshabilitado" with a default response, the other firing when "El mensaje contiene referencia, sesión"). It then branches on a contact tag condition: `Etiqueta es AGENDADO`, `Etiqueta es RESERVA_NO_ENCONTRADA`, or no match. On the AGENDADO branch it sends: *"{m_contact_name} tu sesión sigue confirmada: Referencia: {m_reference} 📅{m_date_pritty} ⏰{m_time_pritty} 🔗https://mc.ht/s/XXXXXX Nos vemos ahí 🚀"*. On the other two branches it sends *"estoy validando tu referencia, un momento por favor 🙏"* and/or *"👋 Hola, {first_name}! Gracias por contactarnos, estoy validando tu referencia, un momento por favor 🙏"*, then calls an "Acciones" step that sets a user field (`entrada_usuario`) from the last text input and fires an external request to `https://hooks.zapier.com/hooks/…` (URL cut off in the screenshot, see question 3 and 9).
- **"Confirma Agenda"** (`docs/legacy/Captura desde 2026-09-24 15-58-32.png` and `docs/legacy/Captura desde 2026-09-24 16-03-51.png`, ManyChat side) — triggers on "Se produce un evento de contactos / Etiqueta aplicada", removes the `RESERVA_NO_ENCONTRADA` tag, then sends: *"Perfecto 🔥 {m_contact_name} tu sesión está confirmada: Referencia: {m_reference} 📅{m_date_pritty} ⏰{m_time_pritty} 🔗https://mc.ht/s/XXXXXX Nos vemos ahí 🚀"* (9 sent, 100% delivered, 11.1% clicked per the screenshot's own stats panel).

**No visible**: the actual first message(s) a new prospect receives, any question about business/industry/need, and anything upstream of "the user already has (or is missing) a reference/session tag."

## 2. Does the current WhatsApp flow capture urgency and/or an estimated budget today?

**No visible.** Neither field, nor any synonym for them, appears in any condition tag, message template, or field name across all six screenshots (`AGENDADO`, `RESERVA_NO_ENCONTRADA`, `m_contact_name`, `m_reference`, `m_date_pritty`, `m_time_pritty`, `entrada_usuario`, `first_name` are the only field/tag names visible anywhere). This only proves they're absent from the scheduling-confirmation flow shown here — the initial qualification conversation itself is not covered by these screenshots, so this cannot rule out those fields being captured earlier in a step not screenshotted.

## 3. What is actually inside the Zapier zaps, if any are still active?

Partially answered. `docs/legacy/Captura desde 2026-09-24 16-03-51.png`, `Captura desde 2026-09-24 16-03-57.png`, and `Captura desde 2026-09-24 16-04-01.png` show one active zap, editable at `zapier.com/editor/00000000-0000-c000-8000-000356971174`, named **"Confirma Agenda"** in the **"Nexoru"** Zapier folder, version "v2, 'V1.2'", **last edited/in use by "Ulises I." on 31 mar 2026** (also answers part of question 8: Ulises has direct edit access to this Zap). Its step structure, as far as the collapsed step list shows:

1. Webhooks by Zapier — Catch Hook
2. Formatter by Zapier — Text
3. Webhooks by Zapier — GET
4. Paths — Split into paths, branching into:
   - **Path A**: 5. Path conditions → 6. Code by Zapier (Run Javascript) → 7. Webhooks by Zapier (POST) → 8. Webhooks by Zapier (POST Date) → 9. Webhooks by Zapier (POST Time) → 10. Webhooks by Zapier (POST Meet) → 11. Webhooks by Zapier (POST Reference) → 12. Webhooks by Zapier (POST) → 13. Webhooks by Zapier (Custom Request)
   - **Path B**: 14. Path conditions → 15. Webhooks by Zapier (Custom Request)

**No visible**: none of the three screenshots show an expanded step — the actual JavaScript inside step 6, the request URLs/payloads for any of the GET/POST/Custom Request steps (7–13, 15), or the branch conditions for Path A/Path B. The step *names* ("POST Date", "POST Time", "POST Meet", "POST Reference") strongly suggest this zap is what ultimately calls this repo's booking endpoints, but the destination host/path of any given step is not visible.

## 4. Is Google Sheets still being written to today, by what, and is Supabase already in use anywhere outside this repo?

Supabase (proyecto appnexoru) es el proveedor de Postgres; la app accede vía Prisma, no vía supabase-js. La constitución se refiere a esta misma base.

## 5. What LLM/prompt does the live WhatsApp agent use for its own conversation and its own qualification logic, if any?

**No visible.** None of the six screenshots show ManyChat's "IA de Manychat" section open (it's visible only as an unopened sidebar item in every ManyChat screenshot), any AI/LLM step inside either automation, or any prompt text. The Zapier zap's only logic-bearing step is "6. Code by Zapier (Run Javascript)," whose contents are not visible — it may or may not call an LLM, but nothing in the screenshot confirms either way.

## 6. What is the actual measured cost per conversation today?

Pendiente de Ulises.

## 7. Does `admin@nexoru.ai` notification already happen somewhere (e.g., inside ManyChat/Zapier) today, or is this a net-new requirement?

**No visible automated notification step.** Every ManyChat screenshot shows a Gmail tab titled "Recibidos (41) - admin@…" open in the browser during the capture — this only confirms that inbox was open at the time, not that any flow sends mail to it. No "Email by Zapier," "Gmail," or similar mail-sending action appears in any of the visible ManyChat automation steps or in the 15-step Zapier zap structure from question 3.

## 8. Who is "Ulises" operationally?

Pendiente de Ulises.

*(Partial, incidental data point from question 3: the Zapier zap "Confirma Agenda" was last edited by/is in use by an account labeled "Ulises I." — this establishes he has direct edit access to the Zapier account, but not his operational role as an escalation point, contact channel, or handoff mechanism.)*

## 9. Is the `wa.me` deep-link → ManyChat → `update-meeting` flow the only way WhatsApp and this backend currently connect, or are there other integration points?

Partially answered: the screenshots confirm ManyChat → Zapier is a real, additional hop not previously visible from code alone — the "Busca Agenda" automation's "Acciones" step fires a "Solicitud externa" to `https://hooks.zapier.com/hooks/…` (`docs/legacy/Captura desde 2026-09-24 16-00-22.png`), and the "Confirma Agenda" zap then makes at least seven further outbound HTTP calls (steps 7–13 and 15 from question 3).

**No visible**: the destination(s) of any of those outbound calls. They may all target this repo's API (e.g. `/api/update-meeting` or `/api/onboarding/schedule/*`), a different backend, or a mix — the screenshots don't show enough to confirm or rule out additional integration points beyond "ManyChat calls one Zapier webhook, and that zap makes several more HTTP calls somewhere."
