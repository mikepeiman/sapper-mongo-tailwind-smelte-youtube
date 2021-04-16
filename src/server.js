import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import bodyParser from 'body-parser';
import { storeGetComments } from './scripts/stores'

const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);



const exec = require('child_process').exec;
const execFile = require("child_process").execFile;
const spawn = require("child_process").spawn;
const execSync = require('child_process').execSync;
const execFileSync = require("child_process").execFileSync;
const spawnSync = require("child_process").spawnSync;
let cwd = process.cwd()



function getComments(cmd) {
	exec(cmd, (err, stdout, stderr) => {
		if (err || stderr) {
			console.log(`🚀 ~ file: server.js ~ line 15 ~ exec ~ err`, err)
			console.log(`🚀 ~ file: server.js ~ line 15 ~ exec ~ stderr`, stderr)
		}
		console.log(`execProcess result: `, stdout)
		process.stdout.on('data', data => {
        console.log(`🚀 ~ file: server.js ~ line 32 ~ exec ~ data`, data)
			
		})
	});
}


function getComments2(cmd) {
    console.log(`🚀 ~ file: server.js ~ line 36 ~ getComments2 ~ cmd`, cmd)
	let child = spawn(cmd)

	child.stdout.on('data', (data) => {
		console.log(`child stdout:\n${data}`);
	});

	child.stderr.on('data', (data) => {
		console.error(`child stderr:\n${data}`);
	});
}
function exec1(cmd) {
	exec('python2', (e, stdout, stderr) => {
		if (e instanceof Error) {
			console.error(e);
			throw e;
		}
		console.log('stdout ', stdout);
		console.log('stderr ', stderr);
		// venv2()
	})
}

function venvb(cmd) {
	let child = spawn('.\\venv\\Scripts\\activate.bat')

	child.stdout.on('data', (data) => {
		console.log(`child stdout:\n${data}`);
	});

	child.stderr.on('data', (data) => {
		console.error(`child stderr:\n${data}`);
	});
	// venv2()
	process.stdin.pipe('youtube-comment-downloader --youtubeid BiqDZlAZygU --output BiqDZlAZygU.json')
}


function spawn1(cmd) {
	let child = spawn('python2', { cwd })
	child.stdout.on('data', data => {
		console.log(`🚀 ~ file: server.js ~ line 44 ~ venv2 ~ data`, data)
	})
	child.stderr.on('error', data => {
		console.log(`🚀 ~ file: server.js ~ line 47 ~ venv2 ~ data`, data)
	})
	child.stderr.on('close', () => {
		console.log("Closed");
	});
}

function venv3(cmd) {

	console.log(`🚀 ~ file: server.js ~ line 63 ~ venv3 ~ cwd`, cwd)
	let res = spawn('.\\venv\\Scripts\\activate.bat', ['youtube-comment-downloader', '--youtubeid BiqDZlAZygU', '--output BiqDZlAZygU.json'], { cwd })
	console.log(`🚀 ~ file: server.js ~ line 65 ~ venv3 ~ res`, res)
	res.stderr.on('error', data => {
		console.log(`🚀 ~ file: server.js ~ line 47 ~ venv2 ~ data`, data)
	})
	res.stdout.on('spawn', data => {
		console.log(`🚀 ~ file: server.js ~ on:spawn ~ venv2 ~ data`, data)
	})
	res.stderr.on('spawn', data => {
		console.log(`🚀 ~ file: server.js ~ on:spawn ~ venv2 ~ data`, data)
	})
	res.stdout.on('data', data => {
		console.log(`🚀 ~ file: server.js ~ line 44 ~ venv2 ~ data`, data)
	})

	res.stderr.on('close', data => {
		console.log("Closed with exit code:: ", data);
	});
}

function venv4(cmd) {
	let res = exec('.\\venv\\Scripts\\activate', { args: ['youtube-comment-downloader', '--youtubeid BiqDZlAZygU', '--output BiqDZlAZygU.json'] })
	res.stdout.on('data', data => {
		console.log(`🚀 ~ file: server.js ~ line 44 ~ venv2 ~ data`, data)
	})
	res.stderr.on('error', data => {
		console.log(`🚀 ~ file: server.js ~ line 47 ~ venv2 ~ data`, data)
	})
	res.stderr.on('close', () => {
		console.log("Closed");
	});
	console.log('stdout ', stdout);
	console.log('stderr ', stderr);
}

function spawnProcess(cmd) {
	const spawn = require("child_process").spawn;
	spawn(cmd)
}


io.on('connection', (socket) => {
	console.log('SERVER user connected');
	console.log(`🚀 ~ file: server.js ~ line 13 ~ io.on ~ socket.id `, socket.id)
	socket.on("message", msg => {
		console.log(`🚀 ~ file: server.js ~ line 25 ~ msg`, msg)

	})

	socket.on("activate venv", msg => {
		console.log(`🚀 ~ file: server.js ~ line 21 ~ io.on ~ msg`, msg)
		exec1(msg)
	})

	socket.on("get comments", msg => {
		console.log(`🚀 ~ file: server.js ~ line 21 ~ io.on ~ msg`, msg)
		getComments(msg)
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
