/**
 * @file DialogueSystem.js
 * A UI component for displaying sequences of dialogue.
 */
class DialogueSystem {
    constructor(container, eventEmitter) {
        this.container = container;
        this.eventEmitter = eventEmitter;
        this.dialogueQueue = [];
        this.currentCallback = null;
        this.isVisible = false;
        this.dialogueBox = null;

        this.bindEvents();
    }

    bindEvents() {
        this.eventEmitter.on('showDialogue', this.show.bind(this));
    }

    show({ dialogue, onComplete }) {
        if (!dialogue || dialogue.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        this.dialogueQueue = [...dialogue];
        this.currentCallback = onComplete;
        this.isVisible = true;

        this.render();
        this.next();
    }

    render() {
        if (!this.dialogueBox) {
            this.dialogueBox = document.createElement('div');
            this.dialogueBox.className = 'dialogue-box';
            this.container.appendChild(this.dialogueBox);
        }
        this.dialogueBox.style.display = this.isVisible ? 'flex' : 'none';
    }

    next() {
        if (this.dialogueQueue.length === 0) {
            this.hide();
            return;
        }

        const currentLine = this.dialogueQueue.shift();
        this.dialogueBox.innerHTML = `
            <div class="dialogue-content">
                <div class="dialogue-character">${currentLine.character}</div>
                <p class="dialogue-text">${currentLine.text}</p>
                <button id="dialogue-next-btn" class="menu-button">Next</button>
            </div>
        `;

        document.getElementById('dialogue-next-btn').addEventListener('click', () => this.next(), { once: true });
    }

    hide() {
        this.isVisible = false;
        this.render();
        if (this.currentCallback) {
            this.currentCallback();
            this.currentCallback = null;
        }
    }
}

export default DialogueSystem;
