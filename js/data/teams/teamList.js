// Master registry of all teams in Chesstropia
export const teamRegistry = {
    // Starting teams (available from beginning)
    starter: [
        {
            id: 'donuts',
            name: 'The Lonely Pastries',
            theme: 'abandonment',
            difficulty: 'Gentle',
            colorAffinity: 'amber',
            description: 'Orphaned donuts seeking belonging',
            unlocked: true,
            icon: '🍩',
            recommendedFor: 'First-time players'
        },
        {
            id: 'renaissance_pets',
            name: 'The Perfect Portraits',
            theme: 'perfectionism',
            difficulty: 'Moderate',
            colorAffinity: 'cyan',
            description: 'Oil-painted pets hiding behind facades',
            unlocked: true,
            icon: '🖼️',
            recommendedFor: 'Players who understand masks'
        },
        {
            id: 'baseballerinas',
            name: 'The Baseballerinas',
            theme: 'identity_conflict',
            difficulty: 'Challenging',
            colorAffinity: 'magenta',
            description: 'Athletes torn between two worlds',
            unlocked: true,
            icon: '⚾',
            recommendedFor: 'Those who feel split'
        }
    ],
    
    // Unlockable teams
    unlockable: [
        {
            id: 'victorian_ghosts',
            name: 'The Victorian Ghosts',
            theme: 'repression_beyond_death',
            difficulty: 'Challenging',
            colorAffinity: 'green',
            description: 'Spirits still bound by propriety',
            unlocked: false,
            unlockCondition: 'Complete any campaign',
            icon: '👻',
            recommendedFor: 'Exploring generational trauma'
        },
        {
            id: 'broken_toys',
            name: 'The Broken Toys',
            theme: 'discarded',
            difficulty: 'Moderate',
            colorAffinity: 'amber',
            description: 'Toys thrown away for being "wrong"',
            unlocked: false,
            unlockCondition: 'Help 5 pieces trust again',
            icon: '🧸',
            recommendedFor: 'Inner child work'
        },
        {
            id: 'midnight_diner',
            name: 'The Midnight Diner Staff',
            theme: 'night_shift_loneliness',
            difficulty: 'Moderate',
            colorAffinity: 'cyan',
            description: '3 AM servers of comfort and coffee',
            unlocked: false,
            unlockCondition: 'Weather 3 emotional storms',
            icon: '☕',
            recommendedFor: 'Insomniacs and wanderers'
        },
        {
            id: 'arcade_tokens',
            name: 'The Arcade Tokens',
            theme: 'used_up',
            difficulty: 'Challenging',
            colorAffinity: 'magenta',
            description: 'Spent tokens from forgotten arcades',
            unlocked: false,
            unlockCondition: 'Achieve 10 breakthroughs',
            icon: '🕹️',
            recommendedFor: 'Nostalgia and loss'
        },
        {
            id: 'library_late_fees',
            name: 'The Library Late Fees',
            theme: 'perpetual_debt',
            difficulty: 'Complex',
            colorAffinity: 'green',
            description: 'Overdue notices with compound shame',
            unlocked: false,
            unlockCondition: 'Complete Donuts campaign',
            icon: '📚',
            recommendedFor: 'Guilt and redemption'
        },
        {
            id: 'houseplants',
            name: 'The Neglected Houseplants',
            theme: 'slow_death',
            difficulty: 'Gentle',
            colorAffinity: 'green',
            description: 'Wilting despite trying their best',
            unlocked: false,
            unlockCondition: 'Prevent 3 defections',
            icon: '🪴',
            recommendedFor: 'Patient gardeners of souls'
        },
        {
            id: 'lost_socks',
            name: 'The Lost Socks',
            theme: 'separation_anxiety',
            difficulty: 'Moderate',
            colorAffinity: 'amber',
            description: 'Singles searching for their pairs',
            unlocked: false,
            unlockCondition: 'Reunite separated pieces',
            icon: '🧦',
            recommendedFor: 'Understanding loneliness'
        },
        {
            id: 'expired_coupons',
            name: 'The Expired Coupons',
            theme: 'missed_opportunities',
            difficulty: 'Complex',
            colorAffinity: 'amber',
            description: 'Savings that came too late',
            unlocked: false,
            unlockCondition: 'Complete Renaissance Pets campaign',
            icon: '🎟️',
            recommendedFor: 'Regret and acceptance'
        },
        {
            id: 'substitute_teachers',
            name: 'The Substitute Teachers',
            theme: 'temporary_existence',
            difficulty: 'Challenging',
            colorAffinity: 'cyan',
            description: 'Never staying long enough to matter',
            unlocked: false,
            unlockCondition: 'Build trust with 20 pieces',
            icon: '📝',
            recommendedFor: 'Impermanence anxiety'
        },
        {
            id: 'mall_mannequins',
            name: 'The Mall Mannequins',
            theme: 'objectification',
            difficulty: 'Complex',
            colorAffinity: 'magenta',
            description: 'Posed for others, never for themselves',
            unlocked: false,
            unlockCondition: 'Complete Baseballerinas campaign',
            icon: '🏬',
            recommendedFor: 'Body autonomy issues'
        },
        {
            id: 'retirement_home',
            name: 'The Retirement Home',
            theme: 'forgotten_wisdom',
            difficulty: 'Gentle',
            colorAffinity: 'green',
            description: 'Elders with stories no one hears',
            unlocked: false,
            unlockCondition: 'Listen to 50 piece memories',
            icon: '🏡',
            recommendedFor: 'Honoring experience'
        },
        {
            id: 'error_messages',
            name: 'The Error Messages',
            theme: 'systemic_failure',
            difficulty: 'Intense',
            colorAffinity: 'magenta',
            description: '404: Self-worth not found',
            unlocked: false,
            unlockCondition: 'Complete Victorian Ghosts campaign',
            icon: '⚠️',
            recommendedFor: 'Digital age anxiety'
        }
    ],
    
    // Secret teams
    secret: [
        {
            id: 'dev_team',
            name: 'The Dev Team',
            theme: 'burnout',
            difficulty: 'Impossible',
            colorAffinity: 'all',
            description: 'The ones who coded their feelings into this',
            unlocked: false,
            unlockCondition: 'Complete all campaigns with full trust',
            icon: '💻',
            recommendedFor: 'Understanding the creators'
        }
    ]
};

// Team relationship map (which teams understand each other)
export const teamRelationships = {
    sympatheticPairs: [
        ['donuts', 'broken_toys'], // Both abandoned
        ['renaissance_pets', 'mall_mannequins'], // Performance pressure
        ['baseballerinas', 'substitute_teachers'], // Identity splitting
        ['victorian_ghosts', 'retirement_home'], // Forgotten voices
        ['midnight_diner', 'error_messages'], // 3 AM crises
        ['lost_socks', 'library_late_fees'], // Separation and debt
    ],
    
    conflictingPairs: [
        ['donuts', 'expired_coupons'], // Fresh vs expired
        ['renaissance_pets', 'houseplants'], // High vs low maintenance
        ['arcade_tokens', 'retirement_home'], // Youth vs age
        ['victorian_ghosts', 'error_messages'] // Past vs future
    ]
};

// Team unlock tracker
export class TeamUnlockTracker {
    constructor() {
        this.loadUnlocks();
    }
    
    loadUnlocks() {
        const saved = localStorage.getItem('chesstropia_team_unlocks');
        this.unlocks = saved ? JSON.parse(saved) : {
            donuts: true,
            renaissance_pets: true,
            baseballerinas: true
        };
    }
    
    checkUnlockConditions(progress) {
        teamRegistry.unlockable.forEach(team => {
            if (this.unlocks[team.id]) return;
            
            let unlocked = false;
            
            switch(team.unlockCondition) {
                case 'Complete any campaign':
                    unlocked = progress.completedCampaigns.length > 0;
                    break;
                    
                case 'Help 5 pieces trust again':
                    unlocked = progress.trustedPieces.length >= 5;
                    break;
                    
                case 'Weather 3 emotional storms':
                    unlocked = progress.stormsWeathered >= 3;
                    break;
                    
                case 'Achieve 10 breakthroughs':
                    unlocked = progress.totalBreakthroughs >= 10;
                    break;
                    
                case 'Complete Donuts campaign':
                    unlocked = progress.completedCampaigns.includes('donuts');
                    break;
                    
                case 'Prevent 3 defections':
                    unlocked = progress.defectionsPrevented >= 3;
                    break;
                    
                case 'Reunite separated pieces':
                    unlocked = progress.specialAchievements.includes('reunion');
                    break;
                    
                case 'Complete Renaissance Pets campaign':
                    unlocked = progress.completedCampaigns.includes('renaissance_pets');
                    break;
                    
                case 'Build trust with 20 pieces':
                    unlocked = progress.totalTrustedPieces >= 20;
                    break;
                    
                case 'Complete Baseballerinas campaign':
                    unlocked = progress.completedCampaigns.includes('baseballerinas');
                    break;
                    
                case 'Listen to 50 piece memories':
                    unlocked = progress.memoriesWitnessed >= 50;
                    break;
                    
                case 'Complete Victorian Ghosts campaign':
                    unlocked = progress.completedCampaigns.includes('victorian_ghosts');
                    break;
                    
                case 'Complete all campaigns with full trust':
                    unlocked = progress.perfectCampaigns >= 
                              teamRegistry.starter.length + 
                              teamRegistry.unlockable.length;
                    break;
            }
            
            if (unlocked) {
                this.unlockTeam(team.id);
            }
        });
    }
    
    unlockTeam(teamId) {
        this.unlocks[teamId] = true;
        this.saveUnlocks();
        
        // Trigger unlock notification
        window.dispatchEvent(new CustomEvent('chesstropia:team_unlocked', {
            detail: { teamId }
        }));
    }
    
    saveUnlocks() {
        localStorage.setItem('chesstropia_team_unlocks', JSON.stringify(this.unlocks));
    }
    
    isUnlocked(teamId) {
        return this.unlocks[teamId] || false;
    }
    
    getAvailableTeams() {
        return [
            ...teamRegistry.starter,
            ...teamRegistry.unlockable.filter(t => this.unlocks[t.id]),
            ...teamRegistry.secret.filter(t => this.unlocks[t.id])
        ];
    }
    
    getLockedTeams() {
        return [
            ...teamRegistry.unlockable.filter(t => !this.unlocks[t.id]),
            ...teamRegistry.secret.filter(t => !this.unlocks[t.id])
        ];
    }
}

// Team selection helper
export function getTeamData(teamId) {
    const allTeams = [
        ...teamRegistry.starter,
        ...teamRegistry.unlockable,
        ...teamRegistry.secret
    ];
    
    return allTeams.find(t => t.id === teamId);
}

// Export singleton tracker
export const teamUnlockTracker = new TeamUnlockTracker();