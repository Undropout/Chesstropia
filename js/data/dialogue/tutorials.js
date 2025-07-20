/**
 * @file tutorials.js
 * Contains the data for the tutorial campaign missions.
 */

export const tutorial_mission_1 = {
    id: 'mission_1',
    title: 'First Steps',
    openingDialogue: [
        { character: 'Coach', text: "Welcome to Chesstropia. These pieces... they're a bit lost. They need a leader." },
        { character: 'King Aurelius', text: "Leader? I was carved from an emperor's table! I need no one." },
        { character: 'Penny Plastic', text: "Oh, please don't fight! Can't we all just get along?" },
        { character: 'Coach', text: "See what I mean? Your first job is to get them to the other side of the board. Try moving a regulated piece, like Penny." }
    ],
    gameConfig: {
        playerTeamId: 'the_mismatched_set',
        opponentTeamId: 'the_abandoned_arcade',
        aiType: 'TheStrategist',
    },
    closingDialogue: [
        { character: 'Coach', text: "Good work. You've shown them a path forward. But this is just the beginning." }
    ]
};
