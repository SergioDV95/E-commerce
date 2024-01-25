/* eslint-disable react/prop-types */
import { useState } from "react";
import * as XLSX from "xlsx";

const ExportDayReport = ({ ReportData,day,month,year }) => {
  const [loading, setLoading] = useState(false);

  const titulo = [{ A: "Reporte de Ventas Diarias" }, {}];


  const longitudes = [35];

  const handleDownload = () => {
    setLoading(true);

    let tabla = [
      { A: "Ventas Del dia", B: "Total Ventas" },
    ];

    ReportData.docs.forEach((data) => {
      tabla.push({
        A: data.totalSold,
        B: data.totalSales,
      });
    });

    const dataFinal = [...titulo, ...tabla];

    setTimeout(() => {
      creandoArchivo(dataFinal);
      setLoading(false);
    }, 1000);
  };

  const creandoArchivo = (dataFinal) => {
    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.json_to_sheet(dataFinal, { skipHeader: true });

    hoja["!merges"] = [
      XLSX.utils.decode_range("A1:G1"),
    ];

    let propiedades = [];

    longitudes.forEach((col) => {
      propiedades.push({
        width: col,
      });
    });

    hoja["!cols"] = propiedades;

    XLSX.utils.book_append_sheet(libro, hoja, "Reports");

    XLSX.writeFile(libro, `${day}-${month}-${year}-DayReport.xlsx`);
  };

  return (
    <>
      {!loading ? (
        <button className="p-3 border border-[#eaecf0] font-bold active:border-blue-500 hover:border-blue-500  rounded-[15px] h-[50px]" onClick={handleDownload}>
          Exportar
        </button>
      ) : (
        <button className="border p-3 border-green-500 font-bold rounded-[15px] h-[50px]" disabled>
          <span className="text-sm"> Generando...</span>
        </button>
      )}
    </>
  );
};

export default ExportDayReport;