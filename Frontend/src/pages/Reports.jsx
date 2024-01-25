import DayReport from "../components/DayReport";
import MonthReport from "../components/MonthReport";
import VendorsReports from "../components/VendorsReports";
import CustomersReport from "../components/CustomersReport";
import ProductsReport from "../components/ProductsReport";
import CategoryReport from "../components/CategoryReport";
export default function Reports () {
  return (
    <>
      <section className="flex flex-col items-start w-[70vw] my-10 mx-5">
        <div className="grid grid-rows-2 justify-items-start">
          <div className="flex w-[327px] items-center gap-[8px]">
            <div className="w-fit mt-[-1.00px] font-medium text-gray-900 text-[18px] tracking-[0] leading-[28px] whitespace-nowrap">
              <span>Tabla de Reportes</span>
            </div>
          </div>
          <div>
            <p className="w-[327px] font-normal text-gray-500 text-[14px] tracking-[0] leading-[20px]">
              Obten todas las estadisticas que necesites sobre la empresa
            </p>
          </div>
        </div>
      </section>
      <DayReport/>
      <MonthReport/>
      <VendorsReports/>
      <CustomersReport/>
      <ProductsReport/>
      <CategoryReport/>
    </>
  );
}