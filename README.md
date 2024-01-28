# ExtremelySimpleJS

Welcome to **ExtremelySimpleJS** - a streamlined JavaScript framework designed for ease of use and simplicity. Emphasizing modularity and object-oriented principles, this framework introduces an intuitive approach to building dynamic web applications with JavaScript.

## Getting Started

To kick things off, include `App.js` in your HTML head:

```html
<script type="module" src="/App.js"></script>
```

Next, leverage the power of **ExtremelySimpleJS** in another script tag:

```html
<script type="module">
    import { App } from '/App.js';
    window.app = new App({index: 'home.js', base_path: '/views/'}).add(document.body);
</script>
```

This setup configures your application to look for the `home.js` file in the `/views/` directory when accessing the root path ("/").

## Creating Views

Imagine you want to respond to the route `/hello`. Simply create a `hello.js` file:

```javascript
import { Element } from "../Element.js"
import { View } from "../View.js"

export default class Hello extends View {
    constructor(app, props) {
        super(app, props);
    }

    render() {
        new Element('h1', 'Hello').add(this.root);
    }
}
```

This generates the following HTML structure:

```html
<div id="app"><div class="hello-view view"><h1>Hello</h1></div></div>
```

## Templating

You can encapsulate your views within templates. Define a template in your `App` constructor like this:

```javascript
new App({index: 'home.js', base_path: '/views/', template: 'MyTemplate'}).add(document.body);
```

Creating a template is straightforward. Extend the included `Template` class:

```javascript
import { Element } from "../Element.js";
import { Template } from "./Template.js";

export default class MyTemplate extends Template
{
    constructor(app, props)
    {
        super('div', props)
    }

}
```

Templates serve as a scaffold for your views, allowing for consistent layout and design across your application.

## Dynamic Spaces in Templates

Templates in ExtremelySimpleJS support dynamic "spaces". These are designated areas in your template where you can inject content from your views. Here's how to define a space in a template:

``` JavaScript
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
            'leftNav': this.leftNav,
            'header': this.header
        }
    }

}
```
To use the space from within your view you would define it as a function and the value passed in would the the `Element` itself like this:
```  JavaScript
import { Element } from "../Element.js"
import { View } from "../View.js"

export default class Hello extends View
{
    constructor(app, props)
    {
        super(app, props)
    }

    render()
    {
        new Element('h1', 'hello').add(this.root)
    }

    leftNav(el)
    {
        new Element('h2', 'Left Nav').add(el)
    }

    Header(el)
    {
        new Element('h2', 'Header').add(el)    
    }

}
```

## Working with Elements

Creating and managing HTML elements is a breeze with `Element.js`. Here are some examples:

```javascript
// create an empty div
new Element('div')
// create a div with some attributes
new Element('div', {attribute1: 'attribute 1', attribute2: 'attribute2'})
// create a div with some text/html inside and attributes
new Element('div', 'Hello <strong>World</strong>', {attribute1: 'attribute 1', attribute2: 'attribute2'})
// create a div with a click event
new Element('div', {click: funciton(){ alert('hello world'); })
// An input element
new Element('input', {type: 'text' name: 'name', value: 'hello world'})
```

The fluent API design of `Element.js` allows for method chaining, making your code more concise and readable.

``` JavaScript
new Element('div').addClass('new-class').add(document.body)
```

## Reusable Components

Define reusable HTML components by extending the `Element` class. For instance, a customizable select element:

```javascript
import { Element } from "../../Element.js";

export class Select extends Element
{
    isFocusedOrHasContent = false

    constructor(app, props)
    {
        if(props === undefined) props = {}
        if(props.label === undefined ) {
            super('Select', props)
            this.props = props
        } else {
            super('div', {...{
                class: 'input-group'
            }, ...props})
            this.props = props

            this.addEvent('click', this.onLabelClick.bind(this));

            // create label
            this.label = new Element('label', (props.label.text===undefined)?'':props.label.text, {...{
                'class': 'input-focused',
                'click': this.onLabelClick.bind(this)
            }, ...props.label})
            this.label.add(this.root)


            // create input
            if(props.input === undefined) props.input = {}
            this.input = new Element('select', {...{
                
            }, ...props.input})

            this.setOptions(props.values, props)

            this.input.add(this.root)
        }
    }

    setOptions(values)
    {
        this.input.setHTML('')
        let selectedOption = null
        if(values != undefined){
            values.forEach( (value, index) => {

                // create option
                let options = {value: value.value}

                // set default
                if(value.default){
                    // console.log(selectedOption)
                    if(!selectedOption){
                        // console.log(value)
                        options.selected = true
                    }
                } 
                
                // set selected
                if(this.props && this.props.input && (options.value == this.props.input.value || (this.props.input.value == null && options.value == "")) && index != 0){
                    if(selectedOption) selectedOption.getRoot().removeAttribute('selected')
                    options.selected = true
                } 

                // create option
                const el = new Element('option', value.label, options).add(this.input)
                if(options.selected){
                    selectedOption = el
                } 

            })
        }
    }

    onLabelClick()
    {
        this.focus()
    }

    focus()
    {
        this.input.getRoot().focus()
    }

    getValue()
    {
        
        return this.input.getRoot().value
    }

    setValue(value)
    {
        this.input.getRoot().value = value
        if(this.props.input.change) this.props.input.change(value)
    }

    clear()
    {
        this.input.getRoot().value = null
    }

    disable()
    {
        this.input.getRoot().disabled = true
    }

    enable()
    {
        this.input.getRoot().disabled = false
    }

    isDisabled()
    {
        return this.input.getRoot().disabled
    }
}
```
