import _get from "lodash/get";
import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Colors } from "../../style";
import { Constants, asBaseComponent } from "../../commons/new";
import { LogService } from "../../services";
import View from "../view";
import ScrollBar from "../scrollBar";
import TabBarItem from "./TabBarItem";
const MIN_TABS_FOR_SCROLL = 1;
const DEFAULT_BACKGROUND_COLOR = Colors.white;
const DEFAULT_HEIGHT = 48;
/**
 * @description: TabBar Component
 * @modifiers: alignment, flex, padding, margin, background, typography, color (list of supported modifiers)
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/TabBarScreen.tsx
 * @extends: ScrollBar
 * @notes: This is screen width component.
 */
class TabBar extends Component {
  static displayName = 'TabBar';
  static defaultProps = {
    selectedIndex: 0
  };
  static Item = TabBarItem;
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: false,
      currentIndex: props.selectedIndex || 0
    };
    this.contentOffset = {
      x: 0,
      y: 0
    };
    this.scrollBar = React.createRef();
    this.itemsRefs = [];
    LogService.componentDeprecationWarn({
      oldComponent: 'TabBar',
      newComponent: 'TabController'
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const prevChildrenCount = React.Children.count(prevProps.children);
    if (this.childrenCount !== prevChildrenCount) {
      this.updateIndicator(0);
    }
    // TODO: since we're implementing an uncontrolled component here, we should verify the selectedIndex has changed
    // between this.props and nextProps (basically the meaning of selectedIndex should be initialIndex)
    const isIndexManuallyChanged = this.props.selectedIndex !== prevState.currentIndex && prevProps.selectedIndex !== this.props.selectedIndex;
    if (isIndexManuallyChanged) {
      this.updateIndicator(this.props.selectedIndex);
    }
  }

  // generateStyles() {
  //   this.styles = createStyles(this.props);
  // }

  get childrenCount() {
    return React.Children.count(this.props.children);
  }
  get scrollContainerWidth() {
    return this.props.containerWidth || Constants.screenWidth;
  }
  isIgnored(index) {
    const child = React.Children.toArray(this.props.children)[index];
    return _get(child, 'props.ignore');
  }
  hasOverflow() {
    return this.scrollContentWidth && this.scrollContentWidth > this.scrollContainerWidth;
  }
  shouldBeMarked = index => {
    return this.state.currentIndex === index && !this.isIgnored(index) && this.childrenCount > 1;
  };
  updateIndicator(index) {
    if (index !== undefined && !this.isIgnored(index)) {
      this.setState({
        currentIndex: index
      }, () => {
        this.scrollToSelected();
      });
    }
  }
  scrollToSelected(animated = true) {
    const childRef = this.itemsRefs[this.state.currentIndex];
    const childLayout = childRef.getLayout();
    if (childLayout && this.hasOverflow()) {
      if (childLayout.x + childLayout.width - this.contentOffset.x > this.scrollContainerWidth) {
        this.scrollBar?.current?.scrollTo?.({
          x: childLayout.x - this.scrollContainerWidth + childLayout.width,
          y: 0,
          animated
        });
      } else if (childLayout.x - this.contentOffset.x < 0) {
        this.scrollBar?.current?.scrollTo?.({
          x: childLayout.x,
          y: 0,
          animated
        });
      }
    }
  }
  onChangeIndex(index) {
    this.props.onChangeIndex?.(index);
  }
  onTabSelected(index) {
    this.props.onTabSelected?.(index);
  }
  onItemPress = (index, props) => {
    this.updateIndicator(index);
    setTimeout(() => {
      if (!props.ignore) {
        this.onChangeIndex(index);
      }
      this.onTabSelected(index);
      props.onPress?.();
    }, 0);
  };
  onScroll = event => {
    const {
      contentOffset
    } = event.nativeEvent;
    this.contentOffset = contentOffset;
  };
  onContentSizeChange = width => {
    if (this.scrollContentWidth !== width) {
      this.scrollContentWidth = width;
      const {
        minTabsForScroll
      } = this.props;
      const minChildrenCount = minTabsForScroll || MIN_TABS_FOR_SCROLL;
      if (this.hasOverflow() && this.childrenCount > minChildrenCount) {
        this.setState({
          scrollEnabled: true
        });
      }
    }
  };
  renderTabBar() {
    const {
      height,
      backgroundColor = DEFAULT_BACKGROUND_COLOR,
      containerView,
      containerProps,
      gradientMargins
    } = this.props;
    const {
      scrollEnabled
    } = this.state;
    const containerHeight = height || DEFAULT_HEIGHT;
    return <ScrollBar
    // @ts-ignore
    ref={this.scrollBar} contentContainerStyle={styles.scrollBarContainer} scrollEnabled={scrollEnabled} scrollEventThrottle={16} onScroll={this.onScroll} onContentSizeChange={this.onContentSizeChange} height={containerHeight} gradientColor={backgroundColor} containerView={containerView} containerProps={containerProps} gradientMargins={gradientMargins}>
        <View row style={[styles.tabBar, {
        height: containerHeight,
        backgroundColor
      }]}>
          {this.renderChildren()}
        </View>
      </ScrollBar>;
  }
  renderChildren() {
    this.itemsRefs = [];
    const {
      indicatorStyle,
      darkTheme
    } = this.props;
    const children = React.Children.map(this.props.children, (child, index) => {
      // @ts-ignore
      const accessLabel = child?.props.accessibilityLabel || child.props.label || '';

      //TODO: review it again, all types here should be correct. As from React.Children.map it gets definitely child: React.ReactNode, and React.cloneElement does not accept it.
      // But seems it's work in a real life, so maybe it is just trouble with types compatibility
      //@ts-ignore
      return React.cloneElement(child, {
        indicatorStyle,
        darkTheme,
        selected: this.shouldBeMarked(index),
        onPress: () => {
          // @ts-ignore
          this.onItemPress(index, child.props);
        },
        ref: r => {
          this.itemsRefs[index] = r;
        },
        accessibilityLabel: `${accessLabel} ${index + 1} out of ${this.childrenCount}`
      });
    });
    return children;
  }
  render() {
    const {
      enableShadow,
      style,
      backgroundColor = DEFAULT_BACKGROUND_COLOR
    } = this.props;
    return (
      // @ts-ignore
      <View useSafeArea style={[styles.container, enableShadow && styles.containerShadow, style, {
        height: undefined,
        width: this.scrollContainerWidth,
        backgroundColor
      }]}>
        {this.renderTabBar()}
      </View>
    );
  }
}
export default asBaseComponent(TabBar);
const styles = StyleSheet.create({
  container: {
    zIndex: 100
  },
  containerShadow: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.grey10,
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
          height: 6,
          width: 0
        }
      },
      android: {
        elevation: 5,
        backgroundColor: Colors.white
      }
    })
  },
  tabBar: {
    flex: 1
  },
  shadowImage: {
    width: '100%'
  },
  scrollBarContainer: {
    minWidth: '100%'
  }
});