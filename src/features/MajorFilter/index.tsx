import { useState } from "react";
import { getSemestersQuery } from "../../providers/operation/queries";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../shared/Button";
import { Menu } from "../../shared/Menu";
import { AnimatePresence } from "framer-motion";
import { useOpenCloseHotkey } from "../../hooks/useOpenCloseHotkey";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const SemesterFilter = () => {
  // Get data
  const { data: semesters } = useQuery({
    ...getSemestersQuery(),
  });

  // State
  const [selectSemesterIndex, setSelectSemesterIndex] = useState<number>();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const ref = useOpenCloseHotkey({ showMenu, setShowMenu });

  return (
    <div ref={ref}>
      <Button
        onClick={(event) => {
          setShowMenu((prevState) => !prevState);
          event.currentTarget.blur();
        }}
      >
        <span>Semester: </span>
        <span>
          {semesters &&
          selectSemesterIndex !== undefined &&
          selectSemesterIndex < semesters.length
            ? semesters[selectSemesterIndex].name
            : "All"}
        </span>
        <span className="ml-2">
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </Button>
      <AnimatePresence>
        {showMenu && (
          <Menu
            className="mt-2 absolute"
            items={semesters}
            onItemSelect={(semester, index) => {
              setSelectSemesterIndex(index);
              setShowMenu(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
