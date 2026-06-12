/*  VAULT GALLERY LOGIC  */



$(document).ready(function() {
    // Clean up existing static elements from previous templates
    $("h2:contains('Wild Animals'), h3:contains('Wild Animals')").next('.row').remove();
    $("h2:contains('Wild Animals'), h3:contains('Wild Animals')").remove();

    // 1. RENDER FUNCTION
    function renderAnimals(data) {
        const container = $('#animalContainer');
        if (container.length === 0) return; // Exit if not on the Vault page

        container.empty();

        if (!data || data.length === 0) {
            container.append('<h3 class="text-center w-100 mt-5 text-success font-monospace">_SIGNAL_LOST: NO_DATA_FOUND</h3>');
            return;
        }

        $.each(data, function(index, animal) {
            let desc = animal.KeyCharacteristics || "Scanning database...";
            let animalId = animal.id || index; 

            let cardHtml = `
                <div class="col-lg-3 col-md-4 col-6 mb-4 animal-wrapper" data-name="${(animal.animalname || "").toLowerCase()}">
                    <div class="custom-card-tv shadow-sm">
                        <div class="image-box" style="position:relative; background:#000; overflow:hidden;">
                            <div class="static-overlay"></div> 
                            <img class="maincardimg" src="${animal.image}" alt="${animal.animalname}" 
                                 style="width:100%; height:200px; object-fit:cover; transition: all 0.3s ease;">
                        </div>
                        <div class="card-body text-center">
                            <h5 class="reveal-on-scroll animal-title">${animal.animalname || "Unknown"}</h5>
                            <p class="small text-muted animal-desc">${desc}</p>
                            <a href="singleanimalpage.html?id=${animal.id}" class="btn btn-sm btn-outline-success w-100">View</a>
                        </div>
                    </div>
                </div>`;
            
            container.append(cardHtml);
        });

        // Re-initialize scroll reveal for new dynamic elements
        initScrollReveal();
    }

    // Initial Load for Gallery
    if (typeof AnimalIndex !== 'undefined') {
        renderAnimals(AnimalIndex);
    }

    // 2. SEARCH LOGIC (TV Static & Lock Effect)
    let searchTimer;
    $(document).on('input', '#animalSearch', function() {
        let value = $(this).val().toLowerCase().trim();
        console.log("Vault Search: Scanning for -> " + value);

        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            let matches = 0;
            $('.animal-wrapper').each(function() {
                let name = $(this).attr('data-name') || "";
                let $card = $(this).find('.custom-card-tv');
                let $btn = $(this).find('a');

                if (value === "" || name.indexOf(value) !== -1) {
                    $(this).css('opacity', '1');
                    $card.removeClass('signal-lost is-locked');
                    $btn.css('pointer-events', 'auto').text('View'); 
                    matches++;
                } else {
                    $(this).css('opacity', '0.4');
                    $card.addClass('signal-lost is-locked');
                    $btn.css('pointer-events', 'none').text('LOCKED'); 
                }
            });
            console.log("Vault Search: Scan complete. Matches: " + matches);
        }, 200); 
    });

    // 3. HOVER EFFECT
    $(document).on('mouseenter', '.custom-card-tv', function() {
        if (!$(this).hasClass('is-locked')) {
            $(this).css({
                'border': '2px solid #7711a7',
                'box-shadow': '0 0 15px #ce9ee5'
            });
        }
    }).on('mouseleave', '.custom-card-tv', function() {
        $(this).css({
            'border': '5px solid #ce9ee5',
            'box-shadow': 'none'
        });
    });
});


/* DETAIL PAGE LOGIC (singleanimalpage.html)*/
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const animalId = urlParams.get('id');

    // Only run this if we have an ID and are on the detail page
    if (animalId && $('.animal-name-prime').length > 0) {
        
        console.log("Vault Accessing ID:", animalId);

        if (typeof AnimalIndex !== 'undefined') {
            // Find animal by ID (converted to Number)
            const selectedAnimal = AnimalIndex.find(animal => animal.id === Number(animalId));

            if (selectedAnimal) {
                // 1. Update Title and Description using CLASSES
                $('.animal-name-prime').text(selectedAnimal.animalname);
                $('.animal-desc-prime').text(selectedAnimal.KeyCharacteristics);

                // 2. Update Image inside the frame class
                $('.image-frame-prime img').attr('src', selectedAnimal.image).attr('alt', selectedAnimal.animalname);

                // 3. Update Specs by finding the <p> containing specific labels
                // This targets the <span> inside the paragraph that mentions the spec
                $('p:contains("SCIENTIFIC_NAME") span').text(selectedAnimal.ScientificName || "N/A");
                $('p:contains("CLASS") span').text(selectedAnimal.Class || "N/A");
                $('p:contains("DIET") span').text(selectedAnimal.Diet || "N/A");
                $('p:contains("LIFESPAN") span').text(selectedAnimal.LifeSpan || "N/A");
                $('p:contains("STATUS") span').text(selectedAnimal.Status || "N/A");

                console.log("Successfully loaded data for:", selectedAnimal.animalname);
            } else {
                renderDetailPageError("ERROR: ACCESS_DENIED - ID NOT FOUND");
            }
        }
    }

    function renderDetailPageError(message) {
        $('.animal-name-prime').text(message).css('color', '#dc3545');
        $('.animal-desc-prime').text("The requested digital file is missing or corrupted within the Zoopedia database.");
    }

    initScrollReveal();
});

/* GLOBAL SCROLL REVEAL LOGIC */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.05 });

    revealElements.forEach(el => revealObserver.observe(el));
};





