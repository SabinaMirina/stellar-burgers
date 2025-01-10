import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  },

  e2e: {
    setupNodeEvents(on, config) {
      // Добавляем обработчики событий Cypress, если это необходимо
      // Например, подключение дополнительных плагинов
    },

    // Указываем папку с тестами
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // Указываем папку с фикстурами
    fixturesFolder: 'cypress/fixtures',
    // Указываем папку с поддержкой тестов
    supportFile: 'cypress/support/e2e.ts'
  },

  // Переменные окружения (если требуются)
  env: {
    // Укажите здесь глобальные переменные для тестов, если нужно
  }
});
