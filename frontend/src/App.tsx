import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Light as LightSyntaxHighlighter } from "react-syntax-highlighter";
import curl from "highlightjs-curl";
import PrettyMarkdown from "./components/PrettyMarkdown.jsx";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");

  const handle_Submition = async () => {
    if (input.trim() === "") {
      return alert("Enter some query");
    }
    setLoading(true)
    const response = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    setMessage(""); // clear previous

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const words = buffer.split(" ");
      buffer = words.pop() || "";
      
      setLoading(false)
      for (const word of words) {
        setMessage((prev) => prev + word + " ");
        await new Promise((r) => setTimeout(r, 0.5));
      }
     setInput("");
    }

    if (buffer) {
      setMessage((prev) => prev + buffer);
    }

  };

  // Split explanation & code after message changes
  useEffect(() => {
    // Match first code block
    const codeMatch = message.match(/```(\w+)?\n([\s\S]*?)```/);
    setCode(codeMatch ? codeMatch[2] : "");

    // Remove all code blocks to get explanation
    const explanationText = message.replace(/```[\s\S]*?```/g, "").trim();
    setExplanation(explanationText);
  }, [message]);
  
  useEffect(()=>{
    console.log(loading)
  },[loading]);
  
  return (
    <>
      <div className=" h-screen w-screen flex">
        <div className={`${code ? "w-[50%]": "w-[100%]"} overflow-x-scroll overflow-y-scroll`}>
          <section className="p-4 text-lg leading-relaxed bg-gray-300 rounded-xl shadow-md prose">
            <input
            type="text"
            placeholder="Enter a Query"
            className=" border px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handle_Submition}
               className="border px-5 bg-emerald-400 font-bold text-white border-black mb-5">{loading ? "Thinking....": "Submit"}</button>
             {explanation? <PrettyMarkdown text={explanation} /> : <PrettyMarkdown text="hii.. How can i helf you...."/>}
          </section>
        </div>
        
        {code && (
          <div className="bg-black w-[50%] overflow-x-scroll overflow-y-scroll">
          <LightSyntaxHighlighter
            language="javascript"
            style={curl}
            useInlineStyles={false}
            className=" rounded-xl p-4 shadow-md font-semibold text-green-600 text-md"
          >
            {code}
          </LightSyntaxHighlighter>
        </div>
        )}

      </div>
    </>
  );
}

export default App;
