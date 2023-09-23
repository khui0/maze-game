export function alert(title, text, callback, blur) {
    modal({
        title,
        body: new Element("p", text).element.outerHTML,
        buttons: [{
            text: "Close",
            close: true,
            onclick: callback,
        }],
        blur,
    });
}

export function prompt(title, text, buttons, blur) {
    modal({
        title,
        body: new Element("p", text).element.outerHTML,
        buttons,
        blur,
    });
}

export function modal(options) {
    // Create dialog element
    const dialog = document.createElement("dialog");

    // Create button container
    const buttonContainer = document.createElement("div");
    // Add buttons to button container
    options.buttons.forEach(button => {
        buttonContainer.append(
            new Element("button", button.text, () => {
                button.close && dialog.close();
                button.onclick && button.onclick();
            }).element
        );
    });

    // Add title to dialog element
    dialog.append(new Element("h2", options.title).element);
    // Add body html to dialog element
    dialog.innerHTML += options.body;
    // Add button container to dialog element
    dialog.append(buttonContainer);

    // Show modal
    document.body.append(dialog);
    dialog.showModal();

    // Unfocus the buttons if requested
    blur && buttonContainer.querySelectorAll("button").forEach(button => button.blur());

    // Remove dialog element on close
    dialog.addEventListener("close", () => {
        dialog.remove();
    });

    return dialog;
}

export class Element {
    constructor(tag, text, onclick) {
        this.tag = tag;
        this.text = text;
        this.onclick = onclick;
    }

    get element() {
        const element = document.createElement(this.tag);
        element.textContent = this.text;
        this.onclick && element.addEventListener("click", this.onclick);
        return element;
    }
}