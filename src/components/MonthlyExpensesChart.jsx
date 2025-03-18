import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Box,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

const MonthlyExpensesChart = ({ text }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("/api/transactions/monthly-expenses");
        console.log("Fetched Data:", res.data);

        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Failed to fetch monthly expenses", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <Card
      sx={{
        width: "90%", // 👈 sets width to 90%
        margin: "2rem auto", // centers the card horizontally
        padding: "1rem",
      }}
    >
      <Container>
        <Typography variant="h6">{text}</Typography>

        {loading ? (
          <CircularProgress />
        ) : data.length === 0 ? (
          <Typography>No expense data available.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expense" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Container>
    </Card>
  );
};

export default MonthlyExpensesChart;
