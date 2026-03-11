import Link from "next/link";

function Navbar() {
  

  const menu = (
    <>
      <li>
        <Link href="/" className="relative text-sm tracking-widest uppercase font-medium text-black/50 hover:text-black hover:bg-transparent transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
          Home
        </Link>
      </li>
      <li>
        <Link href="/tutors" className="relative text-sm tracking-widest uppercase font-medium text-black/50 hover:text-black hover:bg-transparent transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
          Find Tutors
        </Link>
      </li>
      <li>
        <Link href="/how-it-works" className="relative text-sm tracking-widest uppercase font-medium text-black/50 hover:text-black hover:bg-transparent transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
          How It Works
        </Link>
      </li>
      <li>
        <Link href="/pricing" className="relative text-sm tracking-widest uppercase font-medium text-black/50 hover:text-black hover:bg-transparent transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
          Pricing
        </Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-white border-b border-black/10 px-6 py-3">
      {/* Logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white border border-black/10 shadow-lg rounded-none z-50 mt-3 w-52 p-2">
            {menu}
          </ul>
        </div>

        <a className="btn btn-ghost normal-case px-0 hover:bg-transparent [font-family:'Georgia',serif]">
          <span className="text-xl font-black tracking-tight text-black">Learnavo</span>
          <span className="text-xl font-black tracking-tight text-black/20">.</span>
        </a>
      </div>

      {/* Center Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {menu}
        </ul>
      </div>

      {/* CTA */}
      <div className="navbar-end gap-3">
        <a className="btn btn-sm rounded-none border border-black/20 bg-transparent text-black text-xs tracking-[0.15em] uppercase font-semibold hover:bg-black hover:text-white hover:border-black transition-all duration-300 [font-family:monospace]">
          Login
        </a>
      </div>
    </div>
  );
}

export default Navbar;