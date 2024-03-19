import React, { useState, useEffect, useRef, useContext } from "react";
import { Session } from "../Session/session";
import axios from "axios";
import "../tailwind.css"
import { plus, lens, lens2, deleteIcon, editIcon, cancel, plusDesktop } from "./../components/exportsImports";
import { SaleForm, EditSale } from "./../components/exportsImports";

function SalesDashboard() {
   const { user } = useContext(Session);
   const server = "https://backendprueba.xyz/";
   const [sales, setSales] = useState([]);
   const [lensSrc, setLensSrc] = useState(lens);
   const [search, setSearch] = useState({
      value: "",
      error: ""
   });
   const [pagination, setPagination] = useState({});
   const limit = 6;
   const addSale = useRef(null);
   const [salesRefs, setSalesRefs] = useState([]);
   useEffect(() => {
      setSalesRefs((refs) => Array(sales.length).fill().map((_, index) => refs[index] || React.createRef()));
   }, [sales]);
   useEffect(() => {
      if (!search.value) {
         fetchSales();
      }
   }, [search.value]);
   
   useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 1024px)');
      function handleResize() {
      if (mediaQuery.matches) {
         setLensSrc(lens2);
      } else {
         setLensSrc(lens);
      }
      }
      handleResize();
      mediaQuery.addEventListener("change", handleResize);
      return () => {
         mediaQuery.removeEventListener("change", handleResize);
      };
   }, []);

   const fetchSales = async (page = 1) => {
      const searchParam = search.value ? `search=${search.value}&` : "";
      try {
         const response = await axios.get(`${server}sales?${searchParam}page=${page}&limit=${limit}${user.role === "vendor" ? `&vendor=${user.email}` : ""}`);
         if (response.status === 200) {
            const { docs, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = response.data;
            setSales([...docs]);
            setPagination({totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage, page});
         }
      } catch ({name, message}) {
         if(name, message){
            console.error(`${name}: ${message}`);
         }
      }
   };

   const deleteSale = async (_id) => {
      try {
         const saleDeleted = {
            id: _id,
            deleted: true
         };
         const response = await axios.patch(`${server}sales`, saleDeleted, {
            headers: {
               "Content-Type": "application/json"
            }
         });
         if (response.status === 200) {
            fetchSales(pagination.page);
         }
      } catch ({name, message}) {
         console.error(`${name}: ${message}`);
      }
   }

   const renderProducts = function(products, quantity) {
      let productsList = [];
      for(let doc of products) {
         for(let id in quantity) {
            if(doc._id.toString() === id) {
               productsList.push({name: doc.name, quantity: quantity[id]});
            }
         }
      }
      return productsList.map(({name, quantity}, index) => (
         <span key={index} className="flex w-full gap-[15px] lg:justify-between">
            <span>{name}</span>
            <span className="font-medium">x{quantity}</span>
         </span>
      ));
   }
   const renderTime = (time) => {
      const date = new Date(time);
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      if (date.getHours() >= 12) {
         return `${date.getHours() - 12}:${minutes}pm del ${day}/${month}/${year}`
      }
      return `${date.getHours()}:${minutes}am del ${day}/${month}/${year}`
   }

   const validateSearch = () => {
      const regexValue = /^[\w@.\- ]+$/;
      if (!search.value) {
         setSearch((prev) => ({...prev, error: "Ingresa un valor para buscar"}));
      } else if (!regexValue.test(search.value)) {
         setSearch((prev) => ({...prev, error: "Búsqueda inválida"}));
      } else {
         setSearch((prev) => ({...prev, error: ""}));
         fetchSales();
      }
   }
   return (
      <section className="pt-[50px] gap-[25px] lg:pr-[25px] max-lg:px-[25px] flex flex-col w-full box-border relative h-max pb-10 lg:justify-center">
         <hgroup className="flex max-lg:flex-col gap-[25px]">
            <div className="flex flex-col lg:w-[30%]">
               <div className="flex gap-[10px] items-end">
                  <h1 className="font-medium text-[18px]">Tabla de Ventas</h1>
                  <h4 className="flex items-center font-medium text-[12px] text-[#3056D3] bg-[#F9F5FF] rounded-full p-[10px] h-[22px]">{pagination.totalDocs > 0 ? (pagination.totalDocs === 1 ? `${pagination.totalDocs} venta` : `${pagination.totalDocs} ventas`) : "No hay ventas"}</h4>
               </div>
               <p className="text-[14px] text-[#667085]">{`${ user && user.role === "vendor" ? "Lista de todas tus ventas" : "Lista de todas las ventas realizadas"}`}</p>
            </div>
            <div className="flex justify-between lg:w-[60%]">
               <div className="flex justify-center lg:border-[#E7E7E7] lg:border-[1px] bg-[#F1F6F9] h-[45px] rounded-[35px] lg:bg-[#F8FAFC] lg:rounded-[8px]">
                  <div className="flex flex-col justify-center items-center lg:w-[350px] ">
                     <input
                        className="lg:w-full text-[14px]"
                        type="text"
                        placeholder="Buscar una venta"
                        id="search"
                        onChange={(event) => setSearch((prev) => ({...prev, value: event.target.value}))}
                        onKeyDown={(event) => {
                           if (event.key === "Enter") {
                              validateSearch();
                           }
                        }}
                     />
                     <div className="relative w-full top-[22px]">
                        <p className="error">{search.error}</p>
                     </div>
                  </div>
                  <div className="flex z-10 justify-center items-center max-lg:bg-[#14274E] max-lg:rounded-[35px] w-[45px] h-[45px] cursor-pointer" onClick={validateSearch}>
                     <input
                        type="image"
                        alt="buscar"
                        src={lensSrc}
                        className="w-[25px]"
                     />
                  </div>
               </div>
               <input className="lg:hidden w-[45px] " type="image" src={plus} onClick={() => addSale.current.showModal()} alt="Nuevo producto" />
               <button className="max-lg:hidden text-[14px] flex justify-center items-center w-[180px] gap-[10px] bg-[#3056D3] rounded-[8px] text-white h-[40px]" onClick={() => addSale.current.showModal()}>
                  <img src={plusDesktop} alt="nuevo producto" />
                  <p className="leading-6">Agregar venta</p>
               </button>
            </div>
         </hgroup>
         <dialog className="dialog" ref={addSale}>
            <SaleForm />
            <input type="image" className="absolute right-[5px] top-[10px] cursor-pointer w-[35px]" src={cancel} alt="Cancelar" onClick={() => {addSale.current.close(); fetchSales(pagination.page)} } />
         </dialog>
         <section id="productsDashboard" className="flex text-[#667085] flex-col lg:w-full items-center bg-[#F1F6F9] rounded-[20px] lg:mt-[75px]">
            <div className="flex font-medium justify-between px-[12px] gap-[25px] w-full max-lg:hidden">
               {user && user.role !== "vendor" && <p className="w-full">Vendedor</p>}
               <p className="w-full">Cliente</p>
               <p className="w-full">Hora y Fecha</p>
               <p className="w-full">I.V.A. (16%)</p>
               <p className="w-full">Total</p>
               <p className="w-full">Productos</p>
               <p className="">Acciones</p>
            </div>
            {sales && sales.map((sale, index) => (
               <div className={`flex w-full justify-between border-y-[1px] lg:gap-[25px] lg:bg-white border-[#EAECF0] p-[12px] box-border lg:h-[130px] ${index === 0 && "max-lg:rounded-t-[20px]"} ${index === sales.length - 1 && "rounded-b-[20px]"}`} key={sale._id}>
                  <div className="flex gap-[10px] lg:w-full">
                     <div className="flex flex-col font-medium justify-between h-fit lg:hidden">
                        {user.role !== "vendor" && <p className="text-right h-[24px]">Vendedor:</p>}
                        <p className="text-right h-[24px]">Cliente:</p>
                        <p className="text-right h-[24px]">Hora y Fecha:</p>
                        <p className="text-right h-[24px]">I.V.A. (16%):</p>
                        <p className="text-right h-[24px]">Total:</p>
                        <p className="text-right h-[24px]">Productos:</p>
                     </div>
                     <div className="flex lg:items-center max-lg:flex-col max-lg:max-w-[165px] lg:gap-[25px] justify-between text-[14px] lg:w-full">
                        {user.role !== "vendor" && <p className="text-left overflow-x-auto whitespace-nowrap w-full max-lg:h-[24px]">{sale.vendor}</p>}
                        <p className="text-left overflow-x-auto whitespace-nowrap w-full max-lg:h-[24px]">{sale.client}</p>
                        <p className="text-left overflow-x-auto whitespace-nowrap w-full h-[24px]">{sale.createdAt && renderTime(sale.createdAt)}</p>
                        <p className="text-left w-full">${sale.tax && sale.tax.toFixed(2)}</p>
                        <p className="text-left w-full">${sale.total && sale.total.toFixed(2)}</p>
                        <p className="text-left overflow-x-auto lg:overflow-y-auto whitespace-nowrap w-full flex flex-col lg:max-h-full">{sale.products && sale.quantity && renderProducts(sale.products, sale.quantity)}</p>
                     </div>
                  </div>
                  <div className="flex max-lg:flex-col max-lg:w-[25px] justify-center gap-[25px]">
                     <input type="image" src={editIcon} alt="Editar" onClick={() => salesRefs[index].current && salesRefs[index].current.showModal()} />
                     <input type="image" src={deleteIcon} alt="Eliminar" onClick={() => deleteSale(sale._id)} />
                  </div>
                  <dialog className="dialog" ref={salesRefs[index]}>
                     <EditSale {...sale} />
                     <input type="image" className="absolute right-[5px] top-[10px] cursor-pointer w-[35px]" src={cancel} alt="Cancelar" onClick={() => {if (salesRefs[index].current) { salesRefs[index].current.close(); fetchSales(pagination.page)}} } />
                  </dialog>
               </div>
            ))}
         </section>
         <div className="flex justify-between box-border">
            <div className="flex items-center gap-[2px] text-[#515969]">
               <p>Página </p>
               <input
                  className="outline-none w-[20px] text-center"
                  placeholder={pagination.page}
                  title="Página"
                  type="text"
                  onKeyDown={(event) => {
                     if (event.key === "Enter") {
                        const { value } = event.target
                        if (value <= pagination.totalPages && value > 0) {
                           fetchSales(value);
                        }
                     }
                  }}
                  onBlur={(event) => event.target.value = ""}
               />
               <p> de {pagination.totalPages}</p>
            </div>
            <div className="flex gap-[10px] text-[14px] ">
               <button 
                  className={`border-[1px] border-[#9BA4B4] rounded-[10px] w-[90px] h-[36px] ${pagination.hasPrevPage ? "" : "opacity-50 cursor-default"}`}
                  onClick={() => {fetchSales(pagination.prevPage)}}
               >
                  Anterior
               </button>
               <button 
                  className="border-[1px] border-[#9BA4B4] bg-[#3056D3] rounded-[10px] text-white w-[90px] h-[36px]"
                  onClick={() => {fetchSales(pagination.nextPage)}}
               >
                  Siguiente
               </button>
            </div>
         </div>
      </section>
   );
}

export default SalesDashboard;
//cambio x