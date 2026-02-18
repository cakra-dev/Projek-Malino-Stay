import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container text-center">
        
        <div className="mb-2 d-flex justify-content-center gap-2 flex-wrap">
          <a href="https://github.com/cakra-dev" className="text-white text-decoration-none">
            <FaGithub size={20} />
          </a>
          <a href="https://instagram.com/cakra.bimantara_" className="text-white text-decoration-none">
            <FaInstagram size={20} />
          </a>
          <a href="https://linkedin.com/in/cakra25" className="text-white text-decoration-none">
            <FaLinkedin size={20} />
          </a>
          <a href="https://facebook.com/" className="text-white text-decoration-none">
            <FaFacebook size={20} />
          </a>
          <a href="cakrabimantara99@gmail.com" className="text-white text-decoration-none">
            <FaEnvelope size={20} />
          </a>
        </div>

        <p className="mb-2">
          &copy; {new Date().getFullYear()} <b>Malino Stay</b> All Rights Reserved
        </p>

        <p className="medium mb-2">
          | Cakra Bimantara | 13020210124 | Universitas Muslim Indonesia |
        </p>
      </div>
    </footer>
  );
}

export default Footer;
