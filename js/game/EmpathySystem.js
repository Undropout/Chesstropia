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
     * @returns {object} An object describing the outcome, e.g., 
     * { success: boolean, trustChange: number, newState: string, message: string }.
     */
    handleInteraction(piece, choiceId) {
        const choiceIndex = parseInt(choiceId);
        let result = {
            success: false,
            trustChange: 0,
            newState: piece.emotionalState,
            message: "The response had no effect."
        };

        // The effectiveness of a choice depends on the piece's current emotional state.
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
            // Add cases for 'freeze', 'fawn', etc. as they are implemented.
        }

        // A critical success can lead to a breakthrough (instant regulation and high trust boost).
        // A critical failure can lead to a trust catastrophe.
        // For now, we'll stick to simple success/failure.

        if (result.success) {
            result.newState = 'regulated';
        }

        console.log(`Empathy action for ${piece.name} (${piece.emotionalState}): Choice ${choiceIndex}. Result: Trust ${result.trustChange}, New State: ${result.newState}`);
        return result;
    }

    /**
     * Defines the outcomes for interacting with an 'anxious' piece.
     * @param {number} choiceIndex - The player's choice.
     * @returns {object} The interaction result.
     */
    handleAnxiousInteraction(choiceIndex) {
        switch (choiceIndex) {
            case 0: // "Offer reassurance."
                return { success: true, trustChange: 2, message: "They seem to appreciate the reassurance." };
            case 1: // "Ask what's wrong."
                return { success: true, trustChange: 1, message: "They feel heard." };
            case 2: // "Give them space."
                return { success: false, trustChange: -1, message: "Space feels like abandonment right now." };
            case 3: // "Tell them to calm down."
                return { success: false, trustChange: -3, message: "This invalidates their feelings, making it worse." };
            default:
                return { success: false, trustChange: 0, message: "Invalid choice." };
        }
    }

    /**
     * Defines the outcomes for interacting with a 'shutdown' piece.
     * @param {number} choiceIndex - The player's choice.
     * @returns {object} The interaction result.
     */
    handleShutdownInteraction(choiceIndex) {
        switch (choiceIndex) {
            case 0: // "Sit with them in silence."
                return { success: true, trustChange: 2, message: "Your quiet presence is comforting." };
            case 1: // "Ask a gentle question."
                return { success: true, trustChange: 1, message: "The gentle prompt helps them connect." };
            case 2: // "Try to make them laugh."
                return { success: false, trustChange: -2, message: "Humor feels jarring and dismissive." };
            case 3: // "Demand they snap out of it."
                return { success: false, trustChange: -4, message: "The pressure causes them to withdraw further." };
            default:
                return { success: false, trustChange: 0, message: "Invalid choice." };
        }
    }

    /**
     * Defines the outcomes for interacting with a 'fight' piece.
     * @param {number} choiceIndex - The player's choice.
     * @returns {object} The interaction result.
     */
    handleFightInteraction(choiceIndex) {
        switch (choiceIndex) {
            case 0: // "Validate their anger."
                return { success: true, trustChange: 2, message: "Feeling understood helps them regulate." };
            case 1: // "Tell them they're overreacting."
                return { success: false, trustChange: -3, message: "This feels like an attack, escalating their anger." };
            case 2: // "Threaten consequences."
                return { success: false, trustChange: -4, message: "The threat confirms they are in danger." };
            case 3: // "Match their energy."
                return { success: false, trustChange: -2, message: "Escalating the conflict solves nothing." };
            default:
                return { success: false, trustChange: 0, message: "Invalid choice." };
        }
    }
}

export default EmpathySystem;
