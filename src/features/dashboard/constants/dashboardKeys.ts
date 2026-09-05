export const dashboardKeys = {
  all: ["dashboard"] as const,
  root: () => [...dashboardKeys.all, "root"] as const,
};
