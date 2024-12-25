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
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log('Вы успешно вышли из аккаунта');
        navigate('/login'); // Перенаправляем на /login без сброса isAuthChecked
      })
      .catch((err) => {
        console.error('Ошибка при выходе из аккаунта:', err);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
