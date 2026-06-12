$(document).ready(function() {
    console.log("SOS Dual-Handover System v6.0 (Offline-Mode Fix)");

    let serverOnline = false;
    let sosStarted = false;
    let satelliteActive = false;
    let transitionInProgress = false;
    const spaceVideo = document.getElementById('space-video');

    function updateTime() {
        const now = new Date();
        $('#current-time').text(now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0'));
    }
    setInterval(updateTime, 1000);
    updateTime();

    // POLING ENGINE - Only runs when NOT in a special mode
    function checkInfrastructure() {
        // Do NOT run if we are in the middle of a transition, 
        // if SOS process has started, or if we are ALREADY on the satellite dashboard.
        if (transitionInProgress || sosStarted || satelliteActive) return;
        
        console.log("Checking Tower Status...");
        $.ajax({
            url: 'check_server.php', type: 'GET', timeout: 2000, cache: false
        })
        .done(function(data) {
            try {
                if (typeof data === 'string') data = JSON.parse(data);
            } catch(e) {}
            
            if (data && data.status === 'offline') {
                if (serverOnline) {
                    serverOnline = false;
                    switchToOfflineRadar();
                }
            } else {
                if (!serverOnline) {
                    serverOnline = true;
                    handleTowerHandshake();
                }
            }
        })
        .fail(function() {
            if (serverOnline) {
                serverOnline = false;
                switchToOfflineRadar();
            }
        });
    }

    function handleTowerHandshake() {
        transitionInProgress = true;
        $('#radar-container').addClass('radar-active');
        $('#connection-status').text("SEARCHING FOR SERVICE").css('color', '#888');
        $('#main-instruction').text("Infrastructure Online.");
        updateRealLocation911();
        $('#searching-pills').removeClass('hidden-view').hide().fadeIn(800);
        
        setTimeout(() => {
            if (serverOnline) {
                $('.header-center').fadeOut(500);
                $('#radar-mode').fadeOut(1000, function() {
                    $(this).addClass('hidden-view');
                    $('#tower-dashboard').removeClass('hidden-view').hide().fadeIn(1500);
                    transitionInProgress = false;
                });
            } else { transitionInProgress = false; }
        }, 3500);
    }

    // Swiches back to Radar view - but only if we ARE NOT ALREADY connected to a satellite
    function switchToOfflineRadar() {
        if (satelliteActive) return; // IMPORTANT: Prevent hiding the satellite UI
        
        $('#tower-dashboard, #satellite-dashboard, #space-cinematic-view, #searching-pills').addClass('hidden-view');
        $('#radar-mode').removeClass('hidden-view').show().css('opacity', '1');
        $('#radar-container').removeClass('radar-active');
        $('#connection-status').text("NO SIGNAL").css('color', '#ff3b30');
        $('#main-instruction').text("Local Tower Offline.");
        updateRealLocation911();
        $('#emergency-call-ui').removeClass('hidden-view').hide().fadeIn(800);
        $('#start-sos').removeClass('btn-locked').prop('disabled', false);
    }

    function runSpaceTransition() {
        transitionInProgress = true;
        sosStarted = true;
        console.log("Running Cinematic Space Transition...");
        
        $('#connection-status').text("SATELLITE FOUND").css('color', '#34c759');
        $('#radar-lock-dot').css('background', '#34c759');
        $('.header-center').fadeOut(500);
        
        setTimeout(() => {
            $('#radar-mode').animate({ opacity: 0 }, 1000, function() {
                $(this).addClass('hidden-view');
                $('#space-cinematic-view').removeClass('hidden-view').css({
                    'opacity': '1',
                    'display': 'flex',
                    'z-index': '5000'
                }).show();
                
                if (spaceVideo) {
                    spaceVideo.muted = true;
                    spaceVideo.load();
                    
                    spaceVideo.play().catch(e => {
                        console.warn("Playback error:", e);
                        revealSatelliteDashboard();
                    });

                    $(spaceVideo).one('ended', function() {
                        revealSatelliteDashboard();
                    });

                    setTimeout(() => {
                        if (!satelliteActive) revealSatelliteDashboard();
                    }, 15000); 

                } else {
                    revealSatelliteDashboard();
                }
            });
        }, 1500);
    }

    function revealSatelliteDashboard() {
        console.log("Entering Satellite Active Mode.");
        satelliteActive = true; 
        transitionInProgress = false;
        sosStarted = false; // The sequence is finished

        $('#space-text-overlay').fadeOut(800);
        $('#satellite-dashboard').removeClass('hidden-view')
            .css({'display': 'flex', 'opacity': '1', 'pointer-events': 'auto'})
            .hide().fadeIn(1500);
    }

    // BUTTON ACTIONS
    $('#start-sos').on('click', function() {
        if (serverOnline || transitionInProgress || satelliteActive) return;
        sosStarted = true;
        $(this).addClass('btn-locked').prop('disabled', true);
        $('#connection-status').text("SEARCHING...").css('color', '#999');
        $('#radar-container').addClass('radar-active');
        setTimeout(runSpaceTransition, 3000);
    });

    // 911 Calling Logic for Dashboards
    $(document).on('click', '#call-911-sat, #call-911-tower, #trigger-call-911', function() {
        alert("EMERGENCY CALL: Dialing 911...");
        // You can also add the full screen calling UI here if you want to reuse it
    });

    $('#end-sos').on('click', function() { location.reload(); });

    function updateRealLocation911() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                if ($('#real-location-911').length === 0) {
                    $('#radar-mode').append(`<p id="real-location-911" style="color: #888; font-size: 0.8rem; margin-top: 10px; text-align: center;">Location: ${lat}, ${lon}</p>`);
                }
            });
        }
    }

    // Modals
    $(document).on('click', '#open-send-msg, #open-send-msg-tower, #open-send-msg-init', function() { 
        $('#send-msg-modal').css('display', 'flex').hide().fadeIn(400); 
    });
    $(document).on('click', '.close-modal', function() { $('.modal-overlay').fadeOut(400); });

    checkInfrastructure();
    setInterval(checkInfrastructure, 5000);
});
