/* DARK MODE LOGIC FOR BB8 TOGGLE */

$(document).ready(function() {
    const $body = $('body');

    const updateTheme = (isDark) => {
        if (isDark) {
            $body.addClass('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            $body.removeClass('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        
        // Sync ALL UI elements on the page
        // 1. Sync checkboxes (BB8 Style)
        $('.bb8-toggle__checkbox').prop('checked', isDark);
        
        // 2. Sync buttons (Fallback Style - found on singleanimalpage)
        const $btn = $('#darkModeToggle');
        if ($btn.is('button')) {
            $btn.html(isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>');
        }
    };

    // Initialize theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        updateTheme(true);
    } else {
        updateTheme(false);
    }

    // EVENT LISTENERS

    // 1. Handle physical clicks on BB8 Checkboxes (Standard)
    $(document).on('change', '.bb8-toggle__checkbox', function() {
        updateTheme($(this).is(':checked'));
    });

    // 2. Special case for the button-style toggle (found on some pages)
    $(document).on('click', '#darkModeToggle', function(e) {
        if ($(this).is('button')) {
            const currentIsDark = $('body').hasClass('dark-mode');
            updateTheme(!currentIsDark);
        }
    });

    // 3. Global toggle function (used by AI and Gesture systems)
    // Using a global window object to expose the logic to other scripts
    window.toggleDarkMode = (force) => {
        const isCurrentlyDark = $('body').hasClass('dark-mode');
        const target = force !== undefined ? force : !isCurrentlyDark;
        updateTheme(target);
    };
});
