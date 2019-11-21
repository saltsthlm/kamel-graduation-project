import Chat from './Chat';
import WebSocket from 'websocket';
import ShallowRenderer from 'react-test-renderer/shallow';
import uuid from 'uuid/v4';
import React from 'react';

const renderer = new ShallowRenderer();

const userId = uuid();
const socket = new WebSocket.client();

describe('The Chat component', () => {
  it('should have two children', () => {
    renderer.render(<Chat
      userId={userId}
      socket={socket} />);

    const component = renderer.getRenderOutput();
    const children = component.props.children;

    expect(children.length).toBe(3);
  });
});
