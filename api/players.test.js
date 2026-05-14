const handler = require('./players');

describe('GET /api/players', () => {
  let req, res;

  beforeEach(() => {
    req = { method: 'GET' };
    res = {
      _data: null,
      _status: 200,
      status(code) { this._status = code; return this; },
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

  test('rejects non-GET methods with 405', () => {
    req.method = 'POST';
    handler(req, res);
    expect(res._status).toBe(405);
    expect(res._data).toHaveProperty('error');
  });
});
