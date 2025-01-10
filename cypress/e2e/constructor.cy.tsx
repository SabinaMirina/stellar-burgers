describe('Burger Constructor Page', () => {
  beforeEach(() => {
    // Мокаем запросы для получения ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json', // Используем моковые данные
    }).as('getIngredients');

    cy.setCookie('refreshToken', 'test-refresh-token');
    cy.visit('http://localhost:4000/');
  });

  it('should add a bun and a filling to the constructor', () => {
    // Убеждаемся, что ингредиенты загружены
    cy.wait('@getIngredients');

    // Добавляем булку в конструктор
    cy.get('[data-testid="ingredient-item"]')
      .contains('Краторная булка N-200i') // Название из моков
      .parent()
      .find('button') // Находим кнопку "Добавить"
      .click();

    // Проверяем, что булка добавлена в конструктор
    cy.get('[data-testid="constructor-bun"]', { timeout: 10000 }).should(
      'contain',
      'Краторная булка N-200i'
    );

    // Добавляем начинку в конструктор
    cy.get('[data-testid="ingredient-item"]')
      .contains('Филе Lumina') // Название из моков
      .parent()
      .find('button') // Находим кнопку "Добавить"
      .click();

    // Проверяем, что начинка добавлена в конструктор
    cy.get('[data-testid="constructor-filling"]').should(
      'contain',
      'Филе Lumina'
    );
  });
});
