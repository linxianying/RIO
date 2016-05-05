Content goes here...NAME OF THE PROJECT
========
This is a project for NUS 2016 summer Orbital Program
--------

### the idea of this project comes from [NotaBene](http://nb.mit.edu/)
 
### the following is to unify the coding style
* the assignment of HTML elements should **NOT** use space to seperate "="   
```html
<div class="container"></div>
```
* the style for javascript code should follow **CS1101S** standard **EXCEPT** the naming convention    
```javascript
function mouseInChangeColor(obj) {
    if (obj.innerHTML == "submit")
        obj.className = "btn btn-info";
    else if (obj.innerHTML = "clear")
        obj.className = "btn btn-warning";
}
```
* the naming for author-created functions and classes should follow JAVA convention    
```html
<div class= "FileViewer">
    <div class="Page">     
        <img src="">
    </div>
</div>
```
* all the page should be named with words seperated using "_"      
```
sign_up_page.html
```