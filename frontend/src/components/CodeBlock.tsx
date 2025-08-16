import { useRecoilState, useRecoilValue } from "recoil";
import { Button } from "./ui/button"
import { codeAtom, isactiveAtom, languageAtom, outputAtom } from "@/Recoil/RecoilAtoms";
import axios from "axios";
import { Editor } from "@monaco-editor/react";

function CodeBlock() {
   const [active, setActive] = useRecoilState(isactiveAtom); 
   const [code, setCode] = useRecoilState(codeAtom);
   const [output, setOutput] = useRecoilState(outputAtom);
   const lang = useRecoilValue(languageAtom);

  function display_code(){
      setActive('code');
  }

  function handle_exicution(){
      setActive('run');
      setOutput('Exicuting.......................👁')
      axios.post("https://gpt-ai-mauve.vercel.app/code/exe",{
           code,
           language: lang
      }).then((res)=>{
          setOutput(res.data.exe.run.output)
      })
  }
 
  console.log("codeBlock.tsx")

  return (
    <div className="bg-black relative w-[50%] h-full overflow-y-scroll">
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
              height={"95%"}
              value={active=="code"? code : output}
              language={lang}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
  )
}

export default CodeBlock
