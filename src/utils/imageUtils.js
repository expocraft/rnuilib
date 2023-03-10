import get from 'lodash/get';
import Assets from "../assets";
export function isSvgUri(source) {
  // @ts-expect-error
  return typeof source === 'object' && source?.uri?.endsWith?.('.svg');
}
export function isSvg(source) {
  return typeof source === 'string' || typeof source === 'function' || isSvgUri(source);
}
export function getAsset(assetName = '', assetGroup = '') {
  return get(Assets, `${assetGroup}.${assetName}`);
}