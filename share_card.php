<?php
// share_card.php - A premium, celebratory landing page
$id = $_GET['id'] ?? '';
$card = null;

if ($id) {
    $jsonFile = 'memory_cards.json';
    if (file_exists($jsonFile)) {
        $data = json_decode(file_get_contents($jsonFile), true) ?? [];
        foreach ($data as $record) {
            if ($record['id'] === $id) { $card = $record; break; }
        }
    }
}

if (!$card) {
    echo "<body style='background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;'><h1>Card Not Found</h1></body>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Happy Mother's Day! | Zoopedia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        body {
            background: #000;
            color: #fff;
            font-family: 'Outfit', sans-serif;
            margin: 0;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }

        /* Celebration Background */
        .celebration-bg {
            position: fixed;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at 20% 30%, rgba(255, 45, 85, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(0, 113, 227, 0.2) 0%, transparent 50%);
            z-index: -1;
            animation: pulse 8s infinite alternate;
        }

        @keyframes pulse {
            0% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        .content-card {
            text-align: center;
            width: 90%;
            max-width: 900px;
            padding: 20px;
            animation: slideUp 1s cubic-bezier(0.2, 0, 0.2, 1);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .special-title {
            font-weight: 900;
            font-size: clamp(3rem, 10vw, 6rem);
            line-height: 0.9;
            margin-bottom: 20px;
            letter-spacing: -3px;
            background: linear-gradient(180deg, #FFFFFF 0%, #FF2D55 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 20px 40px rgba(255, 45, 85, 0.3);
        }

        .image-showcase {
            position: relative;
            margin-top: 40px;
            padding: 15px;
            background: rgba(255,255,255,0.05);
            border-radius: 40px;
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            box-shadow: 0 60px 120px rgba(0,0,0,0.6);
            display: inline-block;
        }

        .card-img {
            max-width: 100%;
            border-radius: 28px;
            display: block;
            border: 1px solid rgba(255,255,255,0.1);
        }

        .badge-celebrate {
            display: inline-block;
            background: rgba(255, 45, 85, 0.15);
            color: #FF2D55;
            padding: 8px 20px;
            border-radius: 100px;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            border: 1px solid rgba(255, 45, 85, 0.3);
        }

        .footer {
            margin-top: 60px;
            font-size: 13px;
            color: rgba(255,255,255,0.4);
            font-weight: 600;
            letter-spacing: 4px;
        }

        /* Floating particles */
        .particle {
            position: absolute;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            pointer-events: none;
            animation: float 10s infinite linear;
        }

        @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    </style>
</head>
<body>

    <div class="celebration-bg"></div>
    
    <!-- Floating decorative particles -->
    <script>
        for(let i=0; i<15; i++) {
            let p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.width = p.style.height = Math.random() * 8 + 4 + 'px';
            p.style.animationDelay = Math.random() * 10 + 's';
            p.style.animationDuration = Math.random() * 5 + 10 + 's';
            document.body.appendChild(p);
        }
    </script>

    <div class="content-card">
        <div class="badge-celebrate">A Special Gift for You</div>
        <h1 class="special-title">Happy<br>Mother's Day!</h1>
        
        <div class="image-showcase">
            <img src="<?php echo htmlspecialchars($card['image_url']); ?>" class="card-img" alt="Memory Card Image">
        </div>

        <div class="actions mt-5 d-flex justify-content-center gap-3">
            <a href="memory_editor.html" style="color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 600; font-size: 14px; border: 1px solid rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 50px;">
                Create Your Own
            </a>
            <a href="<?php echo htmlspecialchars($card['image_url']); ?>" download="Wildlife_Memory_Card.png" style="background: #FF2D55; color: #fff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 25px; border-radius: 50px; box-shadow: 0 10px 20px rgba(255, 45, 85, 0.4);">
                Download Card
            </a>
        </div>

        <div class="footer">ZOOPEDIA PRIME • DIGITAL MEMORIES</div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
