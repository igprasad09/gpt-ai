import { codeAtom, explanationTextAtom, languageAtom, messageAtom } from "@/Recoil/RecoilAtoms";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

function CodeSeperator() {
   const message = useRecoilValue(messageAtom);
   const setCode = useSetRecoilState(codeAtom);
   const setExplanation = useSetRecoilState(explanationTextAtom);
   const setLang = useSetRecoilState(languageAtom);

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


  return (
    <div>
      
    </div>
  )
}

export default CodeSeperator
