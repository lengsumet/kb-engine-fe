import { lazy } from 'react';

// Enhanced lazy loading with retry mechanism
const lazyWithRetry = (componentImport, retries = 3) => {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const attemptImport = (attempt = 1) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (attempt < retries) {
              console.warn(`Failed to load component, retrying... (${attempt}/${retries})`);
              setTimeout(() => attemptImport(attempt + 1), 1000 * attempt);
            } else {
              console.error('Failed to load component after retries:', error);
              reject(error);
            }
          });
      };
      attemptImport();
    });
  });
};

// Lazy load heavy components to improve initial load time
export const LazyFileComparison = lazyWithRetry(() => import('../components/FileComparison'));
export const LazyTimelineComparison = lazyWithRetry(() => import('../components/TimelineComparison'));
export const LazyAIAnswerBox = lazyWithRetry(() => import('../components/AIAnswerBox'));
export const LazyRelatedQuestions = lazyWithRetry(() => import('../components/RelatedQuestions'));
export const LazyFileSelector = lazyWithRetry(() => import('../components/FileSelector'));
export const LazyInteractiveChat = lazyWithRetry(() => import('../components/InteractiveChat'));
export const LazyPopularContent = lazyWithRetry(() => import('../components/PopularContent'));

// Lazy load pages
export const LazyComparisonPage = lazyWithRetry(() => import('../pages/ComparisonPage'));
export const LazyDocumentViewer = lazyWithRetry(() => import('../pages/DocumentViewer'));
export const LazyCategoryBrowser = lazyWithRetry(() => import('../pages/CategoryBrowser'));
export const LazyRecentUpdates = lazyWithRetry(() => import('../pages/RecentUpdates'));

// Cache for preloaded components
const preloadCache = new Set();

// Preload components when user hovers over navigation
export const preloadComponent = (componentLoader, componentName) => {
  if (preloadCache.has(componentName)) {
    return Promise.resolve();
  }
  
  preloadCache.add(componentName);
  return componentLoader().catch((error) => {
    preloadCache.delete(componentName);
    console.warn(`Failed to preload ${componentName}:`, error);
  });
};

// Preload critical components after initial render
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  setTimeout(() => {
    preloadComponent(() => import('../components/FileComparison'), 'FileComparison');
    preloadComponent(() => import('../components/AIAnswerBox'), 'AIAnswerBox');
  }, 2000);
  
  setTimeout(() => {
    preloadComponent(() => import('../pages/DocumentViewer'), 'DocumentViewer');
    preloadComponent(() => import('../components/TimelineComparison'), 'TimelineComparison');
  }, 4000);
  
  // Preload on user interaction
  setTimeout(() => {
    preloadComponent(() => import('../components/RelatedQuestions'), 'RelatedQuestions');
    preloadComponent(() => import('../pages/ComparisonPage'), 'ComparisonPage');
  }, 6000);
};

// Preload on hover for better UX
export const preloadOnHover = (componentName) => {
  const componentMap = {
    'FileComparison': () => import('../components/FileComparison'),
    'DocumentViewer': () => import('../pages/DocumentViewer'),
    'ComparisonPage': () => import('../pages/ComparisonPage'),
    'CategoryBrowser': () => import('../pages/CategoryBrowser'),
    'RecentUpdates': () => import('../pages/RecentUpdates'),
    'InteractiveChat': () => import('../components/InteractiveChat'),
    'PopularContent': () => import('../components/PopularContent'),
    'AIAnswerBox': () => import('../components/AIAnswerBox'),
    'RelatedQuestions': () => import('../components/RelatedQuestions')
  };
  
  const loader = componentMap[componentName];
  if (loader) {
    preloadComponent(loader, componentName);
  }
};