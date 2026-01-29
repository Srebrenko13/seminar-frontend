import { Routes } from '@angular/router';
import { HomePage } from './features/home-page/home-page';
import { DuelLobbyComponent } from './components/duel-lobby/duel-lobby.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { PlayerJoinComponent } from './components/PlayerJoin/playerJoin';
import { QuestionMobileComponent } from './components/question-mobile/question-mobile.component';
import { QuestionMainComponent } from './components/question-main/question-main.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    { path: 'lobby', component: DuelLobbyComponent },
    { path: 'countdown', component: CountdownComponent },
    { path: 'join', component: PlayerJoinComponent },
    { path: 'question-mobile', component: QuestionMobileComponent },
    { path: 'question-main', component: QuestionMainComponent }
];