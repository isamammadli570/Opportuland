import React, { useMemo, useContext, useState, useEffect } from 'react';
import Card from "../../../components/card";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { MdCheckCircle, MdOutlineError } from "react-icons/md";
import Progress from "../../../components/progress";
import AuthContext from '../../../signin/TokenManager';
import Loading from "../../../dashboard/Loading";

const ComplexTable = ({ columnsData, tableData: initialTableData, onRowClick }) => {
  const { getAccessTokenFromMemoryCompany } = useContext(AuthContext);
  const token = getAccessTokenFromMemoryCompany();
  const [tableData, setTableData] = useState(initialTableData);
  const [loading, setLoading] = useState(false);

  const companyName = tableData.length > 0 ? tableData[0].name : "Company";

  const columns = useMemo(() => {
    return columnsData.map((column) => {
      if (column.Header === "Employer Approval") {
        return {
          ...column,
          Header: `${companyName} Approval`,
          Cell: ({ value, row }) => (
            <div className="flex items-center gap-2 whitespace-normal break-words max-w-xs">
              <div className={`rounded-full text-xl`}>
                {value ? (
                  <MdCheckCircle className="text-green-400 opacity-70" />
                ) : (
                  <MdOutlineError className="text-orange-400 opacity-70" />
                )}
              </div>
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {value ? "Approved" : "Pending Approval"}
              </p>
            </div>
          )
        };
      } else if (column.Header === "Submissions") {
        return {
          ...column,
          Cell: ({ value }) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white whitespace-normal break-words max-w-xs">
              {value}
            </p>
          )
        };
      }
      return column;
    });
  }, [columnsData, companyName]);

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
            Contests
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table {...getTableProps()} className="w-full">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={index}
                      className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700 max-w-xs"
                    >
                      <p className="text-xs tracking-wide text-gray-600 dark:text-white">
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
                  <tr
                    {...row.getRowProps()}
                    key={index}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onRowClick(row.original)} // Pass the entire contest object
                  >
                    {row.cells.map((cell, index) => {
                      let data = "";
                      if (cell.column.Header === "Name") {
                        data = (
                          <div className="flex items-center gap-2 whitespace-normal break-words max-w-xs">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {cell.value}
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "Company") {
                        data = (
                          <p className="text-sm font-bold text-navy-700 dark:text-white whitespace-normal break-words max-w-xs">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "Deadline") {
                        data = (
                          <p className="text-sm font-bold text-navy-700 dark:text-white whitespace-normal break-words max-w-xs">
                            {cell.value.split('T')[0]}
                          </p>
                        );
                      } else if (cell.column.Header === "Awards") {
                        data = (
                          <p className="text-sm font-bold text-navy-700 dark:text-white whitespace-normal break-words max-w-xs">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "OpprotuLand Approval") {
                        data = (
                          <div className="flex items-center gap-2 whitespace-normal break-words max-w-xs">
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
                      }
                      // else if (cell.column.Header === `${companyName} Approval`) {
                      //   data = (
                      //     <div className="flex items-center gap-2 whitespace-normal break-words max-w-xs">
                      //       <div className={`rounded-full text-xl`}>
                      //         {cell.value ? (
                      //           <MdCheckCircle className="text-green-400 opacity-70" />
                      //         ) : (
                      //           <MdOutlineError className="text-orange-400 opacity-70" />
                      //         )}
                      //       </div>
                      //       <p className="text-sm font-bold text-navy-700 dark:text-white">
                      //         {cell.value ? "Approved" : "Pending Approval"}
                      //       </p>
                      //     </div>
                      //   );
                      // } 
                      else if (cell.column.Header === "Sumbissions") {
                        data = (
                          <p className="text-sm font-bold text-navy-700 dark:text-white whitespace-normal break-words max-w-xs">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "PROGRESS") {
                        data = <Progress width="w-[108px]" value={cell.value} />;
                      }
                      return (
                        <td
                          className={`pt-[14px] pb-[18px] sm:text-[14px] ${index === row.cells.length - 1 ? 'w-20' : 'whitespace-normal break-words max-w-xs'}`}
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
