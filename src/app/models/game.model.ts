import {Player} from './player.model';

export interface Game {
    gameId: number;
    createdAt: string;
    playerOne: Player;
    playerTwo: Player;
    finished: boolean;
    scoreOne: number;
    scoreTwo: number;
}
