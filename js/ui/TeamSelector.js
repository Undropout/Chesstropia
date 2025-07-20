/**
 * @file TeamSelector.js
 * Renders the team selection screen, allowing the player to choose their faction
 * before starting a new game.
 */
import { TEAMS } from '../data/teams/teamList.js';

class TeamSelector {
    /**
     * Initializes the TeamSelector.
     * @param {EventEmitter} eventEmitter - The central event bus.
     */
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.selectedTeamId = null;
        this.container = null;
    }

    /**
     * Renders the team selection UI into the given container.
     * @param {HTMLElement} container - The DOM element to render into.
     */
    render(container) {
        this.container = container;
        this.container.innerHTML = `
            <div class="team-selector-container">
                <header class="team-selector-header">
                    <h1>Select Your Team</h1>
                    <p>Choose the emotional baggage you wish to carry into battle.</p>
                </header>
                <main class="team-selector-main">
                    <div id="team-list" class="team-list"></div>
                    <div id="team-details" class="team-details">
                        <p class="placeholder">Select a team to view details...</p>
                    </div>
                </main>
                <footer class="team-selector-footer">
                    <button id="start-game-btn" class="menu-button" disabled>Begin Coaching</button>
                </footer>
            </div>
        `;

        this.populateTeamList();
        this.addEventListeners();
    }

    /**
     * Populates the list of teams from the TEAMS data.
     */
    populateTeamList() {
        const listElement = this.container.querySelector('#team-list');
        let teamButtonsHTML = '';
        for (const teamId in TEAMS) {
            const team = TEAMS[teamId];
            teamButtonsHTML += `<button class="team-button" data-team-id="${team.id}">${team.name}</button>`;
        }
        listElement.innerHTML = teamButtonsHTML;
    }

    /**
     * Adds event listeners for team selection and starting the game.
     */
    addEventListeners() {
        const teamButtons = this.container.querySelectorAll('.team-button');
        teamButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleTeamSelect(e.target.dataset.teamId);
                // Update active state
                teamButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        const startGameBtn = this.container.querySelector('#start-game-btn');
        startGameBtn.addEventListener('click', () => {
            this.handleGameStart();
        });
    }

    /**
     * Handles the selection of a team, updating the details panel.
     * @param {string} teamId - The ID of the selected team.
     */
    handleTeamSelect(teamId) {
        this.selectedTeamId = teamId;
        const team = TEAMS[teamId];
        const detailsElement = this.container.querySelector('#team-details');

        detailsElement.innerHTML = `
            <h2>${team.name}</h2>
            <p class="team-description"><em>"${team.description}"</em></p>
            <h3 class="team-motivation">Motivation: ${team.motivation}</h3>
            <h4>Roster:</h4>
            <ul class="roster-list">
                ${team.members.slice(0, 8).map(member => `<li><strong>${member.role}:</strong> ${member.name}</li>`).join('')}
                 <li>...and 8 pawns.</li>
            </ul>
        `;

        this.container.querySelector('#start-game-btn').removeAttribute('disabled');
    }

    /**
     * Handles the final confirmation to start the game.
     */
    handleGameStart() {
        if (!this.selectedTeamId) return;

        // For now, let's pick a random opponent that isn't the player's team.
        const teamIds = Object.keys(TEAMS);
        let opponentId = this.selectedTeamId;
        while (opponentId === this.selectedTeamId) {
            opponentId = teamIds[Math.floor(Math.random() * teamIds.length)];
        }

        console.log(`Starting game with player as ${this.selectedTeamId} and opponent as ${opponentId}`);
        this.eventEmitter.emit('newGame', {
            playerTeamId: this.selectedTeamId,
            opponentTeamId: opponentId,
            aiType: 'TheStrategist' // Default AI
        });
    }
}

export default TeamSelector;
