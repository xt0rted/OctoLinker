import insertLink from '@octolinker/helper-insert-link';
import processJSON from '@octolinker/helper-process-json';
import { jsonRegExKeyValue } from '@octolinker/helper-regex-builder';
import liveResolverQuery from '@octolinker/resolver-live-query';

function linkDependency(blob, key, value) {
  const regex = jsonRegExKeyValue(key, value);

  return insertLink(blob, regex, this);
}

export default {
  name: 'DotNetCore',
  needsContext: true,

  resolve(path, [target]) {
    return liveResolverQuery({ type: 'nuget', target });
  },

  getPattern() {
    return {
      pathRegexes: [/project\.json$/],
      githubClasses: [],
    };
  },

  parseBlob(blob) {
    return processJSON(blob, this, {
      '$.dependencies': linkDependency,
      '$.tools': linkDependency,
      '$.frameworks.*.dependencies': linkDependency,
    });
  },
};
