import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

export type Role = 'SCREEN' | 'PLAYER';
export type MessageType = 'CONNECT' | 'LOBBY_STATE' | 'GAME_START' | 'ERROR';

export interface ClientMessage {
  role: Role;
  messageType: 'CONNECT';   // expand later
  payload: string | null;   // for PLAYER CONNECT: username; for SCREEN: null
}

export interface ServerMessage<T = any> {
  type: 'SCREEN_OK' | 'JOIN_OK' | 'USERNAME_TAKEN' | 'LOBBY_STATE' | 'GAME_START' | 'ERROR';
  payload?: T;
}

@Injectable({ providedIn: 'root' })
export class GameWebSocketService {
  private socket?: WebSocketSubject<any>;
  private events$ = new Subject<ServerMessage>();

  /** Change this to your backend host */
  private wsUrl = `ws://localhost:8080/ws`;

  connectAsScreen(): void {
    this.ensureConnected();
    const msg: ClientMessage = { role: 'SCREEN', messageType: 'CONNECT', payload: null };
    this.socket!.next(msg);
  }

  connectAsPlayer(username: string): void {
    this.ensureConnected();
    const msg: ClientMessage = { role: 'PLAYER', messageType: 'CONNECT', payload: username };
    this.socket!.next(msg);
  }

  // game-ws.service.ts
  send(data: any): void {
    this.ensureConnected();
    this.socket!.next(data);
  }

  messages(): Observable<ServerMessage> {
    return this.events$.asObservable();
  }

  disconnect(): void {
    this.socket?.complete();
    this.socket = undefined;
  }

  private ensureConnected(): void {
    if (this.socket) return;

    this.socket = webSocket({
      url: this.wsUrl,
      deserializer: e => JSON.parse(e.data),
      serializer: value => JSON.stringify(value),
      openObserver: { next: () => {/* connected */} },
      closeObserver: { next: () => { this.socket = undefined; } }
    });

    this.socket.subscribe({
      next: (msg) => this.events$.next(msg as ServerMessage),
      error: (err) => this.events$.next({ type: 'ERROR', payload: 'WebSocket error' + err}),
      complete: () => { /* closed */ }
    });
  }
}
