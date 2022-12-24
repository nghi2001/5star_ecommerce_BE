import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { AuthService } from "src/modules/auth/auth.service";
import redisClient from '../config/database/redis';
@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private authService: AuthService
    ) { }
    @WebSocketServer()
    server: Server;

    redisPrefix = 'socket:'

    @UseGuards(JwtAuthGuard)
    async handleConnection(client: Socket) {
        let token = (client.handshake.query.token);
        let user = await this.authService.verifyAccessToken((token as string));
        if (!user) {
            return client.disconnect()
        }
        client.handshake.query.userId = user.id
        await redisClient.sadd(`${this.redisPrefix}${user.id}`, [client.id]);
        client.join(`room:${user.id}`)
    }

    async handleDisconnect(client: Socket) {
        await redisClient.srem(this.redisPrefix + client.handshake.query.userId as string, client.id);
        client.disconnect(true);
    }

    newComment(idComment: number, data) {
        this.server.to(`${idComment}`).emit("new-comment", data)
    }
    @SubscribeMessage('events')
    sendMess(client: Socket) {

    }

    async sendNotificationToUser(idUser, nofti) {
        this.server.to('room:' + idUser).emit("new-notification", { data: nofti })
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