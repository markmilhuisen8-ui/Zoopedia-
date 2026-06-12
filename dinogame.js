    /*
    * ZOOPEDIA PRIME — WILD RUNNER (JQUERY CRITERIA EDITION)
    * Designed to meet the 6 strict requirements:
    * 1. DOM Traversal (find, siblings, parent, children)
    * 2. DOM Modification (append, remove, html, text)
    * 3. DOM Attribute Modification (attr, prop, removeAttr)
    * 4. CSS Manipulation (css, addClass, removeClass)
    * 5. JavaScript Effects (fadeIn, fadeOut, slideUp, slideDown)
    * 6. HTML Events (on click, on keydown, hover)
    */

    $(document).ready(function () {

        // ANIMAL ROSTER (Using FontAwesome for perfect UI) 
        const ANIMALS = [
            { id: 'dog',    label: 'Dog',    icon: 'fa-solid fa-dog',    color: '#c8a97f' },
            { id: 'cat',    label: 'Cat',    icon: 'fa-solid fa-cat',    color: '#b0b0b0' },
            { id: 'hippo',  label: 'Hippo',  icon: 'fa-solid fa-hippo',  color: '#8080a0' },
            { id: 'dragon', label: 'Dragon', icon: 'fa-solid fa-dragon', color: '#ff4444' },
            { id: 'spider', label: 'Spider', icon: 'fa-solid fa-spider', color: '#9c27b0' },
            { id: 'frog',   label: 'Frog',   icon: 'fa-solid fa-frog',   color: '#4caf50' }
        ];

        // STATE 
        let gameRunning   = false;
        let animFrame     = null;
        let score         = 0;
        let speed         = 6;
        let lastTime      = 0;
        let obstacleTimer = 0;
        let nextObstacle  = 1200;
        let playerY       = 0;
        let velY          = 0;
        let isJumping     = false;
        let isDead        = false;
        let selectedAnimal = ANIMALS[0];

        const GRAVITY    = 0.6;
        const JUMP_FORCE = -13;
        const FLOOR_H    = 80;

        // ELEMENT REFS 
        const $arena   = $('#dino-arena');
        const $runner  = $('#dino-runner');
        const $score   = $('#dino-score');
        const $overlay = $('#dino-overlay');
        const $grid    = $('#dino-animal-grid');

        // INITIALIZATION & UI SETUP 
        
        // CRITERIA #2: DOM Modification  - Append elements dynamically
        ANIMALS.forEach(a => {
            const $btn = $(`
                <button class="dino-animal-btn" data-id="${a.id}">
                    <i class="${a.icon} dino-animal-icon" style="color: ${a.color};"></i>
                    <span class="dino-animal-name">${a.label}</span>
                </button>
            `);
            $grid.append($btn);
        });


        // CRITERIA #1: DOM Traversal - Using .first() and .find()
        const $firstBtn = $grid.find('.dino-animal-btn').first();
        // CRITERIA #4: CSS Manipulation - Adding class
        $firstBtn.addClass('selected');
        // CRITERIA #3: DOM Attribute Modification - Setting attributes
        $runner.attr('data-current-animal', ANIMALS[0].id);
        // CRITERIA #2: DOM Modification - Modifying inner HTML
        $runner.html(`<i class="${ANIMALS[0].icon}"></i>`);
        $runner.css('color', ANIMALS[0].color);

        //EVENTS
        
        // CRITERIA #6: HTML Events - Click delegation on dynamically added buttons
        $grid.on('click', '.dino-animal-btn', function () {
            if (gameRunning) return;

            const id = $(this).attr('data-id');
            selectedAnimal = ANIMALS.find(a => a.id === id);

            // CRITERIA #1: DOM Traversal  - Using .siblings()
            $(this).siblings('.dino-animal-btn').removeClass('selected');
            // CRITERIA #4: CSS Manipulation - Removing and Adding classes
            $(this).addClass('selected');

            // CRITERIA #5: JavaScript Effects - fadeOut & fadeIn effect
            $runner.fadeOut(150, function() {
                // CRITERIA #3: DOM Attribute Modification  - Changing attr on the fly
                $runner.attr('aria-label', selectedAnimal.label);
                $runner.html(`<i class="${selectedAnimal.icon}"></i>`);
                // CRITERIA #4: CSS Manipulation  - Changing direct CSS properties
                $runner.css('color', selectedAnimal.color);
                $runner.fadeIn(150);
            });
        });

        // CRITERIA #6: HTML Events - Hover effects using mouseenter/mouseleave
        $grid.on('mouseenter', '.dino-animal-btn', function() {
            if(!$(this).hasClass('selected')) $(this).css('opacity', '0.8');
        }).on('mouseleave', '.dino-animal-btn', function() {
            $(this).css('opacity', '1');
        });

        // CRITERIA #6: HTML Events - Global Keydown Event
        $(document).on('keydown.dino', function (e) {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && gameRunning) {
                e.preventDefault();
                jump();
            }
        });

        // Jump on click inside arena
        $arena.on('click', function () {
            if (gameRunning) jump();
        });

        // Start Buttons
        $('#dino-start-btn').on('click', function() {
            // CRITERIA #5: JavaScript Effects - slideUp the selector when game starts
            $('#dino-selector').slideUp(300, function() {
                startGame();
            });
        });

        $('#dino-restart-btn').on('click', function () {
            // CRITERIA #5: JavaScript Effect - fadeOut game over screen
            $('#dino-gameover').fadeOut(200, function() {
                startGame();
            });
        });

        // GAME LIFECYCLE

        function startGame() {
            score         = 0;
            speed         = 6;
            lastTime      = 0;
            obstacleTimer = 0;
            nextObstacle  = 1200;
            playerY       = 0;
            velY          = 0;
            isJumping     = false;
            isDead        = false;

            $score.text('0');
            
            // CRITERIA #1: DOM Traversal - finding children inside the arena
            // CRITERIA #2: DOM Modification - Completely remove elements from DOM
            $arena.find('.dino-obstacle').remove();

            $runner.removeClass('dino-dead');
            $runner.css('bottom', FLOOR_H + 'px');
            
            // CRITERIA #3: DOM Attribute Modification - Disabling start buttons during play
            $('#dino-start-btn').prop('disabled', true);

            $overlay.fadeOut(250);
            
            if (animFrame) cancelAnimationFrame(animFrame);
            gameRunning = true;
            animFrame = requestAnimationFrame(gameLoop);
        }

        function jump() {
            if (!isJumping) {
                velY = JUMP_FORCE;
                isJumping = true;
            }
        }

        // MAIN LOOP
        function gameLoop(ts) {
            if (!gameRunning) return;
            const dt = lastTime ? Math.min(ts - lastTime, 50) : 16;
            lastTime = ts;

            // Score + speed ramp
            score += dt * 0.01;
            speed = 6 + score * 0.012;
            $score.text(Math.floor(score));

            //  game Physics
            velY  += GRAVITY;
            playerY -= velY;
            if (playerY <= 0) { playerY = 0; velY = 0; isJumping = false; }
            $runner.css('bottom', (FLOOR_H + playerY) + 'px');

            // Obstacles
            obstacleTimer += dt;
            if (obstacleTimer >= nextObstacle) {
                spawnObstacle();
                obstacleTimer = 0;
                nextObstacle  = 800 + Math.random() * 800; // faster spawns
            }
            moveObstacles(dt);

            // Collision Check
            if (checkCollision()) {
                endGame();
                return;
            }

            animFrame = requestAnimationFrame(gameLoop);
        }

        // OBSTACLES (Using FontAwesome)
        const OBSTACLE_TYPES = [
            { icon: 'fa-solid fa-tree',       w: 40, h: 50, color: '#4caf50' },
            { icon: 'fa-solid fa-mountain',   w: 50, h: 45, color: '#9e9e9e' },
            { icon: 'fa-solid fa-crow',       w: 45, h: 35, color: '#555', flying: true },
            { icon: 'fa-solid fa-bug',        w: 30, h: 25, color: '#ff9800' },
            { icon: 'fa-solid fa-skull',      w: 35, h: 40, color: '#eeeeee' }
        ];

        function spawnObstacle() {
            const type   = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
            const bottom = type.flying ? FLOOR_H + 65 : FLOOR_H;
            
            // Dynamic obstacle creation
            const $obs = $(`
                <div class="dino-obstacle">
                    <i class="${type.icon}" style="color: ${type.color}"></i>
                </div>
            `).css({
                right:  '-60px',
                bottom: bottom + 'px',
                width:  type.w + 'px',
                height: type.h + 'px',
                fontSize: (type.h * 0.8) + 'px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }).data('w', type.w).data('h', type.h);

            $arena.append($obs);
        }

        function moveObstacles(dt) {
            $('.dino-obstacle').each(function () {
                const $o  = $(this);
                const cur = parseInt($o.css('right')) || 0;
                const nxt = cur + speed * (dt / 16);
                $o.css('right', nxt + 'px');
                if (nxt > $arena.width() + 100) $o.remove();
            });
        }

        //COLLISION system
        function checkCollision() {
            const rRect = $runner[0].getBoundingClientRect();
            let hit = false;
            $('.dino-obstacle').each(function () {
                const oRect = this.getBoundingClientRect();
                const marginX = 15; // hitbox leniency on sides
                const marginY = 10; // hitbox leniency on top/bottom
                
                if (
                    rRect.left + marginX < oRect.right - marginX &&
                    rRect.right - marginX > oRect.left + marginX &&
                    rRect.top + marginY < oRect.bottom - marginY &&
                    rRect.bottom - marginY > oRect.top + marginY
                ) { 
                    hit = true; 
                    return false; // breaks jQuery each loop
                }
            });
            return hit;
        }

        // GAME OVER
        function endGame() {
            gameRunning = false;
            cancelAnimationFrame(animFrame);
            $runner.addClass('dino-dead');
            isDead = true;

            // Mr Bean Popup Trigger using Effects and DOM updates
            setTimeout(function () {
                $('#dino-final-score').text(Math.floor(score));
                $('#dino-gameover').fadeIn(400); // Effect
                $('#dino-selector').slideDown(400); // Bring back selector
                $('#dino-start-btn').removeAttr('disabled'); // DOM Attribute mod
            }, 400);
        }
    });
