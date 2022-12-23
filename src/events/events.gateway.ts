import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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
        client.disconnect(true);
    }

    newComment(idComment: number, data) {
        this.server.to(`${idComment}`).emit("new-comment", data)
    }
    @SubscribeMessage('events')
    sendMess(client: Socket) {

    }

    @SubscribeMessage("join-room")
    joinGroupComment(client: Socket, data: any) {
        let groupId = data.groupId;
        client.join(groupId);
    }

    @SubscribeMessage("on-typing")
    onTyping(client: Socket, data: any) {
        let groupId = data.groupId;
        let nickName = data.nickName;
        client.to(groupId).emit("on-typing", { nickName: nickName, typing: true })
    }
}