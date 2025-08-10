# pluginVector

Test point `./plugVectorTest.js` 

Instade of `if` `else if` `else` statement use this. 

Why?

Whit one line of code you can have a door for plugins cumming from external packages.

Opening your project to external improvements and new futures. 

**pluginVector** can be called also as `plugins gate`





#### status

- [x] can be created as instance
  
  ```js
  let pv0 = new plugVector();
  ```
  
  

- [ ] `populateByNpmPackage` populate by npm package prefix
  
  - [x] can load
  
  - [ ] init instances ?

- [x] `populateByStruct` In line definition of list of operators with functions

- [x] `addO` - adds one plugin



#### using

Example of use case 

```js
let res1 = pv1.execReturn( 'printCl' , {0:1});
console.log(`got pv1 res1: `,res1);
```

It's a ward looking `if statment` but it's open to receive plugins vector prom npm packages if you want or easy stack able `else if`





**.execReturn** ( methodeToCall, args )

    `methodeToCall` String - name of method to call with

    `args` json - with arguments to pass



**return** - depend on functions invoke. But expecting no `undefined` or nothing on passing by not making nothing.

or

`!= undefined` - what plugin return as result of operation 



 
