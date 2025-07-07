import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalendarView } from './components/Calendar/CalendarView';
import { SettingsPanel } from './components/SettingsPanel';
import { ThemeProvider } from './context/ThemeContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { MessageCircle, Send, Bell, HelpCircle, Shield, FileText } from 'lucide-react';
import { SobreturnoForm } from './components/SobreturnoForm';
import { playNotificationSound, testAudioSupport, playSimpleBellSound } from './utils/sounds';

interface Message {
  id: number;
  text: string;
  time: string;
  isUser: boolean;
  date?: string;
}

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "¡Hola! ¿En qué puedo ayudarte?", 
      time: "10:00 AM", 
      isUser: false,
      date: new Date().toLocaleDateString('es-ES')
    },
    { 
      id: 2, 
      text: "Quisiera agendar una cita", 
      time: "10:01 AM", 
      isUser: true,
      date: new Date().toLocaleDateString('es-ES')
    },
    { 
      id: 3, 
      text: "¡Por supuesto! Por favor, selecciona una fecha y horario en el calendario de arriba.", 
      time: "10:02 AM", 
      isUser: false,
      date: new Date().toLocaleDateString('es-ES')
    }
  ]);

  // Debug: Mostrar estado de autenticación
  useEffect(() => {
    console.log("🔍 AppContent - Estado de auth:", {
      isAuthenticated,
      isLoading,
      userEmail: user?.email
    });
  }, [isAuthenticated, isLoading, user]);

  // Inicializar soporte de audio al cargar la app
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔊 Verificando soporte de audio...");
      const audioSupported = testAudioSupport();
      if (audioSupported) {
        console.log("✅ Audio inicializado correctamente");
      }
    }
  }, [isAuthenticated]);

  // Get the latest message
  const getLatestMessage = (): Message | null => {
    if (messages.length === 0) return null;
    return messages[messages.length - 1];
  };

  // Format unread count for display
  const formatUnreadCount = (count: number): string => {
    if (count === 0) return '';
    if (count > 99) return '99+';
    return count.toString();
  };

  // Handle notification bell click - reset unread count
  const handleNotificationClick = () => {
    console.log("🔔 Click en campana - reseteando contador");
    setUnreadCount(0);
    setHasNewMessages(false);
  };

  // Simulate checking for new messages - CORREGIDO: Intervalo más largo y menos frecuente
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log("🔄 Iniciando simulación de mensajes nuevos...");

    const checkInterval = setInterval(() => {
      // CORREGIDO: Reducir probabilidad de mensajes a 5% cada 3 minutos
      if (Math.random() < 0.05) { // 5% chance every 3 minutes
        console.log("📨 Simulando mensaje nuevo...");
        
        const now = new Date();
        const messageTexts = [
          "¡Tienes una nueva consulta!",
          "Un cliente quiere agendar una cita",
          "Mensaje nuevo recibido",
          "Consulta urgente pendiente",
          "Nueva solicitud de turno"
        ];
        
        const randomText = messageTexts[Math.floor(Math.random() * messageTexts.length)];
        
        const newMessage: Message = {
          id: Date.now() + Math.random(),
          text: randomText,
          time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
          date: now.toLocaleDateString('es-ES')
        };
        
        console.log("📨 Agregando mensaje:", newMessage.text);
        setMessages(prev => [...prev, newMessage]);
        setHasNewMessages(true);
        
        setUnreadCount(prev => {
          const newCount = prev + 1;
          const finalCount = newCount > 99 ? 99 : newCount;
          console.log(`🔢 Contador actualizado: ${prev} → ${finalCount}`);
          return finalCount;
        });
        
        // REPRODUCIR SONIDO DE CAMPANA PARA MENSAJES NUEVOS
        console.log("🔔 Reproduciendo sonido de campana para mensaje nuevo...");
        
        // Intentar ambos métodos de sonido
        playNotificationSound().catch(() => {
          console.log("🔔 Fallback: usando sonido simple");
          playSimpleBellSound();
        });
      }
    }, 180000); // CORREGIDO: Cambiar a 3 minutos (180000ms) en lugar de 2 minutos

    return () => {
      console.log("🔄 Limpiando intervalo de mensajes");
      clearInterval(checkInterval);
    };
  }, [isAuthenticated]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    console.log("🔒 Usuario no autenticado - mostrando página de login");
    return <AuthPage />;
  }

  console.log("✅ Usuario autenticado - mostrando aplicación principal");

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    console.log("📤 Enviando mensaje del usuario:", message);
    
    const now = new Date();
    const newMessage: Message = {
      id: Date.now(),
      text: message,
      time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      date: now.toLocaleDateString('es-ES')
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate automatic response after user message (NO SOUND for responses)
    setTimeout(() => {
      const responses = [
        "Gracias por tu mensaje, te responderé pronto",
        "Perfecto, revisaré tu solicitud",
        "Entendido, procesando tu consulta",
        "Muy bien, te confirmo en breve"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseTime = new Date();
      
      const responseMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        time: responseTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        date: responseTime.toLocaleDateString('es-ES')
      };
      
      console.log("🤖 Respuesta automática (sin sonido):", randomResponse);
      setMessages(prev => [...prev, responseMessage]);
      // NO incrementar contador ni reproducir sonido para respuestas automáticas
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Header 
        onSettingsClick={() => setSettingsOpen(true)} 
        hasNewMessages={hasNewMessages}
        unreadCount={unreadCount}
        latestMessage={getLatestMessage()}
        onNotificationClick={handleNotificationClick}
      />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
            Reserva tu cita de forma rápida y sencilla
          </h2>
          
          <CalendarView />
        </section>

        {/* WhatsApp Chat Section */}
        <section className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="text-white mr-2" size={24} />
              <h3 className="text-lg font-semibold text-white">Chat de WhatsApp</h3>
            </div>
            {hasNewMessages && unreadCount > 0 && (
              <div className="relative">
                <Bell className="text-white" size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold shadow-lg animate-pulse border-2 border-white">
                  {formatUnreadCount(unreadCount)}
                </span>
              </div>
            )}
          </div>
          
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            <div className="flex flex-col space-y-2">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.isUser
                      ? 'bg-secondary/10 dark:bg-blue-900 self-end'
                      : 'bg-primary/10 dark:bg-green-900 self-start'
                  }`}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {message.text}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.time}
                    </span>
                    {message.date && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {message.date}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                if (input) {
                  handleSendMessage(input.value);
                  input.value = '';
                }
              }}
              className="flex space-x-2"
            >
              <input
                name="message"
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="btn-primary flex items-center"
              >
                <Send size={18} className="mr-1" />
                Enviar
              </button>
            </form>
          </div>
        </section>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-xl font-bold text-primary dark:text-white">
                NEXTURN<span className="text-secondary"> 24/7</span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                La forma más sencilla de gestionar tus citas
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary dark:text-white mb-4 flex items-center">
                <HelpCircle size={20} className="mr-2" />
                Ayuda
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Tenés alguna duda o necesitás asistencia? Estamos para ayudarte. Podés comunicarte con nuestro equipo de soporte a través de nuestros canales oficiales. Nos comprometemos a responder a todas las consultas en el menor tiempo posible.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: nexturn247@gmail.com
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  WhatsApp: 1122782313
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-primary dark:text-white mb-2 flex items-center">
                  <FileText size={20} className="mr-2" />
                  Términos y Condiciones
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bienvenido/a a nuestra plataforma. Al acceder y utilizar nuestros servicios, aceptás cumplir con los presentes Términos y Condiciones. Nos reservamos el derecho de modificar estos términos en cualquier momento, por lo que recomendamos revisarlos periódicamente.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary dark:text-white mb-2 flex items-center">
                  <Shield size={20} className="mr-2" />
                  Privacidad
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tu privacidad es fundamental para nosotros. Nos comprometemos a proteger tus datos personales y a utilizarlos únicamente para brindarte un mejor servicio. No compartimos tu información con terceros sin tu consentimiento expreso.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 NEXTURN 24/7. Todos los derechos reservados.
          </div>
        </div>
      </footer>
      
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SobreturnoForm />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppointmentProvider>
          <AppContent />
        </AppointmentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;