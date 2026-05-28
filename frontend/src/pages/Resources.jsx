import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResourcePreview from '../components/ResourcePreview';
import { createPortal } from 'react-dom';

const Resources = () => {

  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    categoria: '',
  });

  const [archivo, setArchivo] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedRecurso, setSelectedRecurso] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroUniversidad, setFiltroUniversidad] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // =========================
  // OBTENER RECURSOS
  // =========================
  const obtenerRecursos = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resources`
      );

      const data = await response.json();

      setRecursos(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    obtenerRecursos();
  }, []);

  // =========================
  // FORM
  // =========================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');

    if (
      !form.titulo ||
      !form.descripcion ||
      !form.tipo ||
      !form.categoria
    ) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!archivo) {
      setError('Debes seleccionar un archivo');
      return;
    }

    try {

      const formData = new FormData();

      Object.entries(form).forEach(([k, v]) =>
        formData.append(k, v)
      );

      formData.append('archivo', archivo);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resources`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSuccess('Recurso creado ✅');

      setForm({
        titulo: '',
        descripcion: '',
        tipo: '',
        categoria: '',
      });

      setArchivo(null);

      await obtenerRecursos();

      setTimeout(() => {

        setShowCreateModal(false);
        setSuccess('');

      }, 800);

    } catch (err) {

      setError(err.message);

    }
  };

  // =========================
  // FILTROS
  // =========================
  const recursosFiltrados = recursos.filter((r) => {

    const tipo = (r.tipo || '').toLowerCase();

    const cat = (r.categoria || '').toLowerCase();

    const tit = (r.titulo || '').toLowerCase();

    const uni = (r.universidad || '').toLowerCase();

    return (
      (!filtroTipo ||
        tipo === filtroTipo.toLowerCase()) &&

      (!filtroCategoria ||
        cat === filtroCategoria.toLowerCase()) &&

      (!filtroUniversidad ||
        uni.includes(
          filtroUniversidad.toLowerCase()
        )) &&

      (!busqueda ||
        tit.includes(busqueda.toLowerCase()))
    );
  });

  return (

    <div className="mx-auto max-w-7xl px-4 py-10 text-white">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

        <div>

          <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-xs text-cyan-300">
            📚 Biblioteca Académica
          </span>

          <h1 className="mt-4 text-4xl font-bold">
            Recursos compartidos
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Explora documentos, videos y material
            académico compartido por la comunidad.
          </p>

        </div>

        {token && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="
              rounded-2xl
              bg-cyan-500/20
              px-5
              py-3
              text-cyan-300
              transition
              hover:bg-cyan-500/30
            "
          >
            + Subir recurso
          </button>
        )}

      </div>

      {/* TOOLBAR */}
      <div
        className="
          mb-8
          grid
          grid-cols-1
          gap-3
          rounded-3xl
          border border-white/10
          bg-white/5
          p-4
          backdrop-blur-xl
          md:grid-cols-5
        "
      >

        {/* BUSQUEDA */}
        <input
          placeholder="🔎 Buscar recursos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="
            rounded-2xl
            border border-white/10
            bg-black/20
            px-4
            py-3
            text-white
            outline-none
          "
        />

        {/* TIPO */}
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="
            rounded-2xl
            border border-white/10
            bg-black/20
            px-4
            py-3
            text-white
            outline-none
          "
        >

          <option className="text-black" value="">
            Todos los tipos
          </option>

          <option className="text-black" value="pdf">
            PDF
          </option>

          <option className="text-black" value="imagen">
            Imagen
          </option>

          <option className="text-black" value="video">
            Video
          </option>

        </select>

        {/* CATEGORIA */}
        <select
          value={filtroCategoria}
          onChange={(e) =>
            setFiltroCategoria(e.target.value)
          }
          className="
            rounded-2xl
            border border-white/10
            bg-black/20
            px-4
            py-3
            text-white
            outline-none
          "
        >

          <option className="text-black" value="">
            Todas las categorías
          </option>

          <option
            className="text-black"
            value="Inteligencia Artificial y Educación"
          >
            Inteligencia Artificial y Educación
          </option>

          <option
            className="text-black"
            value="Investigación e Innovación en IA"
          >
            Investigación e Innovación en IA
          </option>

          <option
            className="text-black"
            value="Ética, Derechos Digitales y Políticas Públicas"
          >
            Ética, Derechos Digitales y Políticas Públicas
          </option>

          <option
            className="text-black"
            value="Industria 4.0 y Automatización Inteligente"
          >
            Industria 4.0 y Automatización Inteligente
          </option>

          <option
            className="text-black"
            value="Ciudades Inteligentes y Desarrollo Tecnológico"
          >
            Ciudades Inteligentes y Desarrollo Tecnológico
          </option>

          <option
            className="text-black"
            value="Plataformas Digitales y Computación en la Nube"
          >
            Plataformas Digitales y Computación en la Nube
          </option>

          <option
            className="text-black"
            value="Educación Digital y Aprendizaje Adaptativo"
          >
            Educación Digital y Aprendizaje Adaptativo
          </option>

          <option
            className="text-black"
            value="Robótica e IA Aplicada"
          >
            Robótica e IA Aplicada
          </option>

          <option
            className="text-black"
            value="Cooperación Internacional y Universidades"
          >
            Cooperación Internacional y Universidades
          </option>

        </select>

        {/* LIMPIAR */}
        <button
          onClick={() => {

            setFiltroTipo('');
            setFiltroCategoria('');
            setFiltroUniversidad('');
            setBusqueda('');

          }}
          className="
            rounded-2xl
            bg-red-500/20
            px-4
            py-3
            text-red-300
            transition
            hover:bg-red-500/30
          "
        >
          Limpiar filtros
        </button>

      </div>

      {/* LISTA */}
      {loading ? (

        <p className="text-white/70">
          Cargando recursos...
        </p>

      ) : (

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {recursosFiltrados.map((r) => (

            <div
              key={r.id}
              onClick={() => setSelectedRecurso(r)}
              className="
                group
                cursor-pointer
                rounded-3xl
                border border-white/10
                bg-white/5
                p-4
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-400/30
                hover:bg-white/10
                hover:shadow-2xl
              "
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-3">

                <div className="flex-1">

                  <div className="flex flex-wrap gap-2">

                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-[11px] text-cyan-300">
                      📄 {r.tipo}
                    </span>

                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-[11px] text-violet-300 line-clamp-1">
                      🏷 {r.categoria}
                    </span>

                  </div>

                  <h2
                    className="
                      mt-4
                      line-clamp-2
                      text-lg
                      font-bold
                      text-white
                      transition
                      group-hover:text-cyan-200
                    "
                  >
                    {r.titulo}
                  </h2>

                </div>

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border border-cyan-500/20
                    bg-cyan-500/10
                    text-xl
                  "
                >
                  📚
                </div>

              </div>

              {/* DESC */}
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/65">
                {r.descripcion}
              </p>

              {/* INFO */}
              <div className="mt-4 space-y-2">

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">

                  <span className="text-xs text-white/50">
                    👤 Autor
                  </span>

                  <span className="max-w-[150px] truncate text-sm font-medium text-white">
                    {r.autor || 'Comunidad'}
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">

                  <span className="text-xs text-white/50">
                    🏫 Universidad
                  </span>

                  <span className="max-w-[150px] truncate text-sm font-medium text-white">
                    {r.universidad || 'No disponible'}
                  </span>

                </div>

              </div>

              {/* FOOTER */}
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">

                <div>

                  <p className="text-sm font-medium text-white">
                    Recurso académico
                  </p>

                  <p className="text-xs text-white/50">
                    {new Date(
                      r.fecha_subida
                    ).toLocaleDateString()}
                  </p>

                </div>

                <button
                  onClick={(e) => {

                    e.stopPropagation();

                    setSelectedRecurso(r);

                  }}
                  className="
                    rounded-xl
                    bg-cyan-500/20
                    px-4
                    py-2
                    text-sm
                    text-cyan-300
                    transition
                    hover:bg-cyan-500/30
                  "
                >
                  Ver más
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MODAL CREAR */}
      {showCreateModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

            <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[#0b1120] shadow-[0_20px_80px_rgba(0,0,0,0.6)]">

              {/* HEADER */}
              <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-6">

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute right-5 top-5 rounded-xl bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white"
                >
                  ✕
                </button>

                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
                  📚 Nuevo recurso
                </span>

                <h2 className="mt-4 text-3xl font-bold text-white">
                  Subir recurso académico
                </h2>

                <p className="mt-2 text-sm text-white/60">
                  Comparte contenido educativo con la comunidad
                </p>

              </div>

              {/* BODY */}
              <div className="p-6">

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                  <input
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Título"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                  />

                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción"
                    rows="4"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                  />

                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white"
                  >
                    <option value="">Tipo</option>
                    <option className="text-black" value="pdf">PDF</option>
                    <option className="text-black" value="imagen">Imagen</option>
                    <option className="text-black" value="video">Video</option>
                  </select>

                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white"
                  >
                    <option value="">Seleccione una categoría</option>

                    <option className="text-black" value="Inteligencia Artificial y Educación">
                      Inteligencia Artificial y Educación
                    </option>

                    <option className="text-black" value="Investigación e Innovación en IA">
                      Investigación e Innovación en IA
                    </option>

                    <option className="text-black" value="Ética, Derechos Digitales y Políticas Públicas">
                      Ética, Derechos Digitales y Políticas Públicas
                    </option>

                    <option className="text-black" value="Industria 4.0 y Automatización Inteligente">
                      Industria 4.0 y Automatización Inteligente
                    </option>

                    <option className="text-black" value="Ciudades Inteligentes y Desarrollo Tecnológico">
                      Ciudades Inteligentes y Desarrollo Tecnológico
                    </option>

                    <option className="text-black" value="Plataformas Digitales y Computación en la Nube">
                      Plataformas Digitales y Computación en la Nube
                    </option>

                    <option className="text-black" value="Educación Digital y Aprendizaje Adaptativo">
                      Educación Digital y Aprendizaje Adaptativo
                    </option>

                    <option className="text-black" value="Robótica e IA Aplicada">
                      Robótica e IA Aplicada
                    </option>

                    <option className="text-black" value="Cooperación Internacional y Universidades">
                      Cooperación Internacional y Universidades
                    </option>

                  </select>

                  <input
                    type="file"
                    onChange={(e) => setArchivo(e.target.files[0])}
                    className="
                w-full
                rounded-2xl
                border border-white/10
                bg-white/5
                px-4 py-3
                text-white
                file:mr-4
                file:rounded-xl
                file:border-0
                file:bg-cyan-500/20
                file:px-4
                file:py-2
                file:text-cyan-300
              "
                  />

                  <div className="flex justify-end gap-3 pt-2">

                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="rounded-2xl border border-white/10 px-5 py-3 text-white/70 hover:bg-white/5"
                    >
                      Cancelar
                    </button>

                    <button
                      className="rounded-2xl bg-cyan-500/20 px-5 py-3 text-cyan-300 hover:bg-cyan-500/30"
                    >
                      Guardar recurso
                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>,
          document.body
        )}

      {/* MODAL DETALLE */}
      {selectedRecurso &&
        createPortal(

          <div
            className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/70
        backdrop-blur-sm
        p-4
      "
            onClick={() => setSelectedRecurso(null)}
          >

            {/* MODAL */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto

          rounded-[32px]
          border border-white/10
          bg-[#0b1120]
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        "
            >

              {/* HEADER */}
              <div
                className="
            relative
            overflow-hidden
            border-b border-white/10
            bg-gradient-to-r
            from-cyan-500/10
            via-blue-500/10
            to-violet-500/10
            p-6
          "
              >

                <button
                  onClick={() => setSelectedRecurso(null)}
                  className="
              absolute
              right-5
              top-5
              rounded-xl
              bg-white/10
              p-2
              text-white/70
              hover:bg-white/20
              hover:text-white
            "
                >
                  ✕
                </button>

                <div className="flex flex-wrap gap-2">

                  <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-xs text-cyan-300">
                    📄 {selectedRecurso.tipo}
                  </span>

                  <span className="rounded-full bg-violet-500/20 px-4 py-2 text-xs text-violet-300">
                    🏷 {selectedRecurso.categoria}
                  </span>

                </div>

                <h2 className="mt-5 text-3xl font-bold text-white">
                  {selectedRecurso.titulo}
                </h2>

                <p className="mt-2 text-sm text-white/60">
                  Recurso compartido por la comunidad académica
                </p>

              </div>

              {/* BODY */}
              <div className="space-y-6 p-6">

                {/* DESCRIPCIÓN */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Descripción
                  </h3>

                  <p className="leading-relaxed text-white/70">
                    {selectedRecurso.descripcion}
                  </p>

                </div>

                {/* INFO */}
                <div className="grid gap-4 md:grid-cols-2">

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                    <p className="text-sm text-white/50">
                      Autor
                    </p>

                    <h4 className="mt-3 text-lg font-semibold text-white break-words">
                      👤 {selectedRecurso.autor || 'Comunidad'}
                    </h4>

                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                    <p className="text-sm text-white/50">
                      Universidad
                    </p>

                    <h4 className="mt-3 text-lg font-semibold text-white break-words">
                      🏫 {selectedRecurso.universidad || 'No disponible'}
                    </h4>

                  </div>

                  <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-5">

                    <p className="text-sm text-white/50">
                      Fecha de publicación
                    </p>

                    <h4 className="mt-3 text-lg font-semibold text-white">
                      📅 {new Date(selectedRecurso.fecha_subida).toLocaleDateString()}
                    </h4>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6">

                  <button
                    onClick={() => setSelectedRecurso(null)}
                    className="
                rounded-2xl
                border border-white/10
                px-5
                py-3
                text-white/70
                hover:bg-white/5
              "
                  >
                    Cerrar
                  </button>

                  <button
                    onClick={() => setShowPreview(true)}
                    className="
                rounded-2xl
                bg-cyan-500/20
                px-5
                py-3
                text-cyan-300
                hover:bg-cyan-500/30
              "
                  >
                    👁 Previsualizar
                  </button>

                </div>

              </div>

            </div>

          </div>,

          document.body
        )}

      {/* PREVIEW */}
      {selectedRecurso && showPreview &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm">

            <div className="flex h-full w-full flex-col p-6">

              {/* HEADER */}
              <div className="mb-4 flex items-center justify-between text-white">

                <h2 className="text-lg font-semibold">
                  {selectedRecurso.titulo}
                </h2>

                <button
                  onClick={() => setShowPreview(false)}
                  className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20"
                >
                  ✕
                </button>

              </div>

              {/* CONTENT */}
              <div className="flex flex-1 items-center justify-center">

                <ResourcePreview
                  recurso={selectedRecurso}
                />

              </div>

            </div>

          </div>,
          document.body
        )
      }

    </div>
  );
};

export default Resources;