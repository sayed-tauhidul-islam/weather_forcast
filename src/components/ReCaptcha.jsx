import React, { useEffect } from 'react';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Google reCAPTCHA v3 Component
 * Invisible reCAPTCHA that runs in the background
 */
const ReCaptcha = ({ action, onVerify }) => {
  useEffect(() => {
    // Skip if no site key configured
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('⚠️ reCAPTCHA site key not configured');
      return;
    }

    // Load reCAPTCHA script
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    // Execute reCAPTCHA
    const executeRecaptcha = async () => {
      try {
        await loadRecaptcha();
        
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(RECAPTCHA_SITE_KEY, { action })
            .then((token) => {
              if (onVerify) {
                onVerify(token);
              }
            })
            .catch((error) => {
              console.error('reCAPTCHA execution error:', error);
            });
        });
      } catch (error) {
        console.error('Failed to load reCAPTCHA:', error);
      }
    };

    executeRecaptcha();
  }, [action, onVerify]);

  return null; // Invisible component
};

/**
 * Hook for using reCAPTCHA in functional components
 */
export const useRecaptcha = (action) => {
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const executeRecaptcha = React.useCallback(async () => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('⚠️ reCAPTCHA not configured');
      return null;
    }

    setLoading(true);

    try {
      // Wait for grecaptcha to be ready
      await new Promise((resolve) => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(resolve);
        } else {
          // Load script if not loaded
          const script = document.createElement('script');
          script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
          script.async = true;
          script.onload = () => window.grecaptcha.ready(resolve);
          document.head.appendChild(script);
        }
      });

      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      setToken(recaptchaToken);
      return recaptchaToken;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [action]);

  return { token, loading, executeRecaptcha };
};

/**
 * HOC for adding reCAPTCHA to form submissions
 */
export const withRecaptcha = (Component, action) => {
  return (props) => {
    const { executeRecaptcha } = useRecaptcha(action);

    const handleSubmitWithCaptcha = async (originalSubmit, ...args) => {
      const token = await executeRecaptcha();
      return originalSubmit(token, ...args);
    };

    return <Component {...props} executeRecaptcha={executeRecaptcha} withCaptcha={handleSubmitWithCaptcha} />;
  };
};

export default ReCaptcha;
