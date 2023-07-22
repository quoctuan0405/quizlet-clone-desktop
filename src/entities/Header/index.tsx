import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { VerticalBar } from "../../shared/VerticalBar";
import { DarkModeIconToggle } from "../../features/DarkModeIconToggle";
import { KoreanKeyboard } from "../../features/KoreanKeyboard";

interface Props {
  className?: string;
}

export const Header = React.forwardRef<any, Props>(({ className }, ref) => {
  const navigate = useNavigate();

  return (
    <header
      ref={ref}
      className={`bg-white/40 dark:bg-purple-900/50 bg-blend-screen dark:bg-blend-multiply shadow px-8 pt-3 pb-2 ${className}`}
    >
      <nav className="flex flex-wrap justify-between items-center mx-auto space-x-6">
        {/* <Link to={"/"}>
          <p className="flex items-center cursor-pointer">
            <span className="self-center text-2xl font-extrabold dark:font-bold">
              <span className="text-slate-600 dark:text-white/90">Quizlet</span>
              <span className="ml-2 text-purple-600 dark:text-purple-400 dark:font-bold">
                clone
              </span>
            </span>
          </p>
        </Link> */}

        <Button
          tabIndex={-1}
          variant="transparent"
          className="group py-1.5 pl-0 pr-8"
          onClick={() => navigate(-1)}
        >
          <div className="flex flex-row flex-wrap items-center">
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-lg text-purple-700/70 dark:text-white/60 group-hover:text-purple-700/80 dark:group-hover:text-white duration-100"
            />
            <p className="font-bold text-base text-purple-700/70 dark:text-white/60 group-hover:text-purple-700/90 dark:group-hover:text-white ml-4 mt-0.5 duration-100">
              Back
            </p>
          </div>
        </Button>

        <div className="flex flex-row flex-wrap items-center space-x-3">
          <KoreanKeyboard />
          <DarkModeIconToggle />
        </div>
      </nav>
    </header>
  );
});
