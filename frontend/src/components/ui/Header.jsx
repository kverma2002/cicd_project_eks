import React from 'react';

import logo from "@/assets/logo.png";

function Header() {
  return (
    <header className="py-4 shadow-md">
      <div className="flex items-center ml-4">
        <img src={logo} alt="Logo" className="h-10 mr-4" />
        <h1 className="text-xl font-georgia font-bold">File Converter</h1>
      </div>
    </header>
  );
}

export default Header;
