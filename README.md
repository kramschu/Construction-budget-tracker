# Construction App

The app should work out of the box (if Node is installed) with

```bash
npm install
node app.js
```

and then open http://flip3.engr.oregonstate.edu:3131/dashboard to view the live site, or http://localhost:8080/Dashboard to open the local site.

## Directory Layout

#### `app.js`

The driving program which starts the server and loads everything else in as required.

#### `dbcon-template.js`/`dbcon.js`

Use the template to create a local `dbcon.js` file which stores your database login info. Be careful not to push your `dbcon.js` to the server as it will contain login information.

#### `/public/`

Stores all static resources such as CSS/images

#### `/routes/` 

Stores the JS processing code for each page's handling route handling

#### `/views/`

Stores the HTML templates for each page


## Frameworks/Libraries being used

### Node 

Essentially the backend server runetime environment, see above

https://nodejs.org/en/
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction

### Express 

The framework that processes HTTP requests, accepting input (e.g. from a GET or Post request), processing it, and serving the relevant content back to the requestor. See above.

http://expressjs.com/

### EJS 

HTML templating (based in Javascript), e.g. dynamically injecting pages with content

https://ejs.co/

### Bootstrap 

Very popular CSS styling/layout framework

https://getbootstrap.com/
