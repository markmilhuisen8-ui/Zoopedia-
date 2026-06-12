$(document).ready(function() {
    // Inject Auth Modal if missing
    if ($('.auth-overlay').length === 0) {
        const modalHtml = `
        <div class="auth-overlay">
            <div class="auth-modal">
                <div class="auth-close"><i class="fas fa-times"></i></div>
                <div class="auth-header">
                    <img src="img/fet%20page/Zooplogo.png" alt="Zoopedia">
                    <h2 id="auth-title">Sign In</h2>
                    <p id="auth-subtitle">Enter your details to access your account.</p>
                </div>
                <div class="auth-tabs">
                    <div class="auth-tab active" data-tab="login">Sign In</div>
                    <div class="auth-tab" data-tab="register">Create Account</div>
                </div>
                <div class="auth-form-container">
                    <!-- Login Form -->
                    <form id="login-form" class="auth-form">
                        <div class="input-group">
                            <label>Email Address</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope"></i>
                                <input type="email" name="email" placeholder="name@example.com" required>
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock"></i>
                                <input type="password" name="password" placeholder="••••••••" required>
                            </div>
                        </div>
                        <button type="submit" class="btn-auth">Sign In</button>
                    </form>

                    <!-- Register Form -->
                    <form id="register-form" class="auth-form" style="display:none;">
                        <div class="profile-upload">
                            <div class="profile-preview" id="profile-preview-box">
                                <i class="fas fa-camera"></i>
                                <img id="preview-img" src="" style="display:none;">
                            </div>
                            <input type="file" id="profile-pic-input" name="profile_pic" accept="image/*">
                            <p>Upload Profile Picture</p>
                        </div>
                        <div class="input-group">
                            <label>Full Name</label>
                            <div class="input-wrapper">
                                <i class="fas fa-user"></i>
                                <input type="text" name="fullname" placeholder="John Doe" required>
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Email Address</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope"></i>
                                <input type="email" name="email" placeholder="name@example.com" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label>Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock"></i>
                                <input type="password" name="password" placeholder="••••••••" required>
                            </div>
                        </div>
                        <button type="submit" class="btn-auth">Create Account</button>
                    </form>


                </div>
                <div class="auth-divider"><span>or</span></div>
                <div id="g_id_onload" data-client_id="854458435058-p03k3qsi2igphti99n4fs946544btueb.apps.googleusercontent.com" data-callback="handleCredentialResponse" data-auto_prompt="false"></div>
                <div class="g_id_signin" data-type="standard" data-size="large" data-theme="outline" data-text="sign_in_with" data-shape="pill" data-logo_alignment="left"></div>
            </div>
        </div>`;
        $('body').append(modalHtml);
        
        // Re-init Google Sign-In
        if (window.google && google.accounts && google.accounts.id) {
            google.accounts.id.initialize({
                client_id: "854458435058-p03k3qsi2igphti99n4fs946544btueb.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.querySelector(".g_id_signin"),
                { theme: "outline", size: "large", shape: "pill", width: "100%" }
            );
        }
    }


    // Check session on load
    checkSession();

    // Toggle between Login and Register
    $('.auth-tab').on('click', function() {
        const tab = $(this).data('tab');
        $('.auth-tab').removeClass('active');
        $(this).addClass('active');

        if (tab === 'login') {
            $('#login-form').show();
            $('#register-form').hide();
            $('#auth-title').text('Sign In');
            $('#auth-subtitle').text('Enter your details to access your account.');
        } else {
            $('#login-form').hide();
            $('#register-form').show();
            $('#auth-title').text('Create Account');
            $('#auth-subtitle').text('Join Zoopedia and start your adventure.');
        }
    });

    // Close Modal
    $('.auth-close, .auth-overlay').on('click', function(e) {
        if (e.target === this) {
            closeAuthModal();
        }
    });

    // Profile Pic Preview
    $('#profile-preview-box').on('click', function() {
        $('#profile-pic-input').click();
    });

    $('#profile-pic-input').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#preview-img').attr('src', e.target.result);
                $('#preview-img').show();
                $('.profile-preview i').hide();
            }
            reader.readAsDataURL(file);
        }
    });

    // Register Form Submit
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        const btn = $(this).find('.btn-auth');
        const originalText = btn.text();
        btn.prop('disabled', true).text('Creating Account...');

        $.ajax({
            url: '/Zoopedia-main/register_process.php',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    $('.auth-tab[data-tab="login"]').click();
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Something went wrong. Please try again.');
            },
            complete: function() {
                btn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Login Form Submit
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const formData = $(this).serialize();
        
        const btn = $(this).find('.btn-auth');
        const originalText = btn.text();
        btn.prop('disabled', true).text('Signing In...');

        $.ajax({
            url: '/Zoopedia-main/login_process.php',
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    updateNavbar(response.user);
                    closeAuthModal();
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Something went wrong. Please try again.');
            },
            complete: function() {
                btn.prop('disabled', false).text(originalText);
            }
        });
    });


});

function openAuthModal() {
    $('.auth-overlay').addClass('active').css('display', 'flex');
    $('body').css('overflow', 'hidden');
}

function closeAuthModal() {
    $('.auth-overlay').removeClass('active');
    setTimeout(() => {
        $('.auth-overlay').css('display', 'none');
        $('body').css('overflow', 'auto');
    }, 400);
}

function checkSession() {
    console.log("Checking session...");
    $.ajax({
        url: '/Zoopedia-main/check_session.php',
        type: 'GET',
        cache: false,
        success: function(response) {
            console.log("Session response:", response);
            if (response.logged_in) {
                updateNavbar(response.user);
            } else {
                showLoginButtons();
            }
        }
    });
}

// Google Auth Callback
function handleCredentialResponse(response) {
    console.log("Handling Google response...");
    $.ajax({
        url: '/Zoopedia-main/google_auth.php',
        type: 'POST',
        data: JSON.stringify({ credential: response.credential }),
        contentType: 'application/json',
        success: function(res) {
            if (res.success) {
                updateNavbar(res.user);
                closeAuthModal();
            } else {
                alert("Google Login failed: " + res.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Google Auth Error:", error);
            alert("An error occurred during Google Login. Please check the console for details.");
        }
    });
}

function updateNavbar(user) {
    console.log("Updating navbar for user:", user);
    
    // Set a flag that this browser has a registered user
    localStorage.setItem('isZoopediaUser', 'true');
    updateFeatureButtons('shop');

    const profileHtml = `
        <div class="nav-profile-item" id="nav-profile-dropdown" style="position: relative; display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 6px 12px; border-radius: 20px; transition: background 0.3s ease;">
            <div style="position: relative;">
                <img src="${user.pic}" alt="Profile" class="nav-user-pic" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onerror="this.src='img/default_avatar.png'">
                <div style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #34c759; border: 2px solid white; border-radius: 50%;"></div>
            </div>
            <span class="nav-user-name" style="font-weight: 600; color: #1d1d1f; font-size: 15px; font-family: 'Outfit', sans-serif;">${user.name.split(' ')[0]}</span>
            <i class="fas fa-chevron-down" style="font-size: 10px; color: #86868b; transition: transform 0.3s ease;"></i>
            
            <div class="profile-dropdown-content" style="display:none; position:absolute; top:calc(100% + 10px); right:0; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 15px 35px rgba(0,0,0,0.12); border-radius: 16px; padding: 8px; z-index: 10000; min-width: 180px; transform: translateY(10px); transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);">
                <div style="padding: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 4px;">
                    <p style="margin: 0; font-size: 13px; font-weight: 500; color: #86868b;">Signed in as</p>
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1d1d1f; overflow: hidden; text-overflow: ellipsis;">${user.email}</p>
                </div>
                <a href="DigitalLibrary.html" style="color:#1d1d1f; text-decoration:none; font-size:14px; font-weight:500; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; transition: background 0.2s;">
                    <i class="fas fa-book-open" style="width: 16px; color: #0071e3;"></i> My Library
                </a>
                <a href="sos_911.html" style="color:#1d1d1f; text-decoration:none; font-size:14px; font-weight:500; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; transition: background 0.2s;">
                    <i class="fas fa-heartbeat" style="width: 16px; color: #ff3b30;"></i> SOS Portal
                </a>
                <div style="height: 1px; background: rgba(0,0,0,0.05); margin: 4px 0;"></div>
                <a href="logout.php" style="color:#ff3b30; text-decoration:none; font-size:14px; font-weight:600; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; transition: background 0.2s;">
                    <i class="fas fa-sign-out-alt" style="width: 16px;"></i> Sign Out
                </a>
            </div>
        </div>
    `;
    
    $('.auth-trigger').remove();
    const navContainers = $('.nav-links, #navbarNav');
    navContainers.each(function() {
        if ($(this).find('#nav-profile-dropdown').length === 0) {
            $(this).append(profileHtml);
        }
    });

    $(document).off('click', '#nav-profile-dropdown').on('click', '#nav-profile-dropdown', function(e) {
        e.stopPropagation();
        const dropdown = $(this).find('.profile-dropdown-content');
        const chevron = $(this).find('.fa-chevron-down');
        
        const isVisible = dropdown.is(':visible');
        
        if (isVisible) {
            dropdown.css({ opacity: 0, transform: 'translateY(10px)' });
            setTimeout(() => dropdown.hide(), 300);
            chevron.css('transform', 'rotate(0deg)');
        } else {
            dropdown.show().css({ display: 'block', opacity: 0, transform: 'translateY(10px)' });
            setTimeout(() => dropdown.css({ opacity: 1, transform: 'translateY(0)' }), 10);
            chevron.css('transform', 'rotate(180deg)');
        }
    });

    $(document).on('click', function() {
        $('.profile-dropdown-content').css({ opacity: 0, transform: 'translateY(10px)' });
        setTimeout(() => $('.profile-dropdown-content').hide(), 300);
        $('.fa-chevron-down').css('transform', 'rotate(0deg)');
    });

    // Add hover styles dynamically for the dropdown items
    $('.profile-dropdown-content a').hover(
        function() { $(this).css('background', 'rgba(0,0,0,0.05)'); },
        function() { $(this).css('background', 'transparent'); }
    );
}


function showLoginButtons() {
    if ($('.auth-trigger').length === 0 && $('#nav-profile-dropdown').length === 0) {
        $('.nav-links').append('<a href="#" class="auth-trigger" onclick="openAuthModal()">Sign In</a>');
    }

    // Logic for Feature Page Button
    if (localStorage.getItem('isZoopediaUser') === 'true') {
        updateFeatureButtons('login');
    } else {
        updateFeatureButtons('register');
    }
}

function updateFeatureButtons(state) {
    const btn = $('#feature-tap-btn');
    if (!btn.length) return;

    if (state === 'shop') {
        btn.text('Shop').attr('onclick', "location.href='products_page.html'");
    } else if (state === 'login') {
        btn.text('Login').attr('onclick', "openAuthModal(); $('.auth-tab[data-tab=\"login\"]').click();");
    } else {
        btn.text('Register').attr('onclick', "openAuthModal(); $('.auth-tab[data-tab=\"register\"]').click();");
    }
}
