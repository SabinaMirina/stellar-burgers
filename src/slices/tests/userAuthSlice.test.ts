import { userRegisterSlice, registerUser } from '../registerSlice';
import { TUser } from '../../utils/types';

describe('userRegisterSlice', () => {
  const initialState = {
    isAuthChecked: false,
    isAuthenticated: false,
    userData: null,
    registerError: null
  };

  it('должен вернуть начальное состояние', () => {
    const state = userRegisterSlice.reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать экшен fulfilled (успешная регистрация)', () => {
    const user: TUser = {
      email: 'test@test.com',
      name: 'Test User'
    };

    const state = userRegisterSlice.reducer(
      initialState,
      registerUser.fulfilled(user, '', { email: '', password: '', name: '' })
    );

    expect(state.isAuthenticated).toBe(true);
    expect(state.userData).toEqual(user);
    expect(state.registerError).toBeNull();
  });

  it('должен обрабатывать экшен rejected (ошибка регистрации)', () => {
    const errorMessage = 'Registration failed';

    const state = userRegisterSlice.reducer(
      initialState,
      registerUser.rejected(
        null,
        '',
        { email: '', password: '', name: '' },
        errorMessage
      )
    );

    expect(state.isAuthenticated).toBe(false);
    expect(state.userData).toBeNull();
    expect(state.registerError).toBe(errorMessage);
  });
});
