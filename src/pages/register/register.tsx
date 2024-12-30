import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, RootState, useSelector } from '../../services/store';
import { registerUser } from '../../slices/registerSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // локальные состояния для формы
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ошибка регистрации из стора
  const { registerError } = useSelector(
    (state: RootState) => state.userRegister
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      // диспатчим экшен регистрации
      await dispatch(
        registerUser({ email, password, name: userName })
      ).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <RegisterUI
      errorText={registerError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
