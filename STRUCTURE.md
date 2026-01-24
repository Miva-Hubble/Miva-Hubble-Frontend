# Miva Hubble Frontend - Project Structure Guide

Welcome to the Miva Hubble Frontend codebase! This document is designed to help you understand the project's architecture, how the code is organized, and where you should add new functionality.

## 🏗 Architecture Overview

We follow a **Feature-based Architecture**. This means the codebase is organized around **business features** (e.g., Auth, Dashboard, Feed) rather than technical types (e.g., controllers, views, utils).

### Why this approach?
- **Scalability**: As the app grows, features remain self-contained.
- **Maintainability**: Related code sits together. If you're fixing a bug in the "Feed", you know exactly where to look.
- **Collaboration**: Multiple developers can work on different features without stepping on each other's toes.

---

## 📂 Directory Breakdown

Here is a high-level overview of the `src` directory:

```
src/
├── assets/             # Static assets (images, global icons)
├── components/         # SHARED components used across multiple features
│   └── Layout/         # Global application layouts (AppLayout, AuthLayout)
├── features/           # DOMAIN-SPECIFIC code (The core of the app)
│   ├── auth/           # Authentication feature (Login, Signup, etc.)
│   ├── dashboard/      # Dashboard feature
│   ├── feed/           # Feed/Posts feature
│   └── resources/      # Resource Vault feature
├── hooks/              # SHARED custom hooks (e.g., useAuth)
├── pages/              # GENERIC pages (Landing, 404) that don't belong to a specific feature
├── routes/             # Routing configuration
│   ├── index.tsx       # Central route definitions
│   └── ProtectedRoute.tsx # Route guard for private pages
├── App.tsx             # Application Shell (Providers, Global Context)
└── main.tsx            # Entry Point (Mounts React to DOM)
```

---

## 🧩 Key Concepts

### 1. Features (`src/features/`)
This is where 90% of your work will happen. Each folder inside `features/` represents a domain of the application.
A typical feature folder structure looks like this:

```
src/features/awesome-feature/
├── components/         # Components specific ONLY to this feature
├── hooks/              # Hooks specific ONLY to this feature
├── pages/              # Page components (views) for this feature
├── services/           # API calls/Logic for this feature
└── types/              # TypeScript types for this feature
```

**Rule of Thumb**: If a component is only used within the "Dashboard", put it in `src/features/dashboard/components`. If it's used in "Dashboard" AND "Feed", move it to `src/components`.

### 2. Shared Components (`src/components/`)
These are "dumb" UI components that don't know about business logic.
- Buttons, Inputs, Modals, Cards.
- Layouts (`AppLayout`, `AuthLayout`).

### 3. Routing (`src/routes/`)
We use `react-router-dom`.
- **`index.tsx`**: Defines the mapping between URLs and Page Components.
- **`ProtectedRoute.tsx`**: A wrapper that checks if a user is logged in before showing the content.

### 4. Application Flow
1. **`main.tsx`**: Bootstraps the React app.
2. **`App.tsx`**: Sets up global providers (Router, Theme, Auth).
3. **`routes/index.tsx`**: Decides which Page to render based on the URL.
4. **`AppLayout.tsx`** (for private routes): Renders the Navbar and the Page content.

---

## 🛠 How-To Guides

### How to add a new Feature
1. Create a new folder: `src/features/my-new-feature`.
2. Create a `pages` folder inside it.
3. Create your main page component: `src/features/my-new-feature/pages/MyPage.tsx`.

### How to add a new Route
1. Open `src/routes/index.tsx`.
2. Import your new page component.
3. Add a `<Route />` entry inside the appropriate group (Public, Auth, or Private).

```tsx
// Example in src/routes/index.tsx
<Route element={<AppLayout />}>
  {/* ... existing routes ... */}
  <Route path="/new-feature" element={<MyPage />} />
</Route>
```

### How to create a Shared Component
1. Create the file in `src/components/MyComponent/MyComponent.tsx`.
2. Ensure it accepts props for customization and doesn't contain hardcoded business logic.

---

## 📝 Naming Conventions

- **Components/Pages**: PascalCase (e.g., `UserProfile.tsx`, `LandingPage.tsx`).
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`).
- **Folders**: camelCase or kebab-case (stick to one, currently `camelCase` for features like `auth`, `dashboard`).

## 🚀 Getting Started

1. **Install Dependencies**: `npm install`
2. **Run Dev Server**: `npm run dev`
3. **Build for Production**: `npm run build`
