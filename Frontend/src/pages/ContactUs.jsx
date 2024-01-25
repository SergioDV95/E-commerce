import {ContactUsImg} from '../components/exportsImports'

export default function ContactUs () {
  return (
    <div>
      <div className=" bg-blue-500 grid grid-rows-2 w-[80vw] p-5 m-10 md:hidden">
        <div className="grid grid-rows-[100px_1fr] gap-3 justify-items-center w-[70vw]">
          <div className="text-white font-bold w-[300px] text-center text-2xl tracking-widest mt-5 py-5 select-none">
            <h2>A una Sola llamada o Correo de Ti:</h2>
          </div>
          <div className="text-white grid-cols-3 w-[300px] gap-3 p-4 text-lg">
            <div className='py-5'>
              <span>contactPolar@polar.com</span>
            </div>
            <div className='py-5'>
              <span>+584123457698</span>
            </div>
            <div className='py-5'>
              <span>
                Distrito Capital Municipio Libertador (Sede Administrativa)
              </span>
            </div>
          </div>
        </div>
        <div className='select-none'>
          <img src={ContactUsImg} alt="contact" />
        </div>
      </div>
      <div className="hidden bg-blue-500 md:grid grid-cols-2 w-[70vw] p-5 mt-10">
        <div className='select-none'>
          <img src={ContactUsImg} alt="contact" />
        </div>
        <div className="grid grid-rows-2 gap-3">
          <div className="text-white font-bold text-2xl tracking-widest mt-5 py-5 select-none">
            <h2>A una Sola llamada o Correo de Ti:</h2>
          </div>
          <div className="text-white grid-cols-3 w-[400px] gap-3 p-4 text-lg">
            <div>
              <span>contactPolar@polar.com</span>
            </div>
            <div>
              <span>+584123457698</span>
            </div>
            <div>
              <span>
                Distrito Capital Municipio Libertador (Sede Administrativa)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}