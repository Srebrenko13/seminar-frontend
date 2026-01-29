import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-countdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnDestroy {
    countdown = signal(5);
    playersReady = '2/2 players ready...';

    private intervalId: ReturnType<typeof setInterval> | null = null;

    constructor(private router: Router) {
        this.startCountdown();
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    startCountdown() {
        this.intervalId = setInterval(() => {
            this.countdown.update(val => val - 1);

            if (this.countdown() === 0) {
                if (this.intervalId) clearInterval(this.intervalId);
                // TODO: Navigacija na pitanje screen
                // this.router.navigate(['/question']);
                console.log('Countdown finished! Navigate to question...');
            }
        }, 1000);
    }
}