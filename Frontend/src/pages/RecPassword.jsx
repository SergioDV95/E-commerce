import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../tailwind.css"
import { useNavigate } from "react-router-dom";
import { polar, blueBg, polarSede } from "./../components/exportsImports";

function RecPassword() {
   const server = "http://localhost:3001";
   const [user, setUser] = useState({
      password: ""
   });
   const [error, setError] = useState({
      email: "",
      userKey: "",
      password: "",
      repPassword: ""
   });
   const [input, setInput] = useState({
      email: "",
      userKey: "",
      password: "",
      repPassword: ""
   });
   const [time, setTime] = useState(new Date(0, 0, 0, 0, 5));
   const [emailSent, setEmailSent] = useState(false);
   const [keySuccess, setKeySuccess] = useState(false);
   const button = useRef();
   const navigate = useNavigate();

   const submitEmail = async () => {
      try {
         const regexEmail = /^[a-z0-9.-]+@[a-z0-9-]+(\.[a-z]{2,4}){1,3}$/i;
         if (input.email === "") {
            setError((prev) => ({ ...prev, email: "Ingresa tu correo" }));
            return;
         } else if (!regexEmail.test(input.email)) {
            setError((prev) => ({ ...prev, email: "Ingresa un correo válido" }));
            return;
         }
         setError((prev) => ({ ...prev, email: "" }));
         const response = await axios.post(`${server}/mailsender`, input, {
            headers: {
               "Content-Type": "application/json"
            }
         });
         if (response.status === 200) {
            setEmailSent(true);
         }
      } catch ({ name, message, response }) {
         if (response.data) {
            setError((prev) => ({ ...prev, email: response.data.email }));
         }
         console.error(`${name}: ${message}`);
      }
   }
   const submitKey = async () => {
      try {
         const response = await axios.post(`${server}/mailsender/keyValidation`, input, {
            headers: {
               "Content-Type": "application/json"
            }
         });
         if (response.status === 200) {
            setKeySuccess(true);
         }
      } catch ({ name, message, response }) {
         if (response.data) {
            setError((prev) => ({ ...prev, userKey: response.data.userKey }));
         }
         console.error(`${name}: ${message}`);
      }
   }
   const submitPassword = async () => {
      try {
         const response = await axios.patch(`${server}/users/${input.email}`, user, {
            headers: {
               "Content-Type": "application/json"
            }
         });
         if (response.status === 201) {
            alert("Contraseña cambiada con éxito");
            navigate("/login");
         }
      } catch ({ name, message, response }) {
         if (response.data) {
            setError((prev) => ({ ...prev, password: response.data.password }));
         }
         console.error(`${name}: ${message}`);
      }
   }

   useEffect(() => {
      if (emailSent) {
         const timer = setInterval(() => {
            setTime(time => {
               if (time.getMinutes() === 0 && time.getSeconds() === 0) {
                  clearInterval(timer);
                  return time;
               } else {
                  const newTime = new Date(time.getTime());
                  newTime.setSeconds(newTime.getSeconds() - 1);
                  return newTime;
               }
            });
         }, 1000);
         return () => clearInterval(timer);
      }
   }, [emailSent]);

   let minutes = time.getMinutes().toString().padStart(2, "0");
   let seconds = time.getSeconds().toString().padStart(2, "0");
   let timeString = `${minutes}:${seconds}`;

   const handleChange = (event) => {
      const { name, value } = event.target;
      setInput((input) => ({ ...input, [name]: value }));
   }

   const handleValidation = () => {
      const { password, repPassword } = input;
      const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&.*/])[^<>{}:;'"?,\s]{8,16}$/;
      let isValid = true;
      if (password) {
         if (regexPassword.test(password)) {
            setError((error) => ({ ...error, password: "" }));
            if (!repPassword) {
               isValid = false;
            } else if (password !== repPassword) {
               setError((error) => ({ ...error, repPassword: "La contraseña no coincide" }));
               setUser((user) => ({ ...user, password: "" }));
               isValid = false;
            } else {
               setError((error) => ({ ...error, password: "", repPassword: "" }));
               setUser((user) => ({ ...user, password: password }));
            }
         } else {
            setError((error) => ({ ...error, password: "La contraseña es inválida" }));
            setUser((user) => ({ ...user, password: "" }));
            isValid = false;
         }
      } else {
         setError((error) => ({ ...error, password: "", repPassword: "" }));
         isValid = false;
      }
      if (button.current) {
         button.current.disabled = !isValid;
      }
   }

   useEffect(() => {
      handleValidation();
      //eslint-disable-next-line
   }, [input.password, input.repPassword, keySuccess]);
   return (
      <section className="pt-[50px] flex flex-col w-full box-border relative h-screen pb-10 lg:px-[45px] lg:gap-[24px] lg:bg-[#F1F6F9] lg:justify-center max-lg:bg-[#1A3365] max-lg:items-center">
         <div className="w-full px-[95px]">
            <div className="py-[50px] h-fit flex justify-center lg:bg-[#D9D9D9] rounded-lg">
               <img className="max-w-[45%] max-h-full rounded-[10px] max-lg:hidden" src={polarSede} alt="" />
               <form className="z-10 flex flex-col justify-center items-center gap-[21px] bg-[#F1F6F9] pt-[15px] pb-[25px] top-[75px] rounded-[20px] lg:rounded-[10px] lg:w-[45%] lg:bg-[#FFFFFF] max-lg:w-[312px]">
                  <img className="w-[224px] lg:hidden" src={polar} alt="Empresas Polar" />
                  <p className="text-[24px] border-[#E7E7E7] border-b-[1px] text-center pb-[15px] w-full max-lg:hidden">Recuperar contraseña</p>
                  {!keySuccess && (
                     <>
                        <div className={`frame flex flex-col gap-[15px] px-[44px] w-full ${emailSent && "hidden"}`}>
                           <p className="text-[#6a7081] text-[0.9em]">Ingresa tu correo electrónico para recibir una clave de recuperación de contraseña</p>
                           <label className="label text-[#394867]" htmlFor="email">Correo electrónico:</label>
                           <input
                              className={`data123 ${error.email ? "border-[#DC3545]" : ""}`}
                              id="email"
                              type="email"
                              name="email"
                              value={input.email}
                              onChange={handleChange}
                           />
                           <div className="relative">
                              <span className="error">{error.email}</span>
                           </div>
                           <button className="btn bg-[#3056D3] text-[#FFFFFF] text-[20px] w-full rounded-[6px] h-[50px]"
                              onClick={submitEmail}
                              type="button">Obtener clave
                           </button>
                        </div>
                        <div className={`frame flex flex-col gap-[15px] px-[44px] w-full ${!emailSent && "hidden"}`}>
                           <p className="flex flex-col text-[#6a7081] text-[0.9em]">Ingresa la clave de recuperación que obtuviste <span className="font-medium">{timeString}</span></p>
                           <label className="label text-[#394867]" htmlFor="password">Clave secreta:</label>
                           <input
                              className={`data123 ${error.userKey ? "border-[#DC3545]" : ""}`}
                              id="userKey"
                              type="text"
                              name="userKey"
                              value={input.userKey}
                              onChange={handleChange}
                              title={"La contraseña debe contener entre 8 y 16 caracteres y al menos uno de los siguientes:\n- Mayúscula\n- Minúcula\n- Dígito\n- Un caracter especial de entre: !@#$%^&*/"}
                           />
                           <div className="relative">
                              <span className="error">{error.userKey}</span>
                           </div>
                           <button className="btn bg-[#3056D3] text-[#FFFFFF] text-[20px] w-full rounded-[6px] h-[50px]"
                              onClick={submitKey}
                              type="button">Validar clave
                           </button>
                        </div>
                     </>
                  )}
                  {keySuccess && (
                     <div className="frame flex flex-col gap-[15px] px-[44px] w-full">
                        <label className="label text-[#394867]" htmlFor="password">Nueva contraseña:</label>
                        <input
                           className={`data123 ${error.password ? "border-[#DC3545]" : ""}`}
                           id="password"
                           type="password"
                           name="password"
                           value={input.password}
                           onChange={handleChange}
                           title={"La contraseña debe contener entre 8 y 16 caracteres y al menos uno de los siguientes:\n- Mayúscula\n- Minúcula\n- Dígito\n- Un caracter especial de entre: !@#$%^&*/"}
                        />
                        <div className="relative">
                           <span className="error max-lg:-top-[15px]">{error.password}</span>
                        </div>
                        <label className="label text-[#394867]" htmlFor="repPassword">Confirmar contraseña:</label>
                        <input
                           className={`data123 ${error.repPassword ? "border-[#DC3545]" : ""}`}
                           id="repPassword"
                           type="password"
                           name="repPassword"
                           value={input.repPassword}
                           onChange={handleChange}
                        />
                        <div className="relative">
                           <span className="error">{error.repPassword}</span>
                        </div>
                        <button className={`text-[#FFFFFF] btn text-[20px] bg-[#3056D3] w-full h-[50px] rounded-[6px] ${button.current && button.current.disabled === true && "opacity-50"}`}
                           ref={button}
                           onClick={submitPassword}
                           type="button">Cambiar contraseña
                        </button>
                     </div>
                  )}
               </form>
            </div>
         </div>
         <img className="z-0 absolute w-full h-[70%] bottom-0 lg:hidden" src={blueBg} alt="background" />
      </section>
   );
};

export default RecPassword;