import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-player-join',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './playerJoin.html',
    styleUrls: ['./playerJoin.css']
})
export class PlayerJoinComponent {
    step = signal(1); // 1: PIN input, 2: PIN confirm, 3: Nickname input, 4: Ready

    gamePin: string = '';
    nickname: string = '';

    constructor(private router: Router) {}

    onEnterPin() {
        if (this.gamePin.length === 6) {
            // Direktno prebaci na step 3 (nickname input) - preskočimo step 2 (confirm)
            this.step.set(3);
        }
    }

    onEnterNickname() {
        if (this.nickname.trim().length > 0) {
            this.step.set(4);
        }
    }

    onReady() {
        // TODO: Backend call to join game
        // Navigate to lobby or waiting screen
        console.log(`Player ${this.nickname} joined room ${this.gamePin}`);
        // this.router.navigate(['/lobby']);
    }

    getDisplayValue(): string {
        if (this.step() === 2) return this.gamePin;
        if (this.step() === 4) return this.nickname;
        return '';
    }

    showJoinedMessage(): boolean {
        return this.step() === 3 || this.step() === 4;
    }

    onEnterClick() {
        if (this.step() === 1) this.onEnterPin();
        else if (this.step() === 2) this.step.set(3); // Ovaj step više ne koristimo ali za svaki slučaj
        else if (this.step() === 3) this.onEnterNickname();
        else if (this.step() === 4) this.onReady();
    }
}