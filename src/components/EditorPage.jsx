import React, { useEffect, useRef, useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CODE_SNIPPET, LANGUAGES } from '../Constant';
import { executeCode } from '../Api';
import { ACTIONS } from '../../action';

export default function EditorPage({ socketRef, roomID }) {
  const [code, setCode] = useState(CODE_SNIPPET["javascript"]);
  const [output, setOutput] = useState(null);
  const [version, setVersion] = useState(LANGUAGES["javascript"]);
  const [codeLang, setCodeLang] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false); // Loading state for code execution
  const editorRef = useRef(null);  // Ref to access Monaco editor instance

  const handleLanguage = (e) => {
    const selectedLang = e.target.value;
    setCodeLang(selectedLang);
    setCode(CODE_SNIPPET[selectedLang]);
    setVersion(LANGUAGES[selectedLang]);
  };

  const RunCode = async () => {
    if (!code) return;
    setIsLoading(true); // Start loading
    try {
      const response = await executeCode(codeLang, code, version);
      setOutput(response.run || { stdout: "No output", stderr: "" });
    } catch (error) {
      console.error("Error in code execution:", error);
      setOutput({ stdout: "An error occurred while executing the code.", stderr: "" });
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (!socketRef.current) return;

    // Emit the code change to the backend
    const emitCodeChange = () => {
      console.log("Emitting code change to backend", code);  // Debugging output
      socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomID, code });
    };

    const timer = setTimeout(emitCodeChange, 500); // Debounce event emission
    return () => {
      clearTimeout(timer);
      socketRef.current.off(ACTIONS.CODE_CHANGE); // Clean up
    };
  }, [code, socketRef, roomID]);

  useEffect(() => {
    if (!socketRef.current) return;

    // Listen for the code change from other users
    const handleCodeChange = ({ code: receivedCode }) => {
      console.log("Received code update from another user", receivedCode);  // Debugging output
      if (receivedCode != null && editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          console.log("Updating Monaco editor model with new code");  // Debugging output
          model.setValue(receivedCode);  // Update the editor content directly
          setCode(receivedCode); // Sync the state with the editor content
        }
      }
    };

    socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange); // Clean up listener
    };
  }, [socketRef, roomID]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900">
      <div className="w-full max-w-2xl h-[80vh] bg-gray-800 text-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-700 text-center">Code Editor</h2>

        {/* Language Selection */}
        <div className="p-4">
          <label htmlFor="language">Languages:</label>
          <select
            id="language"
            className="pl-5 w-auto bg-gray-800 text-white"
            value={codeLang}
            onChange={handleLanguage}
          >
            {Object.entries(LANGUAGES).map(([lang, version]) => (
              <option key={lang} className="text-black" value={lang}>
                {lang} - {version}
              </option>
            ))}
          </select>
        </div>

        {/* Code Editor */}
        <Editor
          className="bg-black text-white"
          height="70vh"
          language={codeLang}
          value={code}  // Bind value to the state 'code'
          onChange={(value) => setCode(value)} // Update state when user edits
          theme="vs-dark"
          onMount={(editor) => {
            editorRef.current = editor;
            console.log("Monaco editor instance: ", editorRef.current);  // Debugging output
          }} // Save editor instance to ref
        />

        {/* Output Section */}
        <div className="p-4 h-90">
          <label htmlFor="output">Output:</label>
          <textarea
            disabled
            className="bg-gray-700 p-2 w-full rounded-md"
            value={output?.stdout || "No output"}
          ></textarea>
          {output?.stderr && <div className="h-30">{output.stderr}</div>}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-4 p-2 bg-gray-700 justify-center">
        <button
          onClick={() => {
            setCode('');
            setOutput(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        >
          <RefreshCw className="w-5 h-5" />
          Reset
        </button>
        <button
          onClick={RunCode}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
        >
          <Play className="w-5 h-5" />
          {isLoading ? 'Running...' : 'Run'}
        </button>
      </div>
    </div>
  );
}
