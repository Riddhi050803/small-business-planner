import React, { useState } from "react";
import { Link } from "react-router-dom";
import UploadCSV from "@/components/csvUpload";
import { createBalanceSheetTable, createIncomeTable, triggerUserAnalysis } from "@/utils/apiRequest";
import { toast } from "react-toastify";
import Papa from "papaparse";

const IncomeS = () => {
  const [uploadedFiles, setUploadedFiles] = useState({
    balance_sheet: null,
    income_statement: null,
  });
  const [balanceSheetRows, setBalanceSheetRows] = useState([]);
  const [incomeStatementRows, setIncomeStatementRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  const parseCSVFile = (file, fileType) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => {
          if (result.errors.length > 0) {
            reject("Error parsing CSV");
          } else {
            let rows = [];
            if (fileType === "balance_sheet") {
              rows = result.data.map((row) => ({
                date: row["date"] ? new Date(row["date"]) : new Date(),
                totalCurrentAssets: parseFloat(row["totalCurrentAssets"] || 0),
                totalCurrentLiabilities: parseFloat(row["totalCurrentLiabilities"] || 0),
                inventory: parseFloat(row["inventory"] || 0),
                totalLiabilities: parseFloat(row["totalLiabilities"] || 0),
                totalStockholdersEquity: parseFloat(row["totalStockholdersEquity"] || 0),
                netReceivables: parseFloat(row["netReceivables"] || 0),
                totalAssets: parseFloat(row["totalAssets"] || 0),
              }));
              setBalanceSheetRows(rows);
            } else if (fileType === "income_statement") {
              rows = result.data.map((row) => ({
                date: row["date"] ? new Date(row["date"]) : new Date(),
                revenue: parseFloat(row["revenue"] || 0),
                costOfRevenue: parseFloat(row["costOfRevenue"] || 0),
                operatingIncome: parseFloat(row["operatingIncome"] || 0),
                interestExpense: parseFloat(row["interestExpense"] || 0),
                incomeBeforeTax: parseFloat(row["incomeBeforeTax"] || 0),
                netIncome: parseFloat(row["netIncome"] || 0),
              }));
              setIncomeStatementRows(rows);
            }
            resolve(rows);
          }
        },
        header: true,
        skipEmptyLines: true,
      });
    });
  };

  const handleFileUpload = async (fileType, file) => {
    try {
      await parseCSVFile(file, fileType);
      toast.success(`${fileType} uploaded successfully`);
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }));
    } catch (error) {
      toast.error("Error processing CSV file");
      console.error(error);
    }
  };

  const triggerAnalysis = async () => {
    if (!uploadedFiles.balance_sheet || !uploadedFiles.income_statement) {
      toast.warn("Please upload both Balance Sheet and Income Statement");
      return;
    }

    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user._id : null;

      const balanceSheetPayload = {
        userId,
        name: "financial_data",
        rows: balanceSheetRows
      };

      const incomeStatementPayload = {
        userId,
        name: "financial_data",
        rows: incomeStatementRows
      };

      await createBalanceSheetTable(balanceSheetPayload);
      await createIncomeTable(incomeStatementPayload);
      await triggerUserAnalysis(userId);

      toast.success("Financial analysis completed successfully");
      setIsAnalysisComplete(true);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error.response?.data?.error || "Failed to complete financial analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row gap-4 p-4 justify-around dark:bg-gray-900 p-6">
      <div className="p-6 flex-2 w-3/5 mx-auto">

      <h2 className="text-xl text-blue-600 dark:text-blue-400 font-bold mb-4 text-center">Sample Data Format</h2>
        <h3 className="text-lg font-semibold mb-4 text-center">Income Statement</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 mb-8">
          <thead>
            <tr className="bg-gray-200">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleIncomeRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                  >
                    {row[column.toLowerCase().replace(/ /g, "")] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-lg font-semibold mb-4 text-center">Balance Sheet</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {balanceSheetColumns.map((column, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleBalanceSheetRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                {balanceSheetColumns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                  >
                    {row[column.toLowerCase().replace(/ /g, "")] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-sm text-gray-500 mt-4 dark:text-gray-200 text-center">
          * Please format your data to match the structure shown above.
        </p>
      </div>


      <div className="upload-section p-6 flex-1">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Upload Financial Data
          </h1>
        </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-6 p-4 justify-center align-center">
        <div>
          <h2 className="text-lg font-semibold mb-2">Balance Sheet</h2>
          <UploadCSV onFileUpload={(file) => handleFileUpload("balance_sheet", file)} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Income Statement</h2>
          <UploadCSV onFileUpload={(file) => handleFileUpload("income_statement", file)} />
        </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={triggerAnalysis}
            className={`px-6 py-3 text-white rounded-md ${
              uploadedFiles.balance_sheet && uploadedFiles.income_statement
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={isLoading || !uploadedFiles.balance_sheet || !uploadedFiles.income_statement}
          >
            {isLoading ? "Processing..." : "Trigger Financial Analysis"}
          </button>
        </div>
        </div>

        {isAnalysisComplete && (
          <div className="text-center mt-6">
            <Link
              to="/analysis"
              className="px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Check Analysed Data
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeS;


const sampleIncomeRows = [
  {
    date: "2024-01-01",
    revenue: "100000",
    costofrevenue: "60000",
    operatingincome: "25000",
    interestexpense: "5000",
    incomebeforetax: "20000",
    netincome: "15000",
  },
  {
    date: "2024-07-01",
    revenue: "130000",
    costofrevenue: "75000",
    operatingincome: "35000",
    interestexpense: "7000",
    incomebeforetax: "28000",
    netincome: "21000",
  },
];

const columns = [
  "Date",
  "Revenue",
  "Cost of Revenue",
  "Operating Income",
  "Interest Expense",
  "Income Before Tax",
  "Net Income",
];

const sampleBalanceSheetRows = [
  {
    date: "2024-04-01",
    totalcurrentassets: "55000",
    totalcurrentliabilities: "23000",
    inventory: "18000",
    totalliabilities: "42000",
    totalstockholdersequity: "8000",
    netreceivables: "18000",
    totalassets: "60000",
  },
  {
    date: "2024-07-01",
    totalcurrentassets: "60000",
    totalcurrentliabilities: "25000",
    inventory: "17000",
    totalliabilities: "46000",
    totalstockholdersequity: "14000",
    netreceivables: "22000",
    totalassets: "80000",
  },
];

const balanceSheetColumns = [
  "Date",
  "Total Current Assets",
  "Total Current Liabilities",
  "Inventory",
  "Total Liabilities",
  "Total Stockholders Equity",
  "Net Receivables",
  "Total Assets",
];