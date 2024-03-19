import { useState,useEffect } from "react";
import axios from "axios";
import { Reports1Svg } from "../components/exportsImports";
import ExportDayReport from "./ExportToExcelBtn/ExportDayReport";

export default function DayReport() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const [showList, setShowList] = useState(false);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [DayReport, setDayReport] = useState("");

  const [input, setInput] = useState({
    dia: "",
    mes: "",
    anio: "",
  });


  const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];
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

  useEffect(() => {
      const fetchData = async () => {
        axios
          .get(`https://backendprueba.xyz/reports/salesPerDay?day=${selectedDay}&month=${selectedMonth}&year=${selectedYear}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            const data = response.data;
            setDayReport(data);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      fetchData();
  }, [selectedDay,selectedMonth,selectedYear]);
  return (
    <>
      <section>
        <div className="grid grid-cols-2 gap-5 border border-[#eaecf0] m-5 p-4 mr-7 rounded-[15px] justify-items-end md:w-[600px] md:justify-items-center md:grid-cols-[1fr_300px] lg:hidden">
          <div className="grid grid-rows-[65px_1fr] justify-start mr-5">
            <div className="font-bold ">
              <h4>Ventas por día (general)</h4>
            </div>
            <div>
              <div className="rounded-[15px] bg-[#ffe2e5] grid grid-rows-[50px_60px] p-3 w-[150px] h-[150px]">
                <Reports1Svg />
                <div className="grid grid-rows-2 w-[100px]">
                  <span className="font-bold text-xl">
                    {DayReport.docs && DayReport.docs.length > 0 ? (
                      <span>$</span> + DayReport.docs[0].totalSold.toFixed(2)
                    ) : (
                      <span>$0</span>
                    )}
                  </span>
                  <span className="text-[#61697b] font-semibold tracking-wide">
                    Ventas totales
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-[60px_60px_60px_60px] select-none">
            <div className="z-[97]">
              <ul className="p-3 border border-[#eaecf0] active:border-blue-500 hover:border-blue-500  rounded-[15px] h-[50px]">
                <li
                  className={`outline-none cursor-pointer font-bold  ${
                    showList === false ? "text-black font-bold" : ""
                  }`}
                  onClick={() => {
                    handleClick("day");
                  }}
                >
                  {selectedDay === "" ? "Día" : selectedDay}
                </li>
                <div
                  className={`h-[40vh] bg-[#fff] cursor-pointer overflow-y-auto border border-[#eaecf0] p-3 ${
                    showList === "day" ? "" : "hidden"
                  } `}
                >
                  {showList &&
                    showList === "day" &&
                    days.map((day) => (
                      <li
                        key={day}
                        className={`outline-none font-bold hover:bg-[#eaecf0] ${
                          selectedDay === day ? " text-black font-bold" : ""
                        }`}
                        onClick={() => {
                          setSelectedDay(day);
                          handleChange({ target: { value: day } });
                          handleCloseList();
                        }}
                      >
                        {day}
                      </li>
                    ))}
                </div>
              </ul>
            </div>
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
                  className={`h-[40vh] bg-[#fff] cursor-pointer overflow-y-auto border border-[#eaecf0] p-3 ${
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
                  className={` outline-none cursor-pointer font-bold ${
                    showList === false ? "text-black font-bold" : ""
                  }`}
                  onClick={() => {
                    handleClick("year");
                  }}
                >
                  {selectedYear === "" ? "Año" : selectedYear}
                </li>
                <div
                  className={`h-[40vh] bg-[#fff] cursor-pointer overflow-y-auto border border-[#eaecf0] p-3 ${
                    showList === "year" ? "" : "hidden"
                  } `}
                >
                  {showList &&
                    showList === "year" &&
                    years.map((year) => (
                      <li
                        key={year}
                        className={`outline-none font-bold hover:bg-[#eaecf0] ${
                          selectedYear === year ? " text-black font-bold" : ""
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
              <ExportDayReport
                ReportData={DayReport}
                day={selectedDay}
                month={selectedMonth}
                year={selectedYear}
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="grid grid-rows-[70px_1fr] gap-5 w-[60vw] border border-[#eaecf0] m-5 p-4 mr-7 rounded-[15px] justify-items-center mx-20">
            <div className="grid grid-cols-2 items-center gap-20 select-none">
              <div className="font-bold  mr-10">
                <h4>Ventas por día (general)</h4>
              </div>
              <div className="grid grid-cols-[80px_80px_80px] ml-10 gap-5 select-none">
                <div className="z-[97]">
                  <ul className="p-3 border border-[#eaecf0] active:border-blue-500 hover:border-blue-500  rounded-[15px] h-[50px]">
                    <li
                      className={`outline-none cursor-pointer font-bold ${
                        showList === false ? "text-black font-bold" : ""
                      }`}
                      onClick={() => {
                        handleClick("day");
                      }}
                    >
                      {selectedDay === "" ? "Día" : selectedDay}
                    </li>
                    <div
                      className={`h-[40vh] bg-[#fff] cursor-pointer overflow-y-auto border border-[#eaecf0] p-3 ${
                        showList === "day" ? "" : "hidden"
                      } `}
                    >
                      {showList &&
                        showList === "day" &&
                        days.map((day) => (
                          <li
                            key={day}
                            className={`outline-none font-bold hover:bg-[#eaecf0] ${
                              selectedDay === day ? " text-black font-bold" : ""
                            }`}
                            onClick={() => {
                              setSelectedDay(day);
                              handleChange({ target: { value: day } });
                              handleCloseList();
                            }}
                          >
                            {day}
                          </li>
                        ))}
                    </div>
                  </ul>
                </div>
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
            </div>
            <div className="grid grid-rows-[65px_1fr] justify-items-center mr-5">
              <div className="z-[94]">
                <ExportDayReport
                  ReportData={DayReport}
                  day={selectedDay}
                  month={selectedMonth}
                  year={selectedYear}
                />
              </div>
              <div>
                <div className="rounded-[15px] bg-[#ffe2e5] grid grid-rows-[50px_60px] p-3 w-[150px] h-[150px]">
                  <Reports1Svg />
                  <div className="grid grid-rows-2 w-[100px]">
                    <span className="font-bold text-xl">
                      {DayReport.docs && DayReport.docs.length > 0 ? (
                        '$' + DayReport.docs[0].totalSold.toFixed(2)
                      ) : (
                        <span>0</span>
                      )}
                    </span>
                    <span className="text-[#61697b] font-semibold tracking-wide">
                      Ventas totales
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