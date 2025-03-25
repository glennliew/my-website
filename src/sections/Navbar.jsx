import { useState } from 'react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { navLinks } from '../constants/index.js';

const NavItems = ({ onClick = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleNavClick = (e, item) => {
    onClick();
    
    const isHashLink = item.href.startsWith("#");
    
    if (isHashLink) {
      e.preventDefault();
      
      if (currentPath !== "/") {
        // If we're not on the home page, navigate to home first
        navigate("/");
        // Use setTimeout to allow the navigation to complete before scrolling
        setTimeout(() => {
          const element = document.querySelector(item.href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        // If already on home page, just scroll
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <ul className="nav-ul">
      {navLinks.map((item) => {
        // Check if it's a hash link (for the home page sections) or a route link
        const isHashLink = item.href.startsWith("#");
        const isActive = isHashLink 
          ? currentPath === "/" && window.location.hash === item.href
          : currentPath === item.href;

        return (
          <li key={item.id} className="nav-li">
            {isHashLink ? (
              <a 
                href={item.href} 
                className={`nav-li_a ${isActive ? "text-white" : ""}`}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.name}
              </a>
            ) : (
              <Link 
                to={item.href} 
                className={`nav-li_a ${isActive ? "text-white" : ""}`}
                onClick={onClick}
              >
                {item.name}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-5 mx-auto c-space">
          <Link to="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
            Glenn :)
          </Link>

          <button
            onClick={toggleMenu}
            className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex"
            aria-label="Toggle menu">
            <img src={isOpen ? 'assets/close.svg' : 'assets/menu.svg'} alt="toggle" className="w-6 h-6" />
          </button>

          <nav className="sm:flex hidden">
            <NavItems />
          </nav>
        </div>
      </div>

      <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <nav className="p-5">
          <NavItems onClick={closeMenu} />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

