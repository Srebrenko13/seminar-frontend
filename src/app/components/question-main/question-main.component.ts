import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-question-main',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './question-main.component.html',
    styleUrls: ['./question-main.component.css']
})
export class QuestionMainComponent implements OnDestroy {
    currentQuestion: number = 7;
    totalQuestions: number = 10;

    // States: 'reading' | 'answering'
    state = signal<'reading' | 'answering'>('reading');

    questionText: string = 'Što će ispisati sljedeći odsječak koda?';
    codeSnippet: string = `#include <stdio.h>
int main(void)
{
  int x = 10;
  if (x % 2 == 0) {
    printf("Broj je paran")
  } else {
    prinf("broj je neparan")
  }
  return 0;
}`;

    answers = [
        { id: 'A', text: 'Broj je paran', color: 'bg-[#19E6E8]' },
        { id: 'B', text: '8 (na k te nosam)', color: 'bg-[#4169E1]' },
        { id: 'C', text: 'Broj je paran', color: 'bg-[#FF8C00]' },
        { id: 'D', text: 'Broj je paran', color: 'bg-[#9370DB]' }
    ];

    // Reading phase timer (5 seconds)
    readingProgress = signal(0);
    readingIntervalId: ReturnType<typeof setInterval> | null = null;

    // Answering phase timer (10 seconds countdown)
    answeringTimer = signal(10);
    answeringIntervalId: ReturnType<typeof setInterval> | null = null;

    constructor() {
        this.startReadingPhase();
    }

    ngOnDestroy() {
        if (this.readingIntervalId) clearInterval(this.readingIntervalId);
        if (this.answeringIntervalId) clearInterval(this.answeringIntervalId);
    }

    startReadingPhase() {
        const duration = 5000; // 5 seconds
        const interval = 50; // Update every 50ms
        let elapsed = 0;

        this.readingIntervalId = setInterval(() => {
            elapsed += interval;
            this.readingProgress.set((elapsed / duration) * 100);

            if (elapsed >= duration) {
                if (this.readingIntervalId) clearInterval(this.readingIntervalId);
                this.startAnsweringPhase();
            }
        }, interval);
    }

    startAnsweringPhase() {
        this.state.set('answering');

        this.answeringIntervalId = setInterval(() => {
            this.answeringTimer.update(val => val - 1);

            if (this.answeringTimer() <= 0) {
                if (this.answeringIntervalId) clearInterval(this.answeringIntervalId);
                // TODO: Move to next question
                console.log('Time is up!');
            }
        }, 1000);
    }
}