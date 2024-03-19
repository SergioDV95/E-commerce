import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Session } from "../Session/session";
import axios from "axios";
import { blueBg } from "./../components/exportsImports";
import PDFDocument from "../components/PDFDocument";
import { PDFDownloadLink } from '@react-pdf/renderer';

export default function Bill() {
   const { user } = useContext(Session);
   const location = useLocation();
   const [productData, setProductData] = useState();
   const saleData = location.state;
   const server = "https://backendprueba.xyz/";

   useEffect(() => {    
      const productsInfo = async () => {
         try {
            const response = await axios.post(`${server}products/cart`, saleData.products, {
               headers: {
                  'Content-Type': 'application/json'
               }
            });
            if (response.status === 200) {
               setProductData([...response.data]);
            }
         } catch ({ name, message }) {
            console.error(`${name}: ${message}`);
         }
      }
      productsInfo();
   }, [saleData])

   const renderProducts = function(products, quantity) {
      let productsList = [];
      for(let doc of products) {
         for(let id in quantity) {
            if(doc._id === id) {
               productsList.push({name: doc.name, quantity: quantity[id], price: doc.price});
            }
         }
      }
      return productsList.map(({name, quantity, price}, index) => (
         <span key={index} className="flex w-full gap-[15px] justify-between">
            <span className="flex flex-col">
               <span className="font-light">{name}</span>
               <span className="text-[#9098B1] text-[0.8em]">x{quantity}</span>
            </span>
            <span className="text-[#9098B1] text-[0.8em]">${price.toFixed(2)}</span>
         </span>
      ));
   }

   const renderTime = (time) => {
      const date = new Date(time);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`
   }

   return (
      <>
         <img className="z-0 fixed bg-[#1A3365] w-full h-screen lg:hidden" src={blueBg} alt="background" />
         <section className="relative lg:bg-[#b8bbbe] bg-fixed bg-cover w-full flex flex-col items-center lg:justify-center gap-[25px] h-screen py-[50px]">
            <h4 className="max-lg:text-[#ececec] font-medium text-[20px]">Factura</h4>
            <div className="flex z-10 flex-col p-[15px] w-[80%] lg:w-[40%] gap-[15px] bg-[#F9F9F9] rounded-[12px] ">
               <div className="flex justify-between items-center pb-[15px] border-b-[1px] border-[#E7E7E7] ">
                  <p>Referencia:</p>
                  <p className="font-light max-w-[50%] max-lg:overflow-x-auto">{saleData._id}</p>
               </div>
               <div className="flex justify-between items-center pb-[15px] border-b-[1px] border-[#E7E7E7] ">
                  <p>Fecha:</p>
                  <p className="font-light">{renderTime(saleData.createdAt)}</p>
               </div>
               <div className="flex justify-between items-center pb-[15px] border-b-[1px] border-[#E7E7E7] ">
                  <p>Cliente:</p>
                  <p className="font-light">{user.name + " " + user.lastName}</p>
               </div>
               <div className="flex flex-col">
                  <div className="flex justify-between items-center pb-[15px]">
                     <p>Productos:</p>
                     <p>Precio:</p>
                  </div>
                  <div className="flex justify-between items-center pb-[15px] border-b-[1px] border-[#E7E7E7] ">
                     <p className="w-full">{productData && renderProducts(productData, saleData.quantity)}</p>
                  </div>
               </div>
               <div className="flex justify-between items-center pb-[15px] border-b-[1px] border-[#E7E7E7] ">
                  <p>Subtotal:</p>
                  <p>${saleData.subtotal && saleData.subtotal.toFixed(2)}</p>
               </div>
               <div className="flex justify-between items-center pb-[15px] border-b-[1px] border-[#E7E7E7] ">
                  <p>IVA 16%:</p>
                  <p>${saleData.tax && saleData.tax.toFixed(2)}</p>
               </div>
               <div className="flex justify-between items-center pb-[15px] text-[#223263] text-[1.1em] font-bold">
                  <p>Total:</p>
                  <p>${saleData.total && saleData.total.toFixed(2)}</p>
               </div>
               <div className="w-full flex justify-center items-center">
                  <PDFDownloadLink 
                     className="text-[20px] flex justify-center items-center bg-[#3056D3] text-[#FFFFFF] w-[60%] rounded-[6px] h-[50px]"
                     document={<PDFDocument saleData={saleData} productData={productData} renderTime={renderTime} user={user} />}
                     fileName="Factura_Polar.pdf" >
                        {({ blob, url, loading, error }) => {
                           if (!error) {
                              return loading ? 'Cargando factura...' : 'Descargar en PDF'
                           } else {
                              console.log(error)
                           }
                        }}
                  </PDFDownloadLink>
               </div>
            </div>
         </section>
      </>
  );
}
