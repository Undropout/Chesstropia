// The Lonely Pastries - abandoned donuts seeking belonging
export default {
    id: 'donuts',
    name: 'The Lonely Pastries',
    theme: 'abandonment',
    description: 'Orphaned donuts left behind at dawn, seeking someone who won\'t leave',
    colorAffinity: 'amber', // Their anxiety manifests as amber
    
    teamTraits: {
        abandonmentSensitive: true,
        quickToBond: true,
        fearOfRejection: true,
        collectiveAnxiety: true
    },
    
    pieces: [
        {
            id: 'sprinkles',
            name: 'Sprinkles',
            position: { row: 0, col: 1 },
            personality: {
                coreWound: 'Made for a birthday party that never happened',
                triggers: ['being ignored', 'celebration without me', 'forgotten'],
                comfortResponses: ['you remembered me', 'im worth celebrating', 'i matter'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'flight': 0.3,
                    'freeze': 0.2,
                    'fawn': 0.1
                },
                resilience: 2,
                trustGainRate: 1.5, // Quick to trust
                trustLossRate: 2.0, // But easily hurt
                backstory: "Created with joy for a 6-year-old's party. The decorations were hung, the games prepared. Then the call came - cancelled. Family emergency. Sprinkles waited all night for birthday songs that never came.",
                memories: {
                    positive: ['Someone said I look festive', 'Got chosen first once'],
                    negative: ['The empty party room', 'Candles blown out on another cake']
                },
                dialogueStyle: 'anxious_optimist',
                specialTraits: ['celebration_trauma', 'people_pleaser']
            }
        },
        
        {
            id: 'glazed_gary',
            name: 'Glazed Gary',
            position: { row: 0, col: 3 },
            personality: {
                coreWound: 'Absorbs others\' anxieties like his glaze absorbs worries',
                triggers: ['3 AM thoughts', 'what if', 'not good enough'],
                comfortResponses: ['its okay to worry', 'we will figure it out', 'youre safe'],
                dysregulationTendencies: {
                    'anxiety': 0.5,
                    'shutdown': 0.3,
                    'freeze': 0.2
                },
                resilience: 3,
                trustGainRate: 1.0,
                trustLossRate: 1.5,
                backstory: "Made during a midnight stress-baking session. The baker couldn't sleep, worried about bills, relationships, the future. Every anxious thought went into the dough. Gary emerged glazed with 3 AM fears.",
                memories: {
                    positive: ['Someone held me without rushing', 'A quiet morning'],
                    negative: ['The baker crying into the flour', 'All those sleepless nights']
                },
                dialogueStyle: 'worried_philosopher',
                specialTraits: ['anxiety_sponge', 'insomniac']
            }
        },
        
        {
            id: 'boston_betty',
            name: 'Boston Cream Betty',
            position: { row: 0, col: 5 },
            personality: {
                coreWound: 'Hides her soft center, afraid of being consumed',
                triggers: ['show your feelings', 'open up', 'trust me'],
                comfortResponses: ['take your time', 'your boundaries matter', 'i wont push'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'freeze': 0.3,
                    'fight': 0.2,
                    'fawn': 0.1
                },
                resilience: 4,
                trustGainRate: 0.8, // Slow to trust
                trustLossRate: 1.2,
                backstory: "Betty learned early that showing your cream filling means someone takes a bite. Better to seem like a plain donut. She watched her sisters get chosen for their sweetness, consumed, gone. Betty remains.",
                memories: {
                    positive: ['Someone appreciated my outside too', 'Felt safe being whole'],
                    negative: ['Watching others get eaten', 'Hide the cream, hide the heart']
                },
                dialogueStyle: 'guarded_soft',
                specialTraits: ['hidden_depths', 'trust_issues']
            }
        },
        
        {
            id: 'jelly_james',
            name: 'Jelly-Filled James',
            position: { row: 0, col: 7 },
            personality: {
                coreWound: 'Betrayed by those who promised forever',
                triggers: ['promise', 'forever', 'i wont leave'],
                comfortResponses: ['one day at a time', 'im still here', 'actions not words'],
                dysregulationTendencies: {
                    'fight': 0.4,
                    'flight': 0.3,
                    'shutdown': 0.2,
                    'anxiety': 0.1
                },
                resilience: 3,
                trustGainRate: 0.6, // Very slow to trust
                trustLossRate: 3.0, // Devastating when trust breaks
                backstory: "James believed in forever. The regular customer who came every morning, who said 'See you tomorrow, buddy.' Until tomorrow became never. No goodbye. No explanation. Just empty space where certainty used to live.",
                memories: {
                    positive: ['Someone came back after saying they would', 'A kept promise'],
                    negative: ['Empty chair by the window', 'Forever is a lie']
                },
                dialogueStyle: 'bitter_hopeful',
                specialTraits: ['abandonment_rage', 'loyalty_test']
            }
        },
        
        {
            id: 'maple_marla',
            name: 'Maple Bar Marla',
            position: { row: 1, col: 0 },
            personality: {
                coreWound: 'Tries to be sweet enough that no one leaves',
                triggers: ['not sweet enough', 'disappointing', 'should be better'],
                comfortResponses: ['you are enough', 'sweetness isnt everything', 'just be you'],
                dysregulationTendencies: {
                    'fawn': 0.5,
                    'anxiety': 0.3,
                    'freeze': 0.2
                },
                resilience: 2,
                trustGainRate: 1.3,
                trustLossRate: 1.5,
                backstory: "Marla pours maple sweetness over every interaction, hoping if she's sweet enough, helpful enough, good enough, they'll stay. But sweetness becomes sticky. It's exhausting being everyone's favorite if it means losing yourself.",
                memories: {
                    positive: ['Loved for being myself', 'Someone saw past the maple'],
                    negative: ['Never sweet enough', 'Smile until it hurts']
                },
                dialogueStyle: 'people_pleaser',
                specialTraits: ['fawn_response', 'emotional_exhaustion']
            }
        },
        
        {
            id: 'twisted_tim',
            name: 'Twisted Tim',
            position: { row: 1, col: 2 },
            personality: {
                coreWound: 'Twisted by trying to be everything to everyone',
                triggers: ['pick a side', 'make up your mind', 'stop changing'],
                comfortResponses: ['complexity is okay', 'all parts welcome', 'no need to choose'],
                dysregulationTendencies: {
                    'anxiety': 0.3,
                    'freeze': 0.3,
                    'fawn': 0.2,
                    'flight': 0.2
                },
                resilience: 3,
                trustGainRate: 1.0,
                trustLossRate: 1.3,
                backstory: "Tim twisted himself into knots trying to please everyone. Chocolate for some, vanilla for others, both for the undecided. Now he doesn't know which shape is really his. The twists have become who he is.",
                memories: {
                    positive: ['Accepted in all my twists', 'Someone liked my complexity'],
                    negative: ['Pulled in all directions', 'Lost my original shape']
                },
                dialogueStyle: 'confused_adapter',
                specialTraits: ['identity_crisis', 'shapeshifter']
            }
        },
        
        {
            id: 'old_fashioned_olivia',
            name: 'Old Fashioned Olivia',
            position: { row: 1, col: 4 },
            personality: {
                coreWound: 'Fears being outdated and left behind',
                triggers: ['old fashioned', 'outdated', 'times have changed'],
                comfortResponses: ['classic never goes out of style', 'wisdom in tradition', 'valued'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'anxiety': 0.3,
                    'freeze': 0.3
                },
                resilience: 4, // Survived longer
                trustGainRate: 0.9,
                trustLossRate: 1.0,
                backstory: "Olivia remembers when simple was enough. When plain cake donuts were treasured. Now everyone wants glazes, fillings, toppings. She fears her simplicity makes her forgettable. That traditional means throwaway.",
                memories: {
                    positive: ['Someone chose me over fancy options', 'Appreciated for simplicity'],
                    negative: ['Passed over for newer models', 'Maybe I am too plain']
                },
                dialogueStyle: 'nostalgic_worried',
                specialTraits: ['fear_of_obsolescence', 'traditional_values']
            }
        },
        
        {
            id: 'hole_henry',
            name: 'Henry the Hole',
            position: { row: 1, col: 6 },
            personality: {
                coreWound: 'Defined by what\'s missing rather than what\'s there',
                triggers: ['empty inside', 'something missing', 'incomplete'],
                comfortResponses: ['wholeness includes spaces', 'nothing missing', 'complete as you are'],
                dysregulationTendencies: {
                    'shutdown': 0.5,
                    'freeze': 0.3,
                    'anxiety': 0.2
                },
                resilience: 3,
                trustGainRate: 0.7,
                trustLossRate: 2.0,
                backstory: "Henry is the hole in the center - the part that was removed. Others see emptiness where he sees identity. 'You're not a whole donut,' they say. But Henry knows that spaces have their own completeness.",
                memories: {
                    positive: ['Someone saw me as whole', 'My space held something beautiful'],
                    negative: ['Just the missing piece', 'Defined by absence']
                },
                dialogueStyle: 'existential_void',
                specialTraits: ['emptiness_philosophy', 'zen_acceptance']
            }
        },
        
        {
            id: 'day_old_dana',
            name: 'Day-Old Dana',
            position: { row: 2, col: 1 },
            personality: {
                coreWound: 'Believes her value decreases with time',
                triggers: ['past prime', 'day old', 'discount'],
                comfortResponses: ['value doesnt expire', 'worth isnt freshness', 'still precious'],
                dysregulationTendencies: {
                    'anxiety': 0.4,
                    'shutdown': 0.3,
                    'freeze': 0.2,
                    'flight': 0.1
                },
                resilience: 2,
                trustGainRate: 1.1,
                trustLossRate: 1.8,
                backstory: "Dana watched the clock tick past midnight, transforming from 'fresh' to 'day-old.' The discount sticker felt like a scarlet letter. She learned that value has an expiration date, that worth diminishes with time.",
                memories: {
                    positive: ['Chosen despite the discount', 'Someone said I was perfect'],
                    negative: ['The sticker placement', 'Half-price heartbreak']
                },
                dialogueStyle: 'deprecating_hope',
                specialTraits: ['value_anxiety', 'time_sensitive']
            }
        },
        
        {
            id: 'powder_pete',
            name: 'Powdered Pete',
            position: { row: 2, col: 3 },
            personality: {
                coreWound: 'Leaves a mess everywhere, afraid of being too much',
                triggers: ['messy', 'too much', 'tone it down'],
                comfortResponses: ['messiness is aliveness', 'you add flavor', 'worth the cleanup'],
                dysregulationTendencies: {
                    'anxiety': 0.3,
                    'fawn': 0.3,
                    'flight': 0.2,
                    'shutdown': 0.2
                },
                resilience: 3,
                trustGainRate: 1.2,
                trustLossRate: 1.4,
                backstory: "Pete can't help leaving powder everywhere. Every interaction leaves traces. He's been told he's 'too much,' that he should contain himself. But how do you contain what makes you who you are?",
                memories: {
                    positive: ['Someone liked my enthusiasm', 'Mess was worth it'],
                    negative: ['Clean up after yourself', 'Too much, always too much']
                },
                dialogueStyle: 'enthusiastic_apologetic',
                specialTraits: ['messy_authentic', 'containment_issues']
            }
        },
        
        {
            id: 'cruller_claire',
            name: 'Cruller Claire',
            position: { row: 2, col: 5 },
            personality: {
                coreWound: 'Delicate structure makes her fear being broken',
                triggers: ['fragile', 'handle with care', 'might break'],
                comfortResponses: ['gentle and strong', 'resilient beauty', 'wont break you'],
                dysregulationTendencies: {
                    'freeze': 0.4,
                    'anxiety': 0.3,
                    'shutdown': 0.2,
                    'flight': 0.1
                },
                resilience: 2, // Physically fragile
                trustGainRate: 0.8,
                trustLossRate: 2.5, // Breaks easily
                backstory: "Claire's delicate ridges and airy structure make everyone nervous. 'Careful!' they say, handling her like spun glass. She's internalized this fragility, moving through life afraid that any wrong move will shatter her completely.",
                memories: {
                    positive: ['Held firmly but gently', 'Survived a fall'],
                    negative: ['Watching others crumble', 'One wrong move']
                },
                dialogueStyle: 'delicate_brave',
                specialTraits: ['fragility_complex', 'surprising_strength']
            }
        },
        
        {
            id: 'bear_claw_bernard',
            name: 'Bear Claw Bernard',
            position: { row: 2, col: 7 },
            personality: {
                coreWound: 'His fierce appearance hides a gentle heart',
                triggers: ['scary', 'intimidating', 'too intense'],
                comfortResponses: ['see past the claws', 'gentle giant', 'appearance isnt truth'],
                dysregulationTendencies: {
                    'shutdown': 0.4,
                    'freeze': 0.3,
                    'anxiety': 0.2,
                    'fight': 0.1 // Rarely fights despite appearance
                },
                resilience: 5, // Strong exterior
                trustGainRate: 0.6, // People fear him
                trustLossRate: 1.0,
                backstory: "Bernard's bear claw shape makes everyone assume he's aggressive. But inside, he's the gentlest soul in the case. He's learned to shrink himself, to move slowly, to never show his strength lest someone mistake it for threat.",
                memories: {
                    positive: ['Someone saw my gentleness', 'Trusted with something fragile'],
                    negative: ['Children running away', 'Always the villain']
                },
                dialogueStyle: 'gentle_giant',
                specialTraits: ['misunderstood_appearance', 'hidden_softness']
            }
        }
    ],
    
    // Team-wide emotional dynamics
    groupDynamics: {
        supportNetwork: {
            'sprinkles-glazed_gary': 'anxiety_buddies',
            'boston_betty-jelly_james': 'trust_issues_union',
            'maple_marla-twisted_tim': 'people_pleaser_support',
            'cruller_claire-bear_claw_bernard': 'appearance_alliance'
        },
        
        conflictPairs: {
            'day_old_dana-old_fashioned_olivia': 'freshness_dispute',
            'powder_pete-cruller_claire': 'mess_vs_order',
            'hole_henry-jelly_james': 'emptiness_philosophy'
        },
        
        groupTriggers: [
            {
                trigger: 'closing_time',
                effect: 'collective_abandonment_panic',
                description: 'The display case lights dimming triggers everyone'
            },
            {
                trigger: 'new_batch_arrival',
                effect: 'replacement_anxiety',
                description: 'Fresh donuts make them fear being discarded'
            }
        ]
    },
    
    // Special team abilities
    teamAbilities: [
        {
            name: 'Comfort Food Coalition',
            requirement: 'avgTrust >= 5',
            effect: 'Adjacent pieces share emotional regulation',
            description: 'When one finds peace, others feel it too'
        },
        {
            name: 'Abandonment Alert',
            requirement: 'piece.trust <= -2',
            effect: 'All pieces gain anxiety when one is close to leaving',
            description: 'They sense when someone might run'
        },
        {
            name: 'Found Family',
            requirement: 'allPiecesTrust >= 7',
            effect: 'Emotional damage reduced by 50%',
            description: 'Together, they are home'
        }
    ],
    
    // Dialogue banks
    teamDialogue: {
        victory: [
            "We... we did it? Together?",
            "No one left. No one ran. We stayed.",
            "Maybe we don't need a baker. We have each other."
        ],
        defeat: [
            "I knew it. Everyone leaves eventually.",
            "We're just day-old discounts in the end.",
            "Should have known better than to hope."
        ],
        encouragement: [
            "Remember, we're sweeter together!",
            "Don't leave me... please?",
            "If we can survive the display case, we can survive this."
        ]
    }
};