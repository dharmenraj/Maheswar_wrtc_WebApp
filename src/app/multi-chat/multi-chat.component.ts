import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as io from "socket.io-client";
import { ChatService } from "src/app/services/chat.service";

@Component({
  selector: 'app-multi-chat',
  templateUrl: './multi-chat.component.html',
  styleUrls: ['./multi-chat.component.scss']
})
export class MultiChatComponent implements OnInit {
  userName: string;
  @Input() value: string;
  openChat: boolean;
  message: any;
  messages: any = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.userName = this.value;
    this.getMessage();
  }

  sendMessage() {
    let userData = {
      name:this.userName,
      message:this.message
    }
    this.chatService.sendMessage(userData);
    this.message = '';
  }

  getMessage() {
    let chatMessage;
    this.chatService.getMessages().subscribe((message: string) => {
        // console.log(message)
        this.messages.push(message);
        this.openChat = true;
      });
    console.log("sadsad++++", this.messages)
  }

  openChatBox() {
    this.openChat = !this.openChat;
  }

}