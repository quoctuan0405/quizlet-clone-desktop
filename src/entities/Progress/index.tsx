import classNames from "classnames";
import { motion } from "framer-motion";

type Variant = "purple" | "indigo";

interface Props {
  variant?: Variant;
  icon?: React.ReactNode;
  currentProgressText?: string;
  description?: string;
  progress?: number;
}

export const Progress: React.FC<Props> = ({
  variant = "purple",
  icon,
  currentProgressText,
  description,
  progress,
}) => {
  return (
    <div className="flex flex-row flex-wrap justify-center items-center">
      <div
        className={`flex flex-wrap justify-center items-center w-12 h-12 bg-white dark:bg-purple-100 bg-opacity-50 dark:bg-opacity-10 dark:bg-blend-screen rounded-full border-2 mr-4 mt-1 text-lg  ${classNames(
          {
            "border-purple-400 dark:border-purple-600 text-purple-500 dark:text-purple-400":
              variant === "purple",
            "border-indigo-400 dark:border-indigo-600 text-indigo-500 dark:text-indigo-400":
              variant === "indigo",
          }
        )}`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="mb-1.5">
          <p>
            <span
              className={`font-bold text-base ${classNames({
                "text-purple-600 dark:text-purple-400/90": variant === "purple",
                "text-indigo-600 dark:text-indigo-400/90": variant === "indigo",
              })}`}
            >
              {currentProgressText}
            </span>
            <span
              className={`ml-4 font-semibold text-sm ${classNames({
                "text-purple-400 dark:text-purple-500/80": variant === "purple",
                "text-indigo-400 dark:text-indigo-500/80": variant === "indigo",
              })}`}
            >
              {description}
            </span>
          </p>
        </div>
        <div
          className={`w-full bg-gray-200/40 rounded-full h-2 ${classNames({
            "dark:bg-purple-900/70": variant === "purple",
            "dark:bg-indigo-900/70": variant === "indigo",
          })}`}
        >
          <motion.div
            layout
            className={`h-2 rounded-full ${classNames({
              "bg-purple-400 dark:bg-purple-600": variant === "purple",
              "bg-indigo-400 dark:bg-indigo-600": variant === "indigo",
            })}`}
            style={{ width: `${progress ? progress * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};
