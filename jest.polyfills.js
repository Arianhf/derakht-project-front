// Set up basic polyfills
const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Note: MSW and fetch polyfills are set up per-test-suite basis
// to avoid global setup complexity
