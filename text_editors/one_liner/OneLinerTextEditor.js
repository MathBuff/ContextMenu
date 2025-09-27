export class OneLinerTextEditor {
    constructor(maxHistory = 100, indentString = "    ") {
        this.maxHistory = maxHistory;
        this.indentString = indentString;

        this.editor = null;
        this.isInitialized = false;

        this.undoStack = [];
        this.redoStack = [];
        this.lastState = "";

        this._resolver = null;
        this._saveTimer = null;

        this._bindHandlers();
    }

    _bindHandlers() {
        this.onInput = this.onInput.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onPaste = this.onPaste.bind(this);
    }

    // -------------------------
    // Initialization
    // -------------------------
    initialize(targetElement) {
        if (this.isInitialized) return;

        this.editor = targetElement;
        this.editor.contentEditable = "true";
        this.editor.style.whiteSpace = "nowrap"; // single line only
        this.editor.style.overflow = "hidden";
        this.editor.style.outline = "none";

        this.lastState = this.editor.textContent || "";
        this.undoStack.push({ content: this.lastState, selection: this._getSelectionOffsets() });

        this.editor.addEventListener("input", this.onInput);
        this.editor.addEventListener("keydown", this.onKeyDown);
        this.editor.addEventListener("paste", this.onPaste);

        this.editor.focus();
        this.isInitialized = true;
    }

    destroy() {
        if (!this.isInitialized) return;
        if (this._saveTimer) {
            clearTimeout(this._saveTimer);
            this._saveTimer = null;
        }

        this.editor.removeEventListener("input", this.onInput);
        this.editor.removeEventListener("keydown", this.onKeyDown);
        this.editor.removeEventListener("paste", this.onPaste);

        this.editor.contentEditable = "false";
        this.editor = null;
        this.isInitialized = false;
    }

    // -------------------------
    // Selection Helpers
    // -------------------------
    _getSelectionOffsets() {
        if (!this.editor) return { start: 0, end: 0, collapsed: true };

        const sel = window.getSelection();
        if (!sel.rangeCount) return { start: 0, end: 0, collapsed: true };

        const range = sel.getRangeAt(0);
        const preStart = range.cloneRange();
        preStart.selectNodeContents(this.editor);
        preStart.setEnd(range.startContainer, range.startOffset);
        const start = preStart.toString().length;

        const preEnd = range.cloneRange();
        preEnd.selectNodeContents(this.editor);
        preEnd.setEnd(range.endContainer, range.endOffset);
        const end = preEnd.toString().length;

        return { start, end, collapsed: range.collapsed };
    }

    _restoreSelection({ start = 0, end = 0, collapsed = true } = {}) {
        if (!this.editor) return;

        const sel = window.getSelection();
        sel.removeAllRanges();

        const walker = document.createTreeWalker(this.editor, NodeFilter.SHOW_TEXT);
        let pos = 0, node;
        const range = document.createRange();
        let started = false, ended = false;

        while ((node = walker.nextNode())) {
            const len = node.textContent.length;
            if (!started && start >= pos && start <= pos + len) {
                range.setStart(node, start - pos);
                started = true;
            }
            if (!ended && end >= pos && end <= pos + len) {
                range.setEnd(node, end - pos);
                ended = true;
            }
            pos += len;
            if (started && ended) break;
        }

        if (!started || !ended) {
            range.selectNodeContents(this.editor);
            range.collapse(false);
        }

        try { sel.addRange(range); } catch (err) { }
        if (collapsed) sel.collapseToStart();
    }

    // -------------------------
    // Undo / Redo
    // -------------------------
    saveState() {
        if (!this.editor) return;

        const content = this.editor.textContent;
        const selection = this._getSelectionOffsets();
        if (content === this.lastState) return;

        this.undoStack.push({ content, selection });
        if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
        this.redoStack = [];
        this.lastState = content;
    }

    undo() {
        if (!this.editor || this.undoStack.length <= 1) return;

        this.redoStack.push({ content: this.editor.textContent, selection: this._getSelectionOffsets() });
        this.undoStack.pop();
        const prev = this.undoStack[this.undoStack.length - 1];

        this.editor.textContent = prev.content;
        this.lastState = prev.content;
        setTimeout(() => this._restoreSelection(prev.selection), 0);
    }

    redo() {
        if (!this.editor || !this.redoStack.length) return;

        const next = this.redoStack.pop();
        this.undoStack.push({ content: this.editor.textContent, selection: this._getSelectionOffsets() });

        this.editor.textContent = next.content;
        this.lastState = next.content;
        setTimeout(() => this._restoreSelection(next.selection), 0);
    }


// -------------------------
// Indent / Unindent Helpers
// -------------------------
_insertIndentAtCursor() {
    if (!this.editor) return;
    // No selection: insert indent at cursor
    document.execCommand("insertText", false, this.indentString);
}

_indentSelectedText() {
    if (!this.editor) return;

    const { start, end, collapsed } = this._getSelectionOffsets();

    if (collapsed) {
        // No selection: insert indent at cursor
        this._insertIndentAtCursor();
        return;
    }

    // Selection exists
    const selStart = Math.min(start, end);
    const selEnd = Math.max(start, end);

    // Move cursor to selection start
    this._restoreSelection({ start: selStart, end: selStart, collapsed: true });

    // Insert indent string
    document.execCommand("insertText", false, this.indentString);

    // Adjust selection: 
    // new start = old start + indent length
    // new end = old end + indent length
    const newStart = selStart + this.indentString.length;
    const newEnd = selEnd + this.indentString.length;

    // Restore selection
    this._restoreSelection({ start: newStart, end: newEnd, collapsed: false });

    this.lastState = this.editor.textContent;
}

_unindentSelection() {
    const { start, end } = this._getSelectionOffsets();
    let fullText = this.editor.textContent;
    if (!fullText) return;

    let newText = fullText;
    let removedLength = 0;

    // Determine the range to unindent
    const selStart = Math.min(start, end);
    const selEnd = Math.max(start, end);

    // Only unindent at the start of the text or selection
    if (newText.startsWith(this.indentString)) {
        newText = newText.slice(this.indentString.length);
        removedLength = this.indentString.length;
    } else {
        // Remove as much leading whitespace as possible, but only up to one indentString
        const leadingWSMatch = newText.match(/^\s+/);
        if (leadingWSMatch) {
            removedLength = Math.min(leadingWSMatch[0].length, this.indentString.length);
            newText = newText.slice(removedLength);
        } else {
            return; // nothing to remove
        }
    }

    this.editor.textContent = newText;

    // Adjust selection offsets proportionally
    let newStart = start - removedLength;
    let newEnd = end - removedLength;

    // Clamp selection to valid bounds
    newStart = Math.max(0, newStart);
    newEnd = Math.max(0, newEnd);

    this._restoreSelection({ start: newStart, end: newEnd, collapsed: newStart === newEnd });

    this.lastState = newText;
}



    // -------------------------
    // Input / Key Handling
    // -------------------------
    onInput() {
        if (this._saveTimer) clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => {
            this._saveTimer = null;
            if (!this.editor) return;
            this.saveState();
        }, 300);
    }

    onPaste(e) {
        e.preventDefault();
        this.saveState();
        let text = e.clipboardData.getData("text/plain");
        text = text.replace(/[\r\n]+/g, " "); // enforce single line
        document.execCommand("insertText", false, text);
    }

    onKeyDown(e) {
        const key = e.key.toLowerCase();

        if (["backspace", "delete"].includes(key)) this.saveState();

        if (key === "enter" || key === "escape") {
            e.preventDefault();
            if (this._resolver) {
                const result = this.editor ? this.editor.textContent : "";
                if (this._saveTimer) { clearTimeout(this._saveTimer); this._saveTimer = null; }
                this.destroy();
                this._resolver(result);
                this._resolver = null;
            }
            return;
        }

        if (e.ctrlKey && key === "z" && !e.shiftKey) {
            e.preventDefault();
            this.undo();
            return;
        }
        if ((e.ctrlKey && key === "y") || (e.ctrlKey && e.shiftKey && key === "z")) {
            e.preventDefault();
            this.redo();
            return;
        }

        if (e.ctrlKey && key === "m") {
            e.preventDefault();
            this.toggleSpellCheck();
            return;
        }

        if (key === "tab") {
            e.preventDefault();
            this.saveState();
            const { collapsed } = this._getSelectionOffsets();
            if (e.shiftKey) {
                this._unindentSelection();
            } else {
                if (collapsed) {
                    this._insertIndentAtCursor();
                } else {
                    this._indentSelectedText();
                }
            }
        }

    }//end of function

    // -------------------------
    // Spellcheck
    // -------------------------
    setSpellCheck(enabled = true) {
        if (!this.editor) return;
        const selection = this._getSelectionOffsets();
        this.editor.spellcheck = !!enabled;
        this._refreshContent(selection);
    }

    toggleSpellCheck() {
        if (!this.editor) return;
        const selection = this._getSelectionOffsets();
        this.editor.spellcheck = !this.editor.spellcheck;
        this._refreshContent(selection);
    }

    _refreshContent(selection) {
        if (!this.editor) return;
        const content = this.editor.innerHTML;
        this.editor.innerHTML = "";
        this.editor.innerHTML = content;
        this._restoreSelection(selection);
    }

    // -------------------------
    // Public API
    // -------------------------
    async liveEditElementData(targetElement) {
        this.initialize(targetElement);
        return new Promise(resolve => {
            this._resolver = resolve;
        });
    }
}

