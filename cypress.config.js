import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'out/generated/**/*.cy.js',
  },
 
});
