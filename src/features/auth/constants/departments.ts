// DEPRECATED — unused, and stale relative to the backend's DEPARTMENTS
// ENUM (src/constants/taxonomy.ts on Miva-Hubble-Backend). This static list
// of 24 departments does not match the backend's 8-item enum, so any value
// picked from it would fail Zod validation on submit.
//
// Step1LevelDepartment.tsx (and every other department picker in this app)
// sources its options live from GET /taxonomy via the useTaxonomy() hook,
// which is always in sync with the backend enum. Nothing in this codebase
// imports this file — safe to delete.
