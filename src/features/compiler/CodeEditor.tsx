/* Ported from mohitmjm/portfolio — Monaco Python editor with cyber dark theme. */

import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

function defineThemes(monaco: Monaco) {
  monaco.editor.defineTheme("pyc-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "71717a", fontStyle: "italic" },
      { token: "keyword", foreground: "c4b5fd" },
      { token: "string", foreground: "86efac" },
      { token: "number", foreground: "fbbf24" },
      { token: "identifier", foreground: "fafafa" },
    ],
    colors: {
      "editor.background": "#0a0f1a",
      "editor.foreground": "#e6edf3",
      "editorLineNumber.foreground": "#3a4660",
      "editorLineNumber.activeForeground": "#aab6d6",
      "editor.selectionBackground": "#6366f155",
      "editor.lineHighlightBackground": "#6366f114",
      "editor.lineHighlightBorder": "#00000000",
      "editorCursor.foreground": "#8ab4ff",
      "editorGutter.background": "#00000000",
      "editorWidget.background": "#141a2b",
      "editorWidget.border": "#2a3350",
      "editorSuggestWidget.background": "#141a2b",
      "editorSuggestWidget.border": "#2a3350",
      "editorSuggestWidget.selectedBackground": "#26304d",
      "editorIndentGuide.background1": "#1d2540",
      "minimap.background": "#00000000",
      "scrollbarSlider.background": "#3a416180",
    },
  });
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  onSave?: () => void;
  fontSize?: number;
  minimap?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  onRun,
  onSave,
  fontSize = 14,
  minimap = false,
}: Props) {
  const handleBeforeMount = (monaco: Monaco) => defineThemes(monaco);

  const handleMount = (ed: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun?.());
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => onSave?.());
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      ed.getAction("editor.action.copyLinesDownAction")?.run();
    });
    ed.setPosition({ lineNumber: 1, column: 1 });
    ed.revealLine(1);
    ed.focus();
  };

  return (
    <Editor
      defaultLanguage="python"
      language="python"
      height="100%"
      width="100%"
      value={value}
      theme="pyc-dark"
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      onChange={(val) => onChange(val ?? "")}
      loading={
        <div className="h-full grid place-items-center font-hud text-xs tracking-widest text-cyan">
          LOADING EDITOR…
        </div>
      }
      options={{
        fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
        fontSize,
        fontLigatures: true,
        minimap: { enabled: minimap },
        lineNumbers: "on",
        tabSize: 4,
        insertSpaces: true,
        autoIndent: "full",
        formatOnPaste: true,
        matchBrackets: "always",
        bracketPairColorization: { enabled: true },
        folding: true,
        renderLineHighlight: "line",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fixedOverflowWidgets: true,
        padding: { top: 14, bottom: 14 },
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        wordBasedSuggestions: "currentDocument",
        tabCompletion: "on",
        snippetSuggestions: "inline",
        parameterHints: { enabled: true },
        guides: { indentation: true, bracketPairs: true },
      }}
    />
  );
}
