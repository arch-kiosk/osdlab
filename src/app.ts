// import {
//     KioskApp,
//     fetchConstants,
//     getRecordTypeAliases,
//     FetchException,
//     handleCommonFetchErrors,
//     Constant, AnyDict, BeforeEvent,
// } from "@arch-kiosk/kiosktsapplib";
import {TemplateResult, unsafeCSS, LitElement} from "lit";
import { html } from "lit/static-html.js";
import local_css from "./styles/test-app.sass?inline";
import "./ialabosd1.ts"

// noinspection CssUnresolvedCustomProperty


export class TestApp extends LitElement {
    static styles = unsafeCSS(local_css);
    _messages: { [key: string]: object } = {};

    static properties = {
        ...super.properties,
    };

    constructor() {
        super();
    }

    firstUpdated(_changedProperties: any) {
        console.log("App first updated.");
        super.firstUpdated(_changedProperties);
    }

    apiConnected() {
        console.log("api is connected");
        // fetchConstants(this.apiContext)
        // .then((constants) => {
        //     this.constants = constants
        //     this.recordTypeAliases = getRecordTypeAliases(this.constants)
        //     console.log(`record type aliases fetched`,this.recordTypeAliases)
        // })
        // .catch((e: FetchException) => {
        //     this.showProgress = false
        //     // handleFetchError(msg)
        //     handleCommonFetchErrors(this, e, "loadConstants");
        // });
    }

    connectedCallback() {
        super.connectedCallback();
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        // setTimeout(() => {this.openDialog()},0)
    }

    protected renderToolbar() {
        return html`
            <div class="toolbar">
                <div class="toolbar-section">
                    <div class="toolbar-button">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                </div>
                <div class="toolbar-buttons">
                </div>
            </div>`;
    }

    renderContent() {
        return html`<ialab-osd-1></ialab-osd-1>`
    }

    // apiRender is only called once the api is connected.
    render() {
        let dev: TemplateResult
        // @ts-ignore
        if (import.meta.env.DEV) {
            dev = html`
                <div>
                    <div class="dev-tool-bar"><label>Open identifier:</label>
                    </div>
                </div>`;
        } else {
            dev = html``;

        }
        let toolbar = this.renderToolbar();
        // const app = html``
        const app = html`
            ${this.renderContent()}
        `;
        return html`<div class="header-frame">${dev}${toolbar}</div>${app}`;
    }
}

window.customElements.define("test-app", TestApp);
