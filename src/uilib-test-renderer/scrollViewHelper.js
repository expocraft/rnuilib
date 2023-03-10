import { fireEvent } from '@testing-library/react-native';
const fireOnMomentumScrollEnd = (component, {
  x,
  y
}) => {
  fireEvent(component, 'onMomentumScrollEnd', getNativeEvent({
    x,
    y
  }));
};
const fireOnScroll = (component, {
  x,
  y
}) => {
  fireEvent.scroll(component, getNativeEvent({
    x,
    y
  }));
};
const getNativeEvent = ({
  x,
  y
}) => {
  return {
    nativeEvent: {
      contentOffset: {
        x,
        y
      }
    }
  };
};
export { fireOnMomentumScrollEnd, fireOnScroll };