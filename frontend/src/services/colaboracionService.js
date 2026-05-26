// src/services/colaboracionService.js

const API_URL = 'https://red-ia-despliegue.onrender.com/api/colaboracion';

// =====================================================
// 🔥 HELPERS
// =====================================================
const request = async (url, options = {}) => {

    const res = await fetch(url, options);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.message || 'Error en la petición'
        );
    }

    return data;
};

const authHeaders = (token) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
});


// =====================================================
// 📚 MASTERCLASS
// =====================================================
export const obtenerMasterclass = (token) => {

    return request(`${API_URL}/masterclass`, {
        headers: authHeaders(token),
    });
};

export const crearMasterclass = (data, token) => {

    return request(`${API_URL}/masterclass`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
};

export const actualizarMasterclass = (
    id,
    data,
    token
) => {

    return request(`${API_URL}/masterclass/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
};

export const eliminarMasterclass = (
    id,
    token
) => {

    return request(`${API_URL}/masterclass/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
};


// =====================================================
// 🎓 MENTORÍAS
// =====================================================
export const obtenerMentorias = (token) => {

    return request(`${API_URL}/mentorias`, {
        headers: authHeaders(token),
    });
};

export const crearMentoria = (data, token) => {

    return request(`${API_URL}/mentorias`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
};

export const actualizarMentoria = (
    id,
    data,
    token
) => {

    return request(`${API_URL}/mentorias/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
};

export const eliminarMentoria = (
    id,
    token
) => {

    return request(`${API_URL}/mentorias/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
};


// =====================================================
// 🚀 PROYECTOS
// =====================================================
export const obtenerProyectos = (token) => {

    return request(`${API_URL}/proyectos`, {
        headers: authHeaders(token),
    });
};

export const crearProyecto = (data, token) => {

    return request(`${API_URL}/proyectos`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
};

export const actualizarProyecto = (
    id,
    data,
    token
) => {

    return request(`${API_URL}/proyectos/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
};

export const eliminarProyecto = (
    id,
    token
) => {

    return request(`${API_URL}/proyectos/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
};

export const cambiarEstadoProyecto = (
    id,
    estado,
    token
) => {

    return request(`${API_URL}/proyectos/${id}/estado`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ estado }),
    });
};


// =====================================================
// 📝 INSCRIPCIONES
// =====================================================

// ✅ INSCRIBIRSE
export const inscribirse = (
    tipo,
    id_referencia,
    token
) => {

    return request(`${API_URL}/inscribirse`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({
            tipo,
            id_referencia,
        }),
    });
};


// =====================================================
// 👥 OBTENER INSCRITOS
// =====================================================
export const obtenerInscritos = async (
    tipo,
    id,
    token
) => {

    return request(
        `${API_URL}/inscritos/${tipo}/${id}`,
        {
            headers: authHeaders(token),
        }
    );
};


// =====================================================
// ❌ ABANDONAR INSCRIPCIÓN
// =====================================================
export const abandonarInscripcion = async (
    tipo,
    id,
    token
) => {

    return request(
        `${API_URL}/abandonar/${tipo}/${id}`,
        {
            method: 'DELETE',
            headers: authHeaders(token),
        }
    );
};


// =====================================================
// 📋 MIS INSCRIPCIONES
// =====================================================
export const obtenerMisInscripciones = async (
    token
) => {

    return request(
        `${API_URL}/mis-inscripciones`,
        {
            headers: authHeaders(token),
        }
    );
};


// =====================================================
// 🔢 CONTAR INSCRITOS
// =====================================================
export const contarInscritos = async (
    tipo,
    id,
    token
) => {

    return request(
        `${API_URL}/inscritos/contador/${tipo}/${id}`,
        {
            headers: authHeaders(token),
        }
    );
};