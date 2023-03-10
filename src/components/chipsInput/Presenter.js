import { Colors } from "../../style";
export const hasInvalidChip = chips => {
  return chips.filter(chip => chip.invalid === true)[0] !== undefined;
};
export const getValidationBasedColor = (chips, defaultChip) => {
  const dismissColor = defaultChip?.dismissColor || Colors.red30;
  return hasInvalidChip(chips) ? dismissColor : Colors.$backgroundPrimaryHeavy;
};
export const getCounterTextColor = (stateChips, props) => {
  const {
    maxLength
  } = props;
  if (isDisabled(props)) {
    return Colors.grey50;
  }
  return maxLength && stateChips.length >= maxLength ? Colors.red30 : Colors.grey30;
};
export const getCounterText = (count, maxLength) => {
  return `${Math.min(count, maxLength)} / ${maxLength}`;
};
export const getChipDismissColor = (chip, isSelected, defaultChipProps) => {
  const dismissColor = defaultChipProps?.dismissColor || Colors.white;
  return !chip.invalid ? dismissColor : isSelected ? Colors.red10 : Colors.red30;
};
export const isDisabled = props => {
  const {
    disableTagRemoval,
    editable
  } = props;
  return disableTagRemoval || editable === false;
};