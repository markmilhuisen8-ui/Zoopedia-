// ==============================================================================
// VIVA EXAM WALKTHROUGH: TV SCREEN & SEARCH FEATURE CRITERIA MAP
// 
// Use this file as your "Cheat Sheet" during the Viva for the Search/TV pages. 
// These are REAL code snippets extracted directly from your `main.js` 
// and `library.js` files. 
// ==============================================================================

$(document).ready(function() {

    // ==========================================
    // 1. HTML EVENTS (Triggered in your search/TV UI)
    // ==========================================
    // FROM: main.js (Line 53)
    // EXPLANATION: Uses the 'input' event to detect every single keystroke as the user types in the search bar.
    $('#animalSearch').on('input', function() {
        let value = $(this).val().toLowerCase().trim();
    });

    // FROM: main.js (Line 75)
    // EXPLANATION: Triggers a hover event on the TV cards, but only if they are not currently "locked" by the search.
    $(document).on('mouseenter', '.custom-card-tv', function() {
        if (!$(this).hasClass('is-locked')) {
            // Hover logic...
        }
    });


    // ==========================================
    // 2. JAVASCRIPT EFFECTS (Animations in your UI)
    // ==========================================
    // FROM: library.js (Line 24)
    // EXPLANATION: Slowly fades out the entire library grid before re-rendering the searched items.
    $grid.fadeOut(200, function() {
        $grid.empty();
    });

    // FROM: library.js (Line 117)
    // EXPLANATION: Uses .hide() to reset the uploader overlay, then .fadeIn() to smoothly show it on the screen.
    $('#uploader-overlay').css('display', 'flex').hide().fadeIn(300);


    // ==========================================
    // 3. DOM MODIFICATION (Adding/Removing elements in your UI)
    // ==========================================
    // FROM: main.js (Line 42)
    // EXPLANATION: Appends the newly generated HTML code for the TV Card into the main container dynamically.
    container.append(cardHtml);

    // FROM: main.js (Line 8)
    // EXPLANATION: Clears out and entirely removes the old static "Wild Animals" header from the page.
    $("h2:contains('Wild Animals'), h3:contains('Wild Animals')").remove();


    // ==========================================
    // 4. CSS MANIPULATION (Styling dynamically in your UI)
    // ==========================================
    // FROM: main.js (Line 77)
    // EXPLANATION: Directly injects a purple neon glow box-shadow and border using jQuery when the TV card is hovered.
    $(this).css({
        'border': '2px solid #7711a7',
        'box-shadow': '0 0 15px #ce9ee5'
    });

    // FROM: main.js (Line 68)
    // EXPLANATION: When a search fails to match a card, it uses CSS 'pointer-events: none' to make the button unclickable.
    $btn.css('pointer-events', 'none').text('LOCKED');


    // ==========================================
    // 5. DOM ATTRIBUTE MODIFICATION (Changing properties in your UI)
    // ==========================================
    // FROM: main.js (Line 111)
    // EXPLANATION: Replaces the 'src' attribute of the image frame to show the newly selected animal.
    $('.image-frame-prime img').attr('src', selectedAnimal.image).attr('alt', selectedAnimal.animalname);

    // FROM: library.js (Line 75)
    // EXPLANATION: Disables the 'add-url' input box using .prop() if the user chooses to upload a file instead.
    $('#add-url').val('').prop('disabled', true).addClass('opacity-30');


    // ==========================================
    // 6. DOM TRAVERSAL (Finding parent/children/siblings in your UI)
    // ==========================================
    // FROM: main.js (Line 60)
    // EXPLANATION: Searches INSIDE the current animal wrapper element to specifically find its child `.custom-card-tv` div.
    let $card = $(this).find('.custom-card-tv');

    // FROM: main.js (Line 7)
    // EXPLANATION: Uses .next() to find the row immediately following the heading, and deletes it.
    $("h2:contains('Wild Animals'), h3:contains('Wild Animals')").next('.row').remove();

});
