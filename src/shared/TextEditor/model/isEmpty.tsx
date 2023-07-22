import { Descendant, Element } from "slate";

export const isEmpty = (value?: Descendant[]): boolean => {
  if (!value) {
    return true;
  }

  if (value.length === 0) {
    return true;
  } else if (value.length === 1) {
    const descendant = value[0];

    if (Element.isElement(descendant)) {
      if (descendant.children.length === 0) {
        return true;
      } else {
        for (let children of descendant.children) {
          if (children.text !== "") {
            return false;
          }
        }

        return true;
      }
    } else {
      return descendant.text === "";
    }
  } else {
    return false;
  }
};
