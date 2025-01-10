describe('Добавление ингредиента из списка в конструктор', () => {
  beforeEach(() => {
    // мокаем запросы для получения ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    cy.setCookie('refreshToken', 'test-refresh-token');
    cy.visit('http://localhost:4000/');
  });

  it('should add a bun and a filling to the constructor', () => {
    // ингредиенты загружены
    cy.wait('@getIngredients');

    // добавляем булку в конструктор
    cy.get('[data-testid="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // проверка, что булка добавлена в конструктор
    cy.get('[data-testid="constructor-bun"]', { timeout: 10000 }).should(
      'contain',
      'Краторная булка N-200i'
    );

    //добавление начинки в конструктор
    cy.get('[data-testid="ingredient-item"]')
      .contains('Филе Lumina') // Название из моков
      .parent()
      .find('button') // Находим кнопку "Добавить"
      .click();

    // проверка, что начинка добавлена в конструктор
    cy.get('[data-testid="constructor-filling"]').should(
      'contain',
      'Филе Lumina'
    );
  });

});

describe('Работа модальных окон', () => {
  beforeEach(() => {
    // мокаем запросы для получения ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');
   
    cy.setCookie('refreshToken', 'test-refresh-token');
    cy.visit('http://localhost:4000/');
  });

  it('should open the ingredient modal on click and close it on cross or overlay click', () => {
    // ингредиенты загружены
    cy.wait('@getIngredients');

    // клик на изображение ингредиента
    cy.get('[data-testid="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('img')
      .click();

    // проверка, что модальное окно открылось
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal"]').should('contain', 'Краторная булка N-200i');

    // Закрытие модального окна по клику на крестик
    cy.get('[data-testid="modal"]')
      .find('[data-testid="close-button"]')
      .click();

    // проверка, что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');

    // открываем модальное окно снова
    cy.get('[data-testid="ingredient-item"]')
      .contains('Филе Lumina')
      .parent()
      .find('img')
      .click();

    // закрытие модального окна по клику на оверлей
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // проверка, что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    // устанавливаем токены
    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.setCookie('refreshToken', 'test-refresh-token');

    // мокаем запросы для получения ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    // мокаем запросы для получения данных пользователя
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json',
    }).as('getUser');

    // мокаем запросы для оформления заказа
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json',
    }).as('postOrder');

    cy.visit('http://localhost:4000/');
    cy.wait('@getUser');
  });

  it('должен собрать бургер, оформить заказ, закрыть модальное окно и очистить конструктор', () => {
    // ингредиенты загружены
    cy.wait('@getIngredients');

    // добавляем булку в конструктор
    cy.get('[data-testid="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // добавляем начинку в конструктор
    cy.get('[data-testid="ingredient-item"]')
      .contains('Филе Lumina')
      .parent()
      .find('button')
      .click();

    // нажимаем на кнопку "Оформить заказ"
    cy.get('[data-testid="constructor-total"] button').click();

    // ждем запрос на оформление заказа
    cy.wait('@postOrder');

    // проверяем, что модальное окно с номером заказа открылось
    cy.get('[data-testid="modal"]')
      .should('exist')
      .and('contain', '65162'); // Номер заказа из фикстуры

    // закрываем модальное окно
    cy.get('[data-testid="modal"] [data-testid="close-button"]').click();

    // проверяем, что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');

    // проверяем, что конструктор пуст
    cy.get('[data-testid="constructor-item"]').should('have.length', '0'); // Проверяем, что булка удалена
    cy.get('[data-testid="order-button"]').should('be.disabled');
  });
});
