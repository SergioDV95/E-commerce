/* eslint-disable react/prop-types */
import { useState } from "react";
import * as XLSX from "xlsx";
//Falta por Realizar por Falta de Datos
const ExportProductsReport = ({ ReportData,month,year,page }) => {
  const [loading, setLoading] = useState(false);

  const titulo = [{ A: "Reporte Mensual de Ventas por Producto" }, {}];

  const longitudes = [35, 25,25];

  const handleDownload = () => {
    setLoading(true);

    let tabla = [
      { A: "Producto", B: "Ventas Totales",C: "Cantidad de Ventas" },
    ];

    ReportData.docs.forEach((product) => {
      tabla.push({
        A: product._id, 
        B: product.totalSold,
        C: product.totalSales,
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

    XLSX.writeFile(libro, `${month}-${year}-Products-MonthReport-Page=${page}.xlsx`);
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

export default ExportProductsReport;