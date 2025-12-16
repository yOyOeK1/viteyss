# install - viteyss 



directory of choise     [ /tmp ]
project name            [ myViteyss ]


linux                   [ ubuntu 20.04 ]

repository prefix       [ /home/yoyo/Apps/ ]


### dependency
 - linux, shell access
 - git
 




## making project directory
cd /tmp
mkdir myViteyss
cd myViteyss


## option - sharelibs

git clone /home/yoyo/Apps/viteyss
cd viteyss



## bash commands 


git clone /home/yoyo/Apps/mnodehttp
git clone /home/yoyo/Apps/node-yss
git clone /home/yoyo/Apps/viteyss


cd ./viteyss 

npm i ../node-yss/node-yss-latest.tgz
npm i ../mnodehttp
cd ./node_modules/mnodehttp
npm i
cd ../../


npm install



node ./runItSelector.js


