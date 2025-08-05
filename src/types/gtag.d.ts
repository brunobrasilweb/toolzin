// Type definitions for Google Tag Manager and Google Analytics
interface Window {
  dataLayer: any[];
  gtag: (
    command: 'config' | 'event' | 'js' | 'set' | 'consent',
    targetId: string,
    config?: {
      [key: string]: any;
    }
  ) => void;
}
