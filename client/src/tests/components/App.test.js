// 'use strict';
// const React = require('react');
// const App = require('../../App').default;
// const { BrowserRouter: Router } = require('react-router-dom');
// const { render, fireEvent, cleanup, wait } = require('@testing-library/react');
// const { toBeInTheDocument, toHaveClass } = require('@testing-library/jest-dom');

// expect.extend({ toBeInTheDocument, toHaveClass })

// afterEach(cleanup);

// it('should be able to login', async () => {
//   const { getAllByText, getByLabelText } = render(
//     <Router>
//       <App />
//     </Router>
//   );

//   const [, loginButton] = getAllByText(/^login$/i);

//   expect(loginButton).toBeInTheDocument();

//   // window.fetch = jest.fn((...args) => {
//   //   console.log(args);
//   // });

//   fireEvent.click(loginButton);

//   await wait(() => getByLabelText(/select/i));
//   // getByLabelText(document.body, 'username').value = 'chucknorris'

//   // await wait();

//   // getAllByText(/select/i);

// });