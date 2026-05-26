import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Menu,
  X,
  Home,
  Library,
  MessageSquare,
  Users,
  BookOpen,
  LogOut,
  User,
} from 'lucide-react';

import ProfileModal from './ProfileModal';

const Navbar = () => {

  const { user, logout, token } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const esCoordinador =
    Number(user?.rol || user?.id_rol) === 2;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () =>
    setMobileMenu(false);

  const links = [
    {
      to: '/dashboard',
      label: 'Nosotros',
      icon: <Home size={17} />,
    },
    {
      to: '/resources',
      label: 'Biblioteca',
      icon: <Library size={17} />,
    },
    {
      to: '/foro',
      label: 'Foro',
      icon: <MessageSquare size={17} />,
    },
    {
      to: '/colaboracion',
      label: 'Colaboración',
      icon: <Users size={17} />,
    },
  ];

  if (!esCoordinador) {
    links.push({
      to: '/mis-inscripciones',
      label: 'Mis Inscripciones',
      icon: <BookOpen size={17} />,
    });
  }

  const navLinkClass = (path) => `
    relative
    flex
    items-center
    gap-2

    rounded-2xl
    px-4
    py-2.5

    text-sm
    font-medium

    transition-all
    duration-300

    ${location.pathname === path
      ? `
        bg-gradient-to-r
        from-cyan-500/20
        to-blue-500/20

        text-cyan-300

        border
        border-cyan-400/20

        shadow-[0_0_20px_rgba(34,211,238,0.12)]
      `
      : `
        text-white/70
        hover:text-white

        hover:bg-white/5
      `
    }
  `;

  return (
    <>
      <nav
        className="
          sticky
          top-0
          z-[999]

          border-b
          border-white/10

          bg-[#030712]/70
          backdrop-blur-2xl
        "
      >

        {/* GLOW */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_55%)]
          "
        />

        <div
          className="
            relative
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between

            px-4
            py-4

            sm:px-6
          "
        >

          {/* LEFT */}
          <div className="flex items-center gap-10">

            {/* LOGO */}
            <Link
              to="/"
              className="
                group
                flex
                items-center
                gap-3
              "
            >

              {/* ICON */}
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

                  border
                  border-cyan-400/20

                  text-xl
                "
              >
                🌐
              </div>

              {/* TEXT */}
              <div className="hidden sm:block">

                <h1
                  className="
                    text-base
                    font-bold
                    tracking-wide
                    text-white

                    transition
                    group-hover:text-cyan-300
                  "
                >
                  Red de Cooperación en IA
                </h1>

                <p className="text-xs text-white/40">
                  Cooperación académica
                </p>

              </div>

            </Link>

            {/* DESKTOP LINKS */}
            {token && (
              <div className="hidden xl:flex items-center gap-2">

                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={navLinkClass(link.to)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}

              </div>
            )}

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* LOGIN */}
            {!token && (
              <Link
                to="/login"
                className="
                  rounded-2xl

                  bg-gradient-to-r
                  from-cyan-500/20
                  to-blue-500/20

                  border
                  border-cyan-400/20

                  px-5
                  py-2.5

                  text-sm
                  font-medium
                  text-cyan-300

                  transition
                  hover:scale-[1.02]
                  hover:from-cyan-500/30
                  hover:to-blue-500/30
                "
              >
                Iniciar sesión
              </Link>
            )}

            {/* USER */}
            {token && (
              <button
                onClick={() => setOpenProfile(true)}
                className="
                  hidden
                  md:flex
                  items-center
                  gap-3

                  rounded-2xl
                  border
                  border-white/10

                  bg-white/[0.04]

                  px-3
                  py-2

                  transition
                  hover:bg-white/[0.07]
                "
              >

                {/* AVATAR */}
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-2xl

                    bg-gradient-to-br
                    from-cyan-500/20
                    to-blue-500/20

                    text-white
                  "
                >
                  <User size={18} />
                </div>

                {/* INFO */}
                <div className="hidden lg:block text-left">

                  <p className="max-w-[150px] truncate text-sm font-medium text-white">
                    {user?.nombre || 'Usuario'}
                  </p>

                  <p className="text-xs text-white/40">
                    Ver perfil
                  </p>

                </div>

              </button>
            )}

            {/* LOGOUT */}
            {token && (
              <button
                onClick={handleLogout}
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2

                  rounded-2xl

                  bg-red-500/10
                  border
                  border-red-400/10

                  px-4
                  py-2.5

                  text-sm
                  text-red-300

                  transition
                  hover:bg-red-500/20
                "
              >
                <LogOut size={16} />
                Salir
              </button>
            )}

            {/* MOBILE BUTTON */}
            {token && (
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="
                  xl:hidden

                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/5

                  text-white

                  transition
                  hover:bg-white/10
                "
              >
                {mobileMenu
                  ? <X size={20} />
                  : <Menu size={20} />
                }
              </button>
            )}

          </div>

        </div>

        {/* MOBILE MENU */}
        {mobileMenu && token && (

          <div
            className="
              xl:hidden

              border-t
              border-white/10

              bg-[#030712]/95
              backdrop-blur-2xl
            "
          >

            <div className="space-y-2 p-4">

              {/* USER CARD */}
              <div
                className="
                  mb-4

                  rounded-3xl
                  border
                  border-white/10

                  bg-white/5
                  p-4
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center

                      rounded-2xl

                      bg-gradient-to-br
                      from-cyan-500/20
                      to-blue-500/20
                    "
                  >
                    👤
                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      {user?.nombre || 'Usuario'}
                    </h3>

                    <p className="text-sm text-white/40">
                      Panel académico
                    </p>

                  </div>

                </div>

              </div>

              {/* LINKS */}
              {links.map((link) => (

                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={navLinkClass(link.to)}
                >
                  {link.icon}
                  {link.label}
                </Link>

              ))}

              {/* PROFILE */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  setOpenProfile(true);
                }}
                className="
                  mt-4
                  flex
                  w-full
                  items-center
                  gap-2

                  rounded-2xl

                  bg-white/5
                  px-4
                  py-3

                  text-white

                  transition
                  hover:bg-white/10
                "
              >
                <User size={17} />
                Ver perfil
              </button>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-2

                  rounded-2xl

                  bg-red-500/10
                  px-4
                  py-3

                  text-red-300

                  transition
                  hover:bg-red-500/20
                "
              >
                <LogOut size={17} />
                Cerrar sesión
              </button>

            </div>

          </div>
        )}

      </nav>

      <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    </>
  );
};

export default Navbar;