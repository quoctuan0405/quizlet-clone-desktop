import { read, utils } from "xlsx";
import {
  ColumnMapper,
  OptionsAddUnqiueId,
  OptionsNotAddUniqueId,
  SetResult,
  TermWithId,
} from "../type";
import { v4 as uuidv4 } from "uuid";

export const readfile = async <
  T extends OptionsAddUnqiueId | OptionsNotAddUniqueId
>(
  file?: File | null,
  options?: T
): Promise<SetResult<T>[]> => {
  // If file is null or undefined, return empty set
  if (!file) {
    return [];
  }

  // List set (each sheet corresponding to one set)
  const sets: SetResult<T>[] = [];

  // Convert to array buffer for xlsx to read
  const buffer = await file?.arrayBuffer();

  // Read to workbook
  const workbook = read(buffer, { type: "buffer" });

  // Loop through each sheet to import
  // Each sheet will be one set
  for (let sheetName of workbook.SheetNames) {
    // Set
    const set: SetResult<T> = {
      name: "",
      description: "",
      terms: [],
    };

    // Get sheet
    const sheet = workbook.Sheets[sheetName];

    // Get rows
    const rows: (string | number | undefined)[][] = utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
    });

    // Get the row num of header (of list term)
    // Any row after that will be mapped to Term
    let headerRowIndex = -1;
    let columnMapper: ColumnMapper | undefined;

    // Loop through each row
    for (let i = 0; i < rows.length; i++) {
      // Get row
      const row = rows[i];

      // New term for mapping
      let term: TermWithId = {
        id: "",
        index: 0,
        question: "",
        answer: "",
        explanation: "",
      };

      // Any row after header will mapped to term
      if (headerRowIndex !== -1 && i > headerRowIndex) {
        for (let j = 0; j < row.length; j++) {
          // Get cell
          const cell = row[j];

          // Map to term
          switch (columnMapper && columnMapper[j]) {
            case "id":
              if (cell !== undefined) {
                term.id = typeof cell === "string" ? cell : cell.toString();
              }
              break;

            case "index":
              if (cell !== undefined) {
                term.index = typeof cell === "string" ? parseInt(cell) : cell;
              } else {
                term.index = 0;
              }
              break;

            case "term":
              if (cell !== undefined) {
                term.question =
                  typeof cell === "string" ? cell : cell.toString();
              }
              break;

            case "definition":
              if (cell !== undefined) {
                term.answer = typeof cell === "string" ? cell : cell.toString();
              }
              break;

            case "explanation":
              if (cell !== undefined) {
                term.explanation =
                  typeof cell === "string" ? cell : cell.toString();
              }
              break;
          }
        }
      }

      // Get header
      const header = isHeader(row);

      if (header) {
        headerRowIndex = i;
        columnMapper = header;
        continue;
      }

      // Get set name
      if (i === 0 && !header && row.length > 0) {
        set.name = row[0]?.toString() || "";
        continue;
      }

      // Get set description
      if (i === 1 && !header && row.length > 0) {
        set.description = row[0]?.toString() || "";
        continue;
      }

      // Generate unique id if needed
      if (options?.addUniqueId && !term.id) {
        term.id = uuidv4();
      }

      set.terms.push(term);
    }

    // Add to sets
    sets.push(set);
  }

  return sets;
};

// Check if that row is a header
// Eg: [#, Term, Definition, Explanation]
// Return a header mapper (key is the index, value is the ColumnName)
const isHeader = (
  row: (string | number | undefined)[]
): ColumnMapper | null | undefined => {
  const columnMapper: ColumnMapper = {};

  // Index (not required)
  const indexIndex = row.findIndex(
    (cell) =>
      typeof cell === "string" &&
      (cell.toLowerCase() === "#" || cell.toLowerCase() === "index")
  );

  columnMapper[indexIndex] = "index";

  // Term (required)
  const termIndex = row.findIndex(
    (cell) => typeof cell === "string" && cell.toLowerCase() === "term"
  );

  if (termIndex === -1) {
    return null;
  } else {
    columnMapper[termIndex] = "term";
  }

  // Definition (required)
  const definitionIndex = row.findIndex(
    (cell) => typeof cell === "string" && cell.toLowerCase() === "definition"
  );

  if (definitionIndex === -1) {
    return null;
  } else {
    columnMapper[definitionIndex] = "definition";
  }

  // Explanation (not required)
  const explanationIndex = row.findIndex(
    (cell) => typeof cell === "string" && cell.toLowerCase() === "explanation"
  );

  columnMapper[explanationIndex] = "explanation";

  return columnMapper;
};
