import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {GameService} from '../../../services/game-service';
import {CountdownComponent} from '../../../components/countdown/countdown.component';
import {ActivatedRoute} from '@angular/router';
import {QuestionMobileComponent} from '../../../components/question-mobile/question-mobile.component';
import {QuestionMainComponent} from '../../../components/question-main/question-main.component';
import {GameEndedComponent} from '../../../components/game-end/game-end.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    AsyncPipe,
    CountdownComponent,
    QuestionMobileComponent,
    QuestionMainComponent,
    GameEndedComponent
  ],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css',
})
export class GamePage {

  private route = inject(ActivatedRoute);
  public gameService = inject(GameService);

  public role: 'screen' | 'player' = this.route.snapshot.data['role'] ?? 'player';

  public gameState$ = this.gameService.gameState$;
}
