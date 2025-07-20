/**
 * @file Piece.js
 * Represents a single game piece in ChessTropia. Each piece has both standard
 * checkers properties (owner, king status) and unique emotional properties
 * (emotional state, trust, personality).
 */

class Piece {
    /**
     * Initializes a new Piece instance.
     * @param {string} id - A unique identifier for the piece (e.g., 'player_0').
     * @param {string} owner - The owner of the piece ('player' or 'opponent').
     * @param {object} team - The team data object the piece belongs to.
     * @param {object} pieceData - The specific personality and character data for this piece.
     * @param {EventEmitter} eventEmitter - The central event bus.
     */
    constructor(id, owner, team, pieceData, eventEmitter) {
        this.id = id;
        this.owner = owner;
        this.team = team;
        this.eventEmitter = eventEmitter;

        // Character-specific properties from data files
        this.name = pieceData.name;
        this.personality = pieceData.personality;
        this.icon = pieceData.icon;
        this.portrait = pieceData.portrait || 'assets/portraits/placeholder.png';

        // Game state properties
        this.isKing = false;
        this.emotionalState = 'regulated'; // e.g., 'regulated', 'anxious', 'shutdown'
        this.trust = 5; // Range from -5 (defecting) to 10 (breakthrough)
    }

    /**
     * Determines the possible move directions based on owner and king status.
     * @returns {Array<{row: number, col: number}>} An array of direction vectors.
     */
    getMoveDirections() {
        const directions = [];
        const forwardDir = this.owner === 'player' ? -1 : 1;

        // Standard forward diagonal moves
        directions.push({ row: forwardDir, col: -1 });
        directions.push({ row: forwardDir, col: 1 });

        // Kings can also move backward
        if (this.isKing) {
            const backwardDir = -forwardDir;
            directions.push({ row: backwardDir, col: -1 });
            directions.push({ row: backwardDir, col: 1 });
        }

        return directions;
    }

    /**
     * Promotes the piece to a king.
     * This grants emotional resilience as a core mechanic.
     */
    makeKing() {
        if (!this.isKing) {
            this.isKing = true;
            // Future enhancement: Add a passive "emotional resilience" buff.
            console.log(`${this.name} has been kinged!`);
            this.eventEmitter.emit('pieceKinged', { piece: this });
        }
    }

    /**
     * Updates the piece's trust level, clamping it within the defined range.
     * @param {number} amount - The amount to change the trust by (can be negative).
     */
    updateTrust(amount) {
        this.trust += amount;
        // Clamp trust between -5 and 10
        this.trust = Math.max(-5, Math.min(10, this.trust));
        
        console.log(`${this.name}'s trust is now ${this.trust}`);
        this.eventEmitter.emit('trustChanged', { piece: this, newTrust: this.trust });

        if (this.trust <= -5) {
            this.handleDefection();
        }
    }

    /**
     * Changes the piece's emotional state.
     * @param {string} newState - The new emotional state.
     */
    updateEmotionalState(newState) {
        if (this.emotionalState !== newState) {
            this.emotionalState = newState;
            console.log(`${this.name} is now feeling ${newState}.`);
            this.eventEmitter.emit('emotionalStateChanged', { piece: this, newState: this.emotionalState });
        }
    }

    /**
     * Checks if the piece is in a state that prevents normal movement.
     * @returns {boolean} True if the piece is not 'regulated'.
     */
    isDysregulated() {
        return this.emotionalState !== 'regulated';
    }

    /**
     * Handles the logic for when a piece's trust drops too low.
     * The piece might defect to the other side.
     */
    handleDefection() {
        console.warn(`${this.name} is defecting due to low trust!`);
        // This is a major game event. The GameController will need to handle this.
        this.eventEmitter.emit('pieceDefected', { piece: this });
        // The actual change of ownership would be handled by the GameController.
    }

    /**
     * Creates a simple object representation of the piece's current state.
     * Useful for AI, saving, and debugging.
     * @returns {object} A plain object with key properties.
     */
    serialize() {
        return {
            id: this.id,
            owner: this.owner,
            name: this.name,
            isKing: this.isKing,
            emotionalState: this.emotionalState,
            trust: this.trust,
            personality: this.personality,
        };
    }
}

export default Piece;
