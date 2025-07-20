/**
 * @file StormSystem.js
 * Manages "Emotional Storms," which are collective crises that affect all
 * pieces on the board. This system adds a dynamic, unpredictable challenge
 * to the game, testing the overall emotional resilience of a player's team.
 */
class StormSystem {
    /**
     * Initializes the StormSystem.
     * @param {EventEmitter} eventEmitter - The central event bus.
     * @param {Piece[]} pieces - A reference to all pieces in the game.
     */
    constructor(eventEmitter, pieces) {
        this.eventEmitter = eventEmitter;
        this.pieces = pieces;
        
        // Storm Timing
        this.turnsUntilNextStorm = this.getRandomTurnTimer(15, 25); // A storm will occur in 15-25 turns.
        this.stormDuration = 0; // How many turns the storm will last.

        // Storm State
        this.stormIsActive = false;
        this.stormType = null;

        this.bindEvents();
    }

    /**
     * Binds to game events to track turn progression.
     */
    bindEvents() {
        // We'll listen for the turn to change to countdown to the next storm.
        this.eventEmitter.on('turnChanged', this.handleTurnChange.bind(this));
    }

    /**
     * Generates a random number of turns within a given range.
     * @param {number} min - The minimum number of turns.
     * @param {number} max - The maximum number of turns.
     * @returns {number} A random integer within the range.
     */
    getRandomTurnTimer(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Handles the change of a turn, managing the entire storm lifecycle.
     * This is the central clock for the storm system.
     */
    handleTurnChange({ currentPlayer }) {
        // We only advance the storm clock once per full round (at the start of the player's turn).
        if (currentPlayer !== 'player') {
            return;
        }

        if (this.stormIsActive) {
            this.stormDuration--;
            this.eventEmitter.emit('stormTurnAdvanced', { stormType: this.stormType, turnsRemaining: this.stormDuration });
            console.log(`Storm of ${this.stormType} continues. Turns remaining: ${this.stormDuration}`);

            if (this.stormDuration <= 0) {
                this.endStorm();
            }
        } else {
            this.turnsUntilNextStorm--;
            if (this.turnsUntilNextStorm <= 0) {
                this.startStorm();
            }
        }
    }

    /**
     * Initiates a new emotional storm.
     */
    startStorm() {
        this.stormIsActive = true;
        this.stormDuration = this.getRandomTurnTimer(3, 5); // Storm lasts 3-5 full rounds.
        
        const stormTypes = ['Abandonment', 'Rage', 'Grief', 'Panic', 'Dissociation'];
        this.stormType = stormTypes[Math.floor(Math.random() * stormTypes.length)];

        this.eventEmitter.emit('stormStarted', { 
            stormType: this.stormType,
            duration: this.stormDuration 
        });
        console.log(`An Emotional Storm of ${this.stormType} has started! It will last for ${this.stormDuration} rounds.`);

        // Apply the initial effects of the storm.
        this.applyStormEffects();
    }

    /**
     * Applies the negative emotional effects of the storm to all pieces.
     * Pieces with higher trust or king status might resist the effects.
     */
    applyStormEffects() {
        this.pieces.forEach(piece => {
            // Don't affect pieces that are already dysregulated.
            if (piece.isDysregulated()) return;

            let vulnerability = 0.6; // Base 60% chance to be affected.

            // High trust provides significant resistance.
            if (piece.trust >= 7) vulnerability -= 0.3;
            // Being a king provides resilience.
            if (piece.isKing) vulnerability -= 0.2;
            // Low trust increases vulnerability.
            if (piece.trust <= 2) vulnerability += 0.2;

            if (Math.random() < vulnerability) {
                // The type of storm determines the emotional state it triggers.
                let triggeredState = 'anxious';
                switch (this.stormType) {
                    case 'Abandonment': triggeredState = 'anxious'; break;
                    case 'Rage': triggeredState = 'fight'; break;
                    case 'Grief': triggeredState = 'shutdown'; break;
                    case 'Panic': triggeredState = 'freeze'; break;
                    case 'Dissociation': triggeredState = 'freeze'; break; // Freeze is a good proxy for dissociation
                }
                piece.updateEmotionalState(triggeredState);
            }
        });
    }

    /**
     * Ends the current storm and resets the system for the next countdown.
     */
    endStorm() {
        this.eventEmitter.emit('stormEnded', { stormType: this.stormType });
        console.log(`The Storm of ${this.stormType} has ended.`);

        // Reset for the next one
        this.stormIsActive = false;
        this.stormType = null;
        this.stormDuration = 0;
        this.turnsUntilNextStorm = this.getRandomTurnTimer(15, 25);
    }
}

export default StormSystem;
