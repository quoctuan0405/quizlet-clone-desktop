import { Term as TermFormValue } from "../../ListEditTerm";
import { Term } from "..";

export const convertToListTermFormValue = (terms?: Term[]): TermFormValue[] => {
  return terms
    ? terms.map(({ id, index, question, answer, explanation }) => ({
        id,
        index,
        question:
          typeof question === "string"
            ? [
                {
                  type: "paragraph",
                  align: "left",
                  children: [{ text: question }],
                },
              ]
            : question,
        answer:
          typeof answer === "string"
            ? [
                {
                  type: "paragraph",
                  align: "left",
                  children: [{ text: answer }],
                },
              ]
            : answer,
        explanation:
          typeof explanation === "string" ||
          explanation === null ||
          explanation === undefined
            ? [
                {
                  type: "paragraph",
                  align: "left",
                  children: [{ text: explanation ? explanation : "" }],
                },
              ]
            : explanation,
      }))
    : [];
};
