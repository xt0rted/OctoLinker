import helperProcessYaml from '../index';

describe('helper-process-yaml', () => {
  let plugin;
  let blob;
  let config;
  let yaml;

  beforeEach(() => {
    plugin = jest.fn();
    yaml = 'dependencies: foo';
    blob = {
      toString: jest.fn().mockReturnValue(yaml),
    };
    config = {
      '$.dependencies': jest.fn().mockReturnValue('callbackValue'),
      '$.noMatch': jest.fn(),
    };
  });

  it('does not call callback when xPath does not match', () => {
    helperProcessYaml(blob, plugin, config);
    expect(config['$.noMatch']).not.toBeCalled();
  });

  it('calls callback when xPath match', () => {
    const result = helperProcessYaml(blob, plugin, config);
    expect(config['$.dependencies']).toBeCalledWith(
      blob,
      'dependencies',
      'foo',
    );

    expect(result).toEqual(['callbackValue']);
  });

  it('calls callback on nested yaml object', () => {
    yaml = `devDependencies:
  foo: bar
  baz: qux
`;
    config = {
      '$.devDependencies': jest.fn(),
    };
    blob = {
      toString: jest.fn().mockReturnValue(yaml),
    };

    helperProcessYaml(blob, plugin, config);
    expect(config['$.devDependencies']).toHaveBeenNthCalledWith(
      1,
      blob,
      'foo',
      'bar',
    );
    expect(config['$.devDependencies']).toHaveBeenNthCalledWith(
      2,
      blob,
      'baz',
      'qux',
    );
  });
});
