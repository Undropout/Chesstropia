// Accessibility features for emotional gaming
export class AccessibilityManager {
    constructor() {
        this.settings = this.loadSettings();
        this.announcer = null;
        this.focusTrap = null;
        this.shortcuts = new Map();
        
        this.initialize();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('chesstropia_accessibility');
        return saved ? JSON.parse(saved) : this.getDefaultSettings();
    }
    
    getDefaultSettings() {
        return {
            // Visual
            highContrast: false,
            colorBlindMode: 'none', // none, protanopia, deuteranopia, tritanopia
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            largeText: false,
            focusIndicators: true,
            
            // Audio
            screenReader: true,
            soundCues: true,
            emotionalAudioDescription: true,
            
            // Motor
            stickyKeys: false,
            clickAssist: false,
            dragAssist: true,
            keyboardNavigation: true,
            
            // Cognitive
            simplifiedMode: false,
            extendedTimers: false,
            emotionalIntensityFilter: false,
            pauseOnFocusLoss: true,
            
            // Emotional
            contentWarnings: true,
            emotionalBuffering: false, // Gradual emotional transitions
            safeMode: false // Reduced trauma triggers
        };
    }
    
    initialize() {
        this.createAnnouncer();
        this.applySettings();
        this.setupKeyboardShortcuts();
        this.setupFocusManagement();
        this.monitorPreferences();
    }
    
    // Screen reader announcements
    createAnnouncer() {
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('role', 'status');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.className = 'sr-only';
        this.announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(this.announcer);
    }
    
    announce(message, priority = 'polite') {
        if (!this.settings.screenReader) return;
        
        // Clear previous announcement
        this.announcer.textContent = '';
        
        // Set priority
        this.announcer.setAttribute('aria-live', priority);
        
        // Announce after a brief delay to ensure it's read
        setTimeout(() => {
            this.announcer.textContent = message;
        }, 100);
    }
    
    // Emotional state descriptions for screen readers
    describeEmotionalState(piece) {
        const descriptions = {
            anxious: `${piece.name} is anxious, showing signs of worry and nervousness`,
            shutdown: `${piece.name} has shut down emotionally and is very quiet`,
            fight: `${piece.name} is in fight mode, feeling angry and defensive`,
            freeze: `${piece.name} is frozen, unable to move or respond`,
            fawn: `${piece.name} is fawning, trying desperately to please`,
            regulated: `${piece.name} is emotionally regulated and calm`
        };
        
        const trust = piece.trust;
        const trustDesc = trust >= 7 ? 'high trust' : 
                         trust >= 3 ? 'moderate trust' : 
                         trust >= 0 ? 'low trust' : 'very low trust';
        
        return `${descriptions[piece.emotionalState]}. Trust level: ${trust} (${trustDesc})`;
    }
    
    // Apply accessibility settings
    applySettings() {
        const root = document.documentElement;
        
        // High contrast
        if (this.settings.highContrast) {
            root.classList.add('high-contrast');
            this.applyHighContrastStyles();
        } else {
            root.classList.remove('high-contrast');
        }
        
        // Color blind modes
        this.applyColorBlindMode(this.settings.colorBlindMode);
        
        // Reduced motion
        if (this.settings.reducedMotion) {
            root.classList.add('reduced-motion');
            this.applyReducedMotionStyles();
        } else {
            root.classList.remove('reduced-motion');
        }
        
        // Large text
        if (this.settings.largeText) {
            root.style.setProperty('--base-font-size', '20px');
            root.style.setProperty('--scale-factor', '1.25');
        } else {
            root.style.setProperty('--base-font-size', '16px');
            root.style.setProperty('--scale-factor', '1');
        }
        
        // Focus indicators
        this.updateFocusIndicators(this.settings.focusIndicators);
    }
    
    applyHighContrastStyles() {
        const style = document.createElement('style');
        style.id = 'high-contrast-styles';
        style.textContent = `
            .high-contrast {
                --bg-primary: #000000;
                --bg-secondary: #1a1a1a;
                --text-primary: #ffffff;
                --text-secondary: #e0e0e0;
                --border-color: #ffffff;
                --focus-color: #ffff00;
            }
            
            .high-contrast .piece {
                border: 3px solid var(--border-color);
                font-weight: bold;
            }
            
            .high-contrast .emotional-state-anxious {
                background-pattern: repeating-linear-gradient(
                    45deg,
                    #ff0000,
                    #ff0000 10px,
                    #000000 10px,
                    #000000 20px
                );
            }
            
            .high-contrast button {
                border: 2px solid var(--border-color);
                font-weight: bold;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    applyColorBlindMode(mode) {
        const filters = {
            protanopia: 'url(#protanopia-filter)',
            deuteranopia: 'url(#deuteranopia-filter)',
            tritanopia: 'url(#tritanopia-filter)',
            none: 'none'
        };
        
        document.documentElement.style.filter = filters[mode] || 'none';
        
        // Create SVG filters if needed
        if (mode !== 'none' && !document.getElementById(`${mode}-filter`)) {
            this.createColorBlindFilter(mode);
        }
    }
    
    createColorBlindFilter(type) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.display = 'none';
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.id = `${type}-filter`;
        
        const colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
        colorMatrix.setAttribute('type', 'matrix');
        
        // Color transformation matrices for different types of color blindness
        const matrices = {
            protanopia: '0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0',
            deuteranopia: '0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0',
            tritanopia: '0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0'
        };
        
        colorMatrix.setAttribute('values', matrices[type]);
        filter.appendChild(colorMatrix);
        defs.appendChild(filter);
        svg.appendChild(defs);
        document.body.appendChild(svg);
    }
    
    applyReducedMotionStyles() {
        const style = document.createElement('style');
        style.id = 'reduced-motion-styles';
        style.textContent = `
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            .reduced-motion .emotional-particle {
                display: none;
            }
            
            .reduced-motion .storm-effect {
                animation: none;
                opacity: 0.8;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    updateFocusIndicators(enabled) {
        if (enabled) {
            document.body.classList.add('focus-indicators');
            
            const style = document.createElement('style');
            style.id = 'focus-indicator-styles';
            style.textContent = `
                .focus-indicators *:focus {
                    outline: 3px solid var(--focus-color, #0066cc);
                    outline-offset: 2px;
                    box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.25);
                }
                
                .focus-indicators .piece:focus {
                    transform: scale(1.05);
                    z-index: 100;
                }
                
                .focus-indicators button:focus {
                    transform: translateY(-2px);
                }
            `;
            document.head.appendChild(style);
        } else {
            document.body.classList.remove('focus-indicators');
            const style = document.getElementById('focus-indicator-styles');
            if (style) style.remove();
        }
    }
    
    // Keyboard navigation
    setupKeyboardShortcuts() {
        // Game shortcuts
        this.registerShortcut('Space', 'Pause/Resume game', () => {
            window.gameController?.togglePause();
            this.announce('Game ' + (window.gameController?.isPaused ? 'paused' : 'resumed'));
        });
        
        this.registerShortcut('Tab', 'Navigate between pieces', (e) => {
            e.preventDefault();
            this.navigateToNextPiece(e.shiftKey);
        });
        
        this.registerShortcut('Enter', 'Select/activate focused element', () => {
            document.activeElement?.click();
        });
        
        this.registerShortcut('Escape', 'Cancel current action', () => {
            window.gameController?.cancelAction();
            this.announce('Action cancelled');
        });
        
        // Emotional commands shortcuts
        this.registerShortcut('1', 'Empathy: Validate', () => this.triggerEmpathy('validate'));
        this.registerShortcut('2', 'Empathy: Soothe', () => this.triggerEmpathy('soothe'));
        this.registerShortcut('3', 'Empathy: Give Space', () => this.triggerEmpathy('space'));
        this.registerShortcut('4', 'Empathy: Encourage', () => this.triggerEmpathy('encourage'));
        
        // Accessibility shortcuts
        this.registerShortcut('Alt+H', 'Toggle high contrast', () => {
            this.settings.highContrast = !this.settings.highContrast;
            this.applySettings();
            this.saveSettings();
            this.announce('High contrast ' + (this.settings.highContrast ? 'enabled' : 'disabled'));
        });
        
        this.registerShortcut('Alt+M', 'Toggle reduced motion', () => {
            this.settings.reducedMotion = !this.settings.reducedMotion;
            this.applySettings();
            this.saveSettings();
            this.announce('Reduced motion ' + (this.settings.reducedMotion ? 'enabled' : 'disabled'));
        });
        
        this.registerShortcut('Alt+A', 'Announce game state', () => {
            this.announceGameState();
        });
        
        // Navigation shortcuts
        this.registerShortcut('ArrowKeys', 'Navigate board', (e) => {
            if (document.activeElement?.classList.contains('piece')) {
                this.navigateBoard(e.key);
            }
        });
    }
    
    registerShortcut(key, description, handler) {
        this.shortcuts.set(key, { description, handler });
        
        document.addEventListener('keydown', (e) => {
            const shortcut = this.shortcuts.get(e.key) || 
                           this.shortcuts.get(`${e.altKey ? 'Alt+' : ''}${e.key.toUpperCase()}`);
            
            if (shortcut && !e.target.matches('input, textarea')) {
                shortcut.handler(e);
            }
        });
    }
    
    triggerEmpathy(command) {
        const selected = document.querySelector('.piece.selected');
        if (selected && selected.dataset.needsEmpathy === 'true') {
            window.gameController?.processEmpathyCommand(command);
            this.announce(`Empathy command: ${command}`);
        } else {
            this.announce('Select a dysregulated piece first');
        }
    }
    
    // Board navigation
    navigateToNextPiece(reverse = false) {
        const pieces = Array.from(document.querySelectorAll('.piece:not(.captured)'));
        const currentIndex = pieces.indexOf(document.activeElement);
        
        let nextIndex;
        if (reverse) {
            nextIndex = currentIndex <= 0 ? pieces.length - 1 : currentIndex - 1;
        } else {
            nextIndex = currentIndex >= pieces.length - 1 ? 0 : currentIndex + 1;
        }
        
        pieces[nextIndex]?.focus();
        this.announcePiece(pieces[nextIndex]);
    }
    
    navigateBoard(direction) {
        const current = document.activeElement;
        if (!current?.classList.contains('piece')) return;
        
        const pos = {
            row: parseInt(current.dataset.row),
            col: parseInt(current.dataset.col)
        };
        
        switch(direction) {
            case 'ArrowUp': pos.row = Math.max(0, pos.row - 1); break;
            case 'ArrowDown': pos.row = Math.min(7, pos.row + 1); break;
            case 'ArrowLeft': pos.col = Math.max(0, pos.col - 1); break;
            case 'ArrowRight': pos.col = Math.min(7, pos.col + 1); break;
        }
        
        const target = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
        if (target) {
            target.focus();
            this.announcePiece(target);
        } else {
            this.announce('Empty square');
        }
    }
    
    announcePiece(element) {
        if (!element) return;
        
        const piece = window.gameState?.pieces.get(element.dataset.pieceId);
        if (piece) {
            const description = this.describeEmotionalState(piece);
            const position = `Row ${parseInt(element.dataset.row) + 1}, Column ${parseInt(element.dataset.col) + 1}`;
            this.announce(`${description}. ${position}`);
        }
    }
    
    announceGameState() {
        const state = window.gameState;
        if (!state) {
            this.announce('No game in progress');
            return;
        }
        
        const playerPieces = Array.from(state.pieces.values()).filter(p => p.team === 'player' && !p.captured);
        const opponentPieces = Array.from(state.pieces.values()).filter(p => p.team === 'opponent' && !p.captured);
        
        const emotionalSummary = this.summarizeEmotionalStates(playerPieces);
        const trustAverage = playerPieces.reduce((sum, p) => sum + p.trust, 0) / playerPieces.length;
        
        const message = `
            Your turn. 
            ${playerPieces.length} pieces remaining, ${opponentPieces.length} opponent pieces.
            Team emotional state: ${emotionalSummary}.
            Average trust level: ${trustAverage.toFixed(1)}.
            ${state.activeStorm ? 'Emotional storm is active!' : ''}
        `;
        
        this.announce(message, 'assertive');
    }
    
    summarizeEmotionalStates(pieces) {
        const states = {};
        pieces.forEach(p => {
            states[p.emotionalState] = (states[p.emotionalState] || 0) + 1;
        });
        
        const summary = Object.entries(states)
            .map(([state, count]) => `${count} ${state}`)
            .join(', ');
        
        return summary || 'all regulated';
    }
    
    // Focus management
    setupFocusManagement() {
        // Track focus for focus trap
        this.lastFocusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            this.lastFocusedElement = e.target;
            
            // Announce focused element if it has description
            const description = e.target.getAttribute('aria-label') || 
                              e.target.getAttribute('aria-describedby');
            if (description) {
                this.announce(description);
            }
        });
    }
    
    createFocusTrap(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
        
        // Focus first element
        firstFocusable?.focus();
        
        return () => {
            // Cleanup function to restore focus
            this.lastFocusedElement?.focus();
        };
    }
    
    // Content warnings
    showContentWarning(content) {
        if (!this.settings.contentWarnings) return Promise.resolve(true);
        
        const warning = document.createElement('div');
        warning.className = 'content-warning-modal';
        warning.setAttribute('role', 'alertdialog');
        warning.setAttribute('aria-labelledby', 'warning-title');
        warning.setAttribute('aria-describedby', 'warning-desc');
        
        warning.innerHTML = `
            <div class="warning-content">
                <h2 id="warning-title">Content Warning</h2>
                <p id="warning-desc">${content.description}</p>
                <p>This content includes: ${content.triggers.join(', ')}</p>
                <div class="warning-actions">
                    <button class="continue-btn">Continue</button>
                    <button class="skip-btn">Skip this content</button>
                    <button class="safe-mode-btn">Enable Safe Mode</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(warning);
        const cleanup = this.createFocusTrap(warning);
        
        return new Promise(resolve => {
            warning.querySelector('.continue-btn').addEventListener('click', () => {
                cleanup();
                warning.remove();
                resolve(true);
            });
            
            warning.querySelector('.skip-btn').addEventListener('click', () => {
                cleanup();
                warning.remove();
                resolve(false);
            });
            
            warning.querySelector('.safe-mode-btn').addEventListener('click', () => {
                this.settings.safeMode = true;
                this.saveSettings();
                cleanup();
                warning.remove();
                resolve(false);
            });
        });
    }
    
    // Emotional intensity filtering
    filterEmotionalIntensity(content) {
        if (!this.settings.emotionalIntensityFilter) return content;
        
        // Reduce intensity of emotional content
        const filtered = { ...content };
        
        if (filtered.emotionalLevel > 7) {
            filtered.emotionalLevel = 7;
            filtered.text = this.softenLanguage(filtered.text);
        }
        
        return filtered;
    }
    
    softenLanguage(text) {
        const replacements = {
            'devastating': 'difficult',
            'traumatic': 'challenging',
            'overwhelming': 'intense',
            'crushing': 'heavy',
            'unbearable': 'very hard'
        };
        
        let softened = text;
        Object.entries(replacements).forEach(([harsh, soft]) => {
            softened = softened.replace(new RegExp(harsh, 'gi'), soft);
        });
        
        return softened;
    }
    
    // Motor accessibility
    setupClickAssist() {
        if (!this.settings.clickAssist) return;
        
        let clickTimer = null;
        let targetElement = null;
        
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('.piece, button')) {
                targetElement = e.target;
                clickTimer = setTimeout(() => {
                    targetElement.click();
                    this.announce('Auto-clicked: ' + (targetElement.getAttribute('aria-label') || 'element'));
                }, 1500);
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target === targetElement) {
                clearTimeout(clickTimer);
                targetElement = null;
            }
        }, true);
    }
    
    setupDragAssist() {
        if (!this.settings.dragAssist) return;
        
        // Convert drag operations to click-select-click-place
        document.addEventListener('mousedown', (e) => {
            if (e.target.matches('.piece')) {
                e.preventDefault();
                
                if (this.dragAssistSelection) {
                    // Place piece
                    const target = document.elementFromPoint(e.clientX, e.clientY);
                    if (target.matches('.board-square')) {
                        window.gameController?.movePiece(this.dragAssistSelection, target);
                    }
                    this.dragAssistSelection = null;
                } else {
                    // Select piece
                    this.dragAssistSelection = e.target;
                    e.target.classList.add('drag-assist-selected');
                    this.announce('Piece selected. Click destination square.');
                }
            }
        });
    }
    
    // Settings management
    saveSettings() {
        localStorage.setItem('chesstropia_accessibility', JSON.stringify(this.settings));
    }
    
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
        
        // Announce change
        this.announce(`${key} ${value ? 'enabled' : 'disabled'}`);
    }
    
    // Monitor system preferences
    monitorPreferences() {
        // Watch for reduced motion preference
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            if (e.matches !== this.settings.reducedMotion) {
                this.settings.reducedMotion = e.matches;
                this.applySettings();
                this.saveSettings();
            }
        });
        
        // Watch for high contrast preference
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        contrastQuery.addEventListener('change', (e) => {
            if (e.matches && !this.settings.highContrast) {
                this.settings.highContrast = true;
                this.applySettings();
                this.saveSettings();
            }
        });
        
        // Watch for color scheme preference
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkQuery.addEventListener('change', (e) => {
            // Adjust color themes accordingly
            this.applySettings();
        });
    }
    
    // Cognitive load reduction
    enableSimplifiedMode() {
        this.settings.simplifiedMode = true;
        
        // Hide non-essential UI elements
        document.querySelectorAll('.decorative, .particle, .complex-animation').forEach(el => {
            el.style.display = 'none';
        });
        
        // Simplify text
        document.querySelectorAll('.complex-text').forEach(el => {
            el.classList.add('simplified');
        });
        
        // Reduce choices
        window.gameController?.setSimplifiedChoices(true);
        
        this.announce('Simplified mode enabled');
        this.saveSettings();
    }
    
    // Extended timers for motor/cognitive needs
    extendTimers(factor = 2) {
        this.settings.extendedTimers = true;
        this.settings.timerFactor = factor;
        
        // Apply to all game timers
        window.gameController?.setTimerFactor(factor);
        
        this.announce(`Timers extended by ${factor}x`);
        this.saveSettings();
    }
    
    // Generate accessibility report
    getAccessibilityReport() {
        return {
            settings: this.settings,
            shortcuts: Array.from(this.shortcuts.entries()).map(([key, data]) => ({
                key,
                description: data.description
            })),
            activeFeatures: Object.entries(this.settings)
                .filter(([key, value]) => value === true)
                .map(([key]) => key),
            recommendations: this.getRecommendations()
        };
    }
    
    getRecommendations() {
        const recommendations = [];
        
        if (!this.settings.keyboardNavigation) {
            recommendations.push({
                feature: 'Keyboard Navigation',
                reason: 'Enables full game control without mouse',
                benefit: 'Motor accessibility'
            });
        }
        
        if (!this.settings.screenReader && !this.settings.soundCues) {
            recommendations.push({
                feature: 'Sound Cues',
                reason: 'Audio feedback for game events',
                benefit: 'Visual accessibility'
            });
        }
        
        return recommendations;
    }
}

// Export singleton
export const accessibility = new AccessibilityManager();

// Quick access functions
export const announce = (message, priority) => accessibility.announce(message, priority);
export const describePiece = (piece) => accessibility.describeEmotionalState(piece);
export const enableAccessibility = (feature) => accessibility.updateSetting(feature, true);