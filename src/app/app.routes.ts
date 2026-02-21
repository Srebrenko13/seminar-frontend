import {Routes} from '@angular/router';
import {DuelLobbyComponent} from './components/duel-lobby/duel-lobby.component';
import {PlayerJoinComponent} from './components/PlayerJoin/playerJoin';
import {QuestionMobileComponent} from './components/question-mobile/question-mobile.component';
import {QuestionMainComponent} from './components/question-main/question-main.component';
import {WinnerScreenComponent} from './components/winner-screen/winner-screen.component';
import {AnswerCorrectComponent} from './components/answer-correct/answer-correct.component';
import {AnswerIncorrectComponent} from './components/answer-incorrect/answer-incorrect.component';
import {GameEndedComponent} from './components/game-end/game-end.component';

export const routes: Routes = [
    { path: '', component: PlayerJoinComponent},
    { path: 'lobby', component: DuelLobbyComponent },
    { path: 'countdown-screen',
      loadComponent: () => import('./components/countdown/countdown.component').then(m => m.CountdownComponent),
      data: { role: 'screen' } },
    { path: 'countdown-player',
      loadComponent: () => import('./components/countdown/countdown.component').then(m => m.CountdownComponent),
      data: { role: 'player' } },
    { path: 'join', component: PlayerJoinComponent },
    { path: 'question-player', component: QuestionMobileComponent },
    { path: 'question-screen', component: QuestionMainComponent },
    { path: 'winner', component: WinnerScreenComponent },
    { path: 'answer-correct', component: AnswerCorrectComponent },
    { path: 'answer-incorrect', component: AnswerIncorrectComponent },
    { path: 'game-ended', component: GameEndedComponent }
];
