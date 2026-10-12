import { Link } from "react-router-dom"
import Subscribes from "../Subscribe_email/email_subscribe";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
function Footer()
{
    return(
        <>
              {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 px-6 py-12 mt-16 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand & Social Media */}
          <div>
            <h2 className="text-2xl font-bold">HireHub</h2>
            <p className="mt-4 max-w-sm text-lg leading-6 text-slate-400">
              Connecting the brightest minds with top companies. Start your
              journey to a better career today with JobFinder.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.linkedin.com/in/subhradip-ghosh-india/
                "
                target="blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-blue-600 hover:text-white"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a
                href="https://www.facebook.com/subhradip.ghosh.5872"
                target="blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF size={18} />
              </a>
     <a
  href="https://wa.me/917547972652"
  target="_blank"
  rel="noopener noreferrer"
  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-green-600 hover:text-white"
>
  <FaWhatsapp size={18} />
</a>
              <a
                href="https://www.instagram.com/beyond_subhra/"
  target="_blank"
  rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-pink-600 hover:text-white"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-xl font-semibold">For Candidates</h3>
            <div className="mt-5 flex flex-col gap-3 text-lg text-slate-400">
              <a href="find-jobs" className="transition hover:text-white">
                Browse Jobs
              </a>
              <a href="#categories" className="transition hover:text-white">
                Browse Categories
              </a>
            </div>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-xl font-semibold">For Employers</h3>
            <div className="mt-5 flex flex-col gap-3 text-lg text-slate-400">
                 <Link
      to="find-jobs"
      className="transition hover:text-white"
    >
      Browse Jobs
    </Link>
              <a href="#categories" className="transition hover:text-white">Browse Categories</a>
              <a href="#" className="transition hover:text-white">
                Employer Dashboard
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold">Join Our Newsletter</h3>
            <p className="mt-4 text-slate-400">
              Subscribe to get the latest job opportunities and career updates.
            </p>
          <Subscribes/>
          </div>
        </div>

        {/* Copyright */}
        <div className="mx-auto mt-10 max-w-6xl border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          © 2026 JobFinder. All rights reserved.
        </div>
      </footer>
</>
    )
}
export default Footer;