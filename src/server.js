import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import bodyParser from 'body-parser';
import { storeGetComments} from './scripts/stores'


storeGetComments.subscribe(val => {
console.log(`🚀 ~ file: server.js ~ line 10 ~ val`, val)
	
})
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
    sirv('static', { dev }),
    bodyParser.json(),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
