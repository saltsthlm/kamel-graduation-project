'use strict';
const parcels = require('../../lib/parcels');

const senderId = 'Moritz';
const receiverId = 'Not Moritz';
const type = 'TEST PARCEL';

describe('The getNewParcel function', () => {

  it('should return a parcel with all baseline parameters', () => {
    const parcel = parcels.getNewParcel(type, senderId, receiverId);
    expect(parcel.senderId).toBe(senderId);
    expect(parcel.receiverId).toBe(receiverId);
    expect(parcel.type).toBe(type);
    expect(parcel.timeStamp).toBeDefined();
  });

  it('should add arbitrary kwargs to the parcel', () => {
    const age = 56;
    const ids = ['1', '2', ['3', 6]];
    const dict = { age, ids };
    const kwargs = { age, ids, dict };

    const parcel = parcels.getNewParcel(type, senderId, receiverId, kwargs);
    expect(parcel.age).toBe(age);
    expect(parcel.ids).toBe(ids);
    expect(parcel.dict).toBe(dict);
  });

  it('should give precedence to kwargs over baseline parameters', () => {
    const senderId = '1';
    const kwargs = { senderId: '2' };
    const parcel = parcels.getNewParcel(type, senderId, receiverId, kwargs);
    expect(parcel.senderId).toBe('2');
  });
});
