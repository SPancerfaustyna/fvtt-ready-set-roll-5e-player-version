import { CoreUtility } from "./core.js";
import { LogUtility } from "./log.js";
import { MODULE_SHORT } from "../module/const.js";

/**
 * Utility class to handle macro support for the module.
 */
export class MacroUtility {
    /**
     * Retrieve a list of functions that can be called from macro scripts.
     * @returns The list of functions with their macro identifier.
     */
    static getMacroList() {
        return {
            rollItem: _macroRollItem
        }
    }
}

function _macroRollItem(itemId, actorId, options = {}) {
    LogUtility.log("Executing macro: 'rollItem'.");

    if (!itemId) {
        LogUtility.logError(CoreUtility.localize(`${MODULE_SHORT}.messages.error.itemNotSpecified`));
        return null;
    }

    if (!actorId) {
        actorId = ChatMessage.getSpeaker()?.actor;

        if (!actorId) {
            LogUtility.logError(CoreUtility.localize(`${MODULE_SHORT}.messages.error.noSelectedActor`));
            return null;
        }
    }

    let actor = CoreUtility.getActorById(actorId) ?? CoreUtility.getActorByName(actorId);     

    if (!actor) {
        LogUtility.logError(CoreUtility.localize(`${MODULE_SHORT}.messages.error.cannotFindIdentifier`,
            { type: "actor", identifier: actorId }));
        return null;
    }

    let item = actor.items.get(itemId) ?? actor.items.find(i => i.name === itemId);

    if (!item) {
        LogUtility.logError(CoreUtility.localize(`${MODULE_SHORT}.messages.error.cannotFindIdentifier`,
            { type: "item", identifier: itemId }));
        return null;
    }

    return item.use(options);
}