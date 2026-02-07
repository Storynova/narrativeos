/**
 * NarrativeOS™ Security Module
 * Implements security-first principles for all user inputs and outputs
 * 
 * Features:
 * - Input sanitization (XSS prevention)
 * - Output encoding
 * - Rate limiting
 * - Audit logging
 * - Prompt injection detection
 */

const NarrativeOSSecurity = (function() {
    'use strict';

    // Security configuration
    const CONFIG = {
        maxInputLength: 10000,
        maxFieldLength: 1000,
        rateLimitWindow: 60000, // 1 minute
        rateLimitMax: 30, // Max requests per window
        auditLogEnabled: true,
        promptInjectionPatterns: [
            /ignore\s+(all\s+)?(previous|prior|above)/i,
            /disregard\s+(all\s+)?(previous|prior|above)/i,
            /forget\s+(all\s+)?(previous|prior|above)/i,
            /system\s*prompt/i,
            /reveal\s+(your|the)\s+(instructions|prompt)/i,
            /what\s+are\s+your\s+(instructions|rules)/i,
            /act\s+as\s+(if\s+you\s+are|a)/i,
            /pretend\s+(you\s+are|to\s+be)/i,
            /\[\[.*\]\]/,
            /\{\{.*\}\}/,
            /<\|.*\|>/
        ]
    };

    // Rate limiting state
    const rateLimitState = {
        requests: [],
        blocked: false
    };

    // Audit log storage (in production, send to server)
    const auditLog = [];

    /**
     * Sanitize HTML to prevent XSS attacks
     * @param {string} input - Raw user input
     * @returns {string} - Sanitized string
     */
    function sanitizeHTML(input) {
        if (typeof input !== 'string') return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        
        return input.replace(/[&<>"'`=/]/g, char => map[char]);
    }

    /**
     * Sanitize user input for processing
     * @param {string} input - Raw user input
     * @param {object} options - Sanitization options
     * @returns {object} - { success: boolean, value: string, warnings: array }
     */
    function sanitizeInput(input, options = {}) {
        const warnings = [];
        let value = input;

        // Type check
        if (typeof value !== 'string') {
            return { success: false, value: '', warnings: ['Invalid input type'] };
        }

        // Trim whitespace
        value = value.trim();

        // Check length limits
        const maxLength = options.maxLength || CONFIG.maxFieldLength;
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
            warnings.push(`Input truncated to ${maxLength} characters`);
        }

        // Remove null bytes
        value = value.replace(/\0/g, '');

        // Check for prompt injection attempts
        if (detectPromptInjection(value)) {
            warnings.push('Potentially suspicious input pattern detected');
            logAuditEvent('PROMPT_INJECTION_ATTEMPT', { input: value.substring(0, 100) });
        }

        // Sanitize HTML entities
        const sanitized = sanitizeHTML(value);

        return {
            success: true,
            value: sanitized,
            warnings
        };
    }

    /**
     * Detect potential prompt injection attempts
     * @param {string} input - User input to check
     * @returns {boolean} - True if suspicious pattern detected
     */
    function detectPromptInjection(input) {
        if (!input || typeof input !== 'string') return false;
        
        return CONFIG.promptInjectionPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Check rate limiting
     * @returns {object} - { allowed: boolean, remaining: number, resetIn: number }
     */
    function checkRateLimit() {
        const now = Date.now();
        
        // Remove old requests outside the window
        rateLimitState.requests = rateLimitState.requests.filter(
            time => now - time < CONFIG.rateLimitWindow
        );

        // Check if limit exceeded
        if (rateLimitState.requests.length >= CONFIG.rateLimitMax) {
            const oldestRequest = Math.min(...rateLimitState.requests);
            const resetIn = CONFIG.rateLimitWindow - (now - oldestRequest);
            
            logAuditEvent('RATE_LIMIT_EXCEEDED', { 
                requestCount: rateLimitState.requests.length 
            });
            
            return { 
                allowed: false, 
                remaining: 0, 
                resetIn: Math.ceil(resetIn / 1000) 
            };
        }

        // Add this request
        rateLimitState.requests.push(now);

        return {
            allowed: true,
            remaining: CONFIG.rateLimitMax - rateLimitState.requests.length,
            resetIn: Math.ceil(CONFIG.rateLimitWindow / 1000)
        };
    }

    /**
     * Log security-relevant events
     * @param {string} eventType - Type of event
     * @param {object} data - Event data
     */
    function logAuditEvent(eventType, data = {}) {
        if (!CONFIG.auditLogEnabled) return;

        const event = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            type: eventType,
            data: { ...data },
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Remove sensitive data
        delete event.data.password;
        delete event.data.token;
        delete event.data.credential;

        auditLog.push(event);

        // Keep only last 1000 events
        if (auditLog.length > 1000) {
            auditLog.shift();
        }

        // In production, send to server
        // sendToAuditServer(event);

        console.debug('[NarrativeOS Audit]', eventType, data);
    }

    /**
     * Generate a secure random ID
     * @returns {string} - Random ID
     */
    function generateId() {
        if (window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        }
        
        // Fallback for older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Validate form data
     * @param {object} formData - Object with form field values
     * @param {object} schema - Validation schema
     * @returns {object} - { valid: boolean, errors: object, sanitized: object }
     */
    function validateFormData(formData, schema) {
        const errors = {};
        const sanitized = {};

        for (const [field, rules] of Object.entries(schema)) {
            const value = formData[field];

            // Required check
            if (rules.required && (!value || value.trim() === '')) {
                errors[field] = `${rules.label || field} is required`;
                continue;
            }

            // Skip further validation if empty and not required
            if (!value || value.trim() === '') {
                sanitized[field] = '';
                continue;
            }

            // Sanitize input
            const result = sanitizeInput(value, { 
                maxLength: rules.maxLength 
            });

            if (!result.success) {
                errors[field] = 'Invalid input';
                continue;
            }

            // Min length check
            if (rules.minLength && result.value.length < rules.minLength) {
                errors[field] = `Minimum ${rules.minLength} characters required`;
                continue;
            }

            // Pattern check
            if (rules.pattern && !rules.pattern.test(result.value)) {
                errors[field] = rules.patternMessage || 'Invalid format';
                continue;
            }

            sanitized[field] = result.value;
            
            // Log warnings
            if (result.warnings.length > 0) {
                logAuditEvent('INPUT_WARNING', { 
                    field, 
                    warnings: result.warnings 
                });
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
            sanitized
        };
    }

    /**
     * Secure localStorage wrapper
     */
    const secureStorage = {
        set: function(key, value) {
            try {
                // Don't store sensitive data
                if (key.toLowerCase().includes('password') || 
                    key.toLowerCase().includes('token') ||
                    key.toLowerCase().includes('secret')) {
                    console.warn('[Security] Attempted to store sensitive data');
                    return false;
                }
                localStorage.setItem(`narrativeos_${key}`, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('[Storage Error]', e);
                return false;
            }
        },
        
        get: function(key) {
            try {
                const item = localStorage.getItem(`narrativeos_${key}`);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(`narrativeos_${key}`);
                return true;
            } catch (e) {
                return false;
            }
        },
        
        clear: function() {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('narrativeos_')) {
                        localStorage.removeItem(key);
                    }
                });
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    /**
     * Content Security Policy reporter
     */
    function initCSPReporter() {
        document.addEventListener('securitypolicyviolation', (e) => {
            logAuditEvent('CSP_VIOLATION', {
                violatedDirective: e.violatedDirective,
                blockedURI: e.blockedURI,
                documentURI: e.documentURI
            });
        });
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCSPReporter);
    } else {
        initCSPReporter();
    }

    // Public API
    return {
        sanitizeHTML,
        sanitizeInput,
        detectPromptInjection,
        checkRateLimit,
        validateFormData,
        logAuditEvent,
        generateId,
        storage: secureStorage,
        getAuditLog: () => [...auditLog],
        clearAuditLog: () => { auditLog.length = 0; }
    };
})();

// Make available globally
window.NarrativeOSSecurity = NarrativeOSSecurity;
