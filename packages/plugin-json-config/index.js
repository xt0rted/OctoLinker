import insertLink from '@octolinker/helper-insert-link';
import processJSON from '@octolinker/helper-process-json';
import {
  jsonRegExKeyValue,
  jsonRegExValue,
  jsonRegExArrayValue,
} from '@octolinker/helper-regex-builder';
import { javascriptFile } from '@octolinker/plugin-javascript';
import liveResolverQuery from '@octolinker/resolver-live-query';

function linkDependency(blob, key, value) {
  let regex;

  if (Number.isNaN(key)) {
    regex = jsonRegExValue(key, value);
  } else if (Array.isArray(value)) {
    regex = jsonRegExKeyValue(value[0]);
  } else {
    regex = jsonRegExArrayValue(value);
  }

  return insertLink(blob, regex, this);
}

function linkArrayDependency(blob, key, value) {
  let regex;
  console.info({ key, value });
  if (Array.isArray(value)) {
    regex = jsonRegExKeyValue(value[0]);
  } else {
    regex = jsonRegExKeyValue(value);
  }

  return insertLink(blob, regex, this);
}

function linkFile(blob, key, value) {
  if (typeof value !== 'string') {
    return;
  }

  const regex = jsonRegExValue(key, value);
  return insertLink(blob, regex, this, { type: 'file' });
}

export default {
  name: 'JsonConfig',
  needsContext: true,

  resolve(path, values, { type }) {
    if (type === 'file') {
      return javascriptFile({ target: values[0], path });
    }

    const isPath = !!values[0].match(/^\.\.?[\\|\/]?/);
    if (isPath) {
      return javascriptFile({ target: values[0], path });
    }

    //console.info({ type: 'npm', target: values[0] });
    return liveResolverQuery({ type: 'npm', target: values[0] });
  },

  getPattern() {
    return {
      pathRegexes: [
        /\.babelrc\.json$/,
        /\.eslintrc\.json$/,
        ///\.stylelintrc\.json$/,
        ///babel\.config\.json$/,
        /tsconfig\.json$/,
        /package\.json$/,
        /now\.json$/,
        /vercel\.json$/,
      ],
      githubClasses: [],
    };
  },

  parseBlob(blob) {
    return processJSON(blob, this, {
      '$.extends': linkDependency,
      '$.presets': linkDependency,
      '$.plugins': linkDependency,
      //'$.ava.require': linkDependency,
      '$.babel..presets': linkArrayDependency,
      '$.babel..plugins': linkArrayDependency,
      '$.eslintConfig.extends': linkDependency,
      '$.eslintConfig.parser': linkDependency,
      '$.stylelint.extends': linkDependency,
      '$.stylelintConfig.extends': linkDependency,
      //'$.xo.extends': linkDependency,
      //'$.xo.parser': linkDependlinkDependencyency,
      '$.builds..use': linkDependency, // now.json & vercel.json - https://github.com/OctoLinker/api/blob/master/now.json
      '$.builds..src': linkFile, // now.json & vercel.json
      '$.routes..dest': linkFile, // now.json & vercel.json - https://github.com/InkoHX/og-generator/blob/5f77e07e6cb1db86ed19654e2d96d1933fd5f8f3/vercel.json, https://github.com/Woosy/arthurdufour.com/blob/960b0ea72d35df71796d4912da8056af57788baf/vercel.json
    });
  },
};
