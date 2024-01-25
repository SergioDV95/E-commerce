import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../tailwind.css"
import { camera, checkmark } from "../components/exportsImports";

function ProductForm() {
   const server = "http://localhost:3001/";
   const [product, setProduct] = useState({});
   const [error, setError] = useState({});
   const [input, setInput] = useState({
      name: "",
      price: "",
      stock: "",
      description: "",
      category: "",
      image: ""
   });
   const [success, setSuccess] = useState(false);
   const successRef = useRef();
   const button = useRef();
   const inputFile = useRef();
   const [imageUrl, setImageUrl] = useState(null);

   useEffect(() => {
      if (input.image) {
         const url = URL.createObjectURL(input.image);
         setImageUrl(url);
      }
   }, [input.image]);
   useEffect(() => {

      return () => {
         if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
            setImageUrl(null);
         }
      };
   }, [imageUrl]);

   const handleSubmit = async () => {
      try {
         const response = await axios.post(`${server}products`, product, {
            headers: {
               "Content-Type": "application/json"
            }
         });
         if (response.status === 201) {
            const imageFile = new FormData();
            imageFile.append("image", inputFile.current.files[0]);
            imageFile.append("id", response.data._id);
            const newResponse = await axios.post(`${server}products/uploadImage`, imageFile, {
               headers: {
                  "Content-Type": "multipart/form-data"
               }
            });
            if (newResponse.status === 200) {
               setSuccess(true);
               const keys = ["image", "name", "price", "stock", "description", "category"];
               for (const key of keys) {
                  if (product[key]) {
                     setProduct((prev) => ({...prev, [key]: ""}));
                  }
                  if (input[key]) {
                     setInput((prev) => ({...prev, [key]: ""}));
                  }
                  if (error[key]) {
                     setError((prev) => ({...prev, [key]: ""}));
                  }
               }
            }
         }
      } catch ({name, message}) {
         console.error(`Ha ocurrido un error: ${name}. Con el mensaje: ${message}.`);
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
      let product = {};
      let errors = {};
      let isValid = true;
      for (let field in input) {
         if (input[field]) {
            if (regexList[field] && !regexList[field].test(input[field])) {
               errors = {...errors, [field]: message[field]};
               product = {...product, [field]: ""};
               isValid = false;
            } else {
               errors = {...errors, [field]: ""};
               product = {...product, [field]: input[field]};
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
            } else {
               isValid = false;
            }
         } else if (field === "category") {
            if (input[field] === "") {
               product = {...product, [field]: ""};
               isValid = false;
            } else {
               errors = {...errors, [field]: ""};
               product = {...product, [field]: input[field]};
            }
         }
         else {
            isValid = false;
         }
      }
      button.current.disabled = !isValid;
      setError(errors);
      setProduct(product);
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
      <form ref={successRef} className="flex flex-col relative w-[310px] lg:w-[640px] box-border items-center border-[1px] border-[#EAECF0] rounded-[20px]">
         <div className="flex w-full justify-center items-center border-b-[1px] border-[#EAECF0] h-[50px]">
            <p className="text-[20px] font-semibold">Crear un nuevo producto</p>
         </div>
         <div className="flex relative w-full flex-col box-border">
            <div className={`flex h-[42px] w-full justify-center items-center border-b-[1px] border-[#EAECF0] bg-[#C4F9E2] ${success ? "" : "hidden"}`}>
               <div className="flex gap-[8px]">
                  <img src={checkmark} alt="Checkmark" />
                  <p className="text-[#004434] text-[12px]">Nuevo producto creado</p>
               </div>
            </div>
            <div className="flex flex-col w-full gap-[8px] p-[25px] border-b-[1px] border-[#EAECF0]">
               <div className="flex justify-center">
                  <figure className="relative flex justify-center items-center rounded-full bg-[#E7E7E7] w-[100px] h-[100px] shadow-sm">
                     <img className={`w-[60px] ${!imageUrl && "hidden" }`} src={imageUrl} key={imageUrl} alt="imagen seleccionada" />
                     <div className="absolute bottom-0 left-0 flex justify-center items-center hover:cursor-pointer w-[35px] h-[35px] rounded-full bg-[#FFFFFF] border-[1px] border-[#E7E7E7]"
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
                     <label className="label" htmlFor="name">Nombre:</label>
                     <input
                        id="name"
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
                     <label className="label" htmlFor="category">Categoría:</label>
                     <select
                        id="category"
                        className={`data123 max-lg:w-[50%] rounded-[7px] ${!input.category ? "text-[#9BA4B4]" : ""} ${error.category ? "border-[#DC3545]" : ""}`}
                        name="category"
                        title="categoría"
                        value={input.category}
                        onChange={handleChange}
                     >
                        <option value="">--Ninguna--</option>
                        <option className="text-black" value="Alimentos">Alimentos</option>
                        <option className="text-black" value="Bebidas">Bebidas</option>
                        <option className="text-black" value="Mascotas">Mascotas</option>
                        <option className="text-black" value="Limpieza">Limpieza</option>
                     </select>
                     <div className="relative">
                        <span className="error">{error.category}</span>
                     </div>
                  </div>
               </div>
               <div className="flex w-full gap-[10px] ">
                  <div className="flex flex-col gap-[8px] lg:w-full">
                     <label className="label" htmlFor="price">Precio:</label>
                     <input
                        id="price"
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
                     <label className="label" htmlFor="stock">Inventario:</label>
                     <input
                        id="stock"
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
               <label className="label" htmlFor="description">Descripción:</label>
               <textarea
                  id="description"
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
               type="button">Añadir producto
            </button>
         </div>
      </form>
   );
};

export default ProductForm;