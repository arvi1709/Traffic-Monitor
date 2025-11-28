import { AttackType, Packet, Protocol } from '../types';

// Utilities for generating random network data
const randomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const randomPort = () => Math.floor(Math.random() * 65535);

// State for simulation patterns
let attackMode: AttackType = AttackType.NORMAL;
let packetCounter = 0;
let lastSrcIp = randomIp();
let lastDstIp = randomIp();
let scanPort = 20;

export const setSimulationMode = (mode: AttackType) => {
  attackMode = mode;
  // Reset patterns when mode switches
  if (mode === AttackType.DOS) {
    lastSrcIp = "192.168.1.105"; // Attacker
    lastDstIp = "192.168.1.50";  // Victim
  } else if (mode === AttackType.PORT_SCAN) {
    lastSrcIp = "192.168.1.200"; // Scanner
    scanPort = 20;
  }
};

export const generatePacket = (): Packet => {
  packetCounter++;
  const id = `pkt-${Date.now()}-${packetCounter}`;
  const timestamp = new Date().toLocaleTimeString();
  
  let pkt: Partial<Packet> = {};
  
  // 1. Generate Raw Data based on current "Attack Mode" simulation
  if (attackMode === AttackType.NORMAL) {
    pkt = {
      srcIp: randomIp(),
      dstIp: randomIp(),
      srcPort: randomPort(),
      dstPort: [80, 443, 53, 22][Math.floor(Math.random() * 4)],
      protocol: Math.random() > 0.8 ? Protocol.UDP : Protocol.TCP,
      length: Math.floor(Math.random() * 1500) + 60,
    };
  } else if (attackMode === AttackType.DOS) {
    // High frequency, same source/dest, small packets
    pkt = {
      srcIp: lastSrcIp,
      dstIp: lastDstIp,
      srcPort: randomPort(),
      dstPort: 80,
      protocol: Protocol.TCP,
      length: 64, // Small packet size typically used in SYN floods
    };
  } else if (attackMode === AttackType.PORT_SCAN) {
    // Same source, incrementing dest port
    scanPort++;
    if (scanPort > 1000) scanPort = 20;
    pkt = {
      srcIp: lastSrcIp,
      dstIp: "192.168.1.50",
      srcPort: 5555,
      dstPort: scanPort,
      protocol: Protocol.TCP,
      length: 60,
    };
  } else if (attackMode === AttackType.ARP_SPOOF) {
    // ARP Protocol
    pkt = {
      srcIp: "192.168.1.1", // Gateway
      dstIp: "192.168.1.105", // Victim
      srcPort: 0,
      dstPort: 0,
      protocol: Protocol.ARP,
      length: 42,
    };
  }

  // 2. "ML Model" - Classification Logic
  // In a real app, this would be a Python backend API call.
  // Here we simulate the ML decision boundary.
  
  let prediction = AttackType.NORMAL;
  let confidence = 0.85 + (Math.random() * 0.14);

  // Heuristic rules simulating a trained Decision Tree
  if (pkt.protocol === Protocol.ARP) {
    prediction = AttackType.ARP_SPOOF;
    confidence = 0.98;
  } else if (pkt.length < 70 && pkt.protocol === Protocol.TCP && attackMode === AttackType.DOS) {
    prediction = AttackType.DOS;
    confidence = 0.95;
  } else if (attackMode === AttackType.PORT_SCAN && pkt.srcPort === 5555) {
    prediction = AttackType.PORT_SCAN;
    confidence = 0.92;
  }

  // Add some noise (False Positives/Negatives)
  if (Math.random() > 0.98) {
    prediction = AttackType.NORMAL; // Missed detection
  }

  return {
    id,
    timestamp,
    srcIp: pkt.srcIp!,
    dstIp: pkt.dstIp!,
    srcPort: pkt.srcPort!,
    dstPort: pkt.dstPort!,
    protocol: pkt.protocol!,
    length: pkt.length!,
    prediction,
    confidence
  };
};