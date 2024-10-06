import React, { useEffect, useState, useContext, useMemo } from 'react';
import Card from "../../components/card";
import secureLocalStorage from "react-secure-storage";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel, faFileImage, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../signin/TokenManager';
import Loading from "../../dashboard/Loading";

const ContestSubmissionsTable = ({ contestId }) => {
  const { getAccessTokenFromMemoryCompany } = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMessages, setExpandedMessages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const token = secureLocalStorage.getItem("accessTokenCompany");
        if (!token) {
          console.error("Access token is missing or invalid");
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_HOST}/contests/submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ contestId }), // Sending contestId in the request body
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setTableData(data.submissions); // Assuming the API returns submissions in this format
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [getAccessTokenFromMemoryCompany, contestId]);

  const toggleMessageExpansion = (index) => {
    setExpandedMessages((prevExpandedMessages) => ({
      ...prevExpandedMessages,
      [index]: !prevExpandedMessages[index],
    }));
  };

  const getFileTypeIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FontAwesomeIcon icon={faFileExcel} className="text-green-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FontAwesomeIcon icon={faFileImage} className="text-blue-500" />;
      default:
        return <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />;
    }
  };

  const handleFileDownload = async (_id, fileId, filename) => {
    console.log(_id, ' ', fileId, ' ', filename)
    const token = secureLocalStorage.getItem("accessTokenCompany");
    if (!token) {
      alert("You need to sign in to see the files.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_HOST}/contests/fileDownload2/${_id}/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const columns = useMemo(() => [
    {
      Header: "Name",
      accessor: "fullname",
      Cell: ({ value, row }) => (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          {row.original.email && (
            <a href={`mailto:${row.original.email}`} className="text-base font-medium text-gray-600 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
              </svg>
            </a>
          )}
          {row.original.userLinkedIn && (
            <a href={row.original.userLinkedIn} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-gray-600 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.762 0-5 2.238-5 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.792-1.75-1.767s.784-1.767 1.75-1.767 1.75.792 1.75 1.767-.784 1.767-1.75 1.767zm13.5 12.268h-3v-5.5c0-1.379-1.121-2.5-2.5-2.5s-2.5 1.121-2.5 2.5v5.5h-3v-11h3v1.643c.825-.89 2.021-1.643 3.5-1.643 2.481 0 4.5 2.019 4.5 4.5v6.5z" />
              </svg>
            </a>
          )}
        </div>
      ),
    },
    {
      Header: "Message",
      accessor: "message",
      Cell: ({ value, row }) => {
        const isExpanded = expandedMessages[row.index];
        return (
          <div>
            {isExpanded ? value : `${value.substring(0, 30)}...`}
            {value.length > 30 && (
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => toggleMessageExpansion(row.index)}
              >
                {isExpanded ? " see less" : " see more"}
              </span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Files",
      accessor: "files",
      Cell: ({ value, row }) => (
        <ul className="flex flex-wrap gap-4">
          {value.map(file => (
            <li key={file.fileId} className="flex items-center p-2 border rounded bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              {getFileTypeIcon(file.filename)}
              <button
                className="ml-2 text-gray-700"
                onClick={() => handleFileDownload(row.original._id, file.fileId, file.filename)}
              >
                {file.filename}
              </button>
            </li>
          ))}
        </ul>
      ),
    },
    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }) => new Date(value).toLocaleDateString(), // Format date
    },
  ], [expandedMessages]);

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
      {loading ? (
        <div className='fixed inset-0 z-50'>
          <Loading />
        </div>
      ) : (
        <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
          <div className="relative flex items-center justify-between pt-4">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Submissions
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
                    >
                      {row.cells.map((cell, index) => {
                        let data = (
                          <p className="text-sm font-bold text-navy-700 dark:text-white whitespace-normal break-words max-w-xs">
                            {cell.render("Cell")}
                          </p>
                        );
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
      )}
    </div>
  );
};

export default ContestSubmissionsTable;
