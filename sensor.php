<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>iPay Secure Auth</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        body {
            background: #000;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
        }

        /* System Biometric Modal (Looks like Android/iOS System Prompt) */
        .system-auth-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(20px);
            display: none;
            flex-direction: column;
            justify-content: flex-end;
            z-index: 1000;
        }

        .system-auth-sheet {
            background: #1c1c1e;
            border-radius: 30px 30px 0 0;
            padding: 40px 20px;
            text-align: center;
            animation: slideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }

        .auth-icon {
            width: 80px;
            height: 80px;
            background: #2c2c2e;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
            font-size: 40px;
            color: #0071e3;
            position: relative;
        }

        .auth-pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid #0071e3;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
        }

        .auth-title { font-size: 20px; font-weight: 600; margin-bottom: 10px; }
        .auth-desc { color: #8e8e93; font-size: 15px; margin-bottom: 30px; }

        .success-check {
            font-size: 60px;
            color: #34c759;
            display: none;
        }

        #mock-system-modal {
            animation: slideUpCenter 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.28);
        }

        @keyframes slideUpCenter {
            from { transform: translate(-50%, 100%); opacity: 0; }
            to { transform: translate(-50%, -50%); opacity: 1; }
        }
    </style>
</head>
<body>

    <div style="text-align: center; padding: 20px;">
        <img src="img/fet%20page/Zooplogo.png" alt="Zoopedia" style="width: 80px; margin-bottom: 20px;">
        <h1 style="font-size: 28px;">iPay</h1>
        <p id="system-status" style="color: #8e8e93;">Checking Connection...</p>
        <div id="waiting-screen" style="margin-top: 50px; color: #8e8e93; font-size: 14px;">
            <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 30px; margin-bottom: 15px; color: #0071e3;"></i>
            <p>Waiting for laptop checkout...</p>
        </div>
    </div>

    <!-- The System-Style Auth Dialog -->
    <div class="system-auth-overlay" id="auth-overlay" style="display: none;">
        <div class="system-auth-sheet">
            <div class="auth-icon" id="fingerprint-trigger" style="touch-action: none;">
                <div class="auth-pulse"></div>
                <i class="fa-solid fa-fingerprint" id="main-icon"></i>
                <i class="fa-solid fa-check success-check" id="success-icon"></i>
            </div>
            <div class="auth-title" id="auth-title">Verify Identity</div>
            <div class="auth-desc" id="auth-desc">Confirm your fingerprint to pay Zoopedia</div>
            
            <div style="width: 200px; height: 4px; background: #333; margin: 0 auto 20px; border-radius: 2px; overflow: hidden;">
                <div id="pressure-bar" style="width: 0%; height: 100%; background: #0071e3; transition: width 0.1s;"></div>
            </div>
            <div id="percent-text" style="margin-bottom: 20px; font-size: 12px; color: #8e8e93;">0%</div>
            
            <button id="manual-fallback-btn" style="background: #0071e3; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; display: none; width: 100%;" onclick="handleSuccess()">Confirm Payment Manually</button>
        </div>
    </div>

    <div id="debug-info" style="position: fixed; bottom: 10px; width: 100%; text-align: center; font-size: 10px; color: #333;">
        Connection: <span id="debug-conn">Idle</span> | Laptop: <span id="debug-laptop">Offline</span>
    </div>

    <script>
        const overlay = document.getElementById('auth-overlay');
        const trigger = document.getElementById('fingerprint-trigger');
        const bar = document.getElementById('pressure-bar');
        const pText = document.getElementById('percent-text');
        const mainIcon = document.getElementById('main-icon');
        const successIcon = document.getElementById('success-icon');
        const title = document.getElementById('auth-title');
        const status = document.getElementById('auth-desc');
        const sysStatus = document.getElementById('system-status');
        const manualBtn = document.getElementById('manual-fallback-btn');

        let isVerified = false;

        // HEARTBEAT CHECK
        setInterval(() => {
            fetch('sensor_bridge.php?t=' + Date.now())
                .then(res => res.json())
                .then(data => {
                    const waiting = document.getElementById('waiting-screen');
                    document.getElementById('debug-conn').innerText = "Live";
                    document.getElementById('debug-laptop').innerText = data.laptop_active ? "Active" : "Offline";
                    
                    if (data.laptop_active) {
                        overlay.style.display = 'flex';
                        if(waiting) waiting.style.display = 'none';
                        if(sysStatus) {
                            sysStatus.innerText = "Laptop Ready";
                            sysStatus.style.color = "#34c759";
                        }
                    } else {
                        if (!isVerified) {
                            overlay.style.display = 'none';
                            if(waiting) waiting.style.display = 'block';
                            if(sysStatus) {
                                sysStatus.innerText = "Secure Connection Active";
                                sysStatus.style.color = "#8e8e93";
                            }
                        }
                    }
                })
                .catch(err => {
                    document.getElementById('debug-conn').innerText = "Error";
                });
        }, 500);

        async function triggerBiometric() {
            if (isVerified) return;

            // 1. TRY REAL HARDWARE (Requires HTTPS or Localhost)
            if (window.PublicKeyCredential) {
                try {
                    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                    if (available && window.isSecureContext) {
                        const challenge = new Uint8Array(32);
                        window.crypto.getRandomValues(challenge);
                        const options = {
                            publicKey: {
                                challenge: challenge,
                                rp: { name: "Zoopedia Intelligence", id: window.location.hostname },
                                user: { id: Uint8Array.from("USER123", c => c.charCodeAt(0)), name: "researcher@zoopedia.com", displayName: "Zoopedia Researcher" },
                                pubKeyCredParams: [{ type: "public-key", alg: -7 }],
                                timeout: 60000,
                                authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" }
                            }
                        };
                        const credential = await navigator.credentials.create(options);
                        if (credential) { handleSuccess(); return; }
                    }
                } catch (err) { console.error("Real Biometric failed, falling back to simulation:", err); }
            }

            // 2. SIMULATION FALLBACK (Works on HTTP/Local IP)
            showMockSystemPrompt();
        }

        function showMockSystemPrompt() {
            if (document.getElementById('mock-system-modal')) return;
            
            const mock = document.createElement('div');
            mock.id = "mock-system-modal";
            mock.style = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:280px; background:rgba(44,44,46,0.95); backdrop-filter:blur(25px); border-radius:24px; padding:30px; text-align:center; z-index:9999; box-shadow:0 30px 60px rgba(0,0,0,0.6); color:white; border: 1px solid rgba(255,255,255,0.1);";
            mock.innerHTML = `
                <div style="width:60px; height:60px; background:#3a3a3c; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
                    <i class="fa-solid fa-fingerprint" style="font-size:32px; color:#0071e3;"></i>
                </div>
                <div style="font-weight:600; font-size:19px; margin-bottom:10px; letter-spacing:-0.5px;">Touch ID for Zoopedia</div>
                <div style="font-size:14px; color:#8e8e93; margin-bottom:30px; line-height:1.4;">Confirm your identity to authorize the transaction.</div>
                <div style="border-top:1px solid rgba(255,255,255,0.1); margin:0 -30px;">
                    <button id="mock-confirm-btn" style="background:none; border:none; color:#0071e3; font-size:17px; padding:16px; width:100%; font-weight:600; cursor:pointer;">Confirm with Sensor</button>
                    <button onclick="document.getElementById('mock-system-modal').remove()" style="background:none; border:none; color:#ff3b30; font-size:17px; padding:16px; width:100%; font-weight:400; cursor:pointer; border-top:1px solid rgba(255,255,255,0.1);">Cancel</button>
                </div>
            `;
            document.body.appendChild(mock);

            if (window.navigator.vibrate) window.navigator.vibrate([40, 10, 40]);

            document.getElementById('mock-confirm-btn').onclick = () => {
                mock.remove();
                handleSuccess();
            };
        }

        function handleSuccess() {
            if (isVerified) return;
            isVerified = true;
            mainIcon.style.display = 'none';
            successIcon.style.display = 'block';
            title.innerText = "Verified";
            title.style.color = "#34c759";
            status.innerText = "Payment Authorized";
            manualBtn.style.display = 'none';
            document.querySelector('.auth-pulse').style.display = 'none';
            
            if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
            sendData(1.0, true, false);
            
            setTimeout(() => {
                window.close();
            }, 3000);
        }

        function sendData(pressure, verified, failed) {
            fetch('sensor_bridge.php', {
                method: 'POST',
                body: JSON.stringify({ pressure: pressure, verified: verified, failed: failed }),
                headers: { 'Content-Type': 'application/json' }
            });
        }

        trigger.addEventListener('click', triggerBiometric);
        // Also allow tapping anywhere on the overlay to trigger
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.closest('.system-auth-sheet')) {
                triggerBiometric();
            }
        });
    </script>
</body>
</html>
