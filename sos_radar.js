$(document).ready(function() {
    console.log("SOS Master Engine v44.0 (Robust Strategy)");

    let satelliteActive = false;
    let transitionInProgress = false;
    let sweepAngle = 0;
    let targetIdTriggered = false;
    let sweepInterval = null;
    let environmentIdentified = false;

    const spaceVideo = document.getElementById('space-video');

    function updateTime() {
        const now = new Date();
        $('#current-time').text(now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0'));
    }
    setInterval(updateTime, 1000);
    updateTime();

    // PHASE 0: IDENTIFY MODE
    function identifyEnvironment() {
        console.log("Identifying Local environment... (v44)");
        $('#diag-subtext').text("Identifying Connection...").css('color', '#fff');

        const watchdog = setTimeout(() => {
            if (!environmentIdentified) {
                console.warn("Watchdog forced Satellite mode.");
                handleIdentificationFailure();
            }
        }, 5000);

        $.ajax({
            url: 'check_server.php', 
            type: 'GET', 
            timeout: 2500, 
            cache: false,
            headers: { 'Cache-Control': 'no-cache' }
        }).done(function(data) {
            if (environmentIdentified) return;
            environmentIdentified = true;
            clearTimeout(watchdog);
            
            try {
                if (typeof data === 'string') data = JSON.parse(data);
            } catch(e) {}
            
            if (data && data.status === 'offline') {
                handleIdentificationFailure();
            } else {
                handleIdentificationSuccess();
            }
        }).fail(function() {
            if (environmentIdentified) return;
            environmentIdentified = true;
            clearTimeout(watchdog);
            handleIdentificationFailure();
        });
    }

    function handleIdentificationSuccess() {
        $('#diag-subtext').text("Local Infrastructure Detected.").css('color', '#34c759');
        updateRealLocation();
        $('#tower-hint-ui').removeClass('hidden-view').css('opacity', '1').show()
            .find('.gate-hint').html('Tap <span style="color:#34c759; font-weight:800;">Start SOS</span> to begin local diagnostic.');
    }

    function handleIdentificationFailure() {
        $('#diag-subtext').text("No Service.").css('color', '#ff3b30');
        updateRealLocation();
        $('#tower-hint-ui').removeClass('hidden-view').css('opacity', '1').show()
            .find('.gate-hint').html('Tap <span style="color:#34c759; font-weight:800;">Start SOS</span> for Satellite Link.');
    }

    function updateRealLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                $('#searching-status-group').append(`<p id="real-location-display" style="color: #888; font-size: 0.8rem; margin-top: 10px;">Location: ${lat}, ${lon}</p>`);
            }, (error) => {
                console.warn("Location access denied.");
            });
        }
    }

    // PHASE 1: INITIALIZE DYNAMIC RADAR
    function initDynamicRadar() {
        if (sweepInterval) return; 
        console.log("Initializing Radar Scan Engine v44...");
        $('#tower-hint-ui').fadeOut(400);

        const $dot = $('.radar-ping-dot');
        const $sweep = $('#main-sweep');
        
        const randomAngle = Math.floor(Math.random() * 280) + 40; 
        const rings = [160, 108, 57]; 
        const randomRadius = rings[Math.floor(Math.random() * rings.length)];
        
        const radians = randomAngle * (Math.PI / 180);
        const x = Math.cos(radians) * randomRadius;
        const y = Math.sin(radians) * randomRadius;
        
        $dot.css({
            'transform': `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            'display': 'block', 'top': '50%', 'left': '50%'
        }).removeClass('dot-blink-sequence');

        sweepInterval = setInterval(() => {
            sweepAngle += 1.5; 
            $sweep.css('transform', `rotate(${sweepAngle}deg)`);

            if (sweepAngle >= randomAngle && !targetIdTriggered) {
                targetIdTriggered = true;
                clearInterval(sweepInterval);
                $sweep.css('transform', `rotate(${randomAngle}deg)`); 
                performTargetHandshake($dot);
            }
        }, 30);
    }

    function performTargetHandshake($dot) {
        $dot.addClass('dot-blink-sequence');
        $('#diag-subtext').text("Target Lock Confirmed.").css('color', '#34c759');

        const serverCheck = $.ajax({
            url: 'check_server.php', type: 'GET', timeout: 2000, cache: false
        });

        setTimeout(() => {
            serverCheck.done(function(data) {
                try {
                    if (typeof data === 'string') data = JSON.parse(data);
                } catch(e) {}
                
                if (data && data.status === 'offline') {
                    handleSatelliteHandshake();
                } else {
                    handleTowerAutoHandshake();
                }
            }).fail(function() {
                handleSatelliteHandshake();
            });
        }, 2200); 
    }

    function handleTowerAutoHandshake() {
        $('#radar-mode').fadeOut(1000, function() {
            $(this).addClass('hidden-view');
            $('#tower-dashboard').removeClass('hidden-view').hide().fadeIn(1500);
        });
    }

    function handleSatelliteHandshake() {
        transitionInProgress = true;
        $('#searching-status-group').fadeOut(500, function() {
            $(this).addClass('hidden-view');
            $('#locked-status-group, #radar-locked-overlay').removeClass('hidden-view').hide().fadeIn(800);
        });
        
        setTimeout(() => {
            if ($('#radar-progress-view').hasClass('hidden-view')) {
                $('#radar-progress-view').removeClass('hidden-view').hide().fadeIn(800);
                $('.progress-fill').css('width', '0%').animate({ width: '100%' }, 4000, function() {
                    $('.progress-label').text("Link Established.");
                    setTimeout(runCinematicTransition, 1000);
                });
            }
        }, 500);
    }

    function runCinematicTransition() {
        $('#radar-mode').fadeOut(1000, function() {
            $(this).addClass('hidden-view');
            $('#space-cinematic-view').removeClass('hidden-view').css({'opacity': '1', 'display': 'flex'}).show();
            if (spaceVideo) {
                spaceVideo.play().catch(e => { revealSatelliteDashboard(); });
                $(spaceVideo).one('ended', function() { revealSatelliteDashboard(); });
                setTimeout(() => { if (!satelliteActive) revealSatelliteDashboard(); }, 12000); 
            } else { revealSatelliteDashboard(); }
        });
    }

    function revealSatelliteDashboard() {
        if (satelliteActive) return;
        satelliteActive = true; 
        transitionInProgress = false;
        $('#satellite-dashboard').removeClass('hidden-view').css({'display': 'flex', 'opacity': '1', 'z-index': '99999'}).hide().fadeIn(1500);
    }

    // DIRECT BINDING
    $('#start-sos-header-btn').on('click', function() {
        initDynamicRadar();
    });

    $('#end-sos-btn').on('click', function() {
        location.reload();
    });

    $(document).on('click', '[id^="call-911"]', function() {
        console.log("Offline Call v44 triggered.");
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                $('#call-location-hud').text(`Current Location: ${lat}, ${lon}`);
            });
        }
        window.location.href = 'calling.html';
    });

    // INIT
    identifyEnvironment();
});
