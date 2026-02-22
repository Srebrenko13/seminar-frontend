import {inject, Injectable, signal} from '@angular/core';
import {GamePhase, QuestionData, ResultData} from '../models/game-data.model';
import {GameWebSocketService} from './game-websocket.service';
import {MessageType} from '../models/message.model';

@Injectable({providedIn: 'root'})
export class GameService {
  private webSocket = inject(GameWebSocketService);

  gameState = signal<GamePhase>(GamePhase.COUNTDOWN);
  currentQuestionData = signal<QuestionData | null>(null);
  currentResult = signal<ResultData | null>(null);

  constructor() {
    this.webSocket.messages().subscribe((message: any) => {
      console.log('Incoming WebSocket Message:', message);

      switch (message.type) {
        case MessageType.QUESTION:
          this.currentQuestionData.set(message);
          this.updatePhase(GamePhase.COUNTDOWN);
          break;
        case MessageType.ROUND_RESULT:
          this.currentResult.set(message);
          break;
        case MessageType.GAME_END:
          this.updatePhase(GamePhase.GAME_END);
          break;
      }
    });
  }

  public updatePhase(phase: GamePhase): void {
    this.gameState.set(phase);
  }

  public getPhase(): GamePhase {
    return this.gameState();
  }

  public setQuestionData(data: QuestionData){
    this.currentQuestionData.set(data);
  }
}
