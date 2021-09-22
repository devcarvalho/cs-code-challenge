const { expect } = require('@jest/globals');

const { getUsers } = require('./app');

test('First user fetched should be Ryann Wiegand', () => {
  expect.assertions(1);
  return getUsers.then((data) => {
    expect(data[0].name).toEqual('Ryann Wiegand');
  });
});
