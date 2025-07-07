// Crear sonido de campanita realista usando Web Audio API
let audioContext: AudioContext | null = null;

const initializeAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log("Error al inicializar contexto de audio:", error);
      return null;
    }
  }
  return audioContext;
};

const createRealisticBellSound = () => {
  const context = initializeAudioContext();
  if (!context) return null;
  
  const playBell = async () => {
    try {
      // Reanudar el contexto si está suspendido
      if (context.state === 'suspended') {
        await context.resume();
      }

      // Crear múltiples osciladores para simular los armónicos de una campana real
      const oscillators: OscillatorNode[] = [];
      const gainNodes: GainNode[] = [];
      
      // Frecuencias armónicas de una campana (basadas en campanas reales)
      const frequencies = [
        523.25, // C5 (Do) - Fundamental
        659.25, // E5 (Mi) - Tercera mayor
        783.99, // G5 (Sol) - Quinta
        1046.50, // C6 (Do) - Octava
        1318.51, // E6 (Mi) - Tercera mayor octava
        1567.98  // G6 (Sol) - Quinta octava
      ];
      
      // Volúmenes relativos para cada armónico
      const volumes = [0.8, 0.6, 0.4, 0.3, 0.2, 0.1];
      
      // Crear cada oscilador con su frecuencia y volumen
      frequencies.forEach((freq, index) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillators.push(oscillator);
        gainNodes.push(gainNode);
        
        // Conectar oscilador -> ganancia -> destino
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Configurar frecuencia
        oscillator.frequency.setValueAtTime(freq, context.currentTime);
        oscillator.type = 'sine'; // Ondas senoidales para un sonido más puro
        
        // Configurar envolvente de volumen (ADSR)
        const maxGain = volumes[index] * 0.15; // Volumen general más suave
        
        gainNode.gain.setValueAtTime(0, context.currentTime);
        // Attack: subida rápida
        gainNode.gain.linearRampToValueAtTime(maxGain, context.currentTime + 0.02);
        // Decay: bajada gradual
        gainNode.gain.exponentialRampToValueAtTime(maxGain * 0.3, context.currentTime + 0.2);
        // Sustain y Release: desvanecimiento lento como una campana real
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5);
      });
      
      // Iniciar todos los osciladores
      const startTime = context.currentTime;
      const duration = 1.5;
      
      oscillators.forEach(oscillator => {
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
      
      console.log("🔔 Campanita realista reproducida correctamente");
      
    } catch (error) {
      console.error("Error al reproducir campanita:", error);
    }
  };
  
  return playBell;
};

// Crear campanita alternativa más simple pero melodiosa
const createSimpleBellSound = () => {
  const context = initializeAudioContext();
  if (!context) return null;
  
  const playSimpleBell = async () => {
    try {
      if (context.state === 'suspended') {
        await context.resume();
      }

      // Crear dos osciladores para un sonido más rico
      const osc1 = context.createOscillator();
      const osc2 = context.createOscillator();
      const gain1 = context.createGain();
      const gain2 = context.createGain();
      const masterGain = context.createGain();
      
      // Conectar
      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(masterGain);
      gain2.connect(masterGain);
      masterGain.connect(context.destination);
      
      // Configurar frecuencias (acorde mayor)
      osc1.frequency.setValueAtTime(523.25, context.currentTime); // Do
      osc2.frequency.setValueAtTime(659.25, context.currentTime); // Mi
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      // Configurar volúmenes
      gain1.gain.setValueAtTime(0, context.currentTime);
      gain2.gain.setValueAtTime(0, context.currentTime);
      masterGain.gain.setValueAtTime(0.2, context.currentTime);
      
      // Envolvente
      gain1.gain.linearRampToValueAtTime(0.8, context.currentTime + 0.01);
      gain2.gain.linearRampToValueAtTime(0.6, context.currentTime + 0.01);
      
      gain1.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.0);
      gain2.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.0);
      
      // Reproducir
      osc1.start(context.currentTime);
      osc2.start(context.currentTime);
      osc1.stop(context.currentTime + 1.0);
      osc2.stop(context.currentTime + 1.0);
      
      console.log("🔔 Campanita simple reproducida");
      
    } catch (error) {
      console.error("Error con campanita simple:", error);
    }
  };
  
  return playSimpleBell;
};

let realisticBellSound: (() => Promise<void>) | null = null;
let simpleBellSound: (() => Promise<void>) | null = null;

const initializeBellSounds = () => {
  if (!realisticBellSound) {
    realisticBellSound = createRealisticBellSound();
  }
  if (!simpleBellSound) {
    simpleBellSound = createSimpleBellSound();
  }
  return { realisticBellSound, simpleBellSound };
};

export const playNotificationSound = async (settings?: any) => {
  console.log("🔔 Intentando reproducir campanita de notificación...");
  
  // Verificar si las notificaciones están habilitadas
  if (settings && !settings.notifications?.soundEnabled) {
    console.log("🔇 Sonidos deshabilitados en configuración");
    return;
  }

  try {
    const { realisticBellSound: realistic } = initializeBellSounds();
    
    if (realistic) {
      await realistic();
      console.log("✅ Campanita realista ejecutada");
    } else {
      console.log("❌ No se pudo inicializar la campanita");
      // Fallback a campanita simple
      await playSimpleBellSound();
    }
  } catch (error) {
    console.error("❌ Error al reproducir campanita:", error);
    // Último fallback
    await playSimpleBellSound();
  }
};

// Función alternativa de campanita simple (fallback)
export const playSimpleBellSound = async () => {
  try {
    const { simpleBellSound: simple } = initializeBellSounds();
    
    if (simple) {
      await simple();
      console.log("🔔 Campanita simple reproducida como fallback");
    } else {
      // Último recurso: campanita muy básica
      await playBasicBellSound();
    }
  } catch (error) {
    console.error("Error con campanita simple:", error);
    await playBasicBellSound();
  }
};

// Campanita muy básica como último recurso
const playBasicBellSound = async () => {
  try {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (context.state === 'suspended') {
      await context.resume();
    }
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Frecuencia de campanita
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.1);
    oscillator.type = 'sine';
    
    // Envolvente suave
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.8);
    
    console.log("🔔 Campanita básica reproducida");
  } catch (error) {
    console.error("Error con campanita básica:", error);
  }
};

// Función para probar diferentes tipos de campanita
export const testBellSounds = async () => {
  console.log("🔔 Probando sonidos de campanita...");
  
  // Probar campanita realista
  console.log("1. Probando campanita realista...");
  await playNotificationSound();
  
  // Esperar un poco y probar campanita simple
  setTimeout(async () => {
    console.log("2. Probando campanita simple...");
    await playSimpleBellSound();
  }, 2000);
  
  // Esperar un poco más y probar campanita básica
  setTimeout(async () => {
    console.log("3. Probando campanita básica...");
    await playBasicBellSound();
  }, 4000);
};

// Función para verificar si el audio está disponible
export const testAudioSupport = () => {
  try {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    console.log("✅ Web Audio API soportado");
    console.log("Estado del contexto:", context.state);
    
    // Probar campanitas al inicializar
    setTimeout(() => {
      console.log("🔔 Inicializando sonidos de campanita...");
      initializeBellSounds();
    }, 1000);
    
    return true;
  } catch (error) {
    console.log("❌ Web Audio API no soportado:", error);
    return false;
  }
};