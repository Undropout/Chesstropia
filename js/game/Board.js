// The emotional game board where pieces live and interact
import { EventEmitter } from '../utils/EventEmitter.js';
import { colorThemes } from '../utils/colorThemes.js';

export class Board extends EventEmitter {
    constructor(container) {
        super();
        
        this.container = container;
        this.size = 8;
        this.squares = [];
        this.pieces = new Map();
        this.selectedPiece = null;
        this.possibleMoves = [];
        this.lastMove = null;
        
        this.initialize();
    }
    
    initialize() {
        this.createBoard();
        this.setupInteractions();
        this.createEmotionalOverlay();
        this.createRelationshipLayer();
    }
    
    createBoard() {
        this.boardElement = document.createElement('div');
        this.boardElement.className = 'game-board';
        this.boardElement.setAttribute('role', 'grid');
        this.boardElement.setAttribute('aria-label', 'Game board');
        
        // Create squares
        for (let row = 0; row < this.size; row++) {
            this.squares[row] = [];
            
            for (let col = 0; col < this.size; col++) {
                const square = this.createSquare(row, col);
                this.squares[row][col] = square;
                this.boardElement.appendChild(square);
            }
        }
        
        this.container.appendChild(this.boardElement);
        this.applyBoardStyles();
    }
    
    createSquare(row, col) {
        const square = document.createElement('div');
        square.className = 'board-square';
        square.dataset.row = row;
        square.dataset.col = col;
        
        // Checkerboard pattern
        const isDark = (row + col) % 2 === 1;
        square.classList.add(isDark ? 'dark-square' : 'light-square');
        
        // Accessibility
        square.setAttribute('role', 'gridcell');
        square.setAttribute('aria-label', `Square ${String.fromCharCode(65 + col)}${8 - row}`);
        square.tabIndex = -1;
        
        // Emotional resonance indicator
        const resonance = document.createElement('div');
        resonance.className = 'square-resonance';
        square.appendChild(resonance);
        
        return square;
    }
    
    applyBoardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .game-board {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                grid-template-rows: repeat(8, 1fr);
                width: min(90vw, 600px);
                height: min(90vw, 600px);
                border: 3px solid var(--border-color, #374151);
                border-radius: 8px;
                overflow: hidden;
                position: relative;
                background: var(--board-bg, #1F2937);
            }
            
            .board-square {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .dark-square {
                background-color: var(--dark-square, #4B5563);
            }
            
            .light-square {
                background-color: var(--light-square, #9CA3AF);
            }
            
            .board-square:hover {
                filter: brightness(1.1);
            }
            
            .board-square.possible-move {
                position: relative;
            }
            
            .board-square.possible-move::after {
                content: '';
                position: absolute;
                width: 30%;
                height: 30%;
                background-color: var(--move-indicator, #10B981);
                border-radius: 50%;
                opacity: 0.7;
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            .board-square.possible-capture::after {
                width: 80%;
                height: 80%;
                background-color: transparent;
                border: 3px solid var(--capture-indicator, #EF4444);
                border-radius: 50%;
            }
            
            .board-square.selected {
                box-shadow: inset 0 0 0 3px var(--select-color, #3B82F6);
                z-index: 10;
            }
            
            .board-square.last-move-from,
            .board-square.last-move-to {
                background-color: var(--last-move-color, rgba(59, 130, 246, 0.2));
            }
            
            .square-resonance {
                position: absolute;
                width: 100%;
                height: 100%;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            
            .square-resonance.active {
                opacity: 1;
                background: radial-gradient(
                    circle at center,
                    var(--resonance-color, rgba(16, 185, 129, 0.3)) 0%,
                    transparent 70%
                );
                animation: resonance-pulse 2s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.2); opacity: 0.3; }
            }
            
            @keyframes resonance-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupInteractions() {
        // Square click handling
        this.boardElement.addEventListener('click', (e) => {
            const square = e.target.closest('.board-square');
            if (!square) return;
            
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            
            this.handleSquareClick(row, col);
        });
        
        // Keyboard navigation
        this.boardElement.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
        
        // Touch support
        this.setupTouchSupport();
        
        // Hover effects for emotional feedback
        this.boardElement.addEventListener('mouseover', (e) => {
            const square = e.target.closest('.board-square');
            if (square) {
                this.showSquareEmotions(square);
            }
        });
    }
    
    handleSquareClick(row, col) {
        const piece = this.getPieceAt(row, col);
        
        if (this.selectedPiece) {
            // Try to move selected piece
            if (this.isValidMove(this.selectedPiece, row, col)) {
                this.emit('moveAttempt', {
                    piece: this.selectedPiece,
                    from: this.selectedPiece.position,
                    to: { row, col }
                });
            } else if (piece && piece.team === this.selectedPiece.team) {
                // Select different piece from same team
                this.selectPiece(piece);
            } else {
                // Invalid move - provide feedback
                this.showInvalidMoveFeedback(row, col);
            }
        } else if (piece) {
            // Select piece
            this.selectPiece(piece);
        }
    }
    
    selectPiece(piece) {
        // Clear previous selection
        this.clearSelection();
        
        // Check if piece can be selected
        if (!this.canSelectPiece(piece)) {
            this.emit('selectionDenied', { piece, reason: this.getSelectionDenialReason(piece) });
            return;
        }
        
        this.selectedPiece = piece;
        const square = this.squares[piece.position.row][piece.position.col];
        square.classList.add('selected');
        
        // Show possible moves
        this.showPossibleMoves(piece);
        
        // Emit selection event
        this.emit('pieceSelected', { piece });
        
        // Announce for accessibility
        this.announceSelection(piece);
    }
    
    canSelectPiece(piece) {
        // Can't select if piece is frozen
        if (piece.emotionalState === 'freeze') {
            return false;
        }
        
        // Can't select opponent pieces (unless in special mode)
        if (piece.team !== 'player' && !this.allowOpponentSelection) {
            return false;
        }
        
        // Can't select if piece needs empathy first
        if (piece.needsEmpathyFirst && piece.emotionalState !== 'regulated') {
            return piece.empathyProvided;
        }
        
        return true;
    }
    
    getSelectionDenialReason(piece) {
        if (piece.emotionalState === 'freeze') {
            return 'frozen';
        }
        if (piece.needsEmpathyFirst && !piece.empathyProvided) {
            return 'needs_empathy';
        }
        if (piece.team !== 'player') {
            return 'opponent_piece';
        }
        return 'unknown';
    }
    
    showPossibleMoves(piece) {
        this.possibleMoves = this.calculatePossibleMoves(piece);
        
        this.possibleMoves.forEach(move => {
            const square = this.squares[move.row][move.col];
            square.classList.add('possible-move');
            
            if (move.isCapture) {
                square.classList.add('possible-capture');
            }
        });
    }
    
    calculatePossibleMoves(piece) {
        const moves = [];
        const { row, col } = piece.position;
        const team = piece.team;
        const direction = team === 'player' ? -1 : 1;
        
        // Regular moves
        const regularMoves = [
            { row: row + direction, col: col - 1 },
            { row: row + direction, col: col + 1 }
        ];
        
        // King moves (if piece is kinged)
        if (piece.isKing) {
            regularMoves.push(
                { row: row - direction, col: col - 1 },
                { row: row - direction, col: col + 1 }
            );
        }
        
        regularMoves.forEach(move => {
            if (this.isInBounds(move.row, move.col) && !this.getPieceAt(move.row, move.col)) {
                moves.push(move);
            }
        });
        
        // Capture moves
        const captureMoves = this.calculateCaptureMoves(piece);
        captureMoves.forEach(capture => {
            moves.push({ ...capture, isCapture: true });
        });
        
        return moves;
    }
    
    calculateCaptureMoves(piece, position = null, capturedPieces = []) {
        const moves = [];
        const pos = position || piece.position;
        const directions = piece.isKing 
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.team === 'player' 
                ? [[-1, -1], [-1, 1]]
                : [[1, -1], [1, 1]];
        
        directions.forEach(([dRow, dCol]) => {
            const jumpOver = { row: pos.row + dRow, col: pos.col + dCol };
            const landAt = { row: pos.row + dRow * 2, col: pos.col + dCol * 2 };
            
            if (this.isInBounds(landAt.row, landAt.col)) {
                const jumpPiece = this.getPieceAt(jumpOver.row, jumpOver.col);
                const landPiece = this.getPieceAt(landAt.row, landAt.col);
                
                if (jumpPiece && 
                    jumpPiece.team !== piece.team && 
                    !landPiece && 
                    !capturedPieces.includes(jumpPiece)) {
                    
                    moves.push({
                        row: landAt.row,
                        col: landAt.col,
                        captured: jumpPiece,
                        isCapture: true
                    });
                    
                    // Check for multiple captures
                    const furtherCaptures = this.calculateCaptureMoves(
                        piece, 
                        landAt, 
                        [...capturedPieces, jumpPiece]
                    );
                    
                    furtherCaptures.forEach(furtherCapture => {
                        moves.push({
                            ...furtherCapture,
                            captured: [jumpPiece, ...furtherCapture.captured]
                        });
                    });
                }
            }
        });
        
        return moves;
    }
    
    isValidMove(piece, toRow, toCol) {
        return this.possibleMoves.some(move => 
            move.row === toRow && move.col === toCol
        );
    }
    
    isInBounds(row, col) {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }
    
    clearSelection() {
        if (this.selectedPiece) {
            const square = this.squares[this.selectedPiece.position.row][this.selectedPiece.position.col];
            square.classList.remove('selected');
        }
        
        this.selectedPiece = null;
        
        // Clear possible moves
        this.possibleMoves.forEach(move => {
            const square = this.squares[move.row][move.col];
            square.classList.remove('possible-move', 'possible-capture');
        });
        
        this.possibleMoves = [];
    }
    
    // Piece management
    addPiece(piece, row, col) {
        piece.position = { row, col };
        this.pieces.set(piece.id, piece);
        
        const pieceElement = this.createPieceElement(piece);
        this.squares[row][col].appendChild(pieceElement);
        
        // Add entrance animation
        pieceElement.style.animation = 'piece-enter 0.5s ease-out';
    }
    
    createPieceElement(piece) {
        const element = document.createElement('div');
        element.className = 'game-piece';
        element.dataset.pieceId = piece.id;
        element.dataset.team = piece.team;
        
        // Visual representation
        const visual = document.createElement('div');
        visual.className = 'piece-visual';
        visual.textContent = piece.team === 'player' ? '◐' : '◑';
        element.appendChild(visual);
        
        // Name label
        const nameLabel = document.createElement('div');
        nameLabel.className = 'piece-name';
        nameLabel.textContent = piece.name;
        element.appendChild(nameLabel);
        
        // Emotional indicator
        const emotionalIndicator = document.createElement('div');
        emotionalIndicator.className = 'emotional-indicator';
        element.appendChild(emotionalIndicator);
        
        // Trust meter
        const trustMeter = document.createElement('div');
        trustMeter.className = 'trust-meter';
        trustMeter.innerHTML = `<div class="trust-fill" style="width: ${(piece.trust + 5) * 10}%"></div>`;
        element.appendChild(trustMeter);
        
        // Apply team color theme
        colorThemes.applyPieceTheme(element, piece, piece.teamColor || 'amber');
        
        // Update emotional state
        this.updatePieceEmotionalState(element, piece);
        
        return element;
    }
    
    updatePieceEmotionalState(element, piece) {
        // Remove old state classes
        ['anxious', 'shutdown', 'fight', 'freeze', 'fawn', 'regulated'].forEach(state => {
            element.classList.remove(`state-${state}`);
        });
        
        // Add current state
        element.classList.add(`state-${piece.emotionalState}`);
        
        // Update emotional indicator
        const indicator = element.querySelector('.emotional-indicator');
        const stateSymbols = {
            anxious: '!',
            shutdown: '…',
            fight: '⚡',
            freeze: '❄',
            fawn: '♥',
            regulated: '✓'
        };
        
        indicator.textContent = stateSymbols[piece.emotionalState] || '';
        indicator.className = `emotional-indicator ${piece.emotionalState}`;
        
        // Add state-specific animations
        if (piece.emotionalState === 'anxious') {
            element.style.animation = 'anxious-shake 0.5s ease-in-out infinite';
        } else if (piece.emotionalState === 'freeze') {
            element.style.animation = 'none';
            element.style.filter = 'brightness(0.7) hue-rotate(-20deg)';
        }
    }
    
    movePiece(piece, toRow, toCol, captured = null) {
        const fromSquare = this.squares[piece.position.row][piece.position.col];
        const toSquare = this.squares[toRow][toCol];
        const pieceElement = fromSquare.querySelector(`[data-piece-id="${piece.id}"]`);
        
        // Update last move indicators
        this.clearLastMove();
        fromSquare.classList.add('last-move-from');
        toSquare.classList.add('last-move-to');
        this.lastMove = { from: piece.position, to: { row: toRow, col: toCol } };
        
        // Animate movement
        this.animateMovement(pieceElement, fromSquare, toSquare, () => {
            // Update piece position
            piece.position = { row: toRow, col: toCol };
            
            // Handle capture
            if (captured) {
                this.capturePiece(captured);
            }
            
            // Check for king promotion
            if (this.shouldPromoteToKing(piece, toRow)) {
                this.promoteToKing(piece);
            }
            
            // Clear selection
            this.clearSelection();
            
            // Emit move complete
            this.emit('moveComplete', { piece, from: fromSquare, to: toSquare, captured });
        });
    }
    
    animateMovement(pieceElement, fromSquare, toSquare, callback) {
        const fromRect = fromSquare.getBoundingClientRect();
        const toRect = toSquare.getBoundingClientRect();
        
        const deltaX = toRect.left - fromRect.left;
        const deltaY = toRect.top - fromRect.top;
        
        // Clone for animation
        const animatedPiece = pieceElement.cloneNode(true);
        animatedPiece.style.position = 'fixed';
        animatedPiece.style.left = fromRect.left + 'px';
        animatedPiece.style.top = fromRect.top + 'px';
        animatedPiece.style.width = fromRect.width + 'px';
        animatedPiece.style.height = fromRect.height + 'px';
        animatedPiece.style.zIndex = '1000';
        animatedPiece.style.transition = 'all 0.5s ease-in-out';
        
        document.body.appendChild(animatedPiece);
        
        // Hide original
        pieceElement.style.opacity = '0';
        
        // Animate
        requestAnimationFrame(() => {
            animatedPiece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        // Complete animation
        setTimeout(() => {
            toSquare.appendChild(pieceElement);
            pieceElement.style.opacity = '1';
            animatedPiece.remove();
            callback();
        }, 500);
    }
    
    capturePiece(piece) {
        const square = this.squares[piece.position.row][piece.position.col];
        const pieceElement = square.querySelector(`[data-piece-id="${piece.id}"]`);
        
        // Capture animation
        pieceElement.style.animation = 'piece-capture 0.5s ease-out';
        
        setTimeout(() => {
            pieceElement.remove();
            piece.captured = true;
            
            this.emit('pieceCaptured', { piece });
        }, 500);
    }
    
    shouldPromoteToKing(piece, row) {
        const promotionRow = piece.team === 'player' ? 0 : 7;
        return row === promotionRow && !piece.isKing;
    }
    
    promoteToKing(piece) {
        piece.isKing = true;
        
        const square = this.squares[piece.position.row][piece.position.col];
        const pieceElement = square.querySelector(`[data-piece-id="${piece.id}"]`);
        
        // Add crown
        const crown = document.createElement('div');
        crown.className = 'piece-crown';
        crown.textContent = '♔';
        pieceElement.appendChild(crown);
        
        // Celebration animation
        pieceElement.style.animation = 'king-promotion 1s ease-out';
        
        this.emit('piecePromoted', { piece });
    }
    
    // Emotional overlays
    createEmotionalOverlay() {
        this.emotionalOverlay = document.createElement('div');
        this.emotionalOverlay.className = 'emotional-overlay';
        this.emotionalOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        
        this.boardElement.appendChild(this.emotionalOverlay);
    }
    
    showEmotionalWave(epicenter, emotion) {
        const wave = document.createElement('div');
        wave.className = `emotional-wave ${emotion}`;
        
        const rect = this.squares[epicenter.row][epicenter.col].getBoundingClientRect();
        const boardRect = this.boardElement.getBoundingClientRect();
        
        wave.style.cssText = `
            position: absolute;
            left: ${rect.left - boardRect.left + rect.width / 2}px;
            top: ${rect.top - boardRect.top + rect.height / 2}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, ${this.getEmotionColor(emotion)} 0%, transparent 70%);
            transform: translate(-50%, -50%);
            animation: emotional-wave 1.5s ease-out;
        `;
        
        this.emotionalOverlay.appendChild(wave);
        
        setTimeout(() => wave.remove(), 1500);
    }
    
    getEmotionColor(emotion) {
        const colors = {
            anxious: 'rgba(245, 158, 11, 0.5)',
            calm: 'rgba(16, 185, 129, 0.5)',
            joy: 'rgba(251, 191, 36, 0.5)',
            sadness: 'rgba(59, 130, 246, 0.5)',
            anger: 'rgba(239, 68, 68, 0.5)',
            fear: 'rgba(139, 92, 246, 0.5)'
        };
        
        return colors[emotion] || 'rgba(156, 163, 175, 0.5)';
    }
    
    // Relationship visualization
    createRelationshipLayer() {
        this.relationshipCanvas = document.createElement('canvas');
        this.relationshipCanvas.className = 'relationship-layer';
        this.relationshipCanvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
        `;
        
        this.boardElement.appendChild(this.relationshipCanvas);
        this.relationshipCtx = this.relationshipCanvas.getContext('2d');
        
        // Size canvas
        this.resizeRelationshipCanvas();
        window.addEventListener('resize', () => this.resizeRelationshipCanvas());
    }
    
    resizeRelationshipCanvas() {
        const rect = this.boardElement.getBoundingClientRect();
        this.relationshipCanvas.width = rect.width;
        this.relationshipCanvas.height = rect.height;
    }
    
    drawRelationships(pieces) {
        const ctx = this.relationshipCtx;
        ctx.clearRect(0, 0, this.relationshipCanvas.width, this.relationshipCanvas.height);
        
        // Only draw relationships above threshold
        const threshold = 3;
        
        pieces.forEach(piece1 => {
            if (piece1.captured) return;
            
            piece1.relationshipMap.forEach((value, piece2Id) => {
                const piece2 = pieces.find(p => p.id === piece2Id);
                if (!piece2 || piece2.captured || Math.abs(value) < threshold) return;
                
                // Don't draw twice
                if (piece1.id < piece2.id) {
                    this.drawRelationshipLine(piece1, piece2, value);
                }
            });
        });
    }
    
    drawRelationshipLine(piece1, piece2, relationshipValue) {
        const ctx = this.relationshipCtx;
        
        const pos1 = this.getPieceCenter(piece1.position);
        const pos2 = this.getPieceCenter(piece2.position);
        
        // Set line style based on relationship
        if (relationshipValue > 0) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${relationshipValue / 10})`;
            ctx.setLineDash([]);
        } else {
            ctx.strokeStyle = `rgba(239, 68, 68, ${Math.abs(relationshipValue) / 10})`;
            ctx.setLineDash([5, 5]);
        }
        
        ctx.lineWidth = Math.abs(relationshipValue) / 2;
        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
    }
    
    getPieceCenter(position) {
        const square = this.squares[position.row][position.col];
        const rect = square.getBoundingClientRect();
        const boardRect = this.boardElement.getBoundingClientRect();
        
        return {
            x: rect.left - boardRect.left + rect.width / 2,
            y: rect.top - boardRect.top + rect.height / 2
        };
    }
    
    // Utility methods
    getPieceAt(row, col) {
        for (const piece of this.pieces.values()) {
            if (!piece.captured && 
                piece.position.row === row && 
                piece.position.col === col) {
                return piece;
            }
        }
        return null;
    }
    
    clearLastMove() {
        document.querySelectorAll('.last-move-from, .last-move-to').forEach(square => {
            square.classList.remove('last-move-from', 'last-move-to');
        });
    }
    
    showInvalidMoveFeedback(row, col) {
        const square = this.squares[row][col];
        square.style.animation = 'invalid-move 0.5s ease-out';
        
        setTimeout(() => {
            square.style.animation = '';
        }, 500);
    }
    
    announceSelection(piece) {
        const announcement = `Selected ${piece.name}, ${piece.emotionalState} state, trust level ${piece.trust}`;
        window.accessibility?.announce(announcement);
    }
    
    showSquareEmotions(square) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = this.getPieceAt(row, col);
        
        if (piece && piece.emotionalState !== 'regulated') {
            const resonance = square.querySelector('.square-resonance');
            resonance.classList.add('active');
            resonance.style.setProperty('--resonance-color', 
                this.getEmotionColor(piece.emotionalState));
            
            setTimeout(() => {
                resonance.classList.remove('active');
            }, 2000);
        }
    }
    
    // Touch support
    setupTouchSupport() {
        let touchStartPiece = null;
        
        this.boardElement.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            const square = element?.closest('.board-square');
            
            if (square) {
                const row = parseInt(square.dataset.row);
                const col = parseInt(square.dataset.col);
                touchStartPiece = this.getPieceAt(row, col);
                
                if (touchStartPiece) {
                    this.selectPiece(touchStartPiece);
                }
            }
        });
        
        this.boardElement.addEventListener('touchend', (e) => {
            if (!touchStartPiece || !this.selectedPiece) return;
            
            const touch = e.changedTouches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            const square = element?.closest('.board-square');
            
            if (square) {
                const row = parseInt(square.dataset.row);
                const col = parseInt(square.dataset.col);
                this.handleSquareClick(row, col);
            }
            
            touchStartPiece = null;
        });
    }
    
    // Keyboard navigation
    handleKeyboardNavigation(e) {
        if (!this.selectedPiece) return;
        
        const pos = this.selectedPiece.position;
        let newRow = pos.row;
        let newCol = pos.col;
        
        switch(e.key) {
            case 'ArrowUp': newRow--; break;
            case 'ArrowDown': newRow++; break;
            case 'ArrowLeft': newCol--; break;
            case 'ArrowRight': newCol++; break;
            case 'Enter':
            case ' ':
                // Confirm move
                if (this.possibleMoves.some(m => m.row === newRow && m.col === newCol)) {
                    this.handleSquareClick(newRow, newCol);
                }
                return;
            default:
                return;
        }
        
        e.preventDefault();
        
        if (this.isInBounds(newRow, newCol)) {
            // Move focus
            this.squares[newRow][newCol].focus();
            
            // Preview move
            if (this.possibleMoves.some(m => m.row === newRow && m.col === newCol)) {
                this.squares[newRow][newCol].classList.add('preview-move');
            }
        }
    }
    
    // Storm effects
    applyStormEffect(intensity) {
        this.boardElement.classList.add('storm-active');
        this.boardElement.style.setProperty('--storm-intensity', intensity);
        
        // Shake effect
        if (intensity > 0.7) {
            this.boardElement.style.animation = 'storm-shake 0.5s ease-in-out infinite';
        }
    }
    
    removeStormEffect() {
        this.boardElement.classList.remove('storm-active');
        this.boardElement.style.animation = '';
    }
    
    // Cleanup
    destroy() {
        this.clearSelection();
        this.pieces.clear();
        this.boardElement.remove();
    }
}

// Additional styles
const additionalStyles = `
    .game-piece {
        width: 80%;
        height: 80%;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        background: var(--piece-color);
        border: 2px solid var(--piece-border);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .piece-visual {
        font-size: 1.5rem;
        color: white;
    }
    
    .piece-name {
        position: absolute;
        bottom: -20px;
        font-size: 0.75rem;
        white-space: nowrap;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
    }
    
    .emotional-indicator {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 0.8rem;
    }
    
    .emotional-indicator.anxious {
        background: #F59E0B;
        animation: anxious-pulse 1s ease-in-out infinite;
    }
    
    .emotional-indicator.shutdown {
        background: #6B7280;
    }
    
    .emotional-indicator.fight {
        background: #EF4444;
        animation: fight-pulse 0.5s ease-in-out infinite;
    }
    
    .emotional-indicator.freeze {
        background: #60A5FA;
    }
    
    .emotional-indicator.fawn {
        background: #C084FC;
    }
    
    .emotional-indicator.regulated {
        background: #10B981;
    }
    
    .trust-meter {
        position: absolute;
        bottom: -10px;
        width: 80%;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .trust-fill {
        height: 100%;
        background: linear-gradient(to right, #EF4444, #F59E0B, #10B981);
        transition: width 0.5s ease;
    }
    
    .piece-crown {
        position: absolute;
        top: -15px;
        color: #FCD34D;
        font-size: 1rem;
        filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    }
    
    @keyframes piece-enter {
        from {
            transform: scale(0);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes piece-capture {
        to {
            transform: scale(0) rotate(180deg);
            opacity: 0;
        }
    }
    
    @keyframes king-promotion {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    @keyframes invalid-move {
        0%, 100% { background-color: inherit; }
        50% { background-color: rgba(239, 68, 68, 0.5); }
    }
    
    @keyframes anxious-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
    
    @keyframes emotional-wave {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
    
    @keyframes storm-shake {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-2px, 1px); }
        50% { transform: translate(1px, -2px); }
        75% { transform: translate(2px, 1px); }
    }
`;

// Inject additional styles
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);