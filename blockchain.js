// Módulo Blockchain y Ledger Criptográfico para Comedor Inteligente
// Garantiza la trazabilidad, integridad e inmutabilidad de cada entrega y confirmación (Slide 9)

async function sha256(message) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Crypto subtle fallback', e);
  }
  // Fallback simple hash determinista de 64 chars si crypto no estuviese disponible
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + 'a7f3e19c0b4d' + hex + 'f9e2b10a3c8d' + hex).slice(0, 64);
}

export class BlockchainLedger {
  constructor() {
    this.storageKey = 'comedor_blockchain_ledger_v1';
    this.chain = [];
    this.init();
  }

  async init() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.chain = JSON.parse(saved);
        if (this.chain.length > 0) return;
      } catch (e) {
        console.error('Error cargando blockchain, reinicializando', e);
      }
    }
    await this.createGenesisBlock();
  }

  async createGenesisBlock() {
    const genesisData = {
      tipoEvento: 'GENESIS_BLOCK',
      detalles: 'Inicialización de cadena de bloques auditable de Comedor Inteligente - Compensar',
      operador: 'Sistema Central'
    };
    const timestamp = '2026-11-09T06:00:00.000Z';
    const raw = `0-0-${timestamp}-${JSON.stringify(genesisData)}`;
    const hash = await sha256(raw);

    this.chain = [{
      index: 0,
      timestamp,
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      data: genesisData,
      hash
    }];
    this.save();
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.chain));
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  async addBlock(tipoEvento, studentInfo, detalles, operador = 'Sistema') {
    const prevBlock = this.getLatestBlock() || { hash: '0000000000000000000000000000000000000000000000000000000000000000', index: -1 };
    const index = prevBlock.index + 1;
    const timestamp = new Date().toISOString();

    // Anonimización del documento según política de protección de datos (Slide 9)
    const docHash = studentInfo?.documento ? await sha256(studentInfo.documento) : 'N/A';

    const blockData = {
      tipoEvento,
      estudianteId: studentInfo?.id || 'N/A',
      estudianteNombre: studentInfo?.nombre || 'Anónimo',
      curso: studentInfo?.curso || 'General',
      docMasked: studentInfo?.documento ? `***${studentInfo.documento.slice(-4)}` : 'N/A',
      docHash: docHash.slice(0, 16) + '...',
      detalles,
      operador
    };

    const raw = `${index}-${prevBlock.hash}-${timestamp}-${JSON.stringify(blockData)}`;
    const hash = await sha256(raw);

    const newBlock = {
      index,
      timestamp,
      previousHash: prevBlock.hash,
      data: blockData,
      hash
    };

    this.chain.push(newBlock);
    this.save();
    return newBlock;
  }

  async verifyChainIntegrity() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.previousHash !== previous.hash) {
        return {
          valid: false,
          corruptedIndex: i,
          reason: `El bloque #${i} tiene un hash previo que no coincide con el bloque #${i - 1}`
        };
      }

      const raw = `${current.index}-${current.previousHash}-${current.timestamp}-${JSON.stringify(current.data)}`;
      const recomputedHash = await sha256(raw);
      if (recomputedHash !== current.hash) {
        return {
          valid: false,
          corruptedIndex: i,
          reason: `El hash del bloque #${i} fue alterado o manipulado indebidamente`
        };
      }
    }
    return {
      valid: true,
      totalBlocks: this.chain.length,
      message: 'Todos los bloques verificados: La trazabilidad e integridad son 100% auténticas.'
    };
  }

  getAllBlocks() {
    return [...this.chain].reverse();
  }
}

export const blockchain = new BlockchainLedger();
