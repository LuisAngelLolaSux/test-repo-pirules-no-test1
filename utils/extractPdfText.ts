'use server';
import {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    ExportPDFToImagesJob,
    ExportPDFToImagesTargetFormat,
    ExportPDFToImagesOutputType,
    ExportPDFToImagesParams,
    ExportPDFToImagesResult,
    SDKError,
    ServiceUsageError,
    ServiceApiError,
} from '@adobe/pdfservices-node-sdk';
import axios from 'axios';
import OpenAI from 'openai';

export const extractTextfromPDFwithAdobe = async (url: string) => {
    //const file = formData.get("file");
    //Upload file maybe
    let readStream;
    try {
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.ADOBE_CLIENT_ID!,
            clientSecret: process.env.ADOBE_CLIENT_SECRET!,
        });
        // Creates a PDF Services instance
        const pdfServices = new PDFServices({ credentials });
        // Creates an asset(s) from source file(s) and upload
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream', // Obtén el archivo como un stream
        });
        const inputAsset = await pdfServices.upload({
            readStream: response.data,
            mimeType: MimeType.PDF,
        });
        // Create parameters for the job
        const params = new ExportPDFToImagesParams({
            targetFormat: ExportPDFToImagesTargetFormat.JPEG,
            outputType: ExportPDFToImagesOutputType.LIST_OF_PAGE_IMAGES,
        });

        // Creates a new job instance
        const job = new ExportPDFToImagesJob({
            inputAsset,
            params,
        });

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({ job });
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExportPDFToImagesResult,
        });
        // Get content from the resulting asset(s)
        const resultAssets: any = pdfServicesResponse?.result?.assets;

        const filesBase64 = [];
        if (resultAssets) {
            for (let i = 0; i < resultAssets.length; i++) {
                try {
                    //resultAssets[i]._downloadURI
                    // Obtener la imagen desde la URL
                    const response = await fetch(resultAssets[i]._downloadURI);
                    const arrayBuffer = await response.arrayBuffer();

                    // Convertir el ArrayBuffer a un Buffer
                    const buffer = Buffer.from(arrayBuffer);

                    // Convertir el buffer a Base64
                    const base64 = buffer.toString('base64');

                    // Obtener el tipo de MIME de la imagen (por ejemplo, image/jpeg, image/png)
                    const mimeType = response.headers.get('content-type');

                    // Crear el Data URL en Base64
                    const dataUrl = `data:${mimeType};base64,${base64}`;
                    filesBase64.push(dataUrl);
                } catch (error) {
                    console.error('Error al convertir la imagen a Base64:', error);
                }
            }
            const chatResponse = await fotosToText(filesBase64);
            return chatResponse;
        }
    } catch (err) {
        if (
            err instanceof SDKError ||
            err instanceof ServiceUsageError ||
            err instanceof ServiceApiError
        ) {
            console.log('Exception encountered while executing operation', err);
        } else {
            console.log('Exception encountered while executing operation', err);
        }
    }
};

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

async function fotosToText(files: string[]) {
    const content: any = [
        {
            type: 'text',
            text: 'Give me the text on this images, structured',
        },
    ];

    for (let i = 0; i < files.length; i++) {
        content.push({
            type: 'image_url',
            image_url: {
                url: files[i],
            },
        });
    }

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'user',
                content,
            },
        ],
    });

    return response.choices[0];
}
