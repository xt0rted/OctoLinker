import {
  DART,
  DART_CONDITIONAL,
} from '@octolinker/helper-grammar-regex-collection';

import liveResolverQuery from '@octolinker/resolver-live-query';
import resolverRelativeFile from '@octolinker/resolver-relative-file';
import resolverTrustedUrl from '@octolinker/resolver-trusted-url';

import builtinsDocs from './builtins-docs.js';

export function dartFile({ path, target }) {
  return resolverRelativeFile({ path, target });
}

export function dartFolder({ path, target }) {
  const fileUrl = resolverRelativeFile({ path, target });
  const [, user, repo, , ...parts] = fileUrl.split('/');
  const fullPath = parts.join('/');

  return `{BASE_URL}/${user}/${repo}/tree/${fullPath}`;
}

function getPackage(target) {
  const packageMatcher = new RegExp(`package:(.*)\/.*`);
  const result = packageMatcher.exec(target);

  return liveResolverQuery({ type: 'pub', target: result[1] });
}

export default {
  name: 'Dart',

  resolve(path, [target]) {
    const isBuiltIn = target in builtinsDocs;
    if (isBuiltIn) {
      return resolverTrustedUrl({ target: builtinsDocs[target] });
    }

    const isPackage = target.startsWith('package:');
    if (isPackage) {
      return getPackage(target);
    }

    return dartFile({ target, path });
  },

  getPattern() {
    return {
      pathRegexes: [/\.dart$/],
      githubClasses: [],
    };
  },

  getLinkRegexes() {
    return [DART, DART_CONDITIONAL];
  },
};
