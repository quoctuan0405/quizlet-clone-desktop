import { Descendant, Element } from "slate";

export const isListDescendantEmpty = (
  descendants: Descendant[] | string
): boolean => {
  for (let descendant of descendants) {
    if (!isDescendantEmpty(descendant)) {
      return false;
    }
  }

  return true;
};

export const isDescendantEmpty = (descendant: Descendant | string): boolean => {
  if (Element.isElement(descendant)) {
    for (let children of descendant.children) {
      if (
        children.text !== "" ||
        children.text !== null ||
        children.text !== undefined
      ) {
        return true;
      }
    }

    return false;
  } else if (typeof descendant === "string") {
    return descendant === "" || descendant === null || descendant === undefined;
  } else {
    return (
      descendant.text !== "" ||
      descendant.text !== null ||
      descendant.text !== undefined
    );
  }
};
