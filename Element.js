/**
 * Element
 * 
 * Creates a new HTML element
 * 
 * @param {string} tag - The tag name of the element
 * @param {string|number|object} - The content of the element, attributes, or events
 */

export class Element
{
    root
    args

    // creates a new HTML element
    constructor(...args)
    {
        this.args = args
        // set the root element from the first argument or no argument
        if(this.args.length === 0 ){
            this.createElement('div')
        } else if (this.args.length > 0 && typeof this.args[0] === 'string') {
            this.createElement(this.args[0])
        } else if (this.args.length > 0 && typeof this.args[0] === 'number') {
            this.createElement('div')
            this.renderNumber(this.args[0])
        } else if (this.args.length > 0 && typeof this.args[0] === 'object') {
            this.createElement('div')
            this.renderObject(this.args[0])
        }
        
        // set the innerHTML or attributes/events of the root element from the second argument
        if(this.args.length > 1 && typeof this.args[1] === 'string'){
            this.renderString(this.args[1])
        } else if (this.args.length > 1 && typeof this.args[1] === 'number'){
            this.renderNumber(this.args[1])
        } else if (this.args.length > 1 && typeof this.args[1] === 'object'){
            this.renderObject(this.args[1])
        }

        // set the attributes/events of the root element from the third argument
        if(this.args.length > 2 && typeof this.args[2] === 'object'){
            this.renderObject(this.args[2])
        }
        return this
    }

    // creates a new HTML element
    createElement(tag)
    {
        this.root = document.createElement(tag)
    }

    // renders a string to root innerHTML
    renderString(string)
    {
        this.root.innerHTML = string
    }

    // renders numeric values to root innerHTML
    renderNumber(number)
    {
        this.root.innerHTML = number
    }

    // renders an object to root attributes or attaches events
    renderObject(object)
    {
        for (const key in object) {
            if(typeof object[key] == 'function'){
                this.addEvent(key, object[key])
            } else if(typeof object[key] == 'string' || typeof object[key] == 'number' || typeof object[key] == 'boolean') {
                this.root.setAttribute(key, object[key]);
            }
        }
    }

    // adds an event to the root element
    addEvent(key, fn)
    {
        if(this.root.attachEvent){
            this.root.attachEvent(key, fn);
        } else {
            this.root.addEventListener(key, fn);
        }
        return this
    }

    // remove an event from the root element
    removeEvent(key, fn)
    {
        if(this.root.attachEvent){
            this.root.detachEvent(key, fn);
        } else {
            this.root.removeEventListener(key, fn);
        }
        return this
    }

    // sets the innerHTML of the root element
    setHTML(html)
    {
        this.root.innerHTML = html
        return this
    }

    getHTML()
    {
        return this.root.innerHTML
    }

    // returns the root element
    getRoot()
    {
        return this.root
    }

    // adds root to the bottom of element
    add(element)
    {
        if(!element) return this
        if(element.getRoot){
            element.getRoot().appendChild(this.root)
        } else {
            element.appendChild(this.root)
        }
        return this
    }

    // remove root from the DOM
    remove()
    {
        this.root.remove()
        return this
    }

    // adds root to the top of element
    top(element)
    {
        if(!element) return this
        if(element.getRoot !== undefined){
            element.getRoot().prepend(this.root)
        } else {
            element.prepend(this.root)
        }
        return this
    }

    // adds root before the element
    before(element, reference)
    {
        if(!element) return this
        if(element.getRoot !== undefined){
            console.log(element.getRoot())
            reference.getRoot().insertBefore(this.root, element.getRoot())
        } else {
            reference.insertBefore(this.root, element.getRoot())
        }
        return this
    }

    // adds root after the element
    after(element)
    {
        if(!element) return this
        if(element.getRoot !== undefined){
            element.getRoot().after(this.root)
        } else {
            element.insertAfter(this.root)
        }
        return this
    }

    // add a class name from the root element
    addClass(className)
    {
        this.root.classList.add(className);
        return this
    }

    // remove a class name from the root element
    removeClass(className)
    {
        this.root.classList.remove(className);
        return this
    }

    // toggles a class name on the root element
    toggleClass(className)
    {
        return this.root.toggleClass(className)
    }

    // test if a class name exists on the root element
    hasClass(className)
    {
        return this.root.classList.contains(className)
    }

    // set an attribute on the root element
    setAttribute(key, value)
    {
        this.root.setAttribute(key, value)
        return this
    }

    // get an attribute from the root element
    getAttribute(key)
    {
        return this.root.getAttribute(key)
    }

    // remove an attribute from the root element
    removeAttribute(key)
    {
        this.root.removeAttribute(key)
        return this
    }
}
