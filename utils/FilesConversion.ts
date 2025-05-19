'use client';
import Papa from 'papaparse';
import mammoth from 'mammoth';
import { embeddingsOpenAi } from './embeddings';
import extractTextFromPDF from 'pdf-parser-client-side';
import { extractTextfromPDFwithAdobe } from './extractPdfText';
import { OtherFileForAgentType } from '@/typings/types';

/**
 * Takes 1 file of type CSV and converts it into a JSON
 * @param file Example event.target.files[0]
 * @returns Json of the CSV file
 */
export const CSVtoJSON = (file: any) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const filteredData = results.data.filter((item: any) => {
                    return Object.values(item).some((value: any) => value.trim() !== '');
                });
                resolve(filteredData);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                reject(error);
            },
        });
    });
};

/**
 * Takes 1 or more files of type Txt or Docx and converts it into a single text
 * @param e Event Type
 * @returns File(s) Text
 */
export const TXTDOCXtoText = async (files: File[]) => {
    let text = '';
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) break;
        try {
            if (
                file.type ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.type === 'application/msword'
            ) {
                text +=
                    (await mammoth
                        .extractRawText({
                            arrayBuffer: await file.arrayBuffer(),
                        })
                        .then((result) => result.value)) + ' ';
            } else if (file.type === 'application/pdf') {
                //NOT WORKING
            } else if (file.type.startsWith('text/')) {
                text += (await file.text()) + ' ';
            } else {
                console.log('Formato de archivo no soportado');
            }
        } catch (error) {
            console.log(`Error al procesar el archivo ${files[i].name}`);
            return null;
        }
    }
    return text;
};

export const embeddingDocs = async (files: File[]) => {
    const otherFiles: OtherFileForAgentType = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) break;
        try {
            if (
                file.type ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.type === 'application/msword'
            ) {
                const text =
                    (await mammoth
                        .extractRawText({
                            arrayBuffer: await file.arrayBuffer(),
                        })
                        .then((result) => result.value)) + ' ';
                const filesInfo = await embeddingsOpenAi(text, files[i].name);
                if (filesInfo) {
                    otherFiles.push(filesInfo);
                }
            } else if (file.type === 'application/pdf') {
                //NOT WORKING
            } else if (file.type.startsWith('text/')) {
                const text = (await file.text()) + ' ';
                const filesInfo = await embeddingsOpenAi(text, files[i].name);
                if (filesInfo) {
                    otherFiles.push(filesInfo);
                }
            } else {
                console.log('Formato de archivo no soportado');
            }
        } catch (error) {
            console.log(`Error al procesar el archivo ${files[i].name}`);
            return null;
        }
    }
    return otherFiles;
};

export const PDFtoText = async (url: string) => {
    // return extractTextFromPDF(file, "clean");
    const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/.*$/;
    const match = url.match(regex);
    if (match) {
        const text = await extractTextfromPDFwithAdobe(
            `https://drive.google.com/uc?export=download&id=${match[1]}`,
        );
        return text?.message.content;
    } else {
        return 'ERROR';
    }
};
