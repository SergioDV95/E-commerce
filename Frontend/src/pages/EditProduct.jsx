import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../tailwind.css"
import { camera, checkmark } from "./../components/exportsImports";

function EditProduct({ _id, name, category, price, stock, description, imageURL }) {
   const server = "https://backendprueba.xyz/";
   const [product, setProduct] = useState({
      id: _id
   });
   const [input, setInput] = useState({
      name: name,
      price: price,
      stock: stock,
      description: description,
      category: category,
      image: ""
   });
   const [error, setError] = useState({});
   const [success, setSuccess] = useState(false);
   const successRef = useRef();
   const button = useRef();
   const inputFile = useRef();
   const [imageState, setImageState] = useState(null);
   useEffect(() => {
      if (input.image) {
         const url = URL.createObjectURL(input.image);
         setImageState(url);
      }
   }, [input.image]);
   useEffect(() => {
      return () => {
         if (imageState) {
            URL.revokeObjectURL(imageState);
            setImageState(null);
         }
      };
   }, [imageState]);
   const handleSubmit = async () => {
      try {
         const productData = new FormData();
         for (let key in product) {
            productData.append(key, product[key]);
         }
         for (let pair of productData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
         }         
         const response = await axios.patch(`${server}products`, productData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         if (response.status === 202) {
            setSuccess(true);
            const fields = ["image", "name", "price", "stock", "description", "category"];
            for (const key of fields) {
               if (product[key]) {
                  setProduct((prev) => ({...prev, [key]: ""}));
               }
               if (error[key]) {
                  setError((prev) => ({...prev, [key]: ""}));
               }
            }
         }
      } catch ({response, request, message, config}) {
         if (response.data) {
            const errors = response.data;
            console.log(response.status);
            console.log(response.headers);
            let errorList = {};
            for (let key in errors) {
               if (errors[key]) {
                  errorList = {...errorList, [key]: errors[key]};
               }
            }
            if (Object.keys(errorList).length > 0) {
               setError((prev) => ({...prev, ...errorList}));
            }
            if (errors.name && errors.message) {
               console.log(`${errors.name}: ${errors.message}`);
            }
         } else if (request) {
            console.log(request);
         } else {
            console.log("Error", message);
         }
         console.log(config);
      }
   }
   const handleChange = (event) => {
      const { name, value } = event.target;
      setInput((prev) => ({...prev, [name]: value }));
   }
   const handleValidation = () => {
      const regexList = {
         name: /^[a-z0-9áéíóúñÁÉÍÓÚÑ' &:\-.]+$/i,
         price: /^([1-9]\d{0,3}(\.\d{1,2})?|0\.\d?[1-9])$/,
         stock: /^[1-9]\d{0,6}$/,
         description: /^[a-z0-9\-áéíóúñÁÉÍÓÚÑ,.:\s]+$/i
      };
   
      const message = {
         name: "Nombre inválido",
         price: "Precio inválido",
         stock: "Número inválido",
         description: "Descripción inválida",
         image: "Sólo archivos en formato: png, jpg, jpeg"
      };
      let productData = {};
      let errors = {};
      let isValid = true;
      for (let field in input) {
         if (input[field]) {
            if (regexList[field] && !regexList[field].test(input[field])) {
               errors = {...errors, [field]: message[field]};
               productData = {...productData, [field]: ""};
               isValid = false;
            } else {
               errors = {...errors, [field]: ""};
               productData = {...productData, [field]: input[field]};
            }
         } else if (field === "image") {
            if (inputFile.current.files.length > 0) {
               const file = inputFile.current.files[0];
               switch (file.type) {
                  case "image/jpeg":
                  case "image/png":
                     setInput((prev) => ({...prev, image: file}));
                     errors = {...errors, image: "" };
                     break;
                  default:
                     errors = {...errors, [field]: message[field]};
                     isValid = false;
               }
            }
         } else if (field === "category") {
            if (input[field] === "") {
               productData = {...productData, [field]: ""};
               isValid = false;
            } else {
               errors = {...errors, [field]: ""};
               productData = {...productData, [field]: input[field]};
            }
         }
      }
      button.current.disabled = !isValid;
      setError(errors);
      setProduct((prev) => ({...prev, ...productData}));
   }
   useEffect(() => {
      let timer;
      if (success) {
         successRef.current.scrollIntoView({ behavior: "instant", block: "start" });
         timer = setTimeout(() => {
            setSuccess(false);
         }, 3000);
      }
      return () => {
         if (timer) {
            clearTimeout(timer);
         }
      };
   }, [success]);  
   
   useEffect(() => {
      handleValidation();
      //eslint-disable-next-line
   }, [input]);
   return (
      <form ref={successRef} className="flex flex-col relative w-[310px] lg:w-[636px] box-border items-center border-[1px] border-[#EAECF0] rounded-[20px]">
         <div className="flex w-full justify-center items-center border-b-[1px] border-[#EAECF0] h-[50px]">
            <p className="text-[20px] font-semibold">Editar producto</p>
         </div>
         <div className="flex relative w-full flex-col box-border">
            <div className={`flex h-[42px] w-full justify-center items-center transition-[display] duration-500 ease-in border-b-[1px] border-[#EAECF0] bg-[#C4F9E2] ${success ? "" : "hidden"}`}>
               <div className="flex gap-[8px]">
                  <img src={checkmark} alt="Checkmark" />
                  <p className="text-[#004434] text-[12px]">Producto actualizado</p>
               </div>
            </div>
            <div className="flex flex-col w-full gap-[8px] p-[25px] border-b-[1px] border-[#EAECF0]">
               <div className="flex justify-center">
                  <figure className="relative flex justify-center items-center rounded-full bg-[#E7E7E7] w-[100px] h-[100px] shadow-sm">
                     <img className={`w-[60px] ${!imageState || !imageURL && "hidden" }`} src={imageState ? imageState : server + imageURL} key={imageState} alt="imagen seleccionada" />
                     <div className="absolute bottom-0 left-0 flex justify-center items-center w-[35px] h-[35px] rounded-full bg-[#FFFFFF] border-[1px] border-[#E7E7E7]"
                     onClick={() => inputFile.current.click()}>
                        <img className="w-[25px]"
                        src={camera} alt="camara" />
                     </div>
                     <input
                        title="Subir imagen"
                        className="hidden"
                        ref={inputFile}
                        type="file"
                        name="image"
                        accept="image/jpeg, image/png"
                        onChange={handleValidation}
                        onClick={(event) => (event.target.value = null)}
                     />
                  </figure>
               </div>
               <div className="relative flex justify-center">
                  <span className="error">{error.image}</span>
               </div>
               <div className="flex max-lg:flex-col gap-[8px]">
                  <div className="flex flex-col gap-[8px] lg:w-full">
                     <label className="label" htmlFor={`${_id}1`}>Nombre:</label>
                     <input
                        id={`${_id}1`}
                        className={`data123 w-full rounded-[7px] ${error.name ? "border-[#DC3545]" : ""}`}
                        type="text"
                        name="name"
                        value={input.name}
                        onChange={handleChange}
                        title={"Letras, números, espacios y caracteres entre:\n:&'"}
                     />
                     <div className="relative">
                        <span className="error">{error.name}</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-[8px] lg:w-full">
                     <label className="label" htmlFor={`${_id}2`}>Categoría:</label>
                     <select
                        id={`${_id}2`}
                        className={`data123 max-lg:w-[50%] rounded-[7px] ${error.category ? "border-[#DC3545]" : ""}`}
                        name="category"
                        title="categoría"
                        value={input.category}
                        onChange={handleChange}
                     >
                        <option className="text-[#9BA4B4]" value="">--Ninguno--</option>
                        <option value="Alimentos">Alimentos</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Mascotas">Mascotas</option>
                        <option value="Limpieza">Limpieza</option>
                     </select>
                     <div className="relative">
                        <span className="error">{error.category}</span>
                     </div>
                  </div>
               </div>
               <div className="flex w-full gap-[10px] ">
                  <div className="flex flex-col gap-[8px] lg:w-full">
                     <label className="label" htmlFor={`${_id}3`}>Precio:</label>
                     <input
                        id={`${_id}3`}
                        className={`data123 w-full rounded-[7px] ${error.price ? "border-[#DC3545]" : ""}`}
                        type="text"
                        min="0"
                        step="0.01"
                        name="price"
                        value={input.price}
                        onChange={handleChange}
                        onInput={(event) => {event.target.value = event.target.value.replace(/[^\d.]/, "");}}
                        title="Solo números enteros o con hasta dos decimales"
                     />
                     <div className="relative">
                        <span className="error">{error.price}</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-[8px] lg:w-full">
                     <label className="label" htmlFor={`${_id}4`}>Inventario:</label>
                     <input
                        id={`${_id}4`}
                        className={`data123 w-full rounded-[7px] ${error.stock ? "border-[#DC3545]" : ""}`}
                        type="text"
                        min="0"
                        name="stock"
                        value={input.stock}
                        onChange={handleChange}
                        onInput={(event) => {event.target.value = event.target.value.replace(/[^\d]/, "");}}
                        title="Solo números enteros mayores que 0"
                     />
                     <div className="relative">
                        <span className="error">{error.stock}</span>
                     </div>
                  </div>
               </div>
               <label className="label" htmlFor={`${_id}5`}>Descripción:</label>
               <textarea
                  id={`${_id}5`}
                  className={`data123 w-full rounded-[7px] focus:h-[100px] transition-[height] duration-500 ease-in ${error.description ? "border-[#DC3545]" : ""}`}
                  name="description"
                  value={input.description}
                  onChange={handleChange}
                  title={"Letras, números, espacios y caracteres entre:\n:-,.:"}
               />
               <div className="relative">
                  <span className="error">{error.description}</span>
               </div>
            </div>
         </div>
         <div className="p-[25px] w-full">
            <button className={button.current && button.current.disabled === true ? "btn text-[20px] bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px] opacity-50" : "btn text-[20px] bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px]"}
               ref={button}
               onClick={handleSubmit}
               type="button">Actualizar
            </button>
         </div>
      </form>
   );
};

export default EditProduct;