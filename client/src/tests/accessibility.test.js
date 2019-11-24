'use strict';
const React = require('react');
const App = require('./../App').default;
const { render, cleanup } = require('@testing-library/react');
const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

describe('the jest-axe accessibility test', () => {

  it('should report no violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    cleanup();
  });
});


