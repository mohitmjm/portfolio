# Requirements Document

## Introduction

This feature adds a new "Compiler" page to the portfolio where visitors can write, edit, and run Python code directly in the browser and see the output. Because the portfolio is a static React/Vite single-page app deployed on Netlify (no backend), Python execution is intended to run fully client-side using Pyodide (CPython compiled to WebAssembly). The page must offer a polished, modern, responsive UI that is visually consistent with the rest of the portfolio (dark theme, gradients, motion) and accessible.

The goal is a credible, interactive "Python playground" that showcases the developer's skills, not a full IDE. Scope is intentionally limited to single-file Python execution with standard output, error reporting, and a small set of quality-of-life features.

## Glossary

- **Pyodide**: A port of CPython to WebAssembly/Emscripten that runs Python in the browser.
- **Runtime**: The Pyodide interpreter instance once loaded and initialized.
- **stdout / stderr**: Standard output and standard error streams produced by executing code.
- **Editor**: The in-page code editing surface (syntax highlighting, line numbers).

## Requirements

### Requirement 1 — Page and Navigation

**User Story:** As a portfolio visitor, I want to reach a dedicated compiler page from the site, so that I can try running Python without leaving the portfolio.

#### Acceptance Criteria

1. WHEN a user navigates to the `/compiler` route THEN the system SHALL render the Python Compiler page.
2. THE system SHALL provide a visible navigation entry point (e.g., navbar link and/or hero/projects link) that routes to `/compiler`.
3. WHEN the compiler page loads THEN the system SHALL set an appropriate document title and meta description for the page.
4. WHEN a user is on the compiler page THEN the system SHALL provide a way to navigate back to the main portfolio.

### Requirement 2 — Code Editor

**User Story:** As a user, I want a real code editor with Python syntax highlighting, so that I can write code comfortably.

#### Acceptance Criteria

1. THE system SHALL display a code editor that supports multi-line Python input with syntax highlighting.
2. THE system SHALL show line numbers and preserve indentation (including auto-indent on new lines where feasible).
3. THE editor SHALL be pre-populated with a simple runnable example on first load (e.g., a "Hello, World!" or small demo).
4. THE editor SHALL support standard editing interactions: text selection, copy, paste, undo, and redo.
5. WHERE the user presses the run keyboard shortcut (Ctrl/Cmd+Enter) THEN the system SHALL trigger code execution.

### Requirement 3 — Runtime Initialization

**User Story:** As a user, I want clear feedback while the Python runtime loads, so that I understand the page is working and not frozen.

#### Acceptance Criteria

1. WHEN the compiler page first needs to execute code THEN the system SHALL load and initialize the Pyodide runtime.
2. WHILE the runtime is loading THEN the system SHALL display a visible loading indicator and disable the Run action.
3. WHEN the runtime finishes initializing THEN the system SHALL enable the Run action and indicate readiness.
4. IF runtime initialization fails THEN the system SHALL display a clear error message and allow the user to retry.
5. THE system SHALL initialize the runtime only once per page session and reuse it for subsequent runs.

### Requirement 4 — Code Execution

**User Story:** As a user, I want to run my Python code and see the result, so that I can test ideas quickly.

#### Acceptance Criteria

1. WHEN the user activates Run AND the runtime is ready THEN the system SHALL execute the current editor contents as Python.
2. WHEN execution produces standard output THEN the system SHALL display that output in an output panel.
3. WHILE code is executing THEN the system SHALL show a running/busy state and prevent concurrent runs.
4. WHEN execution completes THEN the system SHALL restore the idle state and re-enable the Run action.
5. THE system SHALL execute code client-side only and SHALL NOT transmit user code to any third-party server.

### Requirement 5 — Output and Error Handling

**User Story:** As a user, I want to see both successful output and clear error messages, so that I can debug my code.

#### Acceptance Criteria

1. WHEN executed code raises an exception THEN the system SHALL display the Python error type, message, and traceback in the output panel, visually distinguished from normal output.
2. WHEN executed code writes to stderr THEN the system SHALL display that content in the output panel.
3. WHEN a run produces no output and no error THEN the system SHALL indicate that execution completed with no output.
4. THE system SHALL provide a control to clear the output panel.
5. IF code execution exceeds a reasonable safeguard (e.g., the page becomes unresponsive) THEN the system SHALL surface guidance to the user (acceptable limitation note) rather than failing silently.

### Requirement 6 — Standard Input Handling

**User Story:** As a user, I want programs that read input to behave predictably, so that `input()` calls do not silently hang the page.

#### Acceptance Criteria

1. WHEN executed code calls `input()` THEN the system SHALL provide a mechanism to supply input (e.g., a browser prompt or a dedicated stdin text area).
2. IF no stdin mechanism value is available THEN the system SHALL handle the call gracefully (e.g., return empty/EOF or a clear message) WITHOUT freezing the page indefinitely.

### Requirement 7 — UI/UX Quality

**User Story:** As a visitor, I want the compiler to look polished and on-brand, so that it reflects well on the portfolio.

#### Acceptance Criteria

1. THE page SHALL use a split layout (editor and output side by side on wide screens, stacked on narrow screens).
2. THE page SHALL match the portfolio's visual language (dark theme, accent colors, typography, and motion where consistent).
3. THE page SHALL provide primary controls: Run, Clear output, and Reset/Load example, with clear affordances and disabled states.
4. THE page SHALL display the active Python/runtime version or a clear "Python (Pyodide)" label so users know what is running.
5. WHEN actions occur (loading, running, errors) THEN the UI SHALL communicate state changes through visible indicators.

### Requirement 8 — Responsiveness and Accessibility

**User Story:** As a user on any device, I want the compiler to be usable and accessible, so that it works regardless of how I visit.

#### Acceptance Criteria

1. THE page SHALL be responsive and usable on mobile, tablet, and desktop viewport widths.
2. THE interactive controls SHALL be keyboard operable and have accessible names/labels.
3. THE output and status changes SHALL be conveyed in a way assistive technologies can announce (e.g., appropriate roles/live regions).
4. THE color contrast of text and controls SHALL meet WCAG AA where feasible.

### Requirement 9 — Example Snippets (Quality of Life)

**User Story:** As a user, I want ready-made example programs, so that I can explore capabilities without writing code from scratch.

#### Acceptance Criteria

1. THE page SHALL offer at least three selectable example snippets (e.g., basics, a loop/algorithm, and a standard-library demo).
2. WHEN a user selects an example THEN the system SHALL load that snippet into the editor (with a guard against discarding unsaved edits, or a clear confirmation).

## Out of Scope

- Multi-file projects, package installation UI, or a virtual filesystem browser.
- Server-side execution, code persistence to a backend, or user accounts.
- Languages other than Python.
- Long-running processes, networking from within executed code, or background workers beyond what Pyodide provides.

## Assumptions and Constraints

- Execution is fully client-side via Pyodide; the initial runtime download is large (multiple MB) and loads on demand.
- `react-router-dom` is already a project dependency and will be used for the `/compiler` route.
- Third-party Python packages are limited to what Pyodide/micropip support; broad package support is not guaranteed and is out of scope unless explicitly added later.
- Truly untrusted-code sandboxing is bounded by the browser/WebAssembly model; no additional server-side isolation is provided because no server is involved.
