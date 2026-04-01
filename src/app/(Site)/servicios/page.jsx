import MainSec from "@/app/_components/MainSec";
import MainTitle from "@/app/_components/MainTitle";
import Note from "@/app/_components/Note";
import FinalQuestion from "@/app/_components/FinalQuestion";
export default function Servicios() {
  return (
    <MainSec>
      <MainTitle
        miniTitle="Especialistas en Sistemas de Lubricación Industrial"
        Title="Instalación y Equipamiento"
        desc="Garantizamos el funcionamiento óptimo de tus operaciones mediante instalaciones profesionales y equipos de alto rendimiento para sistemas de lubricación."
      />

      <section className="w-[90%] m-auto pb-16">
        <div className="grid md:grid-cols-2 gap-10">
          <Note
            icon={[
              "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            ]}
            title="Instalación de Equipos"
            desc="Montaje profesional de equipos de lubricación. Aseguramos la correcta fijación y calibración para uso rudo."
            items={[
              "Bombas de Fluido: Para aceite, grasa, urea, anticongelante, etc.",
              "Carretes Retráctiles: Instalación segura en estructuras y puntos de trabajo para un manejo eficiente de fluidos.",
              "Accesorios de Despacho: Instalación y calibración de dispositivos de control, medición y despacho de fluidos.",
            ]}
            link={["/contacto", "Cotizar Equipamiento"]}
          />

          <Note
            icon={["M13 10V3L4 14h7v7l9-11h-7z"]}
            title="Tuberías y Líneas de Aire"
            desc="Diseño y tendido de redes de distribución para el suministro de fluidos, adaptadas a las necesidades de cada área operativa."
            items={[
              "Redes de Fluido: Tubería para distribución centralizada de aceite y recuperación.",
              "Líneas de Aire: Alimentación neumática eficiente para herramientas y bombas.",
              "Ingeniería: Cálculo de diámetros y presiones adecuadas.",
            ]}
            link={["/contacto", "Cotizar Equipamiento"]}
          />
        </div>
      </section>
      <FinalQuestion
        title="¿Tienes un proyecto en puerta?"
        des="Cuéntanos sobre tu proyecto y recibe una propuesta técnica de acuerdo a tus necesidades."
        buttonTitle="Solicitar propuesta técnica"
      />
    </MainSec>
  );
}
