<?php
/**
 * Zoopedia Inbuilt AI Summarizer v2
 * Enhanced Extractive Summarization Logic
 */

class ZoopediaSummarizer {
    private $stopWords = [
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", 
        "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", 
        "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", 
        "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", 
        "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most", "my", "myself", 
        "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", 
        "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", 
        "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"
    ];

    public function summarize($text, $targetSentences = 2) {
        if (empty($text) || strlen($text) < 50) return "<li>Providing a deeper analysis requires more text, Sir.</li>";

        // 1. More robust sentence splitting
        $sentences = preg_split('/(?<=[.?!])\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        $count = count($sentences);

        if ($count <= 1) {
            // If only one sentence, try to split by commas or semi-colons if it's very long
            if (strlen($text) > 150) {
                $sentences = preg_split('/[,;]\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
            } else {
                return "<li>" . trim($text) . "</li>";
            }
        }

        // 2. Frequency Analysis
        $cleanText = preg_replace('/[^\w\s]/', '', strtolower($text));
        $words = preg_split('/\s+/', $cleanText, -1, PREG_SPLIT_NO_EMPTY);
        
        $freq = [];
        foreach ($words as $w) {
            if (strlen($w) > 3 && !in_array($w, $this->stopWords)) {
                $freq[$w] = ($freq[$w] ?? 0) + 1;
            }
        }

        if (empty($freq)) return "<li>" . $sentences[0] . "</li>";

        // 3. Scoring Sentences (Focus on density of key terms)
        $scores = [];
        foreach ($sentences as $i => $s) {
            $sWords = preg_split('/\s+/', preg_replace('/[^\w\s]/', '', strtolower($s)), -1, PREG_SPLIT_NO_EMPTY);
            $score = 0;
            $foundWords = 0;
            foreach ($sWords as $sw) {
                if (isset($freq[$sw])) {
                    $score += $freq[$sw];
                    $foundWords++;
                }
            }
            
            // Heuristic: Prefer sentences at the beginning and end, and those with high key-term density
            $density = ($foundWords > 0) ? $score / count($sWords) : 0;
            $positionBonus = ($i == 0 || $i == $count - 1) ? 1.5 : 1.0;
            
            $scores[$i] = $density * $positionBonus;
        }

        // 4. Extract Top Sentences
        arsort($scores);
        $topIndices = array_slice(array_keys($scores), 0, $targetSentences);
        sort($topIndices);

        $result = [];
        foreach ($topIndices as $idx) {
            $sentence = trim($sentences[$idx]);
            // Format key terms in bold
            foreach (array_slice(array_keys($freq), 0, 5) as $topWord) {
                $sentence = preg_replace('/\b(' . preg_quote($topWord) . ')\b/i', '<b>$1</b>', $sentence);
            }
            $result[] = "<li>" . $sentence . "</li>";
        }

        return implode("", $result);
    }
}

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
$text = $input['text'] ?? '';

$summarizer = new ZoopediaSummarizer();
$summary = $summarizer->summarize($text);

echo json_encode(["summary" => $summary]);
?>
