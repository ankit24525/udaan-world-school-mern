import { Bell, Building, Eye, EyeOff, Globe, MapPin, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";

const defaultSettings = {
  title: "Admin Settings",
  type: "page",
  key: "adminSettings",
  meta: {
    school: {
      name: "Udaan World School",
      tagline: "Empowering Minds, Shaping Futures",
      affiliation: "",
      schoolCode: "",
      about: "",
    },
    contact: {
      address: "",
      phone1: "",
      phone2: "",
      email: "",
      website: "",
    },
    social: {
      facebook: "",
      instagram: "",
      youtube: "",
    },
    notifications: {
      emailNotifications: true,
      smsAlerts: false,
    },
    security: {
      twoFactorEnabled: false,
    },
  },
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const defaultPasswordVisibility = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [admin, setAdmin] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(defaultPasswordVisibility);

  useEffect(() => {
    fetchSettings();
    fetchAdmin();
  }, []);

  async function fetchSettings() {
    try {
      const res = await api.get("/content", { params: { type: "page", key: "adminSettings" } });
      const saved = Array.isArray(res.data) ? res.data[0] : null;
      if (saved) {
        setSettings({
          ...defaultSettings,
          ...saved,
          meta: {
            ...defaultSettings.meta,
            ...(saved.meta || {}),
            school: { ...defaultSettings.meta.school, ...(saved.meta?.school || {}) },
            contact: { ...defaultSettings.meta.contact, ...(saved.meta?.contact || {}) },
            social: { ...defaultSettings.meta.social, ...(saved.meta?.social || {}) },
            notifications: { ...defaultSettings.meta.notifications, ...(saved.meta?.notifications || {}) },
            security: { ...defaultSettings.meta.security, ...(saved.meta?.security || {}) },
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchAdmin() {
    try {
      const res = await api.get("/auth/me");
      setAdmin(res.data?.admin || null);
    } catch (error) {
      console.error(error);
    }
  }

  function updateGroup(group, field, value) {
    setSettings((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [group]: {
          ...(prev.meta?.[group] || {}),
          [field]: value,
        },
      },
    }));
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    try {
      await api.post("/content", settings);
      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to save settings right now.");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    setPasswordMessage("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage("Fill all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage(res.data?.message || "Password updated successfully.");
      setPasswordForm(emptyPasswordForm);
      setPasswordVisibility(defaultPasswordVisibility);
    } catch (error) {
      console.error(error);
      setPasswordMessage(error.response?.data?.message || "Unable to update password.");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="w-full p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage school information, public contact details, social links and admin security.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="School Information" icon={Building}>
            <Input value={settings.meta.school.name} onChange={(v) => updateGroup("school", "name", v)} placeholder="School Name" />
            <Input value={settings.meta.school.tagline} onChange={(v) => updateGroup("school", "tagline", v)} placeholder="Tagline" />
            <div className="grid grid-cols-2 gap-4">
              <Input value={settings.meta.school.affiliation} onChange={(v) => updateGroup("school", "affiliation", v)} placeholder="Affiliation" />
              <Input value={settings.meta.school.schoolCode} onChange={(v) => updateGroup("school", "schoolCode", v)} placeholder="School Code" />
            </div>
            <TextArea value={settings.meta.school.about} onChange={(v) => updateGroup("school", "about", v)} placeholder="About" rows={4} />
          </Card>

          <Card title="Contact Information" icon={MapPin}>
            <TextArea value={settings.meta.contact.address} onChange={(v) => updateGroup("contact", "address", v)} placeholder="Address" rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Input value={settings.meta.contact.phone1} onChange={(v) => updateGroup("contact", "phone1", v)} placeholder="Phone 1" />
              <Input value={settings.meta.contact.phone2} onChange={(v) => updateGroup("contact", "phone2", v)} placeholder="Phone 2" />
            </div>
            <Input value={settings.meta.contact.email} onChange={(v) => updateGroup("contact", "email", v)} placeholder="School Email" />
            <p className="text-sm text-gray-500">This school email is used in the public footer and contact details.</p>
            <Input value={settings.meta.contact.website} onChange={(v) => updateGroup("contact", "website", v)} placeholder="Website" />
          </Card>

          <Card title="Social Media Links" icon={Globe}>
            <Input value={settings.meta.social.facebook} onChange={(v) => updateGroup("social", "facebook", v)} placeholder="Facebook URL" />
            <Input value={settings.meta.social.instagram} onChange={(v) => updateGroup("social", "instagram", v)} placeholder="Instagram URL" />
            <Input value={settings.meta.social.youtube} onChange={(v) => updateGroup("social", "youtube", v)} placeholder="YouTube URL" />
            <p className="text-sm text-gray-500">These links are used in the website navbar, footer and social strip.</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Admin Profile" icon={User}>
            <Input value={admin?.name || ""} onChange={() => {}} placeholder="Name" disabled />
            <Input value={admin?.email || ""} onChange={() => {}} placeholder="Email" disabled />
            <p className="text-sm text-gray-500">Admin identity is loaded from the active login session.</p>
          </Card>

          <Card title="Notifications" icon={Bell}>
            <ToggleRow label="Email Notifications" checked={Boolean(settings.meta.notifications.emailNotifications)} onChange={(checked) => updateGroup("notifications", "emailNotifications", checked)} />
            <ToggleRow label="SMS Alerts" checked={Boolean(settings.meta.notifications.smsAlerts)} onChange={(checked) => updateGroup("notifications", "smsAlerts", checked)} />
          </Card>

          <Card title="Security" icon={Shield}>
            <ToggleRow label="Two-Factor Preference" checked={Boolean(settings.meta.security.twoFactorEnabled)} onChange={(checked) => updateGroup("security", "twoFactorEnabled", checked)} />
            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-semibold text-gray-900">Reset Admin Password</p>
              <PasswordInput
                value={passwordForm.currentPassword}
                onChange={(v) => setPasswordForm((prev) => ({ ...prev, currentPassword: v }))}
                placeholder="Current Password"
                visible={passwordVisibility.currentPassword}
                onToggle={() =>
                  setPasswordVisibility((prev) => ({
                    ...prev,
                    currentPassword: !prev.currentPassword,
                  }))
                }
              />
              <PasswordInput
                value={passwordForm.newPassword}
                onChange={(v) => setPasswordForm((prev) => ({ ...prev, newPassword: v }))}
                placeholder="New Password"
                visible={passwordVisibility.newPassword}
                onToggle={() =>
                  setPasswordVisibility((prev) => ({
                    ...prev,
                    newPassword: !prev.newPassword,
                  }))
                }
              />
              <PasswordInput
                value={passwordForm.confirmPassword}
                onChange={(v) => setPasswordForm((prev) => ({ ...prev, confirmPassword: v }))}
                placeholder="Confirm New Password"
                visible={passwordVisibility.confirmPassword}
                onToggle={() =>
                  setPasswordVisibility((prev) => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
              />
              <button onClick={changePassword} disabled={changingPassword} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60">
                {changingPassword ? "Updating Password..." : "Update Password"}
              </button>
              {passwordMessage ? <p className={`text-sm ${passwordMessage.toLowerCase().includes("success") || passwordMessage.toLowerCase().includes("updated") ? "text-green-600" : "text-red-600"}`}>{passwordMessage}</p> : null}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className={`text-sm ${message.includes("Unable") ? "text-red-600" : "text-green-600"}`}>{message}</p>
        <div className="flex gap-4">
          <button onClick={fetchSettings} className="rounded-lg border px-6 py-3">Reset</button>
          <button onClick={saveSettings} disabled={saving} className="rounded-lg bg-[#C3292D] px-6 py-3 text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <Icon className="h-5 w-5 text-[#C3292D]" />
          {title}
        </h2>
      </div>
      <div className="space-y-4 p-6">{children}</div>
    </div>
  );
}

function Input({ value, onChange, placeholder, disabled = false, type = "text" }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-full rounded-lg border border-gray-300 px-4 py-2 disabled:bg-gray-100" placeholder={placeholder} />;
}

function PasswordInput({ value, onChange, placeholder, visible, onToggle }) {
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-12"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 transition hover:text-gray-700"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-gray-300 px-4 py-2" placeholder={placeholder} />;
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex justify-between gap-4 text-sm text-gray-700">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
