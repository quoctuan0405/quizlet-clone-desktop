import { useQuery } from "@tanstack/react-query";
import { Header } from "../entities/Header";
import { getDarkModeSettingQuery } from "../providers/operation/queries";
import { Outlet } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import { Sidebar } from "../entities/Sidebar";
import { useHotkeys } from "react-hotkeys-hook";
import { AnimatePresence, Variants, motion } from "framer-motion";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 0.5,
  },
};

export const RootLayout = () => {
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const { data: darkMode } = useQuery({ ...getDarkModeSettingQuery() });
  const [showHiddenFeature, setShowHiddenFeature] = useState<boolean>(false);

  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, [headerRef]);

  useHotkeys("ctrl + shift + alt + h", () => {
    setShowHiddenFeature((prevState) => !prevState);
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-purple-100 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <div className="absolute w-full h-full top-0 left-0 z-0 bg-slate-500 opacity-0 dark:opacity-50 mix-blend-multiply"></div>
      {!darkMode?.value ? (
        <div className="absolute -left-32 -top-64">
          <img
            src="/images/background-light.svg"
            className="opacity-70 w-30 h-30"
          />
        </div>
      ) : (
        <div className="absolute -left-24 -top-48 lg:-left-32 lg:-top-64">
          <img
            src="/images/background-dark.svg"
            className="opacity-50 w-35 h-35"
          />
        </div>
      )}

      <AnimatePresence>
        {showHiddenFeature && (
          <motion.div
            className="absolute -bottom-0 -right-72"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            variants={animation}
          >
            <picture className="block w-[40rem] lg:w-[50rem]">
              <img
                src="/images/thuhang1.png"
                className="w-full h-full bg-blend-screen"
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full">
        <div className="flex flex-row flex-wrap w-full">
          <Sidebar className="relative z-10" />
          <div className="flex-1">
            <Header ref={headerRef} className="relative z-10" />
            <div
              className="flex flex-col overflow-hidden"
              style={{
                height: `calc(100vh - ${headerHeight}px)`,
              }}
            >
              <div className="h-full overflow-y-auto overflow-x-hidden dark:scrollbar dark:scrollbar-track-purple-950 dark:scrollbar-thumb-purple-900/70">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
