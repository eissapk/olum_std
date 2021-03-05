# Spk.js
> A simple light weight library for providing spa experience.

*If you know vanilla js then this library is for you*

# Features
* Routing
* Reusable Components
* State Management System

# Ecosystem
* Extensions
  * HTML syntax highlighter [Market Place](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html)
  * CSS syntax highlighter [Market Place](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)

---

### Router
```javascript
import { Router } from "spk";
// views
import Home from "./views/home.js";
import About from "./views/about.js";

const router = new Router({
  mode: "history",
  root: "/",
  el: "#app",
});

router
  .add("/", () => router.inject(Home))
  .add("/about", () => router.inject(About));
```

---

### Component Structure
```javascript
import { html, css, OnInit } from "spk.js";
import Header from "../components/header.js";

let template = html`
  <div id="home">
    <header />
  </div>
`;

export default class Home extends OnInit {
  data = {
    components: {
      Header,
    },
    template,
    style,
    render: () => this.render(),
    scoped: true,
  }

  constructor() {
    super();
  }

  init = () => super.init(this.data);

  render() {
    console.log("Home component works!");
  }

}

let style = css`
  #home {
  }
`;

```

---

### Shared Service (State Management System)
```javascript
class Service {
  todos = [];

  constructor() {
    this.stateUpdated = new Event(`${new Date().getTime()}`);
    this.event = this.stateUpdated.type;
  }

  add(todo) {
    this.todos.push(todo);
    this.trigger();
  }

  trigger() {
    dispatchEvent(this.stateUpdated);
  }
}

export const service = new Service();
```

---
### index.html 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Spk</title>
    <link rel="stylesheet" href="src/app.css">
    <script defer type="module" src="src/app.js"></script>
  </head>

  <body>
    <div id="app"></div>
  </body>
</html>
```

---

### Project Structure
![project sctrucure](./structure.png)


# Getting Started
*clone the project and open index.html via a live server*