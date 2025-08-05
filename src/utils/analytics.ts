// Utility functions for Google Analytics

/**
 * Tracks an event in Google Analytics
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track page views
 */
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Track tool usage
 */
export const trackToolUsage = (toolName: string, action: string) => {
  trackEvent(action, 'Tool Usage', toolName);
};

/**
 * Track copy to clipboard
 */
export const trackCopy = (contentType: string) => {
  trackEvent('copy', 'User Action', `Copied ${contentType}`);
};

/**
 * Track generation
 */
export const trackGeneration = (itemType: string) => {
  trackEvent('generate', 'Tool Action', `Generated ${itemType}`);
};
