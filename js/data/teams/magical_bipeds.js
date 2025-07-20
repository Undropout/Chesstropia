/**
 * @file magical_bipeds.js
 * Defines the data for the "Magical Bipeds" team.
 * Theme: Descended from mythic bloodlines, they fight to resist the patterns they were bred to repeat.
 */

export const magical_bipeds = {
    id: 'magical_bipeds',
    name: 'The Magical Bipeds',
    description: "Descended from mythic bloodlines cursed to relive their ancestors' mistakes, they've come to write a new story.",
    motivation: "Oppose What You Suffered",
    members: [
        // --- ROYALTY (Gender roles swapped from convention) ---
        {
            name: 'Lord Alucard',
            role: 'King', // The Vampire
            icon: '🧛 ♔',
            personality: 'Avoidant Protector',
            description: "A vampire who starves himself of his nature. He keeps his distance, fearing the monstrous hunger his lineage passed down to him.",
            portrait: 'assets/portraits/magical_bipeds/king_alucard.png'
        },
        {
            name: 'Queen Chimera',
            role: 'Queen', // The Hybrid
            icon: '🧬 ♕',
            personality: 'Volatile Reactor',
            description: "A hybrid of many beings, she is a whirlwind of conflicting instincts and emotions. Her power is immense, but her identity is a constant battle.",
            portrait: 'assets/portraits/magical_bipeds/queen_chimera.png'
        },
        // --- ROOKS ---
        {
            name: 'Lycaon the Tamed',
            role: 'Rook',
            icon: '🐺 ♖',
            personality: 'Volatile Reactor',
            description: "A werewolf who fights his lunar rage with iron chains of will. He is a steadfast defender, but the beast within is always close to the surface.",
            portrait: 'assets/portraits/magical_bipeds/rook_lycaon.png'
        },
        {
            name: 'Celaeno the Grounded',
            role: 'Rook',
            icon: '🦅 ♖',
            personality: 'Traumatized Freezer',
            description: "A harpy who has clipped her own wings to resist the urge to snatch and steal. She is earthbound and bitter, freezing when she remembers the sky.",
            portrait: 'assets/portraits/magical_bipeds/rook_celaeno.png'
        },
        // --- BISHOPS ---
        {
            name: 'Asterion the Gentle',
            role: 'Bishop',
            icon: '🐃 ♗',
            personality: 'Avoidant Protector',
            description: "A minotaur who has escaped his labyrinth. He moves in strange, diagonal paths, forever trying to avoid the straight lines of his former prison.",
            portrait: 'assets/portraits/magical_bipeds/bishop_asterion.png'
        },
        {
            name: 'Silenus the Sober',
            role: 'Bishop',
            icon: '🐐 ♗',
            personality: 'People Pleaser',
            description: "A faun who has sworn off revelry. He tries to be a voice of calm and reason, desperately hoping to be seen as more than a creature of chaos.",
            portrait: 'assets/portraits/magical_bipeds/bishop_silenus.png'
        },
        // --- KNIGHTS ---
        {
            name: 'The Dullahan',
            role: 'Knight',
            icon: '� ♘',
            personality: 'Traumatized Freezer',
            description: "A headless horseman who has lost his purpose. He gallops with terrifying speed but often stops, forgetting what name he is supposed to call.",
            portrait: 'assets/portraits/magical_bipeds/knight_dullahan.png'
        },
        {
            name: 'The Banshee',
            role: 'Knight',
            icon: '👻 ♘',
            personality: 'Anxious Attacher',
            description: "Her wail is a warning of a fate she wants to prevent. She flits across the board, trying to shield those she has foreseen will fall.",
            portrait: 'assets/portraits/magical_bipeds/knight_banshee.png'
        },
        // --- PAWNS (The Changed) ---
        {
            name: 'A Gorgon Who Averts Her Gaze',
            role: 'Pawn',
            icon: '🐍 ♙',
            personality: 'Traumatized Freezer',
            description: "She wears a blindfold, terrified of her own power to harm. She will only move when guided, trusting others to see for her.",
            portrait: 'assets/portraits/magical_bipeds/pawn_gorgon.png'
        },
        {
            name: 'A Siren Who Sings Lullabies',
            role: 'Pawn',
            icon: '🎶 ♙',
            personality: 'People Pleaser',
            description: "She uses her enchanting voice not to lure sailors to their doom, but to soothe the anxieties of her teammates.",
            portrait: 'assets/portraits/magical_bipeds/pawn_siren.png'
        },
        {
            name: 'A Satyr Who Tends Gardens',
            role: 'Pawn',
            icon: '🌱 ♙',
            personality: 'Anxious Attacher',
            description: "He has abandoned wild parties for quiet cultivation. He worries constantly that his wild nature will ruin his delicate work.",
            portrait: 'assets/portraits/magical_bipeds/pawn_satyr.png'
        },
        {
            name: 'A Ghoul Who Shares His Food',
            role: 'Pawn',
            icon: '🍖 ♙',
            personality: 'People Pleaser',
            description: "Resisting his ghoulish appetite, he offers his own strange provisions to others, desperate to be seen as a provider, not a scavenger.",
            portrait: 'assets/portraits/magical_bipeds/pawn_ghoul.png'
        },
        {
            name: 'A Doppelgänger Seeking Identity',
            role: 'Pawn',
            icon: '❓ ♙',
            personality: 'Anxious Attacher',
            description: "A shapeshifter who has forgotten its original form. It mimics the movements of other pieces, hoping to find a role it can call its own.",
            portrait: 'assets/portraits/magical_bipeds/pawn_doppelganger.png'
        },
        {
            name: 'A Kitsune with One Tail',
            role: 'Pawn',
            icon: '🦊 ♙',
            personality: 'Avoidant Protector',
            description: "A young fox spirit who has sworn off trickery. It is wise but deeply mistrustful of others' intentions.",
            portrait: 'assets/portraits/magical_bipeds/pawn_kitsune.png'
        },
        {
            name: 'A Gargoyle Who Left His Perch',
            role: 'Pawn',
            icon: '🗿 ♙',
            personality: 'Traumatized Freezer',
            description: "A stone guardian who abandoned his post. He is a powerful protector but will freeze for turns on end, consumed by guilt.",
            portrait: 'assets/portraits/magical_bipeds/pawn_gargoyle.png'
        },
        {
            name: 'An Imp Who Follows Rules',
            role: 'Pawn',
            icon: '😈 ♙',
            personality: 'Volatile Reactor',
            description: "A creature of chaos trying to live with order. It follows instructions to the letter, but throws a tantrum if the rules seem unfair.",
            portrait: 'assets/portraits/magical_bipeds/pawn_imp.png'
        }
    ]
};
