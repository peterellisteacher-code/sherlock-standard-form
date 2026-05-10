/**
 * Entry point. Registers all scenes, mounts global UI (Casebook), starts router.
 */

import { registerScene, start } from './core/nav.js?v=3';
import { mountCasebook } from './casebook.js?v=3';

import * as titleScene from './title.js?v=3';
import * as act1Scene from './acts/act1.js?v=3';
import * as act2Scene from './acts/act2.js?v=3';
import * as act3Scene from './acts/act3.js?v=3';
import * as act4Scene from './acts/act4.js?v=3';
import * as finaleScene from './finale.js?v=3';

registerScene('/title', titleScene);
registerScene('/act/1', act1Scene);
registerScene('/act/2', act2Scene);
registerScene('/act/3', act3Scene);
registerScene('/act/4', act4Scene);
registerScene('/finale', finaleScene);

mountCasebook();
start();
