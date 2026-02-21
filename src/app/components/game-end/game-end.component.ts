import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-game-ended',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-end.component.html',
    styleUrls: ['./game-end.component.css']
})
export class GameEndedComponent {
    gamePin: string;
    role = input<'screen' | 'player'>('player');

    constructor() {
        this.gamePin = '19172';
    }
}
