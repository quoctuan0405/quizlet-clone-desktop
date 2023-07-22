import { useEffect, useState } from "react";
import { Switch } from "../../shared/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

interface Props {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
}

export const DarkModeToggle: React.FC<Props> = ({ className }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`flex items-center min-w-max ${className}`}>
      <FontAwesomeIcon
        icon={faMoon}
        className="text-purple-400 dark:text-purple-500 mt-0.5"
      />
      <Switch
        onClick={() => {
          setIsDarkMode((prevState) => !prevState);
        }}
      />
      <FontAwesomeIcon
        icon={faSun}
        className="text-purple-400 dark:text-purple-500 mt-0.5"
      />
    </div>
  );
};
