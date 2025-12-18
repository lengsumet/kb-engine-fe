import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true') {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.value}`);
          
          // Send to analytics service if needed
          if (window.gtag) {
            window.gtag('event', entry.name, {
              event_category: 'Web Vitals',
              value: Math.round(entry.name === 'CLS' ? entry.value * 1000 : entry.value),
              non_interaction: true,
            });
          }
        }
      });

      // Observe Core Web Vitals
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

      // Monitor navigation timing
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        console.log('Navigation Timing:', {
          'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
          'TCP Connection': navigation.connectEnd - navigation.connectStart,
          'Request': navigation.responseStart - navigation.requestStart,
          'Response': navigation.responseEnd - navigation.responseStart,
          'DOM Processing': navigation.domContentLoadedEventEnd - navigation.responseEnd,
          'Total Load Time': navigation.loadEventEnd - navigation.navigationStart
        });
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;