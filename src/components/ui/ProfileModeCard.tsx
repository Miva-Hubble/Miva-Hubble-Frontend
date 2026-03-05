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
        ? "border-cyan-500 bg-cyan-500/10"
        : "border-slate-800 bg-slate-900 hover:border-slate-700"
    }`}
  >
    <div className="flex gap-4 items-start justify-between">
      <Icon
        className={`w-5 h-5 p-1 rounded-md md:w-6 md:h-6 flex-shrink-0 ${isSelected ? "bg-cyan-600/20 text-cyan-400" : "bg-slate-800 text-slate-400"}`}
      />
      <div className="flex-1">
        <div className="flex items-start gap-1 mb-2">
          <CustomText
            variant="body"
            weight="semibold"
            color="white"
            className="text-sm md:text-base"
          >
            {title}
          </CustomText>
          {badge && (
            <span className="mr-auto bg-cyan-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
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
            isSelected ? "bg-slate-900" : "bg-slate-800/50"
          }`}
        >
          <CustomText
            variant="caption"
            color="secondary"
            className="opacity-70 mb-1 text-xs md:text-xs text-slate-400"
          >
            How others see you:
          </CustomText>
          <CustomText
            variant="small"
            color="white"
            weight="semibold"
            className="text-xs md:text-sm"
          >
            {displayLabel} • Level {currentLevel}
          </CustomText>
        </div>
      </div>
      <div>{isSelected && <CircleCheck className="text-cyan-500" />}</div>
    </div>
  </button>
);


