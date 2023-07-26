import { FC } from 'react';

export interface MenuButtonProps {
  selected: boolean;
}

export interface NavMenuProps {
  menu: { title: string; path: string };
  is_active: boolean;
}
