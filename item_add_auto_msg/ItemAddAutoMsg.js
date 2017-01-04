/*:
 * @plugindesc	Automatically display a message when party gains items or gold (excluding shop processing).
 * @author	mykrme
 * 
 * @param	Background
 * @desc	Message window background, one of "Window", "Dim", "Transparent".
 * @default	Transparent
 * 
 * @param	Position
 * @desc	Message window position, one of "Top", "Middle", "Bottom".
 * @default	Bottom
 * 
 * @param	Exclude
 * @desc	A space separated list of item IDs that should not trigger the automatic message. For gold, use ID == 0.
 * @default	
 * 
 * @help	TODO
 */
var settings = PluginManager.parameters("ItemAddAutoMsg");

var background_types = {"Window" : 0, "Dim" : 1, "Transparent" : 2};
var position_types = {"Top" : 0, "Middle" : 1, "Bottom" : 2};

var background = background_types[settings["Background"] || "Transparent"];
var position = position_types[settings["Position"] || "Bottom"];
var excludes = settings["Exclude"].split(" ").map(parseInt);

var msg_template = "+%1 %2%3";

var isShopProcessing = false;

var Game_Party_gainGold = Game_Party.prototype.gainGold;
Game_Party.prototype.gainGold = function(amount) {
    if (excludes.indexOf(0) == -1 && amount > 0) {
        showMessage(amount, "C");
    }
    Game_Party_gainGold.call(this, amount);
};

var Game_Party_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    if (excludes.indexOf(item.id) == -1 && amount > 0) {
        showMessage(amount, item.name);
    }
    Game_Party_gainItem.call(this, item, amount, includeEquip);
};

function showMessage(amount, item) {
console.log(isShopProcessing);
    if (!isShopProcessing) {
        var ending = "";
        if (amount > 1 && item != "C") {
            ending = "s";
        }
        $gameMessage.clear();
        $gameMessage.setBackground(background);
        $gameMessage.setPositionType(position);
        $gameMessage.add(msg_template.format(amount, item, ending));
    }
};

// Shop Processing

var Game_Interpreter_command302 = Game_Interpreter.prototype.command302;
Game_Interpreter.prototype.command302 = function() {
    if (!$gameParty.inBattle()) {
        isShopProcessing = true;
    }
    return Game_Interpreter_command302.call(this);
};

var Scene_Shop_popScene = Scene_Shop.prototype.popScene;
Scene_Shop.prototype.popScene = function() {
    isShopProcessing = false;
    Scene_Shop_popScene.call(this);
};
