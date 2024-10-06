import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './dashboard/Footer';
import { TokenManager } from './signin/TokenManager';
import Error from './Error/Error';
import SingleJob from './dashboard/SingleJob';
import Messages from './Messages/Messages';
import ChatArea from './Messages/ChatArea';
import Sidebar from './dashboard/Sidebar';
import Main from './dashboard/Main';
import Edit from './editProfile/Edit';
import Contests from './Contest/Main'
import Feed from './ContestFeed/Feed'
import ContestItem from './Contest/ContestItem';
import SingleJobContest from './Contest/SingleJob'
import Statistics from './Statistics/Statistics';
import CompanySignUp from './Company/CompanySignUp';
import DataWebsite from './Company/DataWebsite';
import AdminLayout from './layouts/admin';
import { useState } from 'react';
import ResponsiveNav from './dashboard/ResponsiveNav';
import EmployerRegister from './signin/EmployerRegister';
import EmployerLogin from './signup/EmployerLogin';
import SignIn from './signin/SignIn';
import Signup from './signup/Signup';

const MainApp = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isAdminRoute && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
      <div
        className={
          isOpen
            ? "fixed top-0 right-0 w-[300px] h-full bg-lightPrimary dark:!bg-navy-900 z-40 duration-200"
            : "fixed top-0 right-[-100%] w-[300px] h-full bg-lightPrimary dark:!bg-navy-900 z-10 duration-200"
        }
      >
        {isOpen && <ResponsiveNav setIsOpen={setIsOpen} />}
      </div>

      <Routes>
        <Route path='/:submissionId' element={<Feed />} />
        <Route path='/' element={<Feed />} />
        <Route path='/remote' element={<Main />} />
        <Route path='/job/:subject/:id' element={<SingleJob />} />
        <Route path='/contest/:subject/:id' element={<SingleJobContest />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/messages/:id' element={<ChatArea />} />

        <Route path='/user-login' element={<SignIn />} />
        <Route path='/user-register' element={<Signup />} />
        <Route path='/login' element={<EmployerLogin />} />
        <Route path='/register' element={<EmployerRegister />} />

        <Route path='/edit' element={<Edit />} />
        <Route path='/statistics' element={<Statistics />} />
        <Route path='/company' element={<CompanySignUp />} />
        <Route path='/company-step-2' element={<DataWebsite />} />
        <Route path='/contest' element={<Contests />} />
        <Route path='/contest/1' element={<ContestItem />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path='/*' element={<Error />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => (
  <div className='w-full '>
    <Router>
      <TokenManager>
        <MainApp />
      </TokenManager>
    </Router>
  </div>
);

export default App;
