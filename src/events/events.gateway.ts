import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(client.id, '--------Connected');
        client.join("chat1")
        this.server.to('chat1').emit("newMess", { id: client.id })
    }

    handleDisconnect(client: Socket) {

        console.log(client.id, '------Disconnect');
    }

    @SubscribeMessage('events')
    sendMess(client: Socket) {

    }
}