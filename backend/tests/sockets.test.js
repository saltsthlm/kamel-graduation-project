const WebSocketClient = require('websocket').client;
const uuid = require('uuid/v4');
const assert = require('assert');
require('dotenv').config();

const app = require('../src/app');

const socketId = uuid();
const PORT = 8080;
let client;
let server;
let connect;

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

console.log(process.env.GOOGLE_KEY);

afterEach(() => {
  connect.close();
  server.close();
});

describe('The /socket routes', () => {
  it('should allow for connections on dynamic endpoints', async (done) => {
    client.on('connect', (connection) => {
      connect = connection;
      done();
    });
    client.connect(`ws://localhost:${PORT}/socket/${socketId}`, 'echo-protocol');
  });

  it('should send a list of connected clients on connect ', async (done) => {
    client.on('connect', (connection) => {
      connect = connection;

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

  it('should allow to send a direct message between two clients', async (done) => {
    client.on('connect', (connection) => {
      connect = connection;
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
      connect = connection;
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
});
