/**
 * Centralized auth hooks using @team-semicolon/community-core v2.2.0
 * Direct re-exports without duplication
 */

// Re-export all auth hooks directly from community-core
export {
  // Core hooks
  useAuth,
  useSupabaseAuth,
  usePermission,
  useLogin,
  useRegister,
  useProfile,
  // Validation utilities
  validateEmail,
  validatePassword,
  validateNickname,
  // Constants
  USER_ROLES,
  USER_LEVELS,
  PERMISSIONS,
  OAUTH_PROVIDERS,
  AUTH_ERRORS,
} from "@team-semicolon/community-core";

// Alias for backward compatibility if needed
export { useSupabaseAuth as useCommunityAuth } from "@team-semicolon/community-core";
