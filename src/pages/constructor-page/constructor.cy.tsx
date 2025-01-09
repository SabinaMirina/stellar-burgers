describe('Burger Constructor Page', () => {
  beforeEach(() => {
    // Настраиваем перехват запросов на эндпоинт '/api/ingredients'
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Переходим на главную страницу
    cy.visit('/');
  });

  it('should load ingredients and display them', () => {
    // Ждем выполнения запроса
    cy.wait('@getIngredients');

    // Проверяем, что ингредиенты отображаются на странице
    cy.get('[data-test="ingredient-item"]').should('have.length', 3);
  });
});

it('should add a bun to the constructor', () => {
  // Находим булку и перетаскиваем её в область конструктора
  cy.get('[data-test="ingredient-item"]') // Найдите реальный селектор
    .contains('Краторная булка N-200i')
    .trigger('dragstart');

  cy.get('[data-test="constructor-dropzone"]') // Найдите реальный селектор
    .trigger('drop');

  // Проверяем, что булка добавлена в конструктор
  cy.get('[data-test="constructor-item"]').should(
    'contain.text',
    'Краторная булка N-200i'
  );
});

it('should add a sauce to the constructor', () => {
  // Находим соус и перетаскиваем его в область конструктора
  cy.get('[data-test="ingredient-item"]') // Найдите реальный селектор
    .contains('Соус Spicy-X')
    .trigger('dragstart');

  cy.get('[data-test="constructor-dropzone"]') // Найдите реальный селектор
    .trigger('drop');

  // Проверяем, что соус добавлен в конструктор
  cy.get('[data-test="constructor-item"]').should(
    'contain.text',
    'Соус Spicy-X'
  );
});

it('should add a main ingredient to the constructor', () => {
  // Находим начинку и перетаскиваем её в область конструктора
  cy.get('[data-test="ingredient-item"]') // Найдите реальный селектор
    .contains('Мясо бессмертных моллюсков Protostomia')
    .trigger('dragstart');

  cy.get('[data-test="constructor-dropzone"]') // Найдите реальный селектор
    .trigger('drop');

  // Проверяем, что начинка добавлена в конструктор
  cy.get('[data-test="constructor-item"]').should(
    'contain.text',
    'Мясо бессмертных моллюсков Protostomia'
  );
});
