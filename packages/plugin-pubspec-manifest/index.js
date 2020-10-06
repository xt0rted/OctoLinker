import insertLink from '@octolinker/helper-insert-link';
import processYAML from '@octolinker/helper-process-yaml';
import {
  yamlRegExKey,
  yamlRegExKeyValue,
  yamlRegExValue,
} from '@octolinker/helper-regex-builder';
import { dartFolder } from '@octolinker/plugin-dart';
import liveResolverQuery from '@octolinker/resolver-live-query';

function linkDependency(blob, key, value) {
  // The sdk dependency isn't a package and can't be linked to
  if (key === 'sdk') {
    return;
  }

  if (value) {
    // https://dart.dev/tools/pub/dependencies#version-constraints
    if (typeof value === 'string') {
      const regex = yamlRegExKeyValue(key, value);
      return insertLink(blob, regex, this, { type: 'pub' });
    }

    // https://dart.dev/tools/pub/dependencies#sdk
    if (value.sdk) {
      // Packages loaded from the local sdk
      return;
    }

    // https://dart.dev/tools/pub/dependencies#hosted-packages
    if (value.hosted) {
      // Packages hosted on 3rd party package servers
      return;
    }

    // https://dart.dev/tools/pub/dependencies#git-packages
    if (value.git) {
      // TODO: build this out
      return;
    }

    // https://dart.dev/tools/pub/dependencies#path-packages
    if (value.path) {
      const regex = yamlRegExValue('path', value.path);
      return insertLink(blob, regex, this, { type: 'folder' });
    }
  }

  const regex = yamlRegExKey(key, false);
  return insertLink(blob, regex, this, { type: 'pub' });
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
      const url = dartFolder({ path, target: values[0] });
      return url;
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
