import React from 'react';
import { requireNativeComponent } from 'react-native';
import TextInputKeyboardManager from "../TextInputKeyboardManager/TextInputKeyboardManager.android";
import KeyboardRegistry from "../KeyboardRegistry";
import CustomKeyboardViewBase from "../CustomKeyboardViewBase";
const CustomKeyboardViewNativeAndroid = requireNativeComponent('CustomKeyboardViewNativeTemp');
export default class CustomKeyboardView extends CustomKeyboardViewBase {
  static displayName = 'IGNORE';
  async componentDidUpdate(prevProps) {
    const {
      component
    } = this.props;
    if (prevProps.component !== component && !component) {
      await TextInputKeyboardManager.reset();
    }
    super.componentDidUpdate(prevProps);
  }
  render() {
    const {
      component,
      initialProps
    } = this.props;
    const KeyboardComponent = component && KeyboardRegistry.getKeyboard(component);
    return <CustomKeyboardViewNativeAndroid>
        {KeyboardComponent && <KeyboardComponent {...initialProps} />}
      </CustomKeyboardViewNativeAndroid>;
  }
}