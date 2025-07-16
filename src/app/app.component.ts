import { Component, Renderer2 } from '@angular/core';
import Gleap from 'gleap';
Gleap.initialize("nLTao49nVlJMj1nVYIgbg74IgZi9lM9T");

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(private renderer: Renderer2)
    {
            const zoomLevel = '90%';
            this.renderer.setStyle(document.body, 'zoom', zoomLevel);
    }
}
