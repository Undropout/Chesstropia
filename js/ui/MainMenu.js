import { EventEmitter } from '../utils/EventEmitter.js';

export class MainMenu extends EventEmitter {
    constructor(container, options) {
        document.getElementById('start-game').addEventListener('click', (e) => {
    e.preventDefault();
    // Emit an event to show the team selector screen
    this.eventEmitter.emit('selectTeam'); 
});
        super();
        this.container = container;
        this.options = options;
        this.render();
    }
    
    render() {
        const progress = this.options.profile?.statistics || {};
        const hasActiveSave = localStorage.getItem('chesstropia_save_auto') !== null;
        
        this.container.innerHTML = `
            <div class="main-menu">
                <header class="menu-header">
                    <h1 class="game-title">ChessTropia</h1>
                    <p class="game-tagline">Where Every Piece Has Feelings</p>
                </header>
                
                <nav class="menu-options">
                    ${hasActiveSave ? `
                        <button class="menu-button continue-button" id="continue-btn">
                            <span class="button-main">Continue Journey</span>
                            <span class="button-sub">Resume your emotional adventure</span>
                        </button>
                    ` : ''}
                    
                    <button class="menu-button play-button" id="play-btn">
                        <span class="button-main">New Game</span>
                        <span class="button-sub">Begin a new emotional journey</span>
                    </button>
                    
                    <button class="menu-button" id="achievements-btn">
                        <span class="button-main">Your Progress</span>
                        <span class="button-sub">${progress.totalMatches || 0} journeys completed</span>
                    </button>
                    
                    <button class="menu-button" id="options-btn">
                        <span class="button-main">Options</span>
                        <span class="button-sub">Customize your experience</span>
                    </button>
                    
                    <button class="menu-button" id="about-btn">
                        <span class="button-main">About</span>
                        <span class="button-sub">Learn about ChessTropia</span>
                    </button>
                </nav>
                
                <footer class="menu-footer">
                    <p class="version">Version 1.0.0</p>
                    <p class="quote">"In understanding others, we understand ourselves"</p>
                </footer>
            </div>
        `;
        
        this.attachEventListeners();
        this.addStyles();
    }
    
    attachEventListeners() {
        const continueBtn = this.container.querySelector('#continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.options.onContinue());
        }
        
        this.container.querySelector('#play-btn')
            .addEventListener('click', () => this.options.onPlay());
            
        this.container.querySelector('#achievements-btn')
            .addEventListener('click', () => this.options.onAchievements());
            
        this.container.querySelector('#options-btn')
            .addEventListener('click', () => this.options.onOptions());
            
        this.container.querySelector('#about-btn')
            .addEventListener('click', () => this.options.onAbout());
    }
    
    addStyles() {
        if (document.getElementById('main-menu-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'main-menu-styles';
        styles.textContent = `
            .main-menu {
                max-width: 600px;
                width: 100%;
                padding: 2rem;
            }
            
            .menu-header {
                text-align: center;
                margin-bottom: 3rem;
            }
            
            .game-title {
                font-size: 4rem;
                font-weight: 300;
                margin: 0;
                background: linear-gradient(45deg, #F59E0B, #EC4899, #8B5CF6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: title-shimmer 3s ease-in-out infinite;
            }
            
            @keyframes title-shimmer {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            .game-tagline {
                color: var(--text-secondary, #94A3B8);
                font-size: 1.25rem;
                margin-top: 0.5rem;
            }
            
            .menu-options {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .menu-button {
                background: var(--bg-secondary, #1E293B);
                border: 1px solid var(--border-color, #334155);
                border-radius: 0.75rem;
                padding: 1.5rem;
                text-align: left;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .menu-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: left 0.5s ease;
            }
            
            .menu-button:hover {
                transform: translateX(10px);
                border-color: var(--accent-primary, #F59E0B);
            }
            
            .menu-button:hover::before {
                left: 100%;
            }
            
            .continue-button {
                background: linear-gradient(135deg, #F59E0B, #EC4899);
                border: none;
                color: white;
            }
            
            .button-main {
                display: block;
                font-size: 1.25rem;
                font-weight: 500;
                color: var(--text-primary, #F1F5F9);
            }
            
            .continue-button .button-main {
                color: white;
            }
            
            .button-sub {
                display: block;
                font-size: 0.875rem;
                color: var(--text-secondary, #94A3B8);
                margin-top: 0.25rem;
            }
            
            .continue-button .button-sub {
                color: rgba(255, 255, 255, 0.9);
            }
            
            .menu-footer {
                text-align: center;
                margin-top: 3rem;
                color: var(--text-secondary, #64748B);
            }
            
            .version {
                font-size: 0.875rem;
                margin: 0;
            }
            
            .quote {
                font-style: italic;
                margin-top: 1rem;
            }
            
            @media (max-width: 768px) {
                .game-title {
                    font-size: 3rem;
                }
                
                .menu-button:hover {
                    transform: none;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    destroy() {
        // Cleanup if needed
    }
}