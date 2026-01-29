import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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

    selectedAnswer: string | null = null;

    answers = [
        { id: 'A', text: 'Broj je paran', color: 'bg-[#19E6E8]' },
        { id: 'B', text: '8 (na k te nosam)', color: 'bg-[#4169E1]' },
        { id: 'C', text: 'Broj je paran', color: 'bg-[#FF8C00]' },
        { id: 'D', text: 'Broj je paran', color: 'bg-[#9370DB]' }
    ];

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

    // Mock funkcija za testiranje - simulira prijelaz u answering state
    startAnswering() {
        this.state.set('answering');
    }

    // Mock funkcija - lock odgovore kad vrijeme istekne (poziva je backend ili timer)
    lockAnswers() {
        this.state.set('locked');
        console.log(`Final answer: ${this.selectedAnswer || 'No answer selected'}`);
    }
}