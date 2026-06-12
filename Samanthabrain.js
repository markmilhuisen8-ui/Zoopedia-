// SAMANTHA BRAIN - Smart Intent Scoring Engine
// No flat keyword dictionary — Sussi understands intent through token scoring.
const SamanthaBrain = {

    // INTENT DATABASE 
    // Each intent has a page, and an array of TOKENS.
    // Tokens are small meaningful word-pieces (Sinhala + English).
    // Sussi scores each page by how many tokens appear in what she heard.
    // Longest/most tokens wins — partial matches, mixed language, all work.
    intents: [
        {
            page: "index.html",
            tokens: ["home", "main", "start", "index", "හෝම", "හොම", "මුල", "ආරම්භ", "first", "go home", "යන්න", "යමු", "home page", "හෝම්", "හොම්", "පිටුව", "මුල්"]
        },
        {
            page: "gamepage.html",
            tokens: ["game", "games", "play", "fun", "gaming", "ගේ", "ගෙ", "සෙල", "ක්‍රීඩ", "ක්රීඩ", "කිරිඩ", "සෙල්ලම", "ගෙයිම", "arcade", "ප්ලේ", "ගේම්", "ක්‍රීඩා කරන්න", "සෙල්ලම් කරන්න", "සෙල්ලම", "ගෙමින්"]
        },
        {
            page: "wildlife.html",
            tokens: ["wild", "wildlife", "jungle", "forest", "nature", "කැල", "කල", "වනජීව", "වන", "කාන්තාර", "ස්වාභාවික", "safari", "වයිල්ඩ්", "ලයිෆ්", "කැලේ", "සත්තු", "වනය", "සතුන්"]
        },
        {
            page: "dommestic.html",
            tokens: ["domestic", "pet", "pets", "home animal", "tame", "සුරතල", "නිවාස", "ගෘහ", "ගෙදර සතා", "house", "ඩොමෙස්ටික්", "පෙට්", "බල්ලෝ", "පූසෝ", "සුරතල් සත්තු", "ඩොමස්ටික්"]
        },
        {
            page: "Crawler.html",
            tokens: ["reptile", "reptiles", "crawler", "crawl", "lizard", "උරග", "බඩගාන", "සරීසෘ", "ගා", "creep", "ක්රෝලර්", "රෙප්ටයිල්", "රෙප් ටයිල්", "ඇවිදින", "බඩගානවා", "සර්පයෝ", "පත්තෑයා"]
        },
        {
            page: "WildlifeVault.html",
            tokens: ["vault", "all", "database", "list", "details", "collection", "සතුන්", "විස්තර", "දත්ත", "වෝල්ට", "ලැය", "archive", "වෝල්ට්", "ඩේටා", "සියලුම සත්තු", "ලිස්ට් එක", "සත්ව ලැයිස්තුව", "ඩේටාබේස්"]
        },
        {
            page: "about.html",
            tokens: ["about", "feed", "news", "info", "information", "update", "ගැන", "ෆීඩ", "ආහාර", "තොරතුරු", "blog", "අබවුට්", "පුවත්", "අලුත් දේවල්", "බලන්න", "නිව්ස්"]
        },
        {
            page: "story.html",
            tokens: ["story", "stories", "tale", "tales", "read", "කතා", "කතන්දර", "ස්ටෝරි", "ගතාව", "narrative", "ස්ටෝරී", "කතන්දරය", "කියවන්න", "පාඩම්"]
        },
        {
            page: "contact.html",
            tokens: ["contact", "call", "message", "reach", "help", "support", "සම්බන්ධ", "සම්පර්ක", "අමතා", "ඇමතු", "talk", "කොන්ටැක්ට්", "උදව්", "මැසේජ්", "කෝල්", "සපෝට්"]
        },
        {
            page: "action:set-dark",
            tokens: ["dark", "night", "darkmode", "ඩාර්ක්", "අඳුරු", "කළු", "රෑ", "මෝඩ්"]
        },
        {
            page: "action:set-light",
            tokens: ["light", "day", "lightmode", "ලයිට්", "එළිය", "සුදු", "දවල්"]
        },
        {
            page: "action:stop",
            tokens: ["stop", "shutup", "shut up", "නවත්වන්න", "නවතන්න", "නවත්තපන්", "ඇති", "ස්ටොප්", "සයිලන්ට්", "silent", "cancel", "enough", "quit", "exit", "මදි", "Close", "ක්ලෝස්"]
        },
        {
            page: "action:disable-magic",
            tokens: ["stop camera", "turn off camera", "turn off cam", "turn off", "disable magic", "shut down camera", "කැමරාව ඕෆ් කරන්න", "hide camera", "cam off"]
        },
        {
            page: "action:enable-magic",
            tokens: ["magic", "camera", "cam", "enable", "start", "on", "turn on", "මැජික්", "කැමරා", "ඔන්", "ස්ටාර්ට්", "ක්රියාත්මක", "මැජික් එක", "turn on the camera", "turn on cam"]
        }
    ],

    // INTENT SCORING ENGINE 
    // Returns the best matching page URL, or null if no confident match.
    findIntent: function (query) {
        let cleaned = query.replace(/[\u200D\u200C.,?!]/g, '').toLowerCase().trim();
        let bestScore = 0;
        let bestPage = null;

        for (let intent of this.intents) {
            let score = 0;
            for (let token of intent.tokens) {
                if (cleaned.includes(token.toLowerCase())) {
                    // Longer tokens score more — more specific = more confident
                    score += token.length;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestPage = intent.page;
            }
        }

        console.log("Sussi Intent Score: " + bestScore + " → " + bestPage);
        // Minimum confidence threshold of 1 for high sensitivity
        return (bestScore >= 1) ? bestPage : null;
    },

    // ANIMAL KEYWORD MAP
    // Kept for animal-specific page navigation (singleanimalpage.html?id=X)
    animalKeywords: [
        // PRIORITY: More specific compound names first
        { id: 62, names: ["කළු ඇක්සොලොට්ල්", "black axolotl", "dark axolotl"] },
        { id: 59, names: ["ඇක්සොලොට්ල්", "axolotl", "ඇක්සොලොට්ල්", "walking fish"] },
        
        // Pets
        { id: 1,  names: ["බල්ල", "balla", "ballage", "dog", "dogs", "puppy", "ඩෝග්"] },
        { id: 2,  names: ["පූස", "බළල", "pusaa", "pusage", "cat", "kitty", "kitten", "කැට්"] },
        { id: 3,  names: ["ඌර", "ura", "urage", "pig", "hog", "swine", "පිග්"] },
        { id: 4,  names: ["හාව", "hawa", "hawage", "rabbit", "bunny", "hare", "රැබිට්"] },
        { id: 5,  names: ["ගිරව", "girawa", "girawage", "parrot", "පැරට්"] },
        { id: 6,  names: ["මීය", "meeya", "meeyage", "rat", "mouse", "rodent", "රැට්"] },
        { id: 7,  names: ["හැම්ස්ටර්", "hamster", "හැම්ස්ටර්"] },
        { id: 8,  names: ["මාළුව", "maluwa", "maluwage", "fish", "goldfish", "ෆිෂ්"] },
        { id: 9,  names: ["බැටළුව", "bataluwa", "sheep", "lamb", "ෂීප්"] },
        { id: 11, names: ["එළුව", "eluwa", "eluwage", "goat", "ගෝට්"] },
        { id: 12, names: ["කුකුළ", "kikili", "kikilige", "chicken", "hen", "rooster", "චිකන්"] },
        { id: 13, names: ["ගිනි පිග්", "guinea pig", "cavy", "ගිනිපිග්"] },
        { id: 14, names: ["ඉබ්බ", "ibba", "ibbage", "turtle", "tortoise", "ටර්ටල්"] },
        { id: 15, names: ["හෙජ්ජෝග්", "hedgehog", "hedgehogs", "spiky"] },
        { id: 16, names: ["කැනරි", "canary", "canaries", "songbird"] },
        
        // Wild
        { id: 17, names: ["සිංහ", "simhaya", "simhayage", "lion", "ලයින්"] },
        { id: 18, names: ["කොටි", "kotiya", "kotiyage", "tiger", "ටයිගර්"] },
        { id: 19, names: ["වෘක", "wolf", "wolves", "pack", "howl"] },
        { id: 20, names: ["කිඹුල", "kibula", "kibulage", "crocodile", "croc", "alligator", "ක්‍රොකොඩයිල්"] },
        { id: 21, names: ["චීට", "cheetah", "fast cat", "චීටා"] },
        { id: 25, names: ["වලහ", "walaha", "walahage", "bear", "grizzly", "බෙයර්"] },
        { id: 29, names: ["අශ්වයා", "ashwaya", "horse", "pony", "හෝස්"] },
        { id: 32, names: ["මීහරක", "buffalo", "buff", "බෆලෝ"] },
        { id: 33, names: ["ඔටුව", "camel", "cam", "හම්ප්"] },
        { id: 34, names: ["ලාලමා", "llama", "alpaca", "ලමා"] },
        { id: 36, names: ["අලි", "ඇත", "aliya", "aliyage", "elephant", "එලිපන්ට්"] },
        { id: 37, names: ["ජිරාෆ", "jiraffa", "giraffe", "ජිරාෆ්"] },
        { id: 38, names: ["සීබ්‍රා", "seebra", "zebra", "සීබ්‍රා"] },
        { id: 51, names: ["මුව", "deer", "buck", "doe", "බර්"] },
        { id: 52, names: ["වඳුර", "wandura", "wandurage", "monkey", "ape", "primate", "මන්කි"] },
        { id: 53, names: ["කැන්ගරු", "kangaroo", "roo", "කැන්ගරු"] },
        { id: 54, names: ["රයිනෝ", "raino", "rhino", "rhinoceros", "රයිනෝ"] },
        { id: 55, names: ["හිපෝ", "hippo", "hippopotamus", "හිපෝ"] },
        { id: 56, names: ["නරි", "nariya", "nariyage", "fox", "ෆොක්ස්"] },
        { id: 57, names: ["බයිසන්", "bison", "බයිසන්"] },
        { id: 58, names: ["මකුළුව", "makuluwa", "makuluwage", "spider", "ස්පයිඩර්"] },
        { id: 60, names: ["පණුවා වැනි උභයජීවියා", "caecilian", "සීසීලියන්"] },
        { id: 61, names: ["පැන්ගෝලින්", "pangolin", "පැන්ගෝලින්"] },
        
        // Reptiles & Amphibians
        { id: 39, names: ["ගෙකෝ", "gecko", "lizzard", "ගෙකෝ"] },
        { id: 40, names: ["ඉබ්බ", "tortoise", "giant tortoise", "ටෝටස්"] },
        { id: 41, names: ["කැමිලියන්", "chameleon", "කැමිලියන්"] },
        { id: 42, names: ["මොනිටර්", "monitor", "monitor lizard", "මොනිටර්"] },
        { id: 43, names: ["නය", "නයි", "naya", "nayage", "cobra", "snake", "ස්නේක්"] },
        { id: 44, names: ["සලමන්ඩර්", "salamander", "සලමන්ඩර්"] },
        { id: 45, names: ["ඉගුවාන", "iguana", "ඉගුවානා"] },
        { id: 46, names: ["ඩාර්ට් ෆ්‍රොග්", "poison frog", "dart frog"] },
        { id: 47, names: ["ග්ලාස් ෆ්‍රොග්", "glass frog"] },
        { id: 48, names: ["ගෙම්බා", "toad", "common toad"] },
        { id: 49, names: ["ට්‍රී ෆ්‍රොග්", "tree frog"] },
        { id: 50, names: ["එළදෙන", "cow", "cattle", "ගවයා"] }
    ],

    // VOICE ASSETS
    voices: {
        "online": new Audio('audio/Samantha/reply.mpeg'),
        "finding": [new Audio('audio/Samantha/opensai.mpeg')],
        "confused": new Audio('audio/Samantha/what.mp3'),
        "standby": new Audio('audio/Samantha/process.mp3')
    },

    currentAudio: null, // Track currently playing sound

    play: function (type, callback) {
        // STOP previous audio if it's still playing
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }

        let sound;
        if (type === "finding") {
            // DYNAMIC AUDIO: Use Opensai on Home, Process on other pages
            const path = window.location.pathname.toLowerCase();
            const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '' || path.split('/').pop() === '';
            const audioPath = isHome ? 'audio/Samantha/opensai.mpeg' : 'audio/Samantha/process.mp3';
            sound = new Audio(audioPath);
        } else {
            let playlist = this.voices[type] || this.voices["finding"];
            sound = Array.isArray(playlist) ? playlist[0] : playlist;
        }
        
        this.currentAudio = sound; // Keep reference
        sound.currentTime = 0;

        // Block clap detection while audio plays (prevents speaker feedback loops)
        window.isAudioPlaying = true;

        sound.play()
            .then(() => {
                sound.onended = () => {
                    this.currentAudio = null;
                    // 1500ms cooldown — covers room echo even on louder speakers
                    setTimeout(() => { window.isAudioPlaying = false; }, 1500);
                    if (callback) callback();
                };
            })
            .catch(e => {
                console.warn("Audio blocked/missing. Redirecting now.", e);
                this.currentAudio = null;
                window.isAudioPlaying = false;
                if (callback) callback();
            });
    }
};
