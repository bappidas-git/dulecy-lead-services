/* ============================================
   UnifiedLeadForm Component
   Single reusable enquiry form used by the enquiry drawer
   (and, from prompt 11, the Contact section). Features:
   - Grouped "Interested In" select (Products / Services / General)
   - Optional prefill (drawer tiles/rows pass the category)
   - Server-side duplicate prevention (by mobile, cross-device)
   - Consent text + privacy-policy modal
   - Redirect to the Thank-You page on success
   Nilachal Infracon Private Limited — enquiry pipeline.
   ============================================ */

import React, { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { submitLeadToWebhook } from "../../../utils/webhookSubmit";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  ListSubheader,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { showSuccess, showError, showInfo } from "../../../utils/swalHelper";
import Button from "../Button/Button";
import {
  getMobileErrorMessage,
  getEmailErrorMessage,
  getNameErrorMessage,
} from "../../../utils/validators";
import { productsData } from "../../../data/productsData";
import { servicesData } from "../../../data/servicesData";
import { locationData } from "../../../data/locationData";
import { siteConfig, telHref, fullAddress } from "../../../data/siteConfig";
import styles from "./UnifiedLeadForm.module.css";

// "Interested In" grouped options, sourced from the content data layer (no
// hardcoded lists). Stored under the legacy `service_interest` key to preserve
// the admin panel + webhook plumbing — the value is the product/service label.
// The option values match the names the drawer tiles/rows send as prefill
// (product.name / service.name), so a pre-selected value resolves cleanly.
const INTEREST_GROUPS = [
  { label: "Products", options: productsData.map((p) => p.name) },
  { label: "Services", options: servicesData.map((s) => s.name) },
];
const GENERAL_ENQUIRY = "General Enquiry";

// All valid interest values, used to validate an incoming prefill value.
const INTEREST_VALUES = [
  ...INTEREST_GROUPS.flatMap((group) => group.options),
  GENERAL_ENQUIRY,
];

// State options: the 8 Northeast states we serve (from locationData) + "Other".
const STATE_OPTIONS = [...locationData.servingStates, "Other"];

// Initial form state
const initialFormState = {
  name: "",
  mobile: "",
  email: "",
  service_interest: "",
  state: "",
  message: "",
};

// Initial error state
const initialErrorState = {
  name: "",
  mobile: "",
  email: "",
  service_interest: "",
  state: "",
  message: "",
};

// Privacy Policy Content — Nilachal Infracon enquiry data policy.
// Kept aligned with the Footer's policy copy (prompt 05).
const PrivacyPolicyContent = () => (
  <div style={{ padding: "0 8px" }}>
    <section style={{ marginBottom: "24px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#16324F",
        }}
      >
        Introduction
      </h3>
      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#374151" }}>
        {siteConfig.legalName} (“we”, “us”) respects your privacy. This policy
        explains what information we collect when you send an enquiry through
        this website, how we use it, and how you can ask us to remove it.
      </p>
    </section>

    <section style={{ marginBottom: "24px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#16324F",
        }}
      >
        Information We Collect
      </h3>
      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.6,
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        When you submit an enquiry or request a callback, we collect only the
        details you choose to share with us:
      </p>
      <ul
        style={{
          fontSize: "14px",
          lineHeight: 1.6,
          color: "#374151",
          paddingLeft: "20px",
          margin: 0,
        }}
      >
        <li style={{ marginBottom: "6px" }}>
          <strong>Your name</strong> — so we know who to address.
        </li>
        <li style={{ marginBottom: "6px" }}>
          <strong>Your phone number</strong> — so our team can call or message
          you back.
        </li>
        <li style={{ marginBottom: "6px" }}>
          <strong>Your email address</strong> — an optional way for us to reach
          you.
        </li>
        <li>
          <strong>Your enquiry details</strong> — the products, services or
          project you would like to discuss.
        </li>
      </ul>
    </section>

    <section style={{ marginBottom: "24px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#16324F",
        }}
      >
        How We Use Your Information
      </h3>
      <ul
        style={{
          fontSize: "14px",
          lineHeight: 1.6,
          color: "#374151",
          paddingLeft: "20px",
          margin: 0,
        }}
      >
        <li style={{ marginBottom: "6px" }}>
          To respond to your enquiry and help you with the products and services
          offered by {siteConfig.flagshipBrand} and {siteConfig.brandName}.
        </li>
        <li>
          To share availability, brands, pricing and project guidance you have
          asked about.
        </li>
      </ul>
      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.6,
          color: "#374151",
          marginTop: "8px",
        }}
      >
        Your details are used <strong>only to respond to your enquiry</strong>.
        We do not use them for anything else.
      </p>
    </section>

    <section style={{ marginBottom: "24px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#16324F",
        }}
      >
        Storage &amp; Sharing
      </h3>
      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#374151" }}>
        Enquiries are stored on this website’s own server so our team can follow
        up with you. We <strong>never sell or rent</strong> your information, and
        we do not share it with advertising platforms or data brokers.
      </p>
    </section>

    <section style={{ marginBottom: "24px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#16324F",
        }}
      >
        Removing Your Data
      </h3>
      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#374151" }}>
        You can ask us to delete the details you submitted at any time. Email us
        at{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          style={{ color: "#1E7B45", fontWeight: 600 }}
        >
          {siteConfig.email}
        </a>{" "}
        and we will remove your enquiry from our records.
      </p>
    </section>

    <section style={{ marginBottom: "24px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#16324F",
        }}
      >
        Contact
      </h3>
      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#374151" }}>
        <strong>{siteConfig.legalName}</strong>
        <br />
        {fullAddress}
        <br />
        Phone: {siteConfig.phoneDisplay}
        <br />
        Email: {siteConfig.email}
      </p>
    </section>
  </div>
);

// Privacy Policy Modal Component
const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (typeof window === "undefined") return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #E5E7EB",
                backgroundColor: "#F9FAFB",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  margin: 0,
                  color: "#16324F",
                }}
              >
                Privacy Policy
              </h2>
              <IconButton
                onClick={onClose}
                aria-label="Close modal"
                size="small"
                sx={{ color: "#6B7280" }}
              >
                <Icon icon="mdi:close" />
              </IconButton>
            </div>
            <div
              style={{
                padding: "20px",
                overflowY: "auto",
                maxHeight: "calc(80vh - 60px)",
              }}
            >
              <PrivacyPolicyContent />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Contextual header defaults (used only when showTitle/showSubtitle are on;
// the drawer and Contact section pass their own headers and hide these).
const getHeaderDefaults = (source) => {
  switch (source) {
    case "contact":
      return {
        title: "Request a Callback",
        subtitle: "Share your details and our team will call you back.",
      };
    default:
      return {
        title: "Send an Enquiry",
        subtitle: "Tell us what you need — we usually respond within 24 hours.",
      };
  }
};

const UnifiedLeadForm = ({
  variant = "default", // 'default', 'dark', 'drawer' (hero is a dormant path)
  source = "default",
  title: titleProp,
  subtitle: subtitleProp,
  submitButtonText = "Send Enquiry",
  showTitle = true,
  showSubtitle = true,
  showInterestFields = true, // renders the "Interested In" + "State" selects
  showTrustBadges = true, // repurposed: renders the quiet reassurance line
  showConsent = true,
  showPhoneButton = false,
  prefill = {}, // e.g. { service_interest: 'Steel Doors' } from drawer tiles/rows
  onClose, // Called when drawer should close (for drawer variant)
  onSubmitSuccess,
  className = "",
  formId = "unified-lead-form",
}) => {
  const headerDefaults = getHeaderDefaults(source);
  const title = titleProp || headerDefaults.title;
  const subtitle = subtitleProp || headerDefaults.subtitle;
  const navigate = useNavigate();

  // Resolve a valid prefilled interest (ignore anything not in the option list).
  const prefilledInterest =
    prefill && INTEREST_VALUES.includes(prefill.service_interest)
      ? prefill.service_interest
      : "";

  // Form state — seed the interest from any prefill the drawer passed in. The
  // form remounts each time the drawer opens, so this initializer re-runs with
  // the fresh prefill value.
  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    service_interest: prefilledInterest,
  }));
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const isDarkSurface = variant === "dark" || variant === "drawer";

  // Refs for input focus management
  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const serviceRef = useRef(null);
  const stateSelectRef = useRef(null);
  const messageRef = useRef(null);

  // Handle input change
  const handleChange = useCallback(
    (field) => (event) => {
      let value = event.target.value;

      // Special handling for mobile number - only allow digits
      if (field === "mobile") {
        value = value.replace(/\D/g, "").slice(0, 10);
      }

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [errors]
  );

  // Handle input blur - validate on blur
  const handleBlur = useCallback(
    (field) => () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));

      // Validate the field
      let errorMessage = "";

      switch (field) {
        case "name":
          errorMessage = getNameErrorMessage(formData.name);
          break;
        case "mobile":
          errorMessage = getMobileErrorMessage(formData.mobile);
          break;
        case "email":
          if (formData.email) {
            errorMessage = getEmailErrorMessage(formData.email);
          }
          break;
        case "service_interest":
          if (showInterestFields && !formData.service_interest) {
            errorMessage = "Please tell us what you're interested in";
          }
          break;
        case "state":
          if (showInterestFields && !formData.state) {
            errorMessage = "Please select your state";
          }
          break;
        case "message":
          if (formData.message && formData.message.length > 500) {
            errorMessage = "Message must be 500 characters or less";
          }
          break;
        default:
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [field]: errorMessage,
      }));
    },
    [formData, showInterestFields]
  );

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {
      name: getNameErrorMessage(formData.name),
      mobile: getMobileErrorMessage(formData.mobile),
      email: formData.email ? getEmailErrorMessage(formData.email) : "",
      service_interest:
        showInterestFields && !formData.service_interest
          ? "Please tell us what you're interested in"
          : "",
      state:
        showInterestFields && !formData.state
          ? "Please select your state"
          : "",
      message:
        formData.message && formData.message.length > 500
          ? "Message must be 500 characters or less"
          : "",
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      mobile: true,
      email: true,
      service_interest: true,
      state: true,
      message: true,
    });

    return Object.values(newErrors).every((error) => !error);
  }, [formData, showInterestFields]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return; // Guard against double-click

    // Validate form
    if (!validateForm()) {
      // Focus first field with error
      if (errors.name || !formData.name) {
        nameRef.current?.focus();
      } else if (errors.mobile || !formData.mobile) {
        mobileRef.current?.focus();
      } else if (errors.email || !formData.email) {
        emailRef.current?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare lead data. `service_interest` holds the selected product/service
      // (or "General Enquiry") — the legacy key is kept for admin compatibility.
      const leadData = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        service_interest: formData.service_interest || "",
        state: formData.state || "",
        message: formData.message || "",
        source: formId || "general",
      };

      // Submit to the shared server-side lead store (single source of truth).
      const result = await submitLeadToWebhook(leadData);

      // The server dedupes by mobile across all devices — surface a friendly
      // "already received" message instead of creating a second lead.
      if (result.duplicate) {
        await showInfo(
          "Already received!",
          `We have your earlier enquiry — our team will contact you shortly. Need it faster? Call ${siteConfig.phoneDisplay}.`
        );
        return;
      }

      if (result.success) {
        // Set lead submitted flag for thank you page access
        sessionStorage.setItem("lead_submitted", "true");
        sessionStorage.setItem("lead_name", formData.name);

        // Show success alert ON TOP of drawer
        await showSuccess(
          "Enquiry received!",
          `Thanks for reaching out to ${siteConfig.brandName}. Our team will contact you within 24 hours.`
        );

        // THEN reset form
        setFormData(initialFormState);
        setTouched({});
        setErrors(initialErrorState);

        // THEN close drawer (if in a drawer)
        if (onClose) {
          onClose();
        }

        // Callback for parent component
        if (onSubmitSuccess) {
          onSubmitSuccess(formData);
        }

        // THEN navigate to thank you page
        navigate("/thank-you");
      } else {
        await showError("Something went wrong", result.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      await showError(
        "Something went wrong",
        `Please try again or call us directly at ${siteConfig.phoneDisplay}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, duration: 0.3 },
    }),
  };

  // Determine styles based on variant
  const getVariantClass = () => {
    switch (variant) {
      case "dark":
        return styles.variantDark;
      case "hero":
        return styles.variantHero;
      case "drawer":
        return styles.variantDrawer;
      default:
        return styles.variantDefault;
    }
  };

  // Placeholder text for empty selects, dimmed appropriately for the surface.
  const selectPlaceholder = (label) => (
    <span
      style={{
        color: isDarkSurface ? "#FFFFFF80" : undefined,
        opacity: isDarkSurface ? 1 : 0.5,
      }}
    >
      {label}
    </span>
  );

  const selectMenuProps = {
    PaperProps: {
      sx: { zIndex: 99999, maxHeight: 360 },
    },
    disablePortal: false,
    style: { zIndex: 99999 },
  };

  const selectSx = isDarkSurface
    ? { color: "#FFFFFF", "& .MuiSelect-icon": { color: "#FFFFFF80" } }
    : undefined;

  // Framer stagger index base — selects add two extra rows.
  const submitIndex = showInterestFields ? 6 : 3;

  return (
    <div
      className={`${styles.formContainer} ${getVariantClass()} ${className}`}
    >
      {/* Form Header */}
      {(showTitle || showSubtitle) && (
        <div className={styles.formHeader}>
          {showTitle && (
            <Typography variant="h5" className={styles.formTitle}>
              {title}
            </Typography>
          )}
          {showSubtitle && subtitle && (
            <Typography
              variant="body2"
              className={styles.formSubtitle}
              sx={isDarkSurface ? { color: "#FFFFFFB3 !important" } : undefined}
            >
              {subtitle}
            </Typography>
          )}
        </div>
      )}

      {/* Form */}
      <form
        id={formId}
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
        autoComplete="off"
      >
        {/* Full Name */}
        <motion.div
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <TextField
            inputRef={nameRef}
            fullWidth
            placeholder="Full Name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange("name")}
            onBlur={handleBlur("name")}
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            disabled={isSubmitting}
            className={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon
                    icon="mdi:account-outline"
                    className={styles.inputIcon}
                    style={isDarkSurface ? { color: "#FFFFFF80" } : undefined}
                  />
                </InputAdornment>
              ),
            }}
            inputProps={{
              "aria-label": "Full name",
              maxLength: 50,
            }}
          />
        </motion.div>

        {/* Mobile Number */}
        <motion.div
          custom={1}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <TextField
            inputRef={mobileRef}
            fullWidth
            placeholder="Mobile Number"
            variant="outlined"
            value={formData.mobile}
            onChange={handleChange("mobile")}
            onBlur={handleBlur("mobile")}
            error={touched.mobile && !!errors.mobile}
            helperText={touched.mobile && errors.mobile}
            disabled={isSubmitting}
            className={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  className={styles.mobilePrefix}
                >
                  <Typography
                    variant="body2"
                    className={styles.countryCode}
                    sx={
                      isDarkSurface
                        ? { color: "#FFFFFFCC !important" }
                        : undefined
                    }
                  >
                    +91
                  </Typography>
                  <span
                    className={styles.prefixDivider}
                    style={isDarkSurface ? { color: "#FFFFFF4D" } : undefined}
                  >
                    -
                  </span>
                </InputAdornment>
              ),
            }}
            inputProps={{
              "aria-label": "Mobile number",
              maxLength: 10,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
        </motion.div>

        {/* Email (optional) */}
        <motion.div
          custom={2}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <TextField
            inputRef={emailRef}
            fullWidth
            placeholder="Email (optional)"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            disabled={isSubmitting}
            className={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon
                    icon="mdi:email-outline"
                    className={styles.inputIcon}
                    style={isDarkSurface ? { color: "#FFFFFF80" } : undefined}
                  />
                </InputAdornment>
              ),
            }}
            inputProps={{
              "aria-label": "Email address",
            }}
          />
        </motion.div>

        {/* Interested In (grouped select) */}
        {showInterestFields && (
          <motion.div
            custom={3}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <FormControl
              fullWidth
              error={touched.service_interest && !!errors.service_interest}
              className={styles.textField}
            >
              <Select
                ref={serviceRef}
                displayEmpty
                value={formData.service_interest}
                onChange={handleChange("service_interest")}
                onBlur={handleBlur("service_interest")}
                disabled={isSubmitting}
                startAdornment={
                  <InputAdornment position="start">
                    <Icon
                      icon="mdi:tag-outline"
                      className={styles.inputIcon}
                      style={isDarkSurface ? { color: "#FFFFFF80" } : undefined}
                    />
                  </InputAdornment>
                }
                renderValue={(selected) =>
                  selected ? selected : selectPlaceholder("Interested In")
                }
                MenuProps={selectMenuProps}
                inputProps={{ "aria-label": "Interested in" }}
                SelectDisplayProps={{
                  "aria-describedby":
                    touched.service_interest && errors.service_interest
                      ? `${formId}-service-interest-error`
                      : undefined,
                }}
                sx={selectSx}
              >
                {INTEREST_GROUPS.map((group) => [
                  <ListSubheader
                    key={group.label}
                    className={styles.selectGroupLabel}
                  >
                    {group.label}
                  </ListSubheader>,
                  ...group.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )),
                ])}
                <MenuItem value={GENERAL_ENQUIRY}>{GENERAL_ENQUIRY}</MenuItem>
              </Select>
              {touched.service_interest && errors.service_interest && (
                <FormHelperText id={`${formId}-service-interest-error`}>
                  {errors.service_interest}
                </FormHelperText>
              )}
            </FormControl>
          </motion.div>
        )}

        {/* State */}
        {showInterestFields && (
          <motion.div
            custom={4}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <FormControl
              fullWidth
              error={touched.state && !!errors.state}
              className={styles.textField}
            >
              <Select
                ref={stateSelectRef}
                displayEmpty
                value={formData.state}
                onChange={handleChange("state")}
                onBlur={handleBlur("state")}
                disabled={isSubmitting}
                startAdornment={
                  <InputAdornment position="start">
                    <Icon
                      icon="mdi:map-marker-outline"
                      className={styles.inputIcon}
                      style={isDarkSurface ? { color: "#FFFFFF80" } : undefined}
                    />
                  </InputAdornment>
                }
                renderValue={(selected) =>
                  selected ? selected : selectPlaceholder("State")
                }
                MenuProps={selectMenuProps}
                inputProps={{ "aria-label": "State" }}
                SelectDisplayProps={{
                  "aria-describedby":
                    touched.state && errors.state
                      ? `${formId}-state-error`
                      : undefined,
                }}
                sx={selectSx}
              >
                {STATE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {touched.state && errors.state && (
                <FormHelperText id={`${formId}-state-error`}>
                  {errors.state}
                </FormHelperText>
              )}
            </FormControl>
          </motion.div>
        )}

        {/* Message (optional) */}
        <motion.div
          custom={5}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <TextField
            inputRef={messageRef}
            fullWidth
            placeholder="Tell us about your requirement…"
            variant="outlined"
            value={formData.message}
            onChange={handleChange("message")}
            onBlur={handleBlur("message")}
            error={touched.message && !!errors.message}
            helperText={touched.message && errors.message}
            disabled={isSubmitting}
            multiline
            minRows={2}
            maxRows={4}
            className={`${styles.textField} ${styles.messageField}`}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  className={styles.messageAdornment}
                >
                  <Icon
                    icon="mdi:message-text-outline"
                    className={styles.inputIcon}
                    style={isDarkSurface ? { color: "#FFFFFF80" } : undefined}
                  />
                </InputAdornment>
              ),
            }}
            inputProps={{
              "aria-label": "Message",
              maxLength: 500,
            }}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          custom={submitIndex}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className={styles.submitWrapper}
        >
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? (
              <Box className={styles.loadingState}>
                <CircularProgress size={20} color="inherit" />
                <span>Sending…</span>
              </Box>
            ) : (
              <>
                <Icon icon="mdi:send-outline" className={styles.submitIcon} />
                <span>{submitButtonText}</span>
              </>
            )}
          </Button>
        </motion.div>

        {/* Quiet reassurance line (replaces the old trust-badge row) */}
        {showTrustBadges && (
          <motion.div
            custom={submitIndex + 1}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant="caption"
              className={styles.reassurance}
              sx={isDarkSurface ? { color: "#FFFFFF99 !important" } : undefined}
            >
              We respond within 24 hours. Your details stay private.
            </Typography>
          </motion.div>
        )}

        {/* Consent Text */}
        {showConsent && (
          <motion.div
            custom={submitIndex + 2}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant="caption"
              className={styles.consentText}
              sx={isDarkSurface ? { color: "#FFFFFF99 !important" } : undefined}
            >
              By submitting, I agree to be contacted by {siteConfig.brandName}{" "}
              regarding my enquiry. See our{" "}
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className={styles.privacyLink}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Privacy Policy
              </button>
              .
            </Typography>
          </motion.div>
        )}
      </form>

      {/* Phone Button */}
      {showPhoneButton && (
        <div className={styles.phoneSection}>
          <Typography
            className={styles.orText}
            sx={{ color: "#FFFFFF80 !important" }}
          >
            Or call us directly
          </Typography>
          <a href={telHref} className={styles.phoneLink}>
            <Icon icon="mdi:phone" />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
        </div>
      )}

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
};

export default UnifiedLeadForm;
