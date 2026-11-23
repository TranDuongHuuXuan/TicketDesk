# Project Review — TicketDesk (Week 03, Phase 1)

**Review date:** 2026-11-23  
**Purpose:** Inspect the repository and Week 02 requirements before making any system design decisions.  
**Status:** Repository and requirements review only. No design approval is implied.

## 1. Repository overview

The checked-out repository is currently a documentation/exercise workspace. The root contains `README.md`, `README-local.md`, `docs/`, `exercises/`, and `test/`. Both README files contain only the project heading `TicketDesk`. The visible `exercises/` tree contains `week-01/`; the `test/` tree has no files. The tracked project file inventory found in this review consists of README files and documentation; no application source files or build/dependency manifests were found.

Relevant documentation present:

- `docs/STAKEHOLDERS.md`
- `docs/REQUIREMENTS.md`
- `docs/USER_STORIES.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/MVP_SCOPE.md`
- Internship weekly reports and Week 01/02 evidence under `docs/internship/weekly-reports/` and `docs/screenshots/`

The requested Week 02 documents exist under `docs/`, rather than the proposed `docs/internship/` path. The Week 02 report exists under `docs/internship/weekly-reports/week_02/`.

## 2. Technology currently evidenced

| Area | Finding | Evidence / limitation |
|---|---|---|
| Frontend | Not found | No frontend source, package manifest, or framework configuration is present. |
| Backend | Not found | No backend source, Python project manifest, or framework configuration is present. |
| Database | Not found | No schema, migration, connection configuration, or database project file is present. PostgreSQL is stated as an environment/tool preference in the supplied Week 03 prompt, not evidence that this repo currently uses it. |
| Frameworks / libraries | Unknown | No dependency manifests or application source were found. Do not infer Django, React, or another framework. |
| Tests | No test files found | `test/` exists but contains no files in the inspected checkout. |
| Git remote / repository identity | Not verified here | No remote URL was used as evidence of local source contents. |

Therefore the current technology stack cannot be established from this checkout. The Rainscales Full-stack Python/Django curriculum is a stated context, not proof that TicketDesk has been implemented with Django.

## 3. Current system structure

At present, the repository exposes project documentation and week-one exercise/test directories, but no executable application structure. Consequently, there are no evidenced frontend/backend boundaries, modules, API layer, authentication component, persistence layer, or file-storage component to review. The `exercises/` and `test/` directory names alone do not establish implemented functionality.

## 4. Business capabilities identified in Week 02

Week 02 explicitly labels its requirements and stakeholder roles as preliminary, unconfirmed proposals. No interview record or mentor/customer approval is present in the reviewed materials.

The proposed user groups are customer/requester, support agent, manager, product owner/business representative, mentor, administrator, and development/testing team. The user stories primarily describe three actors: requester, support agent, and manager.

The proposed functional scope includes:

- Create a support ticket and receive a reference code.
- View ticket status and, where permitted, add information.
- Let support agents view a work queue, update status, and respond.
- Potentially classify and assign tickets, send notifications, search/filter, and show management summaries.

The proposed MVP includes ticket creation, permitted ticket/status viewing, an agent queue, status updates, and agent responses (US-01, US-03, US-05, US-06, US-07). The reference code (US-02) is conditional. Classification, assignment, notifications, advanced search/filtering, and dashboards are proposed as later or optional scope. These are not confirmed requirements.

Non-functional areas identified for clarification are privacy/security, performance, availability, usability, accessibility, audit history, and scale. No measurable thresholds or confirmed operating constraints have been specified.

## 5. Requirements-to-repository comparison

| Proposed capability | Evidence in application source | Review result |
|---|---|---|
| Ticket creation, viewing, status changes, responses | None found | No implementation can be confirmed. |
| User accounts, authentication, role permissions | None found | No implementation or access-control model can be confirmed. These are also unresolved in Week 02. |
| Categories, assignment, notifications, search, dashboard | None found | Optional/later proposals only; no implementation found. |
| Data persistence / PostgreSQL | None found | No schema or database configuration found. |
| Frontend, backend, REST API | None found | No application layers or endpoints found. |

“None found” means absent from the inspected local checkout, not evidence about an uninspected remote branch or external system.

## 6. Gaps before system design

1. **Source baseline:** Establish whether the application source is expected in this repository, another branch, or another location. Confirm the intended remote/revision if relevant.
2. **Stakeholders and approval:** Identify the business owner who can confirm requirements and who will review/accept the design. The current stakeholder list is explicitly hypothetical.
3. **User identity and access:** Decide whether requesters are external or internal and how each role is identified. Do not finalize account/profile or authorization design before this is answered.
4. **Ticket workflow:** Confirm required fields, status names/transitions, reopening/closure rules, and who can perform each action.
5. **Communication:** Confirm whether replies can be internal, customer-visible, or both; identify whether reference codes, notifications, or attachments are required for MVP.
6. **MVP decisions:** Confirm the proposed Must scope and success measures with the authorized stakeholder.
7. **Non-functional targets:** Define data sensitivity/retention, expected load, performance, availability, supported devices/browsers, and accessibility expectations as applicable.
8. **Technology baseline:** Inspect actual source and manifests before proposing framework-specific architecture. PostgreSQL CLI is a stated tooling constraint for future work, not evidence of an existing database integration.

## 7. Questions to take to the mentor / product owner

- Is this checkout expected to contain the application, or is there another source location/branch to review?
- Who is the authorized product/business owner, and which stakeholder roles are confirmed?
- Are customers external users, internal employees, or both? What identity and access process is expected?
- Which ticket fields and status transitions are essential for MVP?
- Are comments customer-visible, internal-only, or both? Are attachments and notifications in the MVP?
- Is manual assignment required in MVP, and who is allowed to assign?
- What concrete outcome will demonstrate that the MVP succeeds?
- Which privacy, retention, performance, and availability requirements need measurable targets?
- Is PostgreSQL a confirmed project decision, or only the internship environment preference?

## 8. Review conclusion

The local checkout does not currently provide application source or configuration from which to identify its framework, frontend, backend, database, or module structure. The Week 02 documents provide a useful proposed business baseline, but expressly state that it is unconfirmed. Current evidence is therefore insufficient to claim existing functionality or to make framework-specific design decisions.

The next design phase should use a confirmed source baseline and answers to the high-impact open questions above. This report does not approve or finalize database, API, architecture, project structure, or wireframes.

## 9. Review record

| Reviewer | Feedback source | Confirmation status |
|---|---|---|
| Repository inspection performed for this report | Local checkout and Week 02 Markdown documents | Factual inventory only; mentor/customer review not recorded |
