/**
 * @file demons.js
 * Defines the data for the "Demons" team.
 * Theme: Exiled after the Hellpact Accord, some want to stand trial and be forgiven, while others embrace their monstrous role.
 */

export const demons = {
    id: 'demons',
    name: 'The Demons',
    description: "Exiled and tagged with aura-tracking runes, they fight in Chesstropia to either burn out in a blaze of infamy or be born again through forgiveness.",
    motivation: "Motive Decay",
    members: [
        // --- ROYALTY (Gender roles swapped from convention) ---
        {
            name: 'The Icon of Sin',
            role: 'King',
            icon: '🐐 ♔',
            personality: 'Avoidant Protector',
            description: "An ancient, powerful demon who has seen empires turn to dust. She believes redemption is a lie and that embracing her fearsome nature is the only way to protect her kind.",
            portrait: 'assets/portraits/demons/king_icon.png'
        },
        {
            name: 'Malacoda, the Archdemon',
            role: 'Queen',
            icon: '🔥 ♕',
            personality: 'Volatile Reactor',
            description: "A charismatic and powerful leader whose motives have decayed from rebellion to simple cruelty. His charm is a weapon, and his anger is a wildfire.",
            portrait: 'assets/portraits/demons/queen_malacoda.png'
        },
        // --- ROOKS ---
        {
            name: 'Oni, the Brute',
            role: 'Rook',
            icon: '👹 ♖',
            personality: 'Volatile Reactor',
            description: "A hulking demon of pure rage and strength. He was once a guardian, but now only remembers the fight, not the reason.",
            portrait: 'assets/portraits/demons/rook_oni.png'
        },
        {
            name: 'The Djinn of the Lamp',
            role: 'Rook',
            icon: '🧞 ♖',
            personality: 'Traumatized Freezer',
            description: "A being of cosmic power trapped by a technicality. He is a steadfast defender but freezes when given a direct order, fearing another trick.",
            portrait: 'assets/portraits/demons/rook_djinn.png'
        },
        // --- BISHOPS ---
        {
            name: 'Barghest, the Devildog',
            role: 'Bishop',
            icon: '🐕 ♗',
            personality: 'Anxious Attacher',
            description: "A monstrous black dog that foretells doom. It clings to the heels of stronger demons, terrified of being left alone with its grim visions.",
            portrait: 'assets/portraits/demons/bishop_barghest.png'
        },
        {
            name: 'The Imp',
            role: 'Bishop',
            icon: '😈 ♗',
            personality: 'People Pleaser',
            description: "A small, mischievous demon who desperately wants to be taken seriously. It will perform any dark bidding for a scrap of validation.",
            portrait: 'assets/portraits/demons/bishop_imp.png'
        },
        // --- KNIGHTS ---
        {
            name: 'The Nightmare Steed',
            role: 'Knight',
            icon: '🐴 ♘',
            personality: 'Traumatized Freezer',
            description: "A horse made of shadow and fear. It gallops through the dreams of others but is terrified of the light of day.",
            portrait: 'assets/portraits/demons/knight_nightmare.png'
        },
        {
            name: 'The Succubus',
            role: 'Knight',
            icon: '💋 ♘',
            personality: 'Avoidant Protector',
            description: "She feeds on connection but has forgotten how to form it. She uses allure as a shield to keep anyone from seeing her own deep-seated loneliness.",
            portrait: 'assets/portraits/demons/knight_succubus.png'
        },
        // --- PAWNS (The Legion) ---
        {
            name: 'A Spined Devil',
            role: 'Pawn',
            icon: '🌵 ♙',
            personality: 'Avoidant Protector',
            description: "Its body is covered in sharp spines to ward off any physical or emotional contact.",
            portrait: 'assets/portraits/demons/pawn_spined.png'
        },
        {
            name: 'A Bearded Devil',
            role: 'Pawn',
            icon: '🧔 ♙',
            personality: 'Volatile Reactor',
            description: "Its beard is a mass of writhing tendrils that lash out at the slightest provocation.",
            portrait: 'assets/portraits/demons/pawn_bearded.png'
        },
        {
            name: 'A Lemure',
            role: 'Pawn',
            icon: '👻 ♙',
            personality: 'Traumatized Freezer',
            description: "A mindless, tormented soul. It moves forward slowly, a blob of molten misery that freezes when damaged.",
            portrait: 'assets/portraits/demons/pawn_lemure.png'
        },
        {
            name: 'A Nupperibo',
            role: 'Pawn',
            icon: '👂 ♙',
            personality: 'Anxious Attacher',
            description: "A bloated, deaf, and blind devil that can only sense movement. It desperately follows the footsteps of other demons.",
            portrait: 'assets/portraits/demons/pawn_nupperibo.png'
        },
        {
            name: 'A Dretch',
            role: 'Pawn',
            icon: '🤢 ♙',
            personality: 'People Pleaser',
            description: "A weak and pathetic demon that grovels for favor, hoping its pathetic nature will spare it from destruction.",
            portrait: 'assets/portraits/demons/pawn_dretch.png'
        },
        {
            name: 'A Manes',
            role: 'Pawn',
            icon: '💀 ♙',
            personality: 'Volatile Reactor',
            description: "The lowest form of demon, it has nothing to lose and everything to prove. It swarms forward with reckless, angry abandon.",
            portrait: 'assets/portraits/demons/pawn_manes.png'
        },
        {
            name: 'An Accuser',
            role: 'Pawn',
            icon: '🗣️ ♙',
            personality: 'Anxious Attacher',
            description: "A tiny devil that whispers sins and doubts. It clings to others, pointing out their flaws to distract from its own.",
            portrait: 'assets/portraits/demons/pawn_accuser.png'
        },
        {
            name: 'A Forgiven',
            role: 'Pawn',
            icon: '✨ ♙',
            personality: 'People Pleaser',
            description: "A rare demon who was shown mercy once. It now fights desperately to prove that the act of kindness was not a mistake.",
            portrait: 'assets/portraits/demons/pawn_forgiven.png'
        }
    ]
};
