import React, { useState, useEffect } from "react";
import MiniCalendar from "../../../components/calendar/MiniCalendar";
import WeeklyRevenue from "../../../views/admin/default/components/WeeklyRevenue";
import TotalSpent from "../../../views/admin/default/components/TotalSpent";
import PieChartCard from "../../../views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataComplexContests, columnsDataComplex } from "./variables/columnsData";

import Widget from "../../../components/widget/Widget";
import CheckTable from "../../../views/admin/default/components/CheckTable";
import ComplexTable from "../../../views/admin/default/components/ComplexTable";
import ComplexTableContests from "../../../views/admin/default/components/ComplexTableContests";
import DailyTraffic from "../../../views/admin/default/components/DailyTraffic";
import TaskCard from "../../../views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import Loading from "../../../dashboard/Loading";

const Dashboard = ({ users, contests }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (users && contests) {
      setLoading(false);
    }
  }, [users, contests]);

  return (
    <div>
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <ComplexTable
              columnsData={columnsDataComplex}
              tableData={users}
            />
          </div>

          <div className="mt-4">
            <ComplexTableContests
              columnsData={columnsDataComplexContests}
              tableData={contests}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
