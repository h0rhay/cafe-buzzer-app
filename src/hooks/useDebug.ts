import { useEffect, useState, useCallback } from 'react';

export function useDebug() {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const checkDebugMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const debugParam = urlParams.get('debug');
      const debugMode = debugParam === '1' || debugParam === 'true';
      setIsDebugMode(debugMode);
      
      if (debugMode) {
        console.log('🐛 Debug mode enabled');
        console.log('🐛 Current URL:', window.location.href);
        console.log('🐛 User agent:', navigator.userAgent);
      }
    };

    checkDebugMode();
    
    // Listen for URL changes
    window.addEventListener('popstate', checkDebugMode);
    return () => window.removeEventListener('popstate', checkDebugMode);
  }, []);

  const debugLog = useCallback((message: string, data?: any) => {
    if (isDebugMode) {
      console.log(`🐛 ${message}`, data || '');
    }
  }, [isDebugMode]);

  const debugError = useCallback((message: string, error?: any) => {
    if (isDebugMode) {
      console.error(`🐛 ERROR: ${message}`, error || '');
    }
  }, [isDebugMode]);

  const debugApi = useCallback((method: string, url: string, data?: any, response?: any) => {
    if (isDebugMode) {
      console.group(`🐛 API ${method.toUpperCase()} ${url}`);
      if (data) console.log('Request data:', data);
      if (response) console.log('Response:', response);
      console.groupEnd();
    }
  }, [isDebugMode]);

  return {
    isDebugMode,
    debugLog,
    debugError,
    debugApi
  };
}