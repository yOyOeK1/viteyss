# site

In context of **yss** / site it's a "set" of files in directory. Base on them you can get some functionality: 

- get site in **yss** in menu 
- fast way to build **UI** to your project
  - instrument panel to your sensors `examples` **viteyss-site-wiki**  
- work with *.svg, *.gbl, *.html, *.js, *.vue, ....
- place to make interaction with your site / project
- set module on server site to work on a hardware site of scripts
- communication over: http, websocket, Hot from **viteyss**

### file structure yss / site

Best is to see `example` **viteyss-site-wiki** 
Or
Look in root directory of project `sites/test_vite_blank` 



### sites on yss

##### Adding, removing, finding sites... when yss is served by `npm` package world.

**viteyss** or **mnodehttp** project. So `npm` package world.

When you start your hosting project, adding **site**(s) to serve on **yss** is in order.

- `~/.viteyss/sites` in your home directory you can make this path and add more sites in to it. This is a safe playgraund for your project sites.

- `node-yss` npm package comming as dependency to **viteyss** or **mnodehttp** is coming with some **site**(s) in direcotary of that package you will find it in `node_modules/node-yss/yss/sites/`

- `viteyss/sites` if using **viteyss** project to host. There is a directory `sites`

- `viteyss-site-...` npm plugin install in your hosting project. If you have any package starting with prefix in project **viteyss** it will be include as a **site**, module, **SSO**, ....

- custome setting is posible by editing `pathsToSites` value in `startItAsDev.js` file of hosting project 


##### Adding, removing, finding sites... when yss is served by *.deb

Yes it can come in *.deb flavor more [info link ...](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-yss) install [wiki link ...](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-yss)




#### site.json 
TODO 

`apisrc` - TODO