import { StyleSheet } from 'react-native';
const findStyle = (key, component) => {
  return StyleSheet.flatten(component.props.style)[key];
};
export { findStyle };