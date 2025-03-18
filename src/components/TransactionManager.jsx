import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Card,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/api";

const schema = z.object({
  amount: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(1, "Amount is required")
  ),
  description: z
    .string()
    .min(1, "Description is required")
    .refine((val) => val.trim().split(/\s+/).length <= 1000, {
      message: "Description must be 1000 words or less",
    }),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
});

export default function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, description: "", date: "", category: "" },
  });

  const fetchData = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTransaction) {
      const formattedTransaction = {
        ...selectedTransaction,
        date: new Date(selectedTransaction.date).toISOString().split("T")[0],
      };
      reset(formattedTransaction);
    } else {
      reset({ amount: 0, description: "", date: "", category: "" });
    }
  }, [selectedTransaction, reset]);

  const onSubmit = async (data) => {
    if (selectedTransaction) {
      await updateTransaction(selectedTransaction._id, data);
      setSelectedTransaction(null);
    } else {
      await addTransaction(data);
    }
    fetchData();
    reset();
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchData();
  };

  const inputStyles = {
    input: { color: "white" },
  };

  const labelStyle = { color: "black" };

  const borderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black",
      },
      "&:hover fieldset": {
        borderColor: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
    },
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "auto", padding: "2rem" }}>
      <Typography variant="h5" gutterBottom sx={{ color: "black" }}>
        {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}
      >
        <TextField
          required
          label="Amount"
          {...register("amount", { valueAsNumber: true })}
          type="number"
          InputProps={{ style: inputStyles.input }}
          InputLabelProps={{ style: labelStyle }}
          sx={borderStyle}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />
        <TextField
          required
          label="Date"
          type="date"
          {...register("date")}
          InputProps={{ style: inputStyles.input }}
          InputLabelProps={{ shrink: true, style: labelStyle }}
          sx={borderStyle}
          error={!!errors.date}
          helperText={errors.date?.message}
        />
        <TextField
          required
          label="Description"
          {...register("description")}
          InputProps={{ style: inputStyles.input }}
          InputLabelProps={{ style: labelStyle }}
          sx={borderStyle}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          required
          label="Category"
          select
          {...register("category")}
          InputProps={{ style: inputStyles.input }}
          InputLabelProps={{ style: labelStyle }}
          sx={{ ...borderStyle, "& .MuiSelect-select": { padding: "12px" } }}
          error={!!errors.category}
          helperText={errors.category?.message}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Travel">Travel</MenuItem>
          <MenuItem value="Bills">Bills</MenuItem>
          <MenuItem value="Shopping">Shopping</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          type="submit"
          sx={{ color: "black", borderColor: "black", mt: 1 }}
        >
          {selectedTransaction ? "Update" : "Add"}
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ color: "black" }}>
        Transaction List
      </Typography>
      {transactions.map((txn) => (
        <Card key={txn._id} sx={{ mb: 2, p: 2, border: "1px solid black" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ color: "black" }}>
              {new Date(txn.date).toLocaleDateString()}
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              ₹{txn.amount}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "black", mb: 1 }}>
            {txn.description}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip label={txn.category} color="primary" size="small" />
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="info"
                size="small"
                onClick={() => setSelectedTransaction(txn)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(txn._id)}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
