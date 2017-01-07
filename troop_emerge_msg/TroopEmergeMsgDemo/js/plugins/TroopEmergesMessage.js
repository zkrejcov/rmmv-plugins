/*:
 * @plugindesc	Change the content of the %1 var for Emerge message to Troop name instead of the 1st enemy name.
 * @author	mykrme
 * 
 * @help	
 */

BattleManager.displayStartMessages = function() {
    $gameMessage.add(TextManager.emerge.format($gameTroop.troop().name));
    if (this._preemptive) {
        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    } else if (this._surprise) {
        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    }
};
