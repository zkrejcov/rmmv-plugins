/*:
 * @plugindesc	The SecretPassage plugin allows you to make an otherwise impassable tile passable through the use of regions. 
 * @author	mykrme
 * 
 * @param	Passable
 * @desc	The region number used for a secret passage - always passable.
 * @default	1
 * 
 * @param	Impassable
 * @desc	The region number used for the surroundings of a secret passage - always impassable.
 * @default	2
 * 
 * @param	Invisible
 * @desc	The region number used for a secret passage - always passable. Character is invisible.
 * @default	3
 * 
 * @help	
 */
var settings = PluginManager.parameters("SecretPassage");
var passable_region = parseInt(settings["Passable"]) || 1;
var impassable_region = parseInt(settings["Impassable"]) || 2;
var invisible_region = parseInt(settings["Invisible"]) || 3;

var _Game_Map_checkPassage = Game_Map.prototype.checkPassage;
Game_Map.prototype.checkPassage = function(x, y, bit) {
    var region = $gameMap.regionId(x, y);
    switch (region) {
        case passable_region:
        case invisible_region: return true;
        case impassable_region: return false;
        default: return _Game_Map_checkPassage.call(this, x, y, bit);
    }
};

var Game_CharacterBase_isTransparent = Game_CharacterBase.prototype.isTransparent;
Game_CharacterBase.prototype.isTransparent = function() {
    var region = $gameMap.regionId(this.x, this.y);
    if (region === invisible_region) {
        return true;
    }
    return Game_CharacterBase_isTransparent.call(this);
};
