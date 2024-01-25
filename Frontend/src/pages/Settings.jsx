/* eslint-disable react/prop-types */
import { useEffect, useState,useRef,useContext } from "react";
import axios from "axios";
import {camera, userIco} from "../components/exportsImports";
import {Session} from "../Session/session";


const Settings = () => {
  const [previousDates, setPreviosDates] = useState({});
  const { user, setUser } = useContext(Session);
  const [userEmail, setUserEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const server = "http://localhost:3001";
  const [error, setError] = useState({
    avatar: "",
    name: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    repPassword: "",
    address: "",
    role: "",
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
    role: "",
  });
  const button = useRef();
  const inputFile = useRef();
  const [image, setImage] = useState("");

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
        `${server}/users/${userEmail}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setStatusMsg("El usuario ha sido editado correctamente");
      } else if (response.status === 500) {
        setStatusMsg("Error al editar el usuario");
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
    setInput({ ...input, [name]: value });
  };

  const handleValidation = () => {
    const { password, repPassword } = input;
    const { role } = input;
    const regexList = {
      name: /^[a-zñ áéíóúñÁÉÍÓÚÑ]+$/i,
      lastName: /^[a-zñ áéíóúñÁÉÍÓÚÑ]+$/i,
      email: /^[a-z0-9.-]+@[a-z0-9-]+(\.[a-z]{2,4}){1,3}$/i,
      phone: /^(\+[\d]{2})?\d{3,4}\d{3}\d{2}\d{2}$/,
      password:
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&.*/])[^<>{}:;'"?,]{8,16}$/,
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
      avatar: "Sólo en formato: png, jpg, jpeg",
      role: "El rol es inválido",
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
        }
      }
    }
    if (role && role === "") {
      errors = { ...errors, role: "el rol no puede ser nulo" };
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
    if (button.current) {
      button.current.disabled = !isValid;
      setError(errors);
      setUser((prevState) => ({ ...prevState, ...user }));
    }
  };

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
        setPreviosDates(data);
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleValidation();
    //eslint-disable-next-line
  }, [input]);

  useEffect(() => {
    if (user){
      setUserEmail(user.email)
    }
  }, [user]);

  useEffect(() => {
    getUser(userEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  return (
    <>
      <section className="flex flex-col items-start w-[70vw] my-10 mx-5 select-none">
        <div className="grid grid-rows-2 justify-items-start">
          <div className="flex w-[327px] items-center gap-[8px]">
            <div className="w-fit mt-[-1.00px] font-medium text-gray-900 text-[18px] tracking-[0] leading-[28px] whitespace-nowrap">
              <span>Editar Perfil</span>
            </div>
          </div>
          <div>
            <p className="w-[327px] font-normal text-gray-500 text-[14px] tracking-[0] leading-[20px]">
              A continuación puedes editar tu perfil
            </p>
          </div>
        </div>
      </section>
      <section className="ml-5 lg:flex lg:justify-center lg:w-[70vw]">
        <div className="border border-[#eaecf0] m-5 p-4 rounded-[15px] h-[700px] w-[420px] shadow-md">
          <form className="z-10 flex flex-col justify-center items-center gap-[21px]  rounded-[20px]">
            <div className="relative grid grid-cols-[1fr_30px]">
              <div>
                <p className="text-[24px] select-none border-[#E7E7E7] border-b-[1px] text-center w-full">
                  Tus datos
                </p>
              </div>
            </div>
            {statusMsg && (
              <div
                className={`${
                  statusMsg == "El usuario ha sido editado correctamente"
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
                  <div className="absolute top-3 right-3">
                    {image ? (
                      <img
                        className="h-[100px] w-[100px] rounded-full"
                        src={URL.createObjectURL(image)}
                        alt="avatar"
                      />
                    ) : (
                      <img
                        className="h-[100px] w-[100px] rounded-full"
                        src={previousDates && previousDates.avatar ? previousDates.avatar : userIco}
                        alt={previousDates && previousDates.name ? previousDates.name : "avatar"}
                      />
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
                  <label className="text-[16px] text-[#394867]" htmlFor="name">
                    Nombre:
                  </label>
                  <input
                    className="hidden"
                    id="role"
                    type="text"
                    name="role"
                    value={user && user.role ? user.role : ""}
                  />
                  <input
                    className={`data outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                      error.name ? "border-[#DC3545]" : ""
                    }`}
                    id="name"
                    type="text"
                    placeholder={previousDates && previousDates.name ? previousDates.name : "nombre de usuario"}
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
                    className={`data outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                      error.lastName ? "border-[#DC3545]" : ""
                    }`}
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder={previousDates && previousDates.lastName ? previousDates.lastName : "apellidos"}
                    onChange={handleChange}
                  />
                  <div className="relative">
                    <span className=" text-[14px]">{error.lastName}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[16px] text-[#394867]" htmlFor="phone">
                    Número de teléfono:
                  </label>
                  <input
                    className={`data outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                      error.phone ? "border-[#DC3545]" : ""
                    }`}
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder={previousDates && previousDates.phone ? previousDates.phone : "telefono"}
                    onChange={handleChange}
                  />
                  <div className="relative">
                    <span className=" text-[14px]">{error.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[16px] text-[#394867]" htmlFor="email">
                    Correo electrónico:
                  </label>
                  <input
                    className={`data outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                      error.email ? "border-[#DC3545]" : ""
                    }`}
                    id="email"
                    type="email"
                    name="email"
                    placeholder={previousDates &&previousDates.email ? previousDates.email : "email"}
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
                    className={`data outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                      error.password ? "border-[#DC3545]" : ""
                    }`}
                    id="password"
                    type="password"
                    name="password"
                    placeholder={previousDates && previousDates.password ? previousDates.password : "contraseña"}
                    onChange={handleChange}
                    title={
                      "La contraseña debe contener entre 8 y 16 caracteres y al menos uno de los siguientes:\n- Mayúscula\n- Minúcula\n- Dígito\n- Un caracter especial de entre: !@#$%^&*/"
                    }
                  />
                  <div className="relative">
                    <span className=" text-[14px]">{error.password}</span>
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
                    className={`data outline-none px-3 py-1 border w-[160px] border-[#394867] rounded-[5px] ${
                      error.repPassword ? "border-[#DC3545]" : ""
                    }`}
                    id="repPassword"
                    type="password"
                    name="repPassword"
                    placeholder={previousDates && previousDates.password ? previousDates.password : "contraseña"}
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
                <label className="text-[16px] text-[#394867]" htmlFor="address">
                  Dirección:
                </label>
                <textarea
                  className={`data outline-none p-3 border w-[350px] border-[#394867] rounded-[5px] focus:h-[100px] transition-[height] duration-500 ease-in ${
                    error.address ? "border-[#DC3545]" : ""
                  }`}
                  name="address"
                  id="address"
                  placeholder={ previousDates && previousDates.address ? previousDates.address : "dirección"}
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
                  onClick={() => {
                    handleUpdate();
                  }}
                  type="button"
                >
                  Editar Usuario
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Settings;