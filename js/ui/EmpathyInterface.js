// Manages the empathy command selection interface
export class EmpathyInterface {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentPiece = null;
        this.selectedCommands = [];
        this.maxCommands = 3;
        this.responseCallback = null;
        
        this.setupInterface();
    }

    setupInterface() {
        this.container.className = 'empathy-interface';
        this.container.innerHTML = `
            <div class="empathy-header">
                <h3>EMPATHY_RESPONSE.EXE</h3>
                <div class="piece-status"></div>
            </div>
            <div class="empathy-prompt"></div>
            <div class="command-grid"></div>
            <div class="selected-commands"></div>
            <div class="empathy-actions">
                <button class="empathy-button send-btn" disabled>SEND</button>
                <button class="empathy-button clear-btn">CLEAR</button>
            </div>
        `;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Send button
        this.container.querySelector('.send-btn').addEventListener('click', () => {
            this.sendResponse();
        });
        
        // Clear button
        this.container.querySelector('.clear-btn').addEventListener('click', () => {
            this.clearSelection();
        });
        
        // Command selection
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('command-option')) {
                this.toggleCommand(e.target);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.isVisible()) return;
            
            if (e.key === 'Enter' && this.selectedCommands.length > 0) {
                this.sendResponse();
            } else if (e.key === 'Escape') {
                this.clearSelection();
            } else if (e.key >= '1' && e.key <= '9') {
                // Number keys select commands
                const index = parseInt(e.key) - 1;
                const options = this.container.querySelectorAll('.command-option');
                if (options[index]) {
                    this.toggleCommand(options[index]);
                }
            }
        });
    }

    show(options) {
        this.currentPiece = options.piece;
        this.context = options.context;
        
        // Update piece status
        this.updatePieceStatus(options.piece, options.state, options.dysregulationType);
        
        // Update prompt
        this.updatePrompt(options);
        
        // Render command options
        this.renderCommands(options.options);
        
        // Show interface
        this.container.classList.add('visible');
        
        // Focus for keyboard navigation
        this.container.focus();
    }

    hide() {
        this.container.classList.remove('visible');
        this.clearSelection();
        this.currentPiece = null;
    }

    isVisible() {
        return this.container.classList.contains('visible');
    }

    updatePieceStatus(piece, state, dysregulationType) {
        const statusEl = this.container.querySelector('.piece-status');
        
        const stateColors = {
            'anxious': 'var(--phosphor-amber)',
            'shutdown': 'var(--phosphor-cyan)',
            'fight': 'var(--phosphor-magenta)',
            'freeze': 'var(--phosphor-green)',
            'fawn': 'var(--phosphor-amber)'
        };
        
        statusEl.innerHTML = `
            <div class="piece-name">${piece.name}</div>
            <div class="emotional-state" style="color: ${stateColors[dysregulationType] || 'var(--primary)'}">
                <span class="state-icon">${this.getStateIcon(dysregulationType)}</span>
                <span class="state-text">${dysregulationType || state}</span>
            </div>
            <div class="trust-indicator">
                <span>Trust: </span>
                <span class="trust-bar-mini">
                    ${'█'.repeat(Math.max(0, piece.trust + 5))}${'░'.repeat(Math.max(0, 10 - (piece.trust + 5)))}
                </span>
                <span class="trust-number">${piece.trust}</span>
            </div>
        `;
    }

    getStateIcon(state) {
        const icons = {
            'anxious': '😰',
            'shutdown': '😶',
            'fight': '😠',
            'freeze': '🫨',
            'fawn': '🥺',
            'regulated': '😊'
        };
        return icons[state] || '❓';
    }

    updatePrompt(options) {
        const promptEl = this.container.querySelector('.empathy-prompt');
        
        const prompts = {
            'anxious': `${options.piece.name} is trembling with anxiety...`,
            'shutdown': `${options.piece.name} has gone quiet and distant...`,
            'fight': `${options.piece.name} is bristling with anger...`,
            'freeze': `${options.piece.name} is completely frozen...`,
            'fawn': `${options.piece.name} is desperately trying to please...`
        };
        
        const contextPrompts = {
            'selection': 'How do you respond?',
            'movement': 'They need support before they can move.'
        };
        
        promptEl.innerHTML = `
            <p class="state-description">${prompts[options.dysregulationType] || 'Your piece needs support.'}</p>
            <p class="context-prompt">${contextPrompts[options.context] || 'Choose your words carefully.'}</p>
            <p class="instruction">Select up to ${this.maxCommands} responses:</p>
        `;
    }

    renderCommands(commands) {
        const gridEl = this.container.querySelector('.command-grid');
        gridEl.innerHTML = '';
        
        commands.forEach((cmd, index) => {
            const commandEl = document.createElement('button');
            commandEl.className = 'command-option';
            if (cmd.harmful) {
                commandEl.classList.add('harmful');
            }
            
            commandEl.dataset.commandId = cmd.id;
            commandEl.dataset.commandText = cmd.text;
            
            // Phosphor styling based on command type
            const phosphorColors = {
                'validate': 'var(--phosphor-cyan)',
                'soothe': 'var(--phosphor-cyan)',
                'reframe': 'var(--phosphor-green)',
                'pause': 'var(--phosphor-amber)',
                'breathe': 'var(--phosphor-cyan)',
                'here': 'var(--phosphor-magenta)',
                'anger': 'var(--phosphor-magenta)',
                'dismiss': 'var(--phosphor-amber)',
                'rush': 'var(--phosphor-amber)'
            };
            
            commandEl.style.setProperty('--cmd-color', phosphorColors[cmd.id] || 'var(--primary)');
            
            commandEl.innerHTML = `
                <span class="cmd-number">${index + 1}</span>
                <span class="cmd-icon">${cmd.icon}</span>
                <span class="cmd-text">${cmd.text}</span>
                ${cmd.harmful ? '<span class="harmful-indicator">⚠️</span>' : ''}
            `;
            
            gridEl.appendChild(commandEl);
        });
    }

    toggleCommand(commandEl) {
        const commandId = commandEl.dataset.commandId;
        const commandText = commandEl.dataset.commandText;
        
        if (commandEl.classList.contains('selected')) {
            // Deselect
            commandEl.classList.remove('selected');
            this.selectedCommands = this.selectedCommands.filter(cmd => cmd.id !== commandId);
        } else {
            // Select (if under limit)
            if (this.selectedCommands.length < this.maxCommands) {
                commandEl.classList.add('selected');
                this.selectedCommands.push({
                    id: commandId,
                    text: commandText,
                    harmful: commandEl.classList.contains('harmful')
                });
            } else {
                // Flash warning
                this.showWarning(`Maximum ${this.maxCommands} commands allowed`);
            }
        }
        
        this.updateSelectedDisplay();
        this.updateSendButton();
    }

    updateSelectedDisplay() {
        const selectedEl = this.container.querySelector('.selected-commands');
        
        if (this.selectedCommands.length === 0) {
            selectedEl.innerHTML = '<p class="no-selection">No commands selected</p>';
        } else {
            selectedEl.innerHTML = `
                <p class="selection-label">Your response:</p>
                <div class="command-sentence">
                    "${this.selectedCommands.map(cmd => cmd.text).join('. ')}."
                </div>
                ${this.hasHarmfulCommand() ? `
                    <div class="harmful-warning">
                        ⚠️ Contains potentially harmful language
                    </div>
                ` : ''}
            `;
        }
    }

    hasHarmfulCommand() {
        return this.selectedCommands.some(cmd => cmd.harmful);
    }

    updateSendButton() {
        const sendBtn = this.container.querySelector('.send-btn');
        sendBtn.disabled = this.selectedCommands.length === 0;
        
        if (this.selectedCommands.length > 0) {
            sendBtn.classList.add('ready');
            if (this.hasHarmfulCommand()) {
                sendBtn.classList.add('harmful-selected');
            } else {
                sendBtn.classList.remove('harmful-selected');
            }
        } else {
            sendBtn.classList.remove('ready', 'harmful-selected');
        }
    }

    clearSelection() {
        this.selectedCommands = [];
        this.container.querySelectorAll('.command-option.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.updateSelectedDisplay();
        this.updateSendButton();
    }

    sendResponse() {
        if (this.selectedCommands.length === 0) return;
        
        // Prepare response data
        const response = {
            piece: this.currentPiece,
            command: this.selectedCommands[0].id, // Primary command
            modifiers: this.selectedCommands.map(cmd => cmd.text),
            hasHarmful: this.hasHarmfulCommand(),
            timestamp: Date.now()
        };
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('chesstropia:empathy_response', {
            detail: response
        }));
        
        // Visual feedback
        this.showResponseFeedback();
        
        // Hide interface after short delay
        setTimeout(() => {
            this.hide();
        }, 500);
    }

    showResponseFeedback() {
        const sendBtn = this.container.querySelector('.send-btn');
        sendBtn.textContent = 'SENDING...';
        sendBtn.classList.add('sending');
        
        // Add visual effect
        const selectedEl = this.container.querySelector('.selected-commands');
        selectedEl.classList.add('sending-effect');
    }

    showWarning(message) {
        const warning = document.createElement('div');
        warning.className = 'empathy-warning';
        warning.textContent = message;
        warning.style.color = 'var(--phosphor-amber)';
        
        this.container.appendChild(warning);
        
        setTimeout(() => {
            warning.classList.add('fade-out');
            setTimeout(() => warning.remove(), 500);
        }, 2000);
    }

    // Special command combinations that unlock unique responses
    checkSpecialCombinations() {
        const commandIds = this.selectedCommands.map(cmd => cmd.id).sort().join('+');
        
        const specialCombos = {
            'here+pause+validate': {
                name: 'Perfect Presence',
                bonus: 2,
                message: 'Your complete presence is felt'
            },
            'breathe+soothe+validate': {
                name: 'Anxiety Antidote',
                bonus: 3,
                message: 'The perfect response for anxiety'
            },
            'anger+channel+validate': {
                name: 'Righteous Fury',
                bonus: 2,
                message: 'You honor their anger'
            },
            'dismiss+rush': {
                name: 'Emotional Abandonment',
                bonus: -5,
                message: 'This will cause serious harm'
            }
        };
        
        return specialCombos[commandIds] || null;
    }

    // Tutorial mode
    showTutorial() {
        const tutorial = document.createElement('div');
        tutorial.className = 'empathy-tutorial';
        tutorial.innerHTML = `
            <div class="tutorial-content">
                <h4>EMPATHY SYSTEM TUTORIAL</h4>
                <ul>
                    <li>Select 1-3 phrases to respond</li>
                    <li>Order matters - they create a sentence</li>
                    <li>⚠️ marks harmful responses</li>
                    <li>Number keys for quick selection</li>
                    <li>Some combinations have special effects</li>
                </ul>
                <button class="empathy-button" onclick="this.parentElement.parentElement.remove()">
                    GOT IT
                </button>
            </div>
        `;
        
        this.container.appendChild(tutorial);
    }
}

// CSS for the empathy interface
const style = document.createElement('style');
style.textContent = `
    .empathy-interface {
        background: var(--crt-black);
        border: 1px solid var(--primary);
        padding: 1rem;
        position: relative;
        display: none;
    }
    
    .empathy-interface.visible {
        display: block;
    }
    
    .empathy-header {
        border-bottom: 1px solid var(--primary-dim);
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
    }
    
    .piece-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
    }
    
    .piece-name {
        font-weight: bold;
        color: var(--primary);
    }
    
    .emotional-state {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .trust-bar-mini {
        font-family: monospace;
        letter-spacing: -2px;
    }
    
    .empathy-prompt {
        margin: 1rem 0;
        padding: 0.5rem;
        border-left: 3px solid var(--primary-dim);
    }
    
    .command-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.5rem;
        margin: 1rem 0;
    }
    
    .command-option {
        background: var(--crt-black);
        border: 1px solid var(--cmd-color, var(--primary));
        color: var(--cmd-color, var(--primary));
        padding: 0.75rem;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        font-family: inherit;
    }
    
    .command-option:hover {
        background: var(--primary-dim);
        box-shadow: 0 0 10px var(--cmd-color);
    }
    
    .command-option.selected {
        background: var(--cmd-color);
        color: var(--crt-black);
        box-shadow: 0 0 20px var(--cmd-color);
    }
    
    .command-option.harmful {
        border-style: dashed;
    }
    
    .cmd-number {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
        font-size: 0.75rem;
        opacity: 0.5;
    }
    
    .cmd-icon {
        margin-right: 0.5rem;
        font-size: 1.2rem;
    }
    
    .selected-commands {
        min-height: 3rem;
        padding: 1rem;
        background: var(--primary-dim);
        border: 1px solid var(--primary);
        margin: 1rem 0;
    }
    
    .command-sentence {
        font-style: italic;
        margin: 0.5rem 0;
        color: var(--primary);
        text-shadow: 0 0 5px var(--primary);
    }
    
    .harmful-warning {
        color: var(--phosphor-amber);
        font-size: 0.9rem;
        margin-top: 0.5rem;
        animation: warning-pulse 1s ease-in-out infinite;
    }
    
    @keyframes warning-pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
    
    .empathy-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    .send-btn.ready {
        box-shadow: 0 0 10px var(--primary);
    }
    
    .send-btn.harmful-selected {
        border-color: var(--phosphor-amber);
        color: var(--phosphor-amber);
    }
    
    .sending-effect {
        animation: send-pulse 0.5s ease-out;
    }
    
    @keyframes send-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);