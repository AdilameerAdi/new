import React from 'react';

export const PrimaryButton = ({
  as: As = 'button',
  children = '',
  variant = 'normal',
  className = '',
  size = 'md',
  ...props
}) => {
  const variants = {
    sm: {
      outline: `py-1 ease-in duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-sm text-black dark:text-blue-500 border-2 border-blue-500 bg-blue-500/50 dark:bg-transparent hover:bg-blue-600/30`,
      normal: `py-1 ease-in duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-sm text-white border-2 border-transparent bg-blue-500 text-white`,
    },
    md: {
      outline: `py-2 ease-in duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-md text-black dark:text-blue-500 border-2 border-blue-500 bg-blue-500/50 dark:bg-transparent hover:bg-blue-600/30`,
      normal: `py-2 ease-in duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-md text-white border-2 border-transparent bg-blue-500 text-white`,
    },
    lg: {
      outline: `py-3 ease-in duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-lg text-black dark:text-blue-500 border-2 border-blue-500 bg-blue-500/50 dark:bg-transparent hover:bg-blue-600/30`,
      normal: `py-3 ease-in duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-lg text-white border-2 border-transparent bg-blue-500 text-white`,
    },
    xl: {
      outline: `py-4 ease-in duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-xl text-black dark:text-blue-500 border-2 border-blue-500 bg-blue-500/50 dark:bg-transparent hover:bg-blue-600/30`,
      normal: `py-4 ease-in duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-xl text-white border-2 border-transparent bg-blue-500 text-white`,
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
