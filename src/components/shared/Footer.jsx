import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="flex flex-col">
      <nav className="p-4 app__nav_footer flex justify-center items-center gap-4">
        <Link
          to="/"
          className="uppercase text-xs text-white font-semibold py-2 px-3 rounded-md hover:bg-gray-600"
        >
          Download client
        </Link>
        <Link
          to="/"
          className="uppercase text-xs text-white font-semibold py-2 px-3 rounded-md hover:bg-gray-600"
        >
          Contact
        </Link>
        <Link
          to="/"
          className="uppercase text-xs text-white font-semibold py-2 px-3 rounded-md hover:bg-gray-600"
        >
          Team
        </Link>
      </nav>
    </footer>
  );
};
