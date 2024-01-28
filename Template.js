import { Element } from "../Element.js";

export class Template extends Element
{
    constructor(app, props)
    {
        super('div', props)
        this.app = app

        this.body = new Element('div', {class: 'app-body'}).add(this.root)
    }

    render()
    {
        
    }

    getSpaces()
    {
        return {
            
        }
    }

    clear()
    {
        this.body.setHTML('')
    }

}