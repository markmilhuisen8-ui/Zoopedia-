// ============================================================
//  ZOOPEDIA PRIME – VIVA WALKTHROUGH
//  FILE: storypage.js  (Story Page – Narration System)
//  CRITERIA: ETF 2025 – jQuery Web Application (Class Task 6)
// ============================================================

$(document).ready(function() {

    // 1. DOM TRAVERSAL (Finding elements relative to each other)
    // --------------------------------------------------------
    // Example A: $(this).closest('.animal-fact-card')  -> Goes UP to find the parent card.
    // Example B: $card.find('.narration-audio')        -> Goes DOWN to find the audio element.
    // Example C: $(this).siblings()                    -> Finds OTHER cards at the same level.

    // 2. DOM MODIFICATION (Changing content/structure)
    // --------------------------------------------------------
    // Example A: .text('Now Playing...')               -> Replaces the text inside the status span.
    // Example B: .text('Paused')                       -> Updates status when stopped.
    // Example C: .html('<i>Finished</i>')              -> Injects HTML tags into the status bar.

    // 3. DOM ATTRIBUTE MODIFICATION (Managing attributes)
    // --------------------------------------------------------
    // Example A: .addClass('fa-stop') / .removeClass() -> Modifies the "class" attribute.
    // Example B: .attr('aria-label', 'Pause...')       -> Modifies accessibility attributes for screen readers.
    // Example C: .attr('data-last-replay', time)       -> Stores custom data values on the button.

    // 4. CSS MANIPULATION (Changing styles)
    // --------------------------------------------------------
    // Example A: .addClass('playing-active')           -> Applies highlighting CSS from the stylesheet.ex
    // Example B: .css('background', '#333')            -> Directly sets the background color.
    // Example C: .css('opacity', '0.7')                -> Dims other cards on hover.

    // 5. JAVASCRIPT EFFECTS (Animations and Media)
    // --------------------------------------------------------
    // Example A: audio.play() / audio.pause()          -> JavaScript-driven media playback effects.
    // Example B: .animate({backgroundColor:...}, 500)  -> Smooth color transition (animation).
    // Example C: .fadeIn(200) / .fadeOut(200)          -> Smooth transparency transitions for tooltips.

    // 6. HTML EVENTS (User interactions)
    // --------------------------------------------------------
    // Example A: $(document).ready(...)                -> Fires when the page is fully loaded.
    // Example B: .on('click', ...)                     -> Fires when buttons are clicked.
    // Example C: .on('mouseenter', ...)                -> Fires when the mouse moves over a card.

});
