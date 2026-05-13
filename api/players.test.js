const handler = require('./players');

describe('GET /api/players', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      _data: null,
      json(data) { this._data = data; }
    };
  });

  test('responds with object containing message key', () => {
    handler(req, res);
    expect(res._data).toHaveProperty('message');
  });

  test('message is an array', () => {
    handler(req, res);
    expect(Array.isArray(res._data.message)).toBe(true);
  });

  test('players array is non-empty', () => {
    handler(req, res);
    expect(res._data.message.length).toBeGreaterThan(0);
  });
});
