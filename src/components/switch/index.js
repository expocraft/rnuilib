import React, { Component } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { Colors, BorderRadiuses } from "../../style";
import { Constants, asBaseComponent } from "../../commons/new";
import TouchableOpacity from "../touchableOpacity";
const INNER_PADDING = 2;
const DEFAULT_WIDTH = 42;
const DEFAULT_HEIGHT = 24;
const DEFAULT_THUMB_SIZE = 20;
/**
 * @description: Switch component for toggling boolean value related to some context
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/SwitchScreen.tsx
 * @gif: https://github.com/wix/react-native-ui-lib/blob/master/demo/showcase/Switch/Switch.gif?raw=true
 */
class Switch extends Component {
  static displayName = 'Switch';
  state = {
    thumbPosition: new Animated.Value(this.props.value ? 1 : 0)
  };
  styles = createStyles(this.props);
  componentDidUpdate(prevProps) {
    const {
      value
    } = this.props;
    if (prevProps.value !== value) {
      this.toggle(value);
    }
  }
  getAccessibilityProps() {
    const {
      disabled,
      value
    } = this.props;
    return {
      accessible: true,
      accessibilityRole: 'switch',
      accessibilityState: {
        disabled,
        checked: value ? 'checked' : 'unchecked'
      },
      accessibilityValue: {
        text: value ? '1' : '0'
      }
    };
  }
  toggle(value) {
    const {
      thumbPosition
    } = this.state;
    Animated.timing(thumbPosition, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.77, 0.0, 0.175, 1.0),
      useNativeDriver: true
    }).start();
  }
  onPress = () => {
    const {
      disabled
    } = this.props;
    if (!disabled) {
      this.props.onValueChange?.(!this.props.value);
    }
  };
  calcThumbOnPosition() {
    const props = this.props;
    const width = props.width || DEFAULT_WIDTH;
    const thumbSize = props.thumbSize || DEFAULT_THUMB_SIZE;
    let position = width - (2 * INNER_PADDING + thumbSize);
    position *= Constants.isRTL ? -1 : 1;
    return position;
  }
  getSwitchStyle() {
    const {
      value,
      onColor,
      offColor,
      style: propsStyle,
      disabled,
      disabledColor
    } = this.props;
    const style = [this.styles.switch];
    if (disabled) {
      style.push(disabledColor ? {
        backgroundColor: disabledColor
      } : this.styles.switchDisabled);
    } else if (value) {
      style.push(onColor ? {
        backgroundColor: onColor
      } : this.styles.switchOn);
    } else {
      style.push(offColor ? {
        backgroundColor: offColor
      } : this.styles.switchOff);
    }
    style.push(propsStyle);
    return style;
  }
  renderThumb() {
    const {
      thumbStyle
    } = this.props;
    const {
      thumbPosition
    } = this.state;
    const interpolatedTranslateX = thumbPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.calcThumbOnPosition()]
    });
    const thumbPositionStyle = {
      transform: [{
        translateX: interpolatedTranslateX
      }]
    };
    return <Animated.View style={[this.styles.thumb, thumbPositionStyle, thumbStyle]} />;
  }
  render() {
    const {
      ...others
    } = this.props;
    return (
      // @ts-ignore
      <TouchableOpacity {...this.getAccessibilityProps()} activeOpacity={1} {...others} style={this.getSwitchStyle()} onPress={this.onPress}>
        {this.renderThumb()}
      </TouchableOpacity>
    );
  }
}
function createStyles({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  onColor = Colors.$backgroundPrimaryHeavy,
  offColor = Colors.$backgroundNeutralHeavy,
  disabledColor = Colors.$backgroundDisabled,
  thumbColor = Colors.$iconDefaultLight,
  thumbSize = DEFAULT_THUMB_SIZE
}) {
  return StyleSheet.create({
    switch: {
      width,
      height,
      borderRadius: BorderRadiuses.br100,
      justifyContent: 'center',
      padding: INNER_PADDING
    },
    switchOn: {
      backgroundColor: onColor
    },
    switchOff: {
      backgroundColor: offColor
    },
    switchDisabled: {
      backgroundColor: disabledColor
    },
    thumb: {
      width: thumbSize,
      height: thumbSize,
      borderRadius: thumbSize / 2,
      backgroundColor: thumbColor
    }
  });
}
export default asBaseComponent(Switch);