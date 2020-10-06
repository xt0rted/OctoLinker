import escapeRegexString from 'escape-regex-string';

function regexBuilder(key, value, groupKey, global) {
  const regexKey = escapeRegexString(key);
  const keyField = groupKey ? `("${regexKey}")` : `"${regexKey}"`;
  if (Object.prototype.toString.call(value) !== '[object String]') {
    return new RegExp(`${keyField}`, global ? 'g' : undefined);
  }

  const regexValue = escapeRegexString(value);
  const valueField = `"(${regexValue})"`;
  return new RegExp(
    `${keyField}\\s*:\\s*${valueField}`,
    global ? 'g' : undefined,
  );
}

function yamlRegexBuilder(key, value, groupKey) {
  const regexKey = escapeRegexString(key);
  const keyField = groupKey ? `(${regexKey})` : `${regexKey}`;

  const regexValue = escapeRegexString(value);
  const valueField = `['"]?(${regexValue})['"]?`;

  return new RegExp(`${keyField}\\s*:\\s*${valueField}`, 'g');
}

export function jsonRegExKeyValue(key, value, global = true) {
  return regexBuilder(key, value, true, global);
}

export function jsonRegExValue(key, value, global = true) {
  return regexBuilder(key, value, false, global);
}

export function tomlRegExKeyValue(key, value) {
  const regexKey = escapeRegexString(key);
  const regexValue = escapeRegexString(value);

  return new RegExp(`(${regexKey})\\s*=\\s*"(${regexValue})"`, 'g');
}

export function yamlRegExKey(key, rootLevel) {
  const regexKey = escapeRegexString(key);

  let level = '';
  if (typeof rootLevel !== 'undefined') {
    level = rootLevel ? '^' : '[\\t\\f\\v ]+';
  }

  // Multiline lets us use ^ to match the start of the line instead of the string
  return new RegExp(`${level}(${regexKey})\\s*:`, 'gm');
}

export function yamlRegExKeyValue(key, value) {
  return yamlRegexBuilder(key, value, true);
}

export function yamlRegExValue(key, value) {
  return yamlRegexBuilder(key, value, false);
}
