class ColorSelectionMenu {
    constructor() {
        this.rows = [];
        this.currentRow = 0;
        this.currentCol = 0;
        this.isOpen = false;
        this.resolve = null;
        
        // Create DOM elements
        this.overlay = null;
        this.menuElement = null;
        
        this.createElements();
        this.bindEvents();
    }
    
    createElements() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'color-menu-overlay hidden';
        
        // Create menu container
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'color-menu hidden';
        
        // Create footer
        this.footer = document.createElement('div');
        this.footer.className = 'menu-footer';
        
        this.colorNameDisplay = document.createElement('div');
        this.colorNameDisplay.className = 'color-name-display';
        
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'close-button';
        this.closeButton.innerHTML = '×';
        this.closeButton.title = 'Close menu';
        
        this.footer.appendChild(this.colorNameDisplay);
        this.footer.appendChild(this.closeButton);
        this.menuElement.appendChild(this.footer);
        
        // Append to body
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.menuElement);
    }
    
    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveDown();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveRight();
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.addPressedEffect();
                    this.selectCurrentColor();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.addCloseButtonPressedEffect();
                    this.close(null);
                    break;
            }
        });
        
        // Close button event
        this.closeButton.addEventListener('click', () => {
            this.close(null);
        });
        
        // Overlay click to cancel
        this.overlay.addEventListener('click', () => {
            this.addCloseButtonPressedEffect();
            this.close(null);
        });
    }
    
    addRow(colors) {
        this.rows.push(colors);
        
        // Reset cursor position when colors are added
        this.currentRow = 0;
        this.currentCol = 0;
        
        this.renderRows();
    }
    
    renderRows() {
        // Clear existing color squares
        const existingRows = this.menuElement.querySelectorAll('.color-row');
        existingRows.forEach(row => row.remove());
        
        // Render new rows
        this.rows.forEach((rowColors, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'color-row';
            
            rowColors.forEach((colorData, colIndex) => {
                const [name, hex] = colorData;
                const square = document.createElement('div');
                square.className = 'color-square';
                square.style.backgroundColor = hex;
                square.style.backgroundImage = `linear-gradient(rgba(51, 51, 51, 0.3), rgba(51, 51, 51, 0.3))`;
                square.dataset.name = name;
                square.dataset.hex = hex;
                square.dataset.row = rowIndex;
                square.dataset.col = colIndex;
                
                // Mouse events
                square.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.currentRow = parseInt(square.dataset.row);
                    this.currentCol = parseInt(square.dataset.col);
                    this.addPressedEffect();
                    setTimeout(() => {
                        this.selectCurrentColor();
                    }, 100);
                });
                
                square.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    square.classList.add('pressed');
                });
                
                square.addEventListener('mouseup', (e) => {
                    square.classList.remove('pressed');
                });
                
                square.addEventListener('mouseleave', (e) => {
                    square.classList.remove('pressed');
                });
                
                square.addEventListener('mouseenter', (e) => {
                    this.currentRow = parseInt(square.dataset.row);
                    this.currentCol = parseInt(square.dataset.col);
                    this.updateHighlight();
                });
                
                rowElement.appendChild(square);
            });
            
            // Insert before footer
            this.menuElement.insertBefore(rowElement, this.footer);
        });
        
        this.updateHighlight();
    }
    
    showTooltip(event, text) {
        this.tooltip.textContent = text;
        this.tooltip.classList.add('visible');
        this.updateTooltipPosition(event);
    }
    
    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }
    
    updateTooltipPosition(event) {
        const rect = this.tooltip.getBoundingClientRect();
        let x = event.clientX + 10;
        let y = event.clientY - 30;
        
        // Keep tooltip in viewport
        if (x + rect.width > window.innerWidth) {
            x = event.clientX - rect.width - 10;
        }
        if (y < 0) {
            y = event.clientY + 20;
        }
        
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
    }
    
    moveUp() {
        if (this.currentRow > 0) {
            this.currentRow--;
            this.clampCol();
            this.updateHighlight();
        }
    }
    
    moveDown() {
        if (this.currentRow < this.rows.length - 1) {
            this.currentRow++;
            this.clampCol();
            this.updateHighlight();
        }
    }
    
    moveLeft() {
        if (this.currentCol > 0) {
            this.currentCol--;
            this.updateHighlight();
        }
    }
    
    moveRight() {
        const currentRowLength = this.rows[this.currentRow]?.length || 0;
        if (this.currentCol < currentRowLength - 1) {
            this.currentCol++;
            this.updateHighlight();
        }
    }
    
    clampCol() {
        const currentRowLength = this.rows[this.currentRow]?.length || 0;
        if (this.currentCol >= currentRowLength) {
            this.currentCol = Math.max(0, currentRowLength - 1);
        }
    }
    
    addPressedEffect() {
        const currentSquare = this.menuElement.querySelector(
            `[data-row="${this.currentRow}"][data-col="${this.currentCol}"]`
        );
        
        if (currentSquare) {
            currentSquare.classList.add('pressed');
            setTimeout(() => {
                currentSquare.classList.remove('pressed');
            }, 100);
        }
    }
    
    addCloseButtonPressedEffect() {
        this.closeButton.classList.add('pressed');
        setTimeout(() => {
            this.closeButton.classList.remove('pressed');
        }, 100);
    }
    
    updateHighlight() {
        // Remove all highlights
        const squares = this.menuElement.querySelectorAll('.color-square');
        squares.forEach(square => square.classList.remove('highlighted'));
        
        // Add highlight to current position
        const currentSquare = this.menuElement.querySelector(
            `[data-row="${this.currentRow}"][data-col="${this.currentCol}"]`
        );
        
        if (currentSquare) {
            currentSquare.classList.add('highlighted');
            const colorName = currentSquare.dataset.name;
            this.colorNameDisplay.textContent = colorName;
        } else {
            this.colorNameDisplay.textContent = '';
        }
    }
    
    selectCurrentColor() {
        if (this.rows.length === 0) {
            this.close(null);
            return;
        }
        
        const currentColor = this.rows[this.currentRow]?.[this.currentCol];
        if (currentColor) {
            const [name, hex] = currentColor;
            this.close(hex);
        } else {
            this.close(null);
        }
    }
    
    async open() {
        return new Promise((resolve) => {
            if (this.rows.length === 0) {
                resolve(null);
                return;
            }
            
            this.resolve = resolve;
            this.isOpen = true;
            
            // Show elements and start animation
            this.overlay.classList.remove('hidden');
            this.menuElement.classList.remove('hidden');
            
            // Trigger animation on next frame
            requestAnimationFrame(() => {
                this.overlay.classList.add('visible');
                this.menuElement.classList.add('visible');
            });
            
            this.updateHighlight();
            
            // Focus for keyboard events
            this.menuElement.focus();
        });
    }
    
    close(result) {
        this.isOpen = false;
        
        // Start close animation
        this.overlay.classList.remove('visible');
        this.menuElement.classList.remove('visible');
        
        // Hide elements after animation
        setTimeout(() => {
            this.overlay.classList.add('hidden');
            this.menuElement.classList.add('hidden');
        }, 150);
        
        if (this.resolve) {
            this.resolve(result);
            this.resolve = null;
        }
    }
}//End of class

 // Clear existing menu
    defaultColorMenu = new ColorSelectionMenu();

    // Row 1: Reds / Oranges
    defaultColorMenu.addRow([
        ["Red", "#ff0000"],
        ["Red Burn", "#cc4125"],
        ["Red Berry", "#980000"],
        ["Red Blush", "#e06666"],
        ["Orange", "#ff9900"],
        ["Peach", "#f9cb9c"]
    ]);

    // Row 2: Yellows / Golds / Tan
    defaultColorMenu.addRow([
        ["Yellow", "#ffff00"],
        ["Yellow Brass", "#7f6000"],
        ["Yellow Gold", "#f1c232"],
        ["Gold", "#FFD700"],
        ["Tan", "#D2B48C"]
    ]);

    // Row 3: Greens
    defaultColorMenu.addRow([
        ["Green", "#00ff00"],
        ["Green Mint", "#93c47d"],
        ["Green Olive", "#38761d"]
    ]);

    // Row 4: Cyans / Blues
    defaultColorMenu.addRow([
        ["Cyan", "#00ffff"],
        ["Cyan Submarine", "#76a5af"],
        ["Blue", "#0000ff"],
        ["Blue Ocean", "#1155cc"],
        ["Blue Cornflower", "#4a86e8"],
        ["Blue Sky", "#6fa8dc"]
    ]);

    // Row 5: Purples
    defaultColorMenu.addRow([
        ["Purple", "#9900ff"],
        ["Purple Dream", "#8e7cc3"],
        ["Purple Eggplant", "#351c75"]
    ]);

    // Row 6: Pinks / Magenta
    defaultColorMenu.addRow([
        ["Pink", "#c27ba0"],
        ["Pink Pimp", "#741b47"],
        ["Magenta", "#ff00ff"]
    ]);

    // Row 7: Neutrals
    defaultColorMenu.addRow([
        ["Gray", "#666666"],
        ["White", "#ffffff"],
        ["Brown Fart", "#b45f06"],
        ["Brown", "#783f04"]
    ]);


