// Displays team morale, emotional weather, and active conditions
export class EmotionalHUD {
    constructor() {
        this.container = this.createHUDContainer();
        this.weatherEffects = new Map();
        this.activeAlerts = new Set();
        
        this.setupHUD();
        this.startUpdateLoop();
    }

    createHUDContainer() {
        const hud = document.createElement('div');
        hud.id = 'emotional-hud';
        hud.className = 'emotional-hud';
        document.querySelector('.game-container').appendChild(hud);
        return hud;
    }

    setupHUD() {
        this.container.innerHTML = `
            <div class="hud-section team-status">
                <h4>TEAM_STATUS.DAT</h4>
                <div class="morale-display">
                    <span class="label">Morale:</span>
                    <div class="morale-meter">
                        <div class="morale-fill"></div>
                        <div class="morale-hearts"></div>
                    </div>
                </div>
                <div class="trust-average">
                    <span class="label">Avg Trust:</span>
                    <span class="trust-value">5.0</span>
                </div>
                <div class="dysregulation-count">
                    <span class="label">Dysregulated:</span>
                    <span class="dysreg-value">0</span>
                </div>
            </div>
            
            <div class="hud-section weather-status">
                <h4>EMOTIONAL_WEATHER.SYS</h4>
                <div class="weather-display">
                    <div class="weather-icon"></div>
                    <div class="weather-text">STABLE</div>
                </div>
                <div class="weather-forecast"></div>
            </div>
            
            <div class="hud-section active-conditions">
                <h4>ACTIVE_CONDITIONS.LOG</h4>
                <div class="conditions-list"></div>
            </div>
            
            <div class="hud-section piece-monitor">
                <h4>PIECE_MONITOR.EXE</h4>
                <div class="monitor-grid"></div>
            </div>
        `;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for game state changes
        window.addEventListener('chesstropia:state_change', (e) => {
            this.update(e.detail.gameState);
        });
        
        // Listen for emotional events
        window.addEventListener('chesstropia:event', (e) => {
            this.handleEmotionalEvent(e.detail);
        });
        
        // Hover effects for piece monitor
        this.container.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('piece-indicator')) {
                this.showPieceTooltip(e.target);
            }
        });
        
        this.container.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('piece-indicator')) {
                this.hideTooltip();
            }
        });
    }

    startUpdateLoop() {
        // Update HUD periodically for animations
        setInterval(() => {
            this.updateAnimations();
        }, 100);
    }

    update(gameState) {
        if (!gameState) return;
        
        this.updateMorale(gameState.teamMorale);
        this.updateTrustAverage(gameState);
        this.updateDysregulationCount(gameState);
        this.updateWeather(gameState.emotionalWeather);
        this.updateActiveConditions(gameState);
        this.updatePieceMonitor(gameState);
    }

    updateMorale(morale) {
        const moraleEl = this.container.querySelector('.morale-fill');
        const heartsEl = this.container.querySelector('.morale-hearts');
        
        // Update bar
        const percentage = (morale / 10) * 100;
        moraleEl.style.width = `${percentage}%`;
        
        // Color based on level
        if (morale >= 7) {
            moraleEl.style.backgroundColor = 'var(--phosphor-green)';
        } else if (morale >= 4) {
            moraleEl.style.backgroundColor = 'var(--phosphor-amber)';
        } else {
            moraleEl.style.backgroundColor = 'var(--phosphor-magenta)';
        }
        
        // Update hearts display
        const fullHearts = Math.floor(morale / 2);
        const halfHeart = morale % 2 >= 1;
        const emptyHearts = 5 - fullHearts - (halfHeart ? 1 : 0);
        
        let heartsDisplay = '♥'.repeat(fullHearts);
        if (halfHeart) heartsDisplay += '♡';
        heartsDisplay += '♡'.repeat(emptyHearts);
        
        heartsEl.textContent = heartsDisplay;
        
        // Add warning animation if critical
        if (morale < 3) {
            moraleEl.classList.add('critical');
        } else {
            moraleEl.classList.remove('critical');
        }
    }

    updateTrustAverage(gameState) {
        const pieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        if (pieces.length === 0) {
            this.container.querySelector('.trust-value').textContent = 'N/A';
            return;
        }
        
        const totalTrust = pieces.reduce((sum, p) => sum + p.trust, 0);
        const avgTrust = (totalTrust / pieces.length).toFixed(1);
        
        const trustEl = this.container.querySelector('.trust-value');
        trustEl.textContent = avgTrust;
        
        // Color coding
        if (avgTrust >= 7) {
            trustEl.style.color = 'var(--phosphor-green)';
        } else if (avgTrust >= 3) {
            trustEl.style.color = 'var(--phosphor-cyan)';
        } else if (avgTrust >= 0) {
            trustEl.style.color = 'var(--phosphor-amber)';
        } else {
            trustEl.style.color = 'var(--phosphor-magenta)';
        }
    }

    updateDysregulationCount(gameState) {
        const dysregulated = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && 
                        !p.captured && 
                        p.emotionalState === 'dysregulated');
        
        const countEl = this.container.querySelector('.dysreg-value');
        countEl.textContent = dysregulated.length;
        
        // Add alert styling if high
        if (dysregulated.length >= 5) {
            countEl.classList.add('critical');
        } else if (dysregulated.length >= 3) {
            countEl.classList.add('warning');
        } else {
            countEl.classList.remove('critical', 'warning');
        }
    }

    updateWeather(weather) {
        const iconEl = this.container.querySelector('.weather-icon');
        const textEl = this.container.querySelector('.weather-text');
        const forecastEl = this.container.querySelector('.weather-forecast');
        
        // Weather icons and colors
        const weatherData = {
            'stable': {
                icon: '☀️',
                text: 'STABLE',
                color: 'var(--phosphor-green)',
                forecast: 'Clear emotional skies'
            },
            'tension': {
                icon: '⛅',
                text: 'TENSION',
                color: 'var(--phosphor-amber)',
                forecast: 'Pressure building...'
            },
            'storm': {
                icon: '⛈️',
                text: 'STORM',
                color: 'var(--phosphor-magenta)',
                forecast: 'Emotional storm active!'
            },
            'clearing': {
                icon: '🌤️',
                text: 'CLEARING',
                color: 'var(--phosphor-cyan)',
                forecast: 'Storm passing...'
            }
        };
        
        const data = weatherData[weather] || weatherData.stable;
        
        iconEl.textContent = data.icon;
        textEl.textContent = data.text;
        textEl.style.color = data.color;
        forecastEl.textContent = data.forecast;
        
        // Add weather effects
        this.applyWeatherEffects(weather);
    }

    applyWeatherEffects(weather) {
        // Remove old effects
        this.weatherEffects.forEach(effect => effect.remove());
        this.weatherEffects.clear();
        
        switch(weather) {
            case 'storm':
                this.createStormEffect();
                break;
            case 'tension':
                this.createTensionEffect();
                break;
            case 'clearing':
                this.createClearingEffect();
                break;
        }
    }

    createStormEffect() {
        const effect = document.createElement('div');
        effect.className = 'weather-effect storm-effect';
        
        // Lightning flashes
        for (let i = 0; i < 3; i++) {
            const lightning = document.createElement('div');
            lightning.className = 'lightning-flash';
            lightning.style.animationDelay = `${i * 2}s`;
            effect.appendChild(lightning);
        }
        
        document.querySelector('.game-container').appendChild(effect);
        this.weatherEffects.set('storm', effect);
    }

    createTensionEffect() {
        const effect = document.createElement('div');
        effect.className = 'weather-effect tension-effect';
        document.querySelector('.game-container').appendChild(effect);
        this.weatherEffects.set('tension', effect);
    }

    updateActiveConditions(gameState) {
        const conditionsEl = this.container.querySelector('.conditions-list');
        conditionsEl.innerHTML = '';
        
        // Storm status
        if (gameState.emotionalWeather === 'storm' && gameState.emotionalSystem.activeStorm) {
            const storm = gameState.emotionalSystem.activeStorm;
            const stormEl = this.createConditionElement({
                icon: '⛈️',
                text: storm.name,
                severity: 'critical',
                duration: `${storm.turnsRemaining} turns`
            });
            conditionsEl.appendChild(stormEl);
        }
        
        // Critical pieces
        const criticalPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && p.trust <= -3);
        
        if (criticalPieces.length > 0) {
            const criticalEl = this.createConditionElement({
                icon: '🚨',
                text: `${criticalPieces.length} at defection risk`,
                severity: 'critical'
            });
            conditionsEl.appendChild(criticalEl);
        }
        
        // Contagion risk
        const adjacentDysregulated = this.checkContagionRisk(gameState);
        if (adjacentDysregulated > 2) {
            const contagionEl = this.createConditionElement({
                icon: '🔄',
                text: 'High contagion risk',
                severity: 'warning'
            });
            conditionsEl.appendChild(contagionEl);
        }
        
        // Positive conditions
        const highTrustPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && p.trust >= 8);
        
        if (highTrustPieces.length >= 3) {
            const trustEl = this.createConditionElement({
                icon: '💚',
                text: 'Strong team bonds',
                severity: 'positive'
            });
            conditionsEl.appendChild(trustEl);
        }
        
        if (conditionsEl.children.length === 0) {
            conditionsEl.innerHTML = '<div class="no-conditions">No active conditions</div>';
        }
    }

    createConditionElement(condition) {
        const el = document.createElement('div');
        el.className = `condition-item ${condition.severity}`;
        
        el.innerHTML = `
            <span class="condition-icon">${condition.icon}</span>
            <span class="condition-text">${condition.text}</span>
            ${condition.duration ? `<span class="condition-duration">${condition.duration}</span>` : ''}
        `;
        
        return el;
    }

    updatePieceMonitor(gameState) {
        const monitorEl = this.container.querySelector('.monitor-grid');
        monitorEl.innerHTML = '';
        
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured)
            .sort((a, b) => {
                // Sort by emotional state priority
                const priority = {
                    'frozen': 0,
                    'shutdown': 1,
                    'fight': 2,
                    'anxious': 3,
                    'fawn': 4,
                    'regulated': 5
                };
                return (priority[a.emotionalState] || 5) - (priority[b.emotionalState] || 5);
            });
        
        playerPieces.forEach(piece => {
            const indicator = this.createPieceIndicator(piece);
            monitorEl.appendChild(indicator);
        });
    }

    createPieceIndicator(piece) {
        const indicator = document.createElement('div');
        indicator.className = 'piece-indicator';
        indicator.dataset.pieceId = piece.id;
        
        // Color based on emotional state
        const stateColors = {
            'regulated': 'var(--phosphor-green)',
            'anxious': 'var(--phosphor-amber)',
            'frozen': 'var(--phosphor-green)',
            'shutdown': 'var(--phosphor-cyan)',
            'fight': 'var(--phosphor-magenta)',
            'fawn': 'var(--phosphor-amber)'
        };
        
        const color = stateColors[piece.dysregulationType || piece.emotionalState] || 'var(--primary)';
        
        // Visual representation
        const trustBar = '█'.repeat(Math.max(0, Math.floor((piece.trust + 5) / 2)));
        const emptyBar = '░'.repeat(5 - trustBar.length);
        
        indicator.innerHTML = `
            <div class="indicator-name" style="color: ${color}">${piece.name.substring(0, 8)}</div>
            <div class="indicator-trust">${trustBar}${emptyBar}</div>
            <div class="indicator-state">${this.getStateSymbol(piece)}</div>
        `;
        
        // Add pulse animation for critical states
        if (piece.trust <= -3 || piece.emotionalState === 'frozen') {
            indicator.classList.add('critical-pulse');
        }
        
        return indicator;
    }

    getStateSymbol(piece) {
        if (piece.emotionalState === 'regulated') {
            return '✓';
        }
        
        const symbols = {
            'anxious': '!',
            'frozen': '◊',
            'shutdown': '―',
            'fight': '⚡',
            'fawn': '?'
        };
        
        return symbols[piece.dysregulationType] || '○';
    }

    showPieceTooltip(indicator) {
        const pieceId = indicator.dataset.pieceId;
        const gameState = window.chesstropia.game;
        if (!gameState) return;
        
        const piece = gameState.pieces.get(pieceId);
        if (!piece) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'piece-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">${piece.name}</div>
            <div class="tooltip-info">
                <div>State: ${piece.emotionalState}</div>
                <div>Trust: ${piece.trust}/10</div>
                ${piece.dysregulationType ? `<div>Issue: ${piece.dysregulationType}</div>` : ''}
                <div>Moved: ${piece.hasMoved ? 'Yes' : 'No'}</div>
            </div>
        `;
        
        // Position tooltip
        const rect = indicator.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    checkContagionRisk(gameState) {
        let adjacentCount = 0;
        const board = gameState.board;
        
        gameState.pieces.forEach(piece => {
            if (piece.emotionalState === 'dysregulated' && !piece.captured) {
                const adjacent = board.getAdjacentPieces(piece.position);
                adjacentCount += adjacent.filter(p => 
                    p.team === piece.team && 
                    p.emotionalState === 'regulated'
                ).length;
            }
        });
        
        return adjacentCount;
    }

    handleEmotionalEvent(event) {
        switch(event.type) {
            case 'storm_warning':
                this.showStormAlert(event);
                break;
            case 'breakthrough':
                this.showBreakthroughNotification(event);
                break;
            case 'defection_warning':
                this.showDefectionAlert(event);
                break;
            case 'objective_complete':
                this.showObjectiveComplete(event);
                break;
        }
    }

    showStormAlert(event) {
        const alert = this.createAlert({
            type: 'storm',
            message: `⛈️ ${event.storm.name} approaching!`,
            duration: 5000
        });
        this.showAlert(alert);
    }

    showBreakthroughNotification(event) {
        const alert = this.createAlert({
            type: 'breakthrough',
            message: `✨ ${event.piece.name} had a breakthrough!`,
            duration: 3000
        });
        this.showAlert(alert);
    }

    showDefectionAlert(event) {
        const alert = this.createAlert({
            type: 'critical',
            message: `🚨 ${event.piece.name} is about to defect!`,
            duration: 5000
        });
        this.showAlert(alert);
    }

    createAlert(options) {
        const alert = document.createElement('div');
        alert.className = `hud-alert ${options.type}`;
        alert.innerHTML = `
            <div class="alert-content">
                ${options.message}
            </div>
        `;
        
        return { element: alert, duration: options.duration };
    }

    showAlert(alert) {
        const alertId = Date.now();
        this.activeAlerts.add(alertId);
        
        document.body.appendChild(alert.element);
        
        // Position alerts
        const activeCount = this.activeAlerts.size;
        alert.element.style.top = `${20 + (activeCount - 1) * 60}px`;
        alert.element.style.right = '20px';
        
        // Auto-remove
        setTimeout(() => {
            alert.element.classList.add('fade-out');
            setTimeout(() => {
                alert.element.remove();
                this.activeAlerts.delete(alertId);
            }, 500);
        }, alert.duration);
    }

    updateAnimations() {
        // Update any ongoing animations
        const criticalEls = this.container.querySelectorAll('.critical');
        criticalEls.forEach(el => {
            if (!el.classList.contains('pulse')) {
                el.classList.add('pulse');
            }
        });
    }
}

// CSS for the HUD
const style = document.createElement('style');
style.textContent = `
    .emotional-hud {
        position: absolute;
        top: 80px;
        right: 20px;
        width: 300px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid var(--primary);
        padding: 1rem;
        font-size: 0.875rem;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
    }
    
    .hud-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--primary-dim);
    }
    
    .hud-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .hud-section h4 {
        color: var(--primary);
        margin: 0 0 0.5rem 0;
        font-size: 0.75rem;
        letter-spacing: 1px;
        text-shadow: 0 0 5px var(--primary);
    }
    
    .morale-display {
        margin: 0.5rem 0;
    }
    
    .morale-meter {
        position: relative;
        height: 20px;
        background: var(--primary-dim);
        border: 1px solid var(--primary);
        margin: 0.25rem 0;
    }
    
    .morale-fill {
        height: 100%;
        background: var(--primary);
        transition: width 0.3s, background-color 0.3s;
    }
    
    .morale-hearts {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        letter-spacing: 2px;
        text-shadow: 0 0 5px currentColor;
    }
    
    .trust-average, .dysregulation-count {
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0;
    }
    
    .label {
        opacity: 0.7;
    }
    
    .critical {
        animation: critical-pulse 1s ease-in-out infinite;
    }
    
    @keyframes critical-pulse {
        0%, 100% { 
            color: var(--phosphor-magenta);
            text-shadow: 0 0 5px var(--phosphor-magenta);
        }
        50% { 
            color: var(--phosphor-amber);
            text-shadow: 0 0 10px var(--phosphor-amber);
        }
    }
    
    .weather-display {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 0.5rem 0;
    }
    
    .weather-icon {
        font-size: 2rem;
    }
    
    .weather-text {
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .weather-forecast {
        font-size: 0.75rem;
        opacity: 0.7;
        margin-top: 0.25rem;
    }
    
    .conditions-list {
        max-height: 150px;
        overflow-y: auto;
    }
    
    .condition-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.25rem 0;
        padding: 0.25rem;
        border-left: 2px solid var(--primary-dim);
    }
    
    .condition-item.critical {
        border-left-color: var(--phosphor-magenta);
        color: var(--phosphor-magenta);
    }
    
    .condition-item.warning {
        border-left-color: var(--phosphor-amber);
        color: var(--phosphor-amber);
    }
    
    .condition-item.positive {
        border-left-color: var(--phosphor-green);
        color: var(--phosphor-green);
    }
    
    .monitor-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .piece-indicator {
        background: var(--primary-dim);
        border: 1px solid var(--primary);
        padding: 0.25rem;
        font-size: 0.625rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .piece-indicator:hover {
        box-shadow: 0 0 10px var(--primary);
    }
    
    .piece-indicator.critical-pulse {
        animation: critical-pulse 1s ease-in-out infinite;
    }
    
    .indicator-name {
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .indicator-trust {
        font-family: monospace;
        letter-spacing: -2px;
        font-size: 0.5rem;
    }
    
    .indicator-state {
        text-align: center;
        font-weight: bold;
    }
    
    .piece-tooltip {
        position: absolute;
        background: var(--crt-black);
        border: 1px solid var(--primary);
        padding: 0.5rem;
        font-size: 0.75rem;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    }
    
    .tooltip-header {
        font-weight: bold;
        margin-bottom: 0.25rem;
        color: var(--primary);
    }
    
    .hud-alert {
        position: fixed;
        background: var(--crt-black);
        border: 2px solid var(--primary);
        padding: 1rem;
        min-width: 250px;
        animation: alert-slide-in 0.3s ease-out;
        z-index: 1000;
    }
    
    .hud-alert.storm {
        border-color: var(--phosphor-magenta);
        color: var(--phosphor-magenta);
        box-shadow: 0 0 30px var(--phosphor-magenta);
    }
    
    .hud-alert.breakthrough {
        border-color: var(--phosphor-green);
        color: var(--phosphor-green);
        box-shadow: 0 0 30px var(--phosphor-green);
    }
    
    .hud-alert.critical {
        border-color: var(--phosphor-amber);
        color: var(--phosphor-amber);
        box-shadow: 0 0 30px var(--phosphor-amber);
        animation: alert-slide-in 0.3s ease-out, critical-pulse 1s ease-in-out infinite;
    }
    
    @keyframes alert-slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .fade-out {
        animation: fade-out 0.5s ease-out forwards;
    }
    
    @keyframes fade-out {
        to {
            opacity: 0;
            transform: translateX(50%);
        }
    }
    
    .weather-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
    }
    
    .storm-effect {
        background: radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(255, 0, 255, 0.1) 50%,
            rgba(255, 0, 255, 0.2) 100%
        );
    }
    
    .lightning-flash {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(255, 0, 255, 0.3);
        opacity: 0;
        animation: lightning 6s infinite;
    }
    
    @keyframes lightning {
        0%, 90%, 92%, 98%, 100% { opacity: 0; }
        91%, 97% { opacity: 1; }
    }
    
    .tension-effect {
        box-shadow: 
            inset 0 0 50px rgba(255, 204, 0, 0.1),
            inset 0 0 100px rgba(255, 204, 0, 0.05);
    }
`;
document.head.appendChild(style);