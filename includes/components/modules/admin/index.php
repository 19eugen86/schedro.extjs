<?php
if (!defined('KERNEL_LOADED')) die;
$smarty->assign('role', 'admin');
$smarty->display('index.tpl');