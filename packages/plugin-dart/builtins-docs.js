const coreModules = [
  // core
  'dart:async',
  'dart:collection',
  'dart:convert',
  'dart:core',
  'dart:developer',
  'dart:math',
  'dart:typed_data',

  // vm
  'dart:fifi',
  'dart:io',
  'dart:isolate',
  'dart:mirrors',

  // web
  'dart:html',
  'dart:indexed_db',
  'dart:js',
  'dart:js_util',
  'dart:svg',
  'dart:web_audio',
  'dart:web_gl',
  'dart:web_sql',
];

const docs = coreModules.reduce((result, builtin) => {
  const filename = builtin.replace(':', '-');

  result[
    builtin
  ] = `https://api.dart.dev/stable/${filename}/${filename}-library.html`;

  return result;
}, {});

export default docs;
