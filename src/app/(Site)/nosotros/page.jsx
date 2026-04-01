import NosotrosImage from "@/app/_components/NosotrosImage";
import MainTitle from "@/app/_components/MainTitle";
import H2 from "@/app/_components/H2";
import Paragraph from "@/app/_components/Paragraph";
import UList from "@/app/_components/UList";
import { insigneas } from "@/app/_constants/NosotrosInsignea";
import InsigneaSection from "@/app/_components/InsigneasSection";
import Note from "@/app/_components/Note";
import FinalQuestion from "@/app/_components/FinalQuestion";
import MainSec from "@/app/_components/MainSec";
export default function Nosotros() {
  return (
    <MainSec>
      <MainTitle
        miniTitle="Nuestra Historia"
        Title="Ingeniería y Servicio Industrial"
        desc="Somos una empresa mexicana dedicada a elevar los estándares de
          mantenimiento industrial a través de equipamiento de alta calidad e
          instalaciones profesionales para sistemas de lubricación."
      />

      <section className="w-[90%] m-auto py-16 bg-white rounded-3xl shadow-lg border border-slate-100">
        <div className="flex flex-col lg:flex-row items-center gap-12 px-6 md:px-12">
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-slate-50">
              <NosotrosImage />
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <H2>Especialistas en soluciones de lubricación industrial</H2>
            <div className="w-20 h-1 bg-yellow-500 rounded-full"></div>
            <Paragraph>
              Fundada con la visión de profesionalizar los sistemas de
              lubricación y mantenimiento, <strong>MILAS</strong> ha
              evolucionado para convertirse en un referente en soluciones
              integrales para entornos industriales.
            </Paragraph>
            <Paragraph>
              Entendemos que cada minuto de paro operativo representa una
              pérdida. Por eso, no solo vendemos bombas o carretes; diseñamos
              sistemas de flujo eficientes que optimizan tiempos de operación y
              evitan mermas de fluidos.
            </Paragraph>
            <UList
              items={[
                "Cobertura a nivel nacional.",
                "Distribuidores directos de fábrica.",
                "Personal técnico especializado.",
              ]}
            />
          </div>
        </div>
      </section>

      <InsigneaSection items={insigneas} />

      {/* pilares*/}
      <section className="w-[90%] m-auto pb-16">
        <div className="text-center mb-10">
          <H2>Nuestros Pilares</H2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 ">
          <Note
            icon={["M13 10V3L4 14h7v7l9-11h-7z"]}
            title="Misión"
            desc="Proveer soluciones integrales de lubricación que maximicen la
                productividad de nuestros clientes, garantizando seguridad,
                eficiencia y confiabilidad en cada instalación."
          />

          <Note
            icon={[
              "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
              "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
            ]}
            title="Visión"
            desc="Ser la empresa líder en México en soluciones de lubricación
                industrial, reconocida por nuestra excelencia técnica,
                innovación y compromiso con cada proyecto."
          />

          <Note
            icon={["M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"]}
            title="Valores"
            desc="Honestidad en cada diagnóstico, calidad en cada componente
                instalado y compromiso total con los tiempos de entrega
                acordados."
          />
        </div>
      </section>

      <FinalQuestion
        title="¿Listo para trabajar con expertos?"
        des="Déjanos optimizar tu operación con el equipo adecuado."
        buttonTitle="Contáctanos Hoy"
      />
    </MainSec>
  );
}
