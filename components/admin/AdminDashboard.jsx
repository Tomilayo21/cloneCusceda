"use client";
import React, {useState, useEffect} from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Users,
  DollarSign,
  TrendingUp,
  Rocket,
  FileBarChart,
  CreditCard,
  UserCheck,
  Eye, 
  EyeOff,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import MiniChart from "./settings/charts/MiniChart";
import DashboardChart from "./settings/charts/DashboardChart";


export default function AdminDashboard({ setActiveView, setActiveTab, setUserPanel, setOrderPanel }) {
    const [userCount, setUserCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const { currency } = useAppContext();
    const [statsData, setStats] = useState([]);
    const [totalDeposit, setTotalDeposit] = useState(0);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [dailyTrendData, setDailyTrendData] = useState([]);
    const [monthlyTrendData, setMonthlyTrendData] = useState([]);
    const [todayTransactionCount, setTodayTransactionCount] = useState(0);
    const [yesterdayTransactionCount, setYesterdayTransactionCount] = useState(0);
    const [showIcons, setShowIcons] = useState(true);

  



    useEffect(() => {
        const fetchUserCount = async () => {
        try {
            const res = await fetch("/api/clerk-users"); // your API route
            const data = await res.json();
            if (Array.isArray(data)) {
            setUserCount(data.length); // 👈 Set count
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
        };

        fetchUserCount();
    }, []);

    useEffect(() => {
        const fetchSubscribers = async () => {
        try {
            const res = await fetch("/api/admin/subscribers");
            const data = await res.json();
            if (Array.isArray(data)) {
            setSubscriberCount(data.length);
            }
        } catch (err) {
            console.error("Failed to fetch subscribers", err);
        }
        };
        fetchSubscribers();
    }, []);

    useEffect(() => {
        const fetchMonthlyDeposit = async () => {
            try {
            const res = await fetch("/api/admin/transactions?page=1&limit=1000");
            const data = await res.json();
            const transactions = data.transactions || [];

            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            const total = transactions.reduce((acc, txn) => {
                const txnDate = new Date(txn.date);
                return txnDate >= oneMonthAgo ? acc + txn.amount : acc;
            }, 0);

            setMonthlyTotal(total);
            } catch (error) {
            console.error("Failed to fetch monthly deposit", error);
            }
        };

        fetchMonthlyDeposit();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await fetch("/api/stats/growth");
            const data = await res.json();
            setStats(data);
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const fetchDepositStats = async () => {
            try {
            const res = await fetch("/api/admin/transactions?page=1&limit=1");
            const data = await res.json();

            setTotalDeposit(data.totalAmount || 0);
            setMonthlyTotal(data.last30DaysAmount || 0);
            setDailyTotal(data.last24HoursAmount || 0);
            setDailyTrendData(data.dailyTrend || []);
            setMonthlyTrendData(data.monthlyTrend || []);
            setTodayTransactionCount(data.todayCount || 0);
            setYesterdayTransactionCount(data.yesterdayCount || 0);

            } catch (error) {
            console.error("Failed to fetch deposit stats", error);
            }
        };

        fetchDepositStats();
    }, []);

    const monthlyPercentage = totalDeposit > 0
    ? ((monthlyTotal / totalDeposit) * 100).toFixed(1)
    : "0.0";

    const dailyPercentageOfMonth = monthlyTotal > 0
    ? ((dailyTotal / monthlyTotal) * 100).toFixed(1)
    : "0.0";

    const dailyPercentageOfTotal = totalDeposit > 0
    ? ((dailyTotal / totalDeposit) * 100).toFixed(1)
    : "0.0";

    function calculateChangePercentage(monthlyStats, totalDeposit) {
        if (monthlyStats.length === 0 || totalDeposit === 0) return "0.0%";

        // Sort by most recent
        const sorted = [...monthlyStats].sort((a, b) => {
            const aDate = new Date(`${a._id.year}-${a._id.month}-01`);
            const bDate = new Date(`${b._id.year}-${b._id.month}-01`);
            return bDate - aDate;
        });

        const current = sorted[0]?.total || 0;

        const percentage = (current / totalDeposit) * 100;
        return `${percentage.toFixed(1)}%`;
    }

    const transactionChange = yesterdayTransactionCount === 0
    ? todayTransactionCount > 0
        ? "100.0"
        : "0.0"
    : (((todayTransactionCount - yesterdayTransactionCount) / yesterdayTransactionCount) * 100).toFixed(1);

    const growthPercentage = totalDeposit > 0
    ? ((monthlyTotal / totalDeposit) * 100).toFixed(1)
    : "0.0";

  const stats = [
    {
      title: "Total Users",
      value: userCount.toString(),
      change: "+100%",
        icon: <Users className="w-6 h-6 text-gray-600" />,
      onClick: () => {
        setActiveTab("users");
        // setUserPanel("main");
        setActiveView("settings");
      },
    },
    {
      title: "Active Subscribers",
      value: subscriberCount.toString(),
      change: `${((subscriberCount / userCount) * 100).toFixed(1)}%`,
      icon: <UserCheck className="w-6 h-6  text-gray-600" />,
      onClick: () => {
        setActiveTab("users");
        setUserPanel("subscribers");
        setActiveView("settings");
      },
    },
    {
        title: "Total Deposit",
        value: `${currency}${totalDeposit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`,
        change: `${monthlyPercentage}%`,
        icon: <DollarSign className="w-6 h-6  text-gray-600" />,
    },

    {
      title: "Monthly Deposit",
        value: `${currency}${monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: calculateChangePercentage(monthlyTrendData, totalDeposit),
        icon: <FileBarChart className="w-6 h-6  text-gray-600" />,
      onClick: () => {
        setActiveTab("orders");
        setOrderPanel("transactions");
        setActiveView("settings");
      },
    },
    {
      title: "Daily Transaction",
      value: todayTransactionCount.toString(),
      change: `${transactionChange >= 0 ? "+" : ""}${transactionChange}%`,
      icon: <CreditCard className="w-6 h-6  text-gray-600" />,
      onClick: () => {
        setActiveTab("orders");
        setOrderPanel("transactions");
        setActiveView("settings");
      },
    },
    {
        title: "Daily Deposit",
        value: `${currency}${dailyTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`,
        change: `${dailyPercentageOfMonth}%`,
        icon: <TrendingUp className="w-6 h-6 text-grey-600" />,
        chart: true,
        onClick: () => {
            setActiveTab("orders");
            setOrderPanel("transactions");
            setActiveView("settings");
        },
    },
    {
      title: "Growth",
      value: `${growthPercentage}%`,
      change: "",
      icon: <Rocket className="w-6 h-6  text-gray-600" />,
    },
  ];

  return (
    <div className="min-h-screen w-full flex bg-gray-100">
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6">
        {/* Header */}
        <AdminHeader />
          <button
            onClick={() => setShowIcons(!showIcons)}
            className="bg-black text-white px-3 py-1 mb-2 rounded hover:bg-blue-600 transition text-sm flex items-center gap-1"
          >
            {showIcons ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hide Icons</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Show Icons</span>
              </>
            )}
          </button>

        {/* First Row - Same Size Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transition h-40 ${
                item.onClick ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {showIcons && <span className="text-xl">{item.icon}</span>}
                <span className="text-sm text-orange-600">{item.change}</span>
              </div>
              <h3 className="text-sm text-gray-500">{item.title}</h3>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Second Row - Uneven Width Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.slice(3).map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transition h-40 ${
                idx === 0 ? "sm:col-span-2" : "sm:col-span-1"
              } ${item.onClick ? "cursor-pointer" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                {showIcons && <span className="text-xl">{item.icon}</span>}
                <span className="text-sm text-orange-600">{item.change}</span>
                
              </div>
              <div>
                <h3 className="text-sm text-gray-500">{item.title}</h3>
              <p className="text-xl font-bold">{item.value}</p>
              {item.chart && <MiniChart data={dailyTrendData} />}
              </div>
              
            </div>

          ))}
        </div>
        {/* Chart Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <DashboardChart
            dailyTrend={dailyTrendData}
            monthlyTrend={monthlyTrendData}
        />
        </div>

      </main>
    </div>
  );
}
