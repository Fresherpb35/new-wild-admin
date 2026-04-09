import { useState, useEffect } from "react";
import { useBookings } from "../hooks/useBookings";
import { useApp } from "../context/AppContext";
import { downloadBookingsCSV } from "../utils/csv";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { FormField, FInput, FSelect } from "../components/ui/FormField";

const STATUSES = ["CONFIRMED", "PENDING", "CANCELLED"];

const EMPTY_BOOKING = {
  name: "",
  email: "",
  phone: "",
  safariDate: "",
  safariType: "GYPSY",
  safariZone: "Zone 1",
  safariTime: "MORNING",
  status: "PENDING",
  notes: "",
};

function SkeletonRow({ cols = 11 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div
            className="h-4 rounded animate-pulse"
            style={{ background: "rgba(255,255,255,0.06)", width: i === 0 ? "32px" : "90%" }}
          />
        </td>
      ))}
    </tr>
  );
}

function BookingForm({ initial = {}, onSave, onCancel, title, saving }) {
  const [form, setForm] = useState({ ...EMPTY_BOOKING, ...initial });
  const [errors, setErrors] = useState({});

  // Reset form when initial data changes (Critical for Edit mode)
  useEffect(() => {
    setForm({ ...EMPTY_BOOKING, ...initial });
    setErrors({});
  }, [initial]);

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Guest name is required";
    if (!form.email?.trim() || !form.email.includes("@")) e.email = "Valid email is required";
    if (!form.phone?.trim()) e.phone = "Phone number is required";
    if (!form.safariDate) e.safariDate = "Safari date is required";
    return e;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Guest Name" error={errors.name}>
          <FInput value={form.name} onChange={set("name")} placeholder="Full name" />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <FInput type="email" value={form.email} onChange={set("email")} placeholder="guest@example.com" />
        </FormField>

        <FormField label="Phone" error={errors.phone}>
          <FInput value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
        </FormField>

        <FormField label="Safari Date" error={errors.safariDate}>
          <FInput type="date" value={form.safariDate} onChange={set("safariDate")} />
        </FormField>

        <FormField label="Safari Type">
          <FSelect value={form.safariType} onChange={set("safariType")}>
            <option value="GYPSY">GYPSY</option>
            <option value="CANTER">CANTER</option>
          </FSelect>
        </FormField>

        <FormField label="Safari Zone">
          <FSelect value={form.safariZone} onChange={set("safariZone")}>
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i + 1} value={`Zone ${i + 1}`}>
                Zone {i + 1}
              </option>
            ))}
          </FSelect>
        </FormField>

        <FormField label="Safari Time">
          <FSelect value={form.safariTime} onChange={set("safariTime")}>
            <option value="MORNING">MORNING</option>
            <option value="EVENING">EVENING</option>
          </FSelect>
        </FormField>

        <FormField label="Status">
          <FSelect value={form.status} onChange={set("status")}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </FSelect>
        </FormField>

        <FormField label="Notes" className="sm:col-span-2">
          <FInput
            as="textarea"
            rows={3}
            value={form.notes || ""}
            onChange={set("notes")}
            placeholder="Any special requests or notes..."
          />
        </FormField>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="ghost-gold" onClick={onCancel}>Cancel</Button>
        <Button variant="green" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : title}
        </Button>
      </div>
    </div>
  );
}

// Status Stats Cards
const STATUS_STATS = [
  { key: "confirmed", label: "Confirmed", bg: "rgba(76,175,125,0.15)", text: "#6dd6a0", border: "rgba(76,175,125,0.25)" },
  { key: "pending", label: "Pending", bg: "rgba(224,160,64,0.15)", text: "#e8b060", border: "rgba(224,160,64,0.25)" },
  { key: "cancelled", label: "Cancelled", bg: "rgba(224,100,100,0.15)", text: "#e08080", border: "rgba(224,100,100,0.25)" },
];

export default function BookingManagement() {
  const { toast } = useApp();

  const {
    filtered,
    stats,
    loading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    selected,
    toggleSelect,
    toggleAll,
    addBooking,
    editBooking,
    removeBooking,
    removeSelected,
  } = useBookings();

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [delItem, setDelItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const withSaving = async (fn, successMsg, errMsg, onDone) => {
    setSaving(true);
    try {
      await fn();
      toast(successMsg);
      onDone?.();
    } catch (e) {
      toast(e.message || errMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 anim-fadeup">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#f5ede0" }}>
            Safari Booking Management
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>
            {loading ? "Loading..." : `${filtered.length} bookings shown`}
          </p>
        </div>
        <Button variant="gold" onClick={() => setAddOpen(true)}>+ Add Booking</Button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(180,40,40,0.18)", border: "1px solid rgba(255,100,100,0.2)", color: "#e08080" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Status Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {STATUS_STATS.map((s) => (
          <div key={s.key} className="rounded-xl px-4 py-4" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: s.text, opacity: 0.85 }}>{s.label}</p>
            {loading ? (
              <div className="h-8 w-12 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
            ) : (
              <p className="text-2xl font-semibold" style={{ color: s.text }}>{stats[s.key] || 0}</p>
            )}
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(201,168,76,0.5)" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm gold-ring"
            style={{ background: "rgba(255,253,247,0.05)", border: "1px solid rgba(201,168,76,0.18)", color: "#f5ede0" }}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-5 py-3 rounded-2xl text-sm gold-ring"
          style={{ background: "rgba(255,253,247,0.05)", border: "1px solid rgba(201,168,76,0.18)", color: "#f5ede0" }}
        >
          {["All", "CONFIRMED", "PENDING", "CANCELLED"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr style={{ background: "rgba(201,168,76,0.08)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4"
                  />
                </th>
                {["Booking ID", "Name", "Email", "Phone", "Safari Date", "Type", "Zone", "Time", "Status", "Notes", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 text-left text-xs font-semibold tracking-widest uppercase whitespace-nowrap"
                    style={{ color: "rgba(201,168,76,0.65)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={11} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-16 text-center text-sm" style={{ color: "rgba(245,237,224,0.4)" }}>
                    No bookings found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const bid = b.id || b._id; // safer
                  const isSel = selected.includes(bid);

                  return (
                    <tr
                      key={bid}
                      className="transition-colors"
                      style={{
                        borderBottom: "1px solid rgba(201,168,76,0.06)",
                        background: isSel ? "rgba(201,168,76,0.06)" : "transparent",
                      }}
                    >
                      <td className="px-4 py-4">
                        <input type="checkbox" checked={isSel} onChange={() => toggleSelect(bid)} className="w-4 h-4" />
                      </td>
                      <td className="px-4 py-4 text-xs font-mono break-all" style={{ color: "rgba(201,168,76,0.75)", maxWidth: "140px" }}>
                        {bid}
                      </td>
                      <td className="px-4 py-4 font-medium" style={{ color: "#f5ede0" }}>{b.name}</td>
                      <td className="px-4 py-4 text-sm" style={{ color: "rgba(245,237,224,0.65)" }}>{b.email}</td>
                      <td className="px-4 py-4 text-sm" style={{ color: "rgba(245,237,224,0.65)" }}>{b.phone}</td>
                      <td className="px-4 py-4 whitespace-nowrap" style={{ color: "rgba(245,237,224,0.7)" }}>
                        {b.safariDate ? new Date(b.safariDate).toLocaleDateString("en-IN") : "-"}
                      </td>
                      <td className="px-4 py-4 font-medium" style={{ color: "#e2c87a" }}>{b.safariType || "-"}</td>
                      <td className="px-4 py-4" style={{ color: "rgba(245,237,224,0.7)" }}>{b.safariZone || "-"}</td>
                      <td className="px-4 py-4" style={{ color: "rgba(245,237,224,0.7)" }}>{b.safariTime || "-"}</td>
                      <td className="px-4 py-4">
                        <Badge status={b.status} />
                      </td>
                      <td className="px-4 py-4 text-sm max-w-[180px] truncate" style={{ color: "rgba(245,237,224,0.6)" }}>
                        {b.notes || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditItem(b)}
                            className="px-3 py-1.5 text-xs rounded-lg"
                            style={{ background: "rgba(76,175,125,0.12)", border: "1px solid rgba(76,175,125,0.3)", color: "#6dd6a0" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDelItem(b)}
                            className="px-3 py-1.5 text-xs rounded-lg"
                            style={{ background: "rgba(224,100,100,0.12)", border: "1px solid rgba(224,100,100,0.3)", color: "#e08080" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {selected.length > 0 && (
          <span className="text-sm px-4 py-2 rounded-xl" style={{ background: "rgba(201,168,76,0.1)", color: "#e2c87a" }}>
            {selected.length} selected
          </span>
        )}
        {selected.length > 0 && (
          <Button
            variant="ghost-red"
            onClick={() => withSaving(removeSelected, `${selected.length} bookings deleted`, "Bulk delete failed")}
          >
            🗑 Delete Selected
          </Button>
        )}
        <Button variant="ghost-gold" onClick={() => downloadBookingsCSV(filtered)}>
          ⬇ Download CSV
        </Button>
      </div>

      {/* Modals */}
      {addOpen && (
        <Modal title="Add New Safari Booking" onClose={() => setAddOpen(false)} size="lg">
          <BookingForm
            title="Add Booking"
            saving={saving}
            onSave={(data) => withSaving(
              () => addBooking(data),
              "Booking added successfully",
              "Failed to add booking",
              () => setAddOpen(false)
            )}
            onCancel={() => setAddOpen(false)}
          />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Safari Booking" onClose={() => setEditItem(null)} size="lg">
          <BookingForm
            initial={editItem}
            title="Save Changes"
            saving={saving}
            onSave={(data) => withSaving(
              () => editBooking(editItem.id || editItem._id, data),   // safer id handling
              "Booking updated successfully",
              "Failed to update booking",
              () => setEditItem(null)
            )}
            onCancel={() => setEditItem(null)}
          />
        </Modal>
      )}

      {delItem && (
        <Modal title="Confirm Delete" onClose={() => setDelItem(null)} size="sm">
          <p className="text-sm mb-6" style={{ color: "rgba(245,237,224,0.8)" }}>
            Delete booking for <strong style={{ color: "#e2c87a" }}>{delItem.name}</strong>?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost-gold" onClick={() => setDelItem(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => withSaving(
                () => removeBooking(delItem.id || delItem._id),
                "Booking deleted successfully",
                "Delete failed",
                () => setDelItem(null)
              )}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}