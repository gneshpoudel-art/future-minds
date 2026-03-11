/**
 * Future Minds Analytics Tracker
 * Lightweight visitor tracking script (no dependencies)
 */
(function () {
    'use strict';

    const API_BASE = window.FM_API_BASE || 'http://localhost:4000';
    const SESSION_KEY = 'fm_session_id';
    const VISIT_KEY = 'fm_visit_count';

    function generateId() {
        return 'fm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    }

    function getSessionId() {
        let id = sessionStorage.getItem(SESSION_KEY);
        if (!id) {
            id = generateId();
            sessionStorage.setItem(SESSION_KEY, id);
        }
        return id;
    }

    function isReturningVisitor() {
        const count = parseInt(localStorage.getItem(VISIT_KEY) || '0');
        localStorage.setItem(VISIT_KEY, String(count + 1));
        return count > 0;
    }

    function send(data) {
        const url = API_BASE + '/api/analytics/track';
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, JSON.stringify(data));
        } else {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                keepalive: true,
            }).catch(function () { });
        }
    }

    const sessionId = getSessionId();
    const pageStart = Date.now();
    let maxScrollDepth = 0;

    // Track scroll depth
    window.addEventListener('scroll', function () {
        const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
        if (scrolled > maxScrollDepth) maxScrollDepth = Math.round(scrolled);
    }, { passive: true });

    // Session start
    send({
        session_id: sessionId,
        page_url: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer,
        event_type: 'session_start',
    });

    // Page view
    send({
        session_id: sessionId,
        page_url: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer,
        scroll_depth: 0,
        time_spent: 0,
        event_type: 'page_view',
    });

    // Track time on page + send on close
    window.addEventListener('beforeunload', function () {
        const timeSpent = Math.round((Date.now() - pageStart) / 1000);
        send({
            session_id: sessionId,
            page_url: window.location.pathname,
            scroll_depth: maxScrollDepth,
            time_spent: timeSpent,
            event_type: 'session_end',
        });
    });

    // Heartbeat every 30s
    setInterval(function () {
        const timeSpent = Math.round((Date.now() - pageStart) / 1000);
        send({
            session_id: sessionId,
            page_url: window.location.pathname,
            scroll_depth: maxScrollDepth,
            time_spent: timeSpent,
            event_type: 'heartbeat',
        });
    }, 30000);

})();
