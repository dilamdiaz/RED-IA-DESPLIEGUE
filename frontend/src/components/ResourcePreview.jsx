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

  // 📄 PDF
  // 📄 PDF (FIX REAL)
  if (tipo.includes('pdf') || extension === 'pdf') {
    console.log('📄 Renderizando PDF DIRECTO');

    return (
      <iframe
        src={url}
        className="w-full h-full rounded-xl border border-white/20 bg-white"
        title="pdf-preview"
        onLoad={() => console.log('✅ PDF cargado')}
        onError={() => console.log('❌ Error PDF')}
      />
    );
  }

  // 🖼️ Imagen
  if (
    tipo.includes('imagen') ||
    tipo.includes('image') ||
    ['jpg', 'jpeg', 'png'].includes(extension)
  ) {
    console.log('🖼️ Renderizando imagen');

    return (
      <img
        src={url}
        alt={recurso.titulo}
        className="max-h-full max-w-full object-contain rounded-xl"
        onLoad={() => console.log('✅ Imagen cargada')}
        onError={() => console.log('❌ Error imagen')}
      />
    );
  }

  // 🎥 Video
  if (
    tipo.includes('video') ||
    ['mp4', 'webm'].includes(extension)
  ) {
    console.log('🎥 Renderizando video');

    return (
      <video
        src={url}
        controls
        className="max-h-full max-w-full rounded-xl"
        onLoadedData={() => console.log('✅ Video cargado')}
        onError={() => console.log('❌ Error video')}
      />
    );
  }

  // 📎 fallback mejorado
  console.log('⚠️ Tipo no reconocido');

  return (
    <div className="text-center text-white">
      <p className="mb-2">Vista previa no disponible</p>
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