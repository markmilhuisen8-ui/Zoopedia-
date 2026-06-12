<?php
// get_local_ip.php
// Detects the server's local network IP for mobile connectivity
function getLocalIP() {
    $port = $_SERVER['SERVER_PORT'] ?? '80';
    $portStr = ($port === '80' || $port === '443') ? '' : ":$port";

    // Try to get the IP from system commands
    $ips = [];
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        exec('ipconfig', $output);
        foreach ($output as $line) {
            if (preg_match('/IPv4 Address.*: ([\d\.]+)/', $line, $matches)) {
                $ip = $matches[1];
                if ($ip !== '127.0.0.1' && !preg_match('/(Virtual|Loopback|Software)/i', $line)) {
                    if (strpos($ip, '192.168.') === 0 || strpos($ip, '10.') === 0 || strpos($ip, '172.') === 0) {
                        return $ip . $portStr;
                    }
                    $ips[] = $ip . $portStr;
                }
            }
        }
    } else {
        exec('hostname -I', $output);
        $ips = explode(' ', trim($output[0] ?? ''));
        foreach($ips as $ip) {
            if (!empty($ip) && $ip !== '127.0.0.1') return $ip . $portStr;
        }
    }
    
    $fallback = gethostbyname(gethostname());
    return (!empty($ips) ? $ips[0] : $fallback) . $portStr;
}

header('Content-Type: application/json');
echo json_encode(['ip' => getLocalIP()]);
?>
