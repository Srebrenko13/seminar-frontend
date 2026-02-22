import {Routes} from '@angular/router';
import {DuelLobbyComponent} from './components/duel-lobby/duel-lobby.component';
import {PlayerJoinComponent} from './components/PlayerJoin/playerJoin';
import {WinnerScreenComponent} from './components/winner-screen/winner-screen.component';
import {GameEndedComponent} from './components/game-end/game-end.component';
import {GamePage} from './pages/game/game-page/game-page';

export const routes: Routes = [
    { path: '', component: PlayerJoinComponent},
    { path: 'lobby', component: DuelLobbyComponent },
    { path: 'join', component: PlayerJoinComponent },
    { path: 'game-screen',
      component: GamePage,
      data: {role: 'screen'}},
    { path: 'game-player',
      component: GamePage,
      data: {role: 'player'}},
    { path: 'winner', component: WinnerScreenComponent },
    { path: 'game-ended', component: GameEndedComponent }
];
