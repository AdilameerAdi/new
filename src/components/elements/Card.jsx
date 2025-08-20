import React from 'react';

export const Card = ({
  as: As = 'div',
  children,
  className = '',
  ...props
}) => {
  return (
    <As
      className={`${className} rounded-lg p-4 shadow-md dark:shadow-zinc-900 bg-custom-light-600 
      dark:bg-custom-dark-600 border border-black/20 dark:border-black 
      animate__animated animate__fadeIn`}
      {...props}
    >
      {children}
    </As>
  );
};
