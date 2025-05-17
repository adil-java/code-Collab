import axios from "axios";
import { LANGUAGES } from "./Constant";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
});

export const executeCode = async (language, sourceCode,version) => {
    try {
       // Ensure version exists
     

        if (!version) {
            throw new Error(`Unsupported language: ${language}`);
        }

        const response = await API.post('/execute', {
            language: language,
            version:version.toString(),
            files: [
                {
                    name: "main",  // Fix: Added required `name` field
                    content: sourceCode
                }
            ]
        });

        return response.data;
    } catch (error) {
        console.error("Error executing code:", error.response?.data || error.message);
      
        throw error;
    }
};
