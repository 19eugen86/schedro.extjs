<?php
if (!defined('KERNEL_LOADED')) {die;}

//Check for call from admin panel
if ( isEndsWith( $smarty->template_dir, '/administration/' ) ) {
    //Cut off /administration/
    $smarty->template_dir = substr( $smarty->template_dir, 0, -16 );
    $smarty->compile_dir = substr( $smarty->compile_dir, 0, -16 );
}
header( 'HTTP/1.0 404 Not Found' );
$smarty->display( '404.tpl' );