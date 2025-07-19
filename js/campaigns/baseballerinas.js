// The Conflicted Athletes - Baseball players who are also ballerinas
export default {
    id: 'baseballerinas',
    name: 'The Baseballerinas',
    theme: 'identity_conflict',
    description: 'Part athlete, part artist, fully confused. Cleats and tutus, strikes and pirouettes.',
    colorAffinity: 'magenta', // Their inner conflict burns magenta
    
    teamTraits: {
        dualIdentity: true,
        codeSwithching: true,
        belongingNowhere: true,
        internalCivilWar: true
    },
    
    pieces: [
        {
            id: 'pitcher_prima',
            name: 'Pitcher Prima',
            position: { row: 0, col: 1 },
            personality: {
                coreWound: 'Never athletic enough for sports, never graceful enough for dance',
                triggers: ['pick a side', 'jack of all trades', 'commit to one'],
                comfortResponses: ['both are you', 'multitudes are strength', 'no choosing needed'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'freeze': 0.3,
                    'fight': 0.2,
                    'fawn': 0.1
                },
                resilience: 3,
                trustGainRate: 1.0,
                trustLossRate: 1.5,
                backstory: "Prima's fastball is poetry, her grand jeté is athletic. But the baseball team mocks her pliés between pitches. The ballet company scorns her muscled shoulders. She exists in the hyphen between worlds, citizen of neither.",
                memories: {
                    positive: ['Strike three in arabesque', 'Coach who understood both sides'],
                    negative: ['Choose: cleats or pointe shoes', 'Laughed at in both uniforms']
                },
                dialogueStyle: 'determined_divided',
                specialTraits: ['code_switcher', 'hyphen_existence'],
                currentMode: 'balanced', // baseball/ballet/balanced
                identityStress: 5
            }
        },
        
        {
            id: 'shortstop_swan',
            name: 'Shortstop Swan',
            position: { row: 0, col: 3 },
            personality: {
                coreWound: 'Grace seen as weakness, strength seen as ungraceful',
                triggers: ['too soft', 'too rough', 'be more feminine/masculine'],
                comfortResponses: ['strength is grace', 'power is beauty', 'define yourself'],
                dysregulationTendencies: {
                    'fight': 0.4,
                    'anxiety': 0.3,
                    'shutdown': 0.2,
                    'freeze': 0.1
                },
                resilience: 4,
                trustGainRate: 0.8,
                trustLossRate: 1.7,
                backstory: "Swan's double plays flow like choreography, but teammates say she's 'too pretty' about it. At recitals, she's criticized for 'aggressive' leaps. Graceful strength is apparently impossible. She must fracture to fit.",
                memories: {
                    positive: ['Home run en pointe', 'Standing ovation for a diving catch'],
                    negative: ['Pretty throw cost the game', 'Too athletic for Sugar Plum Fairy']
                },
                dialogueStyle: 'fierce_fluid',
                specialTraits: ['gender_performance_stress', 'strength_grace_paradox'],
                currentMode: 'baseball',
                identityStress: 7
            }
        },
        
        {
            id: 'catcher_chorus',
            name: 'Catcher Chorus',
            position: { row: 0, col: 5 },
            personality: {
                coreWound: 'Always in supporting roles, never the star in either world',
                triggers: ['background player', 'supporting cast', 'not lead material'],
                comfortResponses: ['foundation is vital', 'support is strength', 'your role matters'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'freeze': 0.3,
                    'anxiety': 0.2,
                    'fawn': 0.1
                },
                resilience: 5, // Strong but unseen
                trustGainRate: 0.9,
                trustLossRate: 1.2,
                backstory: "Chorus catches every pitch, supports every dancer, but goes unnoticed. In baseball, pitchers get glory. In ballet, soloists shine. She's the eternal ensemble, wondering if supporting everyone means never being supported.",
                memories: {
                    positive: ['Recognized for a perfect catch', 'Corps work praised specifically'],
                    negative: ['Name not on any poster', 'Always behind the plate or in the back']
                },
                dialogueStyle: 'supportive_yearning',
                specialTraits: ['invisible_labor', 'recognition_hunger'],
                currentMode: 'ballet',
                identityStress: 4
            }
        },
        
        {
            id: 'first_base_fouette',
            name: 'First Base Fouetté',
            position: { row: 0, col: 7 },
            personality: {
                coreWound: 'Spinning between identities until dizzy and lost',
                triggers: ['make up your mind', 'stop spinning', 'focus'],
                comfortResponses: ['spinning is searching', 'motion is progress', 'dizzy is okay'],
                dysregulationTendencies: {
                    'anxiety': 0.5,
                    'freeze': 0.2,
                    'flight': 0.2,
                    'fawn': 0.1
                },
                resilience: 2,
                trustGainRate: 1.2,
                trustLossRate: 1.8,
                backstory: "Fouetté spins from identity to identity - 32 rotations between baseball and ballet. Morning at first base, evening en pointe, dizzy from switching. She doesn't know how to stop spinning, or who she'll be when she does.",
                memories: {
                    positive: ['Both uniforms in one day felt right', 'Spin helped tag a runner'],
                    negative: ['Fell from dizziness mid-game', 'Lost myself in the rotations']
                },
                dialogueStyle: 'dizzy_seeking',
                specialTraits: ['identity_vertigo', 'perpetual_motion'],
                currentMode: 'balanced',
                identityStress: 8
            }
        },
        
        {
            id: 'centerfield_centerstage',
            name: 'Centerfield Centerstage',
            position: { row: 1, col: 0 },
            personality: {
                coreWound: 'Needs spotlight but different stages demand different selves',
                triggers: ['attention seeker', 'showoff', 'pick a stage'],
                comfortResponses: ['visibility is valid', 'shine everywhere', 'stages are yours'],
                dysregulationTendencies: {
                    'anxiety': 0.3,
                    'fight': 0.3,
                    'freeze': 0.2,
                    'fawn': 0.2
                },
                resilience: 3,
                trustGainRate: 1.1,
                trustLossRate: 2.0, // Rejection hits hard
                backstory: "Centerstage craves the spotlight - diving catches get cheers, perfect pirouettes get roses. But each audience wants only half of her. She fractures herself for applause, wondering if anyone claps for her wholeness.",
                memories: {
                    positive: ['Crowd loved my hybrid move', 'Spotlight on full self'],
                    negative: ['Wrong audience for this performance', 'Booed for being too much']
                },
                dialogueStyle: 'spotlight_hungry',
                specialTraits: ['performance_addiction', 'audience_splitting'],
                currentMode: 'baseball',
                identityStress: 6
            }
        },
        
        {
            id: 'third_base_third_position',
            name: 'Third Base Third Position',
            position: { row: 1, col: 2 },
            personality: {
                coreWound: 'Always third - never first in either world',
                triggers: ['third place', 'bronze medal', 'almost good enough'],
                comfortResponses: ['third is not lesser', 'bronze still shines', 'position not rank'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'anxiety': 0.3,
                    'freeze': 0.2,
                    'fight': 0.1
                },
                resilience: 3,
                trustGainRate: 0.7,
                trustLossRate: 1.4,
                backstory: "Third in batting order, third position in ballet - never premier in either. She's competent at both, excellent at neither. The perpetual bronze medalist wondering if choosing one would finally make her first.",
                memories: {
                    positive: ['Third saved the game', 'Perfect third position praised'],
                    negative: ['Always the bronze', 'Never quite first-string']
                },
                dialogueStyle: 'resigned_striving',
                specialTraits: ['chronic_third_place', 'excellence_anxiety'],
                currentMode: 'ballet',
                identityStress: 5
            }
        },
        
        {
            id: 'relief_releve',
            name: 'Relief Relevé',
            position: { row: 1, col: 4 },
            personality: {
                coreWound: 'Only called in crisis, never part of the main plan',
                triggers: ['backup plan', 'just in case', 'emergency only'],
                comfortResponses: ['relief is vital', 'clutch matters', 'savior role is real'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'freeze': 0.3,
                    'shutdown': 0.2,
                    'flight': 0.1
                },
                resilience: 4,
                trustGainRate: 0.8,
                trustLossRate: 1.3,
                backstory: "Relevé rises to every crisis - relief pitcher in the ninth, understudy on opening night. But she's never Plan A. Always warming up, never starting. She saves every show but starts none.",
                memories: {
                    positive: ['Saved the game/show', 'Hero of the moment'],
                    negative: ['Bench until needed', 'Forgotten after crisis']
                },
                dialogueStyle: 'crisis_ready',
                specialTraits: ['perpetual_understudy', 'savior_complex'],
                currentMode: 'balanced',
                identityStress: 6
            }
        },
        
        {
            id: 'outfield_pas_de_deux',
            name: 'Outfield Pas de Deux',
            position: { row: 1, col: 6 },
            personality: {
                coreWound: 'Needs a partner but belongs to opposing teams',
                triggers: ['solo act', 'find your partner', 'team player'],
                comfortResponses: ['partnership transcends teams', 'dance with all', 'solo has beauty'],
                dysregulationTendencies: {
                    'anxiety': 0.3,
                    'freeze': 0.3,
                    'fawn': 0.3,
                    'shutdown': 0.1
                },
                resilience: 3,
                trustGainRate: 1.0,
                trustLossRate: 1.6,
                backstory: "Pas de Deux excels at partnership - double plays and partner lifts. But baseball celebrates individual stats while ballet pairs are forever. She's caught between independence and interdependence, alone in both.",
                memories: {
                    positive: ['Perfect synchronized play', 'Found my dance partner'],
                    negative: ['Partner chose their solo', 'No one to catch/lift with']
                },
                dialogueStyle: 'partnership_seeking',
                specialTraits: ['collaboration_need', 'abandonment_fear'],
                currentMode: 'ballet',
                identityStress: 7
            }
        },
        
        {
            id: 'batter_battement',
            name: 'Batter Battement',
            position: { row: 2, col: 1 },
            personality: {
                coreWound: 'Violent swings between extremes, no middle ground',
                triggers: ['find balance', 'too extreme', 'moderate yourself'],
                comfortResponses: ['extremes are valid', 'swing freely', 'range is power'],
                dysregulationTendencies: {
                    'fight': 0.4,
                    'flight': 0.3,
                    'anxiety': 0.2,
                    'freeze': 0.1
                },
                resilience: 3,
                trustGainRate: 0.9,
                trustLossRate: 1.7,
                backstory: "Battement swings hard - grand battements that could break boards, bat swings that shatter expectations. There's no gentle in her vocabulary. She's been told to moderate, but how do you half-swing at life?",
                memories: {
                    positive: ['Grand slam grand battement', 'Extremes won the day'],
                    negative: ['Too much, always too much', 'Broke something swinging']
                },
                dialogueStyle: 'all_or_nothing',
                specialTraits: ['intensity_regulation', 'moderation_allergy'],
                currentMode: 'baseball',
                identityStress: 8
            }
        },
        
        {
            id: 'designated_dancer',
            name: 'Designated Dancer',
            position: { row: 2, col: 3 },
            personality: {
                coreWound: 'Designated for specific roles, never seen as whole',
                triggers: ['stay in your lane', 'we need you for', 'your role is'],
                comfortResponses: ['all roles are you', 'designation not limitation', 'choose freely'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'anxiety': 0.3,
                    'freeze': 0.2,
                    'fawn': 0.1
                },
                resilience: 3,
                trustGainRate: 0.8,
                trustLossRate: 1.5,
                backstory: "Designated hitter, designated swan - always filling specific needs, never just being. Teams want her power or her grace, never both. She's a utility player in life, wondering what her true position is.",
                memories: {
                    positive: ['Played every position', 'Danced every role'],
                    negative: ['Pigeonholed again', 'Only wanted for one thing']
                },
                dialogueStyle: 'role_weary',
                specialTraits: ['pigeonhole_trauma', 'identity_scatter'],
                currentMode: 'balanced',
                identityStress: 6
            }
        },
        
        {
            id: 'coach_choreographer',
            name: 'Coach Choreographer',
            position: { row: 2, col: 5 },
            personality: {
                coreWound: 'Teaching others while lost herself',
                triggers: ['lead by example', 'show us how', 'you should know'],
                comfortResponses: ['teachers still learn', 'guides get lost too', 'leading imperfectly'],
                dysregulationTendencies: {
                    'anxiety': 0.5,
                    'freeze': 0.2,
                    'shutdown': 0.2,
                    'fawn': 0.1
                },
                resilience: 4,
                trustGainRate: 0.7,
                trustLossRate: 1.4,
                backstory: "She coaches baseball, choreographs ballet, but can't coordinate her own life. Everyone seeks her guidance while she's internally lost. The pressure to have answers when you're still questioning everything.",
                memories: {
                    positive: ['Student found their way', 'Admitted I don\'t know'],
                    negative: ['Faking expertise', 'Lost while leading']
                },
                dialogueStyle: 'wise_confused',
                specialTraits: ['imposter_coach', 'guidance_pressure'],
                currentMode: 'ballet',
                identityStress: 7
            }
        },
        
        {
            id: 'rookie_corps',
            name: 'Rookie Corps',
            position: { row: 2, col: 7 },
            personality: {
                coreWound: 'Forever beginning, never belonging',
                triggers: ['newbie', 'prove yourself', 'earn your place'],
                comfortResponses: ['beginning is brave', 'rookie is not lesser', 'you belong now'],
                dysregulationTendencies: {
                    'anxiety': 0.5,
                    'fawn': 0.3,
                    'freeze': 0.1,
                    'flight': 0.1
                },
                resilience: 2,
                trustGainRate: 1.3,
                trustLossRate: 2.0,
                backstory: "Perpetual rookie - new to baseball, new to ballet, new to existing between. While others settled into identities, she's still trying on uniforms. The exhaustion of constantly proving you deserve to be here.",
                memories: {
                    positive: ['Veterans showed kindness', 'Belonged for a moment'],
                    negative: ['Hazed in both worlds', 'Always the outsider']
                },
                dialogueStyle: 'eager_exhausted',
                specialTraits: ['perpetual_beginner', 'belonging_hunger'],
                currentMode: 'balanced',
                identityStress: 9
            }
        }
    ],
    
    // Identity switching mechanics
    identityMechanics: {
        modeSwithching: {
            trigger: 'Extreme stress forces identity switch',
            baseballMode: 'Aggressive, competitive, stats-focused',
            balletMode: 'Graceful, artistic, perfection-seeking',
            balancedMode: 'Integrated but unstable',
            switchCost: 'Trust loss and temporary freeze'
        },
        
        identityStress: {
            sources: [
                'Being asked to choose',
                'Performing wrong identity for situation',
                'Code-switching exhaustion',
                'Identity invalidation'
            ],
            effects: {
                high: 'Forced mode switches',
                critical: 'Identity fragmentation',
                breakdown: 'Complete freeze'
            }
        },
        
        hybridMoves: {
            description: 'Special moves combining both identities',
            requirement: 'Balanced mode + high trust',
            examples: [
                'Pirouette double play',
                'Grand jeté home run',
                'Fouetté fastball'
            ]
        }
    },
    
    // Team-wide emotional dynamics
    groupDynamics: {
        supportNetwork: {
            'pitcher_prima-shortstop_swan': 'grace_strength_alliance',
            'catcher_chorus-relief_releve': 'understudy_union',
            'centerfield_centerstage-batter_battement': 'intensity_support',
            'coach_choreographer-rookie_corps': 'lost_leaders'
        },
        
        conflictPairs: {
            'first_base_fouette-third_base_third_position': 'stability_vs_spinning',
            'designated_dancer-outfield_pas_de_deux': 'solo_vs_partner',
            'shortstop_swan-batter_battement': 'control_vs_chaos'
        },
        
        groupTriggers: [
            {
                trigger: 'championship_recital_same_day',
                effect: 'mass_identity_crisis',
                description: 'Must choose which self to be'
            },
            {
                trigger: 'mixed_uniform_day',
                effect: 'dysphoric_confusion',
                description: 'Cleats with tutus breaks brains'
            },
            {
                trigger: 'code_switch_exhaustion',
                effect: 'collective_shutdown',
                description: 'Too many switches, systems crash'
            }
        ]
    },
    
    // Special team abilities
    teamAbilities: [
        {
            name: 'Hybrid Flow State',
            requirement: 'threeBalancedMode',
            effect: 'Unique moves combining both identities',
            description: 'The beauty of being both'
        },
        {
            name: 'Identity Crisis Chain',
            requirement: 'avgIdentityStress >= 7',
            effect: 'One switch triggers cascading switches',
            description: 'Confusion spreads like wildfire'
        },
        {
            name: 'Integrated Performance',
            requirement: 'avgTrust >= 8',
            effect: 'Can be both without switching',
            description: 'Finally, wholeness'
        }
    ],
    
    // Dialogue banks
    teamDialogue: {
        victory: [
            "We won... but which 'we' won?",
            "Victory in cleats AND pointe shoes!",
            "Both sides of us contributed."
        ],
        defeat: [
            "Maybe we should have picked a side.",
            "Lost in translation between selves.",
            "Neither athlete nor artist enough."
        ],
        encouragement: [
            "Your grand slam was so graceful!",
            "That pirouette helped you catch it!",
            "Both sides make you stronger!"
        ],
        identityCrisis: [
            "WHO AM I SUPPOSED TO BE RIGHT NOW?!",
            "I can't switch anymore... I can't...",
            "Just tell me which uniform to wear!"
        ],
        integration: [
            "I am baseball. I am ballet. I am both.",
            "My cleats have ribbons and that's okay.",
            "Watch me hit this home run en pointe!"
        ]
    }
};