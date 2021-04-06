# Construction App #
A NodeJs application to track a construction company's budget across different projects to properly forecast expenses and determine profit margins
## Original Repository code and commits located at: https://github.com/andershelmsworth/databaseInterface

## Screenshots of application interface

<img width="906" alt="Screen Shot 2021-04-05 at 7 46 00 PM" src="https://user-images.githubusercontent.com/43213031/113652139-13dd1600-9648-11eb-8862-b0e15f33363b.png">

<img width="959" alt="Screen Shot 2021-04-05 at 7 46 07 PM" src="https://user-images.githubusercontent.com/43213031/113652148-18093380-9648-11eb-8084-c7e2a895a271.png">

<img width="756" alt="Screen Shot 2021-04-05 at 7 46 28 PM" src="https://user-images.githubusercontent.com/43213031/113652159-1c355100-9648-11eb-9ea2-11350832d90e.png">

<img width="760" alt="Screen Shot 2021-04-05 at 7 46 36 PM" src="https://user-images.githubusercontent.com/43213031/113652164-20616e80-9648-11eb-8c13-ce015a569666.png">

<img width="759" alt="Screen Shot 2021-04-05 at 7 46 42 PM" src="https://user-images.githubusercontent.com/43213031/113652178-23f4f580-9648-11eb-9f4c-26e407e166ad.png">

<img width="751" alt="Screen Shot 2021-04-05 at 7 46 48 PM" src="https://user-images.githubusercontent.com/43213031/113652186-28b9a980-9648-11eb-932b-af5e7b1949f8.png">

<img width="746" alt="Screen Shot 2021-04-05 at 7 46 53 PM" src="https://user-images.githubusercontent.com/43213031/113652194-2ce5c700-9648-11eb-9b98-b360fbd3e40e.png">

<img width="746" alt="Screen Shot 2021-04-05 at 7 46 58 PM" src="https://user-images.githubusercontent.com/43213031/113652206-32431180-9648-11eb-9c87-e8bb009ca4f2.png">

<img width="736" alt="Screen Shot 2021-04-05 at 7 47 06 PM" src="https://user-images.githubusercontent.com/43213031/113652218-366f2f00-9648-11eb-9ac4-9fe4f3a900a3.png">

## ERD

<img width="852" alt="Screen Shot 2021-04-05 at 7 45 23 PM" src="https://user-images.githubusercontent.com/43213031/113652258-4dae1c80-9648-11eb-84dc-fd5295fe9211.png">

## Schema

<img width="702" alt="Screen Shot 2021-04-05 at 7 45 39 PM" src="https://user-images.githubusercontent.com/43213031/113652327-69b1be00-9648-11eb-9652-902201d477af.png">

# Set Up Instructions

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
