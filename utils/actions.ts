'use server';
import BotConfig from '@/models/agentes-whatsapp/BotConfig';
import Chat from '@/models/agentes-whatsapp/Chat';
import { connectToDB } from './mongoDB';
import { currentUser } from '@/lib/auth';
import Producto from '@/models/productos/Productos';

export const deleteChat = async (phone: string, botId?: string) => {
    await connectToDB();
    if (botId) {
        await Chat.deleteOne({ _id: botId, phone });
    } else {
        await Chat.deleteMany({ phone });
    }
};

export const getName = async (id: string) => {
    await connectToDB();
    const bot = await BotConfig.findById(id);
    return bot?.agentName;
};

export const getChatsPhoneNumbers = async () => {
    try {
        const user = await currentUser();
        await connectToDB();
        if (!user) {
            throw new Error('Accesso no autorizado');
        }
        const bots = await BotConfig.find({ userId: user.id }).select('_id');
        if (!bots || bots.length === 0) {
            throw new Error('No hay bots disponibles para encontrar los chats');
        }

        const botIds = bots.map((bot) => bot._id);

        const chats = await Chat.find({ bot: { $in: botIds } }).select('phone bot messages name');

        if (!chats || chats.length === 0) {
            throw new Error('No hay chats disponibles');
        }
        const phoneNumbers = chats.map((chat) => {
            return {
                ...(chat.name ? { nombre: chat.name } : {}),
                numero: chat.phone,
                bot: chat.bot,
                ...(chat.messages
                    ? { message: chat.messages[chat.messages?.length - 1].message }
                    : {}),
                ...(chat.messages
                    ? { lastDate: chat.messages[chat.messages?.length - 1].created }
                    : {}),
            };
        });
        return JSON.stringify(phoneNumbers);
    } catch (error) {
        console.log(error);
        return JSON.stringify([]);
    }
};

export const getChatsFromPhone = async (phone: string, bot: string, limit: number) => {
    try {
        const user = await currentUser();
        await connectToDB();
        if (!user) {
            throw new Error('Acceso no autorizado');
        }

        // Buscar el chat del usuario por número de teléfono
        const chat = await Chat.findOne(
            { phone, bot },
            { messages: { $slice: -limit * 2 } }, // 🔥 Solo los últimos "limit * 2" mensajes para quitar las tools
        );

        if (!chat) {
            throw new Error('Chat no encontrado');
        }

        // Filtrar mensajes por role ('user' o 'assistant'), mapear solo los campos necesarios y limitar resultados
        const messages = chat.messages
            .filter((message) => {
                if (message.role === 'user') {
                    return true;
                }
                if (message.role === 'assistant') {
                    return !message.tool_calls || message.tool_calls.length === 0;
                }
                return false;
            }) // Filtrar roles válidos
            .map(({ role, message, created }) => ({ role, message, created })) // Seleccionar solo role, message y fecha
            .slice(-limit); // Limitar al número especificado

        return messages;
    } catch (error) {
        console.error(error);
        return []; // Retorna un arreglo vacío en caso de error
    }
};

/**
 * Obtiene todas las categorias utilizadas en productos por el usuario actual
 * @returns String[]
 */
export const getProductCategories = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            console.error('Acceso no autorizado');
            throw new Error('Acceso no autorizado');
        }
        await connectToDB();
        const productos = await Producto.find({ eliminado: false, userId: user?.id }).select(
            'categorias',
        );

        const categorias = productos
            .flatMap((p) => p.categorias) // Unificamos todas las categorías
            .filter(Boolean) // Filtramos valores nulos o vacíos
            .map((cat) => cat.toLowerCase()) // Pasamos todo a minúsculas para normalizar
            .filter((cat, index, self) => self.indexOf(cat) === index) // Eliminamos duplicados
            .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)); // Capitalizamos

        return categorias;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw new Error('No se pudo obtener las categorías de productos');
    }
};

/**
 * Obtiene todas los tags utilizados en productos por el usuario actual
 * @returns String[]
 */
export const getProductTags = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            console.error('Acceso no autorizado');
            throw new Error('Acceso no autorizado');
        }
        await connectToDB();
        const productos = await Producto.find({ eliminado: false, userId: user?.id }).select(
            'tags',
        );

        const tags = productos
            .flatMap((p) => p.tags) // Unificamos todos los tags
            .filter(Boolean) // Filtramos valores nulos o vacíos
            .map((tag) => tag.toLowerCase()) // Pasamos todo a minúsculas para normalizar
            .filter((tag, index, self) => self.indexOf(tag) === index) // Eliminamos duplicados
            .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)); // Capitalizamos

        return tags;
    } catch (error) {
        console.error('Error al obtener los tags:', error);
        throw new Error('No se pudieron obtener los tags de productos');
    }
};

/**
 * Obtiene todas las variantes y subvariantes utilizadas en productos por el usuario actual
 * @returns String[]
 */
export const getProductVariantes = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            console.error('Acceso no autorizado');
            throw new Error('Acceso no autorizado');
        }
        await connectToDB();
        const productos = await Producto.find({ eliminado: false, userId: user?.id }).select(
            'variante subVariante',
        );

        const variantes = productos
            .flatMap((p) => {
                const nombresVariantes = [];

                if (p.variante && p.variante.nombre) {
                    nombresVariantes.push(p.variante.nombre);
                }

                if (p.subVariante && p.subVariante.nombre) {
                    nombresVariantes.push(p.subVariante.nombre);
                }

                return nombresVariantes;
            })
            .filter(Boolean) // Filtramos valores nulos o vacíos
            .map((v) => v.toLowerCase()) // Pasamos todo a minúsculas para normalizar
            .filter((v, index, self) => self.indexOf(v) === index) // Eliminamos duplicados
            .map((v) => v.charAt(0).toUpperCase() + v.slice(1)); // Capitalizamos

        return variantes;
    } catch (error) {
        console.error('Error al obtener las variantes:', error);
        throw new Error('No se pudieron obtener las variantes de productos');
    }
};

/**
 * Obtiene todas las marcas utilizadas en productos por el usuario actual
 * @returns String[]
 */
export const getProductMarcas = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            console.error('Acceso no autorizado');
            throw new Error('Acceso no autorizado');
        }
        await connectToDB();
        const productos = await Producto.find({ eliminado: false, userId: user?.id }).select(
            'marca',
        );

        const marcas = productos
            .map((p) => p.marca) // Extraemos solo las marcas
            .filter(Boolean) // Filtramos marcas nulas o vacías
            .map((marca) => marca?.toLowerCase() || '') // Pasamos todo a minúsculas para normalizar
            .filter((marca, index, self) => self.indexOf(marca) === index) // Eliminamos duplicados
            .map((marca) => marca.charAt(0).toUpperCase() + marca.slice(1)); // Capitalizamos

        return marcas;
    } catch (error) {
        console.error('Error al obtener las marcas:', error);
        throw new Error('No se pudieron obtener las marcas de productos');
    }
};
