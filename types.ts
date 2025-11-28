export enum AttackType {
  NORMAL = 'Normal',
  DOS = 'DoS Attack',
  ARP_SPOOF = 'ARP Spoofing',
  PORT_SCAN = 'Port Scan'
}

export enum Protocol {
  TCP = 'TCP',
  UDP = 'UDP',
  ICMP = 'ICMP',
  ARP = 'ARP'
}

export interface Packet {
  id: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: Protocol;
  length: number;
  prediction: AttackType;
  confidence: number; // 0.0 to 1.0
}

export interface SystemStats {
  totalPackets: number;
  totalAlerts: number;
  normalCount: number;
  dosCount: number;
  arpCount: number;
  scanCount: number;
}

export interface ChartDataPoint {
  time: string;
  packets: number;
  alerts: number;
}