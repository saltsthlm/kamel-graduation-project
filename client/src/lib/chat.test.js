const chat = require('./chat');

describe('The updateMessages function', () => {
  it('should add a parcel to a sender-specific list', () => {
    const parcel = {
      test: 'test',
      senderId: '123',
    };

    const output = {
      [parcel.senderId]: [parcel],
    }
    expect(chat.updateChatMessages({}, parcel)).toEqual(output);
  });

  it('should add a parcels from different senders to separate lists', () => {
    const parcel1 = {
      test: 'test',
      senderId: '123',
    };

    const parcel2 = {
      test: 'test',
      senderId: '456',
    };

    const output = {
      [parcel1.senderId]: [parcel1],
      [parcel2.senderId]: [parcel2],
    }

    const step1 = chat.updateChatMessages({}, parcel1);
    const step2 = chat.updateChatMessages(step1, parcel2);

    expect(step2).toEqual(output);
  });

  it('should add multiple parcels from the same sender to the same list', () => {
    const parcel1 = {
      test: 'test',
      senderId: '123',
    };

    const parcel2 = {
      test: 'test',
      senderId: '123',
    };

    const output = {
      [parcel1.senderId]: [parcel1, parcel2],
    }

    const step1 = chat.updateChatMessages({}, parcel1);
    const step2 = chat.updateChatMessages(step1, parcel2);

    expect(step2).toEqual(output);
  });
});
