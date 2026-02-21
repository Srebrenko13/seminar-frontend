import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-question-mobile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './question-mobile.component.html',
    styleUrls: ['./question-mobile.component.css']
})
export class QuestionMobileComponent {
    gamePin: string = '19172';
    currentQuestion: number = 1;
    totalQuestions: number = 10;

    // States: 'waiting' | 'answering' | 'locked'
    state = signal<'waiting' | 'answering' | 'locked'>('waiting');

    progress = signal(0);
    intervalId: ReturnType<typeof setInterval> | null = null;

    selectedAnswer: string | null = null;

    answers = [
        { id: 'A', text: 'Broj je paran', color: 'bg-[#19E6E8]' },
        { id: 'B', text: '8', color: 'bg-[#4169E1]' },
        { id: 'C', text: 'Broj je paran', color: 'bg-[#FF8C00]' },
        { id: 'D', text: 'Broj je paran', color: 'bg-[#9370DB]' }
    ];

    ngOnInit() {
        this.startReadingPhase()
    }



    onAnswerClick(answerId: string) {
        // Dozvoli promjenu odgovora samo ako nije locked
        if (this.state() === 'answering') {
            // Ako klikne na isti odgovor, deselektiraj ga
            if (this.selectedAnswer === answerId) {
                this.selectedAnswer = null;
            } else {
                // Inače selectaj novi odgovor
                this.selectedAnswer = answerId;
            }

            // TODO: Send answer to backend
            console.log(`Answer selected: ${this.selectedAnswer}`);
        }
    }

    // Mock funkcija - lock odgovore kad vrijeme istekne (poziva je backend ili timer)
    lockAnswers() {
      this.state.set('locked');
      console.log(`Final answer: ${this.selectedAnswer || 'No answer selected'}`);
    }

    startReadingPhase() {
      const duration = 5000; // 5 seconds
      const interval = 50; // Update every 50ms
      let elapsed = 0;

      this.intervalId = setInterval(() => {
        elapsed += interval;
        this.progress.set((elapsed / duration) * 100);

        if (elapsed >= duration) {
          if (this.intervalId) clearInterval(this.intervalId);
          this.startAnswering();
        }
      }, interval);
    }

    // Mock funkcija za testiranje - simulira prijelaz u answering state
    startAnswering() {
        this.state.set('answering');
        this.progress.set(10);

        this.intervalId = setInterval(() => {
          this.progress.update(value => value - 1);
          if(this.progress() <= 0) {
            if (this.intervalId) clearInterval(this.intervalId);
            this.state.set('locked');
          }

        }, 1000);
    }
}
