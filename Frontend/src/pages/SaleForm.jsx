import { useState, useEffect, useRef, useContext } from "react";
import {Session} from "../Session/session";
import axios from "axios";
import "../tailwind.css"
import { checkmark, more, less } from "../components/exportsImports";

function SaleForm() {
   const { user } = useContext(Session);
   const server = "https://backendprueba.xyz/";
   const [sale, setSale] = useState({
      vendor: user && user.role === "vendor" ? user.email : "--",
      subtotal: 0,
      tax: 0,
      total: 0
   });
   const [error, setError] = useState({});
   const [pagination, setPagination] = useState({});
   const limit = 6;
   const [products, setProducts] = useState([]);
   const [input, setInput] = useState({
      client: "",
      products: [],
      checked: {},
      quantity: {}
   });
   const [success, setSuccess] = useState(false);
   const button = useRef();
   const successRef = useRef();

   const productsList = async (page = 1) => {
      const response = await axios.get(`${server}products/productsList`);
      if (response.status === 200) {
         setProducts(response.data);
      }
   }
   useEffect(() => {
      productsList();
   }, []);

   const handleSubmit = async () => {
      try {
         sale.quantity = input.quantity;
         const response = await axios.post(`${server}sales`, sale, {
            headers: {
               "Content-Type": "application/json"
            }
         });
         if (response.status === 201) {
            setSuccess(true);
            setSale((prev) => ({
               ...prev,
               subtotal: 0,
               tax: 0,
               total: 0
            }))
            setInput({
               client: "",
               products: [],
               checked: {},
               quantity: {}
            });
            setError({});
         }
      } catch ({name, message, response}) {
         if (response.data) {
            const errors = response.data;
            let errorList = {};
            for (let key in errors) {
               if (errors[key]) {
                  errorList = {...errorList, [key]: errors[key]};
               }
            }
            if (Object.keys(errorList).length > 0) {
               setError((prev) => ({...prev, ...errorList}));
            }
         }
         console.error(`Ha ocurrido un error: ${name}. Con el mensaje: ${message}.`);
      }
   }

   const handleChange = (event) => {
      const { name, value } = event.target;
      setInput((prev) => ({...prev, [name]: value }));
   }

   const handleProducts = (event) => {
      const { id, checked, value } = event.target;
      if (checked) {
         setInput((input) => ({
            ...input,
            products: [...input.products, id],
            price: {...input.price, [id]: value},
            checked: {...input.checked, [id]: checked},
            quantity: {...input.quantity, [id]: 1}
         }
      ));
      } else {
         setInput((input) => {
            delete input.price[id];
            delete input.quantity[id];
            return {
               ...input,
               products: input.products.filter((Id) => Id !== id),
               price: {...input.price},
               checked: {...input.checked, [id]: checked},
               quantity: {...input.quantity}
            }
         })
      }
   }

   const decrementQuantity = (id) => {
      setInput((prev) => ({...prev, quantity: {...prev.quantity, [id]: Math.max((prev.quantity[id] || 0) - 1, 1) }}));
   };

   const incrementQuantity = (id, stock) => {
      setInput((prev) => ({...prev, quantity: {...prev.quantity, [id]: (prev.quantity[id] || 0) < stock ? (prev.quantity[id] || 0) + 1 : stock }}));
   };

   const handleValidation = () => {
      const regexList = {
         client: /^[a-z0-9.-]+@[a-z0-9-]+(\.[a-z]{2,4}){1,3}$/i
      };
   
      const message = {
         client: "Correo inválido",
         products: "La cantidad excede el inventario"
      };
      let sale = {};
      let errors = {};
      let hasQuantity = false;
      let isValid = true;
      for (let field in input) {
         if (input[field]) {
            if (regexList[field] && !regexList[field].test(input[field])) {
               errors = {...errors, [field]: message[field]};
               sale = {...sale, [field]: ""};
               isValid = false;
            } else {
               errors = {...errors, [field]: ""};
               sale = {...sale, [field]: input[field]};
            }
         } else {
            isValid = false;
         }
      }
      for (let id of input.products) {
         if (input.quantity[id] > 0) {
            hasQuantity = true;
            break;
         }
      }
      if (!hasQuantity) {
         isValid = false;
      }
      button.current.disabled = !isValid;
      setError(errors);
      if (!button.current.disabled) {
         sale = {...sale, products: input.products, quantity: input.quantity};
      } else {
         sale = {...sale, products: [], quantity: {}};
      }
      setSale((prev) => ({...prev, ...sale}));
   }

   useEffect(() => {
      handleValidation();
      //eslint-disable-next-line
   }, [input]);

   useEffect(() => {
      let timer;
      if (success) {
         successRef.current.scrollIntoView({ behavior: "instant", block: "start" });
         timer = setTimeout(() => {
            setSuccess(false);
         }, 2500);
      }
      return () => {
         if (timer) {
            clearTimeout(timer);
         }
      };
   }, [success]);

   useEffect(() => {
      const calculateTotal = () => {
         let addition = 0;
         for (let id in input.price) {
            addition += Number(input.price[id]) * Number(input.quantity[id]);
         }
         let tribute = addition * 0.16;
         setSale((prev) => ({...prev, subtotal: addition, tax: tribute, total: addition + tribute}));
      }
      calculateTotal();
   }, [input]); 

   return (
      <form className="flex max-lg:text-[14px] flex-col relative w-[310px] lg:w-[640px] box-border items-center border-[1px] border-[#EAECF0] rounded-[20px]" ref={successRef}>
         <div className="flex w-full justify-center items-center border-b-[1px] border-[#EAECF0] h-[50px]">
            <p className="text-[20px] font-semibold">Hacer una venta</p>
         </div>
         <div className="flex relative w-full flex-col box-border">
            <div className={`flex h-[42px] w-full justify-center items-center border-b-[1px] border-[#EAECF0] bg-[#C4F9E2] ${success ? "" : "hidden"}`}>
               <div className="flex gap-[8px]">
                  <img src={checkmark} alt="Checkmark" />
                  <p className="text-[#004434] text-[12px]">Nueva venta creada</p>
               </div>
            </div>
            <div className="flex flex-col w-full gap-[8px] p-[25px] border-b-[1px] border-[#EAECF0]">
               <div className="flex flex-col gap-[8px]">
                  <div className="flex flex-col gap-[8px] lg:w-full">
                     <label className="label" htmlFor="client">Correo del cliente:</label>
                     <input
                        id="client"
                        className={`data123 w-full rounded-[7px] ${error.client ? "border-[#DC3545]" : ""}`}
                        type="text"
                        name="client"
                        value={input.client}
                        onChange={handleChange}
                        title={"Letras, números, espacios y caracteres entre:\n:&'"}
                     />
                     <div className="relative">
                        <span className="error">{error.client}</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-[8px] lg:w-full">
                     <label className="label" htmlFor="products">Productos:</label>
                     <menu
                        id="products"
                        className={`w-full border-[#9BA4B4] h-[90px] overflow-y-scroll border-[1px] rounded-[7px] ${!input.products ? "text-[#9BA4B4]" : ""} ${error.products ? "border-[#DC3545]" : ""}`}
                        name="products"
                        title="productos"
                     >
                        {products && products.map((product, index) => (
                           <li className={`text-black px-[15px] lg:px-[30px] flex justify-between w-full border-[#9BA4B4] h-[60px] ${index !== products.length - 1 && "border-b-[1px]"}`} key={product._id} value={product._id}>
                              <div className="gap-[25px] w-full flex items-center lg:justify-around">
                                 <p className="w-full">{product.name}</p>
                                 <p className="lg:w-full">${product.price}</p>
                                 <p className="lg:w-full flex gap-[5px]">{product.stock - input.quantity[product._id] || product.stock}<span className="max-lg:hidden">disponibles</span></p>
                                 <input className=""
                                    type="checkbox"
                                    checked={input.checked && (input.checked[product._id] || false)}
                                    onChange={handleProducts}
                                    id={product._id}
                                    value={product.price}
                                 />
                              </div>
                           </li>
                        ))}
                     </menu>
                     <div className="relative">
                        <span className="error">{error.products}</span>
                     </div>
                  </div>
                  <div className={`lg:w-full flex flex-col ${input.products && input.products.length === 0 && "hidden"}`}>
                     <label htmlFor="selected">Productos seleccionados:</label>
                     <menu
                        id="selected"
                        className={`w-full border-[#9BA4B4] border-[1px] rounded-[7px]`}
                     >
                        {products && products.map((product, index) => {
                           for(let i = 0; i < input.products.length; i++) {
                              if (input.products[i] === product._id) {
                                 return (
                                    <li className={`text-black px-[20px] flex justify-between w-full border-[#9BA4B4] h-[60px] ${index !== products.length - 1 && "border-b-[1px]"}`} key={product._id} value={product._id}>
                                       <div className="flex gap-[25px] items-center w-full">
                                          <p className="lg:w-full">{product.name}</p>
                                          <p className="max-lg:hidden lg:w-full">${product.price}</p>
                                          <p className="w-full flex gap-[5px] max-lg:hidden">{product.stock - input.quantity[product._id] || product.stock}<span>disponibles</span></p>
                                          <div className="bg-[#F1F6F9] gap-[5px] flex h-fit rounded-full lg:gap-[10px]">
                                             <div className="bg-[#14274E] w-[30px] h-[30px] rounded-full flex justify-center items-center" onClick={() => decrementQuantity(product._id)}>
                                                <img className="w-[15px]" type="image" src={less} alt="Reducir" />
                                             </div>
                                             <p className="w-[15px] flex items-center justify-center">{input.quantity[product._id] || 0}</p>
                                             <div className="bg-[#14274E] w-[30px] h-[30px] rounded-full flex justify-center items-center" onClick={() => incrementQuantity(product._id, product.stock)}>
                                                <img className="w-[15px]" type="image" src={more} alt="Aumentar" />
                                             </div>
                                          </div>
                                       </div>
                                    </li>
                                 );
                              }
                           }
                        })}
                     </menu>
                  </div>
                  <div className="flex p-[25px] flex-col bg-[#F1F6F9] gap-[15px] text-[#223263] rounded-[5px] w-full">
                     <div className="flex items-end h-[20px]">
                        <p className="text-[#9098B1] text-[0.8em] w-full">Subtotal:</p><p className="w-full text-right">${Number(sale.subtotal).toFixed(2) || "0.00"}</p>
                     </div>
                     <div className="flex items-end h-[20px]">
                        <p className="text-[#9098B1] text-[0.8em] w-full">IVA 16%:</p><p className="w-full text-right">${Number(sale.tax).toFixed(2) || "0.00"}</p>
                     </div>
                     <div className="flex items-end h-[20px] font-bold">
                        <p className="w-full">Total:</p><p className="w-full text-right">${Number(sale.total).toFixed(2) || "0.00"}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="p-[25px] w-full">
            <button className={button.current && button.current.disabled === true ? "btn text-[20px] bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px] opacity-50" : "btn text-[20px] bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px]"}
               ref={button}
               onClick={handleSubmit}
               type="button">Realizar venta
            </button>
         </div>
      </form>
   );
}

export default SaleForm;
//cambio x