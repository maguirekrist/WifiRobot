import net from 'net'
import { IOccupancyGrid } from '../models/OccupancyGrid';

var buffer = Buffer.from("");

const client = net.createConnection({ port: 3001, host: '192.168.1.76', allowHalfOpen: true }, () => {
    console.log('Connected to server');
    
    // Send a message to the server
    client.write('Hello, server!');
});
  

client.on('data', (data) => {
    console.log(client.writableLength)
    if(data.byteLength > client.writableHighWaterMark) {
    }
    console.log('Received data of size: ' + data.byteLength)
    // if(data.toString()[data.length - 1] == '}') {
    //     let map:IOccupancyGrid = JSON.parse(data.toString());
    //     console.log(`Received map of ${map.width} width and ${map.height} height`)
    // }
});

client.on('drain', () => {
    console.log("DRAIN EVENT")
})


  
client.on('end', () => {
    console.log('Disconnected from server');
});

