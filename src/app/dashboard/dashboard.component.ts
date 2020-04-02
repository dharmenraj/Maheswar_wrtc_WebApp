import { Component, OnInit, ViewChild } from '@angular/core';
import * as RecordRTC from 'recordrtc'
import { ChatService } from "src/app/services/chat.service";
declare const RTCMultiConnection: any;
declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chatData: { name: any; userId: any; room: any; };
  userName: any;
  message: string;
  messages: any;
  connection = new RTCMultiConnection();
  video: any;
  profileName: any;
  videoConference: boolean;
  recorder: any;
  openChat: boolean = false;
  roomId: any = "myRoomId"

  constructor() {
    this.showInsideDiv();
  }

  ngOnInit(): void {

    // this line is VERY_important 
    this.connection.socketURL = 'http://localhost:3000/';
    // this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    // if you want audio+video conferencing
    this.connection.session = {
      audio: true,
      video: true
    };

    this.connection.extra.roomOwner = false;

    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };

    this.connection.iceServers = [{
      'urls': [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.l.google.com:19302?transport=udp',
      ]
    }];

  }

  openRoom() {
    this.connection.extra.userName = this.userName;
    this.connection.extra.roomOwner = true;
    this.getChatHandler(this.userName);    
    this.connection.open(this.roomId, function (isRoomOpened, roomid, error, event) {
      // console.log(event)
      if (error) {
        alert(error);
      }
    });
    this.videoConference = true;
    document.body.style.backgroundColor = "white";
  }

  joinRoom() {
    this.connection.extra.userName = this.userName;
    this.getChatHandler(this.userName);    
    this.connection.join(this.roomId, function (isRoomJoined, roomid, error) {
      if (error) {
        alert(error);
      }
    });
    this.videoConference = true;
    document.body.style.backgroundColor = "white";
  }


  showInsideDiv() {
    let count = 0;
    this.connection.onstream = function (event) {
      if (event.extra.roomOwner === true) {
        // this.profileName = event.extra.userName
        this.video = document.getElementById('main-video');
        this.video.setAttribute('data-streamid', event.streamid);
        this.video.srcObject = event.stream;
        $('#main-video').prepend(this.video);

      } else if (event.extra.roomOwner === false) {
        count = count + 1;
        console.log("--------------", event.userid)
        // for alternate video layout on view page
        if (count % 2 !== 0) {
          // this.profileName = event.extra.userName;
          var otherVideos = document.querySelector('#other-videos');
          otherVideos.appendChild(event.mediaElement);
        } else {
          // this.profileName = event.extra.userName;
          var nextVideos = document.querySelector('#next-videos');
          nextVideos.appendChild(event.mediaElement);
        }
      }
      // over here

      // start recording
      $('#startRecording').on('click', function () {
        document.getElementById('startRecording').style.display = "none";
        document.getElementById('btnStopRecording').style.display = "block";
        this.startRecordingBtn = true;
        this.recorder = RecordRTC([event.stream], {
          type: 'video',
          // canvas: {
          //   width: 1250,
          //   height: 700
          // },
        });
        this.recorder.startRecording();
        let recordedData = this.recorder;

        // cancel recording
        $('#btnStopRecording').on('click', function () {
          document.getElementById('startRecording').style.display = "block";
          document.getElementById('btnStopRecording').style.display = "none";
          recordedData.stopRecording(function () {
            var blob = recordedData.getBlob();
            console.log("+++++++++++", blob)
            window.open(URL.createObjectURL(blob));
          });
        })
      })
      // $('video').removeAttr( 'controls' );
    };
  }

  getChatHandler = (name) =>{
    console.log("name++++++++", name)
    this.profileName = name;
  }

}