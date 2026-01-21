// Analytics and Email Capture for Snap2Cal
// This script handles email capture and user tracking

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Replace with your actual endpoint/service
        EMAIL_API_ENDPOINT: 'https://api.example.com/snap2cal/subscribe', // You'll need to set up your own backend
        ANALYTICS_ENDPOINT: 'https://api.example.com/snap2cal/analytics',
        STORAGE_KEY: 'snap2cal_user_id',
        SESSION_KEY: 'snap2cal_session'
    };

    // Generate or retrieve user ID
    function getUserID() {
        let userID = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (!userID) {
            userID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(CONFIG.STORAGE_KEY, userID);
        }
        return userID;
    }

    // Track page view
    function trackPageView() {
        const userID = getUserID();
        const sessionID = sessionStorage.getItem(CONFIG.SESSION_KEY) || 
                         'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem(CONFIG.SESSION_KEY, sessionID);

        const pageData = {
            userID: userID,
            sessionID: sessionID,
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
        };

        // Try to send to analytics endpoint
        if (CONFIG.ANALYTICS_ENDPOINT && CONFIG.ANALYTICS_ENDPOINT !== 'https://api.example.com/snap2cal/analytics') {
            fetch(CONFIG.ANALYTICS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pageData)
            }).catch(err => console.log('Analytics tracking failed:', err));
        }

        // Also store in local storage for offline tracking
        const storedAnalytics = JSON.parse(localStorage.getItem('snap2cal_analytics') || '[]');
        storedAnalytics.push(pageData);
        // Keep only last 100 events
        if (storedAnalytics.length > 100) {
            storedAnalytics.shift();
        }
        localStorage.setItem('snap2cal_analytics', JSON.stringify(storedAnalytics));
    }

    // Email capture handler
    function handleEmailCapture(email, source = 'unknown') {
        const userID = getUserID();
        
        const emailData = {
            email: email,
            userID: userID,
            source: source,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent
        };

        // Try to send to email API endpoint
        if (CONFIG.EMAIL_API_ENDPOINT && CONFIG.EMAIL_API_ENDPOINT !== 'https://api.example.com/snap2cal/subscribe') {
            fetch(CONFIG.EMAIL_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Email captured successfully:', data);
            })
            .catch(err => {
                console.error('Email capture failed:', err);
                // Store locally as backup
                storeEmailLocally(emailData);
            });
        } else {
            // Store locally if no endpoint configured
            storeEmailLocally(emailData);
        }
    }

    // Store email locally as backup
    function storeEmailLocally(emailData) {
        const storedEmails = JSON.parse(localStorage.getItem('snap2cal_emails') || '[]');
        storedEmails.push(emailData);
        localStorage.setItem('snap2cal_emails', JSON.stringify(storedEmails));
    }

    // Get stored analytics data
    function getStoredAnalytics() {
        return JSON.parse(localStorage.getItem('snap2cal_analytics') || '[]');
    }

    // Get stored emails
    function getStoredEmails() {
        return JSON.parse(localStorage.getItem('snap2cal_emails') || '[]');
    }

    // Get unique user count
    function getUniqueUserCount() {
        const analytics = getStoredAnalytics();
        const uniqueUsers = new Set(analytics.map(item => item.userID));
        return uniqueUsers.size;
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        trackPageView();
        
        // Make functions available globally
        window.Snap2CalAnalytics = {
            trackPageView: trackPageView,
            captureEmail: handleEmailCapture,
            getUserID: getUserID,
            getStoredAnalytics: getStoredAnalytics,
            getStoredEmails: getStoredEmails,
            getUniqueUserCount: getUniqueUserCount,
            CONFIG: CONFIG
        };
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            trackPageView();
        }
    });

})();
