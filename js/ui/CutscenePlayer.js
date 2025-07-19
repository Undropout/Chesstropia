// Plays cutscenes for story moments and tutorials
export class CutscenePlayer {
    constructor() {
        this.currentCutscene = null;
        this.frameIndex = 0;
        this.isPlaying = false;
        this.skipAllowed = true;
        
        this.createCutsceneContainer();
        this.setupEventListeners();
    }

    createCutsceneContainer() {
        const container = document.createElement('div');
        container.id = 'cutscene-player';
        container.className = 'cutscene-player hidden';
        container.innerHTML = `
            <div class="cutscene-screen">
                <canvas id="cutscene-canvas" width="512" height="384"></canvas>
                <div class="cutscene-scanlines"></div>
                <div class="cutscene-vignette"></div>
            </div>
            <div class="cutscene-text-box">
                <div class="cutscene-text"></div>
            </div>
            <div class="cutscene-controls">
                <div class="skip-indicator">Press SPACE to ${this.skipAllowed ? 'skip' : 'continue'}</div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.container = container;
        this.canvas = document.getElementById('cutscene-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
    }

    setupEventListeners() {
        // Skip/advance controls
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;
            
            if (e.key === ' ') {
                e.preventDefault();
                if (this.skipAllowed) {
                    this.skipCutscene();
                } else {
                    this.nextFrame();
                }
            }
        });
        
        // Click to advance
        this.container.addEventListener('click', () => {
            if (this.isPlaying && !this.skipAllowed) {
                this.nextFrame();
            }
        });
    }

    async playCutscene(cutsceneId, options = {}) {
        this.currentCutscene = await this.loadCutscene(cutsceneId);
        if (!this.currentCutscene) return;
        
        this.frameIndex = 0;
        this.isPlaying = true;
        this.skipAllowed = options.skippable !== false;
        
        // Show container
        this.container.classList.remove('hidden');
        
        // Start playback
        await this.playFrame(0);
    }

    async loadCutscene(cutsceneId) {
        // Cutscene definitions
        const cutscenes = {
            intro: {
                frames: [
                    {
                        type: 'title',
                        duration: 3000,
                        text: 'CHESSTROPIA',
                        subtext: 'Where Every Piece Has Feelings'
                    },
                    {
                        type: 'scene',
                        image: 'lonely_board',
                        text: 'In a world of endless chess games...',
                        duration: 3000
                    },
                    {
                        type: 'scene',
                        image: 'crying_pawn',
                        text: 'The pieces began to feel.',
                        duration: 3000
                    },
                    {
                        type: 'scene',
                        image: 'empathy_glow',
                        text: 'And they need someone who understands.',
                        duration: 3000
                    }
                ]
            },
            
            match_intro: {
                frames: [
                    {
                        type: 'title',
                        duration: 2000,
                        text: 'MATCH {matchNumber}',
                        subtext: '{matchTitle}'
                    },
                    {
                        type: 'character',
                        character: '{opponent}',
                        emotion: 'neutral',
                        text: '{introDialogue}',
                        duration: 4000
                    }
                ]
            },
            
            breakthrough: {
                frames: [
                    {
                        type: 'effect',
                        effect: 'rainbow_burst',
                        duration: 1000
                    },
                    {
                        type: 'character',
                        character: '{piece}',
                        emotion: 'transformed',
                        text: 'Something has changed...',
                        duration: 2000
                    },
                    {
                        type: 'scene',
                        image: 'breakthrough_aura',
                        text: '{piece} has achieved emotional breakthrough!',
                        duration: 3000
                    }
                ]
            },
            
            storm_warning: {
                frames: [
                    {
                        type: 'effect',
                        effect: 'storm_clouds',
                        duration: 2000
                    },
                    {
                        type: 'title',
                        text: 'EMOTIONAL STORM',
                        subtext: '{stormName}',
                        duration: 2000,
                        style: 'warning'
                    }
                ]
            },
            
            defection: {
                frames: [
                    {
                        type: 'character',
                        character: '{piece}',
                        emotion: 'hurt',
                        text: "I can't stay here anymore...",
                        duration: 3000
                    },
                    {
                        type: 'effect',
                        effect: 'glitch_transition',
                        duration: 1000
                    },
                    {
                        type: 'scene',
                        image: 'piece_leaving',
                        text: '{piece} has joined the opposing team.',
                        duration: 3000
                    }
                ]
            },
            
            victory: {
                frames: [
                    {
                        type: 'title',
                        text: 'MATCH COMPLETE',
                        subtext: 'But more importantly...',
                        duration: 2000
                    },
                    {
                        type: 'scene',
                        image: 'team_together',
                        text: 'Your pieces trust you.',
                        duration: 3000
                    },
                    {
                        type: 'stats',
                        duration: 5000
                    }
                ]
            }
        };
        
        return cutscenes[cutsceneId] || null;
    }

    async playFrame(index) {
        if (index >= this.currentCutscene.frames.length) {
            this.endCutscene();
            return;
        }
        
        const frame = this.currentCutscene.frames[index];
        this.frameIndex = index;
        
        // Update progress bar
        this.updateProgress();
        
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, 512, 384);
        
        // Render frame based on type
        switch(frame.type) {
            case 'title':
                await this.renderTitleFrame(frame);
                break;
            case 'scene':
                await this.renderSceneFrame(frame);
                break;
            case 'character':
                await this.renderCharacterFrame(frame);
                break;
            case 'effect':
                await this.renderEffectFrame(frame);
                break;
            case 'stats':
                await this.renderStatsFrame(frame);
                break;
        }
        
        // Display text if present
        if (frame.text) {
            await this.displayText(frame.text);
        }
        
        // Auto-advance after duration
        if (frame.duration) {
            this.frameTimer = setTimeout(() => {
                this.nextFrame();
            }, frame.duration);
        }
    }

    async renderTitleFrame(frame) {
        const centerX = 256;
        const centerY = 192;
        
        // Apply style
        const style = frame.style || 'normal';
        const color = style === 'warning' ? '#ffcc00' : '#00ff00';
        
        // Draw title
        this.ctx.font = 'bold 48px "IBM Plex Mono"';
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Add glow effect
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 20;
        
        this.ctx.fillText(frame.text, centerX, centerY - 30);
        
        // Draw subtitle
        if (frame.subtext) {
            this.ctx.font = '24px "IBM Plex Mono"';
            this.ctx.fillText(frame.subtext, centerX, centerY + 30);
        }
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Add decorative elements
        this.drawTitleDecorations(color);
    }

    drawTitleDecorations(color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        
        // Top and bottom lines
        this.ctx.beginPath();
        this.ctx.moveTo(50, 100);
        this.ctx.lineTo(462, 100);
        this.ctx.moveTo(50, 284);
        this.ctx.lineTo(462, 284);
        this.ctx.stroke();
        
        // Corner brackets
        const bracketSize = 20;
        const corners = [
            [50, 100], [462, 100], [50, 284], [462, 284]
        ];
        
        corners.forEach(([x, y], i) => {
            this.ctx.beginPath();
            if (i < 2) { // Top corners
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x, y + bracketSize);
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + (i === 0 ? bracketSize : -bracketSize), y);
            } else { // Bottom corners
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x, y - bracketSize);
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + (i === 2 ? bracketSize : -bracketSize), y);
            }
            this.ctx.stroke();
        });
    }

    async renderSceneFrame(frame) {
        // Generate procedural scene based on image name
        switch(frame.image) {
            case 'lonely_board':
                this.drawLonelyBoard();
                break;
            case 'crying_pawn':
                this.drawCryingPawn();
                break;
            case 'empathy_glow':
                this.drawEmpathyGlow();
                break;
            case 'breakthrough_aura':
                this.drawBreakthroughAura();
                break;
            case 'piece_leaving':
                this.drawPieceLeaving();
                break;
            case 'team_together':
                this.drawTeamTogether();
                break;
            default:
                this.drawPlaceholder(frame.image);
        }
    }

    drawLonelyBoard() {
        // Draw empty chess board with single piece
        const cellSize = 40;
        const boardX = 256 - (4 * cellSize);
        const boardY = 192 - (4 * cellSize);
        
        // Draw board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isDark = (row + col) % 2 === 1;
                this.ctx.fillStyle = isDark ? '#004400' : '#000000';
                this.ctx.fillRect(
                    boardX + col * cellSize,
                    boardY + row * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }
        
        // Draw single lonely piece in center
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '32px "IBM Plex Mono"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('●', 256, 192);
        
        // Add subtle glow
        this.ctx.shadowColor = '#00ff00';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText('●', 256, 192);
        this.ctx.shadowBlur = 0;
    }

    drawCryingPawn() {
        // Draw sad pawn with tears
        const centerX = 256;
        const centerY = 192;
        
        // Draw pawn
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = '128px "IBM Plex Mono"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('♟', centerX, centerY);
        
        // Draw tears
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([2, 2]);
        
        // Left tear
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 20, centerY + 20);
        this.ctx.lineTo(centerX - 22, centerY + 40);
        this.ctx.stroke();
        
        // Right tear
        this.ctx.beginPath();
        this.ctx.moveTo(centerX + 20, centerY + 20);
        this.ctx.lineTo(centerX + 22, centerY + 40);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }

    drawEmpathyGlow() {
        // Draw hand reaching toward glowing piece
        const centerX = 256;
        const centerY = 192;
        
        // Draw piece with multi-color glow
        const colors = ['#00ffff', '#ff00ff', '#ffcc00', '#00ff00'];
        
        colors.forEach((color, i) => {
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = 0.3 - (i * 0.05);
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY - 50, 50 + (i * 20), 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        
        // Draw piece in center
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '64px "IBM Plex Mono"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('●', centerX, centerY - 50);
        
        // Draw simplified hand
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 30, centerY + 50);
        this.ctx.lineTo(centerX - 20, centerY + 20);
        this.ctx.lineTo(centerX - 10, centerY + 10);
        this.ctx.moveTo(centerX + 30, centerY + 50);
        this.ctx.lineTo(centerX + 20, centerY + 20);
        this.ctx.lineTo(centerX + 10, centerY + 10);
        this.ctx.stroke();
    }

    async renderCharacterFrame(frame) {
        // Draw character portrait
        const portraitSize = 256;
        const portraitX = 256 - portraitSize / 2;
        const portraitY = 140 - portraitSize / 2;
        
        // Draw portrait background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(portraitX, portraitY, portraitSize, portraitSize);
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(portraitX, portraitY, portraitSize, portraitSize);
        
        // Draw character (procedural based on emotion)
        this.drawCharacterPortrait(frame.character, frame.emotion, portraitX, portraitY, portraitSize);
    }

    drawCharacterPortrait(character, emotion, x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // Get emotion color
        const emotionColors = {
            'neutral': '#00ff00',
            'happy': '#00ff00',
            'anxious': '#ffcc00',
            'angry': '#ff00ff',
            'hurt': '#ffcc00',
            'transformed': '#00ffff'
        };
        
        const color = emotionColors[emotion] || '#00ff00';
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 3;
        
        // Draw larger face
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw features based on emotion
        this.drawLargeEmotionalFeatures(centerX, centerY, size * 0.3, emotion);
    }

    drawLargeEmotionalFeatures(centerX, centerY, radius, emotion) {
        // Similar to portrait system but larger
        const eyeY = centerY - radius * 0.3;
        const eyeSpacing = radius * 0.5;
        
        // Eyes
        switch(emotion) {
            case 'anxious':
                // Wide worried eyes
                this.ctx.beginPath();
                this.ctx.arc(centerX - eyeSpacing, eyeY, radius * 0.2, 0, Math.PI * 2);
                this.ctx.arc(centerX + eyeSpacing, eyeY, radius * 0.2, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
                
            case 'transformed':
                // Star eyes
                this.drawStar(centerX - eyeSpacing, eyeY, radius * 0.15);
                this.drawStar(centerX + eyeSpacing, eyeY, radius * 0.15);
                break;
                
            default:
                // Simple dot eyes
                this.ctx.beginPath();
                this.ctx.arc(centerX - eyeSpacing, eyeY, radius * 0.1, 0, Math.PI * 2);
                this.ctx.arc(centerX + eyeSpacing, eyeY, radius * 0.1, 0, Math.PI * 2);
                this.ctx.fill();
        }
        
        // Mouth
        const mouthY = centerY + radius * 0.3;
        switch(emotion) {
            case 'happy':
            case 'transformed':
                this.ctx.beginPath();
                this.ctx.arc(centerX, mouthY - radius * 0.2, radius * 0.3, 0.2 * Math.PI, 0.8 * Math.PI);
                this.ctx.stroke();
                break;
                
            case 'hurt':
            case 'anxious':
                this.ctx.beginPath();
                this.ctx.arc(centerX, mouthY + radius * 0.1, radius * 0.3, 1.2 * Math.PI, 1.8 * Math.PI);
                this.ctx.stroke();
                break;
        }
    }

    drawStar(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 - 90) * Math.PI / 180;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
            
            const innerAngle = ((i * 72 + 36) - 90) * Math.PI / 180;
            const ipx = x + Math.cos(innerAngle) * size * 0.5;
            const ipy = y + Math.sin(innerAngle) * size * 0.5;
            this.ctx.lineTo(ipx, ipy);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    async renderEffectFrame(frame) {
        switch(frame.effect) {
            case 'rainbow_burst':
                await this.animateRainbowBurst();
                break;
            case 'storm_clouds':
                await this.animateStormClouds();
                break;
            case 'glitch_transition':
                await this.animateGlitchTransition();
                break;
        }
    }

    async animateRainbowBurst() {
        const colors = ['#00ffff', '#ff00ff', '#ffcc00', '#00ff00'];
        const centerX = 256;
        const centerY = 192;
        
        // Animate expanding circles
        for (let frame = 0; frame < 30; frame++) {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, 512, 384);
            
            colors.forEach((color, i) => {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 5;
                this.ctx.globalAlpha = 1 - (frame / 30);
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, (frame * 10) + (i * 20), 0, Math.PI * 2);
                this.ctx.stroke();
            });
            
            this.ctx.globalAlpha = 1;
            await this.delay(33); // ~30fps
        }
    }

    async animateStormClouds() {
        for (let frame = 0; frame < 60; frame++) {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, 512, 384);
            
            // Draw animated storm clouds
            this.ctx.fillStyle = '#440044';
            for (let i = 0; i < 5; i++) {
                const x = (i * 120) + Math.sin(frame * 0.1 + i) * 20;
                const y = 50 + Math.sin(frame * 0.05 + i * 0.5) * 10;
                const size = 60 + Math.sin(frame * 0.07 + i * 0.3) * 20;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Lightning flashes
            if (frame % 20 === 0) {
                this.ctx.strokeStyle = '#ffcc00';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                const startX = Math.random() * 512;
                this.ctx.moveTo(startX, 0);
                for (let y = 0; y < 384; y += 30) {
                    const offsetX = (Math.random() - 0.5) * 50;
                    this.ctx.lineTo(startX + offsetX, y);
                }
                this.ctx.stroke();
            }
            
            await this.delay(33);
        }
    }

    async renderStatsFrame(frame) {
        // Show match statistics
        const stats = this.gatherMatchStats();
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '24px "IBM Plex Mono"';
        this.ctx.textAlign = 'left';
        
        const startY = 100;
        const lineHeight = 35;
        
        const statLines = [
            `Pieces Trusted You: ${stats.trustedPieces}/${stats.totalPieces}`,
            `Emotional Breakthroughs: ${stats.breakthroughs}`,
            `Crises Resolved: ${stats.crisesResolved}`,
            `Final Team Morale: ${'♥'.repeat(stats.morale)}${'♡'.repeat(10 - stats.morale)}`,
            '',
            `Empathy Rating: ${stats.empathyRating}`
        ];
        
        statLines.forEach((line, i) => {
            this.ctx.fillText(line, 100, startY + i * lineHeight);
        });
    }

    gatherMatchStats() {
        // Get stats from game state
        const gameState = window.chesstropia?.game;
        if (!gameState) {
            return {
                trustedPieces: 8,
                totalPieces: 12,
                breakthroughs: 2,
                crisesResolved: 5,
                morale: 7,
                empathyRating: 'COMPASSIONATE'
            };
        }
        
        // Calculate real stats
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player');
        
        return {
            trustedPieces: playerPieces.filter(p => p.trust >= 5).length,
            totalPieces: playerPieces.length,
            breakthroughs: playerPieces.filter(p => 
                p.memories.some(m => m.type === 'breakthrough')
            ).length,
            crisesResolved: gameState.resolvedCrises || 0,
            morale: Math.floor(gameState.teamMorale),
            empathyRating: this.calculateEmpathyRating(gameState)
        };
    }

    calculateEmpathyRating(gameState) {
        const avgTrust = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player')
            .reduce((sum, p) => sum + p.trust, 0) / gameState.pieces.size;
        
        if (avgTrust >= 8) return 'ENLIGHTENED';
        if (avgTrust >= 6) return 'COMPASSIONATE';
        if (avgTrust >= 4) return 'UNDERSTANDING';
        if (avgTrust >= 2) return 'LEARNING';
        return 'STRUGGLING';
    }

    async displayText(text) {
        const textBox = this.container.querySelector('.cutscene-text');
        textBox.textContent = '';
        
        // Typewriter effect
        const chars = text.split('');
        for (let i = 0; i < chars.length; i++) {
            textBox.textContent += chars[i];
            await this.delay(30);
        }
    }

    updateProgress() {
        const progress = (this.frameIndex + 1) / this.currentCutscene.frames.length;
        const fillEl = this.container.querySelector('.progress-fill');
        fillEl.style.width = `${progress * 100}%`;
    }

    nextFrame() {
        if (this.frameTimer) {
            clearTimeout(this.frameTimer);
        }
        this.playFrame(this.frameIndex + 1);
    }

    skipCutscene() {
        if (!this.skipAllowed) return;
        
        if (this.frameTimer) {
            clearTimeout(this.frameTimer);
        }
        
        this.endCutscene();
    }

    endCutscene() {
        this.isPlaying = false;
        this.container.classList.add('hidden');
        
        // Clear canvas
        this.ctx.clearRect(0, 0, 512, 384);
        
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('chesstropia:cutscene_complete', {
            detail: { cutsceneId: this.currentCutscene?.id }
        }));
        
        this.currentCutscene = null;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Special cutscene triggers
    async playBreakthroughCutscene(piece) {
        const cutscene = {
            id: 'breakthrough_dynamic',
            frames: [
                {
                    type: 'effect',
                    effect: 'rainbow_burst',
                    duration: 1000
                },
                {
                    type: 'character',
                    character: piece.name,
                    emotion: 'transformed',
                    text: "I feel... different. Like I can see clearly for the first time.",
                    duration: 4000
                },
                {
                    type: 'title',
                    text: 'BREAKTHROUGH',
                    subtext: `${piece.name} has transformed!`,
                    duration: 3000
                }
            ]
        };
        
        this.currentCutscene = cutscene;
        this.frameIndex = 0;
        this.isPlaying = true;
        this.skipAllowed = false;
        
        this.container.classList.remove('hidden');
        await this.playFrame(0);
    }
}

// CSS for cutscene player
const style = document.createElement('style');
style.textContent = `
    .cutscene-player {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        z-index: 2000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .cutscene-player.hidden {
        display: none;
    }
    
    .cutscene-screen {
        position: relative;
        width: 512px;
        height: 384px;
        border: 2px solid var(--primary);
        box-shadow: 0 0 50px rgba(0, 255, 0, 0.5);
    }
    
    #cutscene-canvas {
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
    
    .cutscene-scanlines {
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
    
    .cutscene-vignette {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(0, 0, 0, 0.4) 100%
        );
        pointer-events: none;
    }
    
    .cutscene-text-box {
        width: 512px;
        min-height: 80px;
        margin-top: 20px;
        padding: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid var(--primary);
        color: var(--primary);
        font-size: 1.1rem;
        line-height: 1.5;
        text-align: center;
    }
    
    .cutscene-controls {
        position: absolute;
        bottom: 20px;
        width: 512px;
        text-align: center;
    }
    
    .skip-indicator {
        color: var(--primary);
        opacity: 0.7;
        font-size: 0.9rem;
        margin-bottom: 10px;
        animation: pulse 2s ease-in-out infinite;
    }
    
    .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(0, 255, 0, 0.2);
        border: 1px solid var(--primary);
    }
    
    .progress-fill {
        height: 100%;
        background: var(--primary);
        transition: width 0.3s ease-out;
        box-shadow: 0 0 10px var(--primary);
    }
`;
document.head.appendChild(style);

// Export singleton instance
export const cutscenePlayer = new CutscenePlayer();