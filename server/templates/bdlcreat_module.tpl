<?php

/**
 * @package  --NAMEBDL--
 * @subpackage --NAMEBDL-- (--NSP--_)
 * @author --AUTHOR--
 * @licence --LICENCE--
 */

/**
 * Module --NAMEBDL--
 *
 * @package  --NAMEBDL--
 * @subpackage --NAMEBDL-- (--NSP--_)
 */
class --NSP--_--NBDL-- extends g_module {

	protected function start () {
		$rep = $this->MgetResponse('JSON');
		$rep->content = ajax::error(array('content'=>'--NSP---error'),'Err---NSP---1');
		return $rep;
	}
}
?>