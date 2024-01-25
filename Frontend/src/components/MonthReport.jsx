/* eslint-disable react-hooks/exhaustive-deps */
import { useState,useEffect } from "react";
import axios from "axios";
import { Reports1Svg,Reports2Svg,Reports3Svg,Reports4Svg } from "../components/exportsImports";
import ExportMonthReport from "./ExportToExcelBtn/ExportMonthReport";

export default function DayReport() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [showList, setShowList] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthReport, setMonthReport] = useState("");
  const [product, setProduct] = useState([]);
  const [productId, setProductId] = useState("");
  const [updatedData, setUpdatedData] = useState("");
  const months = [
    { name: "Enero", value: 1 },
    { name: "Febrero", value: 2 },
    { name: "Marzo", value: 3 },
    { name: "Abril", value: 4 },
    { name: "Mayo", value: 5 },
    { name: "Junio", value: 6 },
    { name: "Julio", value: 7 },
    { name: "Agosto", value: 8 },
    { name: "Septiembre", value: 9 },
    { name: "Octubre", value: 10 },
    { name: "Noviembre", value: 11 },
    { name: "Diciembre", value: 12 },
  ];
  const [input, setInput] = useState({
    dia: "",
    mes: "",
    año: "",
  });
  const years = [
    2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  const handleClick = (type) => {
    setShowList(type);
    if(showList !== false){
      setShowList(false);
    }
  };

  const handleCloseList = () => {
    setShowList();
  };

  const fetchProduct = async ({ productId }) => {
    axios
      .get(`http://localhost:3001/products?id=${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        setProduct(data);
        setUpdatedData( { ...monthReport, ProductName: product.docs[0].name });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`http://localhost:3001/reports/generalDataReportPerMonth?month=${selectedMonth}&year=${selectedYear}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          setMonthReport(data);
          setProductId(data.bestSellingProduct.name)
        })
        .catch((error) => {
          console.log(error);
        });
    };
    
    fetchData();
    fetchProduct({ productId });
}, [selectedMonth, selectedYear, productId]);

  return (
    <>
      <section>
        <div className="flex justify-center gap-5 border border-[#eaecf0] m-5 p-4 mr-7 rounded-[15px] md:w-[67vw] lg:hidden">
          <div className="grid grid-rows-[120px_1fr] justify-items-center">
            <div className="font-bold text-center grid grid-rows-2 justify-center">
              <div>
                <h4>Ventas por Mes (general)</h4>
              </div>
              <div className="grid grid-cols-[60px_60px_60px] gap-5 select-none justify-center">
                <div className="z-[96]">
                  <ul className="p-3 border border-[#eaecf0] active:border-blue-500 hover:border-blue-500  rounded-[15px] h-[50px]">
                    <li
                      className={`outline-none cursor-pointer font-bold ${
                        showList === false ? "text-black font-bold" : ""
                      }`}
                      onClick={() => {
                        handleClick("month");
                      }}
                    >
                      {selectedMonth === "" ? "Mes" : selectedMonth}
                    </li>
                    <div
                      className={`h-[40vh] w-[25vw] bg-[#fff] cursor-pointer overflow-y-auto border border-[#eaecf0] p-3 ${
                        showList === "month" ? "" : "hidden"
                      } `}
                    >
                      {showList &&
                        showList === "month" &&
                        months.map((month) => (
                          <li
                            key={month.name}
                            className={`outline-none font-bold hover:bg-[#eaecf0] ${
                              selectedMonth === month.name
                                ? " text-black font-bold"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedMonth(month.value);
                              handleChange({ target: { value: month.value } });
                              handleCloseList();
                            }}
                          >
                            {month.name}
                          </li>
                        ))}
                    </div>
                  </ul>
                </div>
                <div className="z-[95]">
                  <ul className="p-3 border border-[#eaecf0] active:border-blue-500 hover:border-blue-500  rounded-[15px] h-[50px]">
                    <li
                      className={`outline-none cursor-pointer font-bold ${
                        showList === false ? "text-black font-bold" : ""
                      }`}
                      onClick={() => {
                        handleClick("year");
                      }}
                    >
                      {selectedYear === "" ? "Año" : selectedYear}
                    </li>
                    <div
                      className={`h-[40vh] w-[120px] bg-[#fff] cursor-pointer overflow-y-auto border border-[#eaecf0] p-3 ${
                        showList === "year" ? "" : "hidden"
                      } `}
                    >
                      {showList &&
                        showList === "year" &&
                        years.map((year) => (
                          <li
                            key={year}
                            className={`outline-none font-bold hover:bg-[#eaecf0] ${
                              selectedYear === year
                                ? " text-black font-bold"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedYear(year);
                              handleChange({ target: { value: year } });
                              handleCloseList();
                            }}
                          >
                            {year}
                          </li>
                        ))}
                    </div>
                  </ul>
                </div>
                <div className="z-[94]">
                  <ExportMonthReport
                    ReportData={updatedData}
                    month={selectedMonth}
                    year={selectedYear}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-4 gap-5">
              <div className="rounded-[15px] bg-[#ffe2e5] grid grid-rows-[50px_60px] py-4 px-6 w-[350px] h-[160px]">
                <Reports1Svg />
                <div className="grid grid-rows-2 w-[200px]">
                  <span className="font-bold text-xl">
                    $
                    {monthReport && monthReport.totalSales.toFixed(2)}
                  </span>
                  <span className="text-[#61697b] font-semibold tracking-wide">
                    Ventas totales
                  </span>
                </div>
              </div>
              <div className="rounded-[15px] bg-[#fff4de] grid grid-rows-[50px_60px] py-4 px-6 w-[350px] h-[160px]">
                <Reports2Svg />
                <div className="grid grid-rows-2 w-[300px] gap-3">
                  <span className="font-bold text-xl">
                    {monthReport.bestSeller &&
                      monthReport.bestSeller.salesCount}{" "}
                    <span className="font-normal text-base">Ventas</span>
                  </span>
                  <span className="text-[#61697b] font-semibold tracking-wide">
                    Mejor Vendedor:{" "}
                    <span className="text-blue-500 font-semibold text-base">
                      {monthReport.bestSeller && monthReport.bestSeller.name}
                    </span>
                  </span>
                </div>
              </div>
              <div className="rounded-[15px] bg-[#f3e8ff] grid grid-rows-[50px_60px] py-4 px-6 w-[350px] h-[160px]">
                <Reports3Svg />
                <div className="grid grid-rows-2 w-[300px] gap-3">
                  <span className="font-bold text-xl">
                    {monthReport.bestCustomer &&
                      monthReport.bestCustomer.purchasesCount}{" "}
                    <span className="font-normal text-base">Compras</span>
                  </span>
                  <span className="text-[#61697b] font-semibold tracking-wide">
                    Mejor Cliente:{" "}
                    <span className="text-blue-500 font-semibold text-base">
                      {monthReport.bestCustomer &&
                        monthReport.bestCustomer.name}
                    </span>
                  </span>
                </div>
              </div>
              <div className="rounded-[15px] bg-[#dcfce7] grid grid-rows-[50px_60px] py-4 px-6 w-[350px] h-[160px]">
                <Reports4Svg />
                <div className="grid grid-rows-2 w-[300px] gap-3">
                  <span className="font-bold text-xl">
                    {monthReport.bestSellingProduct &&
                      monthReport.bestSellingProduct.purchasesCount}{" "}
                    <span className="font-normal text-base">Unidades</span>
                  </span>
                  <span className="text-[#61697b] font-semibold tracking-wide">
                    Producto mas Vendido:{" "}
                    <span className="text-blue-500 font-semibold text-base">
                      {product.docs && product.docs.length > 0 ? (
                        product.docs[0].name
                      ) : (
                        <span>0</span>
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="flex justify-center gap-5 border w-[70vw] border-[#eaecf0] mx-5 px-4 pb-5 mr-7 rounded-[15px]">
            <div className="grid grid-rows-[120px_1fr] justify-items-center">
              <div className="font-bold text-center grid grid-cols-3 gap-10 items-center w-[70vw] justify-around">
                <div>
                  <h4>Ventas por Mes (general)</h4>
                </div>
                <div className="grid grid-cols-[60px_60px] gap-5 select-none justify-center">
                  <div className="z-[96]">
                    <ul className="p-3 border border-[#eaecf0] active:border-blue-500 hover:border-blue-500  rounded-[15px] h-[50px]">
                      <li
                        className={`outline-none cursor-pointer font-bold ${
                          showList === false ? "text-black font-bold" : ""
                        }`}
                        onClick={() => {
                          handleClick("month");
                        }}
                      >
                        {selectedMonth === "" ? "Mes" : selectedMonth}
                      </li>
                      <div
                        className={`h-[40vh] w-[10vw] bg-[#fff] cursor-pointer overflow-y-auto border border-[#eaecf0] p-3 ${
                          showList === "month" ? "" : "hidden"
                        } `}
                      >
                        {showList &&
                          showList === "month" &&
                          months.map((month) => (
                            <li
                              key={month.name}
                              className={`outline-none font-bold hover:bg-[#eaecf0] ${
                                selectedMonth === month.name
                                  ? " text-black font-bold"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedMonth(month.value);
                                handleChange({
                                  target: { value: month.value },
                                });
                                handleCloseList();
                              }}
                            >
                              {month.name}
                            </li>
                          ))}
                      </div>
                    </ul>
                  </div>
                  <div className="z-[95]">
                    <ul className="p-3 border border-[#eaecf0] active:border-blue-500 hover:border-blue-500  rounded-[15px] h-[50px]">
                      <li
                        className={`outline-none cursor-pointer font-bold ${
                          showList === false ? "text-black font-bold" : ""
                        }`}
                        onClick={() => {
                          handleClick("year");
                        }}
                      >
                        {selectedYear === "" ? "Año" : selectedYear}
                      </li>
                      <div
                        className={`h-[40vh] w-[7vw] bg-[#fff] cursor-pointer overflow-y-auto border border-[#eaecf0] p-3 ${
                          showList === "year" ? "" : "hidden"
                        } `}
                      >
                        {showList &&
                          showList === "year" &&
                          years.map((year) => (
                            <li
                              key={year}
                              className={`outline-none font-bold hover:bg-[#eaecf0] ${
                                selectedYear === year
                                  ? " text-black font-bold"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedYear(year);
                                handleChange({ target: { value: year } });
                                handleCloseList();
                              }}
                            >
                              {year}
                            </li>
                          ))}
                      </div>
                    </ul>
                  </div>
                </div>
                <div className="z-[94]">
                  <ExportMonthReport
                    ReportData={updatedData}
                    month={selectedMonth}
                    year={selectedYear}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-5">
                <div className="rounded-[15px] bg-[#ffe2e5] grid grid-rows-[50px_60px] py-4 px-6 w-[180px] h-[170px]">
                  <Reports1Svg />
                  <div className="grid grid-rows-2 w-[100px]">
                    <span className="font-bold text-xl">
                      $
                      {monthReport && monthReport.totalSales.toFixed(2)}
                    </span>
                    <span className="text-[#61697b] font-semibold tracking-wide">
                      Ventas totales
                    </span>
                  </div>
                </div>
                <div className="rounded-[15px] bg-[#fff4de] grid grid-rows-[50px_60px] py-4 px-6 w-[180px] h-[170px]">
                  <Reports2Svg />
                  <div className="grid grid-rows-2 w-[100px] gap-3">
                    <span className="font-bold text-xl">
                      {monthReport.bestSeller &&
                        monthReport.bestSeller.salesCount}{" "}
                      <span className="font-normal text-base">Ventas</span>
                    </span>
                    <span className="text-[#61697b] text-sm font-semibold tracking-wide">
                      Mejor Vendedor:{" "}
                      <span className="text-blue-500 text-sm font-semibold">
                        {monthReport.bestSeller && monthReport.bestSeller.name}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="rounded-[15px] bg-[#f3e8ff] grid grid-rows-[50px_60px] py-4 px-6 w-[180px] h-[170px]">
                  <Reports3Svg />
                  <div className="grid grid-rows-2 w-[100px] gap-3">
                    <span className="font-bold text-xl">
                      {monthReport.bestCustomer &&
                        monthReport.bestCustomer.purchasesCount}{" "}
                      <span className="font-normal text-base">Compras</span>
                    </span>
                    <span className="text-[#61697b] text-sm font-semibold tracking-wide">
                      Mejor Cliente:{" "}
                      <span className="text-blue-500 font-semibold text-sm">
                        {monthReport.bestCustomer &&
                          monthReport.bestCustomer.name}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="rounded-[15px] bg-[#dcfce7] grid grid-rows-[50px_60px] py-4 px-6 w-[180px] h-[170px]">
                  <Reports4Svg />
                  <div className="grid grid-rows-2 w-[150px] gap-3">
                    <span className="font-bold text-xl w-[140px]">
                      {monthReport.bestSellingProduct &&
                        monthReport.bestSellingProduct.purchasesCount}{" "}
                      <span className="font-normal text-base">Unidades</span>
                    </span>
                    <span className="text-[#61697b] w-[140px] text-sm font-semibold tracking-normal">
                      Producto mas Vendido:{" "}
                      <p className="text-blue-500 font-semibold text-sm overflow-hidden text-ellipsis">
                        {product.docs && product.docs.length > 0 ? (
                          product.docs[0].name
                        ) : (
                          <span>0</span>
                        )}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}