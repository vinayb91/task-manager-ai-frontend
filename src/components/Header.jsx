import React from "react";
import {
  RefreshCw,
  CheckCircle2,
  LogOut,
  Bot,
  Volume2,
  VolumeX,
  X,
  Settings,
  Menu,
} from "lucide-react";

const title = import.meta.env.VITE_APP_TITLE || "AI Task Manager";

const Header = ({
  user,
  pendingTasksCount,
  completedTasksCount,
  fetchTasks,
  isRefreshing,
  toggleSpeech,
  speechEnabled,
  isSpeaking,
  stopSpeaking,
  setShowAdmin,
  logout,
  isTaskVisible,
  setIsTaskVisible,
}) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">Hello, {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  {pendingTasksCount} Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  {completedTasksCount} Done
                </span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => fetchTasks()}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

            {/* <button
              onClick={toggleSpeech}
              className={`p-2 rounded-md transition ${
                speechEnabled
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Toggle voice"
            >
              {speechEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition"
                title="Stop speaking"
              >
                <X className="w-5 h-5" />
              </button>
            )} */}

            {/* Admin Button */}
            {user?.is_admin && (
              <button
                onClick={() => setShowAdmin(true)}
                className="p-2 text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition"
                title="Admin Dashboard"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Hamburger Menu - Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsTaskVisible(!isTaskVisible)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                title="Toggle Tasks"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
