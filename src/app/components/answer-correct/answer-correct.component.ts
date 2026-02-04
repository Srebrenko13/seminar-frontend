import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-answer-correct',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './answer-correct.component.html',
    styleUrls: ['./answer-correct.component.css']
})
export class AnswerCorrectComponent {
    gamePin: string = '19172';
}