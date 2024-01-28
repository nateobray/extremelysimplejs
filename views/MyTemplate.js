import { Element } from "../Element.js";
import { Template } from "./Template.js";

export default class MyTemplate extends Template
{
    constructor(app, props)
    {
        super('div', props)
        this.app = app

        this.header = new Element('div', {class: 'header'}).add(this.root)
        this.leftNav = new Element('div', {class: 'left-nav'}).add(this.root)
        this.body = new Element('div', {class: 'template-body'}).add(this.root)
    }

    render()
    {
        
    }

    getSpaces()
    {
        return {
            'leftNave': this.leftNav,
            'header': this.header
        }
    }

}