// src/setupTests.js
import '@testing-library/jest-dom';

// You can add other global setup code here if needed.
// For example, mocking global objects, setting up a mock service worker, etc.

// Example: Mocking localStorage (if your components use it directly, though Supabase handles its own storage)
// const localStorageMock = (function() {
//   let store = {};
//   return {
//     getItem: function(key) {
//       return store[key] || null;
//     },
//     setItem: function(key, value) {
//       store[key] = value.toString();
//     },
//     removeItem: function(key) {
//       delete store[key];
//     },
//     clear: function() {
//       store = {};
//     }
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

console.log('Jest-dom matchers have been loaded for Vitest.');
