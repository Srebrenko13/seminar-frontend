import {Component, inject, input} from '@angular/core';
import {GameService} from '../../../services/game-service';
import {CountdownComponent} from '../../../components/countdown/countdown.component';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionMobileComponent} from '../../../components/question-mobile/question-mobile.component';
import {QuestionMainComponent} from '../../../components/question-main/question-main.component';
import {GamePhase} from '../../../models/game-data.model';
import {ResultComponent} from '../../../components/result-component/result-component/result-component';
import {GameEndedComponent} from '../../../components/game-end/game-end.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    CountdownComponent,
    QuestionMobileComponent,
    QuestionMainComponent,
    ResultComponent,
    GameEndedComponent
  ],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css',
})
export class GamePage {
  readonly Phase = GamePhase;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public gameService = inject(GameService);

  role = input.required<'screen' | 'player'>();
}
