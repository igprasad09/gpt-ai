import { useEffect, useRef, useState } from "react";
import PrettyMarkdown from "./components/PrettyMarkdown.jsx";
import { Input } from "./components/ui/input.js";
import "./App.css";
import { Button } from "./components/ui/button.js";
import { Loader2Icon } from "lucide-react";
import { motion, useScroll } from "motion/react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { WavyBackground } from "./components/ui/wavy-background.js";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [lang, setLang] = useState("");
  const [active, setActive] = useState('code');
  const [isFullHeight, setIsFullHeight] = useState(false);

  const divRef = useRef(null);

  const handle_Submition = async () => {
    if (input.trim() === "") {
      return alert("Enter some query");
    }
    setLoading(true);
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

      setLoading(false);
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

  useEffect(() => {
    const codeMatch = message.match(/```(\w+)?\n([\s\S]*?)```/);
    if (codeMatch) {
      setCode(codeMatch[2]);
      setLang(codeMatch[1] || "plaintext"); // store language
    } else {
      setCode("");
      setLang("plaintext");
    }
  }, [message]);

  function handle_exicution(){
      setActive('run');
      setOutput('Exicuting.......................👁')
      axios.post("http://localhost:3000/code/exe",{
           code,
           language: lang
      }).then((res)=>{
          setOutput(res.data.exe.run.output)
          console.log(res.data.exe.run.output)
      })
  }
  
  function display_code(){
      setActive('code');
  }

  useEffect(()=>{
       function checkHeight() {
      if (divRef.current) {
        const divHeight = divRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;

        // If div height >= viewport height → set full height state
        setIsFullHeight(divHeight >= viewportHeight);
      }
    }

    checkHeight(); // initial check
    window.addEventListener("resize", checkHeight);

    return () => window.removeEventListener("resize", checkHeight);
  },[code,explanation])
  return (
    <>
      <div
        className={`relative h-screen overflow-hidden bg-black w-screen flex justify-center ${
          code ? "" : ""
        }`}
      >
        <WavyBackground className="absolute inset-0 -z-10 pointer-events-none"/>
        <motion.div
          ref={divRef}
          className={`${code ? "w-[50%]" : "w-[70%]"}   ${
            explanation
              ? " overflow-y-scroll scrollbar-custom "
              : "overflow-x-hidden overflow-y-hidden   mt-auto mb-auto"
          } ${isFullHeight?"":"mt-auto mb-auto"}`}
        >
          <section className="p-2 relative text-sm leading-relaxed bg-zinc-700 rounded-xl shadow-md prose">
            <div className="flex relative">
              <Input
                type="text"
                className="relative"
                placeholder="Enter you Query.."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {loading ? (
                <Button variant={"outline"} className="mb-3 ml-4">
                  <Loader2Icon className="animate-spin " />
                  Thinking....
                </Button>
              ) : (
                <Button
                  onClick={handle_Submition}
                  className="cursor-pointer mb-3 ml-4"
                  variant={"outline"}
                >
                  Search
                </Button>
              )}
            </div>
            {explanation ? (
              <PrettyMarkdown text={explanation} />
            ) : (
              <PrettyMarkdown text="Hii.. How can i helf you...." />
            )}
          </section>
        </motion.div>

        {code && (
          <div className="bg-black relative w-[50%] h-full">
            <div className="flex m-1">
              <Button
                variant={"ghost"}
                className={`text-white font-semibold  mr-3 ${active == "code"? "bg-white text-black":"bg-zinc-800"}`}
                onClick={display_code}
              >
                <svg
                  className="w-6 h-6 text-green-700 size-4 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
                  />
                </svg>
                Code
              </Button>
              <Button
                variant={"ghost"}
                className={`text-white font-semibold ${active == "run"? "bg-white text-black":"bg-zinc-800"}`}
                onClick={handle_exicution}
              >
                <svg
                  className=" text-shadow-neutral-500 size-6 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                    clipRule="evenodd"
                  />
                </svg>
                Run
              </Button>
            </div>
            <Editor
              height={"100%"}
              value={active=="code"? code : output}
              language={lang}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enable: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
