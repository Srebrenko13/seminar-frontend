import {Component, inject, input, OnDestroy, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {GamePhase, GameService} from '../../services/game-service';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnDestroy {
  countdown = signal(5);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public gameService = inject(GameService);
  info = signal('');

  role = input<'screen' | 'player'>('player');

  constructor() {
    this.role = this.route.snapshot.data['role'] ?? 'player';

    if (this.role() === 'screen') {
      this.info.set('Starting the game!');
    } else {
      this.info.set('Waiting for question!');
    }

    this.startCountdown();
  }

  ngOnDestroy() {}

  startCountdown() {
    setInterval(() => {
      this.countdown.update(v => v - 1);
      if (this.countdown() === 0) {
        this.router.navigate([
          this.role() === 'screen'
            ? this.gameService.updatePhase(GamePhase.QUESTION)
            : '/question-player'
        ]);
      }
    }, 1000);
  }
}
