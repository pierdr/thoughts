

class bestReader{

    enableReaderAid(selector = 'p') {
    
        document.querySelectorAll(selector).forEach(elem => {
            elem.innerHTML = textVide.textVide(elem.innerHTML);

        })
    }

    disableReaderAid(selector = 'b')
    {
        // Get all <b> elements in the HTML
        const boldElements = document.querySelectorAll(selector);

        // Iterate through each <b> element
        boldElements.forEach((boldElement) => {
            // Create a new text node with the content of the <b> element
            const textNode = document.createTextNode(boldElement.textContent);

            // Replace the <b> element with the text node
            boldElement.parentNode.replaceChild(textNode, boldElement);
        });

    }

    constructor(parentElem)
    {
        this.button = document.createElement('a');
        this.labelEnable = "<b>Ena</b>ble <b>Re</b>ader <b>Ai</b>d";
        this.labelDisable = "Disable Reader Aid";
        this.button.innerHTML = this.labelEnable;
        this.button.setAttribute('toggled', 'false');

        this.button.addEventListener('click', this.handleToggle.bind(this));
        // Append the button to the parent element
        parentElem.appendChild(this.button);
    }
    handleToggle()
    {
        const isToggledOn = this.button.getAttribute('toggled') === 'true';
        if(isToggledOn)
        {
            this.button.setAttribute('toggled', 'false');
            this.button.innerHTML = this.labelEnable;
            this.disableReaderAid();
        }
        else{
            this.button.setAttribute('toggled', 'true');
            this.button.innerHTML = this.labelDisable;
            this.enableReaderAid();
        }
    }
}


