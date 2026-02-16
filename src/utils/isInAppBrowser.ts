export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || navigator.vendor;

  // Match known in-app browser identifiers
  const inAppBrowserKeywords = /(Instagram|LinkedIn|FBAN|FBAV|Twitter|X-Client|WebView)/i;

  // iOS WebView detection (Safari is excluded from this)
  const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);

  return inAppBrowserKeywords.test(ua) || isIOSWebView;
}