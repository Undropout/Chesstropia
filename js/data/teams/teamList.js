/**
 * @file teamList.js
 * The central registry for all playable teams in ChessTropia.
 * This file imports each team's data and exports them in a single object
 * for the GameController to use.
 */

import { donuts } from './donuts.js';
import { renaissance_pets } from './renaissance_pets.js';
import { baseballerinas } from './baseballerinas.js';
import { victorian_characters } from './victorian_characters.js';
import { noble_gases } from './noble_gases.js';
import { lab_animals } from './lab_animals.js';
import { gmos } from './gmos.js';
import { teslas } from './teslas.js';
import { espers } from './espers.js';
import { oxidizers } from './oxidizers.js';
import { cavepeople } from './cavepeople.js';
import { mechanics } from './mechanics.js';
import { nesting_dolls } from './nesting_dolls.js';
import { fidget_toys } from './fidget_toys.js';
import { magical_beasts } from './magical_beasts.js';
import { magical_bipeds } from './magical_bipeds.js';
import { elementals } from './elementals.js';
import { demons } from './demons.js';
import { ninja } from './ninja.js';
import { crusaders } from './crusaders.js';
import { zodiac } from './zodiac.js';
import { chinese_zodiac } from './chinese_zodiac.js';
import { winter_athletes } from './winter_athletes.js';
import { summer_athletes } from './summer_athletes.js';
import { sword_primates } from './sword_primates.js';
import { three_letter_agencies } from './three_letter_agencies.js';
import { first_nations } from './first_nations.js';
import { plants } from './plants.js';
import { activists } from './activists.js';
import { greys } from './greys.js';
import { living_planets } from './living_planets.js';
import { toons } from './toons.js';
import { crystals } from './crystals.js';
import { polygons } from './polygons.js';
import { web_frameworks } from './web_frameworks.js';
import { rest_stops } from './rest_stops.js';
import { impressionist_art } from './impressionist_art.js';
import { emotions } from './emotions.js';
import { vending_machines } from './vending_machines.js';
import { the_typecasts } from './the_typecasts.js';
import { the_mismatched_set } from './the_mismatched_set.js';
import { the_abandoned_arcade } from './the_abandoned_arcade.js';

// This is the object that will be imported by other files.
// It contains all team data, keyed by their ID.
export const TEAMS = {
    donuts,
    renaissance_pets,
    baseballerinas,
    victorian_characters,
    noble_gases,
    lab_animals,
    gmos,
    teslas,
    espers,
    oxidizers,
    cavepeople,
    mechanics,
    nesting_dolls,
    fidget_toys,
    magical_beasts,
    magical_bipeds,
    elementals,
    demons,
    ninja,
    crusaders,
    zodiac,
    chinese_zodiac,
    winter_athletes,
    summer_athletes,
    sword_primates,
    three_letter_agencies,
    first_nations,
    plants,
    activists,
    greys,
    living_planets,
    toons,
    crystals,
    polygons,
    web_frameworks,
    rest_stops,
    impressionist_art,
    emotions,
    vending_machines,
    the_typecasts,
    the_mismatched_set,
    the_abandoned_arcade,
};
