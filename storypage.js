$(document).ready(function() {

    // --- 1. PLAY/PAUSE LOGIC ---
    $('.btn-play-pause').on('click', function() {
        // DOM TRAVERSAL (1) - Finding parents/children
        const $card = $(this).closest('.animal-fact-card');
        const audio = $card.find('.narration-audio')[0];
        const $icon = $(this).find('i');

        // Stop all other audios
        $('audio').not(audio).each(function() {
            this.pause();
            this.currentTime = 0;
            $(this).closest('.animal-fact-card').removeClass('playing-active');
            $(this).closest('.animal-fact-card').find('.btn-play-pause i').removeClass('fa-stop').addClass('fa-play');
        });

        if (audio.paused) {
            // JAVASCRIPT EFFECTS (1) - Native Media Play
            audio.play();
            
            // DOM ATTRIBUTE MODIFICATION (1) - Changing classes
            $icon.removeClass('fa-play').addClass('fa-stop');
            
            // CSS MANIPULATION (1) - Class based styling
            $card.addClass('playing-active'); 
            
            // DOM MODIFICATION (1) - Changing text content
            $card.find('.narration-status').text('Now Playing...');
            
            // DOM ATTRIBUTE MODIFICATION (2) - ARIA Accessibility
            $(this).attr('aria-label', 'Pause Narration');

        } else {
            audio.pause();
            $icon.removeClass('fa-stop').addClass('fa-play');
            $card.removeClass('playing-active');
            
            // DOM MODIFICATION (2) - Changing text content
            $card.find('.narration-status').text('Paused');
            
            $(this).attr('aria-label', 'Play Narration');
        }

        // Handle audio end
        audio.onended = function() {
            $icon.removeClass('fa-stop').addClass('fa-play');
            $card.removeClass('playing-active');
            // DOM MODIFICATION (3) - Resetting status
            $card.find('.narration-status').html('<i>Finished</i>'); 
        };
    });

    // --- 2. REPLAY LOGIC ---
    $('.btn-replay').on('click', function() {
        // DOM TRAVERSAL (2) - Find card from replay button
        const $card = $(this).closest('.animal-fact-card');
        
        // DOM ATTRIBUTE MODIFICATION (3) - Using .attr to log last replay time
        $(this).attr('data-last-replay', new Date().toLocaleTimeString());

        // Reset and Play
        const audio = $card.find('.narration-audio')[0];
        audio.currentTime = 0;
        $card.find('.btn-play-pause').click(); 
        
        // CSS MANIPULATION (2) - Direct property change
        // JAVASCRIPT EFFECTS (2) - Animation
        $card.css('background', '#333').animate({backgroundColor: '#1a1a1a'}, 500);
    });

    // --- 3. EXTRA INTERACTION ---
    $('.animal-fact-card').on('mouseenter', function() {
        // DOM TRAVERSAL (3) - Find siblings
        $(this).siblings().css('opacity', '0.7'); // CSS MANIPULATION (3)
        // JAVASCRIPT EFFECTS (3) - Tooltip show
        $(this).find('.narration-tooltip').fadeIn(200); 
    });

    $('.animal-fact-card').on('mouseleave', function() {
        $(this).siblings().css('opacity', '1');
        $(this).find('.narration-tooltip').fadeOut(200);
    });

});
