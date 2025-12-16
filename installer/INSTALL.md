# install - viteyss 



directory of choise     [ /tmp ]
project name            [ myViteyss ]


linux                   [ ubuntu 20.04 ]

repository prefix       [ /home/yoyo/Apps/ ]


### dependency
 - linux
 - shell access
 - git
 - 


### bash commands 

cd /tmp
mkdir myViteyss
cd myViteyss
git clone /home/yoyo/Apps/mnodehttp
git clone /home/yoyo/Apps/node-yss
git clone /home/yoyo/Apps/viteyss

cd viteyss
npm i ../mnodehttp
cd node_modules/mnodehttp

cd ../..
npm i ../node-yss/node-yss-latest.tgz
npm i ws 
npm install


node ./runItSelector.js


