const configuredEmail = import.meta.env.VITE_PRIVACY_CONTACT_EMAIL?.trim() ?? "";
const publicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const privacyContactEmail = publicEmailPattern.test(configuredEmail)
  ? configuredEmail
  : null;

export const isPrivacyContactConfigured = privacyContactEmail !== null;
