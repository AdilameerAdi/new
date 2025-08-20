import React from 'react';
import { Link } from 'react-router-dom';

export const NavLink = ({
  children,
  className = '',
  as: As = Link,
  ...props
}) => {
  return (
    <As
      className={`p-2 text-black hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 rounded-lg 
          dark:text-white transition-all ease-in duration-100 ${className}`}
      {...props}
    >
      {children}
    </As>
  );
};
