const FinancialData = require('../Models/FinancialData');

// Get all financial data for dashboard
exports.getFinancialData = async (req, res) => {
  try {
    // Get current date info
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Get monthly data for the current year
    const monthlyData = await FinancialData.aggregate([
      {
        $match: {
          year: currentYear
        }
      },
      {
        $group: {
          _id: {
            month: "$month",
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "revenue"] }, "$total", 0]
            }
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0]
            }
          }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Get category distribution for expenses
    const categoryData = await FinancialData.aggregate([
      {
        $match: {
          type: "expense",
          year: currentYear
        }
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          category: "$_id",
          amount: 1,
          _id: 0
        }
      }
    ]);

    // Get recent transactions
    const recentTransactions = await FinancialData.find()
      .sort({ date: -1 })
      .limit(10)
      .select('date description category amount type');

    // Calculate totals
    const totals = await FinancialData.aggregate([
      {
        $match: {
          year: currentYear
        }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue = totals.find(t => t._id === 'revenue')?.total || 0;
    const totalExpenses = totals.find(t => t._id === 'expense')?.total || 0;

    res.json({
      monthlyData: monthlyData.map(item => ({
        month: item._id,
        revenue: item.revenue,
        expenses: item.expenses
      })),
      categoryData,
      recentTransactions,
      totalRevenue,
      totalExpenses
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ message: 'Error fetching financial data' });
  }
};

// Add new financial data
exports.addFinancialData = async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const financialData = new FinancialData({
      type,
      amount,
      category,
      description,
      month,
      year
    });

    await financialData.save();
    res.status(201).json(financialData);
  } catch (error) {
    console.error('Error adding financial data:', error);
    res.status(500).json({ message: 'Error adding financial data' });
  }
}; 