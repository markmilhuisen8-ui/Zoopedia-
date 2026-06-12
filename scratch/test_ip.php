<?php
// Scratch script to test IP detection
function getLocalIP() {
    $port = $_SERVER['SERVER_PORT'] ?? '80';
    $portStr = ($port === '80' || $port === '443') ? '' : ":$port";

    $ips = [];
    $output = [];
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        exec('ipconfig', $output);
        echo "IPCONFIG OUTPUT:\n" . implode("\n", $output) . "\n\n";
        foreach ($output as $line) {
            if (preg_match('/IPv4 Address.*: ([\d\.]+)/', $line, $matches)) {
                $ip = $matches[1];
                echo "Found IP: $ip (Line: $line)\n";
                if ($ip !== '127.0.0.1' && !preg_match('/(Virtual|Loopback|Software)/i', $line)) {
                    echo "Valid candidate: $ip\n";
                    if (strpos($ip, '192.168.') === 0 || strpos($ip, '10.') === 0 || strpos($ip, '172.') === 0) {
                        return $ip . $portStr;
                    }
                    $ips[] = $ip . $portStr;
                }
            }
        }
    }
    return !empty($ips) ? $ips[0] : "FAILED";
}

echo "RESULT: " . getLocalIP() . "\n";
?>
