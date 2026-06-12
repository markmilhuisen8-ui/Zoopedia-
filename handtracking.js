/* Zoopedia Prime — Magic Hand v8 (Hyper-Speed Edition) */

$(function () {

    // CUSTOM CURSOR SETUP

    const $cursor = $('<div id="zp-cursor"></div>');
    $cursor.css({
        position:      'fixed',
        top:           '0',
        left:          '0',
        width:         '22px',
        height:        '28px',
        background:    'white',
        clipPath:      'polygon(0 0, 0 85%, 28% 65%, 44% 95%, 57% 89%, 41% 60%, 100% 60%)',
        filter:        'drop-shadow(1px 2px 2px rgba(0,0,0,0.5))',
        pointerEvents: 'none',
        zIndex:        999999,
        display:       'block',
        willChange:    'transform',
        transform:     'translate3d(50vw, 50vh, 0)'
    });
    $('body').append($cursor);
    const cursorEl = $cursor[0];

    // Shared cursor position
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // Direct High-Speed Render Loop with Smoothing
    function render() {
        // Smoothing constant (Higher = Snappier, Lower = Smoother)
        // 0.3 sets a perfect balance between speed
        const lerpFactor = 0.3;
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;

        cursorEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // Track real mouse position (Instantly)
    $(document).on('mousemove.zpcursor', function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // MEDIAPIPE REFERENCES (Which is external source to track the cam)
    
    const $video   = $('video.input_video').first();
    const $overlay = $('#hand-tracking-prompt');

    let hands      = null;
    let camera     = null;
    let isTracking = false;

 // Gesture state 
    // CLICK state (Middle + Thumb)
    let isPinching     = false;
    let pinchStartTime = 0;

    // SCROLL state (Index + Thumb) — completely separate to prevent flicker
    let isScrolling    = false;
    let scrollLastY    = null;

    const PINCH_THRESH = 0.45; // Increased for better sensitivity
    const CLICK_MAX_MS = 500;
    const SCROLL_POWER = 6.0;

    function dist2D(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    function isHandOpen(lm) {
        // Simple check: are at least 4 fingers extended?
        const ext = (t, d, m) => dist2D(lm[t], lm[m]) > dist2D(lm[d], lm[m]) * 1.3;
        let c = 0;
        if (ext(8, 7, 5)) c++;   // index
        if (ext(12, 11, 9)) c++; // middle
        if (ext(16, 15, 13)) c++; // ring
        if (ext(20, 19, 17)) c++; // pinky
        return c >= 4;
    }

    // MEDIAPIPE INIT
    function initHands() {
        hands = new Hands({
            locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
        });
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 0, // SPEED BOOST: Uses simpler model for faster tracking
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        hands.onResults(onResults);
    }

    // MAIN RESULTS HANDLER

    function onResults(results) {
        if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) {
            // Reset click state if hand lost
            if (isPinching) { isPinching = false; $('body').removeClass('hand-pinching'); }
            // Reset scroll state if hand lost
            isScrolling = false; scrollLastY = null;
            return;
        }

        const lm        = results.multiHandLandmarks[0];
        const indexTip  = lm[8];   // Index finger tip (2nd finger)
        const midTip    = lm[12];  // Middle finger tip (3rd finger)
        const thumbTip  = lm[4];
        const wrist     = lm[0];
        const mcpMid    = lm[9];
        const handScale = dist2D(mcpMid, wrist) || 0.1;

        //  Cursor always follows Index finger (with smart deadzone)
        let rawX = (1 - indexTip.x) * window.innerWidth;
        let rawY = indexTip.y * window.innerHeight;

        // SMART POINTER: Only move if movement is greater than 4px
        // Eliminates jitter and shaking when doing nothing
        if (Math.abs(rawX - targetX) > 4 || Math.abs(rawY - targetY) > 4) {
            targetX = rawX;
            targetY = rawY;
        }

        // distances
        const dIndex  = dist2D(thumbTip, indexTip) / handScale;
        const dMiddle = dist2D(thumbTip, midTip)   / handScale;

        const middlePinched = dMiddle < PINCH_THRESH;
        const indexPinched  = dIndex  < PINCH_THRESH;

        // CLICK (Middle + Thumb)
        // Only click if middle is pinched AND index is NOT pinched (mutual exclusion)
        if (middlePinched && !indexPinched && !isPinching) {
            isPinching     = true;
            pinchStartTime = Date.now();
            $('body').addClass('hand-pinching');

        } else if ((!middlePinched || indexPinched) && isPinching) {
            const duration = Date.now() - pinchStartTime;
            if (duration < CLICK_MAX_MS) {
                // IMPORTANT: Use currentX/Y (smoothed cursor position) for click, 
                // not targetX/Y (raw jittery hand position). 
                // This ensures the user clicks exactly what they see the cursor on.
                triggerClickAt(currentX, currentY);
            }
            isPinching = false;
            $('body').removeClass('hand-pinching');
        }

        // SCROLL (Index + Thumb)
        // Only scroll if index is pinched AND middle is not pinched 
        if (indexPinched && !middlePinched) {
            if (!isScrolling) {
                // First frame of scroll — anchor Y without moving
                isScrolling = true;
                scrollLastY = indexTip.y;
            } else {
                const deltaY = indexTip.y - scrollLastY;
                scrollLastY  = indexTip.y;
                if (Math.abs(deltaY) > 0.002) {
                    window.scrollBy({ top: deltaY * window.innerHeight * SCROLL_POWER, behavior: 'auto' });
                }
            }
        } else {
            // Release scroll lock cleanly
            isScrolling = false;
            scrollLastY = null;
        }
    }

    // 5 — ACTIONS & UI
  
    function triggerClickAt(x, y) {
        const el = document.elementFromPoint(x, y);
        if (!el) return;
        const $el = $(el);

        // Visual feedback
        const $ripple = $('<div class="zp-click-ripple"></div>').css({ left: x + 'px', top: y + 'px' });
        $('body').append($ripple);
        setTimeout(() => $ripple.remove(), 600);

        // HARD BLOCK: Gesture clicks CANNOT activate AI controls
        if ($el.closest('#normad-container, #ai-stop-btn, .persona-switch-horizontal').length > 0) {
            showNotification('Use physical click for AI controls 🛡️', '#ff9900');
            return;
        }

        // DARK MODE TOGGLE: Direct state call (fixes CSS not updating bug)
        if ($el.closest('.bb8-toggle').length > 0) {
            if (typeof window.toggleDarkMode === 'function') {
                window.toggleDarkMode();
            } else {
                // Fallback: flip the checkbox and fire change manually
                const $check = $('.bb8-toggle__checkbox');
                const next = !$check.prop('checked');
                $check.prop('checked', next);
                const isDark = next;
                $(document.body).toggleClass('dark-mode', isDark);
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }
            showNotification('Theme Switched 🌓', '#BF5AF2');
            return;
        }

        // NATIVE CLICK (works for buttons, links, cards)
        el.dispatchEvent(new MouseEvent('click', {
            view: window, bubbles: true, cancelable: true, clientX: x, clientY: y
        }));

        // LINK FALLBACK
        const $link = $el.is('a') ? $el : $el.closest('a');
        if ($link.length) {
            const href = $link.attr('href');
            if (href && !href.startsWith('javascript:') && href !== '#') {
                window.location.href = href;
            }
        }
        showNotification('Click 🎯', '#00ffcc');
    }

    function showNotification(text, color) {
        let $note = $('#hand-status-note');
        if (!$note.length) {
            $note = $('<div id="hand-status-note"></div>').css({
                position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
                padding: '10px 22px', background: 'rgba(0,0,0,0.88)', borderRadius: '20px',
                fontSize: '14px', fontWeight: 'bold', zIndex: 20000, pointerEvents: 'none',
                border: '1px solid currentColor', display: 'none'
            }).appendTo('body');
        }
        $note.text(text).css({ color: color, borderColor: color }).stop(true).fadeIn(200).delay(2000).fadeOut(500);
    }
    window.showNotification = showNotification;

    async function stopTracking() {
        isTracking = false;
        if (camera) { await camera.stop(); camera = null; }
        if (hands) { await hands.close(); hands = null; }
        $('video').each(function() {
            if (this.srcObject) {
                this.srcObject.getTracks().forEach(t => t.stop());
                this.srcObject = null;
            }
            this.pause();
        });
        showNotification('Camera Off 📷', '#bbbbbb');
    }

    async function startTracking() {
        if (localStorage.getItem('zpCamMuted') === 'true') {
            return;
        }

        if (!hands) initHands();
        
        // ULTIMATE SMOOTHNESS: Use a hidden tiny canvas for processing
        // This is 100% more lightweight as it reduces the pixels MediaPipe sees to the bare minimum
        const procWidth  = 200;
        const procHeight = 150;
        const $procCanvas = $('<canvas>').attr({ width: procWidth, height: procHeight });
        const pCtx = $procCanvas[0].getContext('2d', { alpha: false, desynchronized: true });

        let isProcessingHand = false;
        try {
            camera = new Camera($video[0], {
                onFrame: async () => { 
                    if (!isTracking || !hands || isProcessingHand) return;
                    isProcessingHand = true;
                    // Downscale on GPU before sending to AI
                    pCtx.drawImage($video[0], 0, 0, procWidth, procHeight);
                    await hands.send({ image: $procCanvas[0] }); 
                    isProcessingHand = false;
                },
                width: 320, height: 240 // Input is low-res
            });
            isTracking = true;
            await camera.start();
        } catch (e) { console.error('Camera fail:', e); isTracking = false; }
    }

    window.startTracking = startTracking;
    window.stopTracking = stopTracking;

    $('#btn-agree-hand').on('click', function () {
        localStorage.setItem('handTrackingEnabled', 'true');
        $overlay.fadeOut(300);
        startTracking();
    });

    $('#btn-deny-hand').on('click', function () {
        localStorage.setItem('handTrackingEnabled', 'false');
        $overlay.fadeOut(300);
    });

    // Persistence Check — Ensures we only ask once.
    const isEnabled = localStorage.getItem('handTrackingEnabled');
    if (isEnabled === 'true') {
        startTracking();
    } else if (isEnabled === null) {
        // Only show modal if this is the first time the user is visiting
        setTimeout(() => $overlay.fadeIn(400), 1200);
    }
});
