"use client";

import Link from "next/link";
import { NAV_LINKS } from "../_constants/navLinks";
import NavResponsive from "./NavResponsive";
import ResponsiveIcon from "./ResponsiveIcon";
import { useState } from "react";
export default function NavBar() {
  const [menuOpen, setMenu] = useState(false);

  return (
    <nav className="flex items-center md:w-full">
      <ul className="md:flex justify-around items-center hidden text-slate-800 font-poppins font-semibold w-full">
        {NAV_LINKS.map((el, id) => (
          <li key={id}>
            <Link
              href={el.url}
              className="hover:scale-100 hover:text-yellow-600 transition-all duration-200"
            >
              {el.link}
            </Link>
          </li>
        ))}
      </ul>
      <ResponsiveIcon setMenu={setMenu} menuOpen={menuOpen} />
      <NavResponsive menuOpen={menuOpen} setMenu={setMenu} />
    </nav>
  );
}
