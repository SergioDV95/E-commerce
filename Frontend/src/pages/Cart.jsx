/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { shoppingCart } from "../Session/session";
import axios from "axios";
import { more, less } from "../components/exportsImports";

function Cart() {
  const { cartProducts, setCartProducts } = useContext(shoppingCart);
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const button = useRef();
  const server = "http://localhost:3001/";

  useEffect(() => {
    const bringProducts = async () => {
      try {
        const response = await axios.post(
          `${server}products/cart`,
          cartProducts.products,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setProduct([...response.data]);
          let productsPrice = {};
          let productsQuantity = {};
          for (let doc of response.data) {
            productsPrice = { ...productsPrice, [doc._id]: doc.price };
            productsQuantity = {
              ...productsQuantity,
              [doc._id]: cartProducts.quantity[doc._id] || 1,
            };
          }
          setCartProducts((prev) => ({
            ...prev,
            price: productsPrice,
            quantity: productsQuantity,
          }));
        }
      } catch ({ name, message }) {
        console.error(`${name}: ${message}`);
      }
    };
    bringProducts();
  }, [cartProducts.products]);

  const decrementQuantity = (id) => {
    setCartProducts((prev) => ({
      ...prev,
      quantity: { ...prev.quantity, [id]: Math.max(prev.quantity[id] - 1, 1) },
    }));
  };

  const incrementQuantity = (id, stock) => {
    setCartProducts((prev) => ({
      ...prev,
      quantity: {
        ...prev.quantity,
        [id]: prev.quantity[id] < stock ? prev.quantity[id] + 1 : stock,
      },
    }));
  };

  useEffect(() => {
    const calculateTotal = () => {
      let addition = 0;
      for (let id in cartProducts.price) {
        addition +=
          Number(cartProducts.price[id]) * Number(cartProducts.quantity[id]);
      }
      let tribute = addition * 0.16;
      setCartProducts((prev) => ({
        ...prev,
        subtotal: addition,
        tax: tribute,
        total: addition + tribute,
      }));
    };
    calculateTotal();
  }, [cartProducts.quantity, cartProducts.price]);

  const handleSubmit = async () => {
    try {
      let sale = {};
      for (let key in cartProducts) {
        if (key !== "checked" && key !== "price") {
          sale[key] = cartProducts[key];
        }
      }
      const response = await axios.post(`${server}sales`, sale, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        alert("Compra exitosa");
        setCartProducts((prev) => ({
          ...prev,
          products: [],
          quantity: {},
          checked: {},
          price: {},
        }));
        navigate("/bill", { state: response.data });
      }
    } catch ({ name, message, response }) {
      if (response.data) {
        const errors = response.data;
        let errorList = {};
        for (let key in errors) {
          if (errors[key]) {
            errorList = { ...errorList, [key]: errors[key] };
          }
        }
      }
      console.error(
        `Ha ocurrido un error: ${name}. Con el mensaje: ${message}.`
      );
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-[1100px] px-4 lg:hidden">
        <h2 className="text-2xl font-bold m-4">Tu carrito:</h2>
        <form
          id="orderForm"
          className="flex flex-col bg-[#f1f6f9] border-[1px] border-[#cdd1d3] items-start rounded-[8px] gap-[15px] pb-[15px] px-[15px]"
        >
          <div className="flex flex-col w-full max-h-[50vh] overflow-y-auto">
            {product.map((product) => (
              <div
                className="flex justify-between w-full max-h-[150px] py-[15px] border-[#EBF0FF] border-b-[1px]"
                key={product._id}
              >
                <div className="flex gap-5 justify-center items-center">
                  <svg
                    className="w-[20px] h-[20px] stroke-current text-gray-400 hover:text-red-500"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() =>
                      setCartProducts((prev) => ({
                        ...prev,
                        products: prev.products.filter(
                          (id) => id !== product._id
                        ),
                        checked: { ...prev.checked, [product._id]: false },
                      }))
                    }
                  >
                    <path
                      d="M1.5 5.00008H3.16667M3.16667 5.00008H16.5M3.16667 5.00008V16.6667C3.16667 17.1088 3.34226 17.5327 3.65482 17.8453C3.96738 18.1578 4.39131 18.3334 4.83333 18.3334H13.1667C13.6087 18.3334 14.0326 18.1578 14.3452 17.8453C14.6577 17.5327 14.8333 17.1088 14.8333 16.6667V5.00008H3.16667ZM5.66667 5.00008V3.33341C5.66667 2.89139 5.84226 2.46746 6.15482 2.1549C6.46738 1.84234 6.89131 1.66675 7.33333 1.66675H10.6667C11.1087 1.66675 11.5326 1.84234 11.8452 2.1549C12.1577 2.46746 12.3333 2.89139 12.3333 3.33341V5.00008M7.33333 9.16675V14.1667M10.6667 9.16675V14.1667"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <img
                    className="w-[70px] max-h-[100px]"
                    src={server + product.imageURL}
                    alt={product.name}
                  />
                </div>
                <div className="flex flex-col gap-[7px] items-end w-fit max-w-[110px] lg:w-[50%] ">
                  <p className="max-h-[2lh] overflow-y-auto">{product.name}</p>
                  <p className="text-right text-[#3056D3] ">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="bg-white gap-[5px] w-fit flex h-fit rounded-full lg:gap-[10px]">
                    <div
                      className="bg-[#14274E] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                      onClick={() => decrementQuantity(product._id)}
                    >
                      <img
                        className="w-[50%] h-[50%]"
                        type="image"
                        src={less}
                        alt="Reducir"
                      />
                    </div>
                    <p className="w-[25px] lg:w-[15px] flex items-center justify-center">
                      {cartProducts.quantity[product._id] || 0}
                    </p>
                    <div
                      className="bg-[#14274E] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                      onClick={() =>
                        incrementQuantity(product._id, product.stock)
                      }
                    >
                      <img
                        className="w-[50%] h-[50%]"
                        type="image"
                        src={more}
                        alt="Aumentar"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[15px] pb-[15px] w-full border-[#EBF0FF] border-b-[1px]">
            <div className="flex justify-between items-end h-[20px]">
              <p className="text-[#9098B1] text-[0.8em]">Subtotal:</p>
              <p className="text-[#223263] ">
                {cartProducts.subtotal
                  ? "$" + cartProducts.subtotal.toFixed(2)
                  : ""}
              </p>
            </div>
            <div className="flex justify-between items-end h-[20px]">
              <p className="text-[#9098B1] text-[0.8em]">IVA 16%:</p>
              <p className="text-[#223263] ">
                {cartProducts.tax ? "$" + cartProducts.tax.toFixed(2) : ""}
              </p>
            </div>
            <div className="flex justify-between items-end h-[20px]">
              <p className="text-[#9098B1] text-[0.8em]">Total:</p>
              <p className="text-[#223263] ">
                {cartProducts.total ? "$" + cartProducts.total.toFixed(2) : ""}
              </p>
            </div>
          </div>
        </form>
        <button
          ref={button}
          className={`h-[40px] mt-5 text-[#FFFFFF] btn text-[20px] bg-[#3056D3] w-full rounded-[6px] ${
            button.current && button.current.disabled && "opacity-50"
          }`}
          type="button"
          onClick={() => {
            handleSubmit();
          }}
        >
          Comprar
        </button>
      </div>
      <div className="hidden lg:block container mx-auto max-w-[900px] pt-10 px-2">
        <h2 className="text-2xl text-[#637381] font-bold m-4">Tu carrito:</h2>
        <form
          id="orderForm"
          className="flex flex-col bg-[#f1f6f9] border-[1px] border-[#cdd1d3] items-start rounded-[8px] gap-[15px] pb-[15px] px-[15px]"
        >
          <div className="grid grid-cols-[3.5fr_1.5fr_1fr] w-full max-h-[50vh] pt-5 p-3 border-[#EBF0FF] border-b-[1px] overflow-y-auto">
            <span className="text-lg font-bold">Producto</span>
            <span className="text-lg font-bold">Precio</span>
            <span className="text-lg font-bold">Cantidad</span>
          </div>
          <div className="flex flex-col w-full max-h-[50vh] overflow-y-auto px-3">
            {product.map((product) => (
              <div
                className="flex justify-between w-full max-h-[150px] py-[15px] border-[#EBF0FF] border-b-[1px]"
                key={product._id}
              >
                <div className="flex gap-5 justify-center items-center">
                  <svg
                    className="w-[20px] h-[20px] stroke-current text-gray-400 hover:text-red-500"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() =>
                      setCartProducts((prev) => ({
                        ...prev,
                        products: prev.products.filter(
                          (id) => id !== product._id
                        ),
                        checked: { ...prev.checked, [product._id]: false },
                      }))
                    }
                  >
                    <path
                      d="M1.5 5.00008H3.16667M3.16667 5.00008H16.5M3.16667 5.00008V16.6667C3.16667 17.1088 3.34226 17.5327 3.65482 17.8453C3.96738 18.1578 4.39131 18.3334 4.83333 18.3334H13.1667C13.6087 18.3334 14.0326 18.1578 14.3452 17.8453C14.6577 17.5327 14.8333 17.1088 14.8333 16.6667V5.00008H3.16667ZM5.66667 5.00008V3.33341C5.66667 2.89139 5.84226 2.46746 6.15482 2.1549C6.46738 1.84234 6.89131 1.66675 7.33333 1.66675H10.6667C11.1087 1.66675 11.5326 1.84234 11.8452 2.1549C12.1577 2.46746 12.3333 2.89139 12.3333 3.33341V5.00008M7.33333 9.16675V14.1667M10.6667 9.16675V14.1667"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <img
                    className="w-[70px] max-h-[100px]"
                    src={server + product.imageURL}
                    alt={product.name}
                  />
                </div>
                <p className="max-h-[2lh] overflow-y-auto">{product.name}</p>
                <p className="text-right text-[#3056D3] ">
                  ${product.price.toFixed(2)}
                </p>
                <div className="bg-white gap-[5px] w-fit flex h-fit rounded-full lg:gap-[10px]">
                  <div
                    className="bg-[#14274E] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                    onClick={() => decrementQuantity(product._id)}
                  >
                    <img
                      className="w-[50%] h-[50%]"
                      type="image"
                      src={less}
                      alt="Reducir"
                    />
                  </div>
                  <p className="w-[25px] lg:w-[15px] flex items-center justify-center">
                    {cartProducts.quantity[product._id] || 0}
                  </p>
                  <div
                    className="bg-[#14274E] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                    onClick={() =>
                      incrementQuantity(product._id, product.stock)
                    }
                  >
                    <img
                      className="w-[50%] h-[50%]"
                      type="image"
                      src={more}
                      alt="Aumentar"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex pb-[15px] pr-4 w-full justify-end">
            <div className="flex flex-col gap-[15px] pb-[15px] w-[250px] justify-end border-[#EBF0FF] border-b-[1px]">
              <div className="flex justify-between items-end h-[20px]">
                <p className="text-[#9098B1] text-[0.8em]">Subtotal:</p>
                <p className="text-[#223263] ">
                  {cartProducts.subtotal
                    ? "$" + cartProducts.subtotal.toFixed(2)
                    : ""}
                </p>
              </div>
              <div className="flex justify-between items-end h-[20px] border-[#EBF0FF] border-b-[1px]">
                <p className="text-[#9098B1] text-[0.8em]">IVA 16%:</p>
                <p className="text-[#223263] ">
                  {cartProducts.tax ? "$" + cartProducts.tax.toFixed(2) : ""}
                </p>
              </div>
              <div className="flex justify-between items-end h-[20px]">
                <p className="text-black text-lg tracking-wider">Total:</p>
                <p className="text-black ">
                  {cartProducts.total
                    ? "$" + cartProducts.total.toFixed(2)
                    : ""}
                </p>
              </div>
              <button
                ref={button}
                className={`h-[40px] text-[#FFFFFF] btn text-[20px] bg-[#3056D3] w-full rounded-[6px] ${
                  button.current && button.current.disabled && "opacity-50"
                }`}
                type="button"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Comprar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Cart;
