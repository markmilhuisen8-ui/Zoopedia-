// ==============================================================================
// VIVA EXAM WALKTHROUGH: ZOOPEDIA REAL CODE CRITERIA MAP
// 
// Use this file as your "Cheat Sheet" during the Viva. 
// These are REAL code snippets extracted directly from your `handtracking.js` 
// and `NomadAi.js` files. 
// ==============================================================================

$(document).ready(function() {

    // ==========================================
    // 1. HTML EVENTS (Triggered in your code)
    // ==========================================
    // FROM: handtracking.js (Line 293)
    // EXPLANATION: This triggers the camera when the user clicks 'Agree' on the modal.
    $('#btn-agree-hand').on('click', function () {
        localStorage.setItem('handTrackingEnabled', 'true');
        $overlay.fadeOut(300);
        startTracking();
    });

    // FROM: NomadAi.js (Line 303)
    // EXPLANATION: This triggers when the user flips the toggle switch to change the AI Persona.
    $('#persona-toggle').on('change', function() {
        currentPersona = $(this).is(':checked') ? "sussi" : "alex";
        localStorage.setItem('activePersona', currentPersona); 
    });


    // ==========================================
    // 2. JAVASCRIPT EFFECTS (Animations in your code)
    // ==========================================
    // FROM: handtracking.js (Line 310)
    // EXPLANATION: Slowly fades in the camera permission overlay.
    setTimeout(() => $overlay.fadeIn(400), 1200);

    // FROM: NomadAi.js (Line 208)
    // EXPLANATION: Fades in the caption bar when the AI hears you speak.
    $('#normad-caption-bar').text(`${currentPersona.toUpperCase()}: "${displayQuery}"`).fadeIn();


    // ==========================================
    // 3. DOM MODIFICATION (Adding/Removing elements in your code)
    // ==========================================
    // FROM: handtracking.js (Line 23)
    // EXPLANATION: Physically injects the Magic Hand cursor HTML into the body.
    const $cursor = $('<div id="zp-cursor"></div>');
    $('body').append($cursor);

    // FROM: handtracking.js (Line 187 & 189)
    // EXPLANATION: Appends a click ripple effect to the screen, then removes it after 600ms.
    const $ripple = $('<div class="zp-click-ripple"></div>').css({ left: x + 'px', top: y + 'px' });
    $('body').append($ripple);
    setTimeout(() => $ripple.remove(), 600);


    // ==========================================
    // 4. CSS MANIPULATION (Styling dynamically in your code)
    // ==========================================
    // FROM: handtracking.js (Line 8)
    // EXPLANATION: Uses jQuery to apply all the complex CSS styling to the hand cursor directly.
    $cursor.css({
        position:      'fixed',
        top:           '0',
        left:          '0',
        width:         '22px',
        height:        '28px',
        background:    'white',
        pointerEvents: 'none'
    });

    // FROM: handtracking.js (Line 240)
    // EXPLANATION: Changes the text color and border color of the notification popup.
    $note.text(text).css({ color: color, borderColor: color }).stop(true).fadeIn(200);


    // ==========================================
    // 5. DOM ATTRIBUTE MODIFICATION (Changing properties in your code)
    // ==========================================
    // FROM: NomadAi.js (Line 18)
    // EXPLANATION: Changes the 'checked' property of the checkbox to true if the persona is Sussi.
    if (currentPersona === "sussi") {
        $('#persona-toggle').prop('checked', true);
    }

    // FROM: handtracking.js (Line 222)
    // EXPLANATION: Gets the 'href' attribute (the URL) of the link the hand cursor just clicked.
    const href = $link.attr('href');


    // ==========================================
    // 6. DOM TRAVERSAL (Finding parent/children in your code)
    // ==========================================
    // FROM: handtracking.js (Line 192)
    // EXPLANATION: Uses .closest() to traverse up the HTML tree to check if the user clicked the AI control panel.
    if ($el.closest('#normad-container, #ai-stop-btn, .persona-switch-horizontal').length > 0) {
        showNotification('Use physical click for AI controls 🛡️', '#ff9900');
        return;
    }

    // FROM: handtracking.js (Line 220)
    // EXPLANATION: Uses .is() and .closest() to find out if the clicked element is a link tag (<a>) or inside one.
    const $link = $el.is('a') ? $el : $el.closest('a');

});
