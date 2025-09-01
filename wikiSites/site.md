# site

In context of **yss** / site it's a "set" of files in directory. Base on them you can get some functionality: 

- get site in **yss** in menu 
- fast way to build **UI** to your project
  - instrument panel to your sensors `examples` **viteyss-site-wiki**  
- work with *.svg, *.gbl, *.html, *.js, *.vue, ....
- place to make interaction with your site / project
- set module on server site to work on a hardware site of scripts
- communication over: http, websocket, Hot from **viteyss**


### from ... viteyss

Look in root directory of **viteyss** then directory `sites`. It's comming with some examples to copy: **viteyss-site-test_vite_blank**, **viteyss-site-wiki**


### from ... node-yss

As dependency to have **yss** files it's coming with some sites in it's directory `sites/test_functions`


##### from ... npm

When yss is served by `npm` package world you run **viteyss** ord **node-red-contrib-viteyss** then if you install in directory of project running it packages with prefix `viteyss-site-` Installed packages will be found in directory of `node_modules` and include it in start. Look in repository for hash [https://github.com/topics/viteyss-site-](#viteyss-site-)

When you start your hosting project, adding **site**(s) to serve on **yss** is in order.

- `~/.viteyss/sites` in your home directory you can make this path and add more sites in to it. This is a safe playgraund for your project sites.

- `node-yss` npm package comming as dependency to **viteyss** or **mnodehttp** is coming with some **site**(s) in direcotary of that package you will find it in `node_modules/node-yss/yss/sites/`

- `viteyss/sites` if using **viteyss** project to host. There is a directory `sites`

- `viteyss-site-...` npm plugin install in your hosting project. If you have any package starting with prefix in project **viteyss** it will be include as a **site**, module, **SSO**, ....

- custome setting is posible by editing `pathsToSites` value in `startItAsDev.js` file of hosting project 


##### from ... playground

Playground will be repository of `oiyshTerminal/ySS_calibartion` can by found on repository [link...](https://github.com/yOyOeK1/oiyshTerminal/tree/main/ySS_calibration/sites) There is many experiments and good samples to start with your project. 


##### from ... *.deb

When yss is served by *.deb

Yes it can come in *.deb flavor more [info link ...](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-yss) install [wiki link ...](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-yss)





#### creating copy clone - new project / site

Use **viteyss-siteCreateClone** [link ...](https://github.com/yOyOeK1/viteyss-siteCreateClone)




#### site.json - description
TODO 

`apisrc` - TODO