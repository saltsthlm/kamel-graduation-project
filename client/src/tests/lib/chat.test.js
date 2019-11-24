'use strict';
const chat = require('./chat');

const parcel1 = {
  test: 'test',
  senderId: '123',
};

const parcel2 = {
  test: 'test',
  senderId: '456',
};

describe('The updateMessages function', () => {

  it('should add a parcel to a sender-specific list', () => {
    const output = {
      [parcel1.senderId]: [parcel1],
    }
    expect(chat.updateChatMessages({}, parcel1)).toEqual(output);
  });

  it('should add the respective parcels from different senders to separate lists', () => {
    const output = {
      [parcel1.senderId]: [parcel1],
      [parcel2.senderId]: [parcel2],
    }
    const step1 = chat.updateChatMessages({}, parcel1);
    const step2 = chat.updateChatMessages(step1, parcel2);
    expect(step2).toEqual(output);
  });

  it('should add multiple parcels from the same sender to the same list', () => {
    const output = {
      [parcel1.senderId]: [parcel1, parcel2],
    }
    const step1 = chat.updateChatMessages({}, parcel1);
    const step2 = chat.updateChatMessages(step1, parcel2);
    expect(step2).toEqual(output);
  });
});
