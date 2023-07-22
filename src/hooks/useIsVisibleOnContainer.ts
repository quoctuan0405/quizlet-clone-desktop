export const useIsVisibleOnContainer = () => {
  return (
    element: HTMLElement | null | undefined,
    container: HTMLElement | null | undefined
  ) => {
    if (!element || !container) {
      return false;
    }

    return (
      element.getBoundingClientRect().top >=
        container.getBoundingClientRect().top &&
      element.getBoundingClientRect().left >=
        container.getBoundingClientRect().left &&
      element.getBoundingClientRect().bottom <=
        container.getBoundingClientRect().bottom &&
      element.getBoundingClientRect().right <=
        container.getBoundingClientRect().right
    );
  };
};
