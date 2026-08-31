export const feedKeys = {
  all: ["feed"] as const,
  root: () => [...feedKeys.all, "root"] as const,
};
