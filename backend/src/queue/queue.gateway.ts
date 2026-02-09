import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Queue } from './queue.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitQueueCreated(queue: Queue) {
    this.server.emit('queue:created', queue);
  }

  emitQueueCalled(queue: Queue) {
    this.server.emit('queue:called', queue);
  }

  emitQueueCompleted(queue: Queue) {
    this.server.emit('queue:completed', queue);
  }

  emitQueueUpdated(queue: Queue) {
    this.server.emit('queue:updated', queue);
  }

  emitQueueReannounce(queue: Queue) {
    this.server.emit('queue:reannounce', queue);
  }
}
