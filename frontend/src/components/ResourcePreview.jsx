// ResourcePreview.jsx

const ResourcePreview = ({ recurso }) => {

  if (!recurso) return null;

  const url = recurso.archivo_url || '';

  const tipo = (recurso.tipo || '')
    .toLowerCase()
    .trim();

  const extension = url
    .split('.')
    .pop()
    ?.toLowerCase();

  if (!url) return null;

  console.log('🧪 PREVIEW DEBUG');
  console.log('📁 Recurso:', recurso);
  console.log('🔗 URL:', url);
  console.log('📌 Tipo original:', recurso.tipo);
  console.log('✅ Tipo normalizado:', tipo);
  console.log('📎 Extensión:', extension);

  // =========================
  // 📄 PDF
  // =========================
  // =========================
  // 📄 PDF
  // =========================
  if (tipo.includes('pdf') || extension === 'pdf') {

    console.log('📄 PDF detectado');

    return (

      <div className="flex flex-col items-center justify-center gap-5 text-white">

        <div
          className="
          flex
          h-28
          w-28
          items-center
          justify-center
          rounded-3xl
          border
          border-red-500/20
          bg-red-500/10
          text-6xl
        "
        >
          📄
        </div>

        <div className="text-center">

          <h3 className="text-xl font-semibold">
            Documento PDF
          </h3>

          <p className="mt-2 text-sm text-white/60">
            Este archivo se abrirá en una nueva pestaña
          </p>

        </div>

        <button
          onClick={() => window.open(url, '_blank')}
          className="
          rounded-2xl
          bg-cyan-500/20
          px-6
          py-3
          text-cyan-300
          transition
          hover:bg-cyan-500/30
        "
        >
          📖 Abrir PDF
        </button>

      </div>
    );
  }
  // =========================
  // 🖼️ IMAGEN
  // =========================
  if (
    tipo.includes('imagen') ||
    tipo.includes('image') ||
    ['jpg', 'jpeg', 'png', 'webp'].includes(extension)
  ) {

    console.log('🖼️ Renderizando imagen');

    return (
      <img
        src={url}
        alt={recurso.titulo}
        className="
          max-h-full
          max-w-full
          rounded-xl
          object-contain
        "
        onLoad={() => console.log('✅ Imagen cargada')}
        onError={() => console.log('❌ Error imagen')}
      />
    );
  }

  // =========================
  // 🎥 VIDEO
  // =========================
  if (
    tipo.includes('video') ||
    ['mp4', 'webm', 'mov'].includes(extension)
  ) {

    console.log('🎥 Renderizando video');

    return (
      <video
        src={url}
        controls
        className="
          max-h-full
          max-w-full
          rounded-xl
        "
        onLoadedData={() => console.log('✅ Video cargado')}
        onError={() => console.log('❌ Error video')}
      />
    );
  }

  // =========================
  // 📎 FALLBACK
  // =========================
  console.log('⚠️ Tipo no reconocido');

  return (
    <div className="text-center text-white">

      <p className="mb-2">
        Vista previa no disponible
      </p>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-400 underline"
      >
        Abrir archivo
      </a>

    </div>
  );
};

export default ResourcePreview;