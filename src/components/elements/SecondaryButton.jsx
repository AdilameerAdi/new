import React from 'react';

export const SecondaryButton = ({
  as: As = 'button',
  children = '',
  variant = 'normal',
  className = '',
  size = 'md',
  ...props
}) => {
  const variants = {
    sm: {
      outline: `py-1 ease-in duration-300 hover:shadow-lg hover:shadow-orange-600/50 text-sm text-black dark:text-orange-600 border-2 border-orange-600 bg-orange-600/30 dark:bg-transparent hover:bg-orange-800/30`,
      normal: `py-1 ease-in duration-300 hover:shadow-lg hover:shadow-orange-600/50 text-sm text-white border-2 border-transparent bg-orange-600 text-white`,
    },
    md: {
      outline: `py-2 ease-in duration-300 hover:shadow-lg hover:shadow-orange-600/50 text-md text-black dark:text-orange-600 border-2 border-orange-600 bg-orange-600/30 dark:bg-transparent hover:bg-orange-800/30`,
      normal: `py-2 ease-in duration-300 hover:shadow-lg hover:shadow-orange-600/50 text-md text-white border-2 border-transparent bg-orange-600 text-white`,
    },
    lg: {
      outline: `py-3 ease-in duration-300 hover:shadow-lg hover:shadow-orange-600/50 text-lg text-black dark:text-orange-600 border-2 border-orange-600 bg-orange-600/30 dark:bg-transparent hover:bg-orange-800/30`,
      normal: `py-3 ease-in duration-300 hover:shadow-lg hover:shadow-orange-600/50 text-lg text-white border-2 border-transparent bg-orange-600 text-white`,
    },
    xl: {
      outline: `py-4 ease-in duration-300 hover:shadow-lg hover:shadow-orange-600/50 text-xl text-black dark:text-orange-600 border-2 border-orange-600 bg-orange-600/30 dark:bg-transparent hover:bg-orange-800/30`,
      normal: `py-4 ease-in duration-300 hover:shadow-lg hover:shadow-orange-600/50 text-xl text-white border-2 border-transparent bg-orange-600 text-white`,
    },
  };

  return (
    <As
      className={`rounded-lg px-6 font-cabin 
        ${variants[size][variant]}
        ${className}`}
      {...props}
    >
      {children}
    </As>
  );
};
