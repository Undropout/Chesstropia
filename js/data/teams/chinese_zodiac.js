/**
 * @file chinese_zodiac.js
 * Defines the data for the "Chinese Zodiac" team.
 * Theme: Contestants in a new version of the Great Race, promised a utopia that may not be real.
 */

export const chinese_zodiac = {
    id: 'chinese_zodiac',
    name: 'The Chinese Zodiac',
    description: "They ran the first race for honor. This one's for everything. But some are beginning to suspect the prize was never real.",
    motivation: "Utopia Justifies the Means",
    members: [
        // --- ROYALTY (Gender roles swapped from convention) ---
        {
            name: 'The Steadfast Ox',
            role: 'King',
            icon: '🐂 ♔',
            personality: 'Avoidant Protector',
            description: "Diligent and powerful, she believes that slow, steady, and honorable progress is the only path to victory. She carries others' burdens without complaint.",
            portrait: 'assets/portraits/chinese_zodiac/king_ox.png'
        },
        {
            name: 'The Cunning Rat',
            role: 'Queen',
            icon: '🐀 ♕',
            personality: 'Volatile Reactor',
            description: "Quick-witted and opportunistic. He believes the ends justify the means and will use any trick to get ahead, yet is fiercely protective of his position.",
            portrait: 'assets/portraits/chinese_zodiac/queen_rat.png'
        },
        // --- ROOKS ---
        {
            name: 'The Fierce Tiger',
            role: 'Rook',
            icon: '🐅 ♖',
            personality: 'Volatile Reactor',
            description: "A powerful and solitary competitor. He is prone to fits of rage when his authority or strength is challenged.",
            portrait: 'assets/portraits/chinese_zodiac/rook_tiger.png'
        },
        {
            name: 'The Gentle Rabbit',
            role: 'Rook',
            icon: '🐇 ♖',
            personality: 'Traumatized Freezer',
            description: "Kind and sensitive, she is haunted by the memory of nearly drowning in the first race. She freezes when faced with overwhelming obstacles.",
            portrait: 'assets/portraits/chinese_zodiac/rook_rabbit.png'
        },
        // --- BISHOPS ---
        {
            name: 'The Imperial Dragon',
            role: 'Bishop',
            icon: '🐉 ♗',
            personality: 'Avoidant Protector',
            description: "A being of immense power and luck who sees the grand picture. He moves with celestial grace but remains aloof from the petty squabbles of the race.",
            portrait: 'assets/portraits/chinese_zodiac/bishop_dragon.png'
        },
        {
            name: 'The Enigmatic Snake',
            role: 'Bishop',
            icon: '🐍 ♗',
            personality: 'Anxious Attacher',
            description: "Wise and mysterious, she prefers to hide in the grass and observe. She is terrified of being exposed and vulnerable.",
            portrait: 'assets/portraits/chinese_zodiac/bishop_snake.png'
        },
        // --- KNIGHTS ---
        {
            name: 'The Spirited Horse',
            role: 'Knight',
            icon: '🐎 ♘',
            personality: 'Volatile Reactor',
            description: "Loves freedom and the thrill of the race. It gallops with wild energy but is easily spooked and prone to changing direction without warning.",
            portrait: 'assets/portraits/chinese_zodiac/knight_horse.png'
        },
        {
            name: 'The Peaceful Sheep',
            role: 'Knight',
            icon: '🐏 ♘',
            personality: 'People Pleaser',
            description: "A gentle soul who dislikes conflict. It will often yield its position or follow another's lead simply to maintain harmony.",
            portrait: 'assets/portraits/chinese_zodiac/knight_sheep.png'
        },
        // --- PAWNS (The Competitors) ---
        {
            name: 'The Clever Monkey',
            role: 'Pawn',
            icon: '🐒 ♙',
            personality: 'Volatile Reactor',
            description: "A brilliant but mischievous strategist. It gets frustrated and throws tantrums when its clever plans go awry.",
            portrait: 'assets/portraits/chinese_zodiac/pawn_monkey.png'
        },
        {
            name: 'The Proud Rooster',
            role: 'Pawn',
            icon: '🐓 ♙',
            personality: 'Anxious Attacher',
            description: "Punctual and proud, it needs to be seen as the one who is most prepared and organized. It crows loudly for attention.",
            portrait: 'assets/portraits/chinese_zodiac/pawn_rooster.png'
        },
        {
            name: 'The Loyal Dog',
            role: 'Pawn',
            icon: '🐕 ♙',
            personality: 'People Pleaser',
            description: "Honest and trustworthy, but easily distracted from the race by its desire to help others in need.",
            portrait: 'assets/portraits/chinese_zodiac/pawn_dog.png'
        },
        {
            name: 'The Naive Pig',
            role: 'Pawn',
            icon: '🐖 ♙',
            personality: 'Traumatized Freezer',
            description: "Good-natured and trusting to a fault. It often stops to enjoy the journey, forgetting the race, and freezes when it realizes how far behind it is.",
            portrait: 'assets/portraits/chinese_zodiac/pawn_pig.png'
        },
        {
            name: 'The Betrayed Cat',
            role: 'Pawn',
            icon: '🐈 ♙',
            personality: 'Avoidant Protector',
            description: "The thirteenth animal, tricked by the Rat and left out of the Zodiac. It runs the race with a bitter heart, trusting no one.",
            portrait: 'assets/portraits/chinese_zodiac/pawn_cat.png'
        },
        {
            name: 'The Jade Emperor',
            role: 'Pawn',
            icon: '👑 ♙',
            personality: 'Avoidant Protector',
            description: "An avatar of the celestial host. It watches the race with detached amusement, its true motives a mystery.",
            portrait: 'assets/portraits/chinese_zodiac/pawn_emperor.png'
        },
        {
            name: 'The River Current',
            role: 'Pawn',
            icon: '🌊 ♙',
            personality: 'Traumatized Freezer',
            description: "The great obstacle of the race, now given form. It remembers the desperation of the animals and sometimes freezes, unable to bear the memory.",
            portrait: 'assets/portraits/chinese_zodiac/pawn_river.png'
        },
        {
            name: 'The Finish Line',
            role: 'Pawn',
            icon: '🏁 ♙',
            personality: 'People Pleaser',
            description: "The embodiment of the goal. It wants someone to win, to feel the joy of completion, and will urge others forward.",
            portrait: 'assets/portraits/chinese_zodiac/pawn_finish_line.png'
        }
    ]
};
