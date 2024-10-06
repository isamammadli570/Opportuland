import React, { useMemo, useContext, useState } from 'react';
import Card from "../../../../components/card";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { MdCheckCircle, MdOutlineError } from "react-icons/md";
import Progress from "../../../../components/progress";
import AuthContext from '../../../../signin/TokenManager';
import Loading from "../../../../dashboard/Loading";

const ComplexTable = ({ columnsData, tableData: initialTableData }) => {
  const { getAccessTokenFromMemoryCompany } = useContext(AuthContext);
  const token = getAccessTokenFromMemoryCompany();
  const [tableData, setTableData] = useState(initialTableData);
  const [loading, setLoading] = useState(false);

  // Extract company_name from the first user in the tableData array
  const companyName = tableData.length > 0 ? tableData[0].company_name : "Company";

  // Function to handle approval change
  const handleApprovalChange = async (user, newValue) => {
    setLoading(true); // Set loading to true when the request is initiated
    const url = `${import.meta.env.VITE_HOST}/companyAdmin/updateApproval`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id, approval_admin: newValue }),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.message || 'Failed to update approval');
      }

      console.log(`Approval changed for ${user.name} to ${newValue ? 'Approve' : 'Disable'}`);

      // Update state to reflect the changes
      setTableData(prevData =>
        prevData.map(item =>
          item._id === user._id ? { ...item, approval_admin: newValue } : item
        )
      );
    } catch (error) {
      console.error('Error updating approval:', error);
      // Optionally, show an error message to the user
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  // Update columns to include the dynamic company_name in the header
  const columns = useMemo(() => {
    return columnsData.map((column) => {
      if (column.Header === "Employer Approval") {
        return {
          ...column,
          Header: `${companyName} Approval`,
          Cell: ({ value, row }) => (
            <button
              className={`px-2 py-1 rounded ${value ? 'bg-red-400 text-white' : 'bg-green-400 text-white'
                }`}
              onClick={() => handleApprovalChange(row.original, !value)}
              disabled={loading} // Disable the button when loading
            >
              {value ? 'Disable' : 'Approve'}
            </button>
          )
        };
      }
      return column;
    });
  }, [columnsData, companyName, loading]);

  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 15;

  return (
    <div>
      {loading && <div className='fixed inset-0 z-50'> <Loading /> </div>}
      <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
        <div className="relative flex items-center justify-between pt-4">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Users
          </div>
          {/* <CardMenu /> */}
        </div>

        <div className="mt-8 overflow-x-scroll xl:overflow-hidden">
          <table {...getTableProps()} className="w-full">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={index}
                      className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700"
                    >
                      <p className="text-xs tracking-wide text-gray-600">
                        {column.render("Header")}
                      </p>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => {
                      let data = "";
                      if (cell.column.Header === "Name") {
                        const email = row.original.email || "";
                        data = (
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {cell.value}
                            </p>
                            {email && (
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`mailto:${email}?subject=OpportuLand User Registration`}
                                className="text-base font-medium text-gray-600 hover:text-gray-600"
                              >
                                <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9-2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path>
                                </svg>
                              </a>
                            )}
                          </div>
                        );
                      } else if (cell.column.Header === "Job Title") {
                        data = (
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "Department") {
                        data = (
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "OpprotuLand Approval") {
                        data = (
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full text-xl`}>
                              {cell.value ? (
                                <MdCheckCircle className="text-green-400 opacity-70" />
                              ) : (
                                <MdOutlineError className="text-orange-400 opacity-70" />
                              )}
                            </div>
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {cell.value ? "Approved" : "Pending Approval"}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === `${companyName} Approval`) {
                        data = (
                          <button
                            className={`px-2 py-1 rounded ${cell.value ? 'bg-red-400 text-white' : 'bg-green-400 text-white'
                              }`}
                            onClick={() => handleApprovalChange(row.original, !cell.value)}
                            disabled={loading} // Disable the button when loading
                          >
                            {cell.value ? 'Disable' : 'Approve'}
                          </button>
                        );
                      } else if (cell.column.Header === "DATE") {
                        data = (
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "PROGRESS") {
                        data = <Progress width="w-[108px]" value={cell.value} />;
                      }
                      return (
                        <td
                          className="pt-[14px] pb-[18px] sm:text-[14px]"
                          {...cell.getCellProps()}
                          key={index}
                        >
                          {data}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ComplexTable;
