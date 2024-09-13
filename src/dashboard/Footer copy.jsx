import { Link } from "react-router-dom";
import Whatsapp from "../assets/icons/whatsapp.svg";
import Mail from "../assets/icons/mail.svg";
import Linkedin from "../assets/icons/linkedin.svg";
// import DashboardIcon from "../../assets/icons/dashboard.svg";
// import Home from "../../assets/icons/home.svg";
import { theme } from "../theme/theme";

export default function Footer() {

  return (
    <div className="p-10  text-white w-full" style={{ background: theme.dark }}>
      <div className="flex items-center w-full justify-around">
      <Link to="/">
      {/* <img className='w-full h-full' src={logo} alt='logo' /> */}
        <h2 className="font-semibold text-2xl text-yellow-500 ">OpportuLand</h2>
      
      </Link>
        <div className="sm:mx-4 sm:m-0 text-center">
      
          
          {/* <div className="px-2  my-6 flex   items-center">
            <span className="w-6 h-6 mx-3">
              <img src={Home} alt="Home Page" />
            </span>
            
            <Link
              to="/"
              target="_blank"
              className="text-white font-normal sm:font-semibold text-xl sm:text-base hover:text-orange-400 duration-300 hover:no-underline"
            >
              Home Page
            </Link>
          </div>
          <div className="px-2   flex   items-center">
            <span className="w-6 h-6 mx-3">
              <img src={DashboardIcon} alt="Dashboard " />
            </span>
            <Link
              to="/messages"
              className="text-white font-normal sm:font-semibold text-xl sm:text-base hover:text-orange-400 duration-300 hover:no-underline"
            >
Sign in
            </Link>
          </div> */}
      
         
        </div>
        <div className="flex flex-col items-center  ">
          <div className="flex items-start flex-col text-center my-3">
            <h3 className="text-white/80 text-sm my-3">
              Have any questions, complaints or feedback?
            </h3>
            <Link
              to="https://zcal.co/rashadbayramov/userquestions"
              target="_blank"
              className="m-auto text-white bg-yellow-500  w-full sm:w-fit py-2 px-4 rounded-full  font-medium "
            >
              Book a call
            </Link>
          </div>
          <div className="flex  gap-4 items-center mx-auto sm:mt-auto ">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://wa.me/994513315387"
            >
              <img className="w-6 h-6" src={Whatsapp} alt="whatsapplogo.svg" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:remoteap@remote-auto.com"
            >
              <img className="w-6 h-6" src={Mail} alt="maillogo.svg" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/company/remote-auto/"
            >
              <img className="w-7 h-7" src={Linkedin} alt="linkedinlogo.svg" />
            </a>
          </div>
        </div>
      </div>
    </div>
    
  );
}
