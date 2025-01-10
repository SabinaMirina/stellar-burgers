const SELECTORS = {
  ingredientItem: '[data-testid="ingredient-item"]',
  constructorBun: '[data-testid="constructor-bun"]',
  constructorFilling: '[data-testid="constructor-filling"]',
  modal: '[data-testid="modal"]',
  modalCloseButton: '[data-testid="modal"] [data-testid="close-button"]',
  modalOverlay: '[data-testid="modal-overlay"]',
  constructorTotalButton: '[data-testid="constructor-total"] button',
  constructorItem: '[data-testid="constructor-item"]',
  orderButton: '[data-testid="order-button"]',
};

const testUrl = 'http://localhost:4000';

describe('Добавление ингредиента из списка в конструктор', () => {
  beforeEach(() => {
    // Мокаем запросы для получения ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    cy.setCookie('refreshToken', 'test-refresh-token');
    cy.visit(testUrl);
  });

  it('should add a bun and a filling to the constructor', () => {
    // Убеждаемся, что ингредиенты загружены
    cy.wait('@getIngredients');

    // Добавляем булку в конструктор
    cy.get(SELECTORS.ingredientItem)
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // Проверяем, что булка добавлена в конструктор
    cy.get(SELECTORS.constructorBun, { timeout: 10000 }).should(
      'contain',
      'Краторная булка N-200i'
    );

    // Добавляем начинку в конструктор
    cy.get(SELECTORS.ingredientItem)
      .contains('Филе Lumina')
      .parent()
      .find('button')
      .click();

    // Проверяем, что начинка добавлена в конструктор
    cy.get(SELECTORS.constructorFilling).should(
      'contain',
      'Филе Lumina'
    );
  });

});

describe('Работа модальных окон', () => {
  beforeEach(() => {
    // Мокаем запросы для получения ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');
   
    cy.setCookie('refreshToken', 'test-refresh-token');
    cy.visit(testUrl);
  });

  it('should open the ingredient modal on click and close it on cross or overlay click', () => {
    // Убеждаемся, что ингредиенты загружены
    cy.wait('@getIngredients');

    // Клик на изображение ингредиента
    cy.get(SELECTORS.ingredientItem)
      .contains('Краторная булка N-200i')
      .parent()
      .find('img')
      .click();

    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('exist');
    cy.get(SELECTORS.modal).should('contain', 'Краторная булка N-200i');

    // Закрытие модального окна по клику на крестик
   
    cy.get(SELECTORS.modalCloseButton).click();
    cy.get(SELECTORS.modal).should('not.exist');

    // Проверяем, что модальное окно закрылось
    cy.get(SELECTORS.modal).should('not.exist');

    // Открываем модальное окно снова
    cy.get(SELECTORS.ingredientItem)
      .contains('Филе Lumina')
      .parent()
      .find('img')
      .click();

    // Закрытие модального окна по клику на оверлей
   cy.get(SELECTORS.modalOverlay).click({ force: true });

    // Проверяем, что модальное окно закрылось
    cy.get(SELECTORS.modal).should('not.exist');
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    // Устанавливаем токены
    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.setCookie('refreshToken', 'test-refresh-token');

    // Мокаем запросы для получения ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    // Мокаем запросы для получения данных пользователя
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json',
    }).as('getUser');

    // Мокаем запросы для оформления заказа
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json',
    }).as('postOrder');

    cy.visit(testUrl);
    cy.wait('@getUser');
  });

  it('должен собрать бургер, оформить заказ, закрыть модальное окно и очистить конструктор', () => {
    // Убеждаемся, что ингредиенты загружены
    cy.wait('@getIngredients');

    // Добавляем булку в конструктор
    cy.get(SELECTORS.ingredientItem)
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // Добавляем начинку в конструктор
    cy.get(SELECTORS.ingredientItem)
      .contains('Филе Lumina')
      .parent()
      .find('button')
      .click();

    // Нажимаем на кнопку "Оформить заказ"
    cy.get(SELECTORS.constructorTotalButton).click();

    // Ждем запрос на оформление заказа
    cy.wait('@postOrder');

    // Проверяем, что модальное окно с номером заказа открылось
    cy.get('[data-testid="modal"]')
      .should('exist')
      .and('contain', '65162');

    // Закрываем модальное окно
    cy.get(SELECTORS.modalCloseButton).click();

    // Проверяем, что модальное окно закрылось
    cy.get(SELECTORS.modal).should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get(SELECTORS.constructorItem).should('have.length', '0');
    cy.get(SELECTORS.orderButton).should('be.disabled');
  });
});
