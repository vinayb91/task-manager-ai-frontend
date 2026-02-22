import React from "react";
import AdminDashboard from "./components/AdminDashboard";
import AuthComponent from "./components/AuthComponent";
import ChatComponent from "./components/ChatComponent";
import TaskComponent from "./components/TaskComponent";
import Header from "./components/Header";
import { useAppLogic } from "./hooks/useAppLogic";

function App() {
  const {
    isAuthenticated,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    authError,
    authLoading,
    user,
    showAdmin,
    setShowAdmin,
    messages,
    input,
    setInput,
    loading,
    isRefreshing,
    tasks,
    filterStatus,
    setFilterStatus,
    isListening,
    isSpeaking,
    speechEnabled,
    messagesContainerRef,
    isTaskVisible,
    setIsTaskVisible,
    handleAuth,
    logout,
    fetchTasks,
    sendMessage,
    toggleVoiceInput,
    stopSpeaking,
    toggleSpeech,
    handleKeyPress,
  } = useAppLogic();

  // Computed values
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  // Show admin dashboard if enabled
  if (isAuthenticated && showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  // Login/Register Screen
  if (!isAuthenticated) {
    return (
      <AuthComponent
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
        authError={authError}
        authLoading={authLoading}
        handleKeyPress={handleKeyPress}
      />
    );
  }

  // Main App
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        user={user}
        pendingTasksCount={pendingTasksCount}
        completedTasksCount={completedTasksCount}
        fetchTasks={fetchTasks}
        isRefreshing={isRefreshing}
        toggleSpeech={toggleSpeech}
        speechEnabled={speechEnabled}
        isSpeaking={isSpeaking}
        stopSpeaking={stopSpeaking}
        setShowAdmin={setShowAdmin}
        logout={logout}
        isTaskVisible={isTaskVisible}
        setIsTaskVisible={setIsTaskVisible}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 py-6 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
          <div
            className={`lg:col-span-2 lg:block ${
              isTaskVisible ? "hidden" : "block"
            }`}
          >
            <ChatComponent
              messages={messages}
              loading={loading}
              input={input}
              setInput={setInput}
              handleKeyPress={handleKeyPress}
              sendMessage={sendMessage}
              messagesContainerRef={messagesContainerRef}
              toggleVoiceInput={toggleVoiceInput}
              isListening={isListening}
              isSpeaking={isSpeaking}
            />
          </div>
          <div className={`lg:block ${isTaskVisible ? "block" : "hidden"}`}>
            <TaskComponent
              tasks={tasks}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
