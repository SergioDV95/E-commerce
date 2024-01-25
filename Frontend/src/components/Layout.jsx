/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import Menu from "./Menu";
import { Outlet } from "react-router-dom";

export default function Layout () {
  
  return (
    <>
    <div className="grid grid-rows-[72px_1fr] lg:grid lg:grid-cols-[250px_1fr]">
      <div className="z-[100]">
        <Menu />
      </div>
      <div>
        <Outlet />
      </div>
    </div> 
    </>
  );
}