import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { TYPE_NOTIFY } from "src/common/enum";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { AuthService } from "src/modules/auth/auth.service";
// import redisClient from '../config/database/redis';
import * as origin from '../config/origin/config.json';
@WebSocketGateway({
    cors: true
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private authService: AuthService
    ) { }
    @WebSocketServer()
    server: Server;

    redisPrefix = 'socket:'

    users = new Map();

    @UseGuards(JwtAuthGuard)
    async handleConnection(client: Socket) {
        let token = (client.handshake.query.token);
        let user = await this.authService.verifyAccessToken((token as string));
        if (!user) {
            return client.disconnect()
        }
        client.handshake.query.userId = user.id;
        if (!this.users.get(`room:${user.id}`)) {
            let setUser = new Set();
            setUser.add(client.id);
            this.users.set('room:' + user.id, setUser)
        } else {
            let setUser = this.users.get('room:' + user.id);
            setUser.add(client.id);
            this.users.set('room:' + user.id, setUser);
        }
        console.log(this.users);

        client.join(`room:${user.id}`)
    }

    async handleDisconnect(client: Socket) {
        try {
            let setUser = this.users.get('room:' + client.handshake.query.userId);
            if (setUser) {
                setUser.delete(client.id)
            }
            if (this.users.get('room:' + client.handshake.query.userId).size <= 0) {
                this.users.delete('room:' + client.handshake.query.userId)
            }
            client.disconnect(true);
        } catch (error) {
            console.log(error);
        }
    }

    newComment(idComment: number, data) {
        this.server.to(`${idComment}`).emit("new-comment", data)
    }
    @SubscribeMessage('events')
    sendMess(client: Socket) {

    }

    async sendNotificationToUser(idUsers: number[], nofti, type?: TYPE_NOTIFY) {
        if (type == TYPE_NOTIFY.SYSTEM) {
            return this.server.emit("new-notification", { data: nofti })
        }
        for (let i of idUsers) {
            this.server.to('room:' + i['id']).emit("new-notification", { data: nofti })
        }
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