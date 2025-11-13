(() => {
  const API = `${window.location.origin}/api/chat`;
  const STORAGE_KEY = 'chatbot_conversation_v1';

  // Insertar UI
  const fab = document.createElement('button');
fab.id = 'chatbot-fab';
  fab.title = 'Asistencia';
  fab.innerHTML = '💬';
  document.body.appendChild(fab);

  const panel = document.createElement('div');
  panel.id = 'chatbot-panel';
  panel.innerHTML = `
    <div id="chatbot-header">Asistencia en línea</div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input">
      <input id="chatbot-text" type="text" placeholder="Escribe tu mensaje..." />
      <button id="chatbot-send">Enviar</button>
    </div>`;
  document.body.appendChild(panel);

  const $messages = panel.querySelector('#chatbot-messages');
  const $text = panel.querySelector('#chatbot-text');
  const $send = panel.querySelector('#chatbot-send');

  const saveConversation = () => {
    const items = [...$messages.querySelectorAll('.chat-row')].map(r => ({
      role: r.classList.contains('user') ? 'user' : 'bot',
      text: r.querySelector('.chat-bubble').innerText
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const restoreConversation = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      addBot(`¡Hola! 👋 Soy tu asistente. Puedo ayudarte con:
• Registro de alumnos
• Marcas / placas
• Horarios / ubicaciones
• Estado de solicitudes

Ejemplo: "¿Cómo registro mi vehículo?"`);
      return;
    }
    try {
      const items = JSON.parse(raw);
      items.forEach(m => m.role === 'user' ? addUser(m.text, false) : addBot(m.text, false));
    } catch {}
  };

  const scrollToBottom = () => { $messages.scrollTop = $messages.scrollHeight; };

  function addRow(role, text, persist = true) {
    const row = document.createElement('div');
    row.className = `chat-row ${role}`;
    row.innerHTML = `<div class="chat-bubble">${text}</div>`;
    $messages.appendChild(row);
    if (persist) saveConversation();
    scrollToBottom();
  }
  const addUser = (t, p=true) => addRow('user', t, p);
  const addBot  = (t, p=true) => addRow('bot',  t, p);

  fab.addEventListener('click', () => {
    const visible = panel.style.display === 'flex';
    panel.style.display = visible ? 'none' : 'flex';
    if (!visible) $text.focus();
  });

  $send.addEventListener('click', sendMessage);
  $text.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  async function sendMessage() {
    const msg = $text.value.trim();
    if (!msg) return;
    addUser(msg);
    $text.value = '';

    try {
      const history = [...$messages.querySelectorAll('.chat-row')].slice(-6).map(r => ({
        role: r.classList.contains('user') ? 'user' : 'assistant',
        text: r.querySelector('.chat-bubble').innerText
      }));

      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history })
      });
      const data = await res.json();
      addBot(data.reply || 'Lo siento, no entendí tu mensaje.');
    } catch {
      addBot('❌ No se pudo contactar al servidor.');
    }
  }

  // Estilos mínimos si no cargó el CSS (fallback)
  if (!document.getElementById('chatbot-fab').style.position) {
    const s = document.createElement('style');
    s.textContent = `
      #chatbot-fab{position:fixed;right:22px;bottom:22px;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:#1976d2;color:#fff;border:none;box-shadow:0 6px 18px rgba(0,0,0,.2);z-index:9999;font-size:24px}
      #chatbot-panel{position:fixed;right:22px;bottom:90px;width:320px;max-height:60vh;display:none;flex-direction:column;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 10px 28px rgba(0,0,0,.25);border:1px solid rgba(0,0,0,.08);z-index:9998}
      #chatbot-header{background:#1976d2;color:#fff;padding:12px 14px;font-weight:600}
      #chatbot-messages{padding:10px;overflow-y:auto;flex:1;background:#f8fafc}
      .chat-row{display:flex;margin:8px 0}
      .chat-row.user{justify-content:flex-end}
      .chat-bubble{max-width:75%;padding:8px 12px;border-radius:12px;line-height:1.35;white-space:pre-wrap}
      .chat-row.user .chat-bubble{background:#e3f2fd;color:#0d47a1;border-top-right-radius:4px}
      .chat-row.bot .chat-bubble{background:#eceff1;color:#263238;border-top-left-radius:4px}
      #chatbot-input{display:flex;padding:8px;gap:8px;background:#fff;border-top:1px solid #eee}
      #chatbot-input input{flex:1;padding:10px 12px;border:1px solid #cfd8dc;border-radius:10px}
      #chatbot-input button{padding:10px 14px;border-radius:10px;border:none;background:#1976d2;color:#fff}
    `;
    document.head.appendChild(s);
  }

  panel.style.display = 'none';
  panel.style.flexDirection = 'column';
  restoreConversation();
})();
