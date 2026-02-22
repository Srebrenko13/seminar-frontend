import {Component, computed, effect, inject, OnDestroy, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameService} from '../../services/game-service';
import {GamePhase, ResultData} from '../../models/game-data.model';

@Component({
  selector: 'app-question-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-main.component.html',
  styleUrls: ['./question-main.component.css']
})
export class QuestionMainComponent implements OnDestroy {
  private gameService = inject(GameService);

  questionData = this.gameService.currentQuestionData;
  roundResult = this.gameService.currentResult;

  correctAnswerId = signal<number | null>(null);
  showScoreScreen = signal(false);

  currentQuestion = computed(() => this.questionData()?.index ?? 0);
  totalQuestions = 10;
  questionPrompt = "Što će ispisati sljedeći odsječak koda?";
  codeSnippet = computed(() => this.questionData()?.question ?? '');

  answers = computed(() => {
    const colors = ['bg-[#19E6E8]', 'bg-[#4169E1]', 'bg-[#FF8C00]', 'bg-[#9370DB]'];
    const labels = ['A', 'B', 'C', 'D'];
    const backendAnswers = this.questionData()?.answers ?? [];

    return backendAnswers.map((ans, i) => ({
      dbId: ans.answerId,
      id: labels[i] || '?',
      text: ans.content,
      color: colors[i] || 'bg-gray-500'
    }));
  });

  state = signal<'reading' | 'answering'>('reading');
  readingProgress = signal(0);
  answeringTimer = signal(0);
  totalDuration = computed(() => this.questionData()?.duration ?? 15);

  private readingIntervalId: any;
  private answeringIntervalId: any;

  constructor() {
    if (this.questionData()) {
      this.startReadingPhase();
    }

    effect(() => {
      if (this.questionData() && this.state() === 'reading' && !this.readingIntervalId) {
        this.startReadingPhase();
      }
    });

    effect(() => {
      const result = this.gameService.currentResult();
      console.log('Effect detected result:', result);
      if(result) {
        this.startResultPhase(result);
      }
    })
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  private clearTimers() {
    if (this.readingIntervalId) clearInterval(this.readingIntervalId);
    if (this.answeringIntervalId) clearInterval(this.answeringIntervalId);
  }

  startReadingPhase() {
    this.clearTimers();
    const data = this.questionData();
    const delay = data?.activationDelay || 5000;

    const localActivationTime = Date.now() + delay;

    this.readingIntervalId = setInterval(() => {
      const now = Date.now();
      const remaining = localActivationTime - now;

      const progress = 100 - ((remaining / delay) * 100);
      this.readingProgress.set(Math.min(100, Math.max(0, progress)));

      if (now >= localActivationTime) {
        clearInterval(this.readingIntervalId);
        this.startAnsweringPhase(localActivationTime);
      }
    }, 30);
  }

  startAnsweringPhase(activationTime: number) {
    this.state.set('answering');
    const data = this.questionData();
    if (!data) return;

    const endTime = activationTime + (data.duration * 1000);

    this.answeringIntervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      this.answeringTimer.set(remaining);

      if (now >= endTime) {
        clearInterval(this.answeringIntervalId);
      }
    }, 100);
  }

  startResultPhase(result: ResultData) {
    if (this.answeringIntervalId) clearInterval(this.answeringIntervalId);
    this.answeringTimer.set(0);
    this.correctAnswerId.set(result.correctAnswerId);

    setTimeout(() => {
      this.correctAnswerId.set(null);
      this.gameService.updatePhase(GamePhase.ROUND_RESULT);
    }, 3000);
  }
}
