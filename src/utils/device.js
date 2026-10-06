/**
 * Utility to reliably detect mobile devices vs desktop browsers
 */

export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  
  const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
  
  // Explicit mobile user-agent check
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
  
  // iPad on iOS 13+ reports MacIntel but has touch points
  const isIPad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  
  // Touch screen + small screen dimension check
  const isSmallTouchScreen = (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) && Math.min(window.innerWidth, window.innerHeight) < 1024;

  return isMobileUA || isIPad || isSmallTouchScreen;
}

export function getMobilePlatform() {
  if (typeof window === 'undefined') return 'desktop';
  const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
  if (/iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'ios';
  }
  if (/android/.test(ua)) {
    return 'android';
  }
  return 'other-mobile';
}
