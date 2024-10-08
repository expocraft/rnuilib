import React from 'react';
import { LayoutChangeEvent } from 'react-native';
type ScrollEnablerProps = {
    onContentSizeChange: (contentWidth: number, contentHeight: number) => void;
    onLayout: (event: LayoutChangeEvent) => void;
    scrollEnabled: boolean;
};
export type WithScrollEnablerProps = {
    scrollEnablerProps: ScrollEnablerProps;
    ref?: any;
};
declare function withScrollEnabler<PROPS, STATICS = {}>(WrappedComponent: React.ComponentType<PROPS & WithScrollEnablerProps>): React.ComponentType<PROPS> & STATICS;
export default withScrollEnabler;
