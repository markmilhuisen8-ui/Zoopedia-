$(document).ready(function () {

    // ─── 1. LIVE EMAIL VALIDATION ────────────────────────────────────────────
    //
    //  3 states:
    //    ✔  Green  – fully valid  (user@domain.com)
    //    ⚠  Yellow – has @ but incomplete  (user@...)
    //    ✖  Red    – no @ at all
    //    (blank)   – hide everything, reset border

    $('#email-input').on('input', function () {
        const val        = $(this).val();
        const hasAt      = val.includes('@');
        const isValid    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

        const $tick  = $('#tick-icon');
        const $cross = $('#cross-icon');

        if (val === '') {
            // ── EMPTY: reset everything
            $tick.hide();
            $cross.hide();
            $(this).css('border-color', '#ced4da');

        } else if (isValid) {
            // ── FULLY VALID → green tick ✔
            $cross.hide();
            $tick.fadeIn(250).css('color', '#28a745');
            $(this).css('border-color', '#28a745');

        } else if (hasAt) {
            // ── HAS @ BUT INCOMPLETE → yellow warning ✖ (amber)
            $tick.hide();
            $cross.fadeIn(250).attr('style', 'color: #ffc107 !important; display: inline-block;');
            $(this).css('border-color', '#ffc107');

        } else {
            // ── NO @ AT ALL → red cross ✖
            $tick.hide();
            $cross.fadeIn(250).attr('style', 'color: #dc3545 !important; display: inline-block;');
            $(this).css('border-color', '#dc3545');
        }
    });


    // ─── 2. SUBMIT BUTTON → popup modal logic ───────────────────────────────
    $('#submit-btn').on('click', function (e) {
        e.preventDefault();  // stop page refresh

        const emailVal = $('#email-input').val().trim();

        if (emailVal === '') return;   // do nothing if field is empty

        // Show blurred overlay
        $('#modal-container').css('display', 'flex').hide().fadeIn(300);

        if ($('#tick-icon').is(':visible')) {
            // Valid email → success popup
            $('#success-box').show();
            $('#error-box').hide();
        } else {
            // Invalid / incomplete → error popup
            $('#error-box').show();
            $('#success-box').hide();
        }
    });


    // ─── 3. CLOSE MODAL ─────────────────────────────────────────────────────
    $('.close-btn').on('click', function () {
        $('#modal-container').fadeOut(300);
    });

});
