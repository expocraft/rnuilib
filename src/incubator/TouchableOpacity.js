import React, { useCallback, useMemo } from 'react';
import Reanimated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, interpolate, interpolateColor, runOnJS } from 'react-native-reanimated';
import { TapGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler';
import { asBaseComponent, forwardRef } from "../commons/new";
import View from "../components/view";
import { Colors } from "../../src/style";
/**
 * @description: a Better, enhanced TouchableOpacity component
 * @modifiers: flex, margin, padding, background
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/incubatorScreens/TouchableOpacityScreen.js
 */
function TouchableOpacity(props) {
  const {
    children,
    modifiers,
    style,
    disabled,
    forwardedRef,
    feedbackColor,
    activeOpacity = 0.2,
    activeScale = 1,
    ...others
  } = props;
  const {
    borderRadius,
    paddings,
    margins,
    alignments,
    flexStyle
  } = modifiers;
  const isActive = useSharedValue(0);
  /* This flag is for fixing an issue with long press triggering twice
  TODO: Consider revisiting this issue to see if it still occurs */
  const isLongPressed = useSharedValue(false);
  const backgroundColor = useMemo(() => {
    return props.backgroundColor || modifiers.backgroundColor || Colors.transparent;
  }, [props.backgroundColor, modifiers.backgroundColor]);
  const onPress = useCallback(() => {
    props.onPress?.(props);
  }, [props.onPress, props.customValue]);
  const onLongPress = useCallback(() => {
    props.onLongPress?.(props);
  }, [props.onLongPress, props.customValue]);
  const toggleActive = value => {
    'worklet';

    isActive.value = withTiming(value, {
      duration: 200
    });
  };
  const tapGestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      toggleActive(1);
    },
    onEnd: () => {
      toggleActive(0);
      runOnJS(onPress)();
    },
    onFail: () => {
      if (!isLongPressed.value) {
        toggleActive(0);
      }
    }
  });
  const longPressGestureHandler = useAnimatedGestureHandler({
    onActive: () => {
      if (!isLongPressed.value) {
        isLongPressed.value = true;
        runOnJS(onLongPress)();
      }
    },
    onFinish: () => {
      toggleActive(0);
      isLongPressed.value = false;
    }
  });

  // @ts-expect-error should be fixed in version 3.5 (https://github.com/software-mansion/react-native-reanimated/pull/4881)
  const animatedStyle = useAnimatedStyle(() => {
    const activeColor = feedbackColor || backgroundColor;
    const opacity = interpolate(isActive.value, [0, 1], [1, activeOpacity]);
    const scale = interpolate(isActive.value, [0, 1], [1, activeScale]);
    return {
      backgroundColor: !feedbackColor ? backgroundColor : interpolateColor(isActive.value, [0, 1], [backgroundColor, activeColor]),
      opacity,
      transform: [{
        scale
      }]
    };
  }, [backgroundColor, feedbackColor]);
  const Container = props.onLongPress ? LongPressGestureHandler : View;
  return <TapGestureHandler onGestureEvent={tapGestureHandler} shouldCancelWhenOutside enabled={!disabled}>
      <Reanimated.View>
        <Container onGestureEvent={longPressGestureHandler} shouldCancelWhenOutside>
          <Reanimated.View {...others} ref={forwardedRef} style={[borderRadius && {
          borderRadius
        }, flexStyle, paddings, margins, alignments, {
          backgroundColor
        }, style, animatedStyle]}>
            {children}
          </Reanimated.View>
        </Container>
      </Reanimated.View>
    </TapGestureHandler>;
}
TouchableOpacity.displayName = 'Incubator.TouchableOpacity';
export default asBaseComponent(forwardRef(TouchableOpacity));