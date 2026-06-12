$(document).ready(function() {
    const video = $("#bg-video").get(0);

    // Force autoplay if the browser blocked it initially
    if (video) {
        video.play().catch(error => {
            console.log("Autoplay was prevented. Waiting for user interaction.");
        });
    }

    $("#status-btn").on("click", function() {
        if (!video.paused) {
            $("#status-display").html("<p>The loop is active!</p>");
        } else {
            // If it was paused/blocked, clicking the button starts it
            video.play();
            $("#status-display").html("<p>Video started manually.</p>");
        }
        $("#main-title").css("color", "#ffcc00");
    });
});





// Video Banner About//

$(document).ready(function() {
    const video = $('#banner-video').get(0);
    const $icon = $('#sound-icon');

    // 1. Attempt to play with sound
    video.muted = false; 

    let playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Success! Video is playing with sound automatically.
            $icon.text('🔊');
        }).catch(error => {
            // Browser blocked it. We MUST mute to allow the video to play.
            console.log("Autoplay with sound blocked. Muting to allow play.");
            video.muted = true;
            video.play();
            $icon.text('🔈');
        });
    }

    // 2. Manual toggle for the user
    $('#toggle-sound').on('click', function() {
        video.muted = !video.muted;
        $icon.text(video.muted ? '🔈' : '🔊');
    });
});
