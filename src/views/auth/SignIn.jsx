import { useState, useEffect, useContext } from "react";
import InputField from "../../components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "../../components/checkbox";
import Widget from "./Widget";
import ComplexTable from "./ComplexTable";
import { columnsDataComplex } from "./columnsData";

import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import AuthContext from "../../signin/TokenManager";
import secureLocalStorage from "react-secure-storage";

export default function SignIn() {
  const [totalContests, setTotalContests] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [averageApplications, setAverageApplications] = useState(0);
  const [contestsUser, setContestsUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getAccessTokenFromMemoryCompany } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = secureLocalStorage.getItem("accessTokenCompany");
        if (!token) {
          console.error("Access token is missing or invalid");
          setLoading(false);
          return;
        }

        // Fetch data from the API
        const response = await fetch(`${import.meta.env.VITE_HOST}/contests/mycontestss`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }), // Sending token in the request body
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Update state variables with fetched data
        setTotalContests(data.totalContests);
        setTotalApplications(data.totalApplications);
        setAverageApplications(data.averageApplications);
        setContestsUser(data.contestsUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAccessTokenFromMemoryCompany]);

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Number of Contests"}
          subtitle={totalContests}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Total Applicants"}
          subtitle={totalApplications}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Applicants per Contest"}
          subtitle={averageApplications}
        />
      </div>
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ComplexTable
            columnsData={columnsDataComplex}
            tableData={contestsUser}
          />
        )}
      </div>
    </div>
  );
}