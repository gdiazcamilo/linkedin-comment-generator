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
            display: 'none',
            maxWidth: '65vw',
            zIndex: 999,
            top: '0px',
            left: '0px',
            backgroundColor: 'white',
            padding: '5px 8px',
            borderRadius: '30px',
            boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)',
        });

        document.body.appendChild(container);
        this.injectCss();
        
        this.domElement = container;
        
        return this.domElement;
    }

    injectCss() {
        const style = document.createElement('style');
        style.id = "lcg-aiboxgen-styles"

        style.textContent = `
            .lcg-tone-container:hover img {
                border: solid;
                border-radius: 30px;
                border-color: #f7cf3db5;
                transform: scale(1.2);
            }
        `;

        document.head.appendChild(style);


    }

    show() {
        if(this.domElement)
            this.domElement.style.display = 'block';
    }

    hide() {
        if(this.domElement)
            this.domElement.style.display = 'none';
    }

    isVisible() {
        return this.domElement?.style.display != 'none';
    }

    private renderConversationTonesIcons() : HTMLElement {
        const allIconsContainer = document.createElement('div');
        Object.assign(allIconsContainer.style, {
            display: 'flex',
            flexWrap: 'wrap'        
        });

        const tones = Object.values(ConversationTone).filter(t => typeof(t) === "string").map(t => t.toString());
        for(const tone of tones) {
            const iconContainer = document.createElement('div');
            iconContainer.classList.add('lcg-tone-container')
            Object.assign(iconContainer.style, {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 'fit-content',
                minWidth: '75px',
                margin: '4px 7px',
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
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'white',
                padding: '0 4px',
                fontSize: '13px',
            });
            iconContainer.appendChild(label);
            
            allIconsContainer.appendChild(iconContainer);
        }

        return allIconsContainer;
    }

}