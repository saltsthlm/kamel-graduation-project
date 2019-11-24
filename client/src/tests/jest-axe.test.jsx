"use strict";
const React = require("react");
const App = require("./../App").default;
const { render, cleanup } = require("@testing-library/react");
const { axe, toHaveNoViolations } = require("jest-axe");

expect.extend(toHaveNoViolations);

it("should demonstrate this matcher`s usage with react testing library", async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  cleanup();
});
