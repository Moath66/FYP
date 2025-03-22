const getDashboard = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Admin Dashboard Data",
      data: {
        totalUsers: 100,
        reportsPending: 5,
        systemHealth: "Good",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getDashboard };
