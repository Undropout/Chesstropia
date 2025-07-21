/**
 * @file DialogueSystem.js
 * A UI component for displaying sequences of dialogue as an overlay.
 */
class DialogueSystem {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.dialogueQueue = [];
        this.onCompleteCallback = null;
        this.dialogueContainer = null;
    }

    /**
     * Shows the dialogue box over the provided parent container.
     * @param {HTMLElement} parentContainer - The element to render the dialogue on top of.
     * @param {Array<object>} dialogue - The array of dialogue lines.
     * @param {Function} onComplete - The callback to execute when the dialogue is finished.
     */
    show(parentContainer, dialogue, onComplete) {
        if (!dialogue || dialogue.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        this.dialogueQueue = [...dialogue];
        this.onCompleteCallback = onComplete;

        // Create and append the container
        this.dialogueContainer = document.createElement('div');
        this.dialogueContainer.id = 'dialogue-container';
        parentContainer.appendChild(this.dialogueContainer);

        this.next();
    }

    next() {
        if (this.dialogueQueue.length === 0) {
            this.hide();
            return;
        }

        const currentLine = this.dialogueQueue.shift();
        this.dialogueContainer.innerHTML = `
            <div class="dialogue-box">
                <div class="dialogue-content">
                    <div class="dialogue-character">${currentLine.character}</div>
                    <p class="dialogue-text">${currentLine.text}</p>
                    <button id="dialogue-next-btn" class="menu-button">Next</button>
                </div>
            </div>
        `;

        document.getElementById('dialogue-next-btn').addEventListener('click', () => this.next(), { once: true });
    }

    hide() {
        if (this.dialogueContainer) {
            this.dialogueContainer.remove();
            this.dialogueContainer = null;
        }
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
            this.onCompleteCallback = null;
        }
    }
}

export default DialogueSystem;
