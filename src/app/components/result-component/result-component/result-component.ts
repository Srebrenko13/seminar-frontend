import {Component, computed, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameService} from '../../../services/game-service';
import {GamePhase} from '../../../models/game-data.model';
import {GameWebSocketService} from '../../../services/game-websocket.service';

@Component({
  selector: 'app-round-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-component.html',
  styleUrls: ['./result-component.css']
})
export class ResultComponent implements OnInit {
  private gameService = inject(GameService);
  private webSocket = inject(GameWebSocketService);

  resultData = this.gameService.currentResult;

  sortedPlayers = computed(() => {
    const data = this.resultData();
    if (!data) return [];

    const players = [
      { username: data.playerOne, score: data.scoreOne, color: 'border-[#19E6E8]' },
      { username: data.playerTwo, score: data.scoreTwo, color: 'border-[#4169E1]' }
    ];

    return players.sort((a, b) => b.score - a.score);
  });

  ngOnInit() {
    const isScreen = this.webSocket.getRole() === 'SCREEN';

    if (isScreen) {
      setTimeout(() => {
        this.gameService.currentResult.set(null);
        this.gameService.updatePhase(GamePhase.COUNTDOWN);

        this.webSocket.send({
          messageType: 'NEXT_QUESTION',
          role: 'SCREEN',
          payload: null
        });
      }, 5000);
    }
  }
}
