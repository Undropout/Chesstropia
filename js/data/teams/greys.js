/**
 * @file greys.js
 * Defines the data for the "Greys" team.
 * Theme: Aliens who believed they were preserving life, only to realize their mission became a nightmare of abduction.
 */

export const greys = {
    id: 'greys',
    name: 'The Greys',
    description: "They believed they were a chosen ark, preserving life. But somewhere along the way, preservation turned into abduction. Now they question their mission.",
    motivation: "Tragic Dream",
    members: [
        // --- ROYALTY (Gender roles swapped from convention) ---
        {
            name: 'The Alpha Specimen',
            role: 'King',
            icon: '👽 ♔',
            personality: 'Traumatized Freezer',
            description: "The first being they 'preserved.' It is a silent, unknowable entity whose trauma is so immense it has become a point of absolute stillness on the board.",
            portrait: 'assets/portraits/greys/king_alpha.png'
        },
        {
            name: 'The Beta Surveyor',
            role: 'Queen',
            icon: '� ♕',
            personality: 'Anxious Attacher',
            description: "The lead scout and archivist. She is wracked with guilt over the specimens she has collected and desperately seeks validation that the mission was just.",
            portrait: 'assets/portraits/greys/queen_beta.png'
        },
        // --- ROOKS ---
        {
            name: 'Gamma, the Archivist',
            role: 'Rook',
            icon: '📚 ♖',
            personality: 'Avoidant Protector',
            description: "It guards the vast library of genetic data and cultural memories. It believes the data is more important than the feelings of the individuals it came from.",
            portrait: 'assets/portraits/greys/rook_gamma.png'
        },
        {
            name: 'Delta, the Enforcer',
            role: 'Rook',
            icon: '🛡️ ♖',
            personality: 'Volatile Reactor',
            description: "Tasked with specimen retrieval. It has become hardened and aggressive, seeing any resistance as a threat to the Great Dream.",
            portrait: 'assets/portraits/greys/rook_delta.png'
        },
        // --- BISHOPS ---
        {
            name: 'Zeta, the Observer',
            role: 'Bishop',
            icon: '👁️ ♗',
            personality: 'Traumatized Freezer',
            description: "It has watched countless abductions. The silent terror of the subjects has rendered it mute and hesitant to act.",
            portrait: 'assets/portraits/greys/bishop_zeta.png'
        },
        {
            name: 'Omega, the Finalizer',
            role: 'Bishop',
            icon: '🌀 ♗',
            personality: 'People Pleaser',
            description: "Its job is to pacify and prepare specimens for stasis. It uses calming psychic waves, desperate to make the process as painless as possible.",
            portrait: 'assets/portraits/greys/bishop_omega.png'
        },
        // --- KNIGHTS ---
        {
            name: 'The Scout Ship',
            role: 'Knight',
            icon: '🛸 ♘',
            personality: 'Anxious Attacher',
            description: "A small, fast vessel that flits across the board. It is terrified of being too far from the mothership's guidance.",
            portrait: 'assets/portraits/greys/knight_scout.png'
        },
        {
            name: 'The Probe',
            role: 'Knight',
            icon: '📡 ♘',
            personality: 'Avoidant Protector',
            description: "A tool for gathering information from a distance. It keeps its subjects at arm's length, believing emotional connection contaminates the data.",
            portrait: 'assets/portraits/greys/knight_probe.png'
        },
        // --- PAWNS (The Abductees) ---
        {
            name: 'A Lost Farmer',
            role: 'Pawn',
            icon: '👨‍🌾 ♙',
            personality: 'Traumatized Freezer',
            description: "Remembers a field of corn and a beam of light. Now he just stands still, staring at the strange sky.",
            portrait: 'assets/portraits/greys/pawn_farmer.png'
        },
        {
            name: 'A Confused Cow',
            role: 'Pawn',
            icon: '🐄 ♙',
            personality: 'Anxious Attacher',
            description: "Separated from its herd, it is terrified and desperately seeks the comfort of being near another piece.",
            portrait: 'assets/portraits/greys/pawn_cow.png'
        },
        {
            name: 'A Forgotten Astronaut',
            role: 'Pawn',
            icon: '👨‍🚀 ♙',
            personality: 'Avoidant Protector',
            description: "He thought he was exploring space, but now he's just a specimen. He retreats into his training, showing no emotion.",
            portrait: 'assets/portraits/greys/pawn_astronaut.png'
        },
        {
            name: 'A Frightened Child',
            role: 'Pawn',
            icon: '👧 ♙',
            personality: 'Traumatized Freezer',
            description: "She was taken from her bedroom window. She freezes when she sees a bright light, clutching a teddy bear that isn't there.",
            portrait: 'assets/portraits/greys/pawn_child.png'
        },
        {
            name: 'A Skeptical Scientist',
            role: 'Pawn',
            icon: '👩‍🔬 ♙',
            personality: 'Volatile Reactor',
            description: "She refuses to believe what's happening. She pushes forward, angrily trying to disprove the existence of her own abduction.",
            portrait: 'assets/portraits/greys/pawn_scientist.png'
        },
        {
            name: 'A Conspiracy Theorist',
            role: 'Pawn',
            icon: '🤪 ♙',
            personality: 'People Pleaser',
            description: "He knew this would happen! He's desperately trying to explain it all to the other pawns, hoping to finally be believed.",
            portrait: 'assets/portraits/greys/pawn_theorist.png'
        },
        {
            name: 'A Memory of Home',
            role: 'Pawn',
            icon: '🏡 ♙',
            personality: 'Anxious Attacher',
            description: "A psychic echo of a place that no longer exists for these pieces. It flickers with sadness and clings to any piece that shows kindness.",
            portrait: 'assets/portraits/greys/pawn_memory.png'
        },
        {
            name: 'A Data Fragment',
            role: 'Pawn',
            icon: '💾 ♙',
            personality: 'Avoidant Protector',
            description: "The piece of the mission log that could change everything. It's corrupted and silent, holding its secret close.",
            portrait: 'assets/portraits/greys/pawn_fragment.png'
        }
    ]
};
