import { Element } from "./Element.js"
import { Template } from "./Template.js";
import { View } from "./View.js";

export class App extends Element
{

    
    host = ''
    isTemplateLoaded = false;
    
    constructor(props)
    {
        if(props === undefined) props = {}
        super('div', {id: 'app'})
        this.app = this
        this.popFunction = this.change.bind(this)
        window.addEventListener('popstate', this.popFunction);
        this.host = (props.host===undefined)?window.location.hostname:props.host
        this.props = props
        
        this.template = new Template(this, {class: 'template'});

        const path = this.getRoutablePath()
        this.load(this.getRoutablePath())

    }

    change(e)
    {
        this.load(this.getRoutablePath())
    }

    route(url, event , title='', data={})
    {
        history.pushState(data, title, url)
        this.load(this.getRoutablePath())
    }
    async load(url=null)
    {
        //document.body.style.cursor = 'wait';
        const params = new URLSearchParams(window.location.search)
        
        let parts = url.split('/');
        parts.shift() // remove empty string
        if(parts[parts.length-1] == '') parts.pop() // remove trailing empty string if exists

        let viewStr = parts.join('/') + '.js'
        if(viewStr === '.js') viewStr = this.props.index
        let obj = await import(this.props.base_path + viewStr);
        
        if(!obj.default.prototype instanceof View){
            console.error("Invalid Object")
        }

        // create a new view by dynamically importing the view
        let view = new obj.default(this, {class: obj.default.name.toLowerCase() + '-view view'})
        
        // set the onScan function
        if(view.onScan && this.scanController){
            this.scanController.props.onScan = view.onScan.bind(view)
        } 

        // render a view inside the template
        if(view.useTemplate){
            if(!this.isTemplateLoaded){
                this.clear()
                this.template.add(this.root)
                this.template.render()
                this.isTemplateLoaded = true
            }
            this.template.clear()
            view.render(params)
            view.add(this.template.body)

            const spaces = this.template.getSpaces()
            for(const space in spaces){
                if(view[space] !== undefined){
                    view[space](spaces[space])
                }
            }
        
        // render view to the app directly
        } else {
            this.clear()
            view.render(params)
            view.add(this.root)
            this.isTemplateLoaded = false
        }
    }

    async fetch(url=null, method='GET', data=null)
    {
        // make sure our URL is not null
        if(null) throw 'url cannot be null'
        let urlObj = null

        // allow url parameters as URL object
        if(url instanceof URL){
            urlObj = url
            urlObj.protocol = 'https'
            urlObj.host = this.endpoint.replace('https://').replace('http://')

        // allow url parameter as a string
        } else {
            urlObj = new URL(url, 'https://' + this.host)
        }

        // get our URL as a string
        url = urlObj.toString()

        // setup fetch params
        let fetchParams = {
            method: method.toUpperCase(),
            credentials: 'include',
        }

        // execute fetch request
        if(data instanceof FormData && method.toUpperCase() === 'GET'){
            const search = new URLSearchParams(data)
            url += '?' + search.toString()
            data = null
        }
        if(data instanceof URLSearchParams && method.toUpperCase() === 'GET'){
            url += '?' + data.toString()
            data = null
        }
        if(data !== null) fetchParams.body = data

        return fetch(url, fetchParams)
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(response => {
                    if(response.errors !== undefined){
                        let Err = new Errors("Multiple errors have occured, please see errors.")
                        Err.set(response.errors)
                        throw Err
                    }
                    if(response.code === 401){ 
                        throw new Unauthorized(response.error)
                    }
                    if(response.code === 403) throw new Forbidden(response.error)
                    
                    throw new Error(response.error)
                })
            })
            .then(response => {   
                return response;
            })
            
    }

    clear()
    {
        this.app.setHTML('')
    }

    getRoutablePath()
    {
        return window.location.pathname
    }

}

window.app = new App({index: 'home.js', base_path: '/views/'}).add(document.body)
