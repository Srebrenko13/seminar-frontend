import {Component, computed, inject, input, OnDestroy, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../../services/game-service';
import {GamePhase} from '../../models/game-data.model';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public gameService = inject(GameService);
  private timerId: any;

  countdown = signal(5);
  role = input.required<'screen' | 'player'>();

  info = computed(() => {
    const currentRole = this.role();
    console.log('Role received:', currentRole);
    return currentRole === 'screen'
      ? 'Starting the game!'
      : 'Waiting for question!';
  });

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    this.timerId = setInterval(() => {
      this.countdown.update(v => v - 1);
      if (this.countdown() === 0) {
        this.stopTimer();
        this.gameService.updatePhase(GamePhase.QUESTION);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerId) clearInterval(this.timerId);
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
