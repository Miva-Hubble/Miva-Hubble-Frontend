import { useEffect, useRef, useState } from "react";
import { Check, Search, X } from "lucide-react";
import type { AskTheme } from "../../ask/constants/theme";
import { levels } from "../../../constants/profile";
import { profileService } from "../../../services/profileService";
import ContinueButton from "./ContinueButton";

interface Step1LevelDepartmentProps {
  theme: AskTheme;
  currentLevel: string;
  department: string;
  onLevelChange: (level: string) => void;
  onDepartmentChange: (department: string) => void;
  onContinue: () => void;
}

const Step1LevelDepartment = ({
  theme,
  currentLevel,
  department,
  onLevelChange,
  onDepartmentChange,
  onContinue,
}: Step1LevelDepartmentProps) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(department);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const departmentInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    profileService.fetchDepartments().then((data) => {
      setDepartments(data);
      setIsLoadingDepartments(false);
    });
  }, []);

  useEffect(() => {
    setSearchQuery(department);
  }, [department]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLevelSelect = (level: string | number) => {
   onLevelChange(String(level)); 
  };

  const handleDepartmentSelect = (dept: string) => {
    onDepartmentChange(dept);
    setSearchQuery(dept);
    setIsDropdownOpen(false);
  };

  const handleClearDepartment = () => {
    onDepartmentChange("");
    setSearchQuery("");
    departmentInputRef.current?.focus();
  };

  const isComplete = Boolean(currentLevel && department);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <h1
          className="mb-2 text-2xl font-bold"
          style={{ color: theme.textPrimary }}
        >
          Let's personalize your campus experience
        </h1>
        <p
          className="mb-8 text-sm leading-relaxed"
          style={{ color: theme.textSecondary }}
        >
          We'll show resources, discussions, and students relevant to your
          level and department.
        </p>

        <div className="mb-8">
          <p
            className="mb-3 text-xs font-medium tracking-wider"
            style={{ color: theme.textMuted }}
          >
            YOUR LEVEL
          </p>
          <div className="grid grid-cols-2 gap-3">
          {levels.map((level) => {
              const isSelected = String(currentLevel) === String(level);

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleLevelSelect(level)}
                  className="relative rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={
                    isSelected
                      ? {
                          border: `1px solid ${theme.primary}`,
                          backgroundColor: theme.primary + "1A",
                          color: theme.answerText,
                        }
                      : {
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.cardBg,
                          color: theme.tagText,
                        }
                  }
                >
                  {level} Level
                  {isSelected && (
                    <span
                      className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={dropdownRef}>
          <p
            className="mb-3 text-xs font-medium tracking-wider"
            style={{ color: theme.textMuted }}
          >
            DEPARTMENT
          </p>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: theme.textMuted }}
            />
            <input
              ref={departmentInputRef}
              type="text"
              value={searchQuery}
              placeholder="Search department..."
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
                if (department && e.target.value !== department) {
                  onDepartmentChange("");
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full rounded-xl border py-3 pl-10 pr-10 text-sm transition-colors focus:outline-none"
              style={{
                backgroundColor: theme.input,
                color: theme.textPrimary,
                borderColor: department ? theme.primary : theme.border,
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearDepartment}
                aria-label="Clear department"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: theme.textMuted }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {isDropdownOpen && (
            <div
              className="mt-2 max-h-44 overflow-y-auto rounded-xl border backdrop-blur-sm"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.surface,
              }}
            >
              {isLoadingDepartments ? (
                <p
                  className="px-4 py-3 text-sm"
                  style={{ color: theme.textMuted }}
                >
                  Loading...
                </p>
              ) : filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleDepartmentSelect(dept)}
                    className="w-full px-4 py-3 text-left text-sm transition-colors"
                    style={{
                      color:
                        department === dept
                          ? theme.answerText
                          : theme.tagText,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.cardBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {dept}
                  </button>
                ))
              ) : (
                <p
                  className="px-4 py-3 text-sm"
                  style={{ color: theme.textMuted }}
                >
                  No departments found
                </p>
              )}
            </div>
          )}

          {department && (
            <div className="mt-3 flex items-center gap-1.5 transition-opacity duration-200">
              <Check
                className="h-4 w-4"
                strokeWidth={2.5}
                style={{ color: theme.primary }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: theme.answerText }}
              >
                {department}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <ContinueButton
          theme={theme}
          onClick={onContinue}
          disabled={!isComplete}
        >
          Continue
        </ContinueButton>
      </div>
    </div>
  );
};

export default Step1LevelDepartment;
