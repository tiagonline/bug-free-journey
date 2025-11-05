const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    
    supportFile: false,
    specPattern: 'e2e/**/*.cy.js',

    setupNodeEvents(on, config) {
    },
  },
});