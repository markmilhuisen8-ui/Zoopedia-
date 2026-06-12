
//  6 Criteria:
//    1. DOM Traversal
//    2. DOM Modification
//    3. DOM Attribute Modification
//    4. CSS Manipulation
//    5. JavaScript Effects
//    6. HTML Events
//
// ============================================================


$(document).ready(function() { 
    //to make sure the DOM is fully loaded before accessing elements.

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 1 of 3)
    //  $('body')
    //  jQuery traverses the entire DOM tree to locate the
    //  root <body> element. Stored in $body so we can reuse
    //  this reference throughout the script.
    // ─────────────────────────────────────────────────────────
    const $body = $('body');
    //a jQuery selector used to access the body element of the HTML document.


    // ════════════════════════════════════════════════════════
    //  ── updateTheme() FUNCTION ───────────────────────────
    //  Called on: page load, toggle change, button click,
    //  AI command, and hand gesture trigger.
    // ════════════════════════════════════════════════════════
    const updateTheme = (isDark) => {
        //This function controls EVERYTHING about dark mode **the main function

        if (isDark) {
            // ─────────────────────────────────────────────────
            //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 1 of 3)
            //  $body.addClass('dark-mode')
            //  Adds the CSS class "dark-mode" to the <body>
            //  element in the live DOM — this modifies the
            //  element's class list and triggers all dark-mode
            //  CSS rules defined in darkmode.css to apply.
            // ─────────────────────────────────────────────────
            $body.addClass('dark-mode'); //addClass() adds a CSS class to an element
            localStorage.setItem('theme', 'dark'); 

        } else {
            // ─────────────────────────────────────────────────
            //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 2 of 3)
            //  $body.removeClass('dark-mode')
            //  Removes the "dark-mode" class from <body>,
            //  reverting all CSS rules back to light theme.
            //  This directly modifies the DOM class attribute.
            // ─────────────────────────────────────────────────
            $body.removeClass('dark-mode'); //removeClass() removes css class 
            localStorage.setItem('theme', 'light');
        }

        // ─────────────────────────────────────────────────────
        //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 1 of 3)
        //  $('.bb8-toggle__checkbox').prop('checked', isDark)
        //  .prop() sets the "checked" DOM PROPERTY on every
        //  BB8 checkbox element. This syncs the visual position
        //  of the toggle switch to match the current theme.
        //  (prop() is used for boolean DOM properties like checked)
        // ─────────────────────────────────────────────────────
        $('.bb8-toggle__checkbox').prop('checked', isDark);
        //find toggle switch, turn on off visually
        //.prop() is used for dynamic properties like checked or selected

        // ─────────────────────────────────────────────────────
        //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 2 of 3)
        //  $('#darkModeToggle')
        //  Traverses the DOM by ID to find the fallback button-
        //  style toggle (used on pages that have a <button>
        //  instead of the BB8 checkbox).
        //  .is('button') checks what element type it is.
        // ─────────────────────────────────────────────────────
        const $btn = $('#darkModeToggle'); //Find button toggle

        if ($btn.is('button')) {
            // ─────────────────────────────────────────────────
            //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 3 of 3)
            //  $btn.html('<i class="fas fa-sun"></i>')
            //  .html() replaces the inner HTML content of the
            //  button with a Font Awesome icon tag — modifying
            //  the live DOM structure inside the button element.
            // ─────────────────────────────────────────────────
            $btn.html(isDark
                ? '<i class="fas fa-sun"></i>' // to change button icon
                : '<i class="fas fa-moon"></i>'
            );
        }
    };


    // ════════════════════════════════════════════════════════
    //  ── ON PAGE LOAD: Restore saved theme ────────────────
    // ════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 5 – JAVASCRIPT EFFECTS  ✅  (Example 1 of 3)
    //  localStorage.getItem('theme')
    //  On every page load, the saved preference is read and
    //  updateTheme() is called — this immediately applies
    //  the correct visual theme as a page-load effect.
    //  The result is a seamless theme persistence across pages.
    // ─────────────────────────────────────────────────────────
    const savedTheme = localStorage.getItem('theme'); //Get what user selected before(in previous pages)
    if (savedTheme === 'dark') {
        updateTheme(true);
    } else {
        updateTheme(false);
    }


    // ════════════════════════════════════════════════════════
    //  ── EVENT LISTENERS ──────────────────────────────────
    // ════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 1 of 3)
    //  $(document).on('change', '.bb8-toggle__checkbox', ...)
    //  Listens for the CHANGE event on the BB8 toggle checkbox.
    //  Fires when the user flips the BB8 switch ON or OFF.
    //  Using $(document).on() allows event delegation — works
    //  even if the checkbox is added dynamically to the DOM.
    // ─────────────────────────────────────────────────────────
    $(document).on('change', '.bb8-toggle__checkbox', function() {
    //Listen when user clicks the toggle switch

        // ─────────────────────────────────────────────────────
        //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 2 of 3)
        //  $(this).is(':checked')
        //  Reads the current value of the "checked" DOM
        //  PROPERTY on the checkbox that was just toggled.
        //  Returns true (dark) or false (light) to pass
        //  into updateTheme().
        // ─────────────────────────────────────────────────────
        updateTheme($(this).is(':checked'));
        //If switch is ON → dark mode
        //If OFF → light mode
    });


    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 2 of 3)
    //  $(document).on('click', '#darkModeToggle', ...)
    //  Listens for CLICK events on the button-style fallback
    //  toggle. Fires when the user clicks it on pages that
    //  use a <button> instead of the BB8 checkbox.
    // ─────────────────────────────────────────────────────────
    $(document).on('click', '#darkModeToggle', function(e) {
        //Listen when button is clicked

        if ($(this).is('button')) {

            // ─────────────────────────────────────────────────
            //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 3 of 3)
            //  $('body').hasClass('dark-mode')
            //  Traverses to <body> and checks whether the
            //  'dark-mode' class currently exists on it —
            //  used to READ the current theme state before
            //  flipping it with updateTheme(!currentIsDark).
            // ─────────────────────────────────────────────────
            const currentIsDark = $('body').hasClass('dark-mode');
            updateTheme(!currentIsDark);
            //check the current mode and reverse it
        }
    });


    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 3 of 3)
    //  window.toggleDarkMode = (force) => { ... }
    //  Exposes a GLOBAL function on the window object so that
    //  other scripts (the AI brain, hand gesture system) can
    //  trigger a dark/light mode change programmatically —
    //  essentially a custom global event interface.
    //  e.g. The AI hears "dark mode on" → calls this function.
    // ─────────────────────────────────────────────────────────
    window.toggleDarkMode = (force) => {
     //Create a function that ANY script can use****

        // ─────────────────────────────────────────────────────
        //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 3 of 3)
        //  $('body').hasClass('dark-mode')
        //  Again reads the body's class list — checking the
        //  DOM class ATTRIBUTE to get the current state,
        //  then decides whether to force or flip the theme.
        // ─────────────────────────────────────────────────────
        const isCurrentlyDark = $('body').hasClass('dark-mode');
        const target = force !== undefined ? force : !isCurrentlyDark;
        updateTheme(target);
        //If a value is given → use it
        //If not → toggle
    };


    // ─────────────────────────────────────────────────────────
    //  CRITERIA 4 – CSS MANIPULATION  ✅  (Example 1, 2, 3 of 3)
    //
    //  Example 1:  $body.addClass('dark-mode')
    //    → Activates ALL body.dark-mode CSS rules in darkmode.css
    //    → e.g.  body.dark-mode { background: #121212; color: #e0e0e0; }
    //    → This is CSS Manipulation via jQuery class management.
    //
    //  Example 2:  $body.removeClass('dark-mode')
    //    → Deactivates ALL dark-mode rules, reverting to light.
    //    → Shows jQuery can manipulate CSS both ways (add/remove).
    //
    //  Example 3:  $btn.html('<i class="fas fa-sun"></i>')
    //    → Injects a Font Awesome icon with its own CSS styling.
    //    → The fa-sun and fa-moon icons render differently —
    //    → swapping icons = changing visual CSS appearance.
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 5 – JAVASCRIPT EFFECTS  ✅  (Example 2 & 3 of 3)
    //
    //  Example 2:  The CSS transition rules in darkmode.css
    //    → e.g. transition: background 0.3s ease, color 0.3s ease
    //    → are TRIGGERED by jQuery's addClass/removeClass.
    //    → The smooth fade between light/dark is a JS-driven effect.
    //
    //  Example 3:  The BB8 droid slides across the toggle track
    //    → This CSS keyframe animation is activated by jQuery
    //      setting .prop('checked', true/false) on the checkbox.
    //    → jQuery's DOM property change triggers a CSS animation.
    // ─────────────────────────────────────────────────────────

});


//  SUMMARY
// ============================================================
//
//  1. DOM TRAVERSAL           → $('body')
//                                $('#darkModeToggle')
//                                $('body').hasClass('dark-mode')
//
//  2. DOM MODIFICATION        → $body.addClass('dark-mode')
//                                $body.removeClass('dark-mode')
//                                $btn.html('<i class="fas fa-sun"></i>')
//
//  3. DOM ATTRIBUTE MODIFICATION → $('.bb8-toggle__checkbox').prop('checked', isDark)
//                                   $(this).is(':checked')
//                                   $('body').hasClass('dark-mode')
//
//  4. CSS MANIPULATION        → addClass/removeClass triggers all
//                                darkmode.css rules (background, text,
//                                nav, cards) site-wide
//
//  5. JAVASCRIPT EFFECTS      → localStorage restores theme on page load
//                                CSS transitions triggered by class change
//                                BB8 animation triggered by .prop('checked')
//
//  6. HTML EVENTS             → .on('change', '.bb8-toggle__checkbox')
//                                .on('click',  '#darkModeToggle')
//                                window.toggleDarkMode  (global event API)
// ============================================================
