/**
 * @file EmpathyInterface.js
 * Renders the contextual empathy options when a player interacts with a
 * dysregulated piece. This is the primary interface for the core
 * emotional gameplay loop.
 */
class EmpathyInterface {
    /**
     * Initializes the EmpathyInterface.
     * @param {HTMLElement} container - The DOM element to render the interface into.
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
     * Binds to events to show or hide the interface.
     */
    bindEvents() {
        this.eventEmitter.on('empathyRequired', ({ piece }) => this.show(piece));
        
        // Hide the interface after a choice is made or the context changes.
        this.eventEmitter.on('empathyResult', () => this.clear());
        this.eventEmitter.on('pieceDeselected', () => this.clear());
        this.eventEmitter.on('gameOver', () => this.clear());
    }

    /**
     * Renders the initial placeholder state.
     */
    renderInitial() {
        this.container.innerHTML = `
            <div class="empathy-container">
                <div class="empathy-header">EMPATHY ACTION</div>
                <div class="empathy-content">
                    <!-- This area will be populated with empathy options -->
                </div>
            </div>
        `;
    }

    /**
     * Shows the empathy interface with options relevant to the piece's state.
     * @param {Piece} piece - The piece requiring an empathy action.
     */
    show(piece) {
        this.activePiece = piece;

        // In a full implementation, these options would be dynamically generated
        // by the EmpathySystem based on the piece's state, personality, and trust.
        // For now, we'll use placeholder options.
        const options = this.getPlaceholderOptions(piece.emotionalState);

        this.container.innerHTML = `
            <div class="empathy-container active">
                <div class="empathy-header">ACTION REQUIRED: ${piece.name} is ${piece.emotionalState.toUpperCase()}</div>
                <div class="empathy-content">
                    <p>What will you do?</p>
                    <div class="empathy-options">
                        ${options.map((opt, index) => `
                            <button class="empathy-choice" data-choice-id="${index}">${opt.text}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.addOptionListeners();
    }

    /**
     * Adds click listeners to the newly rendered empathy option buttons.
     */
    addOptionListeners() {
        this.container.querySelectorAll('.empathy-choice').forEach(button => {
            button.addEventListener('click', (e) => {
                const choiceId = e.target.dataset.choiceId;
                this.eventEmitter.emit('empathyResponseChosen', {
                    pieceId: this.activePiece.id,
                    choice: choiceId // The EmpathySystem will interpret this ID.
                });
            });
        });
    }

    /**
     * Generates placeholder empathy options based on emotional state.
     * @param {string} state - The piece's current emotional state.
     * @returns {Array<{text: string}>} An array of option objects.
     */
    getPlaceholderOptions(state) {
        switch (state) {
            case 'anxious':
                return [
                    { text: "Offer reassurance." },
                    { text: "Ask what's wrong." },
                    { text: "Give them space." },
                    { text: "Tell them to calm down." }
                ];
            case 'shutdown':
                 return [
                    { text: "Sit with them in silence." },
                    { text: "Ask a gentle question." },
                    { text: "Try to make them laugh." },
                    { text: "Demand they snap out of it." }
                ];
            case 'fight':
                return [
                    { text: "Validate their anger." },
                    { text: "Tell them they're overreacting." },
                    { text: "Threaten consequences." },
                    { text: "Match their energy." }
                ];
            default:
                return [
                    { text: "Generic Option 1" },
                    { text: "Generic Option 2" },
                    { text: "Generic Option 3" },
                    { text: "Generic Option 4" }
                ];
        }
    }

    /**
     * Clears the interface and resets its state.
     */
    clear() {
        this.activePiece = null;
        this.renderInitial();
    }
}

export default EmpathyInterface;
