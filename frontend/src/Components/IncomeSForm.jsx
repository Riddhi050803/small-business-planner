import React, { useState } from "react";

const IncomeSForm = () => {
  // Initialize the rows state with an empty row
  const [rows, setRows] = useState([
    {
      date: "",
     
      revenue: "",
      costOfRevenue: "",
      operatingIncome: "",
      interestExpense: "",
      incomeBeforeTax: "",
      netIncome: "",
      
    },
  ]);

  // Handle input changes in the table
  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  // Add a new row
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        date: "",
        revenue: "",
        costOfRevenue: "",
        operatingIncome: "",
        interestExpense: "",
        incomeBeforeTax:" ",
        netIncome: "",
      },
    ]);
  };

  // Submit data
  const handleSubmit = () => {
    // Validate fields in all rows
    const isValid = rows.every((row) =>
      ["date", "symbol", "revenue", "costOfRevenue", "operatingIncome", "interestExpense","incomeBeforeTax", "netIncome"].every(
        (field) => row[field] && (!isNaN(parseFloat(row[field])) || field === "date" || field === "symbol")
      )
    );

    if (!isValid) {
      alert("Please fill out all fields correctly before submitting.");
      return;
    }

    // Process or send the rows data
    console.log("Submitted Data:", rows);
    alert("Data submitted successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Income Statement Input</h2>
      <table border="1" style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
           
            <th>Revenue</th>
            <th>Cost of Revenue</th>
            <th>Operating Income</th>
            <th>Interest Expense</th>
            <th>Income before Tax</th>
            <th>Net Income</th>
            
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((field) => (
                <td key={field}>
                  <input
                    type={field === "date" ? "date" : "text"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                    value={row[field]}
                    onChange={(e) => handleInputChange(index, field, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow} style={{ marginRight: "10px" }}>
        + Add Row
      </button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default IncomeSForm;
