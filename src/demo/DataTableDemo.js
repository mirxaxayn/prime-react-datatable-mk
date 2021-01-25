import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../../src/index.css";
import ReactDOM from "react-dom";

import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CustomerService } from "../service/CustomerService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
import "./DataTableDemo.css";

//Export to csv
import axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const DataTableDemo = () => {
  const [customers, setCustomers] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedRepresentatives, setSelectedRepresentatives] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const dt = useRef(null);

  const headers = [
    { label: "Log Date", key: "logDate" },
    { label: "Patient Name", key: "patientName" },
    { label: "Patient Code", key: "patientCode" },
    { label: "Appointment Code", key: "appointmentId" },
    { label: "Practice Code", key: "practiceCode" },
    { label: "Call Type", key: "callType" },
    { label: "Call Duration", key: "callDuration" },
    { label: "Call Start Time", key: "callStartTime" },
    { label: "Call End Time", key: "callEndTime" },
    { label: "Call Errors", key: "callError" },
  ];

  const customerService = new CustomerService();

  useEffect(() => {
    customerService.getCustomersLarge().then((data) => setCustomers(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const renderHeader = () => {
    return (
      <div className='table-header'>
        List of Customers
        <span className='p-input-icon-left'>
          <Button
            type='button'
            icon='pi pi-external-link'
            label='Export'
            onClick={exportCSV}></Button>
        </span>
      </div>
    );
  };

  const appointmentIdBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Appointment ID</span>
        {rowData.appointmentId}
      </React.Fragment>
    );
  };

  const actionBodyTemplate = () => {
    return (
      <Button
        type='button'
        icon='pi pi-cog'
        className='p-button-secondary'></Button>
    );
  };

  const practiceCodeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Practice Code</span>
        {rowData.practiceCode}
      </React.Fragment>
    );
  };

  const patientNameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Patient Name</span>
        {rowData.patientName}
      </React.Fragment>
    );
  };

  const patientCodeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Patient Code</span>
        {rowData.patientCode}
      </React.Fragment>
    );
  };

  const callTypeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Call Type</span>
        {rowData.callType}
      </React.Fragment>
    );
  };

  const callDurationBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Call Duration</span>
        {rowData.callDuration}
      </React.Fragment>
    );
  };
  const callStartTimeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Call Start Time</span>
        {rowData.callStartTime}
      </React.Fragment>
    );
  };
  const callEndTimeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Call End Time</span>
        {rowData.callEndTime}
      </React.Fragment>
    );
  };
  const callErrorBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Call Errors</span>
        {rowData.callError}
      </React.Fragment>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>Log Date</span>
        <span>{rowData.logDate}</span>
      </React.Fragment>
    );
  };

  const representativeItemTemplate = (option) => {
    const src = "showcase/demo/images/avatar/" + option.image;

    return (
      <div className='p-multiselect-representative-option'>
        <img
          alt={option.name}
          src={src}
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          width='32'
          style={{ verticalAlign: "middle" }}
        />
        <span style={{ verticalAlign: "middle", marginLeft: ".5em" }}>
          {option.name}
        </span>
      </div>
    );
  };

  const onRepresentativeFilterChange = (event) => {
    dt.current.filter(event.value, "representative.name", "in");
    setSelectedRepresentatives(event.value);
  };

  const renderDateFilter = () => {
    return (
      <Calendar
        value={dateFilter}
        onChange={onDateFilterChange}
        placeholder='Registration Date'
        dateFormat='mm/dd/yy'
        className='p-column-filter'
      />
    );
  };

  const onDateFilterChange = (event) => {
    if (event.value !== null)
      dt.current.filter(formatDate(event.value), "logDate", "equals");
    else dt.current.filter(null, "logDate", "equals");

    setDateFilter(event.value);
  };

  const filterDate = (value, filter) => {
    if (
      filter === undefined ||
      filter === null ||
      (typeof filter === "string" && filter.trim() === "")
    ) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    return value === formatDate(filter);
  };

  const formatDate = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return month + "/" + day + "/" + date.getFullYear();
  };

  const statusItemTemplate = (option) => {
    return (
      <span className={classNames("customer-badge", "status-" + option)}>
        {option}
      </span>
    );
  };

  const onStatusFilterChange = (event) => {
    dt.current.filter(event.value, "status", "equals");
    setSelectedStatus(event.value);
  };

  const header = renderHeader();
  const dateFilterElement = renderDateFilter();

  return (
    <div className='datatable-doc-demo'>
      <div className='card'>
        <DataTable
          id='myTable'
          ref={dt}
          value={customers}
          header={header}
          className='p-datatable-customers'
          dataKey='id'
          rowHover
          globalFilter={globalFilter}
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value)}
          paginator
          rows={10}
          emptyMessage='No customers found'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          rowsPerPageOptions={[10, 50, 100, 200, 500]}>
          <Column
            field='logDate'
            header='Log Date'
            body={dateBodyTemplate}
            sortable
            filter
            filterMatchMode='custom'
            filterFunction={filterDate}
            filterElement={dateFilterElement}
          />

          <Column
            field='patientName'
            header='Patient Name'
            body={patientNameBodyTemplate}
            sortable
            filter
            filterMatchMode='contains'
            filterPlaceholder='Search by Patient Name'
          />
          <Column
            field='patientCode'
            header='Patient Code'
            body={patientCodeBodyTemplate}
            sortable
            filter
            filterMatchMode='contains'
            filterPlaceholder='Search by Patient Code'
          />
          <Column
            field='appointmentId'
            header='Appointment Code'
            body={appointmentIdBodyTemplate}
            sortable
            filter
            filterMatchMode='contains'
            filterPlaceholder='Search by Appointment ID'
          />
          <Column
            field='practiceCode'
            header='Practice Code'
            body={practiceCodeBodyTemplate}
            sortable
            filter
            filterMatchMode='contains'
            filterPlaceholder='Search by Practice Code'
          />
          <Column
            field='callType'
            header='Call Type'
            body={callTypeBodyTemplate}
            sortable
            filter
            filterMatchMode='contains'
            filterPlaceholder='Search by Call Type'
          />
          <Column
            sortField='callDuration'
            header='Call Duration'
            body={callDurationBodyTemplate}
            sortable
          />
          <Column
            sortField='callStartTime'
            header='Call Start Time'
            body={callStartTimeBodyTemplate}
            sortable
          />

          <Column
            field='callEndTime'
            header='Call End Time'
            body={callEndTimeBodyTemplate}
            sortable
          />
          <Column
            field='callError'
            header='callError'
            body={callErrorBodyTemplate}
            sortable
          />
        </DataTable>
      </div>
      <div>
        <ReactHTMLTableToExcel
          className='btn btn-info'
          table='myTable'
          filename='ReportExcel'
          sheet='Sheet'
          buttonText='Export excel'
        />
      </div>
    </div>
  );
};

// const rootElement = document.getElementById("root");
// ReactDOM.render(<DataTableDemo />, rootElement);

export default DataTableDemo;
