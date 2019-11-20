const WebSocketClient = require('websocket').client;
const uuid = require('uuid/v4');
const assert = require('assert');
require('dotenv').config();

const app = require('../src/app');

const socketId = uuid();
const PORT = 8888;
let client;
let server;
let clientConnection;

const testParcel = {
  message: 'Hi',
  receiverId: socketId,
  senderId: socketId,
  type: 'DIRECT MESSAGE',
  timeStamp: Date.now(),
};

beforeEach(() => {
  server = app.listen(PORT);
  client = new WebSocketClient();
});

afterEach(() => {
  clientConnection.close();
  server.close();
});

describe('The /socket routes', () => {
  it('should allow for connections on dynamic endpoints', async (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;
      done();
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should send a list of connected clients on connect ', async (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;

      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        if (parcel.type === 'UPDATE CONTACTLIST') {
          assert.deepStrictEqual(parcel.connectedClients, [socketId]);
          assert.deepStrictEqual(parcel.receiverId, socketId);
          done();
        }
      });
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should send a list of connected clients on demand ', async (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;

      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        if (parcel.type === 'UPDATE CONTACTLIST') {
          assert.deepStrictEqual(parcel.connectedClients, [socketId]);
          assert.deepStrictEqual(parcel.receiverId, socketId);
          done();
        }
      });

      connection.send(JSON.stringify({
        ...testParcel,
        type: 'REQUEST CONTACT LIST UPDATE',
      }));
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should allow to send a direct message between two clients', async (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;
      connection.send(JSON.stringify(testParcel));

      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        if (parcel.type === 'DIRECT MESSAGE') {
          assert.deepStrictEqual(parcel.message, testParcel.message);
          assert.deepStrictEqual(parcel.receiverId, testParcel.receiverId);
          assert.deepStrictEqual(parcel.senderId, testParcel.senderId);
          assert.deepStrictEqual(parcel.timeStamp, testParcel.timeStamp);
          done();
        }
      });
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should allow for direct messages to be translated', async (done) => {
    client.on('connect', (connection) => {
      clientConnection = connection;
      connection.send(JSON.stringify(testParcel));

      connection.on('message', (message) => {
        const parcel = JSON.parse(message.utf8Data);
        if (parcel.type === 'DIRECT MESSAGE') {
          assert.deepStrictEqual(parcel.translatedMessage, 'Hej');
          done();
        }
      });
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should allow for multiple clients to connect', async (done) => {
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

  it('should communicate connected clients to all clients', async (done) => {
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
          assert.deepStrictEqual(parcel.connectedClients, [socketId, socketId2]);
          assert.deepStrictEqual(parcel.receiverId, socketId2);
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
