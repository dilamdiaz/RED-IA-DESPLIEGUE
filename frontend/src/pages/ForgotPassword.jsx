import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');

    const [message, setMessage] = useState('');

    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setMessage('');

        try {

            setLoading(true);

            const data =
                await authService.forgotPassword(email);

            setMessage(data.message);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">

            <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-lg p-8 shadow-2xl border border-white/20">

                <h1 className="mb-6 text-3xl font-semibold text-white text-center">
                    Recuperar contraseña
                </h1>

                {message && (

                    <div className="mb-4 rounded-lg bg-green-500/20 px-4 py-3 text-sm text-green-200 border border-green-400/30">
                        {message}
                    </div>
                )}

                {error && (

                    <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-200 border border-red-400/30">
                        {error}
                    </div>
                )}

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-white/80">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full rounded-2xl bg-white/20 px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="usuario@correo.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {
                            loading
                                ? 'Enviando...'
                                : 'Enviar correo'
                        }
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-white/70">

                    <Link
                        to="/login"
                        className="font-semibold text-blue-400 hover:text-blue-300"
                    >
                        Volver al login
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default ForgotPassword;