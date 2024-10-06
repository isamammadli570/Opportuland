import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer/Footer";
import routes from "../../routes.jsx";

import AuthContext from '../../signin/TokenManager';
import Loading from '../../ui/Loading/Loading.jsx';

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { getAccessTokenFromMemoryCompany, logOut } = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  useEffect(() => {
    const fetchDataNotAdmin = async () => {
      const token = getAccessTokenFromMemoryCompany();
  
      if (!token) {
        console.error('Access token is missing or invalid');
        navigate('/signin');    
        return;
      }
  
      const url = `${import.meta.env.VITE_HOST}/companyAdmin/notAdmin`;
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const responseBody = await response.json();
  
        if (response.ok) {
          setUser(responseBody.user);
          setLoading(false);
          return responseBody;
        } else {
          if (responseBody.redirect) {
            navigate(responseBody.redirect);
          } else {
            alert(JSON.stringify(responseBody.message));
          }
        }
      } catch (error) {
        alert(JSON.stringify(error));
        navigate('/signin');
      }
    };
  
    const fetchData = async () => {
      const token = getAccessTokenFromMemoryCompany();
  
      if (!token) {
        console.error('Access token is missing or invalid');
        navigate('/signin');    
        return;
      }
  
      const url = `${import.meta.env.VITE_HOST}/companyAdmin/default`;
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const responseBody = await response.json();
  
        if (response.ok) {
          setUsers(responseBody.users);
          setUser(responseBody.user);
          setLoading(false);
          return responseBody;
        } else {
          if (responseBody.redirect) {
            navigate(responseBody.redirect);
          } else {
            alert(JSON.stringify(responseBody.message));
          }
        }
      } catch (error) {
        alert(JSON.stringify(error));
        navigate('/signin');
      }
    };
  
    if (location.pathname === '/admin/default') {
      fetchData().then(responseBody => {
        console.log('user: ', responseBody?.user);
        console.log('users: ', responseBody?.users);
        // You can continue writing here inside the if block
      });
    } else {
      fetchDataNotAdmin().then(responseBody => {
        // console.log('its not an admin')
        console.log('user: ', responseBody?.user);
        // You can continue writing here inside the else block
      });
    }
  
  }, [location.pathname, navigate, getAccessTokenFromMemoryCompany]);
  
  

  useEffect(() => {
    const knownPaths = routes.map(route => `${route.layout}/${route.path}`);
    if (!knownPaths.includes(location.pathname)) {
      navigate('/admin/default');
    }
  }, [location.pathname, navigate]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + "/" + routes[i].path) !== -1) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} user={user} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
