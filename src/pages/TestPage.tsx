import { useEffect, useState } from "react";
import { DarkModeToggle } from "../features/DarkModeToggle";
import { Switch } from "../shared/Switch";
import { SemesterFilter } from "../features/MajorFilter";
import { useLoaderData } from "react-router-dom";
import {
  getDarkModeSettingQuery,
  getLearningProgressQuery,
  getSetByIdQuery,
  getSetsQuery,
  getTermsQuery,
} from "../providers/operation/queries";
import { useQuery } from "@tanstack/react-query";
import { ListFlashcard } from "../entities/ListFlashcard";
import { ListTerm } from "../entities/ListTermCard";
import { BigFlashcardStack } from "../entities/BigFlashcardStack";
import { TextBox } from "../shared/TextBox";
import { SetEdit } from "../entities/SetEdit";
import { Progress } from "../entities/Progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { LearningCard } from "../features/LearningCard";
import { TextEditor } from "../shared/TextEditor";
import { Header } from "../entities/Header";

export const TestPage = () => {
  // const initialData = useLoaderData() as Awaited<
  //   ReturnType<ReturnType<typeof getSemestersLoader>>
  // >;

  // const { data: semesters } = useQuery({
  //   ...getSemestersQuery(),
  //   initialData: [],
  // });

  // const initialData = useLoaderData() as MainLoaderResult;

  const { data: darkMode } = useQuery({ ...getDarkModeSettingQuery() });

  const { data: sets } = useQuery({
    ...getSetsQuery(),
  });

  const { data: set } = useQuery({
    ...getSetByIdQuery(sets ? sets[0]?.id : ""),
    enabled: sets && sets[0]?.id !== null && sets[0]?.id !== undefined,
  });

  const { data: learningProgress } = useQuery({
    ...getLearningProgressQuery(sets ? sets[0]?.id : ""),
    enabled: sets && sets[0]?.id !== null && sets[0]?.id !== undefined,
  });

  return (
    <div className="relative bg-gradient-to-b from-purple-100 to-purple-50 dark:from-indigo-800 dark:to-purple-800 min-h-screen">
      <div className="absolute w-full h-full top-0 left-0 z-0 bg-slate-500 opacity-0 dark:opacity-90 mix-blend-multiply"></div>
      <div className="absolute -left-32 -top-64">
        {!darkMode?.value ? (
          <img src="/images/background-light.svg" className="w-30 h-30" />
        ) : (
          <img src="/images/background-dark.svg" className="w-35 h-35" />
        )}
      </div>

      <Header className="relative z-10" />
      <div className="relative z-10 p-10">
        <div className="mb-3 flex flex-row flex-wrap space-x-4">
          <Switch />
          <SemesterFilter />
        </div>
        <div className="mt-5">
          <div className="flex flex-row flex-wrap space-x-10">
            <div className="flex-grow">
              <Progress
                variant="indigo"
                icon={<FontAwesomeIcon icon={faBookOpen} />}
                currentProgressText={`${
                  learningProgress?.termsLearned || 0
                } terms`}
                description="Learning..."
                progress={
                  learningProgress &&
                  learningProgress.termsLearned / learningProgress.termsTotal
                }
              />
            </div>
            <div className="flex-grow">
              <Progress
                variant="purple"
                icon={<FontAwesomeIcon icon={faGraduationCap} />}
                currentProgressText={`${
                  learningProgress?.termsMastered || 0
                } terms`}
                description="Master"
                progress={
                  learningProgress &&
                  learningProgress.termsMastered / learningProgress.termsTotal
                }
              />
            </div>
          </div>
          <div className="mt-5">
            <LearningCard setId={sets && sets[0].id} />
          </div>
        </div>
        <div className="mt-5">
          <ListFlashcard sets={sets} />
        </div>
        <div className="mt-5">
          <SetEdit set={set} />
        </div>
        <div className="mt-6">
          <BigFlashcardStack terms={set?.terms} />
        </div>
        <div className="mt-5">
          <ListTerm terms={set?.terms} />
        </div>
      </div>
    </div>
  );
};
