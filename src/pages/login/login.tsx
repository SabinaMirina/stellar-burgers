import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../slices/userAuthSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем ошибки из состояния
  const { loginUserError, loginUserRequest } = useSelector(
    (state) => state.userAuth
  );

  // Состояния для формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      // Диспатчим логин
      const resultAction = await dispatch(
        loginUser({ email, password })
      ).unwrap();
      if (resultAction) {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={loginUserError || ''}
      isLoading={loginUserRequest}
    />
  );
};
