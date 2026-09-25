/**
 * departmentCooldown.ts
 *
 * Client-side mirror of the 60-day department-change cooldown enforced
 * server-side in OnboardingService.updateDepartment (backend). This exists
 * ONLY for immediate UX (disabling the select / showing a toast before the
 * user even submits) — it is never the source of truth. The backend
 * re-checks and rejects with 409 regardless of what this says, so a stale
 * or manipulated client clock can't bypass the real rule.
 *
 * DEPARTMENT_COOLDOWN_DAYS must stay in sync with the backend's constant
 * of the same name in src/services/onboardingService.ts.
 */

const DEPARTMENT_COOLDOWN_DAYS = 60;
const DEPARTMENT_COOLDOWN_MS = DEPARTMENT_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export interface DepartmentCooldownStatus {
  isLocked: boolean;
  availableAt: Date | null;
  daysRemaining: number;
}

export function getDepartmentCooldownStatus(
  departmentChangedAt: string | null | undefined,
): DepartmentCooldownStatus {
  if (!departmentChangedAt) {
    return { isLocked: false, availableAt: null, daysRemaining: 0 };
  }

  const changedAt = new Date(departmentChangedAt).getTime();
  if (Number.isNaN(changedAt)) {
    return { isLocked: false, availableAt: null, daysRemaining: 0 };
  }

  const availableAt = new Date(changedAt + DEPARTMENT_COOLDOWN_MS);
  const msRemaining = availableAt.getTime() - Date.now();

  if (msRemaining <= 0) {
    return { isLocked: false, availableAt: null, daysRemaining: 0 };
  }

  return {
    isLocked: true,
    availableAt,
    daysRemaining: Math.ceil(msRemaining / (24 * 60 * 60 * 1000)),
  };
}
