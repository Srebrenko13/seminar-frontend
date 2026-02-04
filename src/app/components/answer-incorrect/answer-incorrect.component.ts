import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-answer-incorrect',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './answer-incorrect.component.html',
    styleUrls: ['./answer-incorrect.component.css']
})
export class AnswerIncorrectComponent {
    gamePin: string = '19172';
}