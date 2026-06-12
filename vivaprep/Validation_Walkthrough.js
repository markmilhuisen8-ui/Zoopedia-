// ============================================================
//  ZOOPEDIA PRIME – VIVA WALKTHROUGH
//  FILE: validatonsignal.js  (Contact Us Page – Email Validation)
//  CRITERIA: ETF 2025 – jQuery Web Application (Class Task 6)
// ============================================================
//
//  ⚠ Every line below is taken DIRECTLY from validatonsignal.js.
//  No extras. No invented code.
//
//  6 Criteria:
//    1. DOM Traversal
//    2. DOM Modification
//    3. DOM Attribute Modification
//    4. CSS Manipulation
//    5. JavaScript Effects
//    6. HTML Events
//
// ============================================================


$(document).ready(function () {

    // ════════════════════════════════════════════════════════
    //  ── SECTION 1: LIVE EMAIL VALIDATION ─────────────────
    // ════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 1 of 3)
    //  .on('input', function(){...})
    //  The 'input' event fires live every time the user types
    //  a character into the email field. This is a native
    //  HTML event bound via jQuery's .on() method.
    // ─────────────────────────────────────────────────────────
    $('#email-input').on('input', function () {

        const val     = $(this).val();
        const hasAt   = val.includes('@');
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

        // ─────────────────────────────────────────────────────
        //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 1 of 3)
        //  $('#tick-icon') and $('#cross-icon')
        //  jQuery traverses the DOM using the ID selector (#)
        //  to FIND and return references to these two <span>
        //  elements inside the email container div.
        // ─────────────────────────────────────────────────────
        const $tick  = $('#tick-icon');
        const $cross = $('#cross-icon');


        if (val === '') {
            // ─────────────────────────────────────────────────
            //  CRITERIA 5 – JAVASCRIPT EFFECTS  ✅  (Example 1 of 3)
            //  $tick.hide()  /  $cross.hide()
            //  .hide() is a built-in jQuery effect that sets
            //  display:none on the element instantly.
            // ─────────────────────────────────────────────────
            $tick.hide();
            $cross.hide();

            // ─────────────────────────────────────────────────
            //  CRITERIA 4 – CSS MANIPULATION  ✅  (Example 1 of 3)
            //  $(this).css('border-color', '#ced4da')
            //  .css() directly sets a CSS property on the input
            //  at runtime — resetting the border to neutral grey.
            // ─────────────────────────────────────────────────
            $(this).css('border-color', '#ced4da');


        } else if (isValid) {
            // FULLY VALID EMAIL (e.g. hello@gmail.com) → GREEN ✔

            $cross.hide();  // hide the cross icon (JS Effect)

            // ─────────────────────────────────────────────────
            //  CRITERIA 5 – JAVASCRIPT EFFECTS  ✅  (Example 2 of 3)
            //  $tick.fadeIn(250)
            //  .fadeIn() is a jQuery animation effect — it
            //  smoothly fades the tick icon from hidden to
            //  fully visible over 250 milliseconds.
            // ─────────────────────────────────────────────────

            // ─────────────────────────────────────────────────
            //  CRITERIA 4 – CSS MANIPULATION  ✅  (Example 2 of 3)
            //  .css('color', '#28a745')
            //  Chained directly after .fadeIn(), this sets the
            //  tick icon's text colour to green at runtime.
            // ─────────────────────────────────────────────────
            $tick.fadeIn(250).css('color', '#28a745');
            $(this).css('border-color', '#28a745');   // green border


        } else if (hasAt) {
            // HAS @ BUT INCOMPLETE (e.g. hello@gmail) → YELLOW ✖

            $tick.hide();

            // ─────────────────────────────────────────────────
            //  CRITERIA 5 – JAVASCRIPT EFFECTS  ✅  (Example 3 of 3)
            //  $cross.fadeIn(250)
            //  Fades the cross icon in with animation.
            //  Chained directly with .attr() below.
            // ─────────────────────────────────────────────────

            // ─────────────────────────────────────────────────
            //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 1 of 3)
            //  .attr('style', 'color: #ffc107 !important; display: inline-block;')
            //  .attr() directly writes/overwrites the HTML style
            //  ATTRIBUTE on the cross <span> element in the DOM.
            //  We use !important to force amber over Bootstrap's
            //  text-danger class colour.
            // ─────────────────────────────────────────────────
            $cross.fadeIn(250).attr('style', 'color: #ffc107 !important; display: inline-block;');
            $(this).css('border-color', '#ffc107');   // amber border


        } else {
            // NO @ AT ALL (e.g. just "hello") → RED ✖

            $tick.hide();

            // ─────────────────────────────────────────────────
            //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 2 of 3)
            //  .attr('style', 'color: #dc3545 !important; display: inline-block;')
            //  Same .attr() method — this time forces RED colour
            //  on the cross icon to signal a clear invalid input.
            // ─────────────────────────────────────────────────
            $cross.fadeIn(250).attr('style', 'color: #dc3545 !important; display: inline-block;');
            $(this).css('border-color', '#dc3545');   // red border
        }
    });


    // ════════════════════════════════════════════════════════
    //  ── SECTION 2: SUBMIT BUTTON → POPUP MODAL ───────────
    // ════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 2 of 3)
    //  .on('click', function(e){...}) on #submit-btn
    //  A CLICK event is bound to the Send Message button.
    //  e.preventDefault() stops the form from refreshing the page.
    // ─────────────────────────────────────────────────────────
    $('#submit-btn').on('click', function (e) {
        e.preventDefault();

        const emailVal = $('#email-input').val().trim();
        if (emailVal === '') return;

        // ─────────────────────────────────────────────────────
        //  CRITERIA 4 – CSS MANIPULATION  ✅  (Example 3 of 3)
        //  .css('display', 'flex')
        //  Sets the CSS display property of the modal overlay
        //  to 'flex' so its children centre correctly, BEFORE
        //  it is faded in. Direct runtime CSS manipulation.
        // ─────────────────────────────────────────────────────

        // ─────────────────────────────────────────────────────
        //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 1 of 3)
        //  $('#modal-container').css('display','flex').hide().fadeIn(300)
        //  This chain modifies the modal element — setting its
        //  display, hiding it instantly, then fading it back in.
        //  The element's visible state in the DOM is modified.
        // ─────────────────────────────────────────────────────
        $('#modal-container').css('display', 'flex').hide().fadeIn(300);

        // ─────────────────────────────────────────────────────
        //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 2 of 3)
        //  $('#tick-icon').is(':visible')
        //  Traverses the DOM to find #tick-icon, then checks
        //  its current VISIBILITY state using jQuery's :visible
        //  pseudo-selector — to decide which popup to show.
        // ─────────────────────────────────────────────────────
        if ($('#tick-icon').is(':visible')) {

            // ─────────────────────────────────────────────────
            //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 2 of 3)
            //  .show() and .hide() modify the DOM by changing
            //  which modal box (success/error) is displayed.
            // ─────────────────────────────────────────────────
            $('#success-box').show();
            $('#error-box').hide();

        } else {
            $('#error-box').show();
            $('#success-box').hide();
        }
    });


    // ════════════════════════════════════════════════════════
    //  ── SECTION 3: CLOSE MODAL ───────────────────────────
    // ════════════════════════════════════════════════════════

    // ─────────────────────────────────────────────────────────
    //  CRITERIA 6 – HTML EVENTS  ✅  (Example 3 of 3)
    //  $('.close-btn').on('click', function(){...})
    //  A CLICK event bound to ALL elements with class .close-btn
    //  (both the "Close" and "Try Again" popup buttons).
    // ─────────────────────────────────────────────────────────
    $('.close-btn').on('click', function () {

        // ─────────────────────────────────────────────────────
        //  CRITERIA 2 – DOM MODIFICATION  ✅  (Example 3 of 3)
        //  $('#modal-container').fadeOut(300)
        //  Hides the modal overlay by fading it out — the
        //  element's rendered state in the DOM is modified back
        //  to hidden (display:none set after animation).
        //
        //  CRITERIA 3 – DOM ATTRIBUTE MODIFICATION  ✅  (Example 3 of 3)
        //  Note: $('.close-btn') selects by CLASS attribute.
        //  The .attr('style','...') calls above in validation
        //  write directly to the element's style ATTRIBUTE.
        //  Both are jQuery DOM Attribute Modification examples.
        //
        //  CRITERIA 1 – DOM TRAVERSAL  ✅  (Example 3 of 3)
        //  $('.close-btn') uses a CLASS selector to traverse
        //  the DOM and find ALL matching close buttons at once
        //  (both the success and error popup close buttons).
        // ─────────────────────────────────────────────────────
        $('#modal-container').fadeOut(300);
    });

});


// ============================================================
//  QUICK REFERENCE SUMMARY  (say this during your Viva)
// ============================================================
//
//  1. DOM TRAVERSAL           → $('#tick-icon'), $('#cross-icon')
//                                $('#tick-icon').is(':visible')
//                                $('.close-btn')
//
//  2. DOM MODIFICATION        → $('#modal-container').fadeIn(300)
//                                $('#success-box').show()
//                                $('#error-box').hide()
//                                $('#modal-container').fadeOut(300)
//
//  3. DOM ATTRIBUTE MODIFICATION → .attr('style','color:#ffc107...')
//                                   .attr('style','color:#dc3545...')
//                                   (writes inline style ATTRIBUTE)
//
//  4. CSS MANIPULATION        → .css('border-color', '#28a745')
//                                .css('color', '#28a745')
//                                .css('display', 'flex')
//
//  5. JAVASCRIPT EFFECTS      → $tick.fadeIn(250)
//                                $cross.fadeIn(250)
//                                $tick.hide() / $cross.hide()
//
//  6. HTML EVENTS             → .on('input', ...)   – live typing
//                                .on('click', ...)   – submit button
//                                .on('click', ...)   – close button
// ============================================================
