/* ============================================
   Validators — Dulecy Lead Services
   --------------------------------------------
   Field-level validation for the single enquiry form
   (`UnifiedLeadForm`), which is the only consumer. Each helper returns
   an error STRING (empty string = valid) so the form can render it
   directly under the field.
   ============================================ */

/**
 * Email Validation Regex
 * Standard email validation pattern
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Get validation error message for a REQUIRED mobile number.
 * Module-local — the form only ever asks for the optional variant below.
 * @param {string} mobile - Mobile number
 * @returns {string} - Error message or empty string
 */
const getMobileErrorMessage = (mobile) => {
  if (!mobile) return 'Mobile number is required';

  const cleanedMobile = mobile.replace(/[\s-]/g, '');

  if (cleanedMobile.length < 10) {
    return 'Mobile number must be 10 digits';
  }

  if (cleanedMobile.length > 10) {
    return 'Mobile number cannot exceed 10 digits';
  }

  if (!/^[6-9]/.test(cleanedMobile)) {
    return 'Mobile number must start with 6, 7, 8, or 9';
  }

  if (!/^\d+$/.test(cleanedMobile)) {
    return 'Mobile number can only contain digits';
  }

  return '';
};

/**
 * Get validation error message for an OPTIONAL mobile number.
 * The Dulecy enquiry form makes PHONE optional (email is the required
 * contact channel), so an empty value is valid — but anything typed must
 * still be a real Indian mobile number.
 * @param {string} mobile - Mobile number (may be empty)
 * @returns {string} - Error message or empty string
 */
export const getOptionalMobileErrorMessage = (mobile) => {
  if (!mobile || !mobile.trim()) return '';
  return getMobileErrorMessage(mobile);
};

/**
 * Get validation error message for email
 * @param {string} email - Email address
 * @returns {string} - Error message or empty string
 */
export const getEmailErrorMessage = (email) => {
  if (!email) return 'Email is required';

  const trimmedEmail = email.trim();

  if (!trimmedEmail.includes('@')) {
    return 'Please enter a valid email address';
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return 'Please enter a valid email address';
  }

  return '';
};

/**
 * Get validation error message for name
 * @param {string} name - Name
 * @returns {string} - Error message or empty string
 */
export const getNameErrorMessage = (name) => {
  if (!name) return 'Name is required';

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (trimmedName.length > 50) {
    return 'Name cannot exceed 50 characters';
  }

  if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    return 'Name can only contain letters and spaces';
  }

  return '';
};
