import {Injectable, signal} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {Observable, Subject} from 'rxjs';
import {MessageType} from '../models/message.model';

export type Role = 'SCREEN' | 'PLAYER';

export interface ClientMessage {
  role: Role;
  messageType: MessageType;
  payload: string | null;
}

export interface ServerMessage<T = any> {
  type: MessageType;
  payload?: T;
}

@Injectable({ providedIn: 'root' })
export class GameWebSocketService {
  private socket?: WebSocketSubject<any>;
  private events$ = new Subject<ServerMessage>();

  /** Change this to your backend host */
  private wsUrl = `ws://localhost:8080/ws`;
  private role = signal<'SCREEN' | 'PLAYER' | null>(null);

  getRole(){
    return this.role();
  }

  connectAsScreen(): void {
    this.ensureConnected();
    const msg: ClientMessage = { role: 'SCREEN', messageType: MessageType.CONNECT, payload: null };
    this.socket!.next(msg);
    this.role.set('SCREEN');
  }

  connectAsPlayer(username: string): void {
    this.ensureConnected();
    const msg: ClientMessage = { role: 'PLAYER', messageType: MessageType.CONNECT, payload: username };
    this.socket!.next(msg);
    this.role.set('PLAYER');
  }

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
      error: (err) => this.events$.next({ type: MessageType.ERROR, payload: 'WebSocket error' + err}),
      complete: () => { /* closed */ }
    });
  }
}
