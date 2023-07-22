import _ from "lodash";
import { Descendant, Element } from "slate";
import { Align } from "../model/CustomEditor";

export interface Options {
  align: Align;
}

export const convertToListDescendant = (
  value: Descendant[] | string | number | boolean | null | undefined,
  options?: Options
): Descendant[] => {
  if (!value) {
    return [
      {
        type: "paragraph",
        align: options?.align || "left",
        children: [
          {
            text: "",
          },
        ],
      },
    ];
  } else if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value[Symbol.iterator] !== "function" ||
    value === null ||
    value === undefined
  ) {
    return [
      {
        type: "paragraph",
        align: options?.align || "left",
        children: [
          {
            text: value !== null && value !== undefined ? value.toString() : "",
          },
        ],
      },
    ];
  } else {
    const descendants: Descendant[] = [];

    for (let descendant of value) {
      descendants.push(convertToDescendant(descendant, options));
    }

    return descendants;
  }
};

export const convertToDescendant = (
  descendant: Descendant,
  options?: Options
) => {
  let clonedDescendant = _.clone(descendant);

  if (Element.isElement(clonedDescendant)) {
    clonedDescendant.align = options?.align || "left";
  }

  return clonedDescendant;
};
