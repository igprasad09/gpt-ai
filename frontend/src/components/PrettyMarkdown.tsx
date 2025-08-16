import ReactMarkdown from "react-markdown";
import {motion, useScroll} from 'motion/react';

function cleanExplanation(text: string) {
  return text
    .replace(/\*\*/g, "**")       // normalize bold markers
    .replace(/\n\s*\n/g, "\n\n")  // remove extra blank lines
    .replace(/(\w)\n(\w)/g, "$1 $2") // fix words split by newline
    .trim();
}

function formatExplanation(text: string) {
  return text
    .split(/(?=\d+\s)/) // split at numbered steps (1, 2, 3...)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `- ${line}`)
    .join("\n");
}

function PrettyMarkdown({ text }:{text:string}) {
  const cleaned = cleanExplanation(text);
  const formatted = formatExplanation(cleaned);

  const {scrollYProgress} = useScroll();


  return (
    <motion.div style={{scaleX: scrollYProgress}} className="prose leading-7 [&[&:not(:first-child)]:mt-6] max-w-none text-white p-4 bg-neutral-800 rounded-lg shadow">
      <ReactMarkdown>{formatted}</ReactMarkdown>
    </motion.div>
  );
}

export {PrettyMarkdown}

