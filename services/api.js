// This service communicates with the local Python Backend

const API_URL = "http://localhost:8000";

export const startCapture = async (mode) => {
  try {
    const response = await fetch(`${API_URL}/capture/start?mode=${mode}`, { method: 'POST' });
    return await response.json();
  } catch (error) {
    console.error("Backend not running?", error);
    return { status: "error", message: "Failed to connect to backend" };
  }
};

export const stopCapture = async () => {
  try {
    const response = await fetch(`${API_URL}/capture/stop`, { method: 'POST' });
    return await response.json();
  } catch (error) {
    console.error("Error stopping capture", error);
  }
};

export const getSystemStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    // Return empty structure if backend is offline
    return {
      total_packets: 0,
      total_alerts: 0,
      attack_counts: { Normal: 0, DoS: 0, ARP: 0, Scan: 0 },
      recent_packets: []
    };
  }
};