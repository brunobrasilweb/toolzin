/**
 * Classe para geração de QR Code PIX estático
 * Baseado no repositório: https://github.com/gab618/pix-js
 */

export class Pix {
  // IDs dos campos do Payload PIX
  private ID_PAYLOAD_FORMAT_INDICATOR = "00";
  private ID_MERCHANT_ACCOUNT_INFORMATION = "26";
  private ID_MERCHANT_ACCOUNT_INFORMATION_GUI = "00";
  private ID_MERCHANT_ACCOUNT_INFORMATION_KEY = "01";
  private ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = "02";
  private ID_MERCHANT_CATEGORY_CODE = "52";
  private ID_TRANSACTION_CURRENCY = "53";
  private ID_TRANSACTION_AMOUNT = "54";
  private ID_COUNTRY_CODE = "58";
  private ID_MERCHANT_NAME = "59";
  private ID_MERCHANT_CITY = "60";
  private ID_ADDITIONAL_DATA_FIELD_TEMPLATE = "62";
  private ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = "05";
  private ID_CRC16 = "63";

  /**
   * Construtor da classe
   * @param pixKey Chave PIX do recebedor
   * @param description Descrição do pagamento
   * @param merchantName Nome do recebedor
   * @param merchantCity Cidade do recebedor
   * @param txid Identificador da transação
   * @param amount Valor da transação (opcional)
   */
  constructor(
    private pixKey: string,
    private description: string,
    private merchantName: string,
    private merchantCity: string,
    private txid: string,
    private amount?: number
  ) {
    // Formatar valor com duas casas decimais se fornecido
    if (this.amount !== undefined) {
      this.amount = Number(this.amount.toFixed(2));
    }
  }

  /**
   * Formata um valor para o padrão EMV
   * @param id Identificador do campo
   * @param value Valor do campo
   * @returns String formatada
   */
  private _getValue(id: string, value: string): string {
    const size = String(value.length).padStart(2, "0");
    return id + size + value;
  }

  /**
   * Gera as informações da conta do recebedor
   * @returns String formatada com as informações da conta
   */
  private _getMechantAccountInfo(): string {
    const gui = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI,
      "br.gov.bcb.pix"
    );
    
    const key = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY,
      this.pixKey
    );
    
    const description = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION,
      this.description
    );

    return this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION,
      gui + key + description
    );
  }

  /**
   * Gera o campo de informações adicionais
   * @returns String formatada com as informações adicionais
   */
  private _getAdditionalDataFieldTemplate(): string {
    const txid = this._getValue(
      this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID,
      this.txid
    );
    
    return this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
  }

  /**
   * Calcula o CRC16 do payload
   * @param payload Payload a ser calculado
   * @returns String com o CRC16 calculado
   */
  private _getCRC16(payload: string): string {
    function ord(str: string): number {
      return str.charCodeAt(0);
    }
    
    function dechex(number: number): string {
      if (number < 0) {
        number = 0xffffffff + number + 1;
      }
      return parseInt(number.toString(), 10).toString(16);
    }

    // Adiciona dados gerais no payload
    payload = payload + this.ID_CRC16 + "04";

    // Dados definidos pelo BACEN
    let polinomio = 0x1021;
    let resultado = 0xffff;
    let length;

    // Checksum
    if ((length = payload.length) > 0) {
      for (let offset = 0; offset < length; offset++) {
        resultado ^= ord(payload[offset]) << 8;
        for (let bitwise = 0; bitwise < 8; bitwise++) {
          if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
          resultado &= 0xffff;
        }
      }
    }

    // Retorna código CRC16 de 4 caracteres
    return this.ID_CRC16 + "04" + dechex(resultado).toUpperCase();
  }

  /**
   * Gera o payload completo do PIX
   * @returns String com o payload do PIX para QR Code
   */
  public getPayload(): string {
    const amountValue = this.amount !== undefined ? this.amount.toFixed(2) : "";
    
    let payload =
      this._getValue(this.ID_PAYLOAD_FORMAT_INDICATOR, "01") +
      this._getMechantAccountInfo() +
      this._getValue(this.ID_MERCHANT_CATEGORY_CODE, "0000") +
      this._getValue(this.ID_TRANSACTION_CURRENCY, "986");
      
    // Adiciona o valor se fornecido
    if (amountValue) {
      payload += this._getValue(this.ID_TRANSACTION_AMOUNT, amountValue);
    }
    
    // Completa o payload
    payload +=
      this._getValue(this.ID_COUNTRY_CODE, "BR") +
      this._getValue(this.ID_MERCHANT_NAME, this.merchantName) +
      this._getValue(this.ID_MERCHANT_CITY, this.merchantCity) +
      this._getAdditionalDataFieldTemplate();

    // Adiciona o CRC16
    return payload + this._getCRC16(payload);
  }
}
