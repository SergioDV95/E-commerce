import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { shoppingCart, Session } from "../Session/session";
import axios from "axios";
import { lens, lens2, cart_black, cart_white, cart_green, CartModal } from "../components/exportsImports";

function Products() {
   const server = "http://localhost:3001/";
   const [products, setProducts] = useState([]);
   const { user } = useContext(Session);
   const { cartProducts, setCartProducts } = useContext(shoppingCart);
   const limit = 8;
   const [productsRefs, setProductsRefs] = useState([]);
   const cart = useRef();
   const [src, setSrc] = useState({ lens: lens, cart: cart_white });
   const [search, setSearch] = useState({
      value: "",
      error: ""
   });
   const [pagination, setPagination] = useState({
      pages: [],
      currentPage: 1
   });

   useEffect(() => {
      setProductsRefs((refs) => Array(products.length).fill().map((_, index) => refs[index] || React.createRef()));
   }, [products]);

   useEffect(() => {
      const mediaQuery = window.matchMedia("(min-width: 1024px)");
      function handleResize() {
         if (mediaQuery.matches) {
            setSrc({ lens: lens2, cart: cart_black });
         } else {
            setSrc({ lens: lens, cart: cart_white });
         }
      }
      handleResize();
      mediaQuery.addEventListener("change", handleResize);
      return () => {
         mediaQuery.removeEventListener("change", handleResize);
      };
   }, []);

   useEffect(() => {
      if (!search.value) {
         fetchProducts();
      }
   }, [search.value]);

   const handleProducts = (event) => {
      const { id, checked } = event.target;
      if (checked) {
         setCartProducts((prev) => ({
            ...prev,
            products: [...prev.products, id],
            checked: { ...prev.checked, [id]: checked },
         }));
      } else {
         setCartProducts((prev) => ({
            ...prev,
            products: prev.products.filter((Id) => Id !== id),
            checked: { ...prev.checked, [id]: checked },
         }))
      }
   }

   const fetchProducts = async (pageOn = 1) => {
      const searchParam = search.value ? `search=${search.value}&` : "";
      try {
         const response = await axios.get(`${server}products?${searchParam}page=${pageOn}&limit=${limit}`);
         if (response.status === 200) {
            const { docs, totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = response.data;
            setProducts([...docs]);
            setPagination({totalPages, totalDocs, hasPrevPage, hasNextPage, prevPage, nextPage, page});
         }
      } catch ({ name, message }) {
         console.error(`${name}: ${message}`);
      }
   }

   const validateSearch = () => {
      const regexValue = /^[\w ]+$/;
      if (!search.value) {
         setSearch((prev) => ({ ...prev, error: "" }));
      } else if (!regexValue.test(search.value)) {
         setSearch((prev) => ({ ...prev, error: "Búsqueda inválida" }));
      } else {
         setSearch((prev) => ({ ...prev, error: "" }));
         fetchProducts();
      }
   }

   return (
      <section className="pt-[50px] gap-[50px] bg-white px-[25px] flex flex-col w-full box-border relative pb-10 lg:px-[45px] lg:justify-center">
         <div className="flex relative gap-[10px] lg:justify-center lg:w-full">
            <div className="flex justify-center relative lg:border-[#E7E7E7] lg:border-[1px] bg-[#F1F6F9] w-fit h-[45px] rounded-[35px] lg:bg-[#F8FAFC] lg:rounded-[8px]">
               <div className="flex flex-col justify-center items-center lg:w-[350px]">
                  <input
                     className="w-full"
                     type="text"
                     placeholder="¿Qué necesitas?"
                     id="search"
                     onChange={(event) => setSearch((prev) => ({ ...prev, value: event.target.value }))}
                     onKeyDown={(event) => {
                        if (event.key === "Enter") {
                           validateSearch();
                        }
                     }}
                  />
                  <div className="relative w-full top-[13px]">
                     <span className="error">{search.error}</span>
                  </div>
               </div>
               <figure
                  className="flex z-10 justify-center items-center max-lg:bg-[#14274E] max-lg:rounded-[35px] w-[45px] h-[45px] cursor-pointer"
                  onClick={validateSearch}>
                  <input
                     type="image"
                     alt="buscar"
                     src={src.lens}
                     className="w-[25px]"
                  />
               </figure>
            </div>
            <figure className={`flex fixed max-lg:right-[25px] lg:relative lg:border-[1px] lg:border-[#E7E7E7] max-lg:z-30 justify-center items-center bg-[#14274E] lg:bg-white lg:rounded-[8px] rounded-[35px] w-[45px] h-[45px] cursor-pointer`} onClick={() => cart.current.open ? cart.current.close() : cart.current.show()}>
               <input
                  src={src.cart}
                  type="image"
               />
               {cartProducts.products.length > 0 && <p className="rounded-full w-[18px] h-[18px] bg-[#9BA4B4] lg:bg-[#3056D3] text-white text-[14px] flex justify-center items-center absolute top-0 lg:-top-[5px] right-0 lg:-right-[5px] ">{cartProducts.products.length}</p>}
            </figure>
            <dialog className="dialog w-[70%] lg:w-[30%] fixed lg:absolute lg:mr-[50px] z-20 top-[145px] lg:top-[45px] " ref={cart}>
               <CartModal />
            </dialog>
         </div>
         <h4 className="text-[20px] font-bold text-[#14274E]">Productos Populares</h4>
         <div id="Products" className="flex flex-col w-full items-start text-[14px] lg:text-[16px] ">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] lg:gap-[50px] lg:w-full ">
               {products && products.map((product, index) => (
                  <div className="flex bg-[#D9D9D9] rounded-[20px] lg:justify-center relative" key={product._id}>
                     <div className={`absolute z-10 flex justify-center items-center top-[10px] left-[15px] rounded-full w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] ${!user && "opacity-50"} ${cartProducts.checked && cartProducts.checked[product._id] ? "bg-[#edfff8] border-[1px] border-[#429c5e]" : "bg-white"}`} onClick={() => productsRefs[index].current.click()}>
                        <img className="w-[25px] h-[25px] lg:w-[25px] lg:h-[25px]" type="image" src={cartProducts.checked && cartProducts.checked[product._id] ? cart_green : cart_black} alt="Carrito" />
                        <input className="hidden"
                           type="checkbox"
                           disabled={!user}
                           ref={productsRefs[index]}
                           title="Añadir al carrito"
                           checked={cartProducts.checked && (cartProducts.checked[product._id] || false)}
                           onChange={handleProducts}
                           id={product._id}
                           value={product.price}
                        />
                     </div>
                     <Link to={`/products/${product._id}`} className="pb-[10px] w-[230px] z-0">
                        <div className="relative flex justify-center items-center">
                           <img className="h-[220px] lg:max-h-[230px]" src={server + product.imageURL} alt={product.name} />
                        </div>
                        <div className="flex flex-col gap-[10px] px-[10px] font-semibold ">
                           <p className="h-[30px]">{product.name}</p>
                           <div className="flex justify-between items-center">
                              <p className="text-[20px] ">${product.price.toFixed(2)}</p>
                              <p className={`h-[20px] lg:h-[25px] flex items-center justify-center w-[80px] text-[11px] lg:text-[14px] rounded-[4px] ${product.stock > 0 ? "text-[#064E3B] bg-[#ECFDF5]" : "text-[#991B1B] bg-[#FEF2F2]"}`}>{product.stock > 0 ? "Disponible" : "Agotado"}</p>
                           </div>
                        </div>
                     </Link>
                  </div>
               ))}
            </div>
         </div>
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
                  onClick={() => {fetchProducts(pagination.prevPage)}}
               >
                  Anterior
               </button>
               <button 
                  className="border-[1px] border-[#9BA4B4] bg-[#3056D3] rounded-[10px] text-white w-[90px] h-[36px]"
                  onClick={() => {fetchProducts(pagination.nextPage)}}
               >
                  Siguiente
               </button>
            </div>
         </div>
      </section>
   );
}

export default Products;