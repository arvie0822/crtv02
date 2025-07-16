import { Component, ViewEncapsulation } from '@angular/core';
import Gleap from 'gleap';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent
{
    /**
     * Constructor
     */
    constructor()
    {
        Gleap.showFeedbackButton(true);
    }
}
