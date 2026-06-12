// ALEX BRAIN - Local AI Engine (Ollama / Phi-3)
// 100% Private. 100% Offline. Zero API Dependency.
const AlexBrain = {

    greetings: [
        "Hello Sir, I am Alex. Local neural paths are active.",
        "At your service, Sir. My local hardware is standing by.",
        "Online and ready. Site systems synchronized locally."
    ],

    intents: [
        { page: "index.html", tokens: ["home", "main", "start", "index", "first", "welcome"] },
        { page: "gamepage.html", tokens: ["game", "games", "play", "fun", "gaming", "arcade", "entertainment"] },
        { page: "wildlife.html", tokens: ["wild", "wildlife", "jungle", "forest", "nature", "safari", "environment"] },
        { page: "dommestic.html", tokens: ["domestic", "pet", "pets", "home animal", "tame", "house", "guinea"] },
        { page: "Crawler.html", tokens: ["reptile", "reptiles", "crawler", "crawl", "lizard", "creep", "snake"] },
        { page: "WildlifeVault.html", tokens: ["vault", "all", "database", "list", "details", "collection", "archive", "data", "library", "digital library"] },
        { page: "about.html", tokens: ["about", "feed", "news", "info", "information", "update", "blog"] },
        { page: "story.html", tokens: ["story", "stories", "tale", "tales", "read", "narrative", "book", "read a story"] },
        { page: "contact.html", tokens: ["contact", "call", "message", "reach", "help", "support", "support center"] },
        { page: "action:set-dark", tokens: ["dark mode", "night mode", "darken", "black mode", "night", "dark", "dark theme"] },
        { page: "action:set-light", tokens: ["light mode", "day mode", "brighten", "white mode", "day", "light", "light theme"] },
        { page: "action:stop", tokens: ["stop", "shutup", "shut up", "stand down", "be quiet", "cancel", "enough", "quit"] }
    ],

    findIntent: function(query, isFinal, callback) {
        let cleaned = query.toLowerCase().trim();
        
        // --- Special Command: Dev Team Details ---
        if (cleaned.includes("dev team") || cleaned.includes("developer team") || cleaned.includes("development team") || cleaned.includes("describe us") || cleaned.includes("team details") || cleaned.includes("our team") || cleaned.includes("who made this") || cleaned.includes("who are you")) {
            if (isFinal || cleaned.split(/\s+/).length <= 4) {
                // Set flag so Alex knows to speak on the next page load
                sessionStorage.setItem("alex_dev_team_speech", "true");
                callback({ type: "nav", url: "about.html" });
            }
            return;
        }

        // 1. Detect if the user is asking a conversational question (e.g. "tell me about...", "can you...")
        let conversationalPhrases = ["can you", "could you", "tell me", "provide", "give me", "what is", "who is", "where is", "how do", "why do", "what are", "do you", "is there", "info about", "information about", "explain", "describe", "i want to know"];
        let isConversation = conversationalPhrases.some(phrase => cleaned.includes(phrase));
        
        let navVerbs = ["go to", "open", "navigate", "take me", "show me", "load page", "set", "adjust", "change", "turn on", "turn off", "switch", "activate"];
        let isNavAction = navVerbs.some(v => cleaned.includes(v));

        // If it's a conversation and not explicitly asking to navigate, send directly to AI
        if (isConversation && !isNavAction) {
            if (!isFinal) {
                callback(null);
                return;
            }
            this.askLocalAI(query, (response) => {
                callback({ type: "chat", response: response });
            });
            return;
        }

        // 2. Normal Intent Navigation Matching
        let bestScore = 0;
        let bestPage = null;
        for (let intent of this.intents) {
            let score = 0;
            for (let token of intent.tokens) {
                // strict word boundary matching so 'about' doesn't match inside 'roundabout'
                let regex = new RegExp("\\b" + token + "\\b");
                if (regex.test(cleaned)) score += token.length;
            }
            if (score > bestScore) {
                bestScore = score;
                bestPage = intent.page;
            }
        }

        // 3. Trigger immediate navigation if confident matching
        if (bestScore >= 3) {
            let wordsCount = cleaned.split(/\s+/).length;
            // Only instant-jump if it's a short command. If it's a long sentence, wait till the user finishes speaking.
            if (wordsCount <= 3 || isFinal) {
                callback({ type: "nav", url: bestPage });
                return;
            }
        }

        // Prevent spamming the AI with partial sentences
        if (!isFinal) {
            callback(null);
            return;
        }

        // Fallback: It didn't trigger navigation, so default to chat
        this.askLocalAI(query, (response) => {
            callback({ type: "chat", response: response });
        });
    },


    askLocalAI: function(userInput, callback, customSystemPrompt = null) {
        const defaultSystem = "You are Alex, a professional AI assistant for Zoopedia. Polite, call user 'Sir'. STRICT RULES: 1. Your response MUST be extremely short (MAXIMUM 2 sentences, under 30 words). Jarvis persona: direct, professional, concise.";
        
        const payload = {
            messages: [
                { 
                    role: "system", 
                    content: customSystemPrompt || defaultSystem
                },
                { role: "user", content: userInput }
            ]
        };

        $.ajax({
            url: "bridge.php",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: (data) => {
                try {
                    // Ollama format: data.message.content
                    if (data.message && data.message.content) {
                        callback(data.message.content);
                    } else if (data.status === "error") {
                        callback("Sir, " + data.message);
                    } else {
                        throw new Error("Local calibration error.");
                    }
                } catch(e) {
                    console.error("Alex: Local AI Data Error", data);
                    callback("My neural uplink is unstable, Sir. Check the console.");
                }
            },
            error: () => {
                callback("I am unable to reach the local bridge. Is Apache running, Sir?");
            }
        });
    },

    keywordMap: [
        { id: 62, synonyms: ["dark axolotl", "wild axolotl", "water lizard"] },
        { id: 59, synonyms: ["axolotl", "pink axolotl", "walking fish"] },
        { id: 1, synonyms: ["dog", "dogs", "puppy", "canine", "hound"] },
        { id: 2, synonyms: ["cat", "cats", "kitty", "feline", "kitten"] },
        { id: 3, synonyms: ["pig", "pigs", "hog", "swine", "piggy"] },
        { id: 4, synonyms: ["rabbit", "rabbits", "bunny", "bunnies", "hare"] },
        { id: 5, synonyms: ["parrot", "parrots", "birdy", "talking bird"] },
        { id: 17, synonyms: ["lion", "lions", "king of beasts", "pride"] },
        { id: 18, synonyms: ["tiger", "tigers", "big cat", "striped"] },
        { id: 19, synonyms: ["wolf", "wolves", "pack", "howl"] },
        { id: 36, synonyms: ["elephant", "elephants", "trunk"] },
        { id: 37, synonyms: ["giraffe", "giraffes", "long neck"] },
        { id: 38, synonyms: ["zebra", "zebras", "stripes"] },
        { id: 54, synonyms: ["rhino", "rhinoceros", "horn"] },
        { id: 43, synonyms: ["cobra", "snake", "king cobra"] },
        { id: 41, synonyms: ["hamster", "hamsters"] }
    ],

    speak: function(text, callback) {
        // Clean out markdown characters like #, *, _, ~ so TTS doesn't say "hashtag hashtag"
        let cleanText = text.replace(/[#*~_`]/g, '').trim();
        
        // --- FIX PRONUNCIATION FOR TTS ---
        // We replace the names with phonetic spelling for the audio, but keep cleanText for the captions.
        let phoneticText = cleanText
            .replace(/\bAmeendree\b/gi, "Ah-meen-dree")
            .replace(/\bMinasi\b/gi, "Mee-neh-see")
            .replace(/\bVihara\b/gi, "Vee-hah-rah")
            .replace(/\bAyodya\b/gi, "Ay-yoh-dee-yah")
            .replace(/\bGithmi\b/gi, "Geeth-mee");
        
        const synth = window.speechSynthesis;
        synth.cancel();
        window.isAudioPlaying = true;
        const msg = new SpeechSynthesisUtterance(phoneticText);
        msg.onend = () => {
            setTimeout(() => { 
                window.isAudioPlaying = false; 
                if(callback) callback();
            }, 1500); // 1.5 second silence buffer
        };
        msg.onerror = () => {
            window.isAudioPlaying = false;
            if(callback) callback();
        };
        synth.speak(msg);
        $('#normad-caption-bar').text("ALEX: \"" + cleanText + "\"").fadeIn();
    }
};

// Check for cross-page speech commands on load
$(document).ready(function() {
    if (sessionStorage.getItem("alex_dev_team_speech") === "true") {
        sessionStorage.removeItem("alex_dev_team_speech");
        
        // Let the page render, then speak the dev team details
        setTimeout(() => {
            if (window.isAudioPlaying) window.speechSynthesis.cancel();
            AlexBrain.speak("Sir, here is the Zoopedia development team. Ameendree is our Project Manager, bridging vision with technical execution. Mark is our Senior Developer handling our full-stack infrastructure. Minasi is the UI/UX Designer dedicated to user-centric experiences. Vihara is our Database Administrator ensuring data integrity. Finally, Ayodya and Githmi are our Assistant Developers who specialize in responsive components and frontend feature integration.");
        }, 1500); 
    }
});
