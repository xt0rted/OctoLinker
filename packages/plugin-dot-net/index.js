import {
  NET_NUSPEC_DEPENDENCY,
  NET_PACKAGE,
  NET_PROJ_PACKAGE,
  NET_PROJ_SDK,
} from '@octolinker/helper-grammar-regex-collection';
import liveResolverQuery from '@octolinker/resolver-live-query';

export default {
  name: 'DotNet',

  resolve(path, [target]) {
    return liveResolverQuery({ type: 'nuget', target });
  },

  getPattern() {
    return {
      pathRegexes: [
        /packages\.config$/,
        /\.(cc|cs|fs|vb)proj$/,
        /\.props$/,
        /\.targets$/,
        /\.nuspec$/,
      ],
      githubClasses: [],
    };
  },

  getLinkRegexes() {
    return [NET_NUSPEC_DEPENDENCY, NET_PACKAGE, NET_PROJ_PACKAGE, NET_PROJ_SDK];
  },
};

// https://github.com/nunit/nunit/blob/master/nuget/framework/nunit.nuspec#L31
