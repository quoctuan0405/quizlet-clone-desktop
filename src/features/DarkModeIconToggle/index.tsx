import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "../../shared/IconButton";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDarkModeSettingQuery } from "../../providers/operation/queries";
import { updateSetting } from "../../providers/operation/mutations";
import { DARK_MODE } from "../../providers/operation/type";

export const DarkModeIconToggle = () => {
  const queryClient = useQueryClient();

  const { data: darkMode } = useQuery({ ...getDarkModeSettingQuery() });

  const { mutate } = useMutation({ ...updateSetting(queryClient) });

  useEffect(() => {
    if (darkMode?.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode?.value]);

  return (
    <IconButton
      className="bg-purple-400 dark:bg-purple-700/50 shadow-sm"
      onClick={() => {
        mutate({ key: DARK_MODE, value: !darkMode?.value });
      }}
    >
      {darkMode?.value ? (
        <FontAwesomeIcon
          icon={faSun}
          className="text-purple-400 dark:text-purple-300/80 text-xl mt-1"
        />
      ) : (
        <FontAwesomeIcon
          icon={faMoon}
          className="text-purple-400 dark:text-purple-300/80 text-xl mt-1"
        />
      )}
    </IconButton>
  );
};
