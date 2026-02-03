import local_css from "./styles/ialab-osd-1.sass?inline";
import walkingEgyptian from "/public/egyptian-walk-black.svg";
import CA from "/public/CA.svg";
import spider from "/public/spider.svg";
import myRect from "/public/my-rect.svg?raw";
import "./imaginghelper"

// @ts-ignore
import {html, css, TemplateResult, unsafeCSS, nothing, LitElement} from "lit";
import {customElement, property, state} from "lit/decorators.js";
// import { classMap } from "lit/directives/class-map.js";
// import { AnyDict, BeforeEvent, KioskAppComponent } from "@arch-kiosk/kiosktsapplib";
// import "./kioskdialog.ts";
// import "openseadragon";
import OpenSeadragon from "openseadragon";
import {OSDSVGOverlay} from "./openseadragon-svg-overlay.js"

// import OpenSeadragon from "openseadragon";

@customElement("ialab-osd-1")
export class Ialabosd1 extends LitElement {
    static styles = unsafeCSS(local_css);
    static properties = {
        ...super.properties,
    };
    private viewer?: OpenSeadragon.Viewer & {svgOverlay?: Function} = undefined;

    /**
     *  a callback that returns the url of the next image to show
     *  @param direction: either "next" or "prev"
     *  @returns an object consisting of a url to load or an empty string if there isn't any in that direction and a bookmark that will be
     *  @throws exceptions if something goes wrong
     */
    public openseadragonImagePath = "/public/images/lightbox/";

    // private disableRotationCacheOnce = false

    updated() {
        if (!this.viewer) this.initOpenSeaDragon()
    }

    activateDebugMode() {
        if (this.viewer?.svgOverlay) {
            const overlay = this.viewer?.svgOverlay()
            if (overlay) overlay.activateDebugMode()
        }
    }

    initOpenSeaDragon() {
        this.viewer && this.viewer.destroy();
        const el = this.shadowRoot?.getElementById("open-sea-dragon");
        if (el) {
            if (!Object(OpenSeadragon).hasOwnProperty("svgOverlay")) {
                OSDSVGOverlay(OpenSeadragon)
            }
            this.viewer = OpenSeadragon({
                element: el,
                id: "open-sea-dragon",
                prefixUrl: this.openseadragonImagePath,
                showFullPageControl: false,
                showRotationControl: true,
                autoHideControls: false,
                // loadTilesWithAjax: true,
                // ajaxHeaders: headerObject,
                // ajaxWithCredentials: true,
                crossOriginPolicy: "Anonymous",
            });
            var imagingHelper = this.viewer.activateImagingHelper({onImageViewChanged: this.onImageViewChanged});

            const singleFileOptions = {
                tileSource: {
                    type: "image",
                    url: "/public/bgimg.jpg",
                    loadTilesWithAjax: false
                    // ajaxHeaders: headerObject,
                    // ajaxWithCredentials: true,
              },
                width: 1024
            };

            this.viewer.addHandler("open", () => {
                console.log("success");
            });
            this.viewer.addHandler("open-failed", (e) => {
                console.log("open-failed", e)
            });
            this.viewer.addHandler("tile-load-failed", (e) => {
                console.log("tile load failure", e);
            });
            this.viewer.addHandler("tile-loaded", () => {
                console.log("tile loaded successfully");
            });
            let legacyFake = {
                type: 'legacy-image-pyramid',
                levels: [{
                    // url:'none',
                    height:2048,
                    width: 2048
                }]
            }
            this.loadSVG(spider).then((svgData) => {
                this.activateDebugMode()
                const svgElement = new DOMParser()
                    .parseFromString(svgData, "image/svg+xml").documentElement;
                if (this.viewer?.svgOverlay && svgElement instanceof SVGElement) {
                    const overlay = this.viewer.svgOverlay();
                    const p = overlay.loadSVG(svgElement)
                    const svgWidth = p.x
                    const svgHeight = p.y
                    console.log(svgWidth)
                    setTimeout(() => {
                        const fakeTileSource = {
                            tileSource: {
                                height: window.innerHeight * 2,
                                width:  window.innerWidth * 2,
                                tileSize: window.innerWidth*2,
                                minLevel: 1,
                                getTileUrl: function (level, x ,y ) {
                                    // console.log(level, x, y, this.getTileWidth(level))
                                    // return '/public/bgimg.jpg'
                                }
                            },
                            width: Math.min(svgWidth*3, window.innerWidth * 2),
                            height: Math.min(svgHeight*3, window.innerHeight * 2),
                        }
                        this.viewer?.open(fakeTileSource)
                        overlay.show()
                    }, 500);
                } else {
                    console.log("no Viewer or no SVG")
                }
            })
        }
    }
    onImageViewChanged(event) {
        console.log("origin.x, center.x", event.viewportOrigin.x, event.viewportCenter.x)
        // event.viewportWidth == width of viewer viewport in logical coordinates relative to image native size
        // event.viewportHeight == height of viewer viewport in logical coordinates relative to image native size
        // event.viewportOrigin == OpenSeadragon.Point, top-left of the viewer viewport in logical coordinates relative to image
        // event.viewportCenter == OpenSeadragon.Point, center of the viewer viewport in logical coordinates relative to image
        // event.zoomFactor == current zoom factor
    }
    async loadSVG(url: string) {
        const response = await fetch(url)
        const rc = await response.text()
        return rc
    }


    disconnectedCallback() {
        this.viewer && this.viewer.destroy();
    }

    willUpdate(_changedProperties: any) {
    }

    apiConnected() {
    }

    renderOpenSeaDragon(): TemplateResult {

        return html`
            <div id="open-sea-dragon" style="margin:0">
            </div>`
    }


    render(): TemplateResult {
        return html`${this.renderOpenSeaDragon()}`;
    }
}