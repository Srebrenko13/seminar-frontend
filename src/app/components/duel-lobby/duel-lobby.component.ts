import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {filter, Subscription} from 'rxjs';
import {GameWebSocketService} from '../../services/game-websocket.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-duel-lobby',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './duel-lobby.component.html',
  styleUrls: ['./duel-lobby.component.css']
})
export class DuelLobbyComponent implements OnInit, OnDestroy {
  gamePin: string = '19172';
  qrCodeUrl: string =
    'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://uproduel.com/join/19172';

  playersJoined = signal(0);
  totalPlayers = signal(2);
  isWaitingForPlayers = signal(false);

  private sub?: Subscription;

  router = inject(Router);

  constructor(private ws: GameWebSocketService) {}

  ngOnInit() {
    // Screen connects once when lobby screen loads
    this.ws.connectAsScreen();

    this.sub = this.ws.messages()
      .pipe(filter(m => m.type === 'LOBBY_STATE' || m.type === 'GAME_START' || m.type === 'ERROR'))
      .subscribe(m => {
        console.log("I'm here");
        console.log(m);
        if (m.type === 'LOBBY_STATE') {
          console.log("I'm in lobby");
          console.log(m.payload?.players);
          this.playersJoined.set(m.payload?.players ?? 0);
          const started = m.payload?.started ?? false;

          this.isWaitingForPlayers.set(!started && this.playersJoined < this.totalPlayers);
          console.log(this.playersJoined);
        }

        if (m.type === 'GAME_START') {
          this.isWaitingForPlayers.set(false);
          // TODO: navigate to next screen (question screen)
          this.router.navigate(['/countdown-screen']);
        }

        if (m.type === 'ERROR') {
          console.error(m.payload?.message ?? 'WS error', m);
        }
      });
  }

  ngOnDestroy() {
    // IMPORTANT: do NOT disconnect here if you want to keep WS across screens
    this.sub?.unsubscribe();
  }
}
