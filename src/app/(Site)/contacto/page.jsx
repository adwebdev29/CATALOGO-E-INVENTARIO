import Contact from "@/app/_components/Contact";
import MainSec from "@/app/_components/MainSec";
import MainTitle from "@/app/_components/MainTitle";
export default function Contacto() {
  return (
    <MainSec>
      <MainTitle
        miniTitle="Estamos para servirte"
        Title="Contáctanos"
        desc="¿Tienes dudas sobre un equipo o necesitas asesoría técnica? Llena el
          formulario o contáctanos directamente."
      />
      <Contact />
    </MainSec>
  );
}
