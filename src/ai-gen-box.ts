import { ConversationTone } from "./enums";

export class AIGenBox {
    private static instance : AIGenBox | null = null;
    private domElement : HTMLElement | null = null;

    private constructor() {}

    static getInstance() {
        
        if(this.instance) {
            return this.instance
        }

        this.instance = new AIGenBox();
        // force creation of the DOM element
        this.instance.getDOMElement();
        return this.instance
    }
    
    getDOMElement() : HTMLElement {
        if (this.domElement) {
            return this.domElement;
        }

        const container = document.createElement('div');
        container.className = "ai-gen-box-container"

        const conversationToneIcons = this.renderConversationTonesIcons();
        container.appendChild(conversationToneIcons);

        Object.assign(container.style, {
            position: 'absolute',
            width: 'max-content',
            zIndex: 999,
            top: '0px',
            left: '0px',
            backgroundColor: 'white',
            padding: '5px 8px',
            borderRadius: '30px',
        });

        document.body.appendChild(container);

        this.domElement = container;
        console.log(this.domElement);
        return this.domElement;
    }

    show() {
        if(this.domElement)
            this.domElement.style.display = 'block';
    }

    hide() {
        if(this.domElement)
            this.domElement.style.display = 'none';
    }

    private renderConversationTonesIcons() : HTMLElement {
        const allIconsContainer = document.createElement('div');

        console.log(Object.values(ConversationTone));
        const tones = Object.values(ConversationTone).filter(t => typeof(t) === "string").map(t => t.toString());
        console.log(tones);
        for(const tone of tones) {
            const iconContainer = document.createElement('div');
            Object.assign(iconContainer.style, {
                position: 'relative',
                display: 'inline-block',
                margin: '0px 7px',
            });
            
            const icon = document.createElement('img');
            icon.src = chrome.runtime.getURL(`images/conversation_tones/${tone.toLowerCase()}.png`);
            Object.assign(icon.style, {
                width: '48px',
            });
            iconContainer.appendChild(icon);
            
            const label = document.createElement('span');
            label.innerText = tone[0].toUpperCase() + tone.slice(1).toLowerCase();
            Object.assign(label.style, {
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'white',
                padding: '0 4px',
                fontSize: '13px',
            });
            iconContainer.appendChild(label);
            
            allIconsContainer.appendChild(iconContainer);
            console.log(iconContainer);
        }

        return allIconsContainer;
    }

}