import React from 'react'

export const Card = ({
    as: As = 'div',
    children,
    className = '',
    ...props
  }) => {
    return (
      <As
        className={`${className} p-4 bg-admin-light-600 dark:bg-admin-dark-600`}
        {...props}
      >
        {children}
      </As>
    );
  };
  
