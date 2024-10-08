import { ComponentProps } from '../../testkit/new/Component.driver';
export declare const PickerDriver: (props: ComponentProps) => {
    getValue: () => string | undefined;
    open: () => void;
    cancel: () => void;
    done: () => void;
    isOpen: () => boolean;
    dismissDialog: () => void;
    selectItem: (testID: string) => void;
};
