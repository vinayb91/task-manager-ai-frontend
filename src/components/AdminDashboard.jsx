import React, { useState, useEffect } from "react";
import {
  Users,
  ListTodo,
  CheckCircle2,
  Clock,
  Bot,
  Volume2,
  AlertCircle,
  Save,
  ArrowLeft,
} from "lucide-react";
import {
  getAdminSettings,
  getAdminStats,
  updateAdminSettings,
} from "../api/api";

function AdminDashboard({ onBack }) {
  const [settings, setSettings] = useState({
    speech_enabled: true,
    gpt_model: "gpt-4o",
    max_tokens: 1000,
    voice_model: "tts-1",
    voice_enabled: true,
    max_tasks_per_user: 100,
  });

  const [stats, setStats] = useState({
    total_users: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
    loadStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getAdminSettings(token);
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getAdminStats(token);
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await updateAdminSettings(token, settings);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to App
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage application settings and view statistics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.total_users || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Tasks</h3>
              <ListTodo className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.total_tasks || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.completed_tasks || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.pending_tasks || 0}
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Settings</h2>
                <p className="text-sm text-gray-600">
                  Configure OpenAI models and tokens
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* GPT Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPT Model
                </label>
                <select
                  value={settings.gpt_model}
                  onChange={(e) => updateSetting("gpt_model", e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gpt-4o">GPT-4o (Best)</option>
                  <option value="gpt-4o-mini">
                    GPT-4o Mini (Faster, Cheaper)
                  </option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Current model for AI agent responses
                </p>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens: {settings.max_tokens}
                </label>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="100"
                  value={settings.max_tokens}
                  onChange={(e) =>
                    updateSetting("max_tokens", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher = longer responses, more cost
                </p>
              </div>

              {/* Max Tasks Per User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tasks Per User: {settings.max_tasks_per_user}
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={settings.max_tasks_per_user}
                  onChange={(e) =>
                    updateSetting(
                      "max_tasks_per_user",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Limit tasks to prevent abuse
                </p>
              </div>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Voice Settings
                </h2>
                <p className="text-sm text-gray-600">
                  Control text-to-speech features
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Voice Enabled */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Enable AI Voice</h3>
                  <p className="text-sm text-gray-600">
                    Allow text-to-speech responses
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting("voice_enabled", !settings.voice_enabled)
                  }
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.voice_enabled ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.voice_enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Speech Enabled */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Enable Speech Recognition
                  </h3>
                  <p className="text-sm text-gray-600">
                    Allow voice input from users
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting("speech_enabled", !settings.speech_enabled)
                  }
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.speech_enabled ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.speech_enabled
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Voice Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TTS Model
                </label>
                <select
                  value={settings.voice_model}
                  onChange={(e) => updateSetting("voice_model", e.target.value)}
                  disabled={!settings.voice_enabled}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="tts-1">TTS-1 (Faster)</option>
                  <option value="tts-1-hd">TTS-1-HD (Higher Quality)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {settings.voice_model === "tts-1"
                    ? "$0.015 per 1K chars"
                    : "$0.030 per 1K chars"}
                </p>
              </div>

              {/* Cost Warning */}
              {settings.voice_enabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-yellow-800 text-sm">
                        Voice enabled
                      </h4>
                      <p className="text-xs text-yellow-700">
                        This will consume OpenAI TTS tokens
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={loadSettings}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
          >
            Reset
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
