/**
 * ZOOPEDIA PRIME — Media Permission Controls
 * Two small floating buttons (Cam + Mic) on every page.
 * Click to toggle mute/disable, click again to re-enable.
 */
$(function () {

    // STATE 
    let camActive = localStorage.getItem('zpCamMuted') !== 'true';
    let micActive = localStorage.getItem('zpMicMuted') !== 'true';
    window.zpMicMuted = !micActive;

    // BUILD THE FLOATING PANEL 
    const camClass = camActive ? "active" : "";
    const micClass = micActive ? "active" : "";
    const camIcon = camActive ? "fa-video" : "fa-video-slash";
    const micIcon = micActive ? "fa-microphone" : "fa-microphone-slash";
    const camTitle = camActive ? "Toggle Camera" : "Camera Off";
    const micTitle = micActive ? "Toggle Microphone" : "Microphone Off";

    const $panel = $(`
        <div id="zp-media-controls">
            <button id="zp-cam-btn" class="zp-media-btn ${camClass}" title="${camTitle}">
                <i class="fas ${camIcon}"></i>
            </button>
            <button id="zp-mic-btn" class="zp-media-btn ${micClass}" title="${micTitle}">
                <i class="fas ${micIcon}"></i>
            </button>
        </div>
    `);
    $('body').append($panel);

    // CAM TOGGLE
    $('#zp-cam-btn').on('click', function () {
        camActive = !camActive;
        const $btn = $(this);

        if (camActive) {
            localStorage.setItem('zpCamMuted', 'false');
            // Re-enable: restart the hand tracking camera if it was running
            $btn.addClass('active').attr('title', 'Toggle Camera');
            $btn.find('i').removeClass('fa-video-slash').addClass('fa-video');
            if (typeof window.startTracking === 'function') {
                window.startTracking();
            }
            showZpNotification('Camera On 📷', '#00ffcc');
        } else {
            localStorage.setItem('zpCamMuted', 'true');
            // Disable: completely kill the camera via handtracking kill switch
            $btn.removeClass('active').attr('title', 'Camera Off');
            $btn.find('i').removeClass('fa-video').addClass('fa-video-slash');
            
            if (typeof window.stopTracking === 'function') {
                window.stopTracking(); // <--- Already uses .stop() to terminate hardware
            }
            // Fallback hard kill for any rogue video tags
            $('video').each(function () {
                if (this.srcObject) {
                    this.srcObject.getTracks().forEach(t => t.stop());
                }
            });
            showZpNotification('Camera Off 📷', '#ff4444');
        }
    });

    // MIC TOGGLE
    $('#zp-mic-btn').on('click', function () {
        micActive = !micActive;
        const $btn = $(this);

        if (micActive) {
            localStorage.setItem('zpMicMuted', 'false');
            $btn.addClass('active').attr('title', 'Toggle Microphone');
            $btn.find('i').removeClass('fa-microphone-slash').addClass('fa-microphone');
            
            window.zpMicMuted = false;
            if (typeof window.restoreNomadMic === 'function') {
                window.restoreNomadMic(); // Re-requests hardware mic permissions
            }
            showZpNotification('Mic On 🎙️', '#00ffcc');
            
        } else {
            localStorage.setItem('zpMicMuted', 'true');
            $btn.removeClass('active').attr('title', 'Microphone Off');
            $btn.find('i').removeClass('fa-microphone').addClass('fa-microphone-slash');
            
            // Hard Kill AI Microphone hardware stream
            if (typeof window.abortNomadMic === 'function') {
                window.abortNomadMic(); 
            }
            window.zpMicMuted = true;
            
            // Fallback hard kill for any <audio> elements
            $('video, audio').each(function () {
                if (this.srcObject) {
                    this.srcObject.getAudioTracks().forEach(t => t.stop());
                }
            });
            showZpNotification('Mic Off 🎙️', '#ff4444');
        }
    });

    // NOTIFICATION HELPER 
    function showZpNotification(text, color) {
        let $note = $('#hand-status-note');
        if (!$note.length) {
            $note = $('<div id="hand-status-note"></div>').css({
                position: 'fixed', bottom: '100px', left: '50%',
                transform: 'translateX(-50%)', padding: '10px 22px',
                background: 'rgba(0,0,0,0.88)', borderRadius: '20px',
                fontSize: '14px', fontWeight: 'bold', zIndex: 20000,
                pointerEvents: 'none', border: '1px solid currentColor', display: 'none'
            }).appendTo('body');
        }
        $note.text(text).css({ color, borderColor: color })
             .stop(true).fadeIn(200).delay(2000).fadeOut(500);
    }
});
