import express from 'express';
import mongoose from 'mongoose';
import { WifiRun } from './models/WifiRun';
import { TCPServer } from './servers/TCPServer';
import TcpMapDelegate from './TcpDelegates/TcpMapDelegate';
import TcpWifiDelegate from './TcpDelegates/TcpWifiDelegate';
import * as dotenv from 'dotenv'
import { CreateMockWifiRun } from './utils/mock';
dotenv.config()

const db_url = 'mongodb://localhost:27017';
const db_name = 'bot_db'

const socketServer = new TcpMapDelegate();
const wifiServer = new TcpWifiDelegate();

async function connectDb() {
	try {
		await mongoose.connect(`${db_url}/${db_name}`);
	} catch(err) {
		console.error(err)
	}
	mongoose.connection.db.dropDatabase();
	console.log("Connected sucessfully to Mongodb");
}

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

//GET: The Turtlebot's most recent wifi poll
app.get('/api/wifi/:runId/latest', async (req, res) => {
	try {
		let latestRun = await WifiRun.findOne({ _id: req.params.runId });
	} catch(err) {
		res.sendStatus(404);
	}
	res.send("on prog.");
})

app.get(`/api/wifi/:runId`, async (req, res) => {
	try {
		res.send(await WifiRun.find({ _id: req.params.runId }));
	} catch(err) {
		res.sendStatus(404)
	}
})

app.get(`/api/runs`, async(req, res) => {
	res.send(await WifiRun.find().sort({ ranOn: -1 }))
})

app.listen(3000, async () => {
	await connectDb();

	if(process.env.USE_MOCK == "true") {
		await upsertMockData();
	}

	// await connectDb();
	socketServer.listen();
	wifiServer.listen();
	console.log('The application is listening on port 3000');
});

async function upsertMockData() {
	//Create a mock run
	let wifiRun = CreateMockWifiRun();
	const run = new WifiRun(wifiRun);
	await run.save()
}