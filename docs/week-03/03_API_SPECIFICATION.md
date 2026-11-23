# TicketDesk REST API Specification — Week 03, Day 02

**Status:** Proposed API contract for MVP review. No API code is implemented by this document. Exact authorization rules and some business behavior remain unresolved; endpoints with unresolved permission policy are not implementation-ready.

## 1. Sources and scope

This specification uses the Week 02 requirements, stories, acceptance criteria and MVP scope; the Week 03 Project Review; the proposed ERD in `docs/week-03/02_ERD.dbml`; and the project decisions supplied for TicketDesk-App.

The domain model is limited to `users`, `tickets`, and public `comments`. The proposed `ticket_status_history` table remains optional pending confirmation of audit requirements. This API does not create endpoints for assignment, categories/tags, attachments, notifications, reports, advanced search, or status history. These are excluded, optional, or unconfirmed in the current MVP source documents.

## 2. API conventions

- Base path: `/api`
- Content type: `application/json`
- Authentication: JWT access token in `Authorization: Bearer <access-token>` except registration, login, and refresh.
- IDs: integer database identifiers as strings or JSON numbers; examples use numbers.
- Timestamps: ISO 8601 with timezone offset, e.g. `2026-11-23T09:30:00+07:00`.
- Requester identity and ticket ownership are derived from the authenticated principal. Clients must not submit or override `requester_id` when creating a ticket.
- Passwords and token values are never included in user/ticket responses except the explicit login/refresh token response.
- Status values are exactly `NEW`, `IN_PROGRESS`, `RESOLVED`, and `CLOSED`. The API does not define transition rules until the business owner confirms them.
- Comments have no visibility field because all comments are public. This does not mean every authenticated user can access every ticket.

## 3. Endpoint summary

Eleven endpoints are listed to meet the requested minimum while staying within account/JWT and MVP ticket/comment flows. `/tickets/mine/` and `/tickets/queue/` are separate list use cases already represented by US-03 and US-05; they do not introduce a new business feature.

| # | Method | Endpoint | Purpose | Authentication | Authorization policy | Success / key errors |
|---:|---|---|---|---|---|---|
| 1 | POST | `/api/auth/register/` | Register account | Public | Role is always `REQUESTER`; privilege escalation is prohibited. | 201; 400 invalid fields/username conflict |
| 2 | POST | `/api/auth/login/` | Obtain access and refresh tokens | Public | Valid account credentials required. | 200; 401 invalid credentials |
| 3 | POST | `/api/auth/token/refresh/` | Obtain a new access token | Refresh token in body; no access token | Token validity handled by JWT policy. Rotation/blacklisting is not specified. | 200; 401 invalid/expired refresh |
| 4 | GET | `/api/auth/me/` | Read current user's profile | Access JWT required | Own profile only. | 200; 401 missing/invalid token |
| 5 | POST | `/api/tickets/` | Create ticket | Access JWT required | Requester is the story actor (US-01); whether other roles may create is unresolved. | 201; 400 invalid; 401; 403 |
| 6 | GET | `/api/tickets/mine/` | List requester's tickets | Access JWT required | Own tickets only, as proposed by US-03/ERD ownership. | 200; 400 invalid query; 401; 403 if role policy denies |
| 7 | GET | `/api/tickets/queue/` | List support work queue | Access JWT required | Support Agent is the story actor (US-05); queue visibility/team scope and whether Manager may use it are unresolved. | 200; 400 invalid query; 401; 403 |
| 8 | GET | `/api/tickets/{ticket_id}/` | Read ticket detail | Access JWT required | Ticket visibility matrix is unresolved; apply only policy approved by product owner. | 200; 401; 403; 404 |
| 9 | PATCH | `/api/tickets/{ticket_id}/status/` | Change current status | Access JWT required | Support Agent is the story actor (US-06); exact role permission and allowed transitions require confirmation. | 200; 400 invalid status; 401; 403; 404; 409 confirmed state conflict |
| 10 | GET | `/api/tickets/{ticket_id}/comments/` | List public comments | Access JWT required | Must first be authorized to view parent ticket; exact role/object scope unresolved. | 200; 400 invalid query; 401; 403; 404 |
| 11 | POST | `/api/tickets/{ticket_id}/comments/` | Add public comment | Access JWT required | Requester/Support Agent are represented in US-07; exact ticket access and allowed statuses are unresolved. | 201; 400 invalid body; 401; 403; 404; 409 only if closed-state rule is confirmed |

The first four routes match the current accounts URL setup. Ticket/comment routes are proposed contract only and have no implementation implied.

## 4. Resource representations

### User (safe public representation)

```json
{
  "id": 42,
  "username": "linh.nguyen",
  "email": "linh@example.test",
  "role": "REQUESTER"
}
```

Never return `password`, `is_superuser`, or JWTs in the profile representation. Whether email may be disclosed to other users is not specified; the profile response is for the authenticated user only.

### Ticket

```json
{
  "id": 105,
  "requester_id": 42,
  "description": "Unable to access the support portal.",
  "status": "NEW",
  "created_at": "2026-11-23T09:30:00+07:00",
  "updated_at": "2026-11-23T09:30:00+07:00"
}
```

Fields match the proposed ERD. No title, priority, category, assignment, reference code, attachment, or history fields are added without an approved requirement.

### Comment

```json
{
  "id": 501,
  "ticket_id": 105,
  "author_id": 17,
  "body": "We are checking the reported issue.",
  "created_at": "2026-11-23T10:05:00+07:00"
}
```

There is no `is_internal` or visibility property. All returned comments are public.

## 5. Detailed endpoint contracts

### 5.1 Register — `POST /api/auth/register/`

**Authentication:** none. **Authorization:** public self-registration; server assigns Requester role.

Request:

```json
{
  "username": "linh.nguyen",
  "email": "linh@example.test",
  "password": "example-password"
}
```

`role` is not accepted as a client-controlled field. Success: `201 Created`, body is the safe User representation. `400 Bad Request` for invalid fields or duplicate username. The current ERD does not make email unique.

### 5.2 Login — `POST /api/auth/login/`

**Authentication:** none. **Authorization:** valid account credentials.

Request:

```json
{
  "username": "linh.nguyen",
  "password": "example-password"
}
```

Success: `200 OK`.

```json
{
  "refresh": "<refresh-token>",
  "access": "<access-token>"
}
```

Invalid credentials return `401 Unauthorized`. Token lifetimes follow the configured JWT policy; this document does not set them.

### 5.3 Refresh — `POST /api/auth/token/refresh/`

**Authentication:** no access token; a valid refresh token is required in the payload. **Authorization:** possession of a valid refresh token.

Request:

```json
{
  "refresh": "<refresh-token>"
}
```

Success: `200 OK`.

```json
{
  "access": "<new-access-token>"
}
```

Invalid/expired refresh tokens return `401 Unauthorized`. Whether rotation or blacklist/revocation is enabled is unresolved.

### 5.4 Current profile — `GET /api/auth/me/`

**Authentication:** access JWT required. **Authorization:** authenticated user may read their own profile only.

Success: `200 OK`, User representation. No request body.

### 5.5 Create ticket — `POST /api/tickets/`

**Authentication:** access JWT required. **Authorization:** Requester is the actor in US-01; permission for other roles is unresolved. Derive `requester_id` from JWT, never from request data.

Request:

```json
{
  "description": "Unable to access the support portal."
}
```

Success: `201 Created`, Ticket representation with `status: "NEW"` and server-generated timestamps. `400 Bad Request` for invalid/missing description. Whether title/contact fields are required remains open.

### 5.6 List own tickets — `GET /api/tickets/mine/`

**Authentication:** access JWT required. **Authorization:** Requester scope is limited to tickets where `requester_id` equals the current user. This follows US-03 and the proposed ERD; confirm if other roles need this list.

Query parameters: common pagination plus optional `status`, `ordering`.

Example: `GET /api/tickets/mine/?page=1&page_size=20&status=NEW&ordering=-created_at`

Success: `200 OK`, paginated Ticket representations.

### 5.7 Support queue — `GET /api/tickets/queue/`

**Authentication:** access JWT required. **Authorization:** Support Agent is the actor from US-05. Whether queue is global, team-scoped, assigned-only, or available to Manager is unresolved; no assignment field exists in the proposed MVP ERD. Therefore this endpoint's exact queryset must be approved before implementation.

Query parameters: common pagination plus optional `status`, `ordering`.

Success: `200 OK`, paginated Ticket representations. Queue inclusion rules and default sort order require product confirmation.

### 5.8 Ticket detail — `GET /api/tickets/{ticket_id}/`

**Authentication:** access JWT required. **Authorization:** enforce the approved ticket visibility matrix; the current documents do not define complete Requester/Support Agent/Manager/Admin permissions.

Path parameter: `ticket_id` (integer PK). Success: `200 OK`, Ticket representation. Unknown ID returns `404 Not Found`. Whether an existing but hidden ticket returns 403 or 404 is a disclosure-policy decision still open.

### 5.9 Change status — `PATCH /api/tickets/{ticket_id}/status/`

**Authentication:** access JWT required. **Authorization:** Support Agent is the story actor from US-06; whether Manager/Admin or only a permitted agent may change status is unresolved.

Request:

```json
{
  "status": "IN_PROGRESS"
}
```

Success: `200 OK`, updated Ticket representation. `400 Bad Request` for an unknown status code. `409 Conflict` may represent a business transition conflict only after allowed transitions are defined. The example `ticket_closed` is conditional on confirming that CLOSED tickets cannot transition.

### 5.10 List comments — `GET /api/tickets/{ticket_id}/comments/`

**Authentication:** access JWT required. **Authorization:** caller must be allowed to view the parent ticket. All comments are public; this endpoint does not bypass ticket visibility.

Query parameters: common pagination; no ordering parameter is needed in the first version, as comments are returned chronologically by `created_at` ascending (proposed to display a conversation; confirm if desired).

Success: `200 OK`, paginated Comment representations. Unknown ticket returns `404 Not Found`.

### 5.11 Add public comment — `POST /api/tickets/{ticket_id}/comments/`

**Authentication:** access JWT required. **Authorization:** Requester/Support Agent are the actors in US-07, but exact parent-ticket access and whether comments are allowed in every ticket status remain unresolved. Author is always the authenticated user; no `author_id` or visibility field is accepted from the client.

Request:

```json
{
  "body": "We are checking the reported issue."
}
```

Success: `201 Created`, Comment representation. `400 Bad Request` for empty/invalid body. `404 Not Found` for unknown ticket. A `409 Conflict` for a closed ticket is only valid if the business owner confirms closed tickets reject comments.

## 6. Pagination, filtering, and sorting

Apply to `GET /tickets/mine/`, `GET /tickets/queue/`, and `GET /tickets/{id}/comments/`.

| Parameter | Meaning | Proposed behavior |
|---|---|---|
| `page` | 1-based page number | Default `1`; invalid page returns 400. |
| `page_size` | Page length | Default `20`, maximum `100`; values above maximum are capped or rejected consistently (choose one before implementation). |
| `status` | Ticket status filter | Only on ticket lists; accepts one of the four approved status values. |
| `ordering` | Sort key | Only on ticket lists; allow `created_at`, `-created_at`, `updated_at`, `-updated_at`; default order must be confirmed. |

Proposed paginated response:

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 105,
      "requester_id": 42,
      "description": "Unable to access the support portal.",
      "status": "NEW",
      "created_at": "2026-11-23T09:30:00+07:00",
      "updated_at": "2026-11-23T09:30:00+07:00"
    }
  ]
}
```

The response envelope follows DRF `PageNumberPagination`; the proposed page-size defaults and ordering are contract choices that must be configured explicitly. DRF's built-in pagination does not automatically apply to a plain `APIView` unless pagination is invoked/configured for that view. [DRF pagination](https://www.django-rest-framework.org/api-guide/pagination/)

No `search`, category, tag, assignment, or date-range filters are defined because corresponding features are outside or unconfirmed for MVP.

## 7. Consistent error contract

All API errors use this JSON shape, including serializer validation errors:

```json
{
  "detail": "Ticket is closed",
  "code": "ticket_closed"
}
```

| HTTP status | Meaning | Example code |
|---:|---|---|
| 400 | Invalid JSON, query parameter, or field value | `validation_error` |
| 401 | Missing/invalid/expired access token or invalid login/refresh credential | `not_authenticated` |
| 403 | Authenticated caller is forbidden by the approved authorization matrix | `permission_denied` |
| 404 | Resource does not exist; whether hidden resources also use 404 is unresolved | `not_found` |
| 409 | Conflict with a confirmed current business state/transition rule | `conflict`; `ticket_closed` only if closure rule is approved |

Example validation response:

```json
{
  "detail": "The status value is not supported.",
  "code": "validation_error"
}
```

DRF's default serializer validation format is field-keyed, and its default exceptions commonly include `detail`; to guarantee this exact two-key format for validation and raised exceptions, implementation will need a centralized response/error mapping. The handler must also cover validation responses returned directly by generic views, as those do not necessarily pass through the normal exception handler. [DRF exceptions](https://www.django-rest-framework.org/api-guide/exceptions/)

## 8. Status code summary

- `200 OK`: successful GET, login, refresh, or status update.
- `201 Created`: successful register, ticket creation, or comment creation.
- `400 Bad Request`: malformed/invalid request or unsupported query input.
- `401 Unauthorized`: authentication required or token/credential invalid.
- `403 Forbidden`: authenticated caller denied by an approved permission rule.
- `404 Not Found`: resource not found.
- `409 Conflict`: confirmed state/transition conflict.

## 9. Authorization decisions required before implementation

1. Which roles can create tickets? US-01 names the requester; role permissions for other actors are unspecified.
2. Is the support queue global, team-based, assigned-only, or otherwise scoped? The MVP ERD has no assignment entity/field.
3. Can Managers and Admins view all tickets? Does Admin have application-level ticket access beyond account administration?
4. Can Support Agents see/update every ticket or only a subset?
5. Which role can perform each transition among the four statuses? Can `RESOLVED` or `CLOSED` reopen?
6. Can Requesters and Support Agents comment in every status? Are comments editable/deletable?
7. When should an inaccessible ticket return 403 versus 404?
8. Does JWT refresh rotate tokens or support revocation/blacklisting?
9. Which default sorting and page-size cap behavior should the API promise?

## 10. Consistency review

- All response fields map to the proposed `users`, `tickets`, and `comments` tables; `requester_id` and `author_id` are server-derived where appropriate.
- The status enum matches the project-approved values; `OPEN` and `REJECTED` are not introduced as API statuses.
- Comments are public-only and have no visibility property.
- No attachment, assignment, category/tag, notification, report, or status-history endpoints are included.
- Authorization is explicitly marked unresolved wherever source stories do not define a complete role/object policy. The API is not ready for implementation until those rules are confirmed.
- The current ERD's optional history table is not exposed because audit history is not approved.

## References

- [Django REST Framework pagination](https://www.django-rest-framework.org/api-guide/pagination/)
- [Django REST Framework exceptions and custom handlers](https://www.django-rest-framework.org/api-guide/exceptions/)
- [Simple JWT views and tokens](https://django-rest-framework-simplejwt.readthedocs.io/en/stable/)
