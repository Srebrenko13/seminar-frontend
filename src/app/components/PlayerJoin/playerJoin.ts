import {Component, OnDestroy, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {GameWebSocketService, ServerMessage} from '../../services/game-websocket.service';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-player-join',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './playerJoin.html',
  styleUrls: ['./playerJoin.css'],
  providers: [MessageService],
})
export class PlayerJoinComponent implements OnDestroy {
  step = signal(1); // 1: PIN input, 3: Nickname input, 4: Waiting/Ready

  gamePin: string = '';
  nickname: string = '';

  // UI state
  playersJoined = signal(0);
  totalPlayers = 2;
  errorMsg = signal<string | null>(null);

  private sub?: Subscription;

  constructor(private router: Router,
              private ws: GameWebSocketService,
              private messageService: MessageService
  ) {}

  ngOnDestroy() {
    this.sub?.unsubscribe();
    // Do NOT disconnect here if you want to keep connection during the game flow
  }

  onEnterPin() {
    this.errorMsg.set(null);
    if (this.gamePin.length === 5) {
      this.step.set(3);
    }
  }

  onEnterNickname() {
    this.errorMsg.set(null);
    if (this.nickname.trim().length > 0) {
      this.onReady();
    }
  }

  onReady() {
    this.errorMsg.set(null);

    const username = this.nickname.trim();
    if (!username) {
      this.errorMsg.set('Enter a nickname.');
      return;
    }

    // Subscribe once (if not already)
    if (!this.sub) {
      this.sub = this.ws.messages().subscribe((m: ServerMessage) => {
        // depends on what backend sends; handle both styles
        if (m.type === 'ERROR') {
          this.errorMsg.set(m.payload ?? 'Error');
          // optionally go back to nickname step
          this.step.set(3);
        }

        if (m.type === 'USERNAME_TAKEN') {
          this.messageService.add({
            severity: 'warn',
            summary: 'Username Taken',
            detail: 'Username already taken, please try again!',
            life: 3000
          });
          this.step.set(3);
        }

        if (m.type === 'JOIN_OK') {
          // player successfully registered on backend
          // stay on waiting step
          this.messageService.add({
            severity: 'success',
            summary: 'Username Joined',
            detail: 'Joined lobby successfully!',
            life: 3000
          });
          this.step.set(4);
        }

        if (m.type === 'LOBBY_STATE') {
          // backend should send: { type:"LOBBY_STATE", players: 1, started:false }
          this.playersJoined.set(m.payload?.players ?? 0);
        }

        if (m.type === 'GAME_START') {
          // Navigate to the next screen
          // this.router.navigate(['/duel/question']); // example
          console.log('Game starting!');
          this.router.navigate(['/countdown-player']);
        }
      });
    }

    // ✅ Minimal backend-compatible connect (payload = username only)
    this.ws.connectAsPlayer(username);

    // If you want to incorporate PIN later: see "Recommended payload" section below.
    console.log(`Player ${username} attempting join for PIN ${this.gamePin}`);
  }

  getDisplayValue(): string {
    if (this.step() === 4) return this.nickname;
    return '';
  }

  showJoinedMessage(): boolean {
    return this.step() === 3 || this.step() === 4;
  }

  onEnterClick() {
    if (this.step() === 1) this.onEnterPin();
    else if (this.step() === 3) this.onEnterNickname();
    else if (this.step() === 4) this.onReady();
  }
}
