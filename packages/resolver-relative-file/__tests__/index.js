import assert from 'assert';
import relativeFile from '../index';

describe('relative-file', () => {
  const path = '/octo/file.txt';

  it('resolves local file', () => {
    assert.deepStrictEqual(
      relativeFile({ path, target: '/foo.txt' }),
      '{BASE_URL}/octo/foo.txt',
    );
  });
});
