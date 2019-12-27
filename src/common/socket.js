import config from './ev'
// import tmpVue from './tmpVue'

export default function () {
	var Socket = {
		socket: '',
		sendData: [],
		fileReader: null,
		blobList: [],
		initSocket () {
            let options = ['chat','gzip-no']
            
            this.socket = new WebSocket(config.ws);
            
			this.socket.onopen = this.onopen.bind(this);
			this.socket.onclose = this.onclose;
			this.socket.onerror = this.onerror;
			this.socket.onmessage = this._onmessage.bind(this);
			return this;
		},
		_onmessage (msg) {
			Socket.onmessage && Socket.onmessage(msg.data)
            console.log(msg.data)
            this._emit('message',JSON.parse(msg.data))
		},
		onopen () {
            // this._emit('open')
            
		},
		onerror (err) {
			console.log(err)
		},
		onclose (err) {
			console.log(err)
			// console.log('on....onclose')
		},
		send (data) {
			// console.log('on......send')
			this.socket.send(JSON.stringify(data))
        },
        // _emit(event,data){
        //     tmpVue.$emit(event,data)
        // },
        // _on(event,callback){
        //     tmpVue.$on(event,callback)
        // }
	}
	return Socket;
};