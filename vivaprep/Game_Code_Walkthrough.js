// ==============================================================================
// VIVA EXAM WALKTHROUGH: DINO & LIZARD GAMES CRITERIA MAP
// 
// Use this file as your "Cheat Sheet" during the Viva for the Game pages. 
// These are REAL code snippets extracted directly from your `dinogame.js` 
// and `gamefuntion.js` (Lizard) files. 
// ==============================================================================

$(document).ready(function() {

    // ==========================================
    // 1. HTML EVENTS (Triggered in your games)
    // ==========================================
    // FROM: dinogame.js (Line 76)
    // EXPLANATION: Uses event delegation to listen for clicks on any dynamically created animal button.
    $grid.on('click', '.dino-animal-btn', function () {
        const id = $(this).attr('data-id');
    });

    // FROM: gamefuntion.js (Line 251)
    // EXPLANATION: Triggers the procedural lizard generation when the user clicks 'Spawn'.
    $('.btn-spawn').on('click', function() {
        var legNum = Math.floor(1 + Math.random() * 12);
    });

    // FROM: gamefuntion.js (Line 20)
    // EXPLANATION: Tracks the mouse movement constantly to make the lizard follow the cursor.
    $container.on("mousemove", function(event) {
        Input.mouse.x = event.pageX - offset.left;
    });


    // ==========================================
    // 2. JAVASCRIPT EFFECTS (Animations in your games)
    // ==========================================
    // FROM: dinogame.js (Line 121)
    // EXPLANATION: Slides the character selection menu up and out of the way when the game starts.
    $('#dino-selector').slideUp(300, function() {
        startGame();
    });

    .0
    // FROM: gamefuntion.js (Line 252)
    // EXPLANATION: Fades out the spawn menu smoothly once the lizard is generated.
    $(this).parent().fadeOut();


    // ==========================================
    // 3. DOM MODIFICATION (Adding/Removing elements in your games)
    // ==========================================
    // FROM: gamefuntion.js (Line 7)
    // EXPLANATION: Dynamically creates the HTML5 Canvas element and appends it to the lizard chamber.
    const $canvas = $('<canvas></canvas>').appendTo($container);

    // FROM: dinogame.js (Line 150)
    // EXPLANATION: When the game resets, this completely removes all remaining obstacles from the DOM.
    $arena.find('.dino-obstacle').remove();


    // ==========================================
    // 4. CSS MANIPULATION (Styling dynamically in your games)
    // ==========================================
    // FROM: dinogame.js (Line 93)
    // EXPLANATION: Changes the CSS color of the runner to match the color of the selected animal.
    $runner.css('color', selectedAnimal.color);

    // FROM: dinogame.js (Line 100)
    // EXPLANATION: Changes the opacity to 0.8 when the mouse hovers over an unselected animal.
    $(this).css('opacity', '0.8');


    // ==========================================
    // 5. DOM ATTRIBUTE MODIFICATION (Changing properties in your games)
    // ==========================================
    // FROM: dinogame.js (Line 156)
    // EXPLANATION: Disables the start button while the game is currently running so the user can't break it.
    $('#dino-start-btn').prop('disabled', true);

    // FROM: dinogame.js (Line 90)
    // EXPLANATION: Dynamically updates the aria-label attribute for screen readers when the animal changes.
    $runner.attr('aria-label', selectedAnimal.label);


    // ==========================================
    // 6. DOM TRAVERSAL (Finding parent/children/siblings in your games)
    // ==========================================
    // FROM: gamefuntion.js (Line 252)
    // EXPLANATION: Uses .parent() to find the box wrapping the spawn button and fades the whole box out.
    $(this).parent().fadeOut();

    // FROM: dinogame.js (Line 83)
    // EXPLANATION: Uses .siblings() to find all the OTHER animal buttons and remove the 'selected' class from them.
    $(this).siblings('.dino-animal-btn').removeClass('selected');

    // FROM: dinogame.js (Line 64)
    // EXPLANATION: Uses .find() and .first() to locate the very first animal button inside the grid to select it by default.
    const $firstBtn = $grid.find('.dino-animal-btn').first();

});
