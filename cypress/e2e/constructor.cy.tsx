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

  it('should open the ingredient modal on click and close it on cross or overlay click', () => {
    // Убеждаемся, что ингредиенты загружены
    cy.wait('@getIngredients');
  
    // Клик на изображение ингредиента
    cy.get('[data-testid="ingredient-item"]')
      .contains('Краторная булка N-200i') // Название из моков
      .parent()
      .find('img') // Находим изображение ингредиента
      .click();
  
    // Проверяем, что модальное окно открылось
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal"]').should('contain', 'Краторная булка N-200i');
  
    // Закрытие модального окна по клику на крестик
    cy.get('[data-testid="modal"]')
      .find('[data-testid="close-button"]') // Находим кнопку закрытия
      .click();
  
    // Проверяем, что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  
    // Открываем модальное окно снова
    cy.get('[data-testid="ingredient-item"]')
      .contains('Филе Lumina')
      .parent()
      .find('img')
      .click();
  
    // Закрытие модального окна по клику на оверлей
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
  
    // Проверяем, что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });

});
