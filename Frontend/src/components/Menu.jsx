/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useEffect,useState,useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import {Session} from "./../Session/session"
import axios from "axios";
import { EmpresasPolar, Hamburger, MenuBox, HomeSvg, LoginSvg, ProductSvg, ReportsSvg, SalesSvg, SettingsSvg, UserSvg, LogoutSvg, ContactUsSvg, AccountSvg } from "./exportsImports";

export default function Menu () {
  const [isOpen, setOpen] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [activeTab, setIsActiveTab] = useState("")
  const [sessionItem, setSessionItem] = useState("Iniciar Sesion")
  const [sessionName, setSessionName] = useState("Login")
  const location = useLocation();
  const [logedImg, setLogedImg] = useState("");
  const [userRole, setUserRole] = useState("");

  const {user, setUser} = useContext(Session)
  const logout = () => {
    setUser(null);
  }
  const activeColor = "#3056d3"
  const defaultColor = "#637381"
  const svgs = {
    Home: <HomeSvg currentColor={activeTab === "Home" ? activeColor : (defaultColor)}/>,
    Users: <UserSvg currentColor={activeTab === "User" ? activeColor : (defaultColor)}/>,
    Customers: <UserSvg currentColor={activeTab === "Customers" ? activeColor : (defaultColor)}/>,
    Vendors: <UserSvg currentColor={activeTab === "Vendors" ? activeColor : (defaultColor)}/>,
    Inventory: <ProductSvg currentColor={activeTab === "Inventory" ? activeColor : (defaultColor)}/>,
    Sales: <SalesSvg currentColor={activeTab === "Sales" ? activeColor : (defaultColor)}/>,
    Cart: <SalesSvg currentColor={activeTab === "Cart" ? activeColor : (defaultColor)}/>,
    Reports: <ReportsSvg currentColor={activeTab === "Reports" ? activeColor : (defaultColor)}/>,
    Settings: <SettingsSvg currentColor={activeTab === "Settings" ? activeColor : (defaultColor)}/>,
    SessionColor: <LoginSvg currentColor={activeTab === "SessionColor" ? activeColor : (defaultColor)}/>,
    Contact: <ContactUsSvg currentColor={activeTab === "Contact" ? activeColor : (defaultColor)}/>,
    Logout: <LogoutSvg currentColor={activeTab === "Logout" ? activeColor : (defaultColor)}/>,
    Account: <AccountSvg currentColor={activeTab === "Account" ? activeColor : (defaultColor)}/>,
    Login: <LoginSvg currentColor={activeTab === "Login" ? activeColor : (defaultColor)}/>,
    SignUp: <UserSvg currentColor={activeTab === "SignUp" ? activeColor : (defaultColor)}/>,
  }
  const adminPages = [
    {
      name: "Home",
      title: "Inicio",
      path: "/",
    },
    {
      name: "Users",
      title: "Usuarios",
      path: "/users",
    },
    {
      name: "Customers",
      title: "Clientes",
      path: "/customers",
    },
    {
      name: "Vendors",
      title: "Vendedores",
      path: "/vendors",
    },
    {
      name: "Inventory",
      title: "Inventario",
      path: "/productsDashboard",
    },
    {
      name: "Sales",
      title: "Ventas",
      path: "/sales",
    },
    {
      name: "Reports",
      title: "Reportes",
      path: "/reports",
    },
  ];

  const vendorsPages = [
    {
      name: "Home",
      title: "Inicio",
      path: "/",
    },
    {
      name: "Customers",
      title: "Clientes",
      path: "/customers",
    },
    {
      name: "Inventory",
      title: "Inventario",
      path: "/productsDashboard",
    },
    {
      name: "Sales",
      title: "Ventas",
      path: "/sales",
    },
  ];

  const clientsPages = [
    {
      name: "Home",
      title: "Inicio",
      path: "/",
    },
    {
      name: "Inventory",
      title: "Productos",
      path: "/products",
    },
    {
      name: "Cart",
      title: "Carrito",
      path: "/cart",
    },
  ];

  const generalMenu = [
    {
      name: "Home",
      title: "Inicio",
      path: "/",
    },
    {
      name: "Inventory",
      title: "Productos",
      path: "/products",
    },
    {
      name: "SignUp",
      title: "Registrarse",
      path: "/SignUp",
    },
  ];
  const SubMenuItems = [
    {
      name: "Contact",
      title: "Contactanos",
      path: "/contactUs",
    },
    {
      name: "Settings",
      title: "Editar usuario",
      path: "/settings",
    },
    { name: sessionName, title: sessionItem, path: "/login" },
  ]
  const [MenuItems, setMenuItems] = useState(generalMenu)

  const getUser = async (userEmail) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${userEmail}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setLogedImg(data.avatar);
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

   const determineMenuItems = () => {
    if (user) {
      setIsLogged(true);
      setUserRole(user.role);

      switch (userRole) {
        case "admin":
          setMenuItems(adminPages);
          break;
        case "vendor":
          setMenuItems(vendorsPages);
          break;
        case "client":
          setMenuItems(clientsPages);
          break;
        default:
          setMenuItems(generalMenu);
      }

      setSessionItem("Cerrar Sesion");
      setSessionName("Logout");
    } else {
      setMenuItems(generalMenu);
      setSessionItem("Iniciar Sesion");
      setSessionName("Login");
    }
  };

  useEffect(() => {
    determineMenuItems();
  }, [user,userRole, isLogged]);


  useEffect(() => {
    if (user && user !== null) {
      getUser(user.email);
    }
  }, [user]);

  const handleActive = (tab) => {
    setIsActiveTab(tab.name);
  };
  
  useEffect(() => {
    const pathname = location.pathname;
  
    if (pathname === '/') {
      setIsActiveTab('Home');
      sessionStorage.setItem('activeTab', 'Home');
    } else {
      setTimeout(() => {
        const menuItem = MenuItems.find(item => item.path === pathname);
        if (menuItem) {
          setIsActiveTab(menuItem.name);
        } else {
          setIsActiveTab('Home');
        }
      }, 1000);
      const subMenuItem = SubMenuItems.find(item => item.path === pathname);
      if (subMenuItem) {
        setIsActiveTab(subMenuItem.name);
      }
      if(pathname.startsWith("/products/")){
        setIsActiveTab('Inventory');
      }
      sessionStorage.setItem('activeTab', activeTab);
    }
  }, [location.pathname, activeTab]);

  return (
    <>
      <div className="grid grid-rows-[73px_1fr] justify-center lg:hidden xl:hidden">
        <header>
          <div className="fixed grid grid-cols-2 m-y-2 m-x-4 items-center justify-items-end  w-full h-[73px] top-0 left-0 bg-[#f1f6f9]">
            <div>
              <img
                className="absolute w-[141px] h-[47px] top-[13px] left-[28px] object-cover"
                alt="Empresaspolar"
                src={EmpresasPolar}
              />
            </div>
            <div className="mr-4">
              <Hamburger
                toggled={isOpen}
                toggle={setOpen}
                color="#14274E"
                duration={0.8}
                easing="ease-in"
                hideOutline={false}
              />
            </div>
          </div>
          <div className="fixed top-[73px] right-0">
            {isOpen && <MenuBox />}
          </div>
        </header>
      </div>
      <div className="hidden lg:block w-[375px] h-fit">
        <div className="fixed w-[220px] h-[100vh] top-0 left-0 bg-white shadow-[0px_1px_4px_#0000001f]">
          <div className="flex m-4">
            <img
              className="w-[200px] object-cover"
              alt="Empresaspolar"
              src={EmpresasPolar}
            />
          </div>
          <div className="grid grid-rows-2 w-[220px] h-[100vh]">
            <div>
              {MenuItems.map((page) => (
                <Link
                  to={page.name === "logout" ? "/" : page.path}
                  onClick={() => {
                    handleActive(page);
                  }}
                  key={page.name}
                  className={`grid grid-cols-[29px_1fr_4px] items-center justify-center w-[220px] h-[35px] ${
                    activeTab === page.name ? "bg-[#d6dfff]" : "bg-[#FFFFFF]"
                  }`}
                >
                  <div className="w-[22px] px-2 h-[21px]">
                    {svgs[page.name]}
                  </div>
                  <div
                    className={`w-[55px] px-3 font-medium text-[16px] tracking-[0] leading-[24px] whitespace-nowrap ${
                      activeTab === page.name
                        ? "text-[#3056d3]"
                        : "text-[#637381]"
                    }`}
                  >
                    {page.title}
                  </div>
                  <div
                    className={`w-[4px] h-[35px] ${
                      activeTab === page.name ? "bg-[#3056d3]" : ""
                    }`}
                  />
                </Link>
              ))}
            </div>
            <div>
              <div className="bg-[#E7E7E7] w-[190px] h-[1px] m-4"></div>
              {SubMenuItems.map((page) =>
                user ? (
                  <Link
                    to={page.path}
                    onClick={() => {
                      if (page.title === "Cerrar Sesion") {
                        logout();
                      } else {
                        handleActive(page);
                      }
                    }}
                    key={page.name}
                    className={`grid grid-cols-[29px_1fr_4px] items-center justify-center w-[220px] h-[35px] ${
                      activeTab === page.name ? "bg-[#d6dfff]" : "bg-[#FFFFFF]"
                    }`}
                  >
                    <div className="w-[22px] px-2 h-[21px]">
                      {svgs[page.name]}
                    </div>
                    <div
                      className={`w-[55px] px-3 font-medium text-[16px] tracking-[0] leading-[24px] whitespace-nowrap ${
                        activeTab === page.name
                          ? "text-[#3056d3]"
                          : "text-[#637381]"
                      }`}
                    >
                      {page.title}
                    </div>
                    <div
                      className={`w-[4px] h-[35px] ${
                        activeTab === page.name ? "bg-[#3056d3]" : ""
                      }`}
                    />
                  </Link>
                ) : (
                  page.name !== "Settings" && (
                    <Link
                      to={page.path}
                      onClick={() => {
                        if (page.title === "Cerrar Sesion") {
                          logout();
                        } else {
                          handleActive(page);
                        }
                      }}
                      key={page.name}
                      className={`grid grid-cols-[29px_1fr_4px] items-center justify-center w-[220px] h-[35px] ${
                        activeTab === page.name
                          ? "bg-[#d6dfff]"
                          : "bg-[#FFFFFF]"
                      }`}
                    >
                      <div className="w-[22px] px-2 h-[21px]">
                        {svgs[page.name]}
                      </div>
                      <div
                        className={`w-[55px] px-3 font-medium text-[16px] tracking-[0] leading-[24px] whitespace-nowrap ${
                          activeTab === page.name
                            ? "text-[#3056d3]"
                            : "text-[#637381]"
                        }`}
                      >
                        {page.title}
                      </div>
                      <div
                        className={`w-[4px] h-[35px] ${
                          activeTab === page.name ? "bg-[#3056d3]" : ""
                        }`}
                      />
                    </Link>
                  )
                )
              )}
              <div className="w-[255px] h-[80px]">
                <div className="w-[255px] h-[80px]">
                  <div className="w-[259px] h-[80px]">
                    <div className="grid grid-cols-[29px_1fr] gap-2 my-3 mx-7 items-center justify-center w-[220px]">
                      <Link to="/settings">
                        {user && logedImg && logedImg !== "" ? (
                          <img
                            className="w-[29px] h-[29px] rounded-full"
                            src={
                              logedImg.includes("localhost")
                                ? logedImg
                                : `http://localhost:3001/${logedImg}`
                            }
                            alt={user && user.name}
                          />
                        ) : (
                          <AccountSvg></AccountSvg>
                        )}
                      </Link>
                      <div>
                        <div className="font-medium text-[#637381] text-[13px] tracking-[0] leading-[24px] whitespace-nowrap">
                          {user && user.name ? user.name : "Nombre de Usuario"}
                        </div>
                        <div className=" font-normal text-[#637381] text-[11px] tracking-[0] leading-[20px] whitespace-nowrap">
                          {user && user.email
                            ? user.email
                            : "Correo de Usuario"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}