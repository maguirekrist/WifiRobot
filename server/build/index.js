"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const WifiRun_1 = require("./models/WifiRun");
const TCPServer_1 = require("./servers/TCPServer");
const TcpMapDelegate_1 = __importDefault(require("./TcpDelegates/TcpMapDelegate"));
const TcpWifiDelegate_1 = __importDefault(require("./TcpDelegates/TcpWifiDelegate"));
const db_url = 'mongodb://localhost:27017';
const db_name = 'bot_db';
const socketServer = new TCPServer_1.TCPServer(new TcpMapDelegate_1.default());
const wifiServer = new TCPServer_1.TCPServer(new TcpWifiDelegate_1.default());
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(`${db_url}/${db_name}`);
        mongoose_1.default.connection.db.dropDatabase();
        console.log("Connected sucessfully to Mongodb");
    });
}
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
//GET: The Turtlebot's most recent wifi poll
app.get('/api/wifi/:runId/latest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let latestRun = yield WifiRun_1.WifiRun.findOne({ _id: req.params.runId });
    res.send("on prog.");
}));
app.get(`/api/wifi/:runId`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield WifiRun_1.WifiRun.find({ _id: req.params.runId }));
}));
app.get(`/api/runs`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield WifiRun_1.WifiRun.find().sort({ ranOn: -1 }).select({ name: 1, _id: 1 }));
}));
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDb();
    socketServer.listen();
    wifiServer.listen();
    console.log('The application is listening on port 3000');
}));
