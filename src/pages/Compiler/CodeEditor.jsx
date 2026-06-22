import { useRef } from 'react';
import Editor from '@monaco-editor/react';

function defineThemes(monaco) {
  monaco.editor.defineTheme('pyc-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c4b5fd' },
      { token: 'string', foreground: '86efac' },
      { token: 'number', foreground: 'fbbf24' },
      { token: 'identifier', foreground: 'fafafa' },
    ],
    colors: {
      'editor.background': '#0a0f1ad9',
      'editor.foreground': '#e6edf3',
      'editorLineNumber.foreground': '#3a4660',
      'editorLineNumber.activeForeground': '#aab6d6',
      'editor.selectionBackground': '#6366f155',
      'editor.lineHighlightBackground': '#6366f114',
      'editor.lineHighlightBorder': '#00000000',
      'editorCursor.foreground': '#8ab4ff',
      'editorGutter.background': '#00000000',
      'editorWidget.background': '#141a2bf2',
      'editorWidget.border': '#2a3350',
      'editorSuggestWidget.background': '#141a2bf7',
      'editorSuggestWidget.border': '#2a3350',
      'editorSuggestWidget.selectedBackground': '#26304d',
      'editorIndentGuide.background1': '#1d2540',
      'minimap.background': '#00000000',
      'scrollbarSlider.background': '#3a416180',
    },
  });

  monaco.editor.defineTheme('pyc-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
      { token: 'keyword', foreground: '7c3aed' },
      { token: 'string', foreground: '16a34a' },
      { token: 'number', foreground: 'b45309' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#09090b',
      'editorLineNumber.foreground': '#d4d4d8',
      'editorLineNumber.activeForeground': '#52525b',
      'editor.lineHighlightBackground': '#f4f4f5',
      'editorCursor.foreground': '#6366f1',
    },
  });
}

export default function CodeEditor({
  value,
  onChange,
  theme,
  fontSize,
  wordWrap,
  minimap,
  onRun,
  onSave,
  onReady,
}) {
  const editorRef = useRef(null);

  const handleBeforeMount = (monaco) => {
    defineThemes(monaco);
  };

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;

    // Ctrl/Cmd+Enter -> Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun?.();
    });
    // Ctrl/Cmd+S -> Save (suppress the browser save dialog)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });
    // Ctrl/Cmd+D -> Duplicate line (overrides Monaco's default "add selection")
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.getAction('editor.action.copyLinesDownAction')?.run();
    });
    // Ctrl/Cmd+/ -> toggle comment is Monaco's default (editor.action.commentLine)

    onReady?.(editor, monaco);

    // Start the caret at the very top so typing begins from line 1.
    editor.setPosition({ lineNumber: 1, column: 1 });
    editor.revealLine(1);
    editor.focus();
  };

  return (
    <div className="pyc-monaco">
      <Editor
        defaultLanguage="python"
        language="python"
        height="100%"
        width="100%"
        value={value}
        theme={theme === 'light' ? 'pyc-light' : 'pyc-dark'}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        onChange={(val) => onChange(val ?? '')}
        loading={
          <div className="pyc-editor-loading">
            <div className="pyc-spinner" />
            <span>Loading editor…</span>
          </div>
        }
        options={{
          fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
          fontSize,
          fontLigatures: true,
          minimap: { enabled: minimap },
          lineNumbers: 'on',
          wordWrap: wordWrap ? 'on' : 'off',
          tabSize: 4,
          insertSpaces: true,
          autoIndent: 'full',
          formatOnPaste: true,
          matchBrackets: 'always',
          bracketPairColorization: { enabled: true },
          folding: true,
          foldingHighlight: true,
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fixedOverflowWidgets: true,
          padding: { top: 14, bottom: 14 },
          scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
          // IntelliSense-style assistance
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          wordBasedSuggestions: 'currentDocument',
          tabCompletion: 'on',
          snippetSuggestions: 'inline',
          parameterHints: { enabled: true },
          guides: { indentation: true, bracketPairs: true },
        }}
      />
    </div>
  );
}
