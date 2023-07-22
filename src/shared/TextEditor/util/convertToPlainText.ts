import { Descendant, Element } from "slate";

export const convertListDescendantToPlainText = (
  descendants: Descendant[] | string
): string => {
  if (typeof descendants === "string") {
    return descendants;
  }

  let result = "";

  for (let descendant of descendants) {
    result += convertDescendantToPlainText(descendant) + "\n";
  }

  return result;
};

export const convertDescendantToPlainText = (
  descendant: Descendant
): string => {
  if (typeof descendant === "string") {
    return descendant;
  }

  let result = "";

  if (Element.isElement(descendant)) {
    for (let children of descendant.children) {
      result += children.text + " ";
    }
  } else {
    result = descendant.text;
  }

  return result;
};
