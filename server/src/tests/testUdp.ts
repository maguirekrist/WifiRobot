import dgram from 'node:dgram'

const client = dgram.createSocket({ type: 'udp4' })

client.on('message',function(msg,info){
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n',msg.length,    info.address, info.port);
});

var data = Buffer.from('Hi I m the client 1');

client.send(data,3001,'localhost',function(error){
    if(error){
        console.log(error);
        client.close();
    }else{
        console.log('Data is sent !');
    }
});