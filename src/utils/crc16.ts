// Função para calcular o CRC16 CCITT-FALSE
// Esta implementação segue o padrão EMV QR Code utilizado pelo BCB para códigos PIX

export function crc16ccitt(str: string): string {
  // Inicializa o CRC com 0xFFFF (padrão CCITT)
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  // Para cada caractere na string
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // XOR com o byte mais significativo do CRC
    crc ^= (c << 8);

    // Para cada bit no byte
    for (let j = 0; j < 8; j++) {
      // Se o bit mais significativo está definido
      if (crc & 0x8000) {
        // Desloca para esquerda e faz XOR com o polinômio
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        // Apenas desloca para esquerda
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  // Converte o resultado para uma string hexadecimal de 4 dígitos em maiúsculas
  return crc.toString(16).padStart(4, '0').toUpperCase();
}
