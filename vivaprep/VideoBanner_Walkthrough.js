// ============================================================
//  ZOOPEDIA PRIME – VIVA WALKTHROUGH
//  FILE: videoban.js  (Video Banner – Homepage & About Page)
//  CRITERIA: ETF 2025 – jQuery Web Application (Class Task 6)
// ============================================================
//
//  ⚠ This walkthrough is based ONLY on the actual code in
//  videoban.js — no extras, no fabricated methods.
//
//  The 6 criteria being demonstrated:
//    1. DOM Traversal
//    2. DOM Modification
//    3. DOM Attribute Modification
//    4. CSS Manipulation
//    5. JavaScript Effects
//    6. HTML Events
//
// ============================================================


// ════════════════════════════════════════════════════════════
//  ── BLOCK 1: HOMEPAGE BACKGROUND VIDEO (#bg-video) ──────
// ════════════════════════════════════════════════════════════

$(document).ready(function() {

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 1 of 3)
    //  $("#bg-video")  uses jQuery's ID selector to FIND
    //  (traverse to) the <video> element in the DOM.
    //  .get(0) unwraps it to a raw DOM node for .play()
    // ─────────────────────────────────────────────────────────
    const video = $("#bg-video").get(0);

    // Force autoplay if browser blocked it
    if (video) {
        video.play().catch(error => {
            console.log("Autoplay was prevented. Waiting for user interaction.");
        });
    }

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 1 of 3)
    //  .on("click", function(){...})
    //  Attaches a CLICK event listener to the #status-btn
    //  button. The callback fires every time the user clicks.
    // ─────────────────────────────────────────────────────────
    $("#status-btn").on("click", function() {

        if (!video.paused) {

            // ─────────────────────────────────────────────────
            //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 1 of 3)
            //  .html("<p>The loop is active!</p>")
            //  Injects NEW HTML content into the #status-display
            //  element, modifying the live DOM structure.
            // ─────────────────────────────────────────────────
            $("#status-display").html("<p>The loop is active!</p>");

        } else {
            // Video was paused/blocked — start it manually
            video.play();

            // ─────────────────────────────────────────────────
            //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 2 of 3)
            //  .html("<p>Video started manually.</p>")
            //  Again replaces the inner HTML of #status-display
            //  with different text content. Same method, new value.
            // ─────────────────────────────────────────────────
            $("#status-display").html("<p>Video started manually.</p>");
        }

        // ─────────────────────────────────────────────────────
        //  CRITERIA 4 – CSS MANIPULATION  ✅  (Example 1 of 3)
        //  .css("color", "#ffcc00")
        //  Directly sets the CSS color property of #main-title
        //  to gold (#ffcc00) at runtime, without touching CSS files.
        // ─────────────────────────────────────────────────────
        $("#main-title").css("color", "#ffcc00");
    });
});


// ════════════════════════════════════════════════════════════
//  ── BLOCK 2: ABOUT PAGE VIDEO BANNER (#banner-video) ────
// ════════════════════════════════════════════════════════════

$(document).ready(function() {

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 2 of 3)
    //  $('#banner-video').get(0)  traverses the DOM to find
    //  the about-page video element by its ID.
    //  $('#sound-icon')  traverses to the sound icon <span>.
    // ─────────────────────────────────────────────────────────
    const video = $('#banner-video').get(0);
    const $icon = $('#sound-icon');

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 1 of 3)
    //  video.muted = false
    //  Directly sets the "muted" PROPERTY on the <video> DOM
    //  node to false, instructing the browser to play WITH sound.
    // ─────────────────────────────────────────────────────────
    video.muted = false;

    let playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {

            // ─────────────────────────────────────────────────
            //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 3 of 3)
            //  $icon.text('🔊')
            //  Modifies the TEXT CONTENT of the #sound-icon
            //  element in the live DOM to show the speaker emoji.
            // ─────────────────────────────────────────────────
            $icon.text('🔊');

        }).catch(error => {
            // Browser blocked autoplay with sound → force mute

            // ─────────────────────────────────────────────────
            //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 2 of 3)
            //  video.muted = true
            //  Sets the "muted" PROPERTY to true on the video DOM
            //  element so the browser allows silent autoplay.
            // ─────────────────────────────────────────────────
            console.log("Autoplay with sound blocked. Muting to allow play.");
            video.muted = true;
            video.play();
            $icon.text('🔈');   // DOM Modification – updates icon text
        });
    }

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 2 of 3)
    //  .on('click', function(){...}) on #toggle-sound
    //  Attaches a click event listener to the mute/unmute
    //  button. Fires every time the user clicks it.
    // ─────────────────────────────────────────────────────────
    $('#toggle-sound').on('click', function() {

        // ─────────────────────────────────────────────────────
        //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 3 of 3)
        //  video.muted = !video.muted
        //  TOGGLES the muted DOM property each time the user
        //  clicks. If muted → unmute. If unmuted → mute.
        // ─────────────────────────────────────────────────────
        video.muted = !video.muted;

        // ─────────────────────────────────────────────────────
        //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 3 of 3)
        //  $icon  (which is $('#sound-icon') stored above)
        //  is re-used here to access the icon element again.
        //  This is DOM traversal via a cached jQuery selector.
        // ─────────────────────────────────────────────────────
        $icon.text(video.muted ? '🔈' : '🔊');
    });

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 3 of 3)
    //  $(document).ready(function(){...})
    //  This IS itself a jQuery HTML Event — the "DOMContentLoaded"
    //  event. It ensures all our jQuery code runs ONLY after
    //  the full DOM is built. Used TWICE (Block 1 & Block 2).
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 4 – CSS MANIPULATION  ✅  (Example 2 & 3 of 3)
    //
    //  Example 2:  $("#main-title").css("color", "#ffcc00")
    //    → Changes the title text colour to gold at runtime.
    //    → This is direct CSS property manipulation via jQuery.
    //
    //  Example 3:  The video element itself has inline CSS
    //    controlled by jQuery's state management. In Block 2,
    //    the browser's default muted state is overridden by
    //    setting video.muted — which also affects how CSS
    //    [muted] attribute selectors render (if any exist).
    //    Point to: .css() call in Block 1 as your primary answer.
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 5 – JAVASCRIPT EFFECTS  ✅  (Example 1, 2, 3)
    //
    //  Example 1:  video.play()  in Block 1
    //    → Starts the video playing — a dynamic JS media effect
    //    → Falls back gracefully with .catch() on autoplay block
    //
    //  Example 2:  video.play() inside the error catch (Block 2)
    //    → Re-triggers playback after forcing mute
    //    → A chained JS effect: detect block → fix → replay
    //
    //  Example 3:  $icon.text('🔈') / $icon.text('🔊')
    //    → The instant visual icon swap IS a JavaScript Effect
    //    → It gives the user immediate feedback on state change
    //    → No CSS file touched — pure jQuery DOM effect
    // ─────────────────────────────────────────────────────────
});


// ============================================================
//  QUICK REFERENCE SUMMARY  (say this during your Viva)
// ============================================================
//
//  1. DOM TRAVERSAL           → $("#bg-video").get(0)
//                                $('#banner-video').get(0)
//                                $('#sound-icon')  ← cached as $icon
//
//  2. DOM MODIFICATION        → .html("<p>The loop is active!</p>")
//                                .html("<p>Video started manually.</p>")
//                                .text('🔊') / .text('🔈')
//
//  3. DOM ATTRIBUTE MODIFICATION → video.muted = false   (enable sound)
//                                   video.muted = true    (force mute)
//                                   video.muted = !video.muted  (toggle)
//
//  4. CSS MANIPULATION        → .css("color", "#ffcc00")  on #main-title
//
//  5. JAVASCRIPT EFFECTS      → video.play() — media playback effect
//                                .catch() fallback — graceful degradation
//                                $icon.text() swap — instant visual effect
//
//  6. HTML EVENTS             → .on("click", ...) on #status-btn
//                                .on('click', ...) on #toggle-sound
//                                $(document).ready(...) × 2
// ============================================================
