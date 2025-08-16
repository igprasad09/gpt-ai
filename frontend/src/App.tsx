import "./App.css";
import { WavyBackground } from "./components/ui/wavy-background.js";
import { useRecoilValue } from "recoil";
import { codeAtom } from "./Recoil/RecoilAtoms.js";
import Explancation from "./components/Explancation.js";
import CodeBlock from "./components/CodeBlock.js";


function App() {
  const code = useRecoilValue(codeAtom);
  
  return (
    <>
      <div className={`relative h-screen  bg-black w-screen flex justify-center`}>
        <WavyBackground className="absolute inset-0 -z-10 pointer-events-none"/>
        
        {/* explanation block */}
        <Explancation/>

        {code && (
            <CodeBlock/>
        )}
      </div>
    </>
  );
}

export default App;
