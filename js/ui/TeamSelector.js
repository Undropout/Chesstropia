export class TeamSelector {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.selectedTeam = null;
        this.selectedDifficulty = 'normal';
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="team-selector">
                <header class="selector-header">
                    <button class="back-button" id="back-btn">← Back</button>
                    <h2>Choose Your Team</h2>
                    <p>Each team has unique emotional journeys</p>
                </header>
                
                <div class="teams-grid" id="teams-grid">
                    ${this.options.unlockedTeams.map(team => `
                        <div class="team-card" data-team-id="${team.id}">
                            <div class="team-icon">${team.icon}</div>
                            <h3 class="team-name">${team.name}</h3>
                            <p class="team-theme">${team.description}</p>
                            <div class="team-difficulty">Difficulty: ${team.difficulty}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="difficulty-selector" id="difficulty-selector" style="display: none;">
                    <h3>Select Difficulty</h3>
                    <div class="difficulty-options">
                        <label class="difficulty-option">
                            <input type="radio" name="difficulty" value="easy" />
                            <span class="difficulty-label">
                                <strong>Gentle</strong>
                                <small>More forgiving, AI shows empathy</small>
                            </span>
                        </label>
                        <label class="difficulty-option">
                            <input type="radio" name="difficulty" value="normal" checked />
                            <span class="difficulty-label">
                                <strong>Balanced</strong>
                                <small>Standard emotional journey</small>
                            </span>
                        </label>
                        <label class="difficulty-option">
                            <input type="radio" name="difficulty" value="hard" />
                            <span class="difficulty-label">
                                <strong>Challenging</strong>
                                <small>AI exploits emotional vulnerabilities</small>
                            </span>
                        </label>
                        <label class="difficulty-option">
                            <input type="radio" name="difficulty" value="adaptive" />
                            <span class="difficulty-label">
                                <strong>Adaptive</strong>
                                <small>AI learns your empathy patterns</small>
                            </span>
                        </label>
                    </div>
                    
                    <button class="start-button" id="start-btn" disabled>
                        Begin Journey
                    </button>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
        this.addStyles();
    }
    
    attachEventListeners() {
        this.container.querySelector('#back-btn')
            .addEventListener('click', () => this.options.onBack());
        
        this.container.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => this.selectTeam(card.dataset.teamId));
        });
        
        this.container.querySelectorAll('input[name="difficulty"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.selectedDifficulty = e.target.value;
                this.updateStartButton();
            });
        });
        
        this.container.querySelector('#start-btn')
            .addEventListener('click', () => this.startGame());
    }
    
    selectTeam(teamId) {
        // Update visual selection
        this.container.querySelectorAll('.team-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.container.querySelector(`[data-team-id="${teamId}"]`).classList.add('selected');
        
        this.selectedTeam = teamId;
        
        // Show difficulty selector
        this.container.querySelector('#difficulty-selector').style.display = 'block';
        this.updateStartButton();
        
        // Scroll to difficulty selector
        this.container.querySelector('#difficulty-selector').scrollIntoView({ behavior: 'smooth' });
    }
    
    updateStartButton() {
        const startBtn = this.container.querySelector('#start-btn');
        startBtn.disabled = !this.selectedTeam;
        
        if (this.selectedTeam) {
            const team = this.options.unlockedTeams.find(t => t.id === this.selectedTeam);
            startBtn.textContent = `Begin ${team.name} Journey`;
        }
    }
    
    startGame() {
        if (this.selectedTeam) {
            this.options.onSelect(this.selectedTeam, this.selectedDifficulty);
        }
    }
    
    addStyles() {
        if (document.getElementById('team-selector-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'team-selector-styles';
        styles.textContent = `
            .team-selector {
                max-width: 1200px;
                width: 100%;
                padding: 2rem;
            }
            
            .selector-header {
                text-align: center;
                margin-bottom: 2rem;
                position: relative;
            }
            
            .back-button {
                position: absolute;
                left: 0;
                top: 0;
                background: none;
                border: none;
                color: var(--text-primary);
                font-size: 1rem;
                cursor: pointer;
                padding: 0.5rem;
            }
            
            .teams-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .team-card {
                background: var(--bg-secondary, #1E293B);
                border: 2px solid var(--border-color, #334155);
                border-radius: 1rem;
                padding: 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .team-card:hover {
                transform: translateY(-5px);
                border-color: var(--accent-primary, #F59E0B);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .team-card.selected {
                border-color: var(--accent-primary, #F59E0B);
                background: var(--bg-secondary-light, #334155);
                transform: scale(1.05);
            }
            
            .team-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .team-name {
                font-size: 1.25rem;
                margin: 0.5rem 0;
            }
            
            .team-theme {
                color: var(--text-secondary, #94A3B8);
                font-size: 0.875rem;
                margin: 0.5rem 0;
            }
            
            .team-difficulty {
                font-size: 0.75rem;
                color: var(--text-tertiary, #64748B);
                margin-top: 1rem;
            }
            
            .difficulty-selector {
                background: var(--bg-secondary, #1E293B);
                border-radius: 1rem;
                padding: 2rem;
            }
            
            .difficulty-options {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin: 1.5rem 0;
            }
            
            .difficulty-option {
                display: flex;
                align-items: center;
                padding: 1rem;
                border: 1px solid var(--border-color, #334155);
                border-radius: 0.5rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .difficulty-option:hover {
                border-color: var(--accent-primary, #F59E0B);
            }
            
            .difficulty-option input {
                margin-right: 1rem;
            }
            
            .difficulty-label strong {
                display: block;
                margin-bottom: 0.25rem;
            }
            
            .difficulty-label small {
                color: var(--text-secondary, #94A3B8);
            }
            
            .start-button {
                width: 100%;
                padding: 1rem 2rem;
                background: linear-gradient(135deg, #F59E0B, #EC4899);
                color: white;
                border: none;
                border-radius: 0.5rem;
                font-size: 1.25rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .start-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .start-button:not(:disabled):hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
            }
        `;
        
        document.head.appendChild(styles);
    }
}