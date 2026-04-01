import CopyRight from "./CopyRight";
import LogoFooter from "./LogoFooter";
import NavFooter from "./NavFooter";
import MadeWithNext from "./MadeWithNext";
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 mt-auto">
      <div className="w-[90%] m-auto flex flex-col md:flex-row justify-between gap-8 text-sm">
        <LogoFooter />
        <NavFooter />
      </div>

      <CopyRight />
      <MadeWithNext />
    </footer>
  );
}
