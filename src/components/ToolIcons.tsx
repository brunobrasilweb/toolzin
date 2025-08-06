"use client";

import { 
  FileSpreadsheet, 
  Building2, 
  KeyRound, 
  Lock, 
  Search, 
  RefreshCw, 
  Youtube, 
  Clock,
  Copy,
  Check,
  AlertTriangle,
  Info,
  ShieldAlert,
  BanIcon,
  Lightbulb,
  Instagram,
  Timer,
  QrCode
} from "lucide-react";

export const ToolIcons = {
  // Ícones para os cards da página principal
  cpf: FileSpreadsheet,
  cnpj: Building2,
  password: KeyRound,
  hash: Lock,
  jwt: Search,
  base64: RefreshCw,
  youtube: Youtube,
  instagram: Instagram,
  timer: Timer,
  qrcode: QrCode,
  comingSoon: Clock,
  
  // Ícones para botões e alertas
  copy: Copy,
  check: Check,
  warning: AlertTriangle,
  info: Info,
  security: ShieldAlert,
  ban: BanIcon,
  tip: Lightbulb
};
