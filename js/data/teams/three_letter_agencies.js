/**
 * @file three_letter_agencies.js
 * Defines the data for the "Three-Letter Agency" team.
 * Theme: Elite agents created to believe they were unique, now discovering the motivational lie behind their existence.
 */

export const three_letter_agencies = {
    id: 'three_letter_agencies',
    name: 'The Agencies',
    description: "Each was created to believe they were a lone, elite agent. Now they've met their counterparts and fight to uncover the author of their story.",
    motivation: "Motivational Lie",
    members: [
        // --- ROYALTY ---
        {
            name: 'Control (DoD)',
            role: 'King',
            icon: '🏛️ ♔',
            personality: 'Avoidant Protector',
            description: "The strategic mastermind who sees the entire board as a theater of operations. He protects his assets by keeping them in the dark.",
            portrait: 'assets/portraits/agencies/king_control.png'
        },
        {
            name: 'The Director (CIA)',
            role: 'Queen',
            icon: '👁️ ♕',
            personality: 'Volatile Reactor',
            description: "A master of influence and covert operations. She moves with deadly grace but reacts with extreme prejudice to any unforeseen variables.",
            portrait: 'assets/portraits/agencies/queen_director.png'
        },
        // --- ROOKS ---
        {
            name: 'Station Chief (MI6)',
            role: 'Rook',
            icon: '🇬� ♖',
            personality: 'Avoidant Protector',
            description: "A veteran of the Cold War, weathered and cynical. He defends his sector with stoic resolve and trusts no one, especially not allies.",
            portrait: 'assets/portraits/agencies/rook_mi6.png'
        },
        {
            name: 'The Kidon (Mossad)',
            role: 'Rook',
            icon: '🇮🇱 ♖',
            personality: 'Volatile Reactor',
            description: "An elite assassin. She is a fortress of deadly skill, but her loyalty is absolute and she will eliminate any perceived threat without hesitation.",
            portrait: 'assets/portraits/agencies/rook_mossad.png'
        },
        // --- BISHOPS ---
        {
            name: 'The Eavesdropper (NSA)',
            role: 'Bishop',
            icon: '📡 ♗',
            personality: 'Anxious Attacher',
            description: "Hears all the signals and intercepts all the messages. It knows too much and is terrified of misinterpreting a crucial piece of data.",
            portrait: 'assets/portraits/agencies/bishop_nsa.png'
        },
        {
            name: 'The Analyst (GCHQ)',
            role: 'Bishop',
            icon: '📈 ♗',
            personality: 'Traumatized Freezer',
            description: "Stares at patterns and code until the world dissolves into data. When faced with a real-world emotional crisis, it freezes, unable to compute.",
            portrait: 'assets/portraits/agencies/bishop_gchq.png'
        },
        // --- KNIGHTS ---
        {
            name: 'The Agent (FBI)',
            role: 'Knight',
            icon: '🇺🇸 ♘',
            personality: 'People Pleaser',
            description: "A by-the-book investigator who wants to do the right thing. He moves in unexpected ways to uncover the truth, hoping to restore order.",
            portrait: 'assets/portraits/agencies/knight_fbi.png'
        },
        {
            name: 'The Operative (FSB)',
            role: 'Knight',
            icon: '🇷🇺 ♘',
            personality: 'Traumatized Freezer',
            description: "A master of counter-intelligence from a system of deep paranoia. He trusts no one and will often refuse to move, suspecting a trap.",
            portrait: 'assets/portraits/agencies/knight_fsb.png'
        },
        // --- PAWNS (The Assets) ---
        {
            name: 'The Handler',
            role: 'Pawn',
            icon: '👤 ♙',
            personality: 'People Pleaser',
            description: "Their job is to keep their assets happy and productive. They will sacrifice themselves to protect their assigned piece.",
            portrait: 'assets/portraits/agencies/pawn_handler.png'
        },
        {
            name: 'The Asset',
            role: 'Pawn',
            icon: '👤 ♙',
            personality: 'Anxious Attacher',
            description: "A civilian turned spy. They are terrified of being disavowed and desperately seek their handler's approval.",
            portrait: 'assets/portraits/agencies/pawn_asset.png'
        },
        {
            name: 'The Mole',
            role: 'Pawn',
            icon: '👤 ♙',
            personality: 'Avoidant Protector',
            description: "A deep-cover agent who has forgotten which side they're on. They push forward silently, trusting no one.",
            portrait: 'assets/portraits/agencies/pawn_mole.png'
        },
        {
            name: 'The Cleaner',
            role: 'Pawn',
            icon: '👤 ♙',
            personality: 'Traumatized Freezer',
            description: "They've seen too many messy operations. When things get bloody, they freeze, haunted by what they've had to erase.",
            portrait: 'assets/portraits/agencies/pawn_cleaner.png'
        },
        {
            name: 'The Watcher',
            role: 'Pawn',
            icon: '👤 ♙',
            personality: 'Avoidant Protector',
            description: "A surveillance expert. They know everything about the other pieces but have never had a real conversation.",
            portrait: 'assets/portraits/agencies/pawn_watcher.png'
        },
        {
            name: 'The Courier',
            role: 'Pawn',
            icon: '👤 ♙',
            personality: 'Anxious Attacher',
            description: "Carries a message of vital importance. The weight of the information makes them a nervous wreck.",
            portrait: 'assets/portraits/agencies/pawn_courier.png'
        },
        {
            name: 'The Ghost',
            role: 'Pawn',
            icon: '👤 ♙',
            personality: 'Traumatized Freezer',
            description: "An agent who was officially declared dead. They barely feel real and often don't move, unsure if they still exist.",
            portrait: 'assets/portraits/agencies/pawn_ghost.png'
        },
        {
            name: 'The Double Agent',
            role: 'Pawn',
            icon: '👤 ♙',
            personality: 'Volatile Reactor',
            description: "Playing both sides has shattered their nerves. They are prone to sudden, unpredictable moves and emotional outbursts.",
            portrait: 'assets/portraits/agencies/pawn_double.png'
        }
    ]
};
