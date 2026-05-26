// src/pages/Dashboard.jsx

const Dashboard = () => {

  return (

    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* HERO */}
      <section
        className="
          relative overflow-hidden
          rounded-[40px]
          border border-white/10
          bg-gradient-to-br
          from-cyan-500/10
          via-blue-500/10
          to-violet-500/10
          p-10
          shadow-2xl
          backdrop-blur-xl
        "
      >

        {/* EFECTOS */}
        <div
          className="
            absolute -top-20 -right-20
            h-72 w-72
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-20 -left-20
            h-72 w-72
            rounded-full
            bg-violet-500/10
            blur-3xl
          "
        />

        <div className="relative z-10">

          <span
            className="
              inline-flex
              rounded-full
              bg-cyan-500/20
              px-4 py-2
              text-sm font-medium
              text-cyan-300
            "
          >
            🌐 Red Internacional de Cooperación
          </span>

          <h1
            className="
              mt-6
              max-w-4xl
              text-4xl
              font-bold
              leading-tight
              text-white
              sm:text-5xl
            "
          >
            Plataforma internacional de cooperación académica
            en Inteligencia Artificial
          </h1>

          <p
            className="
              mt-6
              max-w-3xl
              text-lg
              leading-relaxed
              text-white/70
            "
          >
            Un ecosistema digital orientado a fortalecer la educación
            superior mediante la colaboración académica, el intercambio
            de conocimiento y el desarrollo conjunto de iniciativas
            internacionales en inteligencia artificial.
          </p>

        </div>

      </section>

      {/* PROBLEMA Y SOLUCIÓN */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* PROBLEMA */}
        <div
          className="
            rounded-[32px]
            border border-red-500/10
            bg-white/5
            p-8
            backdrop-blur-xl
          "
        >

          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-red-500/10
              text-2xl
            "
          >
            ⚠️
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white">
            Problemática
          </h2>

          <p className="mt-4 leading-relaxed text-white/70">
            Actualmente existen importantes brechas en el acceso al
            conocimiento y la formación en inteligencia artificial
            entre distintos países y universidades.
          </p>

          <p className="mt-4 leading-relaxed text-white/70">
            Mientras algunas instituciones avanzan rápidamente en
            innovación tecnológica, otras enfrentan limitaciones
            relacionadas con recursos, capacitación y cooperación
            internacional.
          </p>

        </div>

        {/* SOLUCIÓN */}
        <div
          className="
            rounded-[32px]
            border border-emerald-500/10
            bg-white/5
            p-8
            backdrop-blur-xl
          "
        >

          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-emerald-500/10
              text-2xl
            "
          >
            🚀
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white">
            Nuestra solución
          </h2>

          <p className="mt-4 leading-relaxed text-white/70">
            La plataforma permite conectar universidades,
            investigadores, docentes y estudiantes mediante espacios
            digitales de formación, investigación y cooperación.
          </p>

          <p className="mt-4 leading-relaxed text-white/70">
            Más que un repositorio académico, esta iniciativa funciona
            como un ecosistema activo de aprendizaje colaborativo
            orientado al desarrollo internacional de la IA.
          </p>

        </div>

      </section>

      {/* ALCANCE */}
      <section
        className="
          mt-8
          rounded-[32px]
          border border-white/10
          bg-white/5
          p-8
          backdrop-blur-xl
        "
      >

        <div className="flex items-center gap-4">

          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-blue-500/10
              text-2xl
            "
          >
            🎯
          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Alcance de la plataforma
            </h2>

            <p className="mt-1 text-white/60">
              Educación superior, investigación y cooperación internacional
            </p>

          </div>

        </div>

        <p className="mt-6 leading-relaxed text-white/70">
          La iniciativa está orientada exclusivamente al ámbito de la
          educación superior, integrando universidades, centros de
          investigación y entidades académicas de distintos países.
        </p>

        <p className="mt-4 leading-relaxed text-white/70">
          El objetivo es fortalecer la formación, investigación y
          aplicación de la inteligencia artificial mediante proyectos
          colaborativos, programas de formación conjunta y transferencia
          internacional de conocimiento.
        </p>

      </section>

      {/* COMPONENTES */}
      <section className="mt-8">

        <div className="mb-6">

          <h2 className="text-3xl font-bold text-white">
            Componentes de la plataforma
          </h2>

          <p className="mt-2 text-white/60">
            Espacios académicos diseñados para impulsar la cooperación internacional
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {/* CARD */}
          <div
            className="
              rounded-[28px]
              border border-white/10
              bg-white/5
              p-6
              transition
              hover:-translate-y-1
              hover:bg-white/10
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-cyan-500/10
                text-2xl
              "
            >
              📚
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Biblioteca académica
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Intercambio de investigaciones, recursos educativos,
              artículos científicos y buenas prácticas relacionadas
              con inteligencia artificial.
            </p>

          </div>

          {/* CARD */}
          <div
            className="
              rounded-[28px]
              border border-white/10
              bg-white/5
              p-6
              transition
              hover:-translate-y-1
              hover:bg-white/10
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-violet-500/10
                text-2xl
              "
            >
              🎓
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Formación y capacitación
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Desarrollo de cursos virtuales, seminarios internacionales,
              mentorías y masterclass dirigidas a estudiantes y docentes.
            </p>

          </div>

          {/* CARD */}
          <div
            className="
              rounded-[28px]
              border border-white/10
              bg-white/5
              p-6
              transition
              hover:-translate-y-1
              hover:bg-white/10
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-emerald-500/10
                text-2xl
              "
            >
              💬
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Foro académico
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Espacio de diálogo internacional para debatir ideas,
              compartir experiencias y construir conocimiento conjunto.
            </p>

          </div>

          {/* CARD */}
          <div
            className="
              rounded-[28px]
              border border-white/10
              bg-white/5
              p-6
              transition
              hover:-translate-y-1
              hover:bg-white/10
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-yellow-500/10
                text-2xl
              "
            >
              🚀
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Proyectos colaborativos
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Desarrollo conjunto de investigaciones y soluciones
              tecnológicas aplicadas a la educación superior.
            </p>

          </div>

          {/* CARD */}
          <div
            className="
              rounded-[28px]
              border border-white/10
              bg-white/5
              p-6
              transition
              hover:-translate-y-1
              hover:bg-white/10
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-pink-500/10
                text-2xl
              "
            >
              ⚖️
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Ética y estándares
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Construcción de lineamientos internacionales sobre el
              uso responsable y ético de la inteligencia artificial.
            </p>

          </div>

          {/* CARD */}
          <div
            className="
              rounded-[28px]
              border border-white/10
              bg-white/5
              p-6
              transition
              hover:-translate-y-1
              hover:bg-white/10
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-orange-500/10
                text-2xl
              "
            >
              🌎
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Cooperación internacional
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Transferencia de conocimiento y acompañamiento académico
              hacia contextos educativos con menor desarrollo tecnológico.
            </p>

          </div>

        </div>

      </section>

    </div>

  );
};

export default Dashboard;