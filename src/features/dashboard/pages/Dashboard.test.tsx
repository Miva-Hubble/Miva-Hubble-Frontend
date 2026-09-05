import { render, screen } from "@testing-library/react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";

const mocks = vi.hoisted(() => ({
  useMyProgress: vi.fn(),
  useMyStudentResources: vi.fn(),
  useFeed: vi.fn(),
}));

vi.mock("../../resources/hooks/useMyProgress", () => ({
  useMyProgress: mocks.useMyProgress,
}));
vi.mock("../../resources/hooks/useMyStudentResources", () => ({
  useMyStudentResources: mocks.useMyStudentResources,
}));
vi.mock("../../feed/hooks/useFeed", () => ({ useFeed: mocks.useFeed }));

const renderDashboard = () =>
  render(<BrowserRouter><Routes><Route element={<><Outlet context={{ isDarkMode: true }} /></>}><Route path="*" element={<Dashboard />} /></Route></Routes></BrowserRouter>);

describe("Dashboard", () => {
  beforeEach(() => {
    mocks.useMyProgress.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      progress: {
        dailyGoal: { activeCount: 1, target: 3, percentage: 33, completed: false },
        streak: { current: 4, longest: 9 },
        consistency: { windowDays: 7, eligibleDays: 7, completedDays: 5, percentage: 71 },
        rank: {
          name: "Scholar", level: 2, approvedResourceCount: 12,
          nextRank: { name: "Expert", minimumApprovedResources: 20, resourcesRemaining: 8 },
        },
      },
    });
    mocks.useMyStudentResources.mockReturnValue({
      isLoading: false, isError: false, error: null, refetch: vi.fn(),
      resources: [{
        id: "resource-1", userId: "student-1", title: "CSC 101 Notes", description: null,
        level: "Level100", department: "Computer Science", courseCode: "CSC101",
        courseTitle: "Introduction to Computer Science", resourceType: "NOTE",
        mimeType: "application/pdf", sizeBytes: 1234, status: "REJECTED",
        rejectionReason: "Please add clearer citations.", reviewedByAdminId: "admin-1",
        reviewedAt: null, approvedAt: null, submittedAt: "2026-09-04T00:00:00.000Z",
        createdAt: "2026-09-04T00:00:00.000Z", updatedAt: "2026-09-04T00:00:00.000Z",
      }],
    });
    mocks.useFeed.mockReturnValue({ feed: { topMasters: { items: [] }, trending: { items: [] } } });
  });

  it("renders backend-provided progress without recalculating it", () => {
    renderDashboard();
    expect(screen.getByText("33%")).toBeInTheDocument();
    expect(screen.getByText("4 Day Streak")).toBeInTheDocument();
    expect(screen.getByText("Scholar")).toBeInTheDocument();
    expect(screen.getByText("Elena Vance")).toBeInTheDocument();
  });

  it("renders a rejected resource and its admin feedback", () => {
    renderDashboard();
    expect(screen.getByText("CSC 101 Notes")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(screen.getByText(/Please add clearer citations/)).toBeInTheDocument();
  });

  it("renders a loading state while progress is loading", () => {
    mocks.useMyProgress.mockReturnValue({
      isLoading: true, isError: false, error: null, refetch: vi.fn(), progress: null,
    });
    renderDashboard();
    expect(screen.getAllByText("Loading…").length).toBeGreaterThan(0);
  });
});
