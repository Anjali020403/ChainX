import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

const Market = () => {
  const [data, setData] = useState([]);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/data')
      .then(response => {
        console.log(response.data); // Check the response data
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const columns = React.useMemo(
    () => [
      // Define the columns for the table
      {
        Header: 'Symbol',
        accessor: 'Column1',
      },
      {
        Header: 'Last',
        accessor: 'Column2',
      },
      {
        Header: 'Vol',
        accessor: 'Column3',
      },
      {
        Header: 'Open',
        accessor: 'Column4',
      },
      {
        Header: 'High',
        accessor: 'Column5',
      },
      {
        Header: 'Low',
        accessor: 'Column6',
      },
      {
        Header: 'Close',
        accessor: 'Column7',
      },
      {
        Header: 'Bid',
        accessor: 'Column8',
      },
      {
        Header: 'Ask',
        accessor: 'Column9',
      },
      {
        Header: 'Time',
        accessor: 'Column10',
      },
      {
        Header: 'Prev close',
        accessor: 'Column11',
      },
      {
        Header: 'Change',
        accessor: 'Column12',
      },
    ],
    []
  );

  // Filter the data based on the selected expiry date
  const filteredData = selectedExpiryDate
    ? data.filter(item => item.Column10 === selectedExpiryDate)
    : data;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: filteredData });

  return (
    <div>
      {/* Select dropdown for expiry date filter */}
      <select
        value={selectedExpiryDate}
        onChange={e => setSelectedExpiryDate(e.target.value)}
      >
        {/* Replace the options below with your actual expiry date options */}
        <option value="09:15:59">09:15:59</option>
        <option value="09:16:00">09:16:00</option>
      </select>

      {/* Table */}
      <table {...getTableProps()} style={{ border: 'solid 1px black', width: '100%' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} style={{ borderBottom: 'solid 3px red', background: 'aliceblue', color: 'black', fontWeight: 'bold' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ padding: '10px', border: 'solid 1px gray', background: 'papayawhip' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Market;
