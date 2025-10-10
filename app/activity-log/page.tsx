"use client";

import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ActivityLog = {
  _id: string;
  type: "order" | "product" | "user" | "erc";
  action: string;
  entityId: string;
  userId?: string;
  changes?: Record<string, any>;
  timestamp: string;
};

// Color map for entity types
const typeColors: Record<string, string> = {
  order: "bg-blue-100 text-blue-600",
  product: "bg-green-100 text-green-600",
  user: "bg-purple-100 text-purple-600",
  erc: "bg-orange-100 text-orange-600",
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/activity-log");
        const data = await res.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to load logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === "all" || log.type === filter;
    const matchesSearch =
      search === "" ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Activity Logs</h1>

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {["all", "order", "product", "user", "erc"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === t
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Logs list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No logs found</div>
        ) : (
          <ul className="divide-y">
            {filteredLogs.map((log) => (
              <li key={log._id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                      typeColors[log.type] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {log.type}
                  </span>
                  <p className="mt-1 text-sm font-medium">
                    {log.action} {log.type}{" "}
                    <span className="text-gray-500">({log.entityId})</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    by {log.userId || "system"} •{" "}
                    {formatDistanceToNow(new Date(log.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <pre className="bg-gray-50 text-xs text-gray-600 rounded-md p-2 overflow-x-auto max-w-full md:max-w-sm">
                  {JSON.stringify(log.changes, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
