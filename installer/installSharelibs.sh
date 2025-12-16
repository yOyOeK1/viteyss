#!/bin/bash 

set -e
echo "-- HELLO FROM share libs installer ---"

echo "pwd: [$(pwd)]"


echo ".... waiting 5 sec.     All ok?"
sleep 5



if test -e './sharelibs'; then
    echo " * share libs exish"
    cd './sharelibs'

else
    echo " - no share libs directory ..."
    mkdir './sharelibs'
    mkdir './sharelibs/src'

    cd './sharelibs/src'

    ## downloading 

    # if tests
    cp -rf '/home/yoyo/Apps/node-yss/node-yss-latest.tgz' './'
    cp -rf '/home/yoyo/Apps/mnodehttp' './'
    # else internet
    #wget "https://github.com/yOyOeK1/node-yss/raw/refs/heads/main/node-yss-latest.tgz"
    #git clone "https://github.com/yOyOeK1/mnodehttp.git"
        

    cd '../'


fi


if test -e './mnodehttp'; then
    echo " * mnodehttp is OK"

else 
    echo " - mnodehtty installing"
    pwd
    cp -rf './src/mnodehttp' './mnodehttp'
    cd './mnodehttp'
    npm install
    cd '..'
fi


if test -e './node-yss'; then
    echo " * node-yss is OK"
else
    echo " - node-yss is missing ..." 
    mkdir './node-yss'
    cd './node-yss'
    mkdir './tmp'
    tar -xf '../src/node-yss-latest.tgz' -C './tmp'
    mv ./tmp/package/* ./
    rm -rf ./tmp
    npm install
    cd '..'      
fi


cd '..'


read -p "You want to update? [y/N]" aabb
if test "$aabb" = "y"; then
    echo " uuuu Update it's ....."
    echo "TODO ......... :/ "
    exit 1

fi

echo " ---------- DONE"