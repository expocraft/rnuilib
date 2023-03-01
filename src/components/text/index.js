import _isString from 'lodash/isString';
import _map from 'lodash/map';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import React, {PureComponent} from 'react';
import {Text as RNText, StyleSheet, Animated} from 'react-native';
import {asBaseComponent, forwardRef} from '../../commons/new';
import {Colors} from '../../style';
import {TextUtils} from '../../utils';
/**
 * @description: A wrapper for Text component with extra functionality like modifiers support
 * @extends: Text
 * @extendsLink: https://reactnative.dev/docs/text
 * @modifiers: margins, color, typography
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/TextScreen.tsx
 * @image: https://github.com/wix/react-native-ui-lib/blob/master/demo/showcase/Text/Modifiers.png?raw=true, https://github.com/wix/react-native-ui-lib/blob/master/demo/showcase/Text/Transformation.png?raw=true, https://github.com/wix/react-native-ui-lib/blob/master/demo/showcase/Text/Highlights.png?raw=true
 */
class Text extends PureComponent {
  static displayName = 'Text';
  TextContainer = this.props.animated ? Animated.createAnimatedComponent(RNText) : RNText;

  // setNativeProps(nativeProps) {
  //   this._root.setNativeProps(nativeProps); // eslint-disable-line
  // }

  renderText(children) {
    const {highlightString, highlightStyle} = this.props;
    if (!_isEmpty(highlightString)) {
      if (_isArray(children)) {
        return _map(children, child => {
          return this.renderText(child);
        });
      }
      if (_isString(children)) {
        const textParts = highlightString && TextUtils.getPartsByHighlight(children, highlightString);
        return (
          textParts &&
          _map(textParts, (text, index) => {
            return (
              <RNText
                key={index}
                style={text.shouldHighlight ? [styles.highlight, highlightStyle] : styles.notHighlight}
              >
                {text.string}
              </RNText>
            );
          })
        );
      }
    }
    return children;
  }
  render() {
    const {modifiers, style, center, uppercase, underline, children, forwardedRef, ...others} = this.props;
    const color = this.props.color || modifiers.color;
    const {margins, typography, backgroundColor, flexStyle} = modifiers;

    const textStyle = [
      styles.container,
      center && styles.centered,
      uppercase && styles.uppercase,
      underline && styles.underline,
      underline && styles.underline,
      style,
      typography,
      color && {
        color
      },
      backgroundColor && {
        backgroundColor
      },
      flexStyle,
      margins
    ];
    const TextContainer = this.TextContainer;
    return (
      <TextContainer {...others} style={textStyle} ref={forwardedRef}>
        {this.renderText(children)}
      </TextContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    textAlign: 'left',
    color: Colors.$textDefault
  },
  centered: {
    textAlign: 'center'
  },
  uppercase: {
    textTransform: 'uppercase'
  },
  underline: {
    textDecorationLine: 'underline'
  },
  highlight: {
    color: Colors.grey30
  },
  notHighlight: {
    color: undefined
  }
});
export {Text}; // For tests

const modifiersOptions = {
  color: true,
  margins: true,
  typography: true,
  backgroundColor: true,
  flex: true
};
export default asBaseComponent(forwardRef(Text), {
  modifiersOptions
});
