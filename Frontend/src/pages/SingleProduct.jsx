import { useParams } from 'react-router-dom';
import { useState,useEffect,useRef,useContext } from 'react';
import { shoppingCart } from "../Session/session";
import axios from "axios"
import { lens, lens2, cart_black, cart_white, CartModal } from "../components/exportsImports";

export default function SingleProduct (){
  const [isOpen, setIsOpen] = useState(false);
  const [productDates, setProductDates] = useState({})
  const { cartProducts, setCartProducts } = useContext(shoppingCart);
  const [inCartText, setInCartText] = useState("Añadir al Carrito");
  const { id } = useParams();
  const getProduct = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/products/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        const data = response.data;
        setProductDates(data);
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

   useEffect(() => {
     getProduct(id)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

   const cart = useRef();
   const [src, setSrc] = useState({ lens: lens, cart: cart_white });

   useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 1440px)');
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

   const handleAddToCart = () => {
    const productId = productDates._id;
    const isInCart = cartProducts && cartProducts.products.includes(productId);
  
    setCartProducts((prev) => ({
      ...prev,
      products: isInCart
        ? cartProducts.products.filter((id) => id !== productId)
        : [...cartProducts.products, productId],
    }));
    setInCartText(isInCart ? "Añadir al Carrito" : "Sacar del carrito");
    sessionStorage.setItem("CartText", inCartText);
    
  };

   useEffect(() => {
    sessionStorage.setItem("CartText", inCartText);
  }, [inCartText]);

   useEffect(() => {
    const savedText = sessionStorage.getItem("CartText");
    setInCartText(savedText || "Añadir al Carrito");
  }, []);

  return (
    <>
      <div className="ml-3 mr-3 grid grid-rows-[40px_1fr] md:hidden">
        <div className="mt-3 relative">
          <figure
            className={`flex fixed max-lg:right-[25px] lg:relative lg:border-[1px] lg:border-[#E7E7E7] max-lg:z-30 justify-center items-center bg-[#14274E] lg:bg-white lg:rounded-[8px] rounded-[35px] w-[45px] h-[45px] cursor-pointer`}
            onClick={() =>
              setIsOpen(!isOpen)
            }
          >
            <input src={src.cart} type="image" />
            {cartProducts.products.length > 0 && (
              <p className="rounded-full w-[18px] h-[18px] bg-[#9BA4B4] lg:bg-[#3056D3] text-white text-[14px] flex justify-center items-center absolute top-0 lg:-top-[5px] right-0 lg:-right-[5px] ">
                {cartProducts.products.length}
              </p>
            )}
          </figure>
          <div
            className={`${isOpen ? "block" : "hidden"} absolute top-10 right-5 w-[70%] z-[99] mt-10 lg:w-[30%] lg:absolute lg:mr-[45px] lg:top-[45px]`}
            ref={cart}
          >
            <CartModal/>
          </div>
        </div>
        <div className="flex mt-10">
          <div className="grid grid-rows-[60px_80px_1fr] bg-[#d9d9d9] w-[92vw] h-fit rounded-xl py-2 px-3 mb-3">
            <div>
              <h2 className="text-xl text-[#212b36] font-bold m-2">
                {productDates.name}
              </h2>
              <div className="bg-[#eef2f5] w-[100%] h-[1px] my-4 mx-0"></div>
            </div>
            <div className="h-[70px]">
              <div className="flex justify-end h-[70px] mr-5">
                <div className="grid grid-rows-[30px_50px] justify-items-end ml-16 pl-10">
                  <div className="text-[#3d464f]">
                    <span>I.V.A (16%)</span>
                  </div>
                  <div className="font-bold">
                    <span>${productDates.price}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#eef2f5] w-[100%] h-[1px] mx-0"></div>
            </div>
            <div>
              <div className="grid grid-cols-[1fr_180px] items-center justify-items-center justify-around h-[370px]">
                <div>
                  <div className="bg-[#b3b9c5] w-[250px] my-3 py-2 h-[360px] rounded-[20px] p-2">
                    <img
                      className="w-[230px]"
                      src={
                        productDates.imageURL && productDates.imageURL.includes("localhost")
                          ? productDates.imageURL
                          : `http://localhost:3001/${productDates.imageURL}`
                      }
                      alt={productDates.name}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-[5px_1fr] gap-3">
                  <div className="bg-[#eef2f5] w-[1px] h-[370px] my-2 mx-0"></div>
                  <div className="grid grid-rows-[128px_128px_128px] h-[300px] items-center justify-items-center">
                    <div className="bg-[#b3b9c5] w-[110px] h-[117px] rounded-[20px] p-2">
                      <img
                        className="w-[150px] h-[100%]"
                        src={
                          productDates.imageURL && productDates.imageURL.includes("localhost")
                            ? productDates.imageURL
                            : `http://localhost:3001/${productDates.imageURL}`
                        }
                        alt={productDates.name}
                      />
                    </div>
                    <div className="bg-[#b3b9c5] w-[110px] h-[117px] rounded-[20px] p-2">
                      <img
                        className="w-[150px] h-[100%]"
                        src={
                          productDates.imageURL && productDates.imageURL.includes("localhost")
                            ? productDates.imageURL
                            : `http://localhost:3001/${productDates.imageURL}`
                        }
                        alt={productDates.name}
                      />
                    </div>
                    <div className="bg-[#b3b9c5] w-[110px] h-[117px] rounded-[20px] p-2">
                      <img
                        className="w-[150px] h-[100%]"
                        src={
                          productDates.imageURL && productDates.imageURL.includes("localhost")
                            ? productDates.imageURL
                            : `http://localhost:3001/${productDates.imageURL}`
                        }
                        alt={productDates.name}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#eef2f5] w-[100%] h-[1px] my-4 mx-0"></div>
            </div>
            <div>
              <div>
                <div className="px-3">
                  <button
                    className="btn bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px]"
                    id="submit"
                    type="button"
                    onClick={handleAddToCart}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
              <div className="bg-[#eef2f5] w-[100%] h-[1px] my-4 mx-0"></div>
            </div>
            <div>
              <div>
                <div>
                  <h3 className="text-xl text-[#212b36] font-bold m-2">
                    Descipcion del producto
                  </h3>
                </div>
              </div>
              <div>
                <p className="m-2">{productDates.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:mx-5 md:py-4">
        <div className='flex justify-end w-[68vw]'>
          <figure
            className={`flex fixed max-lg:right-[25px] lg:relative lg:border-[1px] lg:border-[#E7E7E7] max-lg:z-30 justify-center items-center bg-[#14274E] lg:bg-white lg:rounded-[8px] lg:hover:border-blue-500 rounded-[35px] w-[45px] h-[45px] cursor-pointer`}
            onClick={() =>
              cart.current.open ? cart.current.close() : cart.current.show()
            }
          >
            <input src={cart_black} type="image" />
            {cartProducts.products.length > 0 && (
              <p className="rounded-full w-[18px] h-[18px] bg-[#9BA4B4] lg:bg-[#3056D3] text-white text-[14px] flex justify-center items-center absolute top-0 lg:-top-[5px] right-0 lg:-right-[5px] ">
                {cartProducts.products.length}
              </p>
            )}
          </figure>
          <dialog
            className="dialog w-[70%] lg:w-[30%] fixed lg:absolute lg:mr-[45px] z-20 top-[145px] lg:top-20 lg:right-24 "
            ref={cart}
          >
            <CartModal />
          </dialog>
        </div>
        <div className="grid grid-cols-2 bg-[#d9d9d9] w-[70vw] h-[90vh] my-4 rounded-xl shadow-lg">
          <div>
            <div className="grid grid-rows-[1fr_140px] items-center justify-items-center justify-around h-[370px] my-5">
              <div>
                <div className="bg-[#b3b9c5] flex justify-center w-[400px] my-3 py-2 h-[400px] rounded-[20px] p-2">
                  <img
                    className="w-[230px]"
                    src={
                      productDates.imageURL && productDates.imageURL.includes("localhost")
                        ? productDates.imageURL
                        : `http://localhost:3001/${productDates.imageURL}`
                    }
                    alt={productDates.name}
                  />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-[128px_128px_128px] h-[300px] items-center justify-items-center">
                  <div className="bg-[#b3b9c5] w-[110px] h-[117px] rounded-[20px] p-2">
                    <img
                      className="w-[150px] h-[100%]"
                      src={
                        productDates.imageURL && productDates.imageURL.includes("localhost")
                          ? productDates.imageURL
                          : `http://localhost:3001/${productDates.imageURL}`
                      }
                      alt={productDates.name}
                    />
                  </div>
                  <div className="bg-[#b3b9c5] w-[110px] h-[117px] rounded-[20px] p-2">
                    <img
                      className="w-[150px] h-[100%]"
                      src={
                        productDates.imageURL && productDates.imageURL.includes("localhost")
                          ? productDates.imageURL
                          : `http://localhost:3001/${productDates.imageURL}`
                      }
                      alt={productDates.name}
                    />
                  </div>
                  <div className="bg-[#b3b9c5] w-[110px] h-[117px] rounded-[20px] p-2">
                    <img
                      className="w-[150px] h-[100%]"
                      src={
                        productDates.imageURL && productDates.imageURL.includes("localhost")
                          ? productDates.imageURL
                          : `http://localhost:3001/${productDates.imageURL}`
                      }
                      alt={productDates.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-[60px_50px_80px_100px] my-5">
            <div>
              <h2 className="text-xl text-[#212b36] font-bold m-2">
                {productDates.name}
              </h2>
              <div className="bg-[#eef2f5] w-[96%] h-[1px] my-4 mx-0"></div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-52">
                <div>
                  <span className="text-[#3d464f]">Categoria</span>
                </div>
                <div className="ml-10">
                  <span className="font-bold">{productDates.category}</span>
                </div>
              </div>
              <div className="bg-[#eef2f5] w-[96%] h-[1px] my-4 mx-0"></div>
            </div>
            <div className="h-[70px]">
              <div className="flex justify-end mr-5 h-[70px] my-5">
                <div className="grid grid-rows-[30px_50px] justify-items-end mr-5">
                  <div className="font-bold text-xl">
                    <span>$3.50</span>
                  </div>
                  <div className="text-[#3d464f] text-sm">
                    <span>I.V.A (16%)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-3">
              <div>
                <div className="px-3">
                  <button
                    className="btn bg-[#3056D3] text-[#FFFFFF] w-full rounded-[6px] h-[50px]"
                    id="submit"
                    type="button"
                    onClick={handleAddToCart}
                  >
                    {inCartText}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <h3 className="text-xl text-[#212b36] font-bold">
                    Descipcion del producto
                  </h3>
                </div>
              </div>
              <div>
                <p className="my-2 text-[#3d464f]">
                  {productDates.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}