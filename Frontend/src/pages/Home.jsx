import { Link } from "react-router-dom";
import { EmpresasPolar,polarSede,banner1,banner2,cachapas,circulo1,circulo2,circulo3,circulo4,imagenSeccion1,dogurmet,golden,margarita,mavesa,migurt,pampero,pan,quaker,rikesa,supercan,toddy,voluntariado1,voluntariado2,voluntariado3 } from "./../components/exportsImports";

export default function Home (){
  const mosaic = [
    cachapas,
    dogurmet,
    golden,
    margarita,
    mavesa,
    migurt,
    pampero,
    pan,
    quaker,
    rikesa,
    supercan,
    toddy,
  ]
  return (
    <>
      <section className="bg-[#f9d949] md:hidden">
        <div>
          <div className="relative h-[300px]">
            <img
              className="absolute top-0 left-0 z-10"
              src={imagenSeccion1}
              alt="imagenSeccion1"
            />
            <div className="absolute top-36 left-40 z-0 bg-[#e77929] blur-2xl rounded-full h-[100px] w-[200px]"></div>
          </div>
          <div>
            <div className="text-[#15284d] text-center">
              <p className="font-bold">DESCUBRE EN NUESTROS PRODUCTOS</p>
              <p className="text-sm">un mundo de sabores y posibilidades</p>
            </div>
            <div className="w-full flex justify-center py-3">
              <Link to={"/products"}>
                <button className="bg-[#f45050] p-2 rounded-full text-white font-semibold tracking-widest">
                  Ver Productos
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="hidden md:block bg-[#f9d949] rounded-[30px] w-[75vw]">
        <div className="mt-10 pt-10 ">
          <div className="grid grid-cols-2">
            <div>
              <div className="text-[#15284d] text-center m-3">
                <p className="font-bold text-2xl">
                  DESCUBRE EN NUESTROS PRODUCTOS
                </p>
                <p className="text-base">un mundo de sabores y posibilidades</p>
              </div>
              <div className="w-full flex justify-center py-3 m-3">
                <Link to={"/products"}>
                  <button className="bg-[#f45050] hover:bg-[hsl(0,43%,49%)] p-3 w-[300px] rounded-full text-white font-semibold tracking-widest">
                    Ver Productos
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px]">
              <img
                className="absolute top-0 left-0 z-10 h-[300px] w-[100%]"
                src={imagenSeccion1}
                alt="imagenSeccion1"
              />
              <div className="absolute top-36 left-40 z-0 bg-[#e77929] blur-2xl rounded-full h-[100px] w-[200px]"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <div className="grid grid-rows-[60px_1fr] justify-items-center lg:w-[75vw]">
          <div>
            <div className="text-center text-[#9ba4b4] text-xl tracking-widest font-bold">
              <h2>CATEGORÍAS</h2>
            </div>
            <div className="bg-[#9ba4b4] w-[190px] h-[4px] m-4"></div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-10 text-center text-[#9ba4b4] text-xl tracking-widest font-bold lg:grid-cols-3 xl:grid-cols-4 xl:gap-10">
            <div className="">
              <div className="rounded-full bg-[#14274e] p-3 w-[200px] h-[200px] flex justify-center items-center">
                <img
                  className="w-[100px] h-[100px]"
                  src={circulo1}
                  alt="categoria-1"
                />
              </div>
              <span>ALIMENTOS</span>
            </div>
            <div>
              <div className="rounded-full bg-[#14274e] p-3 w-[200px] h-[200px] flex justify-center items-center">
                <img
                  className="w-[100px] h-[100px]"
                  src={circulo2}
                  alt="categoria-2"
                />
              </div>
              <span>BEBIDAS</span>
            </div>
            <div>
              <div className="rounded-full bg-[#14274e] p-3 w-[200px] h-[200px] flex justify-center items-center">
                <img
                  className="w-[100px] h-[100px]"
                  src={circulo3}
                  alt="categoria-3"
                />
              </div>
              <span>MASCOTAS</span>
            </div>
            <div>
              <div className="rounded-full bg-[#14274e] p-3 w-[200px] h-[200px] flex justify-center items-center">
                <img
                  className="w-[100px] h-[100px]"
                  src={circulo4}
                  alt="categoria-4"
                />
              </div>
              <span>LIMPIEZA</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mt-10 pt-10 xl:w-[75vw]">
          <img className="xl:rounded-[30px]" src={banner1} alt="" />
        </div>
      </section>
      <section>
        <div className="grid grid-cols-2 mt-10 h-[470px] rounded-[30px] bg-[#f45050] lg:grid-cols-[330px_1fr] lg:w-[75vw] lg:overflow-hidden">
          <div>
            <img className="h-[460px]" src={banner2} alt="banner2" />
          </div>
          <div className=" lg:grid lg:grid-cols-2">
            <div>
              <div className="lg:mt-5 lg:pt-5">
                <div className="text-white pt-5 text-2xl tracking-widest font-bold">
                  <h2>SOBRE NOSOTROS</h2>
                </div>
                <div className="bg-[#f9d949] w-[190px] h-[6px] mx-0 my-4"></div>
              </div>
              <div className="w-[190px] lg:w-[310px]">
                <p className="text-white text-lg tracking-wide font-semibold lg:text-xl">
                  La actividad cotidiana de Empresas Polar es producir,
                  distribuir y ofertar marcas de alimentos y bebidas
                </p>
                <p className="text-white text-lg tracking-[2px] lg:tracking-[3px] lg:text-xl">
                  que satisfagan las necesidades y expectativas de los
                  consumidores, con la mejor calidad y la mejor relacion
                  precio-valor.
                </p>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                className="w-[348px] h-[100%]"
                src={polarSede}
                alt="polar-sede"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mt-10 h-[400px] bg-[#e6e6e6] lg:h-[80vh] lg:w-[75vw] lg:rounded-[30px]">
          <div className="grid grid-cols-[1fr_3px_1fr] p-5 justify-items-center items-center">
            <div className="text-[#15284d] font-bold text-xl">
              <h2>Voluntariado</h2>
            </div>
            <div className="bg-[#9ba4b4] w-[2px] h-[50px] m-4"></div>
            <div>
              <img className="h-[50px]" src={EmpresasPolar} alt="Logo" />
            </div>
          </div>
          <div className="text-[#15284d] text-center tracking-wider py-3 px-10">
            <p>
              El voluntariado de Empresas Polar representa un espacio para el
              aprendizaje y desarrollo del talento de los trabajadores
              voluntarios y las comunidades que se benefician.
            </p>
          </div>
          <div className="grid grid-cols-3 p-4 gap-10">
            <div>
              <img src={voluntariado1} alt="voluntariado1" />
            </div>
            <div>
              <img src={voluntariado2} alt="voluntariado2" />
            </div>
            <div>
              <img src={voluntariado3} alt="voluntariado3" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mt-10 flex flex-col justify-center items-center lg:w-[75vw]">
          <div className="text-center text-[#9ba4b4] text-xl tracking-widest font-bold">
            <h2>NUESTRAS MARCAS</h2>
          </div>
          <div className="bg-[#9ba4b4] w-[100px] h-[4px] m-4"></div>
        </div>
        <div className="my-10 grid grid-cols-3 p-3 lg:w-[75vw]">
          {mosaic.map((item, index) => {
            const isEven = index % 2 === 0;
            const grayscale = isEven ? "grayscale" : "grayscale";
            const brightness = isEven
              ? "filter-brightness-50"
              : "filter-brightness-100";

            return (
              <img
                key={item}
                src={item}
                alt="mosaic"
                className={`${grayscale} ${brightness} transition duration-500 ease-in-out w-[100%]  hover:grayscale-0`}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}