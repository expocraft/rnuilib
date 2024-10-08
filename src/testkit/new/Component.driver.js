export const useComponentDriver = props => {
  const {
    renderTree,
    testID
  } = props;
  const getElement = () => {
    const elements = renderTree.queryAllByTestId(testID);
    if (elements.length > 1) {
      throw new Error(`Found more than one element with testID: ${testID}`);
    }
    const element = elements[0];
    if (element) {
      return element;
    } else {
      throw new Error(`Could not find element with testID: ${testID}`);
    }
  };
  const exists = () => {
    try {
      getElement();
      return true;
    } catch {
      return false;
    }
  };
  return {
    getElement,
    exists
  };
};
export const ComponentDriver = props => {
  return useComponentDriver(props);
};