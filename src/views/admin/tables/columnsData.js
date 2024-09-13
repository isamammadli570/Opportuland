
export const columnsDataComplex = [
  {
    Header: "Name",
    accessor: "contestName",
  },
  {
    Header: "Company",
    accessor: "name",
  },
  {
    Header: "Deadline",
    accessor: "deadline",
  },
  {
    Header: "Awards",
    accessor: "awards",
  },

  // {
  //   Header: "Employer Approval",
  //   accessor: "approval_admin",
  //   Cell: ({ value }) => (value ? "Yes" : "No"), // Converting boolean to Yes/No
  // },
  {
    Header: "OpprotuLand Approval",
    accessor: "approval_ol",
    Cell: ({ value }) => (value ? "Approved" : "Pending Approval"), // Mapping boolean to status
  },
  {
    Header: "Sumbissions",
    accessor: "submissions",
  },
  
  // {
  //   Header: "Applicants",
  //   accessor: "applicants",
  //   Cell: ({ value }) => (value ? "Approved" : "Pending Approval"), // Mapping boolean to status
  // },
];

// export const columnsDataComplexContests = [
//   {
//     Header: "Name",
//     accessor: "contestOwner",
//   },
//   {
//     Header: "Contest",
//     accessor: "contestName",
//   },
//   {
//     Header: "Awards",
//     accessor: "awards",
//   },
//   {
//     Header: "Employer Approval",
//     accessor: "approval_admin",
//     Cell: ({ value }) => (value ? "Yes" : "No"), // Converting boolean to Yes/No
//   },
//   {
//     Header: "OpprotuLand Approval",
//     accessor: "approval_ol",
//     Cell: ({ value }) => (value ? "Approved" : "Pending Approval"), // Mapping boolean to status
//   },
//   {
//     Header: "Date Created",
//     accessor: "date_created",
//   },

// ];


