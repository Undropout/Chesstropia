/**
 * @file EmotionalHUD.js
 * Displays detailed information about a selected piece, including their portrait,
 * name, emotional state, and trust level. It's a key part of the UI for
 * understanding the emotional state of the game.
 */
class EmotionalHUD {
    /**
     * Initializes the EmotionalHUD.
     * @param {HTMLElement} container - The DOM element to render the HUD into.
     * @param {EventEmitter} eventEmitter - The central event bus.
     */
    constructor(container, eventEmitter) {
        this.container = container;
        this.eventEmitter = eventEmitter;
        this.activePiece = null;

        this.bindEvents();
        this.renderInitial();
    }

    /**
     * Binds to events to update the HUD.
     */
    bindEvents() {
        this.eventEmitter.on('pieceSelected', ({ piece }) => this.update(piece));
        this.eventEmitter.on('pieceDeselected', () => this.clear());
        this.eventEmitter.on('empathyRequired', ({ piece }) => this.update(piece));
        this.eventEmitter.on('trustChanged', ({ piece }) => this.updateIfActive(piece));
        this.eventEmitter.on('emotionalStateChanged', ({ piece }) => this.updateIfActive(piece));
        this.eventEmitter.on('gameOver', () => this.clear());
    }

    /**
     * Renders the initial empty state of the HUD.
     */
    renderInitial() {
        this.container.innerHTML = `
            <div class="hud-container">
                <div class="hud-header">UNIT STATUS</div>
                <div class="hud-content">
                    <p class="hud-placeholder">Select a friendly unit to view their status.</p>
                </div>
            </div>
        `;
    }

    /**
     * Updates the HUD to display information for a given piece.
     * @param {Piece} piece - The piece to display.
     */
    update(piece) {
        this.activePiece = piece;
        this.container.innerHTML = `
            <div class="hud-container active">
                <div class="hud-header">UNIT STATUS: ${piece.name}</div>
                <div class="hud-content">
                    <img src="${piece.portrait}" alt="Portrait of ${piece.name}" class="hud-portrait" onerror="this.onerror=null;this.src='assets/portraits/placeholder.png';">
                    <div class="hud-details">
                        <div class="hud-stat">
                            <strong>ICON:</strong>
                            <span>${piece.icon}</span>
                        </div>
                        <div class="hud-stat">
                            <strong>STATE:</strong>
                            <span id="hud-state" class="emotional-state-${piece.emotionalState}">${piece.emotionalState.toUpperCase()}</span>
                        </div>
                        <div class="hud-stat">
                            <strong>TRUST:</strong>
                            <span id="hud-trust">${this.getTrustLevelText(piece.trust)} (${piece.trust})</span>
                        </div>
                        <div class="hud-stat">
                            <strong>PERSONALITY:</strong>
                            <span>${piece.personality}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Updates the HUD only if the piece being changed is the one currently displayed.
     * @param {Piece} piece - The piece whose data has changed.
     */
    updateIfActive(piece) {
        if (this.activePiece && this.activePiece.id === piece.id) {
            this.update(piece);
        }
    }

    /**
     * Clears the HUD and returns it to the initial placeholder state.
     */
    clear() {
        this.activePiece = null;
        this.renderInitial();
    }

    /**
     * Converts the numerical trust value into a descriptive text.
     * @param {number} trustValue - The numerical trust value.
     * @returns {string} A descriptive string for the trust level.
     */
    getTrustLevelText(trustValue) {
        if (trustValue >= 9) return 'Devoted';
        if (trustValue >= 7) return 'High';
        if (trustValue >= 4) return 'Neutral';
        if (trustValue >= 1) return 'Low';
        if (trustValue >= -2) return 'Wavering';
        if (trustValue >= -4) return 'Distrustful';
        return 'Defecting';
    }
}

export default EmotionalHUD;
