/**
 * Checks if a topic string matches a subscription pattern with MQTT-style wildcards.
 *
 * This function handles two types of wildcards:
 * - '+': A single-level wildcard that matches exactly one topic level.
 * - '#': A multi-level wildcard that matches zero or more topic levels. It must be the last character in the pattern.
 *
 * @param {string} topic The topic string to test (e.g., 'home/living_room/light/status').
 * @param {string} pattern The subscription pattern string (e.g., 'home/+/light/#').
 * @returns {boolean} True if the topic matches the pattern, false otherwise.
 */

let runV = 1;

/*  set to true to run tests */
let runTest = false;
let isTopicMatch = "";

if( runV == 1){

isTopicMatch = function(topic, pattern) {
  // Check for invalid '#' usage first
  if (pattern.includes('#') && !pattern.endsWith('/#') && pattern !== '#') {
    return false;
  }
  if( topic == pattern )
    return true;

  const topicLevels = topic.split('/');
  const patternLevels = pattern.split('/');

  const topicLen = topicLevels.length;
  const patternLen = patternLevels.length;

  // Handle '#' wildcard
  if (patternLevels[patternLen - 1] === '#') {
    // If '#' is the only character or at the end
    const basePatternLen = patternLen - 1;
    if (topicLen < basePatternLen) {
      return false;
    }

    for (let i = 0; i < basePatternLen; i++) {
      if (patternLevels[i] !== '+' && patternLevels[i] !== topicLevels[i]) {
        return false;
      }
    }
    return true;
  }

  // Handle standard topic/pattern match
  if (topicLen !== patternLen) {
    return false;
  }

  for (let i = 0; i < patternLen; i++) {
    const patternLevel = patternLevels[i];
    // No need to check for '+', just a simple comparison
    if (patternLevel !== '+' && patternLevel !== topicLevels[i]) {
      return false;
    }
  }

  return true;
}





} else if( runV == 0 ){




isTopicMatch = function(topic, pattern) {
  const topicLevels = topic.split('/');
  const patternLevels = pattern.split('/');

  if (pattern.includes('#') && !pattern.endsWith('/#') && pattern !== '#') {
    return false;
  }

  if (patternLevels[patternLevels.length - 1] === '#') {
    if (topicLevels.length < patternLevels.length - 1) {
      return false;
    }

    for (let i = 0; i < patternLevels.length - 1; i++) {
      const patternLevel = patternLevels[i];
      const topicLevel = topicLevels[i];

      if (patternLevel !== '+' && patternLevel !== topicLevel) {
        return false;
      }
    }

    return true;
  }

  if (topicLevels.length !== patternLevels.length) {
    return false;
  }

  for (let i = 0; i < topicLevels.length; i++) {
    const patternLevel = patternLevels[i];
    const topicLevel = topicLevels[i];

    if (patternLevel !== '+' && patternLevel !== topicLevel) {
      return false;
    }
  }

  return true;
}


}



if( runTest ){

 
// --- Test Cases ---
var baseString = 'abc/123/xx/a';
console.log(`Testing with base string: "${baseString}"\n`);

let posStrs = [
  'abc/123/xx/a',
  '#',
  'abc/#',
  'abc/+/xx/#',
  '+/+/xx/#',
  '+/+/+/#',
  '+/+/+/a',
  'abc/+/xy/#', // on purpuse
  'abc/123/#',
  'abc/123/xx/#',
  '+/123/xx/a',
  'abc/+/xx/a',
  'abc/123/+/a',
  'abc/123/+/#',
  'abc/+/xx/#',
  '+/123/xx/#',
  '+/123/+/a',
];

let negStrs = [
  'abc/123/xx/b',
  '#/',
  '/abc',
  'abc/#/a',
  'abc/+/a',
  'abc/#/xx/#',
  '+/123+/xx/a',
  'ac/+/xx/a',
  '+abc/#/+/a',
  '#abc/123/+/#',
  'ab/c/+/xx/#',
  '+/123/xy/#',
  '+/123/#/a',
];

console.log('--- Positive Matches (Should be true) ---');
posStrs.forEach(pattern => {
  console.log(`isTopicMatch('${baseString}', '${pattern}') -> ${isTopicMatch(baseString, pattern)}`);
});

console.log('\n--- Negative Matches (Should be false) ---');
negStrs.forEach(pattern => {
  console.log(`isTopicMatch('${baseString}', '${pattern}') -> ${isTopicMatch(baseString, pattern)}`);
});


}

let topicPatternChk = isTopicMatch;
export { topicPatternChk }
//export default{ isTopicMatch }