
/**
 * Helper functions for proxy-related operations in the application
 */

// Function to check if the browser is in a development environment
export const isDevelopmentEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
};

// Check if the current environment likely supports CORS for direct API access
export const canUseDirectApi = (): boolean => {
  // When running in development or localhost, we might be able to use direct API
  // In production environments (deployed sites), CORS is more likely to be an issue
  return isDevelopmentEnvironment();
};

// Function to log proxy status for debugging
export const logProxyStatus = (): void => {
  console.log(`API mode: ${canUseDirectApi() ? 'Direct API (development)' : 'Using CORS proxy'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'unknown'}`);
  console.log(`Hostname: ${window.location.hostname}`);
};

// Get an appropriate API base URL based on the environment
export const getApiBaseUrl = (): string => {
  // In a real implementation, you would use your actual proxy URL here
  const directApiUrl = 'https://messaging.botpress.cloud/v1';
  const proxyApiUrl = 'https://cors-anywhere.herokuapp.com/https://messaging.botpress.cloud/v1';
  
  return canUseDirectApi() ? directApiUrl : proxyApiUrl;
};
