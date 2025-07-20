/**
 * @file CampaignManager.js
 * Manages the flow of story campaigns, including mission progression and dialogue.
 */
import { tutorial_mission_1 } from '../data/dialogue/tutorials.js';

class CampaignManager {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.currentMission = null;
        // In a real game, this would be loaded from SaveManager
        this.campaignProgress = {
            completedMissions: [],
        };

        this.campaigns = {
            'tutorial': [
                tutorial_mission_1
            ]
        };
    }

    startCampaign(campaignId = 'tutorial') {
        const campaign = this.campaigns[campaignId];
        if (!campaign) {
            console.error(`Campaign with id ${campaignId} not found.`);
            return;
        }

        const nextMission = campaign.find(mission => !this.campaignProgress.completedMissions.includes(mission.id));

        if (nextMission) {
            this.startMission(nextMission);
        } else {
            console.log("Campaign complete!");
            this.eventEmitter.emit('campaignComplete', { campaignId });
            this.eventEmitter.emit('showDialogue', {
                dialogue: [{ character: 'Coach', text: 'You have completed the tutorial campaign!' }],
                onComplete: () => this.eventEmitter.emit('showMainMenu')
            });
        }
    }

    startMission(missionData) {
        this.currentMission = missionData;
        console.log(`Starting mission: ${missionData.title}`);

        this.eventEmitter.emit('showDialogue', {
            dialogue: this.currentMission.openingDialogue,
            onComplete: () => {
                this.eventEmitter.emit('startCampaignGame', this.currentMission.gameConfig);
            }
        });
    }

    handleMissionComplete() {
        if (!this.currentMission) return;

        console.log(`Mission ${this.currentMission.title} complete!`);
        this.campaignProgress.completedMissions.push(this.currentMission.id);
        
        this.eventEmitter.emit('showDialogue', {
            dialogue: this.currentMission.closingDialogue,
            onComplete: () => {
                // This will take the player back to the main menu for now.
                // A more complex system could go to a campaign map.
                this.eventEmitter.emit('showMainMenu');
            }
        });
    }
}

export default CampaignManager;
