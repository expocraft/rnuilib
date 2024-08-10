import { ComponentProps } from '../../testkit/new/Component.driver';
export declare const TextFieldDriver: (props: ComponentProps) => {
    getValue: () => string | undefined;
    changeText: (text: string) => void;
    focus: () => void;
    blur: () => void;
    isEnabled: () => boolean;
    getPlaceholder: () => {
        exists: () => boolean;
        getText: () => string | undefined;
        getStyle: () => import("react-native").TextStyle;
        press: () => void;
        hasOnPress: () => boolean;
        onPressIn: () => void;
        hasOnPressIn: () => boolean;
        onPressOut: () => void;
        hasOnPressOut: () => boolean;
        onLongPress: () => void;
        hasOnLongPress: () => boolean;
        getElement: () => import("react-test-renderer").ReactTestInstance;
    };
    getLabel: () => {
        exists: () => boolean;
        getText: () => string | (string | import("react-test-renderer").ReactTestInstance)[];
        getStyle: () => import("react-native").TextStyle;
        press: () => void;
        hasOnPress: () => boolean;
        onPressIn: () => void;
        hasOnPressIn: () => boolean;
        onPressOut: () => void;
        hasOnPressOut: () => boolean;
        onLongPress: () => void;
        hasOnLongPress: () => boolean;
        getElement: () => import("react-test-renderer").ReactTestInstance;
    };
    getValidationMessage: () => {
        exists: () => boolean;
        getText: () => string | (string | import("react-test-renderer").ReactTestInstance)[];
        getStyle: () => import("react-native").TextStyle;
        press: () => void;
        hasOnPress: () => boolean;
        onPressIn: () => void;
        hasOnPressIn: () => boolean;
        onPressOut: () => void;
        hasOnPressOut: () => boolean;
        onLongPress: () => void;
        hasOnLongPress: () => boolean;
        getElement: () => import("react-test-renderer").ReactTestInstance;
    };
    getCharCounter: () => {
        getText: () => string | (string | import("react-test-renderer").ReactTestInstance)[];
        getStyle: () => import("react-native").TextStyle;
        press: () => void;
        hasOnPress: () => boolean;
        onPressIn: () => void;
        hasOnPressIn: () => boolean;
        onPressOut: () => void;
        hasOnPressOut: () => boolean;
        onLongPress: () => void;
        hasOnLongPress: () => boolean;
        getElement: () => import("react-test-renderer").ReactTestInstance;
        exists: () => boolean;
    };
    getHelperText: () => {
        getText: () => string | (string | import("react-test-renderer").ReactTestInstance)[];
        getStyle: () => import("react-native").TextStyle;
        press: () => void;
        hasOnPress: () => boolean;
        onPressIn: () => void;
        hasOnPressIn: () => boolean;
        onPressOut: () => void;
        hasOnPressOut: () => boolean;
        onLongPress: () => void;
        hasOnLongPress: () => boolean;
        getElement: () => import("react-test-renderer").ReactTestInstance;
        exists: () => boolean;
    };
    getValidationIcon: () => import("../../testkit/new/Component.driver").ComponentDriverResult;
    getClearButton: () => {
        visible: () => boolean;
        press: () => void;
        hasOnPress: () => boolean;
        onPressIn: () => void;
        hasOnPressIn: () => boolean;
        onPressOut: () => void;
        hasOnPressOut: () => boolean;
        onLongPress: () => void;
        hasOnLongPress: () => boolean;
        getElement: () => import("react-test-renderer").ReactTestInstance;
        exists: () => boolean;
        getLabel: () => {
            getText: () => string | (string | import("react-test-renderer").ReactTestInstance)[];
            getStyle: () => import("react-native").TextStyle;
            press: () => void;
            hasOnPress: () => boolean;
            onPressIn: () => void;
            hasOnPressIn: () => boolean;
            onPressOut: () => void;
            hasOnPressOut: () => boolean;
            onLongPress: () => void;
            hasOnLongPress: () => boolean;
            getElement: () => import("react-test-renderer").ReactTestInstance;
            exists: () => boolean;
        };
        getIcon: () => import("../../testkit/new/Component.driver").ComponentDriverResult;
    };
    press: () => void;
    hasOnPress: () => boolean;
    onPressIn: () => void;
    hasOnPressIn: () => boolean;
    onPressOut: () => void;
    hasOnPressOut: () => boolean;
    onLongPress: () => void;
    hasOnLongPress: () => boolean;
    getElement: () => import("react-test-renderer").ReactTestInstance;
    exists: () => boolean;
};