// app/api/typing-status/route.js
let typingMap = {}; // in-memory, per deployment/serverless instance

export async function POST(req) {
  const { chatId, typing } = await req.json();
  if (typing) {
    typingMap[chatId] = Date.now();
  } else {
    delete typingMap[chatId];
  }
  return Response.json({ ok: true });
}

export async function GET() {
  const threshold = 4000;
  const now = Date.now();
  const active = Object.entries(typingMap)
    .filter(([_, ts]) => now - ts < threshold)
    .map(([chatId]) => chatId);

  return Response.json({ typingUsers: active });
}
