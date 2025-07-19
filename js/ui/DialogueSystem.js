// Manages piece conversations and emotional dialogue
export class DialogueSystem {
    constructor() {
        this.activeDialogue = null;
        this.dialogueHistory = [];
        this.portraitCache = new Map();
        this.typewriterSpeed = 30; // ms per character
        
        this.createDialogueContainer();
        this.loadDialogueData();
    }

    createDialogueContainer() {
        const container = document.createElement('div');
        container.id = 'dialogue-system';
        container.className = 'dialogue-system hidden';
        container.innerHTML = `
            <div class="dialogue-box">
                <div class="dialogue-portrait">
                    <canvas id="portrait-canvas" width="128" height="128"></canvas>
                    <div class="portrait-scanlines"></div>
                </div>
                <div class="dialogue-content">
                    <div class="speaker-name"></div>
                    <div class="dialogue-text"></div>
                    <div class="dialogue-choices"></div>
                </div>
                <div class="dialogue-controls">
                    <span class="continue-indicator">▼</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.container = container;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Click to continue
        this.container.addEventListener('click', (e) => {
            if (!e.target.classList.contains('dialogue-choice')) {
                this.advanceDialogue();
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isActive()) return;
            
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.advanceDialogue();
            } else if (e.key >= '1' && e.key <= '9') {
                // Number keys for choices
                const choiceIndex = parseInt(e.key) - 1;
                this.selectChoice(choiceIndex);
            }
        });
    }

    async loadDialogueData() {
        // In a real implementation, this would load from files
        this.dialogueTemplates = {
            anxiety_move_block: [
                {
                    speaker: "{piece}",
                    text: "I... I can't move there. What if something bad happens?",
                    emotion: "anxious"
                },
                {
                    speaker: "{piece}",
                    text: "My heart is racing. Everyone's watching me...",
                    emotion: "anxious"
                }
            ],
            
            trust_breakthrough: [
                {
                    speaker: "{piece}",
                    text: "You know what? I trust you. Let's do this together.",
                    emotion: "confident"
                },
                {
                    speaker: "{piece}",
                    text: "Thank you for being patient with me. I feel... safer now.",
                    emotion: "grateful"
                }
            ],
            
            capture_trauma: [
                {
                    speaker: "{piece}",
                    text: "I... I had to. But they looked so scared...",
                    emotion: "guilty"
                },
                {
                    speaker: "{piece}",
                    text: "This isn't who I want to be. Violence isn't the answer.",
                    emotion: "conflicted"
                }
            ],
            
            defection_warning: [
                {
                    speaker: "{piece}",
                    text: "Why should I keep listening to you? You don't understand me.",
                    emotion: "angry"
                },
                {
                    speaker: "{piece}",
                    text: "Maybe the other side would treat me better...",
                    emotion: "hurt"
                }
            ],
            
            storm_fear: [
                {
                    speaker: "{piece}",
                    text: "I can feel it coming... the memories... I can't breathe...",
                    emotion: "panicked"
                },
                {
                    speaker: "{piece}",
                    text: "Not again. Please, not again. I thought I was past this.",
                    emotion: "desperate"
                }
            ],
            
            companion_support: [
                {
                    speaker: "{piece1}",
                    text: "Hey, {piece2}. I'm here. You're not alone.",
                    emotion: "supportive"
                },
                {
                    speaker: "{piece2}",
                    text: "You... you really mean that?",
                    emotion: "vulnerable"
                },
                {
                    speaker: "{piece1}",
                    text: "Always. We're a team, remember?",
                    emotion: "warm"
                }
            ]
        };
    }

    async showDialogue(type, context = {}) {
        if (this.activeDialogue) return;
        
        const template = this.dialogueTemplates[type];
        if (!template) return;
        
        // Process template with context
        const dialogue = this.processTemplate(template, context);
        
        this.activeDialogue = {
            type: type,
            context: context,
            messages: dialogue,
            currentIndex: 0
        };
        
        // Show container
        this.container.classList.remove('hidden');
        
        // Display first message
        await this.displayMessage(dialogue[0]);
    }

    processTemplate(template, context) {
        return template.map(message => {
            let processedText = message.text;
            let processedSpeaker = message.speaker;
            
            // Replace placeholders
            Object.keys(context).forEach(key => {
                const placeholder = `{${key}}`;
                if (typeof context[key] === 'object' && context[key].name) {
                    processedText = processedText.replace(placeholder, context[key].name);
                    processedSpeaker = processedSpeaker.replace(placeholder, context[key].name);
                } else {
                    processedText = processedText.replace(placeholder, context[key]);
                    processedSpeaker = processedSpeaker.replace(placeholder, context[key]);
                }
            });
            
            return {
                ...message,
                text: processedText,
                speaker: processedSpeaker
            };
        });
    }

    async displayMessage(message) {
        // Update speaker name
        const speakerEl = this.container.querySelector('.speaker-name');
        speakerEl.textContent = message.speaker;
        speakerEl.style.color = this.getEmotionColor(message.emotion);
        
        // Update portrait
        await this.updatePortrait(message.speaker, message.emotion);
        
        // Clear previous text
        const textEl = this.container.querySelector('.dialogue-text');
        textEl.textContent = '';
        
        // Typewriter effect
        await this.typewriterText(message.text, textEl);
        
        // Show choices if available
        if (message.choices) {
            this.displayChoices(message.choices);
        } else {
            this.hideChoices();
        }
        
        // Show continue indicator
        this.showContinueIndicator();
        
        // Add to history
        this.dialogueHistory.push({
            speaker: message.speaker,
            text: message.text,
            timestamp: Date.now()
        });
    }

    async typewriterText(text, element) {
        const chars = text.split('');
        
        for (let i = 0; i < chars.length; i++) {
            element.textContent += chars[i];
            
            // Variable speed for punctuation
            let delay = this.typewriterSpeed;
            if (chars[i] === '.' || chars[i] === '!' || chars[i] === '?') {
                delay *= 3;
            } else if (chars[i] === ',') {
                delay *= 2;
            }
            
            await this.delay(delay);
        }
    }

    async updatePortrait(speaker, emotion) {
        const canvas = document.getElementById('portrait-canvas');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 128, 128);
        
        // Generate or load portrait
        const portrait = await this.getPortrait(speaker, emotion);
        
        if (portrait) {
            ctx.drawImage(portrait, 0, 0, 128, 128);
        } else {
            // Generate procedural portrait
            this.generateProceduralPortrait(ctx, speaker, emotion);
        }
        
        // Apply CRT effect
        this.applyCRTEffect(ctx);
    }

    generateProceduralPortrait(ctx, speaker, emotion) {
        // Set phosphor color based on emotion
        const emotionColors = {
            'anxious': '#ffcc00',
            'angry': '#ff00ff',
            'calm': '#00ffff',
            'happy': '#00ff00',
            'guilty': '#ff00ff',
            'desperate': '#ffcc00',
            'supportive': '#00ffff',
            'vulnerable': '#ffcc00',
            'warm': '#00ff00'
        };
        
        const color = emotionColors[emotion] || '#00ff00';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
        
        // Simple geometric face
        // Head
        ctx.beginPath();
        ctx.arc(64, 64, 40, 0, Math.PI * 2);
        ctx.stroke();
        
        // Eyes based on emotion
        this.drawEyes(ctx, emotion);
        
        // Mouth based on emotion
        this.drawMouth(ctx, emotion);
        
        // Add emotional indicators
        this.drawEmotionalIndicators(ctx, emotion);
    }

    drawEyes(ctx, emotion) {
        switch(emotion) {
            case 'anxious':
            case 'desperate':
                // Wide eyes
                ctx.beginPath();
                ctx.arc(50, 55, 8, 0, Math.PI * 2);
                ctx.arc(78, 55, 8, 0, Math.PI * 2);
                ctx.stroke();
                // Pupils
                ctx.beginPath();
                ctx.arc(50, 55, 3, 0, Math.PI * 2);
                ctx.arc(78, 55, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'angry':
                // Narrowed eyes
                ctx.beginPath();
                ctx.moveTo(45, 50);
                ctx.lineTo(55, 55);
                ctx.moveTo(73, 55);
                ctx.lineTo(83, 50);
                ctx.stroke();
                break;
                
            case 'happy':
            case 'warm':
                // Curved happy eyes
                ctx.beginPath();
                ctx.arc(50, 55, 5, Math.PI, 0, true);
                ctx.arc(78, 55, 5, Math.PI, 0, true);
                ctx.stroke();
                break;
                
            default:
                // Normal eyes
                ctx.beginPath();
                ctx.arc(50, 55, 5, 0, Math.PI * 2);
                ctx.arc(78, 55, 5, 0, Math.PI * 2);
                ctx.fill();
        }
    }

    drawMouth(ctx, emotion) {
        switch(emotion) {
            case 'anxious':
            case 'desperate':
                // Worried frown
                ctx.beginPath();
                ctx.arc(64, 85, 15, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
                break;
                
            case 'angry':
                // Angry line
                ctx.beginPath();
                ctx.moveTo(50, 80);
                ctx.lineTo(78, 80);
                ctx.stroke();
                break;
                
            case 'happy':
            case 'warm':
            case 'supportive':
                // Smile
                ctx.beginPath();
                ctx.arc(64, 70, 15, 0.2 * Math.PI, 0.8 * Math.PI, true);
                ctx.stroke();
                break;
                
            case 'guilty':
            case 'vulnerable':
                // Small worried mouth
                ctx.beginPath();
                ctx.ellipse(64, 80, 8, 5, 0, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            default:
                // Neutral line
                ctx.beginPath();
                ctx.moveTo(55, 80);
                ctx.lineTo(73, 80);
                ctx.stroke();
        }
    }

    drawEmotionalIndicators(ctx, emotion) {
        switch(emotion) {
            case 'anxious':
                // Sweat drops
                ctx.beginPath();
                ctx.arc(90, 40, 3, 0, Math.PI * 2);
                ctx.arc(95, 50, 2, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'angry':
                // Anger marks
                ctx.beginPath();
                ctx.moveTo(85, 35);
                ctx.lineTo(90, 30);
                ctx.moveTo(90, 35);
                ctx.lineTo(95, 30);
                ctx.stroke();
                break;
                
            case 'desperate':
                // Tears
                ctx.beginPath();
                ctx.moveTo(45, 65);
                ctx.lineTo(43, 75);
                ctx.moveTo(83, 65);
                ctx.lineTo(85, 75);
                ctx.stroke();
                break;
        }
    }

    applyCRTEffect(ctx) {
        // Add scanlines
        const imageData = ctx.getImageData(0, 0, 128, 128);
        const data = imageData.data;
        
        for (let y = 0; y < 128; y += 2) {
            for (let x = 0; x < 128; x++) {
                const index = (y * 128 + x) * 4;
                data[index] *= 0.8;     // R
                data[index + 1] *= 0.8; // G
                data[index + 2] *= 0.8; // B
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Add slight glow
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.1;
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    getEmotionColor(emotion) {
        const colors = {
            'anxious': 'var(--phosphor-amber)',
            'angry': 'var(--phosphor-magenta)',
            'calm': 'var(--phosphor-cyan)',
            'happy': 'var(--phosphor-green)',
            'guilty': 'var(--phosphor-magenta)',
            'desperate': 'var(--phosphor-amber)',
            'supportive': 'var(--phosphor-cyan)',
            'vulnerable': 'var(--phosphor-amber)',
            'warm': 'var(--phosphor-green)',
            'confident': 'var(--phosphor-green)',
            'grateful': 'var(--phosphor-cyan)',
            'conflicted': 'var(--phosphor-magenta)',
            'hurt': 'var(--phosphor-amber)',
            'panicked': 'var(--phosphor-amber)'
        };
        
        return colors[emotion] || 'var(--primary)';
    }

    displayChoices(choices) {
        const choicesEl = this.container.querySelector('.dialogue-choices');
        choicesEl.innerHTML = '';
        choicesEl.classList.remove('hidden');
        
        choices.forEach((choice, index) => {
            const choiceEl = document.createElement('button');
            choiceEl.className = 'dialogue-choice';
            choiceEl.dataset.index = index;
            
            choiceEl.innerHTML = `
                <span class="choice-number">${index + 1}.</span>
                <span class="choice-text">${choice.text}</span>
                ${choice.empathy ? `<span class="empathy-indicator">♥ +${choice.empathy}</span>` : ''}
            `;
            
            choiceEl.addEventListener('click', () => this.selectChoice(index));
            choicesEl.appendChild(choiceEl);
        });
    }

    hideChoices() {
        const choicesEl = this.container.querySelector('.dialogue-choices');
        choicesEl.classList.add('hidden');
    }

    selectChoice(index) {
        const choices = this.activeDialogue.messages[this.activeDialogue.currentIndex].choices;
        if (!choices || !choices[index]) return;
        
        const choice = choices[index];
        
        // Process choice effects
        if (choice.effect) {
            this.processChoiceEffect(choice.effect);
        }
        
        // Continue dialogue if there's a next branch
        if (choice.next) {
            // Load next dialogue branch
            this.showDialogue(choice.next, this.activeDialogue.context);
        } else {
            // End dialogue
            this.endDialogue();
        }
    }

    processChoiceEffect(effect) {
        // Dispatch event for game state to handle
        window.dispatchEvent(new CustomEvent('chesstropia:dialogue_choice', {
            detail: effect
        }));
    }

    advanceDialogue() {
        if (!this.activeDialogue) return;
        
        const currentMessage = this.activeDialogue.messages[this.activeDialogue.currentIndex];
        
        // Don't advance if there are choices
        if (currentMessage.choices) return;
        
        this.activeDialogue.currentIndex++;
        
        if (this.activeDialogue.currentIndex < this.activeDialogue.messages.length) {
            // Show next message
            this.displayMessage(this.activeDialogue.messages[this.activeDialogue.currentIndex]);
        } else {
            // End dialogue
            this.endDialogue();
        }
    }

    showContinueIndicator() {
        const indicator = this.container.querySelector('.continue-indicator');
        indicator.classList.remove('hidden');
        indicator.style.animation = 'pulse 1s ease-in-out infinite';
    }

    endDialogue() {
        this.container.classList.add('hidden');
        this.activeDialogue = null;
        
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('chesstropia:dialogue_complete'));
    }

    isActive() {
        return this.activeDialogue !== null;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getPortrait(speaker, emotion) {
        // In a real implementation, this would load actual portrait files
        // For now, return null to use procedural generation
        return null;
    }

    // Special dialogue sequences
    async showBreakthroughMoment(piece) {
        const dialogue = [
            {
                speaker: piece.name,
                text: "I... I think I understand now.",
                emotion: "vulnerable"
            },
            {
                speaker: piece.name,
                text: "All this time, I was so afraid of being hurt again.",
                emotion: "vulnerable"
            },
            {
                speaker: piece.name,
                text: "But you never gave up on me. Even when I pushed you away.",
                emotion: "grateful"
            },
            {
                speaker: piece.name,
                text: "Thank you. I feel... different. Stronger. Not alone.",
                emotion: "confident"
            }
        ];
        
        this.activeDialogue = {
            type: 'breakthrough',
            context: { piece },
            messages: dialogue,
            currentIndex: 0
        };
        
        this.container.classList.remove('hidden');
        await this.displayMessage(dialogue[0]);
    }

    async showDefectionDialogue(piece) {
        const dialogue = [
            {
                speaker: piece.name,
                text: "I can't do this anymore.",
                emotion: "hurt"
            },
            {
                speaker: piece.name,
                text: "You keep pushing me, ignoring how I feel.",
                emotion: "angry"
            },
            {
                speaker: piece.name,
                text: "Maybe they'll understand me better...",
                emotion: "desperate",
                choices: [
                    {
                        text: "Please, give me another chance",
                        empathy: 1,
                        effect: { type: 'last_chance', piece: piece }
                    },
                    {
                        text: "I'm sorry I failed you",
                        empathy: 2,
                        effect: { type: 'apologize', piece: piece }
                    },
                    {
                        text: "Fine, go then",
                        empathy: -3,
                        effect: { type: 'dismiss', piece: piece }
                    }
                ]
            }
        ];
        
        this.activeDialogue = {
            type: 'defection',
            context: { piece },
            messages: dialogue,
            currentIndex: 0
        };
        
        this.container.classList.remove('hidden');
        await this.displayMessage(dialogue[0]);
    }
}

// CSS for dialogue system
const style = document.createElement('style');
style.textContent = `
    .dialogue-system {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 800px;
        z-index: 1000;
    }
    
    .dialogue-system.hidden {
        display: none;
    }
    
    .dialogue-box {
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid var(--primary);
        padding: 1rem;
        display: flex;
        gap: 1rem;
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
    }
    
    .dialogue-portrait {
        position: relative;
        width: 128px;
        height: 128px;
        flex-shrink: 0;
        border: 1px solid var(--primary);
    }
    
    #portrait-canvas {
        image-rendering: pixelated;
    }
    
    .portrait-scanlines {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
        );
        pointer-events: none;
    }
    
    .dialogue-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .speaker-name {
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 0 5px currentColor;
    }
    
    .dialogue-text {
        font-size: 1.1rem;
        line-height: 1.5;
        min-height: 3rem;
    }
    
    .dialogue-choices {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .dialogue-choices.hidden {
        display: none;
    }
    
    .dialogue-choice {
        background: var(--crt-black);
        border: 1px solid var(--primary);
        color: var(--primary);
        padding: 0.5rem 1rem;
        text-align: left;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
    }
    
    .dialogue-choice:hover {
        background: var(--primary-dim);
        box-shadow: 0 0 10px var(--primary);
        transform: translateX(5px);
    }
    
    .choice-number {
        margin-right: 0.5rem;
        opacity: 0.7;
    }
    
    .empathy-indicator {
        float: right;
        color: var(--phosphor-cyan);
        font-size: 0.9rem;
    }
    
    .continue-indicator {
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: var(--primary);
        animation: pulse 1s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.5; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(3px); }
    }
`;
document.head.appendChild(style);

// Export singleton instance
export const dialogueSystem = new DialogueSystem();