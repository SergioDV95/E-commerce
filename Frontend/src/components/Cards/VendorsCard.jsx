/* eslint-disable react/prop-types */
import {  motion } from "framer-motion"
import { useEffect, useState,useRef } from "react";
import axios from "axios";
import {camera,userIco} from "../exportsImports"


const VendorsCard = ({ isOpen,type, onClose,vendorEmail}) => {
  const [previousDates, setPreviosDates] = useState({})

  const [statusMsg, setStatusMsg] = useState("");

  const server = "https://backendprueba.xyz";
   const [user, setUser] = useState({
      avatar:"",
      name: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      address: "",
      role: "vendor"
   });
   const [error, setError] = useState({
      avatar: "",
      name: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      repPassword: "",
      address: ""
   });
   const [input, setInput] = useState({
      avatar: "",
      name: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      repPassword: "",
      address: "",
      role: "vendor"
   });
   const button = useRef();
   const inputFile = useRef();
   const [image, setImage] = useState("");
   
   const handleCleanInput = () => {
    const keys = ["avatar", "name", "lastName", "phone", "email", "password", "repPassword", "address"];
    for (const key of keys) {
      if (input[key]) {
          setInput((prev) => ({...prev, [key]: ""}));
      }
      if (error[key]) {
          setError((prev) => ({...prev, [key]: ""}));
      }
      if (user[key]) {
          setUser((prev) => ({...prev, [key]: ""}));
      }
    }
   }

   const handleSubmit = async () => {
    try {
      for (const prop in user) {
        if (user[prop] === "") {
          setStatusMsg("Debe llenar todos los campos");
          return;
        }
      }
      const formdata = new FormData();
      for (const prop in user) {
        let value = user[prop];
        if (typeof value === "string") {
          value = value.trim().toLowerCase();
        }
        formdata.append(prop, value);
      }
      console.log(formdata);
      const response = await axios.post(`${server}/users/newUser`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        setImage("")
        handleCleanInput();
        if(inputFile.current){
          inputFile.current.value = ""
        }
        setStatusMsg("El vendedor se ha creado correctamente");
      } else if (response.status === 500) {
        setStatusMsg("Error al crear el vendedor");
      }
    } catch ({ name, message, response }) {
      if (response.data.email) {
        setError((prev) => ({ ...prev, email: response.data.email }));
      }
      console.error(`${name}: ${message}`);
    }
  }

  const handleUpdate = async () => {
    try {
      const formdata = new FormData();
      for (const prop in input) {
        let value = input[prop];
        if (typeof value === "string") {
          value = value.trim().toLowerCase();
        }
        formdata.append(prop, value);
      }
      if (inputFile.current && inputFile.current.files.length > 0) {
        const file = inputFile.current.files[0];
        formdata.append("avatar", file);
      }
  
      const response = await axios.patch(
        `${server}/users/${vendorEmail}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.status === 201) {
        console.log(formdata);
        setStatusMsg("El vendedor ha sido editado correctamente");
      } else if (response.status === 500) {
        setStatusMsg("Error al editar el vendedor");
      }
    } catch ({ name, message, response }) {
      if (response.data.email) {
        setError((prev) => ({ ...prev, email: response.data.email }));
      }
      console.error(`${name}: ${message}`);
    }
  };

   const handleChange = (event) => {
      const { name, value } = event.target;
      setInput({...input, [name]: value });
   }


   const handleValidation = (type) => {
    const { password, repPassword } = input;
    const regexList = { 
      name: /^[a-zñ áéíóúñÁÉÍÓÚÑ]+$/i, 
      lastName: /^[a-zñ áéíóúñÁÉÍÓÚÑ]+$/i, 
      email: /^[a-z0-9.-]+@[a-z0-9-]+(\.[a-z]{2,4}){1,3}$/i, 
      phone: /^(\+[\d]{2})?\d{3,4}\d{3}\d{2}\d{2}$/, 
      password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&.*/])[^<>{}:;'"?,]{8,16}$/, 
      address: /^[a-z0-9-,. áéíóúñÁÉÍÓÚÑ]+$/i,
      role: /^[a-zñ áéíóúñÁÉÍÓÚÑ]+$/i, 
    };
  
    const message = {
      name: "El nombre es inválido",
      lastName: "El apellido es inválido",
      email: "El correo es inválido",
      phone: "El teléfono es inválido",
      password: "La contraseña es inválida",
      address: "La dirección es inválida",
      avatar: "Sólo en formato: png, jpg, jpeg"
    };
    
    let user = {};
    let errors = {};
    let isValid = true;
    
    for (let field in input) {
      if (input[field]) {
        if (regexList[field] && !regexList[field].test(input[field])) {
          errors = { ...errors, [field]: message[field] };
          user = { ...user, [field]: "" };
          isValid = false;
        } else {
          errors = { ...errors, [field]: "" };
          user = { ...user, [field]: input[field] };
        }
      } else if (field === "avatar") {
        if (inputFile.current && inputFile.current.files.length > 0) {
          const file = inputFile.current.files[0];
          setImage(file);
          isValid = true;
          switch (file.type) {
            case "image/png":
            case "image/jpeg":
              user = { ...user, avatar: file };
              errors = { ...errors, avatar: "" };
              break;
            default:
              errors = { ...errors, [field]: message[field] };
              user = { ...user, avatar: "" };
              isValid = false;
          }
        } else {
          isValid = false;
        }
      }
    }
    
    if (password && regexList.password.test(password)) {
      if (!repPassword) {
        isValid = false;
      } else if (password !== repPassword) {
        errors = { ...errors, repPassword: "La contraseña no coincide" };
        user = { ...user, password: "" };
        isValid = false;
      } else {
        errors = { ...errors, repPassword: "" };
        user = { ...user, password };
      }
    }
    if(button.current){
      if (type === "updateVendor") {
        button.current.disabled = false;
    } else if (type === "createVendor") {
        button.current.disabled = !isValid;
        setError(errors);
        setUser((prevState) => ({...prevState, ...user}));
    }
    }
  }

  const getVendor = async (vendorEmail) => {
    try {
      const response = await axios.get(`https://backendprueba.xyz/users/${vendorEmail}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setPreviosDates(data);
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

   useEffect(() => {
      handleValidation(type);
      //eslint-disable-next-line
   }, [input]);

   useEffect(() => {
     getVendor(vendorEmail)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [vendorEmail, isOpen]);

  return (
    <>
      {isOpen && type === "createVendor" && (
        <motion.div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-[120]">
          <div className="bg-white p-6 rounded-lg overflow-auto h-[95vh] w-[460px]">
            <form className="z-10 flex flex-col justify-center items-center gap-[21px]   rounded-[20px]">
              <div className="relative grid grid-cols-[1fr_5px]">
                <div>
                  <p className="text-[24px] border-[#E7E7E7] border-b-[1px] text-center w-full">
                    Crear nuevo Vendedor
                  </p>
                </div>
                <div
                  onClick={() => {
                    onClose();
                    setStatusMsg("");
                    setImage("")
                  }}
                  className="absolute top-0 right-[-100px] flex px-4 hover:text-white hover:bg-red-500 rounded-[8px] border border-[#394867]"
                >
                  <button className="text-[#394867] w-[20px]   font-bold rounded">
                    X
                  </button>
                </div>
              </div>
              {statusMsg && (
                <div
                  className={`${
                    statusMsg == "El vendedor se ha creado correctamente"
                      ? "bg-green-200 text-green-500 p-3"
                      : "bg-red-200 text-red-500 p-3"
                  }`}
                >
                  <span>{statusMsg}</span>
                </div>
              )}
              <div className="frame flex flex-col gap-[15px] px-4 w-full">
                <div className="flex justify-center">
                  <figure
                    onClick={() => inputFile.current.click()}
                    className="cursor-pointer relative rounded-full bg-[#E7E7E7] w-[125px] h-[125px] shadow-sm"
                  >
                    <div className="absolute z-10 bottom-0 flex justify-center items-center w-[35px] h-[35px] rounded-full bg-[#FFFFFF] border-[1px] border-[#E7E7E7]">
                      <img className="w-[25px]" src={camera} alt="camara" />
                    </div>
                    <div className="p-3 absolute top-0 right-3">
                      {image ? (
                        <img className="h-[100px] w-[100px] rounded-full" src={URL.createObjectURL(image)} alt="avatar" />
                      ): (
                        <img className="h-[100px] ml-1 rounded-full" src={userIco} alt="avatar" />
                      )}
                    </div>
                    <input
                      className="hidden"
                      ref={inputFile}
                      id="avatar"
                      type="file"
                      name="avatar"
                      accept="image/png, image/jpeg"
                      onChange={handleValidation}
                    />
                    
                  </figure>
                </div>
                <div className="relative">
                  <span className="">{error.avatar}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="name"
                    >
                      Nombre:
                    </label>
                    <input
                      className="hidden"
                      id="role"
                      type="text"
                      name="role"
                      value="vendor"
                    />
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.name ? "border-[#DC3545]" : ""
                      }`}
                      id="name"
                      type="text"
                      name="name"
                      value={input.name}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px] text-red-500">
                        {error.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="lastName"
                    >
                      Apellido:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.lastName ? "border-[#DC3545]" : ""
                      }`}
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={input.lastName}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px]">
                        {error.lastName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="phone"
                    >
                      Número de teléfono:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.phone ? "border-[#DC3545]" : ""
                      }`}
                      id="phone"
                      type="tel"
                      name="phone"
                      value={input.phone}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px]">{error.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="email"
                    >
                      Correo electrónico:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.email ? "border-[#DC3545]" : ""
                      }`}
                      id="email"
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px]">{error.email}</span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="password"
                    >
                      Contraseña:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.password ? "border-[#DC3545]" : ""
                      }`}
                      id="password"
                      type="password"
                      name="password"
                      value={input.password}
                      onChange={handleChange}
                      title={
                        "La contraseña debe contener entre 8 y 16 caracteres y al menos uno de los siguientes:\n- Mayúscula\n- Minúcula\n- Dígito\n- Un caracter especial de entre: !@#$%^&*/"
                      }
                    />
                    <div className="relative">
                      <span className=" text-[14px]">
                        {error.password}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="repPassword"
                    >
                      Confirmar contraseña:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.repPassword ? "border-[#DC3545]" : ""
                      }`}
                      id="repPassword"
                      type="password"
                      name="repPassword"
                      value={input.repPassword}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px]">
                        {error.repPassword}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-rows-[30px_100px_30px]">
                  <label
                    className="text-[16px] text-[#394867]"
                    htmlFor="address"
                  >
                    Dirección:
                  </label>
                  <textarea
                    className={` outline-none p-3 border w-[350px] border-[#394867] rounded-[5px] focus:h-[100px] transition-[height] duration-500 ease-in ${
                      error.address ? "border-[#DC3545]" : ""
                    }`}
                    name="address"
                    id="address"
                    value={input.address}
                    onChange={handleChange}
                  ></textarea>
                  <div className="relative">
                    <span className=" text-[14px]">{error.address}</span>
                  </div>
                </div>
                <div>
                  <button
                    className={
                      button.current && button.current.disabled === true
                        ? "btn bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px] opacity-50"
                        : "btn bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px]"
                    }
                    ref={button}
                    id="submit"
                    onClick={handleSubmit}
                    type="button"
                  >
                    Crear Vendedor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}
      {isOpen && type === "updateVendor" && (
        <motion.div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-[120]">
          <div className="bg-white p-6 rounded-lg overflow-auto h-[95vh] w-[460px]">
            <form className="z-10 flex flex-col justify-center items-center gap-[21px]  rounded-[20px]">
              <div className="relative grid grid-cols-[1fr_30px]">
                <div>
                  <p className="text-[24px] border-[#E7E7E7] border-b-[1px] text-center w-full">
                    Editar Vendedor
                  </p>
                </div>
                <div
                  onClick={() => {
                    onClose();
                    setStatusMsg("");
                    setImage("")
                  }}
                  className="absolute top-0 right-[-100px] flex px-4 hover:text-white hover:bg-red-500 rounded-[8px] border border-[#394867]"
                >
                  <button className="text-[#394867] w-[20px]   font-bold rounded">
                    X
                  </button>
                </div>
              </div>
              {statusMsg && (
                <div
                  className={`${
                    statusMsg == "El vendedor ha sido editado correctamente"
                      ? "bg-green-200 text-green-500 p-3"
                      : "bg-red-200 text-red-500 p-3"
                  }`}
                >
                  <span>{statusMsg}</span>
                </div>
              )}
              <div className="frame flex flex-col gap-[15px] px-4 w-full">
                <div className="flex justify-center">
                  <figure
                    onClick={() => inputFile.current.click()}
                    className="cursor-pointer relative rounded-full bg-[#E7E7E7] w-[125px] h-[125px] shadow-sm"
                  >
                    <div className="absolute bottom-0 flex justify-center items-center w-[35px] h-[35px] rounded-full bg-[#FFFFFF] border-[1px] border-[#E7E7E7]">
                      <img className="w-[25px]" src={camera} alt="camara" />
                    </div>
                    <div className="absolute top-3 right-3">
                      {image ? (
                        <img className="h-[100px] w-[100px] rounded-full" src={URL.createObjectURL(image)} alt="avatar" />
                      ): (
                        <img className="h-[100px] w-[100px] rounded-full"  src={previousDates.avatar} alt={previousDates.name} />
                      )}
                    </div>
                    <input
                      className="hidden"
                      ref={inputFile}
                      id="avatar"
                      type="file"
                      name="avatar"
                      accept="image/jpeg, image/png"
                      onChange={handleValidation}
                    />
                    
                  </figure>
                </div>
                <div className="relative">
                  <span className="">{error.avatar}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="name"
                    >
                      Nombre:
                    </label>
                    <input
                      className="hidden"
                      id="role"
                      type="text"
                      name="role"
                      value="vendor"
                    />
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.name ? "border-[#DC3545]" : ""
                      }`}
                      id="name"
                      type="text"
                      placeholder={previousDates.name}
                      name="name"
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px] text-red-500">
                        {error.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="lastName"
                    >
                      Apellido:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.lastName ? "border-[#DC3545]" : ""
                      }`}
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder={previousDates.lastName}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px]">
                        {error.lastName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="phone"
                    >
                      Número de teléfono:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.phone ? "border-[#DC3545]" : ""
                      }`}
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder={previousDates.phone}
                      onBlur={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px]">{error.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="email"
                    >
                      Correo electrónico:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.email ? "border-[#DC3545]" : ""
                      }`}
                      id="email"
                      type="email"
                      name="email"
                      placeholder={previousDates.email}
                      onBlur={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px]">{error.email}</span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="password"
                    >
                      Contraseña:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.password ? "border-[#DC3545]" : ""
                      }`}
                      id="password"
                      type="password"
                      name="password"
                      placeholder={previousDates.password}
                      onBlur={handleChange}
                      title={
                        "La contraseña debe contener entre 8 y 16 caracteres y al menos uno de los siguientes:\n- Mayúscula\n- Minúcula\n- Dígito\n- Un caracter especial de entre: !@#$%^&*/"
                      }
                    />
                    <div className="relative">
                      <span className=" text-[14px]">
                        {error.password}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[16px] text-[#394867]"
                      htmlFor="repPassword"
                    >
                      Confirmar contraseña:
                    </label>
                    <input
                      className={` outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                        error.repPassword ? "border-[#DC3545]" : ""
                      }`}
                      id="repPassword"
                      type="password"
                      name="repPassword"
                      placeholder={previousDates.password}
                      onBlur={handleChange}
                    />
                    <div className="relative">
                      <span className=" text-[14px]">
                        {error.repPassword}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-rows-[30px_100px_30px]">
                  <label
                    className="text-[16px] text-[#394867]"
                    htmlFor="address"
                  >
                    Dirección:
                  </label>
                  <textarea
                    className={` outline-none p-3 border w-[350px] border-[#394867] rounded-[5px] focus:h-[100px] transition-[height] duration-500 ease-in ${
                      error.address ? "border-[#DC3545]" : ""
                    }`}
                    name="address"
                    id="address"
                    placeholder={previousDates.address}
                    onChange={handleChange}
                  ></textarea>
                  <div className="relative">
                    <span className=" text-[14px]">{error.address}</span>
                  </div>
                </div>
                <div>
                  <button
                    className={
                      button.current && button.current.disabled === true
                        ? "btn bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px] opacity-50"
                        : "btn bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px]"
                    }
                    ref={button}
                    id="submit"
                    onClick={()=>{handleUpdate()}}
                    type="button"
                  >
                    Editar Vendedor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default VendorsCard;