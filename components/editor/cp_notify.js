/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant editor - partie notify
 * namespace : http://www.components.org
 */
define('cp/editor/cp_notify',function() {
	(function() {

		var notify = function(editor) {

			return {
				/**
				*
				* Object des canaux
				*
				* @type object
				*/
				_channel : {},

				/**
				*
				* Abonnement à un canal
				*
				* @param {string} target Cible de l'abonnement
				* @param {function} handler
				*/
				sub : function (target, handler) {
					if (!this._channel[target])
						this._channel[target] = [];

					this._channel[target].push(handler);
					return [target, handler];
				},

				/**
				*
				* Publication sur un canal
				*
				* @param {string} target Cible de la publication
				* @param {mixed} data
				* @returns {mixed}
				*/
				pub : function (target, data) {
					this._channel[target] && this._channel[target].forEach( function (item) {
						data = item.apply(editor, data || []);
					});
					return data;
				},

				/**
				*
				* Désabonnement d'un canal
				* Si handler est undefined c'est l'ensemble des abonnements du canal qui sont
				* supprimés
				*
				* @param {string} target Cible du désabonnement
				* @param {mixed} handler
				*/
				unSub : function (target, handler) {
					if(handler!==undefined){
						var t = handler[0];
						var that = this;
						this._channel[t] && that._channel[t].forEach( function(item,index){
								if( item == handler[1]) {
									that._channel[t].splice(index, 1);
									if (that._channel[t].length==0)
										delete(that._channel[t]);
								}
						});
					} else {
						if (this._channel[target])
							delete(this._channel[target]);
					}
				},

				/**
				*
				* Connection entre deux canaux
				*
				* @param {string} fromTarget Cible de l'abonnement
				* @param {string} toChannel Cible de la publication
				*/
				connect : function (fromTarget, toTarget) {
					var that = this;
					that.sub(fromTarget, function () {
						var args = Array.prototype.slice.call(arguments, 0);
						that.pub(toTarget,arguments);
						return arguments;
					});
				}
			};
		};

		JSElem.extendComponent('http://www.components.org','editor',{notify :notify});
	}());
});