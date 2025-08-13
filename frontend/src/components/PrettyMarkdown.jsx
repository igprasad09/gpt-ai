import React from "react";
import ReactMarkdown from "react-markdown";

function cleanExplanation(text) {
  return text
    .replace(/\*\*/g, "**")       // normalize bold markers
    .replace(/\n\s*\n/g, "\n\n")  // remove extra blank lines
    .replace(/(\w)\n(\w)/g, "$1 $2") // fix words split by newline
    .trim();
}

function formatExplanation(text) {
  return text
    .split(/(?=\d+\s)/) // split at numbered steps (1, 2, 3...)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `- ${line}`)
    .join("\n");
}

export default function PrettyMarkdown({ text }) {
  const cleaned = cleanExplanation(text);
  const formatted = formatExplanation(cleaned);

  return (
    <div className="prose max-w-none p-4 bg-white rounded-lg shadow">
      <ReactMarkdown>{formatted}</ReactMarkdown>
    </div>
  );
}
