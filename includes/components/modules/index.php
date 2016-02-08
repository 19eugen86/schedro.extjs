<?php
if (!defined('KERNEL_LOADED')) die;
$smarty->assign('role', 'user');
$smarty->display('index.tpl');