import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "690bed2a3a801821e2824dd3", 
  requiresAuth: true // Ensure authentication is required for all operations
});
