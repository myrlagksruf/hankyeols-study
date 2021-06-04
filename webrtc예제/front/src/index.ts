import { Manager } from 'socket.io-client';
import './index.css';
const $:typeof document.querySelector = document.querySelector.bind(document);

const remoteView = $<HTMLVideoElement>('#remote');
const selfView = $<HTMLVideoElement>('#self');

const path = location.pathname.match(/\/proxy\/\d+/)?.[0] ?? '';

const origin = `${location.origin}${path}`;


const manager = new Manager(origin, {
    path: `${path}/socket.io`
});

const socket = manager.socket(`/api`);

const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const pc = new RTCPeerConnection(configuration);

// Send any ice candidates to the other peer.

const start = async () => {
    try {
        // Get local stream, show it in self-view, and add it to be sent.
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream)
        });
        selfView.srcObject = stream;
    } catch (err) {
        console.error(err);
    }
};

pc.addEventListener('negotiationneeded', async () => {
    try {
        await pc.setLocalDescription(await pc.createOffer());
        // Send the offer to the other peer.
        const data = pc.localDescription.toJSON();
        socket.emit('desc', data);
    } catch (err) {
        console.error(err);
    }
});

pc.addEventListener('icecandidate', e => {
    if(e.candidate){
        const data = e.candidate.toJSON();
        socket.emit('cand', data);
    }
});

pc.addEventListener('track', e => {
    if (remoteView.srcObject) return;
    remoteView.srcObject = e.streams[0];
});

socket.on('desc', async e => {
    if (e.type === 'offer') {
        // 제안 받음
        await pc.setRemoteDescription(e);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream)
        });
        selfView.srcObject = stream;
        await pc.setLocalDescription(await pc.createAnswer());
        const data = pc.localDescription.toJSON();
        socket.emit('desc', data);
    } else if (e.type === 'answer') {
        // 받았음
        await pc.setRemoteDescription(e);
    } else {
        console.log('Unsupported SDP type.');
    }
});

socket.on('dis', e => {
    document.body.innerHTML = '<h1 style="color:red">연결이 끊겼습니다.</h1>';
});

socket.on('start', start);

socket.on('cand', async e => {
    try{
        await pc.addIceCandidate(e);
    } catch(err){
        console.log(err, e);
    }
});