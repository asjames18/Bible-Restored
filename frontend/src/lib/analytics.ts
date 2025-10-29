// Lightweight analytics helpers. Safe no-ops in case analytics isn't configured.

export function initAnalytics(): void {
  // Initialize your analytics provider here if available.
  // Left as a no-op to keep builds working without provider config.
}

export function trackPageview(path: string): void {
  try {
    const gtag = (window as any)?.gtag;
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', { page_path: path });
    }
  } catch {
    // Swallow errors to avoid breaking navigation in unsupported environments
  }
}

export function reportWebVitals(): void {
  // Optionally import and send web vitals to your analytics endpoint.
  // Kept as a no-op to avoid extra bundle weight and external configuration.
}


