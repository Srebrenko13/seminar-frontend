import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export enum GamePhase {
  LOBBY = 'LOBBY',
  COUNTDOWN = 'COUNTDOWN',
  QUESTION = 'QUESTION',
  RESULTS = 'RESULTS',
}

@Injectable({providedIn: 'root'})
export class GameService {
  private phaseSubject = new BehaviorSubject<GamePhase>(GamePhase.LOBBY);
  gameState$ = this.phaseSubject.asObservable();

  private questionDataSubject = new BehaviorSubject<any>(null);
  questionData$ = this.questionDataSubject.asObservable();

  public updatePhase(phase: GamePhase): void {
    this.phaseSubject.next(phase);
  }
}
