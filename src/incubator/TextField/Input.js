import React, {useContext, useMemo} from 'react';
import {TextInput as RNTextInput, StyleSheet, Platform} from 'react-native';
import {Constants} from '../../commons/new';
import {getColorByState} from './Presenter';
import {Colors} from '../../style';
import FieldContext from './FieldContext';
import useImperativeInputHandle from './useImperativeInputHandle';
const DEFAULT_INPUT_COLOR = {
  default: Colors.$textDefault,
  disabled: Colors.$textDisabled
};
const Input = ({
  style,
  hint,
  color = DEFAULT_INPUT_COLOR,
  forwardedRef,
  formatter,
  useGestureHandlerInput,
  ...props
}) => {
  const inputRef = useImperativeInputHandle(forwardedRef, {
    onChangeText: props.onChangeText
  });
  const context = useContext(FieldContext);
  const placeholder = !context.isFocused ? props.placeholder : hint || props.placeholder;
  const inputColor = getColorByState(color, context);
  const placeholderTextColor = getColorByState(props.placeholderTextColor, context);
  const value = formatter && !context.isFocused ? formatter(props.value) : props.value;
  const TextInput = useMemo(() => {
    if (useGestureHandlerInput) {
      const {TextInput: GestureTextInput} = require('react-native-gesture-handler');
      return GestureTextInput;
    } else {
      return RNTextInput;
    }
  }, [useGestureHandlerInput]);
  return (
    <TextInput
      style={[
        styles.input,
        !!inputColor && {
          color: inputColor
        },
        style,
        Constants.isWeb && styles.webStyle
      ]}
      {...props}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      // @ts-expect-error
      ref={inputRef}
      underlineColorAndroid="transparent"
      accessibilityState={{
        disabled: props.editable === false
      }}
    />
  );
};
const styles = StyleSheet.create({
  input: {
    flexGrow: 1,
    textAlign: Constants.isRTL ? 'right' : 'left',
    // Setting paddingTop/Bottom separately fix height issues on iOS with multiline
    paddingTop: 0,
    paddingBottom: 0,
    ...Platform.select({
      // This reset android input inner spacing
      android: {
        padding: 0,
        textAlignVertical: 'center'
      }
    })
  }
  // webStyle: {
  //   // @ts-expect-error
  //   outlineWidth: 0
  // }
});
Input.displayName = 'Incubator.TextField';
export default Input;
