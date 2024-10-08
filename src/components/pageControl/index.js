import _times from "lodash/times";
import _map from "lodash/map";
import _isEmpty from "lodash/isEmpty";
import React, { PureComponent } from 'react';
import { StyleSheet, LayoutAnimation } from 'react-native';
import { asBaseComponent } from "../../commons/new";
import { Colors } from "../../style";
import TouchableOpacity from "../touchableOpacity";
import View from "../view";
const MAX_SHOWN_PAGES = 7;
const NUM_LARGE_INDICATORS = 3;
const DEFAULT_INDICATOR_COLOR = Colors.$iconPrimary;
function getColorStyle(isCurrentPage, color, inactiveColor) {
  const activeColor = color || DEFAULT_INDICATOR_COLOR;
  return {
    borderColor: isCurrentPage ? activeColor : inactiveColor || activeColor,
    backgroundColor: isCurrentPage ? activeColor : inactiveColor || 'transparent'
  };
}
function getSizeStyle(size, index, currentPage, enlargeActive) {
  const temp = enlargeActive ? index === currentPage ? size + 2 : size : size;
  return {
    width: temp,
    height: temp,
    borderRadius: temp / 2
  };
}
function getNumberOfPagesShown(props) {
  return Math.min(MAX_SHOWN_PAGES, props.numOfPages);
}
/**
 * @description: Page indicator, typically used in paged scroll-views
 * @gif: https://user-images.githubusercontent.com/1780255/107114259-2e278d00-686d-11eb-866c-59f3d410d6c3.gif
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/PageControlScreen.tsx
 */
class PageControl extends PureComponent {
  static displayName = 'PageControl';
  static DEFAULT_SIZE = 10;
  static DEFAULT_SPACING = 4;
  static defaultProps = {
    enlargeActive: false
  };
  constructor(props) {
    super(props);
    this.state = {
      numOfPagesShown: getNumberOfPagesShown(props),
      largeIndicatorsOffset: 0,
      pagesOffset: 0,
      prevPage: undefined
    };
    if (Array.isArray(props.size)) {
      if (props.size[0] >= props.size[1] || props.size[1] >= props.size[2]) {
        console.warn('It is recommended that largeSize > mediumSize > smallSize, currently: smallSize=', props.size[0], 'mediumSize=', props.size[1], 'largeSize=', props.size[2]);
      }
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      currentPage
    } = nextProps;
    const {
      largeIndicatorsOffset: prevLargeIndicatorsOffset,
      prevPage
    } = prevState;
    const newState = {};
    if (currentPage !== prevPage) {
      newState.prevPage = currentPage;
      if (currentPage >= prevLargeIndicatorsOffset + NUM_LARGE_INDICATORS) {
        PageControl.animate(nextProps);
        newState.pagesOffset = Math.max(0, currentPage - NUM_LARGE_INDICATORS - 1);
        newState.largeIndicatorsOffset = currentPage - NUM_LARGE_INDICATORS + 1;
      } else if (currentPage < prevLargeIndicatorsOffset) {
        PageControl.animate(nextProps);
        newState.pagesOffset = Math.max(0, currentPage - 2);
        newState.largeIndicatorsOffset = currentPage;
      }
    }
    return _isEmpty(newState) ? null : newState;
  }
  static animate(props) {
    if (PageControl.showLimitedVersion(props)) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 100
      });
    }
  }
  static showLimitedVersion({
    limitShownPages,
    numOfPages
  }) {
    return limitShownPages && numOfPages > 5;
  }
  getSize(index) {
    const {
      largeIndicatorsOffset
    } = this.state;
    const {
      numOfPages
    } = this.props;
    let mediumSize,
      smallSize,
      {
        size = PageControl.DEFAULT_SIZE
      } = this.props;
    if (Array.isArray(size)) {
      smallSize = size[0];
      mediumSize = size[1];
      size = size[2];
    } else {
      mediumSize = size * 2 / 3;
      smallSize = size / 3;
    }
    if (index < 0 || index > numOfPages - 1) {
      return undefined;
    } else if (index >= largeIndicatorsOffset && index < largeIndicatorsOffset + NUM_LARGE_INDICATORS) {
      return size;
    } else if (index === largeIndicatorsOffset - 1 || index === largeIndicatorsOffset + NUM_LARGE_INDICATORS) {
      return mediumSize;
    } else if (index === largeIndicatorsOffset - 2 || index === largeIndicatorsOffset + NUM_LARGE_INDICATORS + 1) {
      return smallSize;
    }
  }
  onPagePress = ({
    customValue: index
  }) => {
    PageControl.animate(this.props);
    this.props.onPagePress?.(index);
  };
  renderIndicator(index, size, enlargeActive) {
    const {
      currentPage,
      color,
      inactiveColor,
      onPagePress,
      spacing = PageControl.DEFAULT_SPACING
    } = this.props;
    return <TouchableOpacity customValue={index} onPress={onPagePress && this.onPagePress} key={index} style={[styles.pageIndicator, {
      marginHorizontal: spacing / 2
    }, getColorStyle(index === currentPage, color, inactiveColor), getSizeStyle(size, index, currentPage, enlargeActive)]} />;
  }
  renderDifferentSizeIndicators() {
    const {
      numOfPagesShown,
      pagesOffset
    } = this.state;
    return _map(_times(numOfPagesShown), index => {
      const adjustedIndex = index + pagesOffset;
      const adjustedSize = this.getSize(adjustedIndex);
      if (adjustedSize) {
        return this.renderIndicator(adjustedIndex, adjustedSize, false);
      } else {
        return null;
      }
    });
  }
  renderSameSizeIndicators() {
    const {
      numOfPages,
      size: sizeFromProps = PageControl.DEFAULT_SIZE,
      enlargeActive
    } = this.props;
    const size = Array.isArray(sizeFromProps) ? sizeFromProps[2] : sizeFromProps;
    return _map(_times(numOfPages), index => this.renderIndicator(index, size, enlargeActive));
  }
  render() {
    const {
      containerStyle,
      testID
    } = this.props;
    return <View style={[styles.container, containerStyle]} inaccessible testID={testID}>
        {PageControl.showLimitedVersion(this.props) ? this.renderDifferentSizeIndicators() : this.renderSameSizeIndicators()}
      </View>;
  }
}

// @ts-expect-error
export default asBaseComponent(PageControl);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageIndicator: {
    backgroundColor: 'transparent',
    borderWidth: 1
  }
});