/**
 * @package --NAMEBDL--
 * @subpackage --NAMEBDL-- (--NSP--_)
 * @author --AUTHOR--
 * @licence --LICENCE--
 */

/**
 * Bootstrap bundle --NAMEBDL--
 */
define('bdl/--NBDL--/--NSP--_--NBDL--_bdl',function() {
	$bundles.register('--NAMEBDL--','--NAMEBDL--',{
		load : function( --NBDL--View ) {
			// initalisations
			--NBDL--View.init();
		},
		unload : function( --NBDL--View ){
			--NBDL--View.unload();
		}
	});
	setTimeout(function(){
		__loadNextFile();
	}, 500);
});