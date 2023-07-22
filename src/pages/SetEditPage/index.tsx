import { useParams } from "react-router-dom";
import { SetEdit } from "../../entities/SetEdit";
import { useQuery } from "@tanstack/react-query";
import { getSetByIdQuery } from "../../providers/operation/queries";
import { Param } from "./type";

export const SetEditPage = () => {
  const { setId } = useParams<Param>();
  const { data: set } = useQuery({
    ...getSetByIdQuery(setId || ""),
    refetchOnWindowFocus: false,
  });

  return (
    <div className={`mt-5 p-10 h-full`}>
      <SetEdit set={set} />
    </div>
  );
};
