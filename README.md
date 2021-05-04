# Notes
* don't invoke ${this.data()} from inside template tag or style tag cause it will lead to infinite loop and then Maximum call stack size exceeded
just call any prop in data() directly like ${this.style()} instead of ${this.data().style}

* in style tag if you want to pass a prop or method from comp class then put it inside "" and then remove them via unquote()
width: unquote("${this.tabWidth}px");

* you have to wrap your markup inside div tag <br>
```html 
<template>
  <div></div>
</template>
```
* don't remove template / style tag even if they are empty

* you may have a case in which two views use one component, so in order to know current route from the shared component then you gotta use this method pk.getRoute(), it returns a string with the route e.g. "/about"
# Todos
* pwa option
* component option [3files or 1file]