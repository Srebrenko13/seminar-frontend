import { Routes } from '@angular/router';
import { HomePage } from './features/home-page/home-page';
import { DuelLobbyComponent } from './components/duel-lobby/duel-lobby.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { PlayerJoinComponent } from './components/PlayerJoin/playerJoin';
import { QuestionMobileComponent } from './components/question-mobile/question-mobile.component';
import { QuestionMainComponent } from './components/question-main/question-main.component';
import { WinnerScreenComponent } from './components/winner-screen/winner-screen.component';
import { AnswerCorrectComponent } from './components/answer-correct/answer-correct.component';
import { AnswerIncorrectComponent } from './components/answer-incorrect/answer-incorrect.component';
import { GameEndedComponent } from './components/game-end/game-end.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    { path: 'lobby', component: DuelLobbyComponent },
    { path: 'countdown', component: CountdownComponent },
    { path: 'join', component: PlayerJoinComponent },
    { path: 'question-mobile', component: QuestionMobileComponent },
    { path: 'question-main', component: QuestionMainComponent },
    { path: 'winner', component: WinnerScreenComponent },
    { path: 'answer-correct', component: AnswerCorrectComponent },
    { path: 'answer-incorrect', component: AnswerIncorrectComponent },
    { path: 'game-ended', component: GameEndedComponent }
];