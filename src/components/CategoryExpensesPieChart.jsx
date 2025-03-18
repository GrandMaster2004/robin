import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const CategoryExpensesPieChart = ({ onCategoryClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryExpenses = async () => {
      try {
        const res = await axios.get("/api/transactions/category-expenses");
        console.log("Fetched Category Expenses: ", res.data);
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Failed to fetch category expenses", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryExpenses();
  }, []);

  const handlePieClick = (entry, index) => {
    if (onCategoryClick) {
      onCategoryClick(entry.category); // Pass category name
    }
  };

  return (
    <Card sx={{ width: "90%", margin: "2rem auto", padding: "1rem" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Category-wise Expenses
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : data.length === 0 ? (
          <Typography>No category data available.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="expense"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
                onClick={handlePieClick}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    cursor="pointer"
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" align="center" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryExpensesPieChart;
