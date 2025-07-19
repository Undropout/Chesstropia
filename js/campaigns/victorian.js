// The Victorian Ghosts - Spirits who can't let go of propriety even in death
export default {
    id: 'victorian_ghosts',
    name: 'The Victorian Ghosts',
    theme: 'repression_beyond_death',
    description: 'Died with feelings unexpressed, now haunting with perfect manners',
    colorAffinity: 'green', // Their ectoplasm glows with repressed emotions
    
    teamTraits: {
        emotionalRepression: true,
        hauntedByPropriety: true,
        eternallyCorseted: true,
        ghostlyManners: true
    },
    
    pieces: [
        {
            id: 'lady_constance',
            name: 'Lady Constance',
            position: { row: 0, col: 1 },
            personality: {
                coreWound: 'Died without ever saying "I love you"',
                triggers: ['improper', 'unseemly', 'what will they think'],
                comfortResponses: ['feelings are proper', 'speak your truth', 'etiquette cant hurt you'],
                dysregulationTendencies: {
                    'shutdown': 0.5,
                    'freeze': 0.3,
                    'anxiety': 0.2
                },
                resilience: 4,
                trustGainRate: 0.4, // Centuries of repression
                trustLossRate: 1.0,
                backstory: "Lady Constance died at 85, never having told her beloved how she felt. 'A lady doesn't express such things.' Now she haunts the parlor, desperate to speak but bound by ethereal corsets of propriety.",
                memories: {
                    positive: ['Almost said it once', 'He waited for me'],
                    negative: ['The words dying in my throat', 'Proper until the end']
                },
                dialogueStyle: 'formal_yearning',
                specialTraits: ['love_repression', 'proper_ghost'],
                currentForm: 'translucent',
                repressionLevel: 9,
                deathRegret: 'unspoken_love'
            }
        },
        
        {
            id: 'colonel_pemberton',
            name: 'Colonel Pemberton',
            position: { row: 0, col: 3 },
            personality: {
                coreWound: 'Maintained stiff upper lip even as he died of grief',
                triggers: ['show weakness', 'emotional display', 'ungentlemanly'],
                comfortResponses: ['tears are honorable', 'grief is love', 'strength includes feeling'],
                dysregulationTendencies: {
                    'shutdown': 0.6,
                    'freeze': 0.3,
                    'fight': 0.1
                },
                resilience: 5,
                trustGainRate: 0.3,
                trustLossRate: 1.2,
                backstory: "The Colonel lost his son in the war but shed no tears. 'Pemberton men don't weep.' He died of what doctors called 'inexplicable heart failure.' His ghost still stands at attention, transparent tears unshed.",
                memories: {
                    positive: ['One tear escaped', 'Someone said it was okay'],
                    negative: ['The funeral where I couldn\'t cry', 'Stiff upper lip unto death']
                },
                dialogueStyle: 'military_broken',
                specialTraits: ['toxic_stoicism', 'grief_constipation'],
                currentForm: 'rigid_mist',
                repressionLevel: 10,
                deathRegret: 'unexpressed_grief'
            }
        },
        
        {
            id: 'miss_prudence',
            name: 'Miss Prudence',
            position: { row: 0, col: 5 },
            personality: {
                coreWound: 'Died a spinster because anger was unladylike',
                triggers: ['calm down', 'ladies dont', 'be sweet'],
                comfortResponses: ['rage is righteous', 'anger is truth', 'fury is female too'],
                dysregulationTendencies: {
                    'fight': 0.4,
                    'shutdown': 0.3,
                    'freeze': 0.2,
                    'anxiety': 0.1
                },
                resilience: 3,
                trustGainRate: 0.7,
                trustLossRate: 2.0,
                backstory: "Prudence had opinions. Strong ones. But ladies don't argue. She swallowed every retort, smiled at every slight. The unexpressed rage calcified in her chest. She died at 47, lungs full of fossilized fury.",
                memories: {
                    positive: ['Slammed one door once', 'Raised my voice in private'],
                    negative: ['Smiled while seething', 'Nice until it killed me']
                },
                dialogueStyle: 'polite_rage',
                specialTraits: ['anger_poisoning', 'weaponized_niceness'],
                currentForm: 'seething_vapor',
                repressionLevel: 8,
                deathRegret: 'swallowed_anger'
            }
        },
        
        {
            id: 'master_timothy',
            name: 'Master Timothy',
            position: { row: 0, col: 7 },
            personality: {
                coreWound: 'Died at 12, never allowed to be a child',
                triggers: ['act your age', 'young gentleman', 'childish'],
                comfortResponses: ['play is sacred', 'joy is ageless', 'childhood matters'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'freeze': 0.3,
                    'fawn': 0.2,
                    'shutdown': 0.1
                },
                resilience: 2,
                trustGainRate: 1.2,
                trustLossRate: 1.8,
                backstory: "Timothy was raised to be a 'little gentleman.' No running, no laughing, no playing. He died of scarlet fever having never climbed a tree. His ghost still wears his tiny suit, translucent hands clutching unplayed-with toys.",
                memories: {
                    positive: ['Laughed once at dinner', 'Ran in the garden briefly'],
                    negative: ['Toys behind glass', 'Childhood is unseemly']
                },
                dialogueStyle: 'formal_child',
                specialTraits: ['stolen_childhood', 'miniature_adult'],
                currentForm: 'small_shadow',
                repressionLevel: 7,
                deathRegret: 'unlived_youth'
            }
        },
        
        {
            id: 'governess_helena',
            name: 'Governess Helena',
            position: { row: 1, col: 0 },
            personality: {
                coreWound: 'Educated but silenced, brilliant but backgrounded',
                triggers: ['know your place', 'speak when spoken to', 'just the help'],
                comfortResponses: ['your mind matters', 'wisdom deserves voice', 'speak freely'],
                dysregulationTendencies: {
                    'shutdown': 0.5,
                    'anxiety': 0.3,
                    'freeze': 0.2
                },
                resilience: 4,
                trustGainRate: 0.6,
                trustLossRate: 1.5,
                backstory: "Helena spoke seven languages, understood advanced mathematics, read every book. But governesses don't share opinions. She died with libraries of thoughts unspoken, equations unsolved, ideas unshared. Her ghost whispers theorems.",
                memories: {
                    positive: ['One student asked my thoughts', 'Solved it in my head'],
                    negative: ['Brilliant but silent', 'Opinions dying inside']
                },
                dialogueStyle: 'intellectual_suppressed',
                specialTraits: ['knowledge_prison', 'brilliance_wasted'],
                currentForm: 'whispering_shade',
                repressionLevel: 8,
                deathRegret: 'unshared_brilliance'
            }
        },
        
        {
            id: 'reverend_mortimer',
            name: 'Reverend Mortimer',
            position: { row: 1, col: 2 },
            personality: {
                coreWound: 'Preached faith while drowning in doubt',
                triggers: ['have faith', 'trust god', 'doubt is sin'],
                comfortResponses: ['doubt is human', 'questions are holy', 'uncertainty is honest'],
                dysregulationTendencies: {
                    'anxiety': 0.5,
                    'freeze': 0.3,
                    'shutdown': 0.2
                },
                resilience: 3,
                trustGainRate: 0.5,
                trustLossRate: 1.7,
                backstory: "Reverend Mortimer delivered 2,847 sermons about certainty while wrestling with cosmic doubt. Every 'Amen' was a lie. He died mid-sermon, the word 'why' on his lips. His ghost still clutches an unfinished sermon titled 'Doubts.'",
                memories: {
                    positive: ['One honest confession', 'Someone else doubted too'],
                    negative: ['Preaching lies', 'Faith as performance']
                },
                dialogueStyle: 'pious_uncertain',
                specialTraits: ['religious_impostor', 'doubt_shame'],
                currentForm: 'flickering_spirit',
                repressionLevel: 9,
                deathRegret: 'performed_faith'
            }
        },
        
        {
            id: 'widow_blackwood',
            name: 'Widow Blackwood',
            position: { row: 1, col: 4 },
            personality: {
                coreWound: 'Mourned properly in public, celebrated privately',
                triggers: ['grieving widow', 'respect the dead', 'mourning period'],
                comfortResponses: ['complex feelings valid', 'relief is okay', 'truth over performance'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'anxiety': 0.3,
                    'freeze': 0.2,
                    'fight': 0.1
                },
                resilience: 4,
                trustGainRate: 0.8,
                trustLossRate: 1.3,
                backstory: "Widow Blackwood wore black for precisely two years. Society saw perfect grief. In private, she felt relief - her husband was cruel. She died unable to admit that widowhood freed her. Her ghost still wears mourning clothes over dancing shoes.",
                memories: {
                    positive: ['Danced alone once', 'Smiled behind the veil'],
                    negative: ['Performance of grief', 'Truth is improper']
                },
                dialogueStyle: 'mourning_free',
                specialTraits: ['grief_performance', 'secret_liberation'],
                currentForm: 'veiled_phantom',
                repressionLevel: 7,
                deathRegret: 'false_mourning'
            }
        },
        
        {
            id: 'butler_jameson',
            name: 'Butler Jameson',
            position: { row: 1, col: 6 },
            personality: {
                coreWound: 'Invisible by profession, erased by propriety',
                triggers: ['servants dont', 'your place', 'invisible'],
                comfortResponses: ['you exist fully', 'visibility is right', 'your story matters'],
                dysregulationTendencies: {
                    'shutdown': 0.6,
                    'freeze': 0.3,
                    'anxiety': 0.1
                },
                resilience: 5,
                trustGainRate: 0.4,
                trustLossRate: 1.0,
                backstory: "Jameson served for 60 years, invisible as good butlers must be. He heard secrets, witnessed lives, but mustn't exist. He died having never been seen as human. His ghost still tries to serve tea no one can drink.",
                memories: {
                    positive: ['Someone said thank you once', 'Existed for a moment'],
                    negative: ['Furniture with legs', 'Invisible man']
                },
                dialogueStyle: 'servile_yearning',
                specialTraits: ['professional_invisibility', 'existence_denial'],
                currentForm: 'barely_there',
                repressionLevel: 10,
                deathRegret: 'never_seen'
            }
        },
        
        {
            id: 'maiden_aunt_agatha',
            name: 'Maiden Aunt Agatha',
            position: { row: 2, col: 1 },
            personality: {
                coreWound: 'Labeled "maiden aunt," desires erased',
                triggers: ['spinster', 'old maid', 'past your prime'],
                comfortResponses: ['desire is lifelong', 'wanting is human', 'passion has no expiry'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'anxiety': 0.3,
                    'freeze': 0.2,
                    'fawn': 0.1
                },
                resilience: 3,
                trustGainRate: 0.7,
                trustLossRate: 1.6,
                backstory: "Agatha was relegated to 'maiden aunt' - sexless, passionless, existing only to tend others' children. Inside, desire burned. She died at 72, having never admitted she still wanted love, touch, passion. Her ghost radiates suppressed longing.",
                memories: {
                    positive: ['One scandalous dream', 'Desired in secret'],
                    negative: ['Dried up old maid', 'Desire is done']
                },
                dialogueStyle: 'spinster_passionate',
                specialTraits: ['desire_denial', 'passion_suppression'],
                currentForm: 'yearning_mist',
                repressionLevel: 8,
                deathRegret: 'unexplored_desire'
            }
        },
        
        {
            id: 'doctor_fitzgerald',
            name: 'Doctor Fitzgerald',
            position: { row: 2, col: 3 },
            personality: {
                coreWound: 'Couldn\'t heal himself, couldn\'t admit weakness',
                triggers: ['physician heal thyself', 'doctors dont get sick', 'stay strong'],
                comfortResponses: ['healers need healing', 'weakness is human', 'help is strength'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'shutdown': 0.3,
                    'freeze': 0.2,
                    'fight': 0.1
                },
                resilience: 3,
                trustGainRate: 0.6,
                trustLossRate: 1.4,
                backstory: "Dr. Fitzgerald saved hundreds but couldn't admit his own pain. Doctors must be strong. He diagnosed others while dying inside, maintaining composure as cancer consumed him. He died mid-surgery, scalpel still steady. Ghost still tries to heal.",
                memories: {
                    positive: ['Admitted pain once', 'Let someone help'],
                    negative: ['Dying while doctoring', 'Physician couldn\'t heal thyself']
                },
                dialogueStyle: 'clinical_desperate',
                specialTraits: ['healer_wound', 'strength_prison'],
                currentForm: 'surgical_specter',
                repressionLevel: 7,
                deathRegret: 'unhealed_healer'
            }
        },
        
        {
            id: 'poet_cornelius',
            name: 'Poet Cornelius',
            position: { row: 2, col: 5 },
            personality: {
                coreWound: 'Wrote about feelings he couldn\'t feel',
                triggers: ['too sensitive', 'melodramatic', 'overly emotional'],
                comfortResponses: ['feeling is poetry', 'emotion is art', 'sensitive is strength'],
                dysregulationTendencies: {
                    'freeze': 0.4,
                    'shutdown': 0.3,
                    'anxiety': 0.3
                },
                resilience: 2,
                trustGainRate: 0.9,
                trustLossRate: 2.0,
                backstory: "Cornelius wrote passionate verse about love, loss, longing. But Victorian men don't feel such things. His poetry was fiction; his numbness was real. He died having written 10,000 poems about feelings he'd never let himself experience.",
                memories: {
                    positive: ['Felt one poem truly', 'Cried over my own verse once'],
                    negative: ['Words without feelings', 'Emotional cosplay']
                },
                dialogueStyle: 'flowery_empty',
                specialTraits: ['emotional_fiction', 'feeling_fraud'],
                currentForm: 'ink_stained_wraith',
                repressionLevel: 9,
                deathRegret: 'unfelt_poetry'
            }
        },
        
        {
            id: 'judge_wellington',
            name: 'Judge Wellington',
            position: { row: 2, col: 7 },
            personality: {
                coreWound: 'Judged others while hiding his own truth',
                triggers: ['moral authority', 'upstanding', 'pillar of society'],
                comfortResponses: ['truth over reputation', 'authenticity heals', 'judgment ends'],
                dysregulationTendencies: {
                    'shutdown': 0.5,
                    'anxiety': 0.3,
                    'freeze': 0.2
                },
                resilience: 4,
                trustGainRate: 0.5,
                trustLossRate: 1.5,
                backstory: "Judge Wellington sentenced men for sodomy while loving men himself. Every gavel strike was self-flagellation. He died at his bench, mid-sentence, the word 'guilty' aimed inward. His ghost still holds court over his own shame.",
                memories: {
                    positive: ['One honest moment', 'Almost told the truth'],
                    negative: ['Judging my own heart', 'Hypocrisy unto death']
                },
                dialogueStyle: 'judicial_shame',
                specialTraits: ['internalized_judgment', 'self_persecution'],
                currentForm: 'guilty_shadow',
                repressionLevel: 10,
                deathRegret: 'lived_lie'
            }
        }
    ],
    
    // Victorian ghost-specific mechanics
    ghostMechanics: {
        manifestationLevels: {
            description: 'How solid/visible ghost becomes based on emotional expression',
            levels: [
                { repression: 10, form: 'barely_visible', power: 0.1 },
                { repression: 8, form: 'translucent', power: 0.3 },
                { repression: 6, form: 'semi_solid', power: 0.5 },
                { repression: 4, form: 'glowing_bright', power: 0.7 },
                { repression: 2, form: 'fully_manifest', power: 0.9 },
                { repression: 0, form: 'transcendent', power: 1.0 }
            ]
        },
        
        proprietyBindings: {
            description: 'Victorian rules that still bind them in death',
            rules: [
                'Cannot speak feelings directly',
                'Must maintain proper distance',
                'Emotional displays drain ectoplasm',
                'Improper behavior causes fading'
            ],
            breaking: 'Each broken rule reduces repression but causes pain'
        },
        
        hauntingPatterns: {
            types: [
                { name: 'Repetition Compulsion', effect: 'Stuck repeating death moment' },
                { name: 'Unfinished Business', effect: 'Cannot rest until expressed' },
                { name: 'Propriety Loops', effect: 'Trapped in etiquette cycles' },
                { name: 'Emotional Poltergeist', effect: 'Repression explodes outward' }
            ]
        },
        
        ectoplasmicResonance: {
            description: 'Ghosts affect each other\'s manifestation',
            groupRepression: 'High collective repression weakens all',
            emotionalBleedthrough: 'One ghost expressing affects others',
            resonanceChain: 'Breakthrough in one can trigger others'
        }
    },
    
    // Team-wide emotional dynamics
    groupDynamics: {
        supportNetwork: {
            'lady_constance-colonel_pemberton': 'stiff_upper_lip_society',
            'miss_prudence-maiden_aunt_agatha': 'suppressed_desires_club',
            'master_timothy-poet_cornelius': 'unfelt_feelings_fellowship',
            'governess_helena-doctor_fitzgerald': 'brilliant_but_silenced'
        },
        
        conflictPairs: {
            'judge_wellington-reverend_mortimer': 'hypocrite_tension',
            'butler_jameson-widow_blackwood': 'class_divide',
            'miss_prudence-lady_constance': 'expression_methods'
        },
        
        groupTriggers: [
            {
                trigger: 'seance_attempted',
                effect: 'mass_manifestation_attempt',
                description: 'Living trying to contact them triggers crisis'
            },
            {
                trigger: 'modern_freedom_witnessed',
                effect: 'collective_envy_rage',
                description: 'Seeing emotional freedom they never had'
            },
            {
                trigger: 'propriety_breaking_cascade',
                effect: 'ectoplasmic_storm',
                description: 'One breaks rules, all feel the tremor'
            }
        ]
    },
    
    // Special team abilities
    teamAbilities: [
        {
            name: 'Collective Manifestation',
            requirement: 'avgRepressionBelow6',
            effect: 'All ghosts become more solid and powerful',
            description: 'Together, we can almost touch the world'
        },
        {
            name: 'Propriety Shield',
            requirement: 'allMaintainingManners',
            effect: 'Invisible to emotional damage but cannot progress',
            description: 'Perfect Victorian armor, perfect Victorian prison'
        },
        {
            name: 'The Great Unburdening',
            requirement: 'threeBreakthroughs',
            effect: 'Mass catharsis, all repression reduced by 3',
            description: 'If one can speak truth, perhaps we all can'
        },
        {
            name: 'Spectral Finishing School',
            requirement: 'highCollectiveRepression',
            effect: 'Teaching others to repress like us',
            description: 'Misery loves properly behaved company'
        }
    ],
    
    // Dialogue banks
    teamDialogue: {
        victory: [
            "We won... but did we do it properly?",
            "Victory feels unseemly when you're dead.",
            "Perhaps winning matters less than finally speaking."
        ],
        defeat: [
            "Even in death, we fail properly.",
            "Back to our haunting grounds, silent as always.",
            "Defeat is fitting for those who died repressed."
        ],
        encouragement: [
            "Your translucence is showing, dear.",
            "Break the rules! You're already dead!",
            "What's propriety to a ghost?"
        ],
        repressionBreaking: [
            "I... I feel... is this allowed?!",
            "The rules are breaking! THE RULES ARE BREAKING!",
            "I CAN SPEAK! I CAN FINALLY SPEAK!"
        ],
        deathMemories: [
            "I remember... the words I couldn't say...",
            "Dying with it all inside...",
            "If I could do it again... but I can't. I'm dead."
        ],
        transcendence: [
            "The corset is gone. The binding is broken.",
            "I am more than manner. I am more than propriety.",
            "Free... finally, eternally free."
        ]
    }
};