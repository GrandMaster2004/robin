import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const SummaryCards = () => {
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [recentTransaction, setRecentTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const [totalRes, categoryRes, recentRes] = await Promise.all([
          axios.get("/api/transactions/total-expenses"),
          axios.get("/api/transactions/category-breakdown"),
          axios.get("/api/transactions/recent"),
        ]);

        setTotalExpenses(totalRes.data.totalExpense);
        console.log(totalRes.data.totalExpense);

        setCategoryBreakdown(categoryRes.data);
        setRecentTransaction(recentRes.data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Expenses</Typography>
            <Typography variant="h4">${totalExpenses}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Category Breakdown</Typography>
            {categoryBreakdown.map((category) => (
              <Typography key={category.category || index}>
                {category.category}: ${category.amount}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Most Recent Transaction</Typography>
            {recentTransaction ? (
              <>
                {/* <Typography>{recentTransaction.description}</Typography> */}
                <Typography>${recentTransaction.amount}</Typography>
                <Typography>
                  {new Date(recentTransaction.date).toLocaleDateString()}
                </Typography>
              </>
            ) : (
              <Typography>No recent transactions.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
