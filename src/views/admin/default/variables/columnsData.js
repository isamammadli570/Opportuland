export const columnsDataDevelopment = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "TECH",
    accessor: "tech",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
];

export const columnsDataCheck = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
];

export const columnsDataColumns = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
];
// {
//   Header: "STATUS",
//   accessor: "status",
// },
export const columnsDataComplex = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Job Title",
    accessor: "jobTitle",
  },
  {
    Header: "Department",
    accessor: "department",
  },
  {
    Header: "Employer Approval",
    accessor: "approval_admin",
    Cell: ({ value }) => (value ? "Yes" : "No"), // Converting boolean to Yes/No
  },
  {
    Header: "OpprotuLand Approval",
    accessor: "approval_ol",
    Cell: ({ value }) => (value ? "Approved" : "Pending Approval"), // Mapping boolean to status
  },
];

export const columnsDataComplexContests = [
  {
    Header: "Name",
    accessor: "contestOwner",
  },
  {
    Header: "Contest",
    accessor: "contestName",
  },
  {
    Header: "Awards",
    accessor: "awards",
  },
  {
    Header: "Employer Approval",
    accessor: "approval_admin",
    Cell: ({ value }) => (value ? "Yes" : "No"), // Converting boolean to Yes/No
  },
  {
    Header: "OpprotuLand Approval",
    accessor: "approval_ol",
    Cell: ({ value }) => (value ? "Approved" : "Pending Approval"), // Mapping boolean to status
  },
  {
    Header: "Date Created",
    accessor: "date_created",
  },

];


