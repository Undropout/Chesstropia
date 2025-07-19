// Handles board visualization and animations
export class BoardRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.highlights = new Map(); // position key -> highlight type
        this.animations = [];
        this.asciiMode = true; // Using ASCII art for Woobiecore aesthetic
        
        this.setupBoard();
    }

    setupBoard() {
        // Create ASCII board structure
        this.boardElement = document.createElement('pre');
        this.boardElement.className = 'ascii-board';
        this.container.innerHTML = '';
        this.container.appendChild(this.boardElement);
    }

    render(board) {
        const phosphor = document.body.getAttribute('data-theme') || 'green';
        let output = this.generateBoardHeader();
        
        // Generate board rows (top to bottom, 8 to 1)
        for (let row = 7; row >= 0; row--) {
            output += this.generateRowSeparator();
            output += this.generateBoardRow(board, row);
        }
        
        output += this.generateRowSeparator();
        output += this.generateColumnLabels();
        
        this.boardElement.innerHTML = output;
        this.applyHighlights();
        this.applyEmotionalGlows();
    }

    generateBoardHeader() {
        return `     A    B    C    D    E    F    G    H\n`;
    }

    generateRowSeparator() {
        return `   ┌────┬────┬────┬────┬────┬────┬────┬────┐\n`;
    }

    generateBoardRow(board, row) {
        let rowStr = ` ${row + 1} │`;
        
        for (let col = 0; col < 8; col++) {
            const piece = board.getPieceAt({ row, col });
            const cellContent = this.renderCell(piece, { row, col });
            rowStr += ` ${cellContent} │`;
        }
        
        rowStr += ` ${row + 1}\n`;
        return rowStr;
    }

    generateColumnLabels() {
        return `     A    B    C    D    E    F    G    H\n`;
    }

    renderCell(piece, position) {
        if (!piece) {
            // Empty square - checkerboard pattern
            const isDark = (position.row + position.col) % 2 === 1;
            return isDark ? '░░' : '  ';
        }
        
        // Render piece with emotional indicator
        return this.renderPiece(piece);
    }

    renderPiece(piece) {
        const baseSymbol = piece.team === 'player' ? '●' : '○';
        const isKing = piece.type === 'king';
        
        // Add emotional state indicator
        let stateIndicator = ' ';
        switch(piece.emotionalState) {
            case 'anxious':
                stateIndicator = '?';
                break;
            case 'frozen':
                stateIndicator = '.';
                break;
            case 'shutdown':
                stateIndicator = '_';
                break;
            case 'fight':
                stateIndicator = '!';
                break;
            case 'fawn':
                stateIndicator = '~';
                break;
            default:
                stateIndicator = isKing ? '♔' : ' ';
        }
        
        // Create span with appropriate classes for styling
        const classes = [
            'piece',
            piece.team,
            piece.emotionalState
        ].join(' ');
        
        return `<span class="${classes}" data-piece-id="${piece.id}">${baseSymbol}${stateIndicator}</span>`;
    }

    highlightSquare(position, type) {
        const key = `${position.row},${position.col}`;
        this.highlights.set(key, type);
    }

    clearHighlights() {
        this.highlights.clear();
    }

    applyHighlights() {
        // Apply highlights by modifying the rendered board
        this.highlights.forEach((type, key) => {
            const [row, col] = key.split(',').map(Number);
            const cellElement = this.getCellElement(row, col);
            if (cellElement) {
                cellElement.classList.add(`highlight-${type}`);
            }
        });
    }

    applyEmotionalGlows() {
        // Add neon glow effects to dysregulated pieces
        const pieces = this.container.querySelectorAll('.piece');
        pieces.forEach(pieceEl => {
            const classes = pieceEl.className.split(' ');
            
            // Apply appropriate glow based on emotional state
            if (classes.includes('anxious')) {
                this.applyAnxietyGlow(pieceEl);
            } else if (classes.includes('frozen')) {
                this.applyFrozenGlow(pieceEl);
            } else if (classes.includes('fight')) {
                this.applyFightGlow(pieceEl);
            } else if (classes.includes('shutdown')) {
                this.applyShutdownGlow(pieceEl);
            } else if (classes.includes('fawn')) {
                this.applyFawnGlow(pieceEl);
            }
        });
    }

    applyAnxietyGlow(element) {
        // Pulsing amber glow
        element.style.animation = 'anxiety-pulse 1s ease-in-out infinite';
        element.style.color = 'var(--phosphor-amber)';
        element.style.filter = `
            drop-shadow(0 0 3px var(--phosphor-amber))
            drop-shadow(0 0 6px var(--phosphor-amber))
        `;
    }

    applyFrozenGlow(element) {
        // Static green with interference
        element.style.animation = 'freeze-static 3s linear infinite';
        element.style.color = 'var(--phosphor-green)';
        element.style.opacity = '0.7';
    }

    applyFightGlow(element) {
        // Aggressive magenta strobe
        element.style.animation = 'fight-strobe 0.5s steps(2) infinite';
        element.style.color = 'var(--phosphor-magenta)';
        element.style.filter = `
            drop-shadow(0 0 10px var(--phosphor-magenta))
            drop-shadow(0 0 20px var(--phosphor-magenta))
        `;
    }

    applyShutdownGlow(element) {
        // Flickering cyan
        element.style.animation = 'shutdown-flicker 2s linear infinite';
        element.style.color = 'var(--phosphor-cyan)';
    }

    applyFawnGlow(element) {
        // Soft amber-to-cyan shift
        element.style.animation = 'fawn-plead 2s ease-in-out infinite';
    }

    // Animation methods
    animateMove(fromPos, toPos) {
        // For ASCII mode, we'll flash the positions
        this.highlightSquare(fromPos, 'move-from');
        this.highlightSquare(toPos, 'move-to');
        
        // Clear after animation
        setTimeout(() => {
            this.clearHighlights();
        }, 1000);
    }

    animateStateChange(piece, newState) {
        const pieceEl = this.container.querySelector(`[data-piece-id="${piece.id}"]`);
        if (!pieceEl) return;
        
        // Add transition class
        pieceEl.classList.add('state-transition');
        
        // Flash effect
        pieceEl.style.animation = 'state-change-flash 0.5s ease-out';
        
        setTimeout(() => {
            pieceEl.classList.remove('state-transition');
        }, 500);
    }

    animateContagion(sourcePos, targetPos) {
        // Show emotional spread visually
        const sourceKey = `${sourcePos.row},${sourcePos.col}`;
        const targetKey = `${targetPos.row},${targetPos.col}`;
        
        // Create temporary visual line between positions
        this.highlightSquare(sourcePos, 'contagion-source');
        this.highlightSquare(targetPos, 'contagion-target');
        
        // Add spreading effect
        setTimeout(() => {
            this.clearHighlights();
        }, 1500);
    }

    showStormEffect() {
        // Add storm overlay to entire board
        this.container.classList.add('storm-active');
        
        // Add visual effects
        const stormOverlay = document.createElement('div');
        stormOverlay.className = 'storm-overlay';
        stormOverlay.innerHTML = `
            <div class="storm-particles">
                ${this.generateStormParticles()}
            </div>
        `;
        
        this.container.appendChild(stormOverlay);
        
        // Remove after storm duration
        setTimeout(() => {
            this.container.classList.remove('storm-active');
            stormOverlay.remove();
        }, 10000);
    }

    generateStormParticles() {
        let particles = '';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 100;
            const delay = Math.random() * 5;
            particles += `<span class="storm-particle" style="left: ${x}%; animation-delay: ${delay}s;">⚡</span>`;
        }
        return particles;
    }

    // Utility methods
    getCellElement(row, col) {
        // In ASCII mode, we need to calculate the position in the pre element
        // This is approximate - in practice you might use a more sophisticated approach
        const boardText = this.boardElement.textContent;
        const lines = boardText.split('\n');
        const rowIndex = 8 - row; // Convert to display row
        const colIndex = col;
        
        // Return a virtual element reference for highlighting
        return {
            classList: {
                add: (className) => {
                    // Store highlight for next render
                    this.highlights.set(`${row},${col}`, className.replace('highlight-', ''));
                }
            }
        };
    }

    getPositionFromClick(event) {
        // Calculate board position from click coordinates
        const rect = this.container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Approximate cell size based on ASCII layout
        const cellWidth = rect.width / 8;
        const cellHeight = rect.height / 8;
        
        const col = Math.floor(x / cellWidth);
        const row = 7 - Math.floor(y / cellHeight); // Invert for board coordinates
        
        if (col >= 0 && col < 8 && row >= 0 && row < 8) {
            return { row, col };
        }
        
        return null;
    }

    updatePieceDisplay(piece) {
        // Re-render just the piece's cell
        // In ASCII mode, we need to re-render the entire board
        // For optimization, you could implement partial updates
        if (this.container.parentElement) {
            const gameState = window.chesstropia.game;
            if (gameState) {
                this.render(gameState.board);
            }
        }
    }

    // Special effects for breakthroughs
    showBreakthroughEffect(piece) {
        const pieceEl = this.container.querySelector(`[data-piece-id="${piece.id}"]`);
        if (!pieceEl) return;
        
        // Rainbow cascade effect
        pieceEl.style.animation = 'breakthrough-rainbow 3s ease-in-out';
        pieceEl.style.filter = `
            drop-shadow(0 0 10px var(--phosphor-cyan))
            drop-shadow(10px 0 10px var(--phosphor-magenta))
            drop-shadow(0 10px 10px var(--phosphor-amber))
            drop-shadow(-10px 0 10px var(--phosphor-green))
        `;
        
        // Add celebration particles
        this.spawnCelebrationParticles(piece.position);
    }

    spawnCelebrationParticles(position) {
        const particles = document.createElement('div');
        particles.className = 'celebration-particles';
        particles.style.position = 'absolute';
        
        // Position relative to the piece
        const cellSize = this.container.offsetWidth / 8;
        particles.style.left = `${position.col * cellSize}px`;
        particles.style.top = `${(7 - position.row) * cellSize}px`;
        
        // Create particle elements
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('span');
            particle.className = 'celebration-particle';
            particle.textContent = ['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)];
            particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
            particle.style.setProperty('--distance', `${50 + Math.random() * 100}px`);
            particles.appendChild(particle);
        }
        
        this.container.appendChild(particles);
        
        // Remove after animation
        setTimeout(() => particles.remove(), 2000);
    }

    // Defection animation
    showDefectionAnimation(piece, targetTeam) {
        const pieceEl = this.container.querySelector(`[data-piece-id="${piece.id}"]`);
        if (!pieceEl) return;
        
        // Glitch effect as piece changes sides
        pieceEl.style.animation = 'defection-glitch 2s steps(10)';
        
        // Color shift
        setTimeout(() => {
            pieceEl.style.filter = 'hue-rotate(180deg)';
        }, 1000);
        
        // Show message
        const message = document.createElement('div');
        message.className = 'defection-message';
        message.textContent = `${piece.name} has joined the ${targetTeam} team`;
        message.style.color = 'var(--phosphor-magenta)';
        
        this.container.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes anxiety-pulse {
        0%, 100% { 
            opacity: 1;
            transform: scale(1);
        }
        50% { 
            opacity: 0.7;
            transform: scale(1.1);
        }
    }
    
    @keyframes freeze-static {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    
    @keyframes fight-strobe {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    @keyframes shutdown-flicker {
        0%, 90%, 92%, 98%, 100% { opacity: 1; }
        91%, 97% { opacity: 0.3; }
    }
    
    @keyframes fawn-plead {
        0%, 100% { color: var(--phosphor-amber); }
        50% { color: var(--phosphor-cyan); }
    }
    
    @keyframes breakthrough-rainbow {
        0%, 100% { filter: drop-shadow(0 0 20px var(--phosphor-cyan)); }
        25% { filter: drop-shadow(0 0 20px var(--phosphor-magenta)); }
        50% { filter: drop-shadow(0 0 20px var(--phosphor-amber)); }
        75% { filter: drop-shadow(0 0 20px var(--phosphor-green)); }
    }
    
    @keyframes defection-glitch {
        0%, 100% { transform: skewX(0deg); }
        20% { transform: skewX(5deg) translateX(-5px); }
        40% { transform: skewX(-5deg) translateX(5px); }
        60% { transform: skewX(3deg) scaleY(1.1); }
        80% { transform: skewX(-3deg) scaleY(0.9); }
    }
    
    .storm-particle {
        position: absolute;
        animation: storm-fall 5s linear infinite;
        color: var(--phosphor-amber);
        filter: drop-shadow(0 0 5px currentColor);
    }
    
    @keyframes storm-fall {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        to {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
    
    .celebration-particle {
        position: absolute;
        animation: celebrate 2s ease-out forwards;
    }
    
    @keyframes celebrate {
        from {
            transform: translate(0, 0) scale(0);
            opacity: 1;
        }
        to {
            transform: 
                translate(
                    calc(cos(var(--angle)) * var(--distance)),
                    calc(sin(var(--angle)) * var(--distance) - 50px)
                ) 
                scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);