import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };

  return (
    <DropDownContext.Provider
      value={{ open, setOpen, toggleOpen }}
    >
      <div className="flex flex-col items-center">
        {children}
      </div>
    </DropDownContext.Provider>
  );
};

const Trigger = ({ children }) => {
  const { open, setOpen, toggleOpen } =
    useContext(DropDownContext);

  return (
    <>
      <div onClick={toggleOpen}>{children}</div>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

const Content = ({
  align = 'center',
  width = '',
  contentClasses = 'py-1 bg-custom-light-600 dark:bg-custom-dark-600 backdrop-blur-lg',
  children,
}) => {
  const { open, setOpen } = useContext(
    DropDownContext,
  );

  let alignmentClasses = 'origin-top';
  if (align === 'center') {
    alignmentClasses = 'justify-center';
  } else if (align === 'left') {
    alignmentClasses = 'justify-end';
  } else if (align === 'right') {
    alignmentClasses = 'justify-start';
  }

  return (
    <div
      className={`relative flex ${alignmentClasses}`}
    >
      <div
        className={`absolute z-50 rounded-md border border-black/20 dark:border-black shadow-lg transition-all ease-in duration-100 ${
          !open && 'scale-0'
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={
            `rounded-md ring-1 ring-black ring-opacity-5 ` +
            contentClasses
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const DropdownButton = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <Link
      {...props}
      className={
        'block w-full px-4 py-2 text-left text-sm leading-5 dark:text-white hover:bg-custom-light-700 dark:hover:bg-custom-dark-700 focus:outline-none transition duration-150 ease-in-out ' +
        className
      }
    >
      {children}
    </Link>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Button = DropdownButton;

export default Dropdown;
