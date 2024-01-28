import { Element } from "../Element.js"
import { View } from "../View.js"

export default class Home extends View
{
    constructor(app, props)
    {
        super(app, props)
    }

    render(){
        new Element('h1', 'Home').add(this.root)
    }

}