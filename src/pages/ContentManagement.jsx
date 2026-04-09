import { useState, useEffect } from "react";
import { useContent } from "../hooks/useContent";
import { useApp } from "../context/AppContext";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { FormField, FInput } from "../components/ui/FormField";

/* ── shared styles ── */
const cardStyle = { 
  background: "rgba(255,253,247,0.04)", 
  border: "1px solid rgba(201,168,76,0.1)" 
};

const labelStyle = { color: "rgba(201,168,76,0.65)" };

const inputStyle = {
  background: "rgba(255,253,247,0.05)",
  border: "1px solid rgba(201,168,76,0.15)",
  color: "#f5ede0",
  fontFamily: "inherit",
};

/* ── Reusable Components ── */
function CmsInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={labelStyle}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm gold-ring transition-all duration-200"
        style={inputStyle}
      />
    </div>
  );
}

function CmsTextarea({ label, value, onChange, rows = 4, placeholder,name }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={labelStyle}>
          {label}
        </label>
      )}
      <textarea
      name={name}
        value={value || ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm gold-ring transition-all duration-200 resize-none"
        style={{ ...inputStyle, lineHeight: 1.65 }}
      />
    </div>
  );
}

function SectionHeader({ icon, title, actions }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
             style={{ background: "rgba(201,168,76,0.15)" }}>
          {icon}
        </div>
        <h2 className="font-display text-base font-semibold" style={{ color: "#f5ede0" }}>
          {title}
        </h2>
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

function Skeleton({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-10 rounded-xl animate-pulse"
             style={{ background: "rgba(255,255,255,0.05)", animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}

/* ====================== BLOG FORM ====================== */
function BlogForm({ initial = {}, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    content: initial.content || initial.description || "",
    excerpt: initial.excerpt || "",
    category: initial.category || "Wildlife",
    tag: initial.tag || "",
    readTime: initial.readTime || "6 min read",
    color: initial.color || "#2d7a4f",
    imageEmoji: initial.imageEmoji || "🌿",
    published: initial.published ?? true,
  });

  const [err, setErr] = useState("");

  const categories = ['Wildlife', 'Travel Guide', 'Conservation', 'Photography', 'Culture'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) { setErr("Title is required"); return; }
    if (!form.content.trim()) { setErr("Content is required"); return; }
    setErr("");
    onSave(form);
  };

  return (
    <div className="space-y-5">
      <FormField label="Blog Title *" error={err}>
        <FInput name="title" value={form.title} onChange={handleChange} placeholder="Enter compelling blog title" />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Category">
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-sm gold-ring" style={inputStyle}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </FormField>
        <FormField label="Tag">
          <FInput name="tag" value={form.tag} onChange={handleChange} placeholder="e.g. Summer Safari, Project Tiger" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Read Time">
          <FInput name="readTime" value={form.readTime} onChange={handleChange} placeholder="7 min read" />
        </FormField>

        <FormField label="Accent Color">
          <div className="flex gap-3 items-center">
            <input type="color" value={form.color} onChange={(e) => setForm(p => ({...p, color: e.target.value}))} className="w-12 h-10 rounded-lg cursor-pointer border border-white/20" />
            <input type="text" name="color" value={form.color} onChange={handleChange} placeholder="#2d7a4f" className="flex-1 px-3.5 py-2.5 rounded-xl text-sm gold-ring" style={inputStyle} />
          </div>
        </FormField>

        <FormField label="Emoji Icon">
          <input type="text" name="imageEmoji" value={form.imageEmoji} onChange={handleChange} placeholder="🐯 ☀️" className="w-full px-3.5 py-2.5 rounded-xl text-sm gold-ring" style={inputStyle} />
        </FormField>
      </div>

      <FormField label="Excerpt">
        <CmsTextarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} placeholder="Brief summary..." />
      </FormField>

      <FormField label="Full Content *">
        <CmsTextarea name="content" value={form.content} onChange={handleChange} rows={12} placeholder="Write full blog post (HTML supported)..." />
      </FormField>

      <label className="flex items-center gap-2 cursor-pointer text-sm pt-2">
        <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-emerald-500" />
        <span>Publish immediately</span>
      </label>

      <div className="flex gap-3 justify-end pt-6 border-t border-white/10">
        <Button variant="ghost-gold" onClick={onCancel}>Cancel</Button>
        <Button variant="green" onClick={handleSave} disabled={saving}>
          {saving ? "Saving Blog..." : (initial?.id || initial?._id) ? "Update Blog" : "Create Blog"}
        </Button>
      </div>
    </div>
  );
}

/* ====================== HOTEL FORM ====================== */
function HotelForm({ initial = {}, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    img: initial.img || "",
    tag: initial.tag || "",
    desc: initial.desc || "",
    sortOrder: initial.sortOrder ?? 0,
    isActive: initial.isActive ?? true,
  });

  const handleChange = (key) => (e) => {
    const value = key === "sortOrder" ? parseInt(e.target.value) || 0 : e.target.value;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleActiveChange = (e) => {
    setForm(prev => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Hotel Name is required!");
      return;
    }
    onSave(form);
  };

  return (
    <div className="space-y-5">
      <CmsInput label="Hotel Name *" value={form.name} onChange={handleChange("name")} placeholder="Wildlife Resort" />
      <CmsInput label="Hotel Image URL" value={form.img} onChange={handleChange("img")} placeholder="https://example.com/hotel.jpg" />
      <CmsInput label="Tag / Subtitle" value={form.tag} onChange={handleChange("tag")} placeholder="Luxury Wildlife Experience" />
      <CmsTextarea label="Hotel Description" value={form.desc} onChange={handleChange("desc")} rows={6} placeholder="Full description of the hotel..." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CmsInput label="Sort Order" type="number" value={form.sortOrder} onChange={handleChange("sortOrder")} placeholder="0" />

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={labelStyle}>Status</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm pt-3">
            <input type="checkbox" checked={form.isActive} onChange={handleActiveChange} className="w-4 h-4 accent-emerald-500" />
            <span>Active (visible on website)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-6 border-t border-white/10">
        <Button variant="ghost-gold" onClick={onCancel}>Cancel</Button>
        <Button variant="green" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : initial?.id ? "Update Hotel" : "Create Hotel"}
        </Button>
      </div>
    </div>
  );
}

/* ====================== MAIN PAGE ====================== */
export default function ContentManagement() {
  const appCtx = useApp();
  const toastFn = appCtx?.toast ?? null;

  const {
    blogs,
    hotels = [],           // Multiple hotels array
    addBlog,
    editBlog,
    removeBlog,
    flipPublish,
    addHotel,              // New
    updateHotel,           // New
    deleteHotel,           // New
    loading,
  } = useContent(toastFn);

  // Blog Modals
  const [blogAddOpen, setBlogAddOpen] = useState(false);
  const [blogEdit, setBlogEdit] = useState(null);
  const [blogDel, setBlogDel] = useState(null);

  // Hotel Modals
  const [hotelAddOpen, setHotelAddOpen] = useState(false);
  const [hotelEditOpen, setHotelEditOpen] = useState(false);
  const [hotelToEdit, setHotelToEdit] = useState(null);
  const [hotelDel, setHotelDel] = useState(null);

  // Saving States
  const [savingBlog, setSavingBlog] = useState(false);
  const [savingHotel, setSavingHotel] = useState(false);

  const withBlogSave = async (fn) => {
    setSavingBlog(true);
    try { await fn(); } finally { setSavingBlog(false); }
  };

  const withHotelSave = async (fn) => {
    setSavingHotel(true);
    try { await fn(); } finally { setSavingHotel(false); }
  };

  // Blog Handlers
  const handleSaveBlog = async (data) => {
    await withBlogSave(() => addBlog(data));
    setBlogAddOpen(false);
  };

  const handleUpdateBlog = async (id, data) => {
    await withBlogSave(() => editBlog(id, data));
    setBlogEdit(null);
  };

  // Hotel Handlers
  const handleSaveHotel = async (data) => {
    await withHotelSave(async () => {
      if (hotelToEdit?.id) {
        await updateHotel(hotelToEdit.id, data);
      } else {
        await addHotel(data);
      }
    });
    setHotelAddOpen(false);
    setHotelEditOpen(false);
    setHotelToEdit(null);
  };

  const handleDeleteHotel = async (id) => {
    if (deleteHotel) {
      await deleteHotel(id);
    }
    setHotelDel(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-12 anim-fadeup">

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#f5ede0" }}>
          Content Management
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>
          Manage blogs and hotels
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">

        {/* ====================== BLOG MANAGEMENT ====================== */}
        <div className="rounded-2xl p-6 space-y-4" style={cardStyle}>
          <SectionHeader
            icon="📝"
            title="Blog Management"
            actions={<Button variant="ghost-gold" onClick={() => setBlogAddOpen(true)}>+ Add Blog</Button>}
          />

          {loading ? (
            <Skeleton lines={3} />
          ) : blogs.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "rgba(245,237,224,0.4)" }}>
              No blog posts yet. Click "Add Blog".
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {blogs.map((blog) => {
                const bid = blog.id ?? blog._id;
                return (
                  <div key={bid} className="rounded-xl p-4" style={{ background: "rgba(255,253,247,0.04)", border: "1px solid rgba(201,168,76,0.08)" }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate" style={{ color: "#f5ede0" }}>{blog.title}</p>
                        <p className="text-xs mt-1" style={{ color: "rgba(201,168,76,0.5)" }}>{blog.createdAt?.split("T")[0] ?? "—"}</p>
                      </div>
                      <span className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-medium ${blog.published ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/25" : "text-amber-400 bg-amber-500/15 border border-amber-500/25"}`}>
                        {blog.published ? "Live" : "Draft"}
                      </span>
                    </div>

                    <p className="text-xs mb-4 line-clamp-2" style={{ color: "rgba(245,237,224,0.55)" }}>
                      {blog.description ?? blog.content ?? ""}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => withBlogSave(() => flipPublish(bid))} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(201,168,76,0.12)", color: "#e2c87a" }}>
                        {blog.published ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => setBlogEdit(blog)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(76,175,125,0.15)", color: "#6dd6a0" }}>Edit</button>
                      <button onClick={() => setBlogDel(blog)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(224,100,100,0.15)", color: "#e08080" }}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ====================== HOTEL MANAGEMENT (Multiple + Add/Edit/Delete) ====================== */}
        <div className="rounded-2xl p-6 space-y-4" style={cardStyle}>
          <SectionHeader
            icon="🏨"
            title="Hotel Management"
            actions={
              <Button variant="ghost-gold" onClick={() => { setHotelToEdit(null); setHotelAddOpen(true); }}>
                + Add Hotel
              </Button>
            }
          />

          {loading ? (
            <Skeleton lines={4} />
          ) : hotels.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "rgba(245,237,224,0.4)" }}>
              No hotels yet. Click "+ Add Hotel" to create one.
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="rounded-xl p-4 transition-all" style={{ background: "rgba(255,253,247,0.04)", border: "1px solid rgba(201,168,76,0.08)" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate" style={{ color: "#f5ede0" }}>{hotel.name}</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(201,168,76,0.5)" }}>{hotel.tag || "—"}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-medium ${hotel.isActive ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/25" : "text-amber-400 bg-amber-500/15 border border-amber-500/25"}`}>
                      {hotel.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {hotel.img && (
                    <img src={hotel.img} alt={hotel.name} className="mt-3 w-full h-40 object-cover rounded-xl" />
                  )}

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button onClick={() => { setHotelToEdit(hotel); setHotelEditOpen(true); }} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(76,175,125,0.15)", color: "#6dd6a0" }}>
                      Edit
                    </button>
                    <button onClick={() => setHotelDel(hotel)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(224,100,100,0.15)", color: "#e08080" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====================== MODALS ====================== */}

      {/* Blog Modals */}
      {blogAddOpen && (
        <Modal title="Add Blog Post" onClose={() => setBlogAddOpen(false)} size="lg">
          <BlogForm saving={savingBlog} onSave={handleSaveBlog} onCancel={() => setBlogAddOpen(false)} />
        </Modal>
      )}

      {blogEdit && (
        <Modal title="Edit Blog Post" onClose={() => setBlogEdit(null)} size="lg">
          <BlogForm initial={blogEdit} saving={savingBlog} onSave={(data) => handleUpdateBlog(blogEdit.id ?? blogEdit._id, data)} onCancel={() => setBlogEdit(null)} />
        </Modal>
      )}

      {blogDel && (
        <Modal title="Delete Blog Post" onClose={() => setBlogDel(null)} size="sm">
          <p className="text-sm mb-6" style={{ color: "rgba(245,237,224,0.7)" }}>
            Delete <strong style={{ color: "#e2c87a" }}>"{blogDel.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost-gold" onClick={() => setBlogDel(null)}>Cancel</Button>
            <Button variant="danger" onClick={async () => { await removeBlog(blogDel.id ?? blogDel._id); setBlogDel(null); }}>Delete</Button>
          </div>
        </Modal>
      )}

      {/* Hotel Modals */}
      {(hotelAddOpen || hotelEditOpen) && (
        <Modal title={hotelToEdit ? "Edit Hotel" : "Add New Hotel"} onClose={() => { setHotelAddOpen(false); setHotelEditOpen(false); setHotelToEdit(null); }} size="lg">
          <HotelForm 
            initial={hotelToEdit || {}} 
            onSave={handleSaveHotel} 
            onCancel={() => { setHotelAddOpen(false); setHotelEditOpen(false); setHotelToEdit(null); }} 
            saving={savingHotel} 
          />
        </Modal>
      )}

      {hotelDel && (
        <Modal title="Delete Hotel" onClose={() => setHotelDel(null)} size="sm">
          <p className="text-sm mb-6" style={{ color: "rgba(245,237,224,0.7)" }}>
            Delete hotel <strong style={{ color: "#e2c87a" }}>"{hotelDel.name}"</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost-gold" onClick={() => setHotelDel(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDeleteHotel(hotelDel.id)}>Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}