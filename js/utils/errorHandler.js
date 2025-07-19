// Graceful error handling with emotional awareness
export class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.userFriendlyMode = true;
        this.supportEmail = 'support@chesstropia.example';
        
        this.initializeErrorHandling();
    }
    
    initializeErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error
            });
            
            event.preventDefault();
        });
        
        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || event.reason,
                promise: event.promise,
                error: event.reason
            });
            
            event.preventDefault();
        });
        
        // Game-specific error boundaries
        this.setupGameErrorBoundaries();
    }
    
    handleError(errorInfo) {
        // Log the error
        this.logError(errorInfo);
        
        // Categorize the error
        const category = this.categorizeError(errorInfo);
        
        // Determine impact
        const impact = this.assessImpact(category, errorInfo);
        
        // Take appropriate action
        this.respondToError(category, impact, errorInfo);
        
        // Report if critical
        if (impact === 'critical') {
            this.reportCriticalError(errorInfo);
        }
    }
    
    categorizeError(errorInfo) {
        const message = errorInfo.message?.toLowerCase() || '';
        const source = errorInfo.source || '';
        
        // Emotional state errors
        if (message.includes('emotional') || message.includes('trust') || 
            message.includes('breakthrough') || message.includes('dysregulation')) {
            return 'emotional_state';
        }
        
        // Game logic errors
        if (message.includes('move') || message.includes('piece') || 
            message.includes('board') || message.includes('capture')) {
            return 'game_logic';
        }
        
        // Save/load errors
        if (message.includes('save') || message.includes('load') || 
            message.includes('localstorage')) {
            return 'persistence';
        }
        
        // Audio/visual errors
        if (message.includes('audio') || message.includes('canvas') || 
            message.includes('webgl')) {
            return 'media';
        }
        
        // Network errors
        if (message.includes('fetch') || message.includes('network') || 
            message.includes('offline')) {
            return 'network';
        }
        
        // Memory errors
        if (message.includes('memory') || message.includes('heap') || 
            message.includes('maximum call stack')) {
            return 'memory';
        }
        
        return 'unknown';
    }
    
    assessImpact(category, errorInfo) {
        // Critical - game cannot continue
        const criticalCategories = ['game_logic', 'emotional_state'];
        const criticalPatterns = ['undefined', 'null', 'cannot read', 'is not a function'];
        
        if (criticalCategories.includes(category) || 
            criticalPatterns.some(pattern => errorInfo.message?.includes(pattern))) {
            return 'critical';
        }
        
        // High - feature broken but game playable
        const highCategories = ['persistence', 'network'];
        if (highCategories.includes(category)) {
            return 'high';
        }
        
        // Medium - degraded experience
        const mediumCategories = ['media'];
        if (mediumCategories.includes(category)) {
            return 'medium';
        }
        
        // Low - minor issue
        return 'low';
    }
    
    respondToError(category, impact, errorInfo) {
        switch (impact) {
            case 'critical':
                this.handleCriticalError(category, errorInfo);
                break;
            case 'high':
                this.handleHighImpactError(category, errorInfo);
                break;
            case 'medium':
                this.handleMediumImpactError(category, errorInfo);
                break;
            case 'low':
                this.handleLowImpactError(category, errorInfo);
                break;
        }
    }
    
    handleCriticalError(category, errorInfo) {
        // Show empathetic error message
        const message = this.getEmpatheticErrorMessage(category, 'critical');
        
        // Create recovery modal
        const modal = this.createErrorModal({
            title: "Something went wrong 💔",
            message: message,
            actions: [
                {
                    text: "Try to Recover",
                    handler: () => this.attemptRecovery(category)
                },
                {
                    text: "Save Progress & Reload",
                    handler: () => this.saveAndReload()
                },
                {
                    text: "Contact Support",
                    handler: () => this.openSupport(errorInfo)
                }
            ]
        });
        
        document.body.appendChild(modal);
        
        // Attempt auto-recovery first
        setTimeout(() => {
            if (this.attemptAutoRecovery(category)) {
                modal.remove();
                this.showNotification("Recovered from error! Your pieces are safe.", 'success');
            }
        }, 1000);
    }
    
    handleHighImpactError(category, errorInfo) {
        const message = this.getEmpatheticErrorMessage(category, 'high');
        
        // Show notification with options
        this.showNotification(message, 'warning', {
            actions: [
                {
                    text: "Try Again",
                    handler: () => this.retryFailedOperation(category)
                },
                {
                    text: "Continue Without",
                    handler: () => this.continueWithoutFeature(category)
                }
            ]
        });
    }
    
    handleMediumImpactError(category, errorInfo) {
        const message = this.getEmpatheticErrorMessage(category, 'medium');
        
        // Show brief notification
        this.showNotification(message, 'info', {
            duration: 5000,
            dismissible: true
        });
        
        // Automatically degrade feature
        this.degradeFeature(category);
    }
    
    handleLowImpactError(category, errorInfo) {
        // Just log it, don't bother the user
        console.log('Minor issue detected:', errorInfo.message);
        
        // Maybe show in debug mode only
        if (this.isDebugMode()) {
            this.showNotification('Minor issue logged', 'debug', {
                duration: 2000
            });
        }
    }
    
    getEmpatheticErrorMessage(category, impact) {
        const messages = {
            emotional_state: {
                critical: "The emotional connection got tangled. Your pieces are confused but safe. Let's help them together.",
                high: "Having trouble reading emotions right now. The pieces understand - sometimes feelings are complicated.",
                medium: "Emotional signals are a bit fuzzy. We're still here with you.",
                low: "Tiny emotional hiccup. Nothing to worry about."
            },
            game_logic: {
                critical: "The game rules got confused. Like when you forget the rules mid-game. Let's reset together.",
                high: "Move didn't work as expected. Even games have off days.",
                medium: "Board logic needs a moment to catch up.",
                low: "Small rule confusion, already sorted."
            },
            persistence: {
                critical: "Can't save your emotional progress right now. But your connections are real, even if unsaved.",
                high: "Saving is having troubles. Your progress matters - let's protect it.",
                medium: "Save feature is taking a break. We'll keep trying.",
                low: "Auto-save hiccup. Manual save still works."
            },
            media: {
                critical: "Visuals/sounds aren't working. The emotions are still there, just quieter.",
                high: "Some effects aren't loading. The game's heart still beats.",
                medium: "Reduced visual effects. Sometimes simple is better.",
                low: "Minor visual glitch. Blink and you'll miss it."
            },
            network: {
                critical: "Connection lost. But you're not alone - the game works offline too.",
                high: "Internet is being moody. We understand mood swings here.",
                medium: "Slow connection. Patience is a virtue we're practicing.",
                low: "Network hiccup. It happens."
            },
            memory: {
                critical: "Running low on memory. Like when too many feelings overflow. Let's clear some space.",
                high: "Memory getting full. Time to let go of some old data.",
                medium: "Memory usage high. We're tidying up.",
                low: "Memory optimizing. Spring cleaning in progress."
            },
            unknown: {
                critical: "Something unexpected happened. Even in Chesstropia, surprises occur. We're here to help.",
                high: "Unusual situation detected. Life's full of mysteries.",
                medium: "Something odd occurred. Investigating gently.",
                low: "Tiny mystery. Probably nothing."
            }
        };
        
        return messages[category]?.[impact] || messages.unknown[impact];
    }
    
    createErrorModal(options) {
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.setAttribute('role', 'alertdialog');
        modal.setAttribute('aria-labelledby', 'error-title');
        modal.setAttribute('aria-describedby', 'error-message');
        
        modal.innerHTML = `
            <div class="error-modal-content">
                <h2 id="error-title">${options.title}</h2>
                <p id="error-message">${options.message}</p>
                <div class="error-modal-actions">
                    ${options.actions.map((action, index) => `
                        <button class="error-action-${index}">${action.text}</button>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const content = modal.querySelector('.error-modal-content');
        content.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        `;
        
        // Attach handlers
        options.actions.forEach((action, index) => {
            modal.querySelector(`.error-action-${index}`).addEventListener('click', () => {
                action.handler();
                modal.remove();
            });
        });
        
        return modal;
    }
    
    showNotification(message, type = 'info', options = {}) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style based on type
        const styles = {
            info: 'background: #3B82F6; color: white;',
            warning: 'background: #F59E0B; color: white;',
            error: 'background: #EF4444; color: white;',
            success: 'background: #10B981; color: white;',
            debug: 'background: #6B7280; color: white;'
        };
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            max-width: 400px;
            ${styles[type] || styles.info}
            animation: slide-in 0.3s ease-out;
        `;
        
        // Add actions if provided
        if (options.actions) {
            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '0.5rem';
            
            options.actions.forEach(action => {
                const button = document.createElement('button');
                button.textContent = action.text;
                button.style.cssText = `
                    margin-right: 0.5rem;
                    padding: 0.25rem 0.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 0.25rem;
                    color: white;
                    cursor: pointer;
                `;
                button.addEventListener('click', action.handler);
                actionsDiv.appendChild(button);
            });
            
            notification.appendChild(actionsDiv);
        }
        
        document.body.appendChild(notification);
        
        // Auto-dismiss
        const duration = options.duration || 5000;
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slide-out 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        // Make dismissible
        if (options.dismissible) {
            notification.style.cursor = 'pointer';
            notification.addEventListener('click', () => notification.remove());
        }
        
        return notification;
    }
    
    // Recovery methods
    attemptRecovery(category) {
        const recoveryStrategies = {
            emotional_state: () => this.recoverEmotionalStates(),
            game_logic: () => this.recoverGameLogic(),
            persistence: () => this.recoverPersistence(),
            media: () => this.recoverMedia(),
            network: () => this.recoverNetwork(),
            memory: () => this.recoverMemory()
        };
        
        const strategy = recoveryStrategies[category] || (() => false);
        
        try {
            return strategy();
        } catch (e) {
            console.error('Recovery failed:', e);
            return false;
        }
    }
    
    attemptAutoRecovery(category) {
        // Quick recovery attempts that don't require user interaction
        switch (category) {
            case 'emotional_state':
                // Reset emotional states to last known good
                if (window.gameState?.lastStableEmotionalState) {
                    window.gameState.restoreEmotionalStates();
                    return true;
                }
                break;
                
            case 'game_logic':
                // Validate and fix board state
                if (window.gameState?.validateBoardState()) {
                    return true;
                }
                break;
                
            case 'media':
                // Disable problematic media features
                window.audioManager?.disable();
                window.performanceOptimizer?.downgradePerformance();
                return true;
        }
        
        return false;
    }
    
    recoverEmotionalStates() {
        const gameState = window.gameState;
        if (!gameState) return false;
        
        // Reset all pieces to regulated state
        gameState.pieces.forEach(piece => {
            if (piece.emotionalState === undefined || piece.emotionalState === null) {
                piece.emotionalState = 'regulated';
                piece.dysregulationType = null;
                piece.dysregulationTurns = 0;
            }
        });
        
        // Restore trust to neutral if corrupted
        gameState.pieces.forEach(piece => {
            if (typeof piece.trust !== 'number' || isNaN(piece.trust)) {
                piece.trust = 0;
            }
        });
        
        return true;
    }
    
    recoverGameLogic() {
        const gameState = window.gameState;
        if (!gameState) return false;
        
        // Rebuild board from piece positions
        const board = new Array(8).fill(null).map(() => new Array(8).fill(null));
        
        gameState.pieces.forEach(piece => {
            if (!piece.captured && piece.position) {
                const { row, col } = piece.position;
                if (row >= 0 && row < 8 && col >= 0 && col < 8) {
                    board[row][col] = piece;
                }
            }
        });
        
        gameState.board = board;
        return true;
    }
    
    recoverPersistence() {
        // Try alternative storage methods
        try {
            // Try IndexedDB if localStorage fails
            if (!window.localStorage) {
                this.useIndexedDBFallback();
                return true;
            }
            
            // Clear corrupted saves
            const saves = Object.keys(localStorage)
                .filter(key => key.startsWith('chesstropia_save_'));
            
            saves.forEach(key => {
                try {
                    JSON.parse(localStorage.getItem(key));
                } catch {
                    // Remove corrupted save
                    localStorage.removeItem(key);
                }
            });
            
            return true;
        } catch {
            return false;
        }
    }
    
    recoverMedia() {
        // Disable all media features gracefully
        try {
            // Disable audio
            if (window.audioManager) {
                window.audioManager.setEnabled(false);
            }
            
            // Reduce visual effects
            document.body.classList.add('reduced-effects');
            
            // Disable particles
            if (window.particleSystem) {
                window.particleSystem.disable();
            }
            
            return true;
        } catch {
            return false;
        }
    }
    
    recoverNetwork() {
        // Enable offline mode
        window.offlineMode = true;
        
        // Cache critical resources
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
        
        return true;
    }
    
    recoverMemory() {
        // Free up memory
        try {
            // Clear undo history
            if (window.gameState?.undoHistory) {
                window.gameState.undoHistory = [];
            }
            
            // Reduce particle pool
            if (window.performanceOptimizer) {
                window.performanceOptimizer.cleanupUnusedAssets();
            }
            
            // Clear error log if too large
            if (this.errorLog.length > 50) {
                this.errorLog = this.errorLog.slice(-25);
            }
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            
            return true;
        } catch {
            return false;
        }
    }
    
    // Save and reload
    saveAndReload() {
        try {
            // Emergency save
            if (window.gameState) {
                const emergencySave = {
                    timestamp: Date.now(),
                    gameState: window.gameState,
                    error: 'emergency_save'
                };
                
                localStorage.setItem('chesstropia_emergency_save', 
                    JSON.stringify(emergencySave));
            }
            
            // Reload
            window.location.reload();
        } catch (e) {
            // If even this fails, just reload
            window.location.reload();
        }
    }
    
    // Feature degradation
    degradeFeature(category) {
        const degradations = {
            media: () => {
                document.body.classList.add('degraded-media');
                window.audioManager?.setVolume(0);
            },
            network: () => {
                window.offlineMode = true;
            },
            memory: () => {
                window.performanceOptimizer?.setPerformanceMode('low');
            }
        };
        
        const degrade = degradations[category];
        if (degrade) degrade();
    }
    
    // Error logging
    logError(errorInfo) {
        const logEntry = {
            timestamp: Date.now(),
            ...errorInfo,
            userAgent: navigator.userAgent,
            url: window.location.href,
            gameState: this.captureGameState()
        };
        
        this.errorLog.push(logEntry);
        
        // Keep log size manageable
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }
        
        // Store in localStorage for support
        try {
            localStorage.setItem('chesstropia_error_log', 
                JSON.stringify(this.errorLog.slice(-10)));
        } catch {
            // If localStorage is full, just continue
        }
    }
    
    captureGameState() {
        try {
            if (!window.gameState) return null;
            
            return {
                turn: window.gameState.currentTurn,
                pieces: window.gameState.pieces.size,
                averageTrust: this.calculateAverageTrust(),
                activeStorm: window.gameState.activeStorm,
                turnCount: window.gameState.turnCount
            };
        } catch {
            return null;
        }
    }
    
    calculateAverageTrust() {
        const pieces = Array.from(window.gameState.pieces.values());
        const playerPieces = pieces.filter(p => p.team === 'player');
        const totalTrust = playerPieces.reduce((sum, p) => sum + (p.trust || 0), 0);
        return totalTrust / playerPieces.length;
    }
    
    // Support
    openSupport(errorInfo) {
        const errorReport = this.generateErrorReport(errorInfo);
        const subject = encodeURIComponent('Chesstropia Error Report');
        const body = encodeURIComponent(errorReport);
        
        // Try to open email client
        window.open(`mailto:${this.supportEmail}?subject=${subject}&body=${body}`);
        
        // Also show copyable report
        this.showErrorReport(errorReport);
    }
    
    generateErrorReport(errorInfo) {
        return `
Chesstropia Error Report
========================

Error Type: ${errorInfo.type}
Category: ${this.categorizeError(errorInfo)}
Message: ${errorInfo.message}
Time: ${new Date().toISOString()}

Game State:
-----------
${JSON.stringify(this.captureGameState(), null, 2)}

Error Details:
--------------
${JSON.stringify(errorInfo, null, 2)}

User Agent: ${navigator.userAgent}
URL: ${window.location.href}

Recent Errors:
--------------
${this.errorLog.slice(-5).map(e => 
    `${new Date(e.timestamp).toLocaleTimeString()}: ${e.message}`
).join('\n')}

Please include any additional context about what you were doing when the error occurred.
        `;
    }
    
    showErrorReport(report) {
        const modal = this.createErrorModal({
            title: "Error Report",
            message: "Copy this report to share with support:",
            actions: [
                {
                    text: "Copy to Clipboard",
                    handler: () => {
                        navigator.clipboard.writeText(report);
                        this.showNotification("Report copied!", 'success');
                    }
                },
                {
                    text: "Close",
                    handler: () => {}
                }
            ]
        });
        
        // Add textarea with report
        const textarea = document.createElement('textarea');
        textarea.value = report;
        textarea.readOnly = true;
        textarea.style.cssText = `
            width: 100%;
            height: 200px;
            margin: 1rem 0;
            padding: 0.5rem;
            font-family: monospace;
            font-size: 12px;
        `;
        
        modal.querySelector('.error-modal-content').insertBefore(
            textarea,
            modal.querySelector('.error-modal-actions')
        );
        
        document.body.appendChild(modal);
    }
    
    // Debug mode
    isDebugMode() {
        return localStorage.getItem('chesstropia_debug') === 'true' ||
               window.location.search.includes('debug=true');
    }
    
    enableDebugMode() {
        localStorage.setItem('chesstropia_debug', 'true');
        
        // Show debug panel
        this.createDebugPanel();
    }
    
    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            width: 300px;
            height: 200px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            font-family: monospace;
            font-size: 12px;
            overflow-y: auto;
            z-index: 9999;
        `;
        
        panel.innerHTML = `
            <h3>Debug Panel</h3>
            <div id="debug-content"></div>
            <button onclick="window.errorHandler.clearErrors()">Clear Errors</button>
            <button onclick="window.errorHandler.exportErrors()">Export Log</button>
        `;
        
        document.body.appendChild(panel);
        
        // Update panel periodically
        setInterval(() => {
            const content = document.getElementById('debug-content');
            if (content) {
                content.innerHTML = `
                    Errors: ${this.errorLog.length}<br>
                    Last Error: ${this.errorLog[this.errorLog.length - 1]?.message || 'None'}<br>
                    Memory: ${this.getMemoryUsage()}<br>
                    FPS: ${window.performanceOptimizer?.currentFPS || 'N/A'}
                `;
            }
        }, 1000);
    }
    
    getMemoryUsage() {
        if (performance.memory) {
            const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            const total = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
            return `${used}/${total} MB`;
        }
        return 'N/A';
    }
    
    clearErrors() {
        this.errorLog = [];
        localStorage.removeItem('chesstropia_error_log');
        this.showNotification('Error log cleared', 'info');
    }
    
    exportErrors() {
        const data = JSON.stringify(this.errorLog, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `chesstropia_errors_${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    // Game-specific error boundaries
    setupGameErrorBoundaries() {
        // Wrap critical game functions
        const criticalFunctions = [
            'processMove',
            'processEmpathy', 
            'triggerBreakthrough',
            'handleStorm'
        ];
        
        criticalFunctions.forEach(fnName => {
            if (window.gameController && typeof window.gameController[fnName] === 'function') {
                const originalFn = window.gameController[fnName];
                window.gameController[fnName] = (...args) => {
                    try {
                        return originalFn.apply(window.gameController, args);
                    } catch (error) {
                        this.handleError({
                            type: 'game_function',
                            function: fnName,
                            message: error.message,
                            error: error,
                            args: args
                        });
                        
                        // Return safe default
                        return null;
                    }
                };
            }
        });
    }
}

// Export singleton
export const errorHandler = new ErrorHandler();

// Make available globally for error reporting
window.errorHandler = errorHandler;

// Utility function for try-catch wrapping
export function safeExecute(fn, fallback = null, context = null) {
    try {
        return fn.call(context);
    } catch (error) {
        errorHandler.handleError({
            type: 'safe_execute',
            message: error.message,
            error: error,
            function: fn.name || 'anonymous'
        });
        
        return fallback;
    }
}

// Decorator for async error handling
export function asyncErrorHandler(target, propertyName, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            errorHandler.handleError({
                type: 'async_method',
                class: target.constructor.name,
                method: propertyName,
                message: error.message,
                error: error
            });
            
            throw error;
        }
    };
    
    return descriptor;
}