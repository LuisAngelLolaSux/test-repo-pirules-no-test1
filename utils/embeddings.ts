'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

function splitTextByWords(text: string, numWords: number) {
    // Divide el texto en un array de palabras
    const words = text.split(' ');

    // Array para almacenar los sub-arrays de palabras
    const result = [];

    // Itera sobre las palabras y divide en sub-arrays
    for (let i = 0; i < words.length; i += numWords) {
        // Crea un sub-array de tamaño 'numWords'
        const chunk = words.slice(i, i + numWords);
        // Agrega el sub-array al resultado
        result.push(chunk.join(' '));
    }

    return result;
}

/**
 * Receives a Text and it returns a vector array of the text with OpenAi model "text-embedding-3-small"
 * @param text Type of String
 * @returns Vector Array
 */
export const embeddingsOpenAi = async (text: string, name: string) => {
    try {
        const content = [];
        const splitedText = await splitTextByWords(text, 1000);
        for (let i = 0; i < splitedText.length; i++) {
            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: splitedText[i],
            });
            const embedding = response.data[0].embedding;
            content.push({
                info: splitedText[i],
                embeddings: embedding,
            });
        }

        return { name, content };
    } catch (error) {
        console.log(error);
    }
};

export async function generateOneEmbedding(test: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: test,
    });

    return response.data[0].embedding;
}
