/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Outil de notification sub/pub
 */
(function() {

	window.$notify = {
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
		* @param {string} position Position pour la publication
		*/
		sub : function (target, handler, position) {
			if (position!==undefined)
				target = target+'/'+position;

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
			
			this._channel[target+'/before'] && this._channel[target+'/before'].forEach( function (item) {
				data = item.apply($notify, data || []);
			});
			this._channel[target] && this._channel[target].forEach( function (item) {
				data = item.apply($notify, data || []);
			});
			this._channel[target+'/after'] && this._channel[target+'/after'].forEach( function (item) {
				data = item.apply($notify, data || []);
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
		* @param {mixed} handler Callback de l'abonnement pour un canal de type
		* 'object', sinon le tableau retourné pour un abonnement de type 'string'
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
		* @param {string} position Position pour la publication
		*/
		connect : function (fromTarget, toTarget, position) {
			var that = this;
			that.sub(fromTarget, function () {
				var args = Array.prototype.slice.call(arguments, 0);
				that.pub(toTarget,arguments);
				return arguments;
			},position);
		}
	};
}());