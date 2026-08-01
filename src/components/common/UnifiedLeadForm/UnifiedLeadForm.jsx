/* ============================================
   UnifiedLeadForm — the single enquiry form
   --------------------------------------------
   One shared component, used in exactly two places: the Contact page's
   grey panel and the global `LeadModal`. There is no forked copy.

   Markup/styling is a 1:1 port of `mockup/contact.html`'s `.lead-form`
   plus the inline `.form-success` state — success is shown in place,
   the page never navigates.

   Field → lead-record mapping (record keys are NEVER renamed):
     FULL NAME *   → name
     EMAIL *       → email          (required as of the Dulecy rebuild)
     PHONE         → mobile         (optional; Indian format when filled)
     ORGANIZATION  → organization   (new optional key, added in Prompt 07)
     SUPPORT WITH *→ service_interest (an expertise title, or "Something else")
     MESSAGE       → message
   `state` is no longer collected — the key is kept (sent empty) so the
   record shape stays stable for the admin panel and CSV export.
   ============================================ */

import React, { useCallback, useRef, useState } from 'react';
import { submitLeadToWebhook } from '../../../utils/webhookSubmit';
import { showError, showInfo } from '../../../utils/swalHelper';
import {
  getEmailErrorMessage,
  getNameErrorMessage,
  getOptionalMobileErrorMessage,
} from '../../../utils/validators';
import { expertiseAreas } from '../../../data/expertiseData';
import { siteConfig, mailHref } from '../../../data/siteConfig';
import styles from './UnifiedLeadForm.module.css';

// "What do you need support with?" — the ten expertise titles, straight from
// the data layer (never a hardcoded copy), plus the mockup's catch-all.
const SOMETHING_ELSE = 'Something else';
const INTEREST_OPTIONS = [
  ...expertiseAreas.map((area) => area.title),
  SOMETHING_ELSE,
];

const MESSAGE_MAX = 500;
const ORGANIZATION_MAX = 100;

const initialFormState = {
  name: '',
  email: '',
  mobile: '',
  organization: '',
  service_interest: '',
  message: '',
};

const initialErrorState = {
  name: '',
  email: '',
  mobile: '',
  organization: '',
  service_interest: '',
  message: '',
};

/**
 * Keep only digits, and forgive a pasted country/trunk prefix
 * ("+91 70990 02522" → "7099002522") before capping at 10.
 */
const normalizeMobile = (value) => {
  let digits = value.replace(/\D/g, '');
  if (digits.length >= 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length >= 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
};

const UnifiedLeadForm = ({
  source = 'general',
  prefill = {}, // e.g. { service_interest: 'HR & People Management' }
  onSubmitSuccess,
  className = '',
  formId = 'lead-form',
}) => {
  // Only accept a prefill that matches a real option.
  const prefilledInterest = INTEREST_OPTIONS.includes(prefill?.service_interest)
    ? prefill.service_interest
    : '';

  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    service_interest: prefilledInterest,
  }));
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Holds the enquirer's first name once the lead is stored — its presence
  // is what swaps the form for the inline success block.
  const [successName, setSuccessName] = useState('');

  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    mobile: useRef(null),
    service_interest: useRef(null),
    message: useRef(null),
  };

  // ---- Validation ------------------------------------------------------
  const validateField = useCallback((field, data) => {
    switch (field) {
      case 'name':
        return getNameErrorMessage(data.name);
      case 'email':
        return getEmailErrorMessage(data.email);
      case 'mobile':
        return getOptionalMobileErrorMessage(data.mobile);
      case 'service_interest':
        return data.service_interest
          ? ''
          : 'Please tell us what you need support with';
      case 'message':
        return data.message.length > MESSAGE_MAX
          ? `Message must be ${MESSAGE_MAX} characters or less`
          : '';
      default:
        return '';
    }
  }, []);

  const handleChange = useCallback(
    (field) => (event) => {
      const raw = event.target.value;
      const value = field === 'mobile' ? normalizeMobile(raw) : raw;

      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear the error as soon as the user starts fixing the field.
      setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
    },
    []
  );

  const handleBlur = useCallback(
    (field) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, formData) }));
    },
    [formData, validateField]
  );

  // ---- Submit ----------------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return; // guard against double-click

    const nextErrors = {
      ...initialErrorState,
      name: validateField('name', formData),
      email: validateField('email', formData),
      mobile: validateField('mobile', formData),
      service_interest: validateField('service_interest', formData),
      message: validateField('message', formData),
    };
    setErrors(nextErrors);
    setTouched({
      name: true,
      email: true,
      mobile: true,
      service_interest: true,
      message: true,
    });

    // Focus the first invalid field, in visual order.
    const firstInvalid = ['name', 'email', 'mobile', 'service_interest', 'message'].find(
      (field) => nextErrors[field]
    );
    if (firstInvalid) {
      fieldRefs[firstInvalid]?.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // `service_interest` keeps its legacy key — the value is the visible
      // label. `state` is sent empty: no longer collected, never reused.
      const leadData = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        organization: formData.organization.trim(),
        service_interest: formData.service_interest,
        state: '',
        message: formData.message.trim(),
        source,
      };

      const result = await submitLeadToWebhook(leadData);

      // The server dedupes by mobile across every device — surface it as a
      // calm "already have it" notice, not an error, and keep the form as-is.
      if (result.duplicate) {
        await showInfo(
          'Already received!',
          `We have your earlier enquiry — our team will get back to you shortly. Need it faster? Call ${siteConfig.phoneDisplay}.`
        );
        return;
      }

      if (result.success) {
        setSuccessName(leadData.name.split(' ')[0]);
        if (onSubmitSuccess) onSubmitSuccess(leadData);
        return;
      }

      await showError('Something went wrong', result.message);
    } catch (error) {
      console.error('Form submission error:', error);
      await showError(
        'Something went wrong',
        `Please try again or call us directly at ${siteConfig.phoneDisplay}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Render ----------------------------------------------------------
  const errorId = (field) => `${formId}-${field}-error`;

  const showFieldError = (field) => touched[field] && errors[field];

  const fieldError = (field) =>
    showFieldError(field) ? (
      <span className={styles.error} id={errorId(field)} role="alert">
        {errors[field]}
      </span>
    ) : null;

  const controlClass = (base, field) =>
    `${base} ${showFieldError(field) ? styles.invalid : ''}`.trim();

  const describedBy = (field) =>
    showFieldError(field) ? errorId(field) : undefined;

  if (successName) {
    return (
      <div className={className}>
        {/* This block replaces the form outright, so without a live region a
            screen-reader user gets no confirmation that the submit worked.
            `status` announces politely, after the current utterance (Prompt 12). */}
        <div className={styles.success} role="status">
          <i aria-hidden="true">&#10003;</i>
          <h3 className={styles.successHead}>Thank you, {successName}.</h3>
          <p className={styles.successBody}>
            Your enquiry has been noted. Our team will get back to you within
            one business day.
          </p>
          <a href={mailHref} className={styles.successMail}>
            {siteConfig.email}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      id={formId}
      className={`${styles.form} ${className}`.trim()}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.row2}>
        <label className={styles.label}>
          FULL NAME *
          <input
            ref={fieldRefs.name}
            name="name"
            className={controlClass(styles.input, 'name')}
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            disabled={isSubmitting}
            maxLength={50}
            autoComplete="name"
            aria-invalid={showFieldError('name') ? true : undefined}
            aria-describedby={describedBy('name')}
          />
          {fieldError('name')}
        </label>

        <label className={styles.label}>
          EMAIL *
          <input
            ref={fieldRefs.email}
            name="email"
            type="email"
            className={controlClass(styles.input, 'email')}
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            disabled={isSubmitting}
            autoComplete="email"
            aria-invalid={showFieldError('email') ? true : undefined}
            aria-describedby={describedBy('email')}
          />
          {fieldError('email')}
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.label}>
          PHONE
          <input
            ref={fieldRefs.mobile}
            name="phone"
            type="tel"
            inputMode="numeric"
            className={controlClass(styles.input, 'mobile')}
            placeholder="+91 ..."
            value={formData.mobile}
            onChange={handleChange('mobile')}
            onBlur={handleBlur('mobile')}
            disabled={isSubmitting}
            autoComplete="tel-national"
            aria-invalid={showFieldError('mobile') ? true : undefined}
            aria-describedby={describedBy('mobile')}
          />
          {fieldError('mobile')}
        </label>

        <label className={styles.label}>
          ORGANIZATION
          <input
            name="org"
            className={styles.input}
            placeholder="Company / institution"
            value={formData.organization}
            onChange={handleChange('organization')}
            disabled={isSubmitting}
            maxLength={ORGANIZATION_MAX}
            autoComplete="organization"
          />
        </label>
      </div>

      <label className={styles.label}>
        WHAT DO YOU NEED SUPPORT WITH? *
        <select
          ref={fieldRefs.service_interest}
          name="service"
          className={controlClass(styles.select, 'service_interest')}
          value={formData.service_interest}
          onChange={handleChange('service_interest')}
          onBlur={handleBlur('service_interest')}
          disabled={isSubmitting}
          aria-invalid={showFieldError('service_interest') ? true : undefined}
          aria-describedby={describedBy('service_interest')}
        >
          <option value="">Select an area</option>
          {INTEREST_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fieldError('service_interest')}
      </label>

      <label className={styles.label}>
        MESSAGE
        <textarea
          ref={fieldRefs.message}
          name="message"
          rows={4}
          className={controlClass(styles.textarea, 'message')}
          placeholder="Tell us briefly about your requirement..."
          value={formData.message}
          onChange={handleChange('message')}
          onBlur={handleBlur('message')}
          disabled={isSubmitting}
          maxLength={MESSAGE_MAX}
          aria-invalid={showFieldError('message') ? true : undefined}
          aria-describedby={describedBy('message')}
        />
        {fieldError('message')}
      </label>

      <button
        type="submit"
        className={`btn btn--primary ${styles.submit}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          'Sending…'
        ) : (
          <>
            Send Enquiry <span aria-hidden="true">&rarr;</span>
          </>
        )}
      </button>

      <p className={styles.alt}>
        Prefer email? Write to us at{' '}
        <a href={mailHref}>{siteConfig.email}</a>
      </p>
    </form>
  );
};

export default UnifiedLeadForm;
