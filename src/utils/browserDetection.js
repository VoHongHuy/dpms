const isIE = () => window.navigator.userAgent.match(/(MSIE|Trident)/);

export default { isIE };

export const getViewHeight = () =>
  Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
