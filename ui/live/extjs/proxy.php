<?php
function gmstrtotime($sgm) {
    $months = array(
        'Jan' => 1,
        'Feb' => 2,
        'Mar' => 3,
        'Apr' => 4,
        'May' => 5,
        'Jun' => 6,
        'Jul' => 7,
        'Aug' => 8,
        'Sep' => 9,
        'Oct' => 10,
        'Nov' => 11,
        'Dec' => 12
    );
    $a = sscanf($sgm, "%3s, %2d %3s %4d %2d:%2d:%2d GMT");
    if ((count($a) != 7) || (!array_key_exists($a[2], $months))) {
        return false;
    }
    return gmmktime($a[4], $a[5], $a[6], $months[$a[2]], $a[1], $a[3]);
}

$headers = array();
$cType = $defaultCType = 'Content-type: text/plain';	// when all else fails, give 'em some text

// First lets see if this a request we can use
if (isset($_REQUEST['f']) && !empty($_REQUEST['f'])) {
    $fName = basename($_REQUEST['f']);

    $matches = array();
    // we need an extension
    preg_match('/\.(\w+)$/', $fName, $matches);
    $ext = !empty($matches[1]) ? $matches[1] : false;
} else {
	echo 'The script to retrieve style information has been called incorrectly.';
	exit;
}

// If we have an actual file and an extension, then lets set the content type
if (file_exists($fName) && $ext) {
    switch(strtolower($ext)) {
    case 'js':
	    $cType = 'Content-type: application/x-javascript';
	    break;

    case 'css':
	    $cType = 'Content-type: text/css';
	    break;
    }
} else {
    // oops, this was called inappropriately, maybe the programmer forgot to
    // put the file into place or made a typo.
    $fName = false;
    $contents = 'UI inclusion script has been called incorrectly.  Please contact support and report this error, including the URL shown below.' . "\n" . $_SERVER['REQUEST_URI'] . "\n";
}


if ($fName) {
    $zipName = 'gziped/' . $fName . '.gz';
    // Do they want gz'd files and do we have one?
    if (isset($_SERVER['HTTP_ACCEPT_ENCODING'])
	&& stristr($_SERVER['HTTP_ACCEPT_ENCODING'],'gzip')
	&& file_exists($zipName))
    {
    	$headers[] = 'Content-Encoding: gzip';
    	$headers[] = 'Vary: Accept-Encoding';
    	$fName = $zipName;
    }

    $handle = @fopen($fName, 'r');

    if ($handle) {
        $mt = filemtime($fName);
        $mt_str = gmdate("D, d M Y H:i:s", $mt)." GMT";

        if (!empty($_SERVER["HTTP_IF_MODIFIED_SINCE"])) {
            $cache_mt = $_SERVER["HTTP_IF_MODIFIED_SINCE"];
            if (gmstrtotime($cache_mt) >= $mt) {
				fclose($handle);
                header("HTTP/1.1 304 Not Modified");
                exit;
            }
        }
        $headers[] = "Last-Modified: " . $mt_str;

	    $contents = fread($handle, filesize($fName));
	    fclose($handle);
    } else {
    	// AH!! We cannot open the file for some reason!!
    	$cType = $defaultCType;
    	$contents = 'There has been an issue trying to locate the file "' . $fName . '" please contact support.';
    }
}

// If there is nothing here then we are in a bad state
if (empty($contents)) {
    $contents = 'The script to retrieve style information has been called incorrectly.'
	. "\n"
	. 'Please contact support and include the URL shown below.'
	. "\n" . $_SERVER['REQUEST_URI'] . "\n";
    $cType = $defaultCType;	// just in case it was set to something else
}

// Add in the headers that we need on all responses
$headers[] = 'Content-Length: ' . strlen($contents);
$headers[] = $cType;
if (!headers_sent()) {
    foreach ($headers as $h) {
	// Send them off
	header($h);
    }
}
echo $contents;