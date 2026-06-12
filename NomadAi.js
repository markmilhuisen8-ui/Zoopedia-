$(document).ready(function() {
    // UI Update: Guide user to click once to enable system
    $('.normad-status-text').text("Click anywhere to enable AI");

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return;

    const ears = new SpeechRecognition();
    ears.continuous = true;
    ears.interimResults = true; 

    let currentPersona = localStorage.getItem('activePersona') || "sussi"; 
    let isProcessing = false;    
    let silenceTimer = null;

    // Sync Language Settings
    ears.lang = (currentPersona === "sussi") ? "si-LK" : "en-US";
    if (currentPersona === "sussi") $('#persona-toggle').prop('checked', true);

    // --- SOUND ENGINE (CLAP + SPEECH) ---
    let audioCtx = null;
    let analyser = null;
    let lastClapTime = 0;
    window.isAudioPlaying = false; 

    // Robust Mic State Check
    if (typeof window.zpMicMuted === 'undefined') {
        window.zpMicMuted = localStorage.getItem('zpMicMuted') === 'true';
    }

    function initAiSystem() {
        if (audioCtx) return; // Already initialized
        if (window.zpMicMuted) {
            $('.normad-status-text').text("Mic Muted in Panel");
            return;
        }

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                window.zpClapStream = stream;
                const source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);
                
                // Start Clap Detector
                detectClap();
                
                // Update UI
                $('.normad-status-text').text("Clap to Talk");
                console.log("NomadAi: AI Sound Engine Online.");
            })
            .catch(err => {
                console.warn("Mic access denied: ", err);
                $('.normad-status-text').text("Mic Access Needed");
            });
    }

    // Initialize on first interaction (REQUIRED by browsers for AudioContext/Mic)
    $(document).one('click', initAiSystem);

    function detectClap() {
        if (window.isAudioPlaying) { requestAnimationFrame(detectClap); return; }

        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(data);

        let sumOfSquares = 0;
        let peak = 0;
        for (let i = 0; i < data.length; i++) {
            let val = (data[i] - 128) / 128;
            sumOfSquares += val * val;
            if (Math.abs(val) > peak) peak = Math.abs(val);
        }
        
        let rms = Math.sqrt(sumOfSquares / data.length);
        let isListening = $('#normad-container').hasClass('listening');
        let threshold = isListening ? 0.25 : 0.08; 
        const isSharpPulse = (rms > 0) && (peak / rms > 3.0);

        if (rms > threshold && isSharpPulse && !window.isAudioPlaying && !isProcessing) {
            let now = Date.now();
            if (now - lastClapTime > 300) {
                console.log("Sharp Clap Detected");
                if (typeof showNotification === 'function') showNotification("Clap Detected", "#00ffcc");
                
                if (!$('#normad-container').hasClass('listening')) {
                    powerUp();
                } else if (currentPersona === "sussi") {
                    // Double clap stop logic for Sussi
                    if (now - lastClapTime < 800) { // Quick succession
                        standDown();
                    }
                }
            }
            lastClapTime = now;
        }
        requestAnimationFrame(detectClap);
    }

    function powerUp() {
        if (isProcessing) return;
        
        // Guard: Check if Mic is muted via Global Control
        if (window.zpMicMuted) {
            console.warn("NomadAi: Blocked powerUp - Mic is muted.");
            if (typeof showNotification === 'function') {
                showNotification("Enable Microphone First 🎙️", "#ff4444");
            }
            $('.normad-status-text').text("Mic Muted");
            return;
        }

        console.log("NomadAi: Powering Up...");
        
        // Block claps while starting
        window.isAudioPlaying = true;

        if (currentPersona === "sussi") {
            $('#normad-container').addClass('idle').removeClass('listening');
            $('.normad-status-text').text("I'm Powering Up...");
            
            SamanthaBrain.play("online", () => {
                $('#normad-container').addClass('listening').removeClass('idle');
                $('.normad-status-text').text("I'm Listening...");
                window.isAudioPlaying = false; 
                try { ears.start(); } catch(e) {}
            });
        } else {
            $('#normad-container').addClass('listening').removeClass('idle');
            $('.normad-status-text').text("I'm Listening...");
            window.isAudioPlaying = false;
            try { ears.start(); } catch(e) {}
        }
        
        if (typeof showNotification === 'function') showNotification("AI Activated", "#00ffcc");
    }

    function standDown() {
        $('#normad-container').removeClass('listening').addClass('idle');
        $('.normad-status-text').text("Clap to Talk");
        try { ears.abort(); } catch(e) {}
        
        if (typeof showNotification === 'function') showNotification("AI Standby", "#ff3b30");
    }

    // --- SPEECH NAVIGATION SYSTEM ---
    const cleanText = (text) => {
        if (!text) return "";
        return text.toString().replace(/[\u200D\u200C]/g, '').replace(/[.,?!]/g, '').toLowerCase().trim();
    };

    // --- CAPTION CLEANER & MULTILINGUAL UX ---
    const captionMap = {
        "කැට්": "CAT", "බළලා": "CAT", "බළල": "CAT", "පූසා": "CAT",
        "බල්ලා": "DOG", "ඩෝග්": "DOG", "බල්ල": "DOG",
        "සිංහ": "LION", "ලයින්": "LION", "ටයිගර්": "TIGER", "කොටි": "TIGER",
        "එලිපන්ට්": "ELEPHANT", "අලියා": "ELEPHANT", "ඇත": "ELEPHANT",
        "වලහා": "BEAR", "බෙයර්": "BEAR", "සර්ප": "SNAKE", "නයා": "SNAKE",
        "රැබිට්": "RABBIT", "හාවා": "RABBIT", "හැම්ස්ටර්": "HAMSTER",
        "ගේම්": "GAME", "සෙල්ලම්": "GAME", "ප්ලේ": "PLAY",
        "අබවුට්": "ABOUT", "ගැන": "ABOUT", "වෝල්ට්": "VAULT", 
        "කොන්ටැක්ට්": "CONTACT", "කතා": "CONTACT", "සම්බන්ධ": "CONTACT",
        "හෝම්": "HOME", "මුල": "HOME", "ඩාර්ක්": "DARK", "ලයිට්": "LIGHT",
        "මෝඩ්": "MODE", "නායිට්": "NIGHT", "ස්ටෝරි": "STORY", "කතාව": "STORY",
        "හොයන්න": "SEARCH", "කැටලොග්": "CATALOG", "නාමාවලි": "CATALOG"
    };

    function cleanCaption(text) {
        let words = text.split(' ');
        let cleaned = words.map(w => captionMap[w] || w);
        return cleaned.join(' ');
    }

    function executeAction(action, callback) {
        const $body = $('body');
        const $checkbox = $('.bb8-toggle__checkbox');
        if (action === "action:set-dark") {
            window.toggleDarkMode(true);
            if (currentPersona === "alex") AlexBrain.speak("Switching to Dark Mode, Sir.", callback);
            else if (callback) callback();
        } else if (action === "action:set-light") {
            window.toggleDarkMode(false);
            if (currentPersona === "alex") AlexBrain.speak("Switching to Light Mode, Sir.", callback);
            else if (callback) callback();
        } else if (action === "action:enable-magic") {
            if (currentPersona === "alex") AlexBrain.speak("Activating Magic Hand system.", () => { if (typeof startTracking === 'function') startTracking(); if (callback) callback(); });
            else { if (typeof startTracking === 'function') startTracking(); if (callback) callback(); }
        } else if (action === "action:disable-magic") {
            if (currentPersona === "alex") AlexBrain.speak("Deactivating Magic Hand system.", () => { if (typeof stopTracking === 'function') stopTracking(); if (callback) callback(); });
            else { if (typeof stopTracking === 'function') stopTracking(); if (callback) callback(); }
        } else if (action === "action:stop") {
            const stopAi = () => { standDown(); if (callback) callback(); };
            if (currentPersona === "alex") AlexBrain.speak("As you wish, Sir. AI standing down.", stopAi);
            else SamanthaBrain.play("standby", stopAi);
        } else if (callback) callback();
    }

    function handleIntent(transcript, isFinal) {
        if (isProcessing) return; 
        clearTimeout(silenceTimer);
        let query = cleanText(transcript);
        if (!query) return;

        let displayQuery = (currentPersona === "sussi") ? cleanCaption(query) : query;
        $('#normad-caption-bar').text(`${currentPersona.toUpperCase()}: "${displayQuery}"`).fadeIn();

        if (currentPersona === "alex") {
            let foundAnimal = AlexBrain.keywordMap.find(animal => animal.synonyms.some(s => query.toLowerCase().includes(s)));
            if (foundAnimal) {
                isProcessing = true; try { ears.abort(); } catch(e) {}
                AlexBrain.speak(`Opening data for subject ${foundAnimal.id}.`, () => finalize(`singleanimalpage.html?id=${foundAnimal.id}`));
                return; 
            } 
            
            // GEMINI LLM ENGINE (Hybrid Native + API)
            AlexBrain.findIntent(query, isFinal, (intent) => {
                if (!intent) {
                    // Null intent means it was an interim result with no nav match. Just wait.
                    return;
                }

                // A valid intent (nav or chat) was found! Lock the ears immediately.
                isProcessing = true; try { ears.abort(); } catch(e) {}
                window.isAudioPlaying = true;

                if (intent.type === "chat") {
                    AlexBrain.speak(intent.response, () => {
                        isProcessing = false;
                        restartMic();
                    });
                } else {
                    if (intent.url.startsWith("action:")) executeAction(intent.url, () => finalize());
                    else AlexBrain.speak(`Navigating.`, () => finalize(intent.url));
                }
            });
            return; // Handled via callback
        } else {

            let sussiFoundAnimal = SamanthaBrain.animalKeywords.find(animal => animal.names.some(name => query.includes(cleanText(name))));
            if (sussiFoundAnimal) {
                isProcessing = true; try { ears.abort(); } catch(e) {}
                SamanthaBrain.play("finding", () => finalize(`singleanimalpage.html?id=${sussiFoundAnimal.id}`));
                return; 
            } 
            let sussiTargetPage = SamanthaBrain.findIntent(query);
            if (sussiTargetPage) {
                isProcessing = true; try { ears.abort(); } catch(e) {}
                if (sussiTargetPage.startsWith("action:")) executeAction(sussiTargetPage, () => finalize());
                else SamanthaBrain.play("finding", () => finalize(sussiTargetPage));
                return;
            }
            
            if (isFinal) {
                silenceTimer = setTimeout(() => {
                    if (!isProcessing) {
                        isProcessing = true; try { ears.abort(); } catch(e) {}
                        SamanthaBrain.play("confused", () => { isProcessing = false; restartMic(); });
                    }
                }, 2000);
            }
        }
    }

    function finalize(url) {
        isProcessing = false;
        if (url) window.location.href = url;
        else if ($('#normad-container').hasClass('listening')) restartMic();
    }

    function restartMic() {
        if ($('#normad-container').hasClass('listening')) {
            setTimeout(() => { try { ears.start(); } catch(e) {} }, 400);
        }
    }

    // Manual interaction (Physical Only)
    $(document).on('click dblclick', '#normad-container, #ai-stop-btn', function(e) {
        if (!e.originalEvent || !e.originalEvent.isTrusted) return;
        initAiSystem();
        if ($(this).attr('id') === 'ai-stop-btn') standDown();
        else {
            if ($('#normad-container').hasClass('listening')) standDown();
            else powerUp();
        }
    });

    ears.onresult = (event) => {
        if (!$('#normad-container').hasClass('listening')) return;
        if (window.isAudioPlaying || isProcessing) return; // STRICT MIC LOCK
        let result = event.results[event.results.length - 1];
        handleIntent(result[0].transcript, result.isFinal);
    };

    ears.onend = () => { 
        if ($('#normad-container').hasClass('listening') && !isProcessing && !window.isAudioPlaying) {
            try { ears.start(); } catch(e) {}
        }
    };

    $('#persona-toggle').on('change', function() {
        currentPersona = $(this).is(':checked') ? "sussi" : "alex";
        localStorage.setItem('activePersona', currentPersona); 
        ears.lang = (currentPersona === "sussi") ? "si-LK" : "en-US";
    });

    // GLOBAL INTERFACE FOR MEDIA CONTROLS
    window.abortNomadMic = function() {
        console.log("NomadAi: Global Killswitch Triggered.");
        standDown();
        if (window.zpClapStream) {
            window.zpClapStream.getTracks().forEach(t => t.stop());
            window.zpClapStream = null;
        }
        audioCtx = null; // Force re-init on next restore
        $('.normad-status-text').text("Mic Muted");
    };

    window.restoreNomadMic = function() {
        console.log("NomadAi: Global Restore Triggered.");
        initAiSystem();
    };
});
