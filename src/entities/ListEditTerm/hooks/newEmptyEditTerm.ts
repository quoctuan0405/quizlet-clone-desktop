import { v4 as uuidv4 } from "uuid";
import { Term } from "..";

export const newEmptyEditTerm = (index: number): Term => ({
  id: uuidv4(),
  index,
  question: [
    {
      type: "paragraph",
      align: "left",
      children: [{ text: "" }],
    },
  ],
  answer: [
    {
      type: "paragraph",
      align: "left",
      children: [{ text: "" }],
    },
  ],
  explanation: [
    {
      type: "paragraph",
      align: "left",
      children: [{ text: "" }],
    },
  ],
});
