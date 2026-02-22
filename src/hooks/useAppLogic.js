import { useState, useEffect, useRef, useCallback } from "react";
import { loginOrRegister, getTasks, sendAgentQuery } from "../api/api";

export const useAppLogic = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  // Admin state
  const [showAdmin, setShowAdmin] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // UI state
  const [isTaskVisible, setIsTaskVisible] = useState(false);

  // Refs
  const messagesContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentAudioRef = useRef(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      fetchTasks(savedToken);
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const fetchTasks = async (authToken = token) => {
    setIsRefreshing(true);
    try {
      const data = await getTasks(authToken);
      setTasks(data || []);
    } catch (err) {
      if (err.message === "Unauthorized") {
        logout();
      } else {
        console.error("Failed to fetch tasks:", err);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setIsAuthenticated(false);
    setTasks([]);
    setMessages([]);
    setShowAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const body =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;

      const data = await loginOrRegister(authMode, body);

      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await fetchTasks(data.token);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const playAudioFromBase64 = (base64Audio) => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      currentAudioRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };

      audio.play();
    } catch (err) {
      console.error("Failed to play audio:", err);
      setIsSpeaking(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    try {
      const data = await sendAgentQuery(token, userMessage, speechEnabled);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
      if (data.tasks) {
        setTasks(data.tasks);
      } else {
        await fetchTasks(token);
      }

      if (speechEnabled && data.audio) {
        playAudioFromBase64(data.audio);
      }
    } catch (err) {
      if (err.message === "Unauthorized") {
        logout();
        setMessages((prev) => [
          ...prev,
          {
            role: "error",
            content: "Error: Session expired. Please login again.",
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "error",
            content: `Error: ${err.message}`,
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const initSpeechRecognition = useCallback(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      initSpeechRecognition();
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    setSpeechEnabled((prev) => !prev);
    if (speechEnabled) {
      stopSpeaking();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "password") {
        handleAuth();
      } else {
        sendMessage();
      }
    }
  };

  return {
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
  };
};
