# Resource Submission Domain Contract

This document defines the non-negotiable domain rules for **student resource
submissions** as consumed by the frontend dashboard. It is a contract, not an
implementation — the dashboard reads these rules to know what it may safely
display and calculate; it does not enforce or recompute any of them itself.

Source of truth for everything below: `Miva-Hubble-Backend`
(`prisma/schema.prisma`, `src/services/studentResourceService.ts`,
`src/services/progressionService.ts`).

## 1. A submission is not a library resource

A **student submission** (`StudentResource`) and a **published library
resource** (`Book`) are distinct domains with separate database tables,
separate status enums, and separate lifecycles. They must never be merged,
compared, or rendered through shared components that assume identical
shapes. A submission only becomes discoverable to other students if/when a
separate, not-yet-implemented publishing step exists — approval alone does
**not** make a submission a library item today.

## 2. Submission fields

| Field | Present today? | Notes |
| :--- | :--- | :--- |
| `id` | Yes | UUID |
| `studentId` | Renamed | Backend column is `userId`, not `studentId`. Map at the API boundary. |
| `title` | Yes | |
| `description` | Yes | Nullable |
| `level` | Yes | |
| `department` | Yes | |
| `courseCode` | Yes | |
| `courseTitle` | Yes | |
| `resourceType` | Yes | `NOTE \| PAST_QUESTION \| STUDY_GUIDE \| REFERENCE` |
| `storageBucket` | **Missing** | Not a column. The bucket is a single server-side constant (`SUPABASE_STUDENT_RESOURCES_BUCKET`), not stored per-row. Do not model this as a per-submission field. |
| `storagePath` | **Missing** | Not a column. The row stores only `storageObjectId`, a FK into Supabase's `storage.objects` table. Path lives on that external row, not on `StudentResource`. |
| `originalFileName` | **Missing** | Not persisted on `StudentResource` today. Verified once at upload time against `storage.objects` metadata, then discarded. |
| `mimeType` | **Missing** | Same as above — verified, not stored, on this table. (`fileFormat` — `PDF/EPUB/DOC/DOCX` — is the closest durable field.) |
| `fileSizeBytes` | **Missing** | Same as above — verified at upload, not persisted here. |
| `status` | Yes | See section 3 |
| `rejectionReason` | Yes | Nullable |
| `reviewedBy` | Renamed | Backend column is `reviewedByAdminId` (nullable, set-null on admin deletion) |
| `reviewedAt` | Yes | |
| `submittedForReviewAt` | Renamed | Backend column is `submittedAt`. It is set once at draft creation and overwritten again when the resource is actually submitted for review — treat the value as "most recent submission," not "creation time." |
| `createdAt` | Yes | |
| `updatedAt` | Yes | |
| `archivedAt` | **Missing** | Not a column. Archiving only flips `status` to `ARCHIVED`; there is no dedicated timestamp. If the dashboard needs "when was this archived," that requires a backend migration — do not assume it exists. |

**Action required before the API/service layer is built:** confirm with
backend whether `storagePath` / `originalFileName` / `mimeType` /
`fileSizeBytes` / `archivedAt` should be added as real columns, or whether
the dashboard is expected to source them (when needed at all) from a
separate admin-only join to `storage.objects`. Building against field names
that don't exist yet will silently break at the API layer.

## 3. Allowed statuses (exactly five)

```
DRAFT
PENDING_REVIEW
APPROVED
REJECTED
ARCHIVED
```

No other status value is valid. This matches `StudentResourceStatus` in
`schema.prisma` exactly.

## 4. Valid transitions (exactly these, enforced server-side)

```
(new upload)      -> DRAFT
DRAFT              -> PENDING_REVIEW
PENDING_REVIEW     -> APPROVED
PENDING_REVIEW     -> REJECTED
DRAFT               -> ARCHIVED
REJECTED            -> ARCHIVED
APPROVED            -> ARCHIVED
```

- An **archived** submission is immutable and can never be resubmitted,
  re-reviewed, or transitioned to any other status.
- Every transition above except "new upload -> DRAFT" is guarded server-side
  inside a Serializable-isolation transaction — the dashboard must never
  attempt to infer or shortcut a transition client-side.

**Gap vs. current backend code:** `archiveResource()` in
`studentResourceService.ts` today only accepts a resource whose status is
`APPROVED` ("Only APPROVED resources can be archived"). Archiving a `DRAFT`
or `REJECTED` resource, as this contract requires, is **not yet
implemented** on the backend. This is a release-blocking gap for the next
step, not a dashboard concern — flag it back to backend before wiring an
"archive" action for draft/rejected items.

## 5. What counts toward progression

Only resources with `status = APPROVED` — specifically, only those with an
**active (non-revoked)** `ResourceContribution` row — count toward:

- daily goal completion
- streaks (current and longest)
- 7-day consistency percentage
- lifetime approved count / rank

A resource that was approved and later archived stops counting the moment
its contribution is revoked; it is not deleted, and the revocation reason is
preserved for audit purposes.

## 6. Rejection requires a reason

`REJECTED` submissions must have a non-empty `rejectionReason`.

**Gap vs. current backend code:** at the `StudentResourceService` layer,
`reason` is an **optional** parameter on `reviewResource(..., reason?)` and
is written to the DB as-is, including `undefined`/empty. If reason
enforcement exists today, it is only at the request-validation layer on the
admin route, not as a DB constraint (`rejectionReason` is a nullable
`String?` column with no `NOT NULL` or check constraint). Do not assume the
database itself guarantees this rule.

## 7. The dashboard never calculates approval or progression itself

All of the following are backend-calculated, backend-owned metrics that the
dashboard consumes as-is and never recomputes, derives, or estimates
client-side:

- daily goal completion / percentage
- current streak / longest streak
- 7-day consistency percentage
- lifetime approved count
- rank

This mirrors the backend's own design intent — `UserProgression` is
explicitly documented as "a denormalized snapshot for cheap reads... derived
from `ResourceContribution` rows, not the other way around." If the
dashboard ever computes a percentage or streak locally, that is a contract
violation, even if the math would happen to match.

## 8. Timezone authority

**As requested for this doc:** profile timezone, falling back to
`Africa/Lagos`.

**What the backend actually does today:** there is no per-user timezone
field anywhere in the schema (`User`, `Onboarding` — neither has a
timezone column), and `architecture-overview.md` states explicitly that all
daily-goal/streak/consistency/submission-cap calculations use `Africa/Lagos`
(UTC+1, no DST), "never the server's local timezone." Every calendar-day
boundary is computed via `src/lib/lagosTime.ts` with no parameterization by
user.

**Contract as written, given that reality:**

`Africa/Lagos` is the sole authoritative timezone for evaluating a day, for
all students, unconditionally. There is currently no such thing as a
"student's configured timezone" in this system.

If a per-profile timezone is genuinely wanted later, that is a new feature
(schema migration + backend calculation change), not something the frontend
can introduce on its own by reading a field that doesn't exist. Until that
lands, hardcode `Africa/Lagos` as the display/label assumption and do not
build a fallback chain implying a profile-level override exists today.

## 9. Daily goal target and display mapping

The daily goal target is exactly **3 active, non-revoked approved
`ResourceContribution` rows per `Africa/Lagos` calendar day**, per student.

Display percentage is a fixed lookup table, never a raw division, and never
exceeds 100%:

| Approved today | Displayed % |
| :---: | :---: |
| 0 | 0% |
| 1 | 33% |
| 2 | 66% |
| 3 or more | 100% |

This matches the backend's own description of itself ("a fixed lookup...
never a raw division, and never exceeds 100%"). The dashboard must render
exactly this table — not `(count / 3) * 100` — so that backend and frontend
can never silently diverge on rounding (e.g. `1/3 = 33.33%` vs. the
contractual `33%`).

## 10. Immutability of archived submissions

Once `ARCHIVED`, a submission is read-only in every sense the dashboard
should present it: no resubmit action, no edit action, no re-review action.
The only thing that can change about an archived submission going forward is
metadata the backend adds for audit purposes (e.g. `archivedAt`, if added
per section 2) — never its content or status.

---

**Scope note:** per instructions, this document only defines the contract.
No React components, API services, hooks, or Supabase schema/config have
been modified as part of this step.

## 11. Deployed student API contract

The frontend base URL is the backend origin (without `/api`); services append
the `/api` prefix themselves. Authenticated student endpoints are:

- `POST /api/student-resources/upload-url` — `{ filename, contentType, sizeBytes }` → `{ signedUrl, path }`
- `POST /api/student-resources` — registers the completed storage object as `DRAFT`
- `POST /api/student-resources/:id/submit` — moves a draft to `PENDING_REVIEW`
- `GET /api/student-resources` — returns the authenticated student's private submissions
- `GET /api/student-resources/progress` — returns backend-calculated dashboard metrics

The browser uploads the file only to the returned Supabase `signedUrl` with a
`PUT` request. It must not attach the application's API base URL to that
request. The backend deployment must allow the frontend origin through CORS.
