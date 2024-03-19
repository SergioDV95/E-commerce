import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../tailwind.css"
import { plus, lens, lens2, deleteIcon, editIcon, cancel, plusDesktop } from "../components/exportsImports";
import { ProductForm, EditProduct } from "../components/exportsImports";

function ProductsDashboard() {
   const server = "https://backendprueba.xyz/";
   const [products, setProducts] = useState([]);
   const [lensSrc, setLensSrc] = useState(lens);
   const [search, setSearch] = useState({
      value: "",
      error: ""
   });
   const [pagination, setPagination] = useState({});
   const limit = 6;
   const addProduct = useRef(null);
   const [productsRefs, setProductsRefs] = useState([]);

   useEffect(() => {
      setProductsRefs((refs) => Array(products.length).fill().map((_, index) => refs[index] || React.createRef()));
   }, [products]);

   useEffect(() => {
      if (!search.value) {
         fetchProducts();
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

   const fetchProducts = async (pageOn = 1) => {
      const searchParam = search.value ? `search=${search.value}&` : "";
      try {
         const response = await axios.get(`${server}products?${searchParam}page=${pageOn}&limit=${limit}`);
         if (response.status === 200) {
            const { docs, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = response.data;
            setProducts([...docs]);
            setPagination({ totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage, page });
         }
      } catch ({ name, message }) {
         console.error(`${name}: ${message}`);
      }
   };

   const deleteProduct = async (_id) => {
      try {
         const productDeleted = {
            id: _id,
            deleted: true
         };
         const response = await axios.patch(`${server}products`, productDeleted, {
            headers: {
               "Content-Type": "application/json"
            }
         });
         if (response.status === 200) {
            fetchProducts(pagination.page);
         }
      } catch ({ name, message }) {
         console.error(`${name}: ${message}`);
      }
   }

   const validateSearch = () => {
      const regexValue = /^[\w ]+$/;
      if (!search.value) {
         setSearch((prev) => ({ ...prev, error: "Ingresa un valor para buscar" }));
      } else if (!regexValue.test(search.value)) {
         setSearch((prev) => ({ ...prev, error: "Búsqueda inválida" }));
      } else {
         setSearch((prev) => ({ ...prev, error: "" }));
         fetchProducts();
      }
   }
   return (
      <section className="pt-[50px] gap-[25px] lg:pr-[25px] max-lg:px-[25px] flex flex-col w-full box-border relative h-max pb-10 lg:justify-center">
         <hgroup className="flex max-lg:flex-col gap-[25px]">
            <div className="flex flex-col lg:w-[30%]">
               <div className="flex gap-[10px] items-end">
                  <h1 className="font-medium text-[18px]">Tabla de Productos</h1>
                  <h4 className="flex items-center font-medium text-[12px] text-[#3056D3] bg-[#F9F5FF] rounded-full p-[10px] h-[22px]">{pagination.totalDocs > 0 ? (pagination.totalDocs === 1 ? `${pagination.totalDocs} producto` : `${pagination.totalDocs} productos`) : "No hay productos"}</h4>
               </div>
               <p className="text-[14px] text-[#667085]">Lista de todos los productos en el inventario</p>
            </div>
            <div className="flex justify-between lg:w-[60%]">
               <div className="flex justify-center lg:border-[#E7E7E7] lg:border-[1px] bg-[#F1F6F9] h-[45px] rounded-[35px] lg:bg-[#F8FAFC] lg:rounded-[8px]">
                  <div className="flex flex-col justify-center items-center lg:w-[350px]">
                     <input
                        className="lg:w-full text-[14px]"
                        type="text"
                        placeholder="Buscar un producto"
                        id="search"
                        onChange={(event) => setSearch((prev) => ({ ...prev, value: event.target.value }))}
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
               <input className="lg:hidden w-[45px] " type="image" src={plus} onClick={() => addProduct.current.showModal()} alt="Nuevo producto" />
               <button className="max-lg:hidden text-[14px] flex justify-center items-center w-[180px] gap-[10px] bg-[#3056D3] rounded-[8px] text-white h-[40px]" onClick={() => addProduct.current.showModal()}>
                  <img src={plusDesktop} alt="nuevo producto" />
                  <p className="leading-6">Agregar producto</p>
               </button>
            </div>
         </hgroup>
         <dialog className="dialog" ref={addProduct}>
            <ProductForm />
            <input type="image" className="absolute right-[5px] top-[10px] cursor-pointer w-[35px]" src={cancel} alt="Cancelar" onClick={() => { addProduct.current.close(); fetchProducts(pagination.page) }} />
         </dialog>
         <section id="productsDashboard" className="flex flex-col lg:w-full items-center text-[#667085] bg-[#F1F6F9] rounded-[20px] lg:mt-[75px]">
            <div className="flex font-medium justify-around w-full max-lg:hidden">
               <p className="w-[7%] text-center ">Imagen</p>
               <p className="w-[14%]">Nombre</p>
               <p className="w-[14%]">Descripción</p>
               <p className="w-[14%]">Categoría</p>
               <p className="w-[14%]">Precio Unitario</p>
               <p className="w-[14%]">Inventario</p>
               <p className="w-[66px] ">Acciones</p>
            </div>
            {products && products.map((product, index) => (
               <div className={`flex w-full justify-between border-y-[1px] lg:gap-[25px] lg:bg-white border-[#EAECF0] p-[12px] box-border h-[130px] ${index === 0 && "max-lg:rounded-t-[20px]"} ${index === products.length - 1 && "rounded-b-[20px]"}`} key={product._id}>
                  <div className="flex flex-col justify-center items-center">
                     <figure className="relative flex justify-center items-center rounded-full bg-[#E7E7E7] w-[88px] h-[88px] shadow-sm">
                        <img className="w-[50px]" src={server + product.imageURL} alt={product.name} />
                     </figure>
                  </div>
                  <div className="flex gap-[10px] lg:w-full">
                     <div className="flex flex-col font-medium justify-between lg:hidden">
                        <p className="text-right">Nombre:</p>
                        <p className="text-right">Categoría:</p>
                        <p className="text-right">Precio Und.:</p>
                        <p className="text-right">Inventario:</p>
                     </div>
                     <div className="flex lg:items-center max-lg:flex-col max-lg:max-w-[165px] lg:gap-[25px] justify-between text-[14px] lg:w-full">
                        <p className="text-left overflow-x-auto max-lg:whitespace-nowrap max-lg:max-w-[78px] lg:w-full">{product.name}</p>
                        <p className="text-left overflow-x-auto max-lg:whitespace-nowrap max-lg:hidden lg:w-full">{product.description}</p>
                        <p className="text-left overflow-x-auto max-lg:whitespace-nowrap max-lg:max-w-[78px] lg:w-full">{product.category}</p>
                        <p className="text-left overflow-x-auto max-lg:whitespace-nowrap max-lg:max-w-[78px] lg:w-full">${product.price}</p>
                        <p className="text-left overflow-x-auto max-lg:whitespace-nowrap max-lg:max-w-[78px] lg:w-full">{product.stock}</p>
                     </div>
                  </div>
                  <div className="flex max-lg:flex-col max-lg:w-[25px] justify-center gap-[25px]">
                     <input type="image" src={editIcon} alt="Editar" onClick={() => productsRefs[index].current && productsRefs[index].current.showModal()} />
                     <input type="image" src={deleteIcon} alt="Eliminar" onClick={() => deleteProduct(product._id)} />
                  </div>
                  <dialog className="dialog" ref={productsRefs[index]}>
                     <EditProduct {...product} />
                     <input type="image" className="absolute right-[5px] top-[10px] cursor-pointer w-[35px]" src={cancel} alt="Cancelar" onClick={() => { if (productsRefs[index].current) { productsRefs[index].current.close(); fetchProducts(pagination.page) } }} />
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
                           fetchProducts(value);
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
                  onClick={() => { fetchProducts(pagination.prevPage) }}
               >
                  Anterior
               </button>
               <button
                  className="border-[1px] border-[#9BA4B4] bg-[#3056D3] rounded-[10px] text-white w-[90px] h-[36px]"
                  onClick={() => { fetchProducts(pagination.nextPage) }}
               >
                  Siguiente
               </button>
            </div>
         </div>
      </section>
   );
};

export default ProductsDashboard;