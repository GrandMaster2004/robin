import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import dayjs from "dayjs";

const BudgetComparisonChart = ({
  month = dayjs().month() + 1,
  year = dayjs().year(),
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        // Hardcoded local API endpoints
        const budgetsRes = await axios.get(
          "http://localhost:5000/api/category-budget"
        );
        const transactionsRes = await axios.get(
          `http://localhost:5000/api/transactions?month=${month}&year=${year}`
        );

        // Merge budgets & transactions
        const mergedData = budgetsRes.data.map((budget) => {
          const actual = transactionsRes.data
            .filter((t) => t.category === budget.category) // Only check category
            .reduce((sum, t) => sum + Number(t.amount), 0);

          return {
            category: budget.category,
            Budgeted: Number(budget.budgetAmount),
            Actual: actual,
          };
        });

        setData(mergedData);
      } catch (err) {
        console.error("Error fetching comparison data:", err);
      }
    };

    fetchComparison();
  }, [month, year]);

  return (
    <ResponsiveContainer width="100%" height={300}>
        
      <BarChart data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Budgeted" fill="#8884d8" />
        <Bar dataKey="Actual" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetComparisonChart;
