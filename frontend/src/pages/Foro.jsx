import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPortal } from 'react-dom';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const obtenerBandera = (codigoPais) => {
    if (!codigoPais) return '🌎';

    const codigo = codigoPais.toUpperCase();

    const primeraLetra = 127462 + codigo.charCodeAt(0) - 65;
    const segundaLetra = 127462 + codigo.charCodeAt(1) - 65;

    return String.fromCodePoint(primeraLetra, segundaLetra);
};

const construirArbolComentarios = (comentarios) => {
    const mapa = {};
    const raiz = [];

    comentarios.forEach(c => {
        mapa[c.id] = { ...c, respuestas: [] };
    });

    comentarios.forEach(c => {
        if (c.parent_id) {
            if (mapa[c.parent_id]) {
                mapa[c.parent_id].respuestas.push(mapa[c.id]);
            }
        } else {
            raiz.push(mapa[c.id]);
        }
    });

    return raiz;
};

const ComentarioItem = ({
    comentario,
    onResponder,
    nivel = 0,
}) => {

    const [showReply, setShowReply] = useState(false);
    const [reply, setReply] = useState('');
    const [showReplies, setShowReplies] = useState(true);

    return (

        <div
            className="relative"
            style={{
                marginLeft: nivel > 0 ? 28 : 0,
            }}
        >

            {/* LÍNEA RESPUESTAS */}
            {nivel > 0 && (
                <div
                    className="
            absolute
            -left-4
            top-0
            h-full
            w-px
            bg-white/10
          "
                />
            )}

            {/* CARD */}
            <div
                className="
          group
          rounded-[26px]
          border border-white/10
          bg-white/[0.04]
          p-5
          backdrop-blur-xl
          transition-all
          duration-300
          hover:border-cyan-400/30
          hover:bg-white/[0.06]
        "
            >

                {/* TOP */}
                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-4">

                        {/* AVATAR */}
                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-cyan-500/20
                to-blue-500/20
                text-lg
              "
                        >
                            👤
                        </div>

                        <div>

                            <h4 className="font-semibold text-white">
                                {comentario.autor || 'Usuario'}
                            </h4>

                            <div className="mt-2 flex flex-wrap gap-2">

                                {comentario.universidad && (
                                    <span
                                        className="
                      rounded-full
                      bg-blue-500/20
                      px-3
                      py-1
                      text-[11px]
                      text-blue-300
                    "
                                    >
                                        🏫 {comentario.universidad}
                                    </span>
                                )}

                                {comentario.pais && (
                                    <span
                                        className="
                      rounded-full
                      bg-green-500/20
                      px-3
                      py-1
                      text-[11px]
                      text-green-300
                    "
                                    >
                                        {obtenerBandera(comentario.codigo_pais)} {comentario.pais}
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* FECHA */}
                    <span className="text-xs text-white/40 whitespace-nowrap">
                        {new Date(comentario.fecha).toLocaleDateString()}
                    </span>

                </div>

                {/* CONTENIDO */}
                <div className="mt-5">

                    <p className="leading-relaxed text-white/75">
                        {comentario.contenido}
                    </p>

                </div>

                {/* ACTIONS */}
                <div className="mt-5 flex items-center gap-5">

                    <button
                        onClick={() => setShowReply(!showReply)}
                        className="
              text-sm
              text-cyan-300
              transition
              hover:text-cyan-200
            "
                    >
                        💬 Responder
                    </button>

                    {Array.isArray(comentario.respuestas) &&
                        comentario.respuestas.length > 0 && (

                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="
                  text-sm
                  text-green-300
                  transition
                  hover:text-green-200
                "
                            >
                                {showReplies
                                    ? `🔽 Ocultar respuestas (${comentario.respuestas.length})`
                                    : `▶ Ver respuestas (${comentario.respuestas.length})`}
                            </button>
                        )}

                </div>

                {/* RESPONDER */}
                {showReply && (

                    <div
                        className="
              mt-5
              rounded-2xl
              border border-white/10
              bg-black/20
              p-4
            "
                    >

                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Escribe una respuesta..."
                            rows="3"
                            className="
                w-full
                resize-none
                rounded-2xl
                border border-white/10
                bg-white/5
                px-4
                py-3
                text-white
                outline-none
              "
                        />

                        <div className="mt-4 flex justify-end gap-3">

                            <button
                                onClick={() => setShowReply(false)}
                                className="
                  rounded-xl
                  border border-white/10
                  px-4
                  py-2
                  text-sm
                  text-white/60
                "
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={() => {
                                    onResponder(reply, comentario.id);
                                    setReply('');
                                    setShowReply(false);
                                }}
                                className="
                  rounded-xl
                  bg-cyan-500/20
                  px-4
                  py-2
                  text-sm
                  text-cyan-300
                  hover:bg-cyan-500/30
                "
                            >
                                Enviar respuesta
                            </button>

                        </div>

                    </div>
                )}

            </div>

            {/* RESPUESTAS */}
            {showReplies &&
                Array.isArray(comentario.respuestas) &&
                comentario.respuestas.length > 0 && (

                    <div className="mt-4 space-y-4">

                        {comentario.respuestas.map((r) => (
                            <ComentarioItem
                                key={r.id}
                                comentario={r}
                                onResponder={onResponder}
                                nivel={nivel + 1}
                            />
                        ))}

                    </div>
                )}

        </div>
    );
};


const Foro = () => {
    const { token } = useAuth();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filtroPais, setFiltroPais] = useState('');
    const [filtroUniversidad, setFiltroUniversidad] = useState('');
    const [paises, setPaises] = useState([]);
    const [universidades, setUniversidades] = useState([]);

    useEffect(() => {
        setFiltroUniversidad('');
    }, [filtroPais]);


    // 🔄 Cargar posts
    const obtenerPosts = async () => {
        try {
            const res = await fetch(
                `${API_URL}/foro/posts?id_pais=${filtroPais}&id_universidad=${filtroUniversidad}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error('Error al obtener posts');

            const data = await res.json();
            setPosts(Array.isArray(data.data) ? data.data : []);

        } catch (err) {
            console.error(err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const obtenerPaises = async () => {
        try {
            const res = await fetch(`${API_URL}/foro/paises`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setPaises(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const obtenerUniversidades = async () => {
        try {
            const res = await fetch(`${API_URL}/foro/universidades`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setUniversidades(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) {
            obtenerPosts();
            obtenerPaises();
            obtenerUniversidades();
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            obtenerPosts();
        }
    }, [filtroPais, filtroUniversidad]);

    // ➕ Crear post
    const handleCrearPost = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!titulo || !contenido) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/foro/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ titulo, contenido }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Error al crear post');
            }

            setSuccess('Publicación creada ✅');
            setTitulo('');
            setContenido('');

            await obtenerPosts();

            setTimeout(() => {
                setShowCreateModal(false);
                setSuccess('');
            }, 800);

        } catch (err) {
            setError(err.message);
        }
    };

    // 🔍 Abrir detalle
    const abrirPost = async (post) => {
        setSelectedPost(post);

        try {
            const res = await fetch(`${API_URL}/foro/posts/${post.id}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            console.log("COMENTARIOS RAW:", data);

            const lista = Array.isArray(data.data) ? data.data : [];

            setComentarios(construirArbolComentarios(lista));

        } catch (err) {
            console.error(err);
            setComentarios([]);
        }
    };

    // 💬 Crear comentario
    const handleComentario = async (contenido, parent_id = null) => {
        if (!contenido) return;

        try {
            await fetch(`${API_URL}/foro/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    contenido,
                    id_foro: selectedPost.id,
                    parent_id,
                }),
            });

            setNuevoComentario('');

            // 🔥 1. Recargar comentarios del post abierto
            await abrirPost(selectedPost);

            // 🔥 2. Refrescar posts para actualizar contador
            await obtenerPosts();

        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="mx-auto max-w-6xl px-4 py-10">

            <h1 className="mb-6 text-3xl font-semibold text-white">
                Foro Académico
            </h1>
            {/* FILTROS */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">

                {/* PAÍS */}
                <select
                    value={filtroPais}
                    onChange={(e) => setFiltroPais(e.target.value)}
                    className="p-2 bg-white/10 border border-white/10 rounded-xl text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option className="text-black" value="">
                        🌎 Todos los países
                    </option>

                    {paises.map((p) => (
                        <option
                            className="text-black"
                            key={p.id}
                            value={p.id}
                        >
                            {p.nombre}
                        </option>
                    ))}
                </select>

                {/* UNIVERSIDAD */}
                <select
                    value={filtroUniversidad}
                    onChange={(e) => setFiltroUniversidad(e.target.value)}
                    className="p-2 bg-white/10 border border-white/10 rounded-xl text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option className="text-black" value="">
                        🏫 Todas las universidades
                    </option>

                    {universidades
                        .filter((u) => {
                            if (!filtroPais) return true;
                            return Number(u.id_pais) === Number(filtroPais);
                        })
                        .map((u) => (
                            <option
                                className="text-black"
                                key={u.id}
                                value={u.id}
                            >
                                {u.nombre}
                            </option>
                        ))}
                </select>

                {/* BOTÓN LIMPIAR */}
                <button
                    onClick={() => {
                        setFiltroPais('');
                        setFiltroUniversidad('');
                    }}
                    className="bg-red-500/20 border border-red-400/20 text-red-200 px-4 py-2 rounded-xl hover:bg-red-500/30 transition"
                >
                    Limpiar filtros
                </button>

            </div>

            {/* BOTÓN CREAR */}
            {token && (
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="mb-6 bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition"
                >
                    + Crear publicación
                </button>
            )}

            {/* LISTADO */}
            {loading ? (
                <p className="text-white/70">
                    Cargando publicaciones...
                </p>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {posts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => abrirPost(post)}
                            className="
          group
          cursor-pointer
          rounded-3xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          p-5
          transition-all
          duration-300
          hover:scale-[1.01]
          hover:border-cyan-400/40
          hover:bg-white/10
          hover:shadow-2xl
        "
                        >

                            {/* TOP */}
                            <div className="flex items-start justify-between gap-3">

                                <div className="flex-1">

                                    <div className="flex flex-wrap gap-2">

                                        {post.universidad && (
                                            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                                                🏫 {post.universidad}
                                            </span>
                                        )}

                                        {post.pais && (
                                            <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
                                                {obtenerBandera(post.codigo_pais)} {post.pais}
                                            </span>
                                        )}

                                    </div>

                                    <h2
                                        className="
                mt-4
                line-clamp-2
                text-xl
                font-bold
                text-white
                transition
                group-hover:text-cyan-200
              "
                                    >
                                        {post.titulo}
                                    </h2>

                                </div>

                                {/* ICON */}
                                <div
                                    className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border border-cyan-500/20
              bg-cyan-500/10
              text-2xl
            "
                                >
                                    💬
                                </div>

                            </div>

                            {/* CONTENIDO */}
                            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-white/70">
                                {post.contenido}
                            </p>

                            {/* INFO */}
                            <div className="mt-5 grid grid-cols-2 gap-3">

                                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">

                                    <p className="text-xs text-white/50">
                                        Autor
                                    </p>

                                    <h4 className="mt-1 line-clamp-1 text-sm font-semibold text-white">
                                        👤 {post.autor || 'Usuario'}
                                    </h4>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">

                                    <p className="text-xs text-white/50">
                                        Comentarios
                                    </p>

                                    <h4 className="mt-1 text-sm font-semibold text-white">
                                        💬 {post.total_comentarios || 0}
                                    </h4>

                                </div>

                            </div>

                            {/* FOOTER */}
                            <div
                                className="
            mt-5
            flex
            items-center
            justify-between
            border-t border-white/10
            pt-4
          "
                            >

                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Debate académico
                                    </p>

                                    <p className="text-xs text-white/50">
                                        {new Date(post.fecha).toLocaleDateString()}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        abrirPost(post);
                                    }}
                                    className="
              rounded-xl
              bg-cyan-500/20
              px-4
              py-2
              text-sm
              font-medium
              text-cyan-300
              transition
              hover:bg-cyan-500/30
            "
                                >
                                    Ver debate
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}

            {/* MODAL CREAR */}
            {showCreateModal &&
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
                        onClick={() => setShowCreateModal(false)}
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
            from-cyan-500/20
            via-blue-500/10
            to-violet-500/20

            p-8
          "
                            >

                                {/* CLOSE */}
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="
              absolute
              right-5
              top-5

              rounded-xl
              bg-white/10
              p-2

              text-white/70
              transition
              hover:bg-white/20
              hover:text-white
            "
                                >
                                    ✕
                                </button>

                                {/* BADGE */}
                                <span
                                    className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-cyan-500/20
              px-4
              py-2
              text-xs
              font-medium
              text-cyan-300
            "
                                >
                                    💬 Nueva publicación
                                </span>

                                {/* TITLE */}
                                <h2 className="mt-5 text-3xl font-bold text-white">
                                    Crear debate académico
                                </h2>

                                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
                                    Comparte ideas, investigaciones, preguntas o temas de discusión
                                    con la comunidad académica.
                                </p>

                            </div>

                            {/* BODY */}
                            <div className="p-8">

                                {/* ALERTAS */}
                                {error && (
                                    <div
                                        className="
                mb-5
                rounded-2xl
                border border-red-500/20
                bg-red-500/10
                p-4
                text-sm
                text-red-300
              "
                                    >
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div
                                        className="
                mb-5
                rounded-2xl
                border border-green-500/20
                bg-green-500/10
                p-4
                text-sm
                text-green-300
              "
                                    >
                                        {success}
                                    </div>
                                )}

                                {/* FORM */}
                                <form
                                    onSubmit={handleCrearPost}
                                    className="space-y-6"
                                >

                                    {/* TITULO */}
                                    <div>

                                        <label className="mb-2 block text-sm text-white/70">
                                            Título del debate
                                        </label>

                                        <input
                                            value={titulo}
                                            onChange={(e) => setTitulo(e.target.value)}
                                            placeholder="Ej: ¿Cómo está impactando la IA en la educación?"
                                            className="
                  w-full
                  rounded-2xl
                  border border-white/10
                  bg-white/5

                  px-5
                  py-4

                  text-white
                  placeholder:text-white/30

                  outline-none
                  transition

                  focus:border-cyan-400/40
                  focus:bg-white/[0.07]
                "
                                        />

                                    </div>

                                    {/* CONTENIDO */}
                                    <div>

                                        <div className="mb-2 flex items-center justify-between">

                                            <label className="text-sm text-white/70">
                                                Contenido
                                            </label>

                                            <span className="text-xs text-white/30">
                                                {contenido.length} caracteres
                                            </span>

                                        </div>

                                        <textarea
                                            value={contenido}
                                            onChange={(e) => setContenido(e.target.value)}
                                            placeholder="Describe tu tema, comparte información o inicia una discusión..."
                                            rows="7"
                                            className="
                  w-full
                  resize-none

                  rounded-2xl
                  border border-white/10
                  bg-white/5

                  px-5
                  py-4

                  text-white
                  placeholder:text-white/30

                  outline-none
                  transition

                  focus:border-cyan-400/40
                  focus:bg-white/[0.07]
                "
                                        />

                                    </div>

                                    {/* FOOTER */}
                                    <div
                                        className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
                border-t border-white/10
                pt-6
              "
                                    >

                                        <p className="text-xs text-white/40">
                                            Mantén el respeto y aporta valor a la conversación.
                                        </p>

                                        <div className="flex gap-3">

                                            <button
                                                type="button"
                                                onClick={() => setShowCreateModal(false)}
                                                className="
                    rounded-2xl
                    border border-white/10

                    px-5
                    py-3

                    text-white/70
                    transition

                    hover:bg-white/5
                  "
                                            >
                                                Cancelar
                                            </button>

                                            <button
                                                className="
                    rounded-2xl
                    bg-cyan-500/20

                    px-6
                    py-3

                    font-medium
                    text-cyan-300
                    transition

                    hover:scale-[1.02]
                    hover:bg-cyan-500/30
                  "
                                            >
                                                🚀 Publicar debate
                                            </button>

                                        </div>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>,

                    document.body
                )
            }
            {/* MODAL DETALLE */}
            {/* MODAL DETALLE */}
            {selectedPost && (
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
                >

                    <div
                        className="
        w-full
        max-w-5xl
        max-h-[92vh]
        overflow-y-auto
        rounded-[34px]
        border border-white/10
        bg-[#0b1120]
        shadow-[0_20px_80px_rgba(0,0,0,0.65)]
      "
                    >

                        {/* ================= HEADER ================= */}
                        <div
                            className="
          relative
          overflow-hidden
          border-b border-white/10
          bg-gradient-to-r
          from-cyan-500/15
          via-blue-500/10
          to-violet-500/15
          p-8
        "
                        >

                            {/* CLOSE */}
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="
            absolute
            right-5
            top-5
            rounded-2xl
            bg-white/10
            p-3
            text-white/70
            transition
            hover:bg-white/20
            hover:text-white
          "
                            >
                                ✕
                            </button>

                            {/* BADGES */}
                            <div className="flex flex-wrap gap-2">

                                {selectedPost.universidad && (
                                    <span
                                        className="
                rounded-full
                bg-blue-500/20
                px-4
                py-2
                text-xs
                text-blue-300
              "
                                    >
                                        🏫 {selectedPost.universidad}
                                    </span>
                                )}

                                {selectedPost.pais && (
                                    <span
                                        className="
                rounded-full
                bg-green-500/20
                px-4
                py-2
                text-xs
                text-green-300
              "
                                    >
                                        {obtenerBandera(selectedPost.codigo_pais)} {selectedPost.pais}
                                    </span>
                                )}

                            </div>

                            {/* TITLE */}
                            <h2 className="mt-6 text-4xl font-bold leading-tight text-white">
                                {selectedPost.titulo}
                            </h2>

                            {/* META */}
                            <div className="mt-5 flex flex-wrap gap-5 text-sm text-white/55">

                                <span>
                                    👤 {selectedPost.autor}
                                </span>

                                <span>
                                    💬 {selectedPost.total_comentarios || 0} comentarios
                                </span>

                                <span>
                                    📅 {new Date(selectedPost.fecha).toLocaleDateString()}
                                </span>

                            </div>

                        </div>

                        {/* ================= BODY ================= */}
                        <div className="p-8">

                            {/* PUBLICACIÓN */}
                            <div
                                className="
            rounded-[30px]
            border border-white/10
            bg-white/[0.04]
            p-7
            backdrop-blur-xl
          "
                            >

                                <div className="mb-5 flex items-center gap-3">

                                    <div
                                        className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-cyan-500/20
                text-xl
              "
                                    >
                                        📄
                                    </div>

                                    <div>

                                        <p className="text-sm text-cyan-300">
                                            Publicación académica
                                        </p>

                                        <h3 className="text-lg font-semibold text-white">
                                            Debate principal
                                        </h3>

                                    </div>

                                </div>

                                <p className="whitespace-pre-line leading-relaxed text-white/75">
                                    {selectedPost.contenido}
                                </p>

                            </div>

                            {/* ================= COMMENTS ================= */}
                            <div className="mt-10">

                                {/* TOP */}
                                <div className="mb-6 flex items-center justify-between">

                                    <div>

                                        <h3 className="text-2xl font-bold text-white">
                                            Comentarios
                                        </h3>

                                        <p className="mt-1 text-sm text-white/45">
                                            Participa en la conversación
                                        </p>

                                    </div>

                                    <div
                                        className="
                rounded-2xl
                border border-white/10
                bg-white/5
                px-4
                py-2
                text-sm
                text-white/70
              "
                                    >
                                        💬 {comentarios.length} hilos
                                    </div>

                                </div>

                                {/* NUEVO COMENTARIO */}
                                <div
                                    className="
              rounded-[30px]
              border border-white/10
              bg-gradient-to-br
              from-cyan-500/10
              via-blue-500/5
              to-violet-500/10
              p-5
            "
                                >

                                    <div className="flex gap-4">

                                        {/* AVATAR */}
                                        <div
                                            className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-500/20
                  text-xl
                "
                                        >
                                            👤
                                        </div>

                                        {/* INPUT */}
                                        <div className="flex-1">

                                            <textarea
                                                value={nuevoComentario}
                                                onChange={(e) =>
                                                    setNuevoComentario(e.target.value)
                                                }
                                                placeholder="Comparte tu opinión sobre este tema..."
                                                rows="4"
                                                className="
                    w-full
                    resize-none
                    rounded-2xl
                    border border-white/10
                    bg-black/20
                    px-5
                    py-4
                    text-white
                    placeholder:text-white/30
                    outline-none
                    transition
                    focus:border-cyan-400/40
                  "
                                            />

                                            <div className="mt-4 flex items-center justify-between">

                                                <p className="text-xs text-white/40">
                                                    Aporta valor a la discusión académica.
                                                </p>

                                                <button
                                                    onClick={() =>
                                                        handleComentario(
                                                            nuevoComentario,
                                                            null
                                                        )
                                                    }
                                                    className="
                      rounded-2xl
                      bg-cyan-500/20
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-cyan-300
                      transition
                      hover:scale-[1.02]
                      hover:bg-cyan-500/30
                    "
                                                >
                                                    🚀 Publicar comentario
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* LISTADO */}
                                <div className="mt-8 space-y-5">

                                    {Array.isArray(comentarios) &&
                                        comentarios.length > 0 ? (

                                        comentarios.map((c) => (
                                            <ComentarioItem
                                                key={c.id}
                                                comentario={c}
                                                onResponder={(contenido, parent_id) =>
                                                    handleComentario(
                                                        contenido,
                                                        parent_id
                                                    )
                                                }
                                            />
                                        ))

                                    ) : (

                                        <div
                                            className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-[30px]
                  border border-dashed border-white/10
                  bg-white/[0.03]
                  px-6
                  py-14
                  text-center
                "
                                        >

                                            <div className="text-5xl">
                                                💬
                                            </div>

                                            <h4 className="mt-5 text-xl font-semibold text-white">
                                                Aún no hay comentarios
                                            </h4>

                                            <p className="mt-2 max-w-md text-sm text-white/45">
                                                Sé la primera persona en participar en este
                                                debate académico.
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Foro;