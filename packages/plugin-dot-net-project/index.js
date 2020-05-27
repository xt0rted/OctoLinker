import {
  NET_PROJ_FILE_REFERENCE,
  NET_NUSPEC_FILE_REFERENCE,
} from '@octolinker/helper-grammar-regex-collection';
import relativeFile from '@octolinker/resolver-relative-file';

export default {
  name: 'DotNetProject',

  resolve(path, [target]) {
    // Both / and \ are supported as the path separator so we need to normalize it to /
    target = target.replace(/\\/g, '/');

    return relativeFile({ path, target });
  },

  getPattern() {
    return {
      pathRegexes: [
        /\.(cs|fs|vb)proj$/,
        /\.vcxproj(\.filters)?/, // https://github.com/microsoft/cppwinrt/blob/master/cppwinrt/cppwinrt.vcxproj.filters
        /repositories\.config/,
        /\.nuspec/,
      ],
      githubClasses: [],
    };
  },

  getLinkRegexes() {
    return [NET_PROJ_FILE_REFERENCE, NET_NUSPEC_FILE_REFERENCE];
  },
};

// https://github.com/webgio/Rotativa/blob/master/packages/repositories.config#L3
// https://github.com/nunit/nunit/blob/master/nuget/framework/nunit.nuspec#L47
