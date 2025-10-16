"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch current preferences
  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        const data = await res.json();
        setPrefs(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  // ✅ Update preference instantly
  const updatePref = async (path, value) => {
    if (!prefs) return;
    const updated = { ...prefs };
    const keys = path.split(".");
    let ref = updated;
    for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
    ref[keys[keys.length - 1]] = value;

    setPrefs(updated);

    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      toast.success("Preferences updated");
    } catch {
      toast.error("Failed to update preference");
    }
  };

  if (loading) return <p>Loading preferences...</p>;
  if (!prefs) return <p>No preferences found</p>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Choose which updates you’d like to receive by email.
      </p>

      {/* Orders */}
      <Section title="Orders">
        <Checkbox
          label="Email on New Order"
          checked={prefs.orders.newOrder}
          onChange={(v) => updatePref("orders.newOrder", v)}
        />
        <Checkbox
          label="Email on Order Shipped"
          checked={prefs.orders.shipped}
          onChange={(v) => updatePref("orders.shipped", v)}
        />
        <Checkbox
          label="Email on Order Delivered"
          checked={prefs.orders.delivered}
          onChange={(v) => updatePref("orders.delivered", v)}
        />
      </Section>

      {/* Reviews */}
      <Section title="Reviews">
        <Checkbox
          label="Email on New Review"
          checked={prefs.reviews.newReview}
          onChange={(v) => updatePref("reviews.newReview", v)}
        />
        <Checkbox
          label="Email on Review Approval"
          checked={prefs.reviews.reviewApproval}
          onChange={(v) => updatePref("reviews.reviewApproval", v)}
        />
      </Section>

      {/* Stock Alerts */}
      <Section title="Stock Alerts">
        <Checkbox
          label="Email on Low Stock"
          checked={prefs.stockAlerts.lowStock}
          onChange={(v) => updatePref("stockAlerts.lowStock", v)}
        />
        <Checkbox
          label="Email on Out-of-Stock Product"
          checked={prefs.stockAlerts.outOfStock}
          onChange={(v) => updatePref("stockAlerts.outOfStock", v)}
        />
      </Section>

      {/* Marketing */}
      <Section title="Marketing">
        <Checkbox
          label="Receive Newsletter"
          checked={prefs.marketing.newsletter}
          onChange={(v) => updatePref("marketing.newsletter", v)}
        />
        <Checkbox
          label="Receive Promotional Offers"
          checked={prefs.marketing.promotions}
          onChange={(v) => updatePref("marketing.promotions", v)}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-orange-600 w-4 h-4"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
