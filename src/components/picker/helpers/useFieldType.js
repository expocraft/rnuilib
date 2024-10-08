import _isEmpty from "lodash/isEmpty";
import React, { useMemo } from 'react';
import { Typography, Colors } from "../../../style";
import View from "../../view";
import Text from "../../text";
import Icon from "../../icon";
import { PickerFieldTypes } from "../types";
const dropdown = require("../assets/dropdown.png");
const useFieldType = props => {
  const {
    fieldType,
    preset,
    trailingAccessory,
    value,
    placeholder,
    style,
    label,
    labelStyle,
    testID
  } = props;
  const propsByFieldType = useMemo(() => {
    if (fieldType === PickerFieldTypes.filter) {
      return {
        preset: preset || null,
        containerStyle: {
          flexDirection: 'row'
        },
        label,
        labelStyle: {
          ...Typography.text70,
          color: Colors.$textNeutral
        },
        trailingAccessory: trailingAccessory ?? <Icon marginL-s1 source={dropdown} />
      };
    } else if (fieldType === PickerFieldTypes.settings) {
      return {
        preset: preset || null,
        label: undefined
      };
    }
  }, [fieldType, preset, trailingAccessory, label]);
  const pickerInnerInput = useMemo(() => {
    if (fieldType === PickerFieldTypes.filter) {
      return <Text text70 numberOfLines={1} style={style} testID={`${testID}.filter.type.label`}>
          {_isEmpty(value) ? placeholder : value}
        </Text>;
    } else if (fieldType === PickerFieldTypes.settings) {
      return <View flexG row spread>
          <Text text70 style={labelStyle} testID={`${testID}.settings.type.label`}>
            {label || placeholder}
          </Text>
          <Text text70 $textPrimary style={style} testID={`${testID}.settings.type.placeholder`}>
            {_isEmpty(value) ? placeholder : value}
          </Text>
        </View>;
    }
  }, [style, labelStyle, fieldType, placeholder, value, label, testID]);
  return {
    propsByFieldType,
    pickerInnerInput
  };
};
export default useFieldType;