import { Descendant } from "slate";
import { Button } from "../../shared/Button";
import { read, writeFileXLSX, utils } from "xlsx";
import { convertListDescendantToPlainText } from "../../shared/TextEditor/util/convertToPlainText";

interface Term {
  index?: number;
  question: string | Descendant[];
  answer: string | Descendant[];
  explanation?: string | Descendant[];
}

interface Set {
  name: string;
  description?: string;
  terms: Term[];
}

interface Props {
  set?: Set;
}

export const ExportFile: React.FC<Props> = ({ set }) => {
  const exportFile = () => {
    if (set) {
      // Result
      const result: any[][] = [];

      result.push([set.name, , ,]);
      result.push([set.description, , ,]);

      result.push([, , ,]);
      result.push([, , ,]);
      result.push([, , ,]);

      result.push(["#", "Term", "Definition", "Explanation"]);
      for (let term of set.terms) {
        result.push([
          term.index,
          convertListDescendantToPlainText(term.question),
          convertListDescendantToPlainText(term.answer),
          convertListDescendantToPlainText(term.explanation || ""),
        ]);
      }

      // Export file
      var wb = utils.book_new();
      var ws = utils.aoa_to_sheet(result);
      utils.book_append_sheet(wb, ws, "Sheet1");

      writeFileXLSX(wb, `${set ? `${set.name}.xlsx` : "New set.xlsx"}`, {
        type: "base64",
      });
    }
  };

  return (
    <Button onClick={() => exportFile()}>
      <p className="font-semibold text-sm text-white mx-2 my-1">Export</p>
    </Button>
  );
};
