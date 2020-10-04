import insertLink from '@octolinker/helper-insert-link';
import processYAML from '@octolinker/helper-process-yaml';
import {
  yamlRegExKeyValue,
  yamlRegExValue,
} from '@octolinker/helper-regex-builder';
import { dartFolder } from '@octolinker/plugin-dart';
import liveResolverQuery from '@octolinker/resolver-live-query';

function linkDependency(blob, key, value) {
  if (typeof value === 'string') {
    const regex = yamlRegExKeyValue(key, value);
    return insertLink(blob, regex, this, { type: 'pub' });
  }

  const regex = yamlRegExValue('path', value.path);
  return insertLink(blob, regex, this, { type: 'folder' });
}

export default {
  name: 'PubSpecManifest',
  needsContext: true,

  resolve(path, values, { type }) {
    if (type === 'pub') {
      // TODO: check the built-ins list for the package before hitting the api
      return liveResolverQuery({ type: 'pub', target: values[0] });
    }

    if (type === 'folder') {
      return dartFolder({ path, target: values[0] });
    }
  },

  getPattern() {
    return {
      pathRegexes: [/pubspec\.yaml$/],
      githubClasses: [],
    };
  },

  parseBlob(blob) {
    return processYAML(blob, this, {
      '$.dependencies': linkDependency,
      '$.dev_dependencies': linkDependency,
      '$.dependency_overrides': linkDependency,
    });
  },
};
