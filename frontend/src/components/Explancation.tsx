import { codeAtom, explanationTextAtom, inputAtom, isFullHeightAtom, loadingAtom, messageAtom } from "@/Recoil/RecoilAtoms";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { PrettyMarkdown } from "./PrettyMarkdown";
import CodeSeperator from "./CodeSeperator";

function Explancation() {
  const divRef = useRef<HTMLDivElement>(null);
  
  const code = useRecoilValue(codeAtom);
  const explanation = useRecoilValue(explanationTextAtom);
  const [isFullHeight, setIsFullHeight] = useRecoilState(isFullHeightAtom);
  const [input, setInput] = useRecoilState(inputAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const setMessage = useSetRecoilState(messageAtom);

  const handle_Submition = async () => {
    if (input.trim() === "") {
      return alert("Enter some query");
    }
    setLoading(true);
    const response = await fetch("https://gpt-ai-mauve.vercel.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const reader = response.body!.getReader();
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

    console.log("explaintion.tsx")

  return (
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
             <CodeSeperator />
          </section>
        </motion.div>
  )
}

export default Explancation
