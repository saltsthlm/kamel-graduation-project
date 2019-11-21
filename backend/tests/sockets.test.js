`use strict`;
const WebSocketClient = require('websocket').client;
const uuid = require('uuid/v4');
const app = require('../src/app');
require('dotenv').config();

let client;
let server;
let clientConnection;

const socketId = uuid();
const PORT = 8888;

const testParcel = {
  message: 'Hi',
  receiverId: socketId,
  senderId: socketId,
  type: 'DIRECT MESSAGE',
  timeStamp: Date.now(),
};

beforeEach((done) => {
  client = new WebSocketClient();
  server = app.listen(PORT, done);
});

afterEach((done) => {
  clientConnection.close();
  server.close(done);
});

describe('The /socket routes', () => {

  it('should allow for connections on dynamic endpoints', (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;
      done();
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should send a list of connected clients on connect ', (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;

      connection.on('close', () => done());

      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        expect(parcel.type).toEqual('UPDATE CONTACTLIST');
        expect(parcel.connectedClients).toEqual([socketId]);
        // expect(parcel.receiverId).toEqual('hi');
        if (parcel.type === 'UPDATE CONTACTLIST') {
          connection.close();
        }
      });
    });

    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should send a list of connected clients on demand ', (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;

      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        expect(parcel.type).toEqual('UPDATE CONTACTLIST');
        expect(parcel.connectedClients).toEqual([socketId]);
        expect(parcel.receiverId).toEqual(socketId);
        done();
      });

      connection.send(JSON.stringify({
        ...testParcel,
        type: 'REQUEST CONTACT LIST UPDATE',
      }));
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should allow to send a direct message between two clients', (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;
      connection.send(JSON.stringify(testParcel));

      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        if (parcel.type === 'DIRECT MESSAGE') {
          expect(parcel.message).toEqual(testParcel.message);
          expect(parcel.receiverId).toEqual(testParcel.receiverId);
          expect(parcel.senderId).toEqual(testParcel.senderId);
          expect(parcel.timeStamp).toEqual(testParcel.timeStamp);
          done();
        };
      });
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should allow for direct messages to be translated', (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;
      connection.send(JSON.stringify(testParcel));

      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        if (parcel.type === 'DIRECT MESSAGE') {
          expect(parcel.translatedMessage).toEqual('Hej');
          done();
        }
      });
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should allow for multiple clients to connect', (done) => {
    const client2 = new WebSocketClient();
    const socketId2 = uuid();

    client.on('connect', (connection) => {
      clientConnection = connection;
      client2.connect(`ws://localhost:${PORT}/socket/${socketId2}`, 'echo-protocol');
    });

    client2.on('connect', (connection) => {
      connection.on('message', () => {
        connection.close();
      });
      connection.on('close', () => {
        done();
      });
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should communicate connected clients to all clients', (done) => {
    const client2 = new WebSocketClient();
    const socketId2 = uuid();

    client.on('connect', (connection) => {
      clientConnection = connection;
      client2.connect(`ws://localhost:${PORT}/socket/${socketId2}`, 'echo-protocol');
    });

    client2.on('connect', (connection) => {
      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        if (parcel.type === 'UPDATE CONTACTLIST') {
          expect(parcel.connectedClients).toEqual([socketId, socketId2]);
          expect(parcel.receiverId).toEqual(socketId2);
          connection.close();
        }
      });

      connection.on('close', () => {
        done();
      });
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });
});
