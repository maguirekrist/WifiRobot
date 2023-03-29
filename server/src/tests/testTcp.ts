import net from 'net'
import { IOccupancyGrid } from '../models/OccupancyGrid';

var buffer = Buffer.from("");

const client = net.createConnection({ port: 3001, host: '192.168.1.81', allowHalfOpen: true }, () => {
    console.log('Connected to server');
    
    // // Send a message to the server
    // client.write('Hello, server!');
});
  

client.on('data', (data) => {
    console.log('Received data of size: ' + data.byteLength)
    if(data.toString().slice(-3) == 'end') {
        console.log("Got map")
    }
});

client.on('drain', () => {
    console.log("DRAIN EVENT")
})


  
client.on('end', () => {
    console.log('Disconnected from server');
});

