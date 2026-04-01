import Logo from "./Logo";
import NavBar from "./Navbar";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md relative z-50">
      <div className="w-[90%] flex justify-between gap-11 items-center m-auto">
        <Logo />
        <NavBar />
      </div>
    </header>
  );
}
