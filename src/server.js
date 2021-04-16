import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import bodyParser from 'body-parser';
import { storeGetComments } from './scripts/stores'

const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

io.on('connection', (socket) => {
	console.log('SERVER user connected');
	console.log(`🚀 ~ file: server.js ~ line 13 ~ io.on ~ socket.id `, socket.id)
	socket.on("message", msg => {
		console.log(`🚀 ~ file: server.js ~ line 25 ~ msg`, msg)
	
	})
});

io.on('disconnection', (socket) => {
    console.log(`🚀 ~ file: server.js ~ line 17 ~ io.on ~ socket`, socket)
	console.log('SERVER user disconnected');
});


storeGetComments.subscribe(val => {
	console.log(`🚀 ~ file: server.js ~ line 10 ~ val`, val)

})
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka({ server }) // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		bodyParser.json(),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
