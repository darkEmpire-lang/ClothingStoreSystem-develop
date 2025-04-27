import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt,
} from '@mui/icons-material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FinanceDashboard = () => {
  const [financialData, setFinancialData] = useState({
    monthlyData: [],
    recentTransactions: [],
    totalRevenue: 0,
    totalExpenses: 0,
    categoryData: [],
  });

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const response = await axios.get('http://localhost:4058/api/financial-data');
      setFinancialData(response.data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  // Chart configurations
  const monthlyTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue vs Expenses',
      },
    },
  };

  const categoryDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Expense Distribution by Category',
      },
    },
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Financial Dashboard
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalance sx={{ mr: 1 }} />
                <Typography variant="h6">Total Revenue</Typography>
              </Box>
              <Typography variant="h4">${financialData.totalRevenue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fbe9e7' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Receipt sx={{ mr: 1 }} />
                <Typography variant="h6">Total Expenses</Typography>
              </Box>
              <Typography variant="h4">${financialData.totalExpenses.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Net Profit</Typography>
              </Box>
              <Typography variant="h4">
                ${(financialData.totalRevenue - financialData.totalExpenses).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingDown sx={{ mr: 1 }} />
                <Typography variant="h6">Profit Margin</Typography>
              </Box>
              <Typography variant="h4">
                {((financialData.totalRevenue - financialData.totalExpenses) / financialData.totalRevenue * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Line
              data={{
                labels: financialData.monthlyData.map(item => item.month),
                datasets: [
                  {
                    label: 'Revenue',
                    data: financialData.monthlyData.map(item => item.revenue),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                  {
                    label: 'Expenses',
                    data: financialData.monthlyData.map(item => item.expenses),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                  },
                ],
              }}
              options={monthlyTrendOptions}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Doughnut
              data={{
                labels: financialData.categoryData.map(item => item.category),
                datasets: [
                  {
                    data: financialData.categoryData.map(item => item.amount),
                    backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#4BC0C0',
                      '#9966FF',
                    ],
                  },
                ],
              }}
              options={categoryDistributionOptions}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions Table */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {financialData.recentTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell align="right" sx={{
                    color: transaction.type === 'expense' ? 'error.main' : 'success.main'
                  }}>
                    ${transaction.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FinanceDashboard; 