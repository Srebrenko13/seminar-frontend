import {Component, computed, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameService} from '../../services/game-service';
import {GameWebSocketService} from '../../services/game-websocket.service';
import {MessageType} from '../../models/message.model';

@Component({
  selector: 'app-question-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-mobile.component.html',
  styleUrls: ['./question-mobile.component.css']
})
export class QuestionMobileComponent implements OnDestroy, OnInit {
  private gameService = inject(GameService);
  private webSocket = inject(GameWebSocketService);

  questionData = this.gameService.currentQuestionData;
  roundResult = this.gameService.currentResult;

  correctAnswerId = computed(() => this.roundResult()?.correctAnswerId ?? null);

  currentQuestion = computed(() => this.questionData()?.index ?? 1);
  totalQuestions = 10;

  state = signal<'waiting' | 'answering' | 'locked'>('waiting');
  selectedAnswerId = signal<number | null>(null);
  readingProgress = signal(0);

  private intervalId: any;

  answers = computed(() => {
    const colors = ['bg-[#19E6E8]', 'bg-[#4169E1]', 'bg-[#FF8C00]', 'bg-[#9370DB]'];
    const labels = ['A', 'B', 'C', 'D'];
    return this.questionData()?.answers.map((ans, i) => ({
      dbId: ans.answerId,
      label: labels[i],
      text: ans.content,
      color: colors[i]
    })) ?? [];
  });

  constructor() {
    effect(() => {
      if (this.questionData()) {
        this.resetForNewQuestion();
      }
    });
  }

  ngOnInit() {
    if (this.questionData()) {
      this.startReadingPhase();
    }
  }

  private resetForNewQuestion() {
    this.gameService.currentResult.set(null);

    this.state.set('waiting');
    this.selectedAnswerId.set(null);
    this.readingProgress.set(0);
    this.startReadingPhase();
  }

  startReadingPhase() {
    this.clearTimers();
    const data = this.questionData();
    const delay = data?.activationDelay || 5000;
    const localActivationTime = Date.now() + delay;

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = localActivationTime - now;

      const progress = 100 - ((remaining / delay) * 100);
      this.readingProgress.set(Math.min(100, Math.max(0, progress)));

      if (now >= localActivationTime) {
        clearInterval(this.intervalId);
        this.startAnswering(localActivationTime);
      }
    }, 30);
  }

  startAnswering(activationTime: number) {
    this.state.set('answering');
    const data = this.questionData();
    if (!data) return;

    const endTime = activationTime + (data.duration * 1000);

    this.intervalId = setInterval(() => {
      const now = Date.now();

      if (now >= endTime) {
        this.state.set('locked');
        this.clearTimers();
      }

      if (this.correctAnswerId() !== null) {
        this.state.set('locked');
        this.clearTimers();
      }
    }, 100);
  }

  onAnswerClick(answerId: number) {
    if (this.state() !== 'answering' || this.selectedAnswerId() !== null) {
      return;
    }
    this.selectedAnswerId.set(answerId);
    this.webSocket.send({
      messageType: MessageType.ANSWER,
      role: 'PLAYER',
      payload: answerId.toString()
    });
  }

  private clearTimers() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    this.clearTimers();
  }
}
