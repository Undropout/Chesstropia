/**
 * @file EmpathySystem.js
 * Processes empathy-based interactions between the player and a piece.
 * It determines the outcome of a player's choice based on the piece's
 * emotional state, personality, and the nature of the choice itself.
 */
class EmpathySystem {
    /**
     * Initializes the EmpathySystem.
     * @param {EventEmitter} eventEmitter - The central event bus.
     */
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    /**
     * Handles an empathy interaction and calculates the result.
     * @param {Piece} piece - The piece being interacted with.
     * @param {string} choiceId - The ID of the choice the player made (0-3).
     * @returns {object} An object describing the outcome.
     */
    handleInteraction(piece, choiceId) {
        const choiceIndex = parseInt(choiceId);
        let result = {
            success: false,
            trustChange: 0,
            newState: piece.emotionalState,
            message: "The response had no effect."
        };

        switch (piece.emotionalState) {
            case 'anxious':
                result = this.handleAnxiousInteraction(choiceIndex);
                break;
            case 'shutdown':
                result = this.handleShutdownInteraction(choiceIndex);
                break;
            case 'fight':
                result = this.handleFightInteraction(choiceIndex);
                break;
            case 'freeze': // NEWLY ADDED
                result = this.handleFreezeInteraction(choiceIndex);
                break;
        }

        if (result.success) {
            result.newState = 'regulated';
        }

        console.log(`Empathy action for ${piece.name} (${piece.emotionalState}): Choice ${choiceIndex}. Result: Trust ${result.trustChange}, New State: ${result.newState}`);
        return result;
    }

    /**
     * Defines the outcomes for interacting with an 'anxious' piece.
     */
    handleAnxiousInteraction(choiceIndex) {
        switch (choiceIndex) {
            case 0: return { success: true, trustChange: 2, message: "They seem to appreciate the reassurance." };
            case 1: return { success: true, trustChange: 1, message: "They feel heard." };
            case 2: return { success: false, trustChange: -1, message: "Space feels like abandonment right now." };
            case 3: return { success: false, trustChange: -3, message: "This invalidates their feelings, making it worse." };
            default: return { success: false, trustChange: 0, message: "Invalid choice." };
        }
    }

    /**
     * Defines the outcomes for interacting with a 'shutdown' piece.
     */
    handleShutdownInteraction(choiceIndex) {
        switch (choiceIndex) {
            case 0: return { success: true, trustChange: 2, message: "Your quiet presence is comforting." };
            case 1: return { success: true, trustChange: 1, message: "The gentle prompt helps them connect." };
            case 2: return { success: false, trustChange: -2, message: "Humor feels jarring and dismissive." };
            case 3: return { success: false, trustChange: -4, message: "The pressure causes them to withdraw further." };
            default: return { success: false, trustChange: 0, message: "Invalid choice." };
        }
    }

    /**
     * Defines the outcomes for interacting with a 'fight' piece.
     */
    handleFightInteraction(choiceIndex) {
        switch (choiceIndex) {
            case 0: return { success: true, trustChange: 2, message: "Feeling understood helps them regulate." };
            case 1: return { success: false, trustChange: -3, message: "This feels like an attack, escalating their anger." };
            case 2: return { success: false, trustChange: -4, message: "The threat confirms they are in danger." };
            case 3: return { success: false, trustChange: -2, message: "Escalating the conflict solves nothing." };
            default: return { success: false, trustChange: 0, message: "Invalid choice." };
        }
    }
    
    /**
     * NEW: Defines the outcomes for interacting with a 'freeze' piece.
     */
    handleFreezeInteraction(choiceIndex) {
        switch (choiceIndex) {
            case 0: // "Wait patiently."
                return { success: true, trustChange: 2, message: "Your patience gives them the time they need to come back to the present." };
            case 1: // "Gently state you're here."
                return { success: true, trustChange: 1, message: "The gentle reminder of your presence is a grounding anchor." };
            case 2: // "Describe the current moment."
                return { success: false, trustChange: -1, message: "The sensory input is too much right now, making it harder to focus." };
            case 3: // "Shake them to snap out of it."
                return { success: false, trustChange: -4, message: "The sudden, aggressive action is terrifying and deepens the freeze." };
            default:
                return { success: false, trustChange: 0, message: "Invalid choice." };
        }
    }
}

export default EmpathySystem;
