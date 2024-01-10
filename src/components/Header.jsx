import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="header">
      <NavLink 
        to="/mercedes"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active nav_item yellow text-right" : "nav_item yellow text-right"
        }
      >
        Mercedes
      </NavLink>
      <NavLink 
        to="/bmw"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active nav_item blue" : "nav_item blue"
        }
      >
        BMW
      </NavLink>
    </nav>
  );
};

export default Header;
