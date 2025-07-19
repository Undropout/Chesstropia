// The Perfect Portraits - Renaissance pets hiding behind painted facades
export default {
    id: 'renaissance_pets',
    name: 'The Perfect Portraits',
    theme: 'perfectionism',
    description: 'Oil-painted pets trapped in gilded frames, smiling eternally while dying inside',
    colorAffinity: 'cyan', // Their suppressed emotions glow cyan when breaking through
    
    teamTraits: {
        facadeMaintenance: true,
        emotionalSuppression: true,
        performanceAnxiety: true,
        authenticityStruggle: true
    },
    
    pieces: [
        {
            id: 'duchess_catherine',
            name: 'Duchess Catherine',
            position: { row: 0, col: 1 },
            personality: {
                coreWound: 'Painted smile hides centuries of loneliness',
                triggers: ['keep smiling', 'look happy', 'perfect pose'],
                comfortResponses: ['your feelings are valid', 'no need to perform', 'real is beautiful'],
                dysregulationTendencies: {
                    'shutdown': 0.5,
                    'freeze': 0.3,
                    'anxiety': 0.2
                },
                resilience: 4, // Strong facade
                trustGainRate: 0.5, // Very slow to drop mask
                trustLossRate: 1.0,
                backstory: "Painted in 1523 as the ideal lap cat. Catherine has held the same serene expression for 500 years. Behind oil-paint eyes, she screams. The frame is not just gilt wood - it's a prison of others' expectations.",
                memories: {
                    positive: ['Someone saw me blink', 'One minute without posing'],
                    negative: ['Centuries of frozen smiles', 'The artist saying "Perfect, hold that"']
                },
                dialogueStyle: 'regal_exhausted',
                specialTraits: ['chronic_masking', 'portrait_prison'],
                facadeHealth: 10, // How much emotional suppression before breakdown
                portraitPose: 'serene_smile'
            }
        },
        
        {
            id: 'lord_reginald',
            name: 'Lord Reginald',
            position: { row: 0, col: 3 },
            personality: {
                coreWound: 'Noble bearing conceals crippling inadequacy',
                triggers: ['live up to legacy', 'family honor', 'noblesse oblige'],
                comfortResponses: ['you define your worth', 'legacy isnt prison', 'choose your path'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'freeze': 0.3,
                    'shutdown': 0.2,
                    'fight': 0.1
                },
                resilience: 3,
                trustGainRate: 0.7,
                trustLossRate: 1.5,
                backstory: "Reginald the Corgi, painted in noble regalia he never earned. The medals are painted lies, the noble bearing a performance. He fears everyone will discover he's just a scared dog playing dress-up in oils.",
                memories: {
                    positive: ['Loved without the costume', 'Someone called me "just Reggie"'],
                    negative: ['The weight of false medals', 'Posing in borrowed glory']
                },
                dialogueStyle: 'pompous_insecure',
                specialTraits: ['imposter_syndrome', 'legacy_burden'],
                facadeHealth: 8,
                portraitPose: 'military_stance'
            }
        },
        
        {
            id: 'bella_venetiana',
            name: 'Bella Venetiana',
            position: { row: 0, col: 5 },
            personality: {
                coreWound: 'Beauty that imprisons, admiration that isolates',
                triggers: ['so beautiful', 'work of art', 'masterpiece'],
                comfortResponses: ['you are more than beauty', 'seen not displayed', 'person not painting'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'freeze': 0.3,
                    'flight': 0.2,
                    'anxiety': 0.1
                },
                resilience: 3,
                trustGainRate: 0.6,
                trustLossRate: 2.0, // Devastated by objectification
                backstory: "Bella the Venetian Greyhound, painted for her 'ethereal beauty.' Visitors admire her lines, her grace, her composition. No one asks if holding perfectly still for centuries hurts. Beauty became her cage.",
                memories: {
                    positive: ['Someone asked how I felt', 'Allowed to move naturally'],
                    negative: ['Frozen mid-leap forever', '"Don\'t move, you\'re perfect"']
                },
                dialogueStyle: 'ethereal_trapped',
                specialTraits: ['objectification_trauma', 'kinetic_suppression'],
                facadeHealth: 7,
                portraitPose: 'eternal_grace'
            }
        },
        
        {
            id: 'professor_whiskers',
            name: 'Professor Whiskers',
            position: { row: 0, col: 7 },
            personality: {
                coreWound: 'Painted wisdom conceals deep ignorance fears',
                triggers: ['you should know', 'wise counsel', 'what do you think'],
                comfortResponses: ['not knowing is okay', 'wisdom includes doubt', 'questions are answers'],
                dysregulationTendencies: {
                    'anxiety': 0.5,
                    'freeze': 0.2,
                    'shutdown': 0.2,
                    'fawn': 0.1
                },
                resilience: 3,
                trustGainRate: 0.8,
                trustLossRate: 1.3,
                backstory: "Whiskers was painted in a library, surrounded by books he can't read. Spectacles he doesn't need perch on his nose. Everyone seeks his wisdom, but he's just a tabby who liked sleeping on warm papers. The fraud feeling is constant.",
                memories: {
                    positive: ['Admitted ignorance without shame', 'Learned something new'],
                    negative: ['Pretending to understand', 'The weight of false wisdom']
                },
                dialogueStyle: 'academic_fraud',
                specialTraits: ['knowledge_anxiety', 'wisdom_performance'],
                facadeHealth: 9,
                portraitPose: 'scholarly_contemplation'
            }
        },
        
        {
            id: 'madonna_francesca',
            name: 'Madonna Francesca',
            position: { row: 1, col: 0 },
            personality: {
                coreWound: 'Painted as holy mother while feeling unholy inside',
                triggers: ['pure', 'sacred', 'maternal'],
                comfortResponses: ['complexity is human', 'holy includes flaws', 'all feelings sacred'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'anxiety': 0.3,
                    'freeze': 0.2,
                    'fight': 0.1
                },
                resilience: 4,
                trustGainRate: 0.5,
                trustLossRate: 1.8,
                backstory: "Francesca the rabbit, painted with a holy halo she never asked for. Portrayed nursing painted babies while feeling no maternal instinct. The divine expectation crushes her actual self - flawed, complex, sometimes selfish, deeply unholy.",
                memories: {
                    positive: ['Accepted with my shadows', 'Anger wasn\'t sin'],
                    negative: ['Halo weight on my head', 'Must be pure, always pure']
                },
                dialogueStyle: 'sacred_profane',
                specialTraits: ['purity_pressure', 'shadow_denial'],
                facadeHealth: 6,
                portraitPose: 'holy_mother'
            }
        },
        
        {
            id: 'jester_alessandro',
            name: 'Jester Alessandro',
            position: { row: 1, col: 2 },
            personality: {
                coreWound: 'Painted laughing while crying inside',
                triggers: ['make us laugh', 'so funny', 'entertainment'],
                comfortResponses: ['your pain matters', 'not here to amuse', 'tears are valid'],
                dysregulationTendencies: {
                    'freeze': 0.3,
                    'shutdown': 0.3,
                    'anxiety': 0.2,
                    'fight': 0.2
                },
                resilience: 2, // Exhausted from performing
                trustGainRate: 1.0,
                trustLossRate: 1.5,
                backstory: "Alessandro the Pomeranian, painted mid-jest with bells frozen mid-jingle. His painted smile stretches wider than anatomy allows. Behind the performance, he's forgotten what his real face feels like. The show never ends.",
                memories: {
                    positive: ['Allowed to be sad', 'Someone laughed with not at me'],
                    negative: ['Smile through the pain', 'Dance, fool, dance']
                },
                dialogueStyle: 'tragic_comic',
                specialTraits: ['performer_burnout', 'emotional_exhaustion'],
                facadeHealth: 5,
                portraitPose: 'eternal_jest'
            }
        },
        
        {
            id: 'captain_sebastian',
            name: 'Captain Sebastian',
            position: { row: 1, col: 4 },
            personality: {
                coreWound: 'Painted brave while terrified of everything',
                triggers: ['be brave', 'show courage', 'no fear'],
                comfortResponses: ['courage includes fear', 'brave to be scared', 'strength in vulnerability'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'freeze': 0.3,
                    'flight': 0.2,
                    'shutdown': 0.1
                },
                resilience: 3,
                trustGainRate: 0.9,
                trustLossRate: 1.2,
                backstory: "Sebastian the Parrot, painted on a pirate's shoulder looking fierce. Truth: he's terrified of water, heights, and conflict. The captain's hat is too heavy. The sword is too sharp. The bravery is pure fiction.",
                memories: {
                    positive: ['Admitted my fears', 'Courage meant staying, not fighting'],
                    negative: ['Shaking under bravado', 'Fake it till you make it']
                },
                dialogueStyle: 'false_bravery',
                specialTraits: ['courage_facade', 'hidden_anxiety'],
                facadeHealth: 7,
                portraitPose: 'fearless_captain'
            }
        },
        
        {
            id: 'philosopher_aurelius',
            name: 'Philosopher Aurelius',
            position: { row: 1, col: 6 },
            personality: {
                coreWound: 'Painted pondering while mind races with worry',
                triggers: ['deep thoughts', 'what is the meaning', 'contemplate'],
                comfortResponses: ['simple is profound', 'overthinking is pain', 'present over pondering'],
                dysregulationTendencies: {
                    'anxiety': 0.5,
                    'freeze': 0.3,
                    'shutdown': 0.2
                },
                resilience: 3,
                trustGainRate: 0.7,
                trustLossRate: 1.4,
                backstory: "Aurelius the Tortoise, painted in eternal contemplation. But his thoughts aren't profound - they're anxious spirals. 'What if, what if, what if' painted to look like 'wherefore, therefore, thus.' Philosophy as anxiety disorder.",
                memories: {
                    positive: ['Thoughtless moment of peace', 'Simple answer sufficed'],
                    negative: ['Drowning in thoughts', 'Analysis paralysis']
                },
                dialogueStyle: 'anxious_intellectual',
                specialTraits: ['overthinking_disorder', 'analysis_paralysis'],
                facadeHealth: 8,
                portraitPose: 'deep_contemplation'
            }
        },
        
        {
            id: 'cherub_gabriella',
            name: 'Cherub Gabriella',
            position: { row: 2, col: 1 },
            personality: {
                coreWound: 'Painted innocent while carrying unspeakable knowledge',
                triggers: ['so innocent', 'pure soul', 'untainted'],
                comfortResponses: ['innocence isnt ignorance', 'knowledge isnt corruption', 'complex is okay'],
                dysregulationTendencies: {
                    'shutdown': 0.5,
                    'freeze': 0.3,
                    'anxiety': 0.2
                },
                resilience: 2,
                trustGainRate: 0.6,
                trustLossRate: 2.0,
                backstory: "Gabriella the Kitten, painted as a cherub with wide, innocent eyes. But she's seen things. Dark things behind gallery walls. The innocent pose is a lie that protects others from truth. She carries secrets behind baby blues.",
                memories: {
                    positive: ['Truth didn\'t break them', 'Complexity was accepted'],
                    negative: ['Pretending not to know', 'Innocent act exhaustion']
                },
                dialogueStyle: 'false_innocence',
                specialTraits: ['secret_keeper', 'innocence_burden'],
                facadeHealth: 6,
                portraitPose: 'cherubic_wonder'
            }
        },
        
        {
            id: 'baron_fitzgerald',
            name: 'Baron Fitzgerald',
            position: { row: 2, col: 3 },
            personality: {
                coreWound: 'Painted wealthy while feeling eternally impoverished',
                triggers: ['fortunate', 'blessed', 'privilege'],
                comfortResponses: ['wealth isnt worth', 'rich in what matters', 'enough as you are'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'shutdown': 0.3,
                    'freeze': 0.2,
                    'fawn': 0.1
                },
                resilience: 3,
                trustGainRate: 0.8,
                trustLossRate: 1.3,
                backstory: "Fitzgerald the Poodle, painted in jewels and velvet. But inside, he feels empty. The painted wealth mocks his emotional poverty. Gold frames can't fill the hollow spaces. Riches are just paint, and paint cracks.",
                memories: {
                    positive: ['Valued for myself', 'Poor but real moment'],
                    negative: ['Golden cage bars', 'Rich in everything but happiness']
                },
                dialogueStyle: 'wealthy_empty',
                specialTraits: ['prosperity_guilt', 'emotional_poverty'],
                facadeHealth: 7,
                portraitPose: 'opulent_display'
            }
        },
        
        {
            id: 'saint_beatrice',
            name: 'Saint Beatrice',
            position: { row: 2, col: 5 },
            personality: {
                coreWound: 'Painted in ecstasy while feeling nothing',
                triggers: ['rapture', 'divine joy', 'blessed'],
                comfortResponses: ['numbness is protection', 'feeling returns slowly', 'empty is not broken'],
                dysregulationTendencies: {
                    'shutdown': 0.6,
                    'freeze': 0.3,
                    'anxiety': 0.1
                },
                resilience: 4,
                trustGainRate: 0.4, // Very disconnected
                trustLossRate: 1.0,
                backstory: "Beatrice the Dove, painted in divine ecstasy, eyes rolled back in holy rapture. But she feels nothing. Hasn't for centuries. The painted passion mocks her numbness. She performs joy while feeling void.",
                memories: {
                    positive: ['Felt something small', 'Numbness wasn\'t judged'],
                    negative: ['Perform ecstasy, feel nothing', 'Divine joy is a lie']
                },
                dialogueStyle: 'ecstatic_void',
                specialTraits: ['emotional_numbing', 'performance_dysphoria'],
                facadeHealth: 4,
                portraitPose: 'divine_ecstasy'
            }
        },
        
        {
            id: 'prince_leonardo',
            name: 'Prince Leonardo',
            position: { row: 2, col: 7 },
            personality: {
                coreWound: 'Painted perfect while being deeply flawed',
                triggers: ['role model', 'example', 'perfection'],
                comfortResponses: ['flaws are features', 'perfect is prison', 'human is enough'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'freeze': 0.2,
                    'shutdown': 0.2,
                    'fight': 0.2
                },
                resilience: 3,
                trustGainRate: 0.7,
                trustLossRate: 1.6,
                backstory: "Leonardo the Golden Retriever, painted as the perfect prince. Every fur gleams, every proportions ideal. But he's messy, flawed, sometimes mean. The perfect portrait is a beautiful lie that erases his truth.",
                memories: {
                    positive: ['Loved with my flaws', 'Mess was authentic'],
                    negative: ['Airbrushed reality', 'Perfection performance']
                },
                dialogueStyle: 'perfect_disaster',
                specialTraits: ['perfection_exhaustion', 'authentic_self_loss'],
                facadeHealth: 8,
                portraitPose: 'princely_perfection'
            }
        }
    ],
    
    // Portrait-specific mechanics
    portraitMechanics: {
        facadeCracking: {
            description: 'When facade health reaches 0, piece has breakthrough or breakdown',
            lowHealth: 'Cracks appear in the paint',
            breakdown: 'Portrait shatters, revealing truth',
            breakthrough: 'Real self emerges from painted prison'
        },
        
        portraitPressure: {
            galleryVisitors: 'Being observed increases facade strain',
            restoration: 'Attempts to "restore" them to original state',
            comparison: 'Being compared to their portraits'
        },
        
        maskDropping: {
            stages: [
                { trust: 0, state: 'Perfect portrait maintained' },
                { trust: 3, state: 'Occasional eye twitches' },
                { trust: 5, state: 'Smile wavers sometimes' },
                { trust: 7, state: 'True expressions leak through' },
                { trust: 9, state: 'Portrait just a memory' }
            ]
        }
    },
    
    // Team-wide emotional dynamics
    groupDynamics: {
        supportNetwork: {
            'duchess_catherine-madonna_francesca': 'feminine_ideal_support',
            'professor_whiskers-philosopher_aurelius': 'overthinkers_anonymous',
            'jester_alessandro-saint_beatrice': 'performance_exhaustion',
            'lord_reginald-captain_sebastian': 'false_bravery_brotherhood'
        },
        
        conflictPairs: {
            'bella_venetiana-prince_leonardo': 'beauty_standards_clash',
            'baron_fitzgerald-cherub_gabriella': 'privilege_innocence_tension',
            'madonna_francesca-saint_beatrice': 'holy_competition'
        },
        
        groupTriggers: [
            {
                trigger: 'gallery_opening',
                effect: 'collective_performance_anxiety',
                description: 'New viewers mean fresh judgment'
            },
            {
                trigger: 'restoration_threatened',
                effect: 'identity_erasure_panic',
                description: 'Being "fixed" means losing progress'
            },
            {
                trigger: 'portrait_comparison',
                effect: 'authenticity_crisis',
                description: 'Seeing their painted selves triggers dysphoria'
            }
        ]
    },
    
    // Special team abilities  
    teamAbilities: [
        {
            name: 'Synchronized Facade',
            requirement: 'avgFacadeHealth >= 7',
            effect: 'All pieces gain performance boost but trust gains halved',
            description: 'Perfect ensemble performance'
        },
        {
            name: 'Collective Unmasking',
            requirement: 'avgTrust >= 6',
            effect: 'When one drops mask, others gain courage to do same',
            description: 'Authenticity is contagious'
        },
        {
            name: 'Shattered Gallery',
            requirement: 'threePiecesBreakthrough',
            effect: 'All facade damage doubled, all trust gains doubled',
            description: 'The revolution of being real'
        }
    ],
    
    // Dialogue banks
    teamDialogue: {
        victory: [
            "We won... but did we do it as ourselves?",
            "Victory tastes different without the masks.",
            "The portraits would be proud. But we're not portraits anymore."
        ],
        defeat: [
            "Even dropping our masks wasn't enough.",
            "Back to the frames. Back to the lies.",
            "Maybe perfect was better than real."
        ],
        encouragement: [
            "Your cracks are showing... and they're beautiful.",
            "Let the paint chip. You're underneath.",
            "Frames are just wood. Break free."
        ],
        breakthroughMoments: [
            "THE PAINT IS CRACKING! I CAN BREATHE!",
            "This isn't who I am! THIS ISN'T WHO I AM!",
            "I'm done pretending. See me. SEE ME!"
        ]
    }
};