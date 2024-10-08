export declare enum orientations {
    PORTRAIT = "portrait",
    LANDSCAPE = "landscape"
}
export interface Breakpoint {
    breakpoint: number;
    pageMargin: number;
}
declare let defaultMargin: number;
export declare function updateConstants(dimensions: any): void;
declare const constants: {
    orientations: typeof orientations;
    isAndroid: boolean;
    isIOS: boolean;
    isWeb: boolean;
    getAndroidVersion: () => number | undefined;
    readonly statusBarHeight: number;
    isRTL: boolean;
    readonly orientation: orientations;
    readonly isLandscape: boolean;
    readonly screenWidth: number;
    readonly screenHeight: number;
    readonly windowWidth: number;
    readonly windowHeight: number;
    readonly isSmallWindow: boolean;
    readonly isSmallScreen: boolean;
    readonly isShortScreen: boolean;
    readonly isWideScreen: boolean;
    readonly screenAspectRatio: number;
    isTablet: boolean;
    setBreakpoints(value: Breakpoint[], options?: {
        defaultMargin: number;
    }): void;
    getPageMargins(): number;
    getSafeAreaInsets: () => {
        left: number;
        right: number;
        bottom: number;
        top: number;
    };
    readonly isIphoneX: boolean;
    dimensionsEventListener: undefined;
    addDimensionsEventListener: (callback: any) => import("react-native").EmitterSubscription;
    removeDimensionsEventListener: (callback: any) => void;
    readonly accessibility: {
        isScreenReaderEnabled: boolean;
    };
    backspaceKey: string;
    enterKey: string;
};
export default constants;
export declare const _reset: () => void;
