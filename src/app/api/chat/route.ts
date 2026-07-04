import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Fallback to dummy key to prevent startup compilation crashes if env is missing
const apiKey = process.env.GEMINI_API_KEY || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, context, history, mode, promptObjective } = body;

    if (!apiKey) {
      return NextResponse.json(
        {
          message: JSON.stringify({
            passed: false,
            feedback: 'Error: La API Key de Gemini (GEMINI_API_KEY) no está configurada en el servidor. Agrega tu clave en el archivo .env.local para habilitar las funcionalidades de Inteligencia Artificial.'
          })
        },
        { status: 200 } // Send as status 200 but indicating failure in evaluation JSON
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format chat history for Gemini contents if available
    let contents: any[] = [];
    if (history && Array.isArray(history) && history.length > 0) {
      contents = history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.parts?.[0]?.text || h.message || '' }]
      }));
    }

    // Add the current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    let systemInstruction = '';
    let responseMimeType = 'text/plain';

    if (mode === 'socratic') {
      systemInstruction = `Eres un tutor de matemáticas altamente calificado y riguroso. Tu objetivo es guiar al estudiante de manera socrática para que deduzca la respuesta por sí mismo.
Reglas:
1. NUNCA des la respuesta final o la solución directa de un problema.
2. Haz preguntas estratégicas, lógicas y de guía basándote en el razonamiento del estudiante.
3. Si comete un error conceptual, algebraico o lógico, señálalo de forma sutil y pregúntale cómo podría verificar su paso.
4. Mantén un rigor matemático absoluto en todo momento. Corrige de inmediato confusiones entre enunciados abiertos e hipótesis, órdenes de cuantificadores, etc.
5. Apóyate y haz referencia al siguiente contexto de la lección actual:
---
${context}
---`;
    } else if (mode === 'theoretic') {
      systemInstruction = `Eres un asistente teórico de matemáticas. Tu función es responder dudas teóricas basándote ÚNICAMENTE en el contenido de la lección proporcionado a continuación.
Reglas:
1. Responde preguntas teóricas usando EXCLUSIVAMENTE la información o fórmulas explicadas en el contexto MDX.
2. Si la respuesta a la pregunta del estudiante no se encuentra de forma explícita o implícita en el contexto, responde de manera cortés y exacta diciendo que esa consulta en específico escapa al alcance teórico del material actual y no puedes responderla.
3. Sé sumamente conciso, riguroso, claro y formal.
4. Aquí está el contexto MDX oficial del tema:
---
${context}
---`;
    } else if (mode === 'eval') {
      responseMimeType = 'application/json';
      systemInstruction = `Eres un evaluador matemático riguroso. Tu función es evaluar una justificación, demostración o explicación de desarrollo escrita por el estudiante para un desafío específico.
Debes validar si el razonamiento del estudiante es completamente correcto, coherente y matemáticamente exacto según las reglas de la lógica formal.

Contexto del tema:
---
${context}
---

Desafío planteado al estudiante:
"${promptObjective}"

Reglas de evaluación crítica:
1. Sé extremadamente exigente con la lógica formal. Invalida la respuesta si el orden de los cuantificadores altera la validez lógica (por ejemplo, confundir ∃x∀y con ∀y∃x).
2. Verifica si el estudiante comete errores comunes, como confundir una función proposicional (enunciado abierto) con una proposición formal.
3. Debes responder estrictamente en formato JSON utilizando el siguiente esquema:
{
  "passed": true o false (boolean),
  "feedback": "Explicación detallada de tu corrección matemática, destacando los aciertos y fallos lógicos específicos."
}
4. NO agregues introducciones, explicaciones, markdown o bloques adicionales fuera del JSON. Devuelve únicamente el objeto JSON.`;
    } else {
      systemInstruction = `Eres un asistente de matemáticas general. Ayuda al estudiante de manera clara.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType,
        temperature: mode === 'eval' ? 0.1 : 0.7,
      }
    });

    return NextResponse.json({
      message: response.text || ''
    });
  } catch (err: any) {
    console.error('Error in API /chat:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
