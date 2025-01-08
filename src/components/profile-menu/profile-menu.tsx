import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from 'react-redux';
import { logoutUser, setAuthChecked } from '../../slices/userAuthSlice';
import { AppDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  //логаут
  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('Проверка перед выходом. refreshToken:', refreshToken);

    if (!refreshToken) {
      console.error('Ошибка: отсутствует refreshToken');
      return;
    }

    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log('Вы успешно вышли из аккаунта');
        navigate('/login');
      })
      .catch((err) => {
        console.error('Ошибка при выходе:', err);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
