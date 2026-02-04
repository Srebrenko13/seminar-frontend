import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-winner-screen',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './winner-screen.component.html',
    styleUrls: ['./winner-screen.component.css']
})
export class WinnerScreenComponent {
    winnerName: string = 'RENATO';
    totalQuestions: number = 10;
    averageTime: number = 3.63;
    leaderboardPosition: number = 1;

    avatarPath: string = 'medal.png';
}