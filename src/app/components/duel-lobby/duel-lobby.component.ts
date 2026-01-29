import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-duel-lobby',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './duel-lobby.component.html',
    styleUrls: ['./duel-lobby.component.css']
})
export class DuelLobbyComponent implements OnInit, OnDestroy {
    gamePin: string = '19172';
    qrCodeUrl: string = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://uproduel.com/join/19172';

    playersJoined: number = 0;
    totalPlayers: number = 2;
    isWaitingForPlayers: boolean = true;

    private subscription?: Subscription;

    ngOnInit() {
        // TODO: Zamijeniti sa pravim API callom za dohvat igrača
        // this.checkForPlayers();
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    checkForPlayers() {
        // Ovdje staviš pravi API call ka backendu
        this.subscription = interval(2000).subscribe(() => {
            // Mock: nakon 4 sekunde simuliramo da se pridružio igrač
            if (this.playersJoined < this.totalPlayers) {
                this.playersJoined++;

                if (this.playersJoined === this.totalPlayers) {
                    this.isWaitingForPlayers = false;
                }
            }
        });
    }
}