import { CircleCheck, type LucideIcon } from "lucide-react";
import CustomText from "./CustomText";

interface ModeCardProps {
  mode: "anonymous" | "identified";
  isSelected: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  displayLabel: string;
  currentLevel: string;
  onClick: () => void;
}

export const ModeCard = ({
  isSelected,
  icon: Icon,
  title,
  description,
  badge,
  displayLabel,
  currentLevel,
  onClick,
}: ModeCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full p-3 md:p-4 rounded-lg border-2 text-left transition-all ${
      isSelected
        ? "border-[#6366F1] bg-[#EEF2FF]"
        : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
    }`}
  >
    <div className="flex gap-4 items-start justify-between">
      <Icon
        className={`w-5 h-5 p-1 rounded-md md:w-6 md:h-6 flex-shrink-0 ${isSelected ? "bg-[#6366F1] text-white" : "bg-[#E2E8F0] text-[#64748B]"}`}
      />
      <div className="flex-1">
        <div className="flex items-start gap-1 mb-2">
          <CustomText
            variant="body"
            weight="semibold"
            color="black"
            className="text-sm md:text-base"
          >
            {title}
          </CustomText>
          {badge && (
            <span className="mr-auto bg-[#6366F1] text-white text-xs font-semibold px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <CustomText
          variant="small"
          color="secondary"
          className="text-xs md:text-sm"
        >
          {description}
        </CustomText>
        <div
          className={`px-3 md:px-4 py-2 w-full rounded-md ${
            isSelected ? "bg-white" : "bg-[#F8FAFC]"
          }`}
        >
          <CustomText
            variant="caption"
            color="secondary"
            className="opacity-50 mb-1 text-xs md:text-xs"
          >
            How others see you:
          </CustomText>
          <CustomText
            variant="small"
            color="primary"
            weight="semibold"
            className="text-xs md:text-sm"
          >
            {displayLabel} • Level {currentLevel}
          </CustomText>
        </div>
      </div>
      <div>{isSelected && <CircleCheck color="#6366F1" />}</div>
    </div>
  </button>
);
