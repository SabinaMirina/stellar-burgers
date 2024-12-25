import React, { FC } from 'react';
import { Link } from 'react-router-dom'; // Импорт Link
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {/* Ссылка на главную страницу */}
        <Link to='/' className={styles.link}>
          <BurgerIcon type='primary' />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </Link>

        {/* Ссылка на ленту заказов */}
        <Link to='/feed' className={styles.link}>
          <ListIcon type='primary' />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </Link>
      </div>

      <div className={styles.logo}>
        {/* Ссылка на главную через лого */}
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>

      <div className={styles.link_position_last}>
        {/* Ссылка на личный кабинет */}
        <Link to='/login' className={styles.link}>
          <ProfileIcon type='primary' />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </div>
    </nav>
  </header>
);
