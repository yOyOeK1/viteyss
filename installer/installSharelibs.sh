#!/bin/bash 

set -e
echo "-- HELLO FROM share libs installer ---"

echo "pwd: [$(pwd)]"


echo ".... waiting 5 sec.     All ok?"
sleep 5



if test -e './sharelibs'; then
    echo " * sharelibs dir OK"
    cd './sharelibs'

else
    echo " - no share libs directory ..."
    mkdir './sharelibs'
    mkdir './sharelibs/src'

    cd './sharelibs/src'

    ## downloading 

    # if tests
    if (( 0 )) ;then 
        echo " [i]  using local repository]"; 
        cp -rf '/home/yoyo/Apps/node-yss/node-yss-latest.tgz' './'
        cp -rf '/home/yoyo/Apps/mnodehttp' './'

    else 
        echo " [i] downloading  [node-yss]"; 
        # else internet
        wget "https://github.com/yOyOeK1/node-yss/raw/refs/heads/main/node-yss-latest.tgz" > `mktemp`"_wget_node_yss.log"
        echo " [i] git clon     [mnodehttp]";
        git clone "https://github.com/yOyOeK1/mnodehttp.git"
    fi
        

    cd '../'


fi


if test -e './mnodehttp'; then
    echo " * mnodehttp is OK"

else 
    echo " - mnodehtty installing"
    pwd
    cp -rf './src/mnodehttp' './mnodehttp'
    cd './mnodehttp'
    npm install > `mktemp`"_npm_i_mnodehttp.log"
    cd '..'
fi


if test -e './node-yss'; then
    echo " * node-yss is OK"
else
    echo " - node-yss is missing ... " 
    mkdir './node-yss'
    mkdir './node-yss/tmp'
    cd './node-yss'
    tar -xf '../src/node-yss-latest.tgz' -C './tmp'
    mv ./tmp/package/* ./
    rm -rf ./tmp
    npm install > `mktemp`"_npm_i_node-yss-latest.log"
    cd '..'      
fi


cd '..'


read -p "You want to use vy Dialup [y/N]" aabb
if test "$aabb" = "y"; then
    echo " uuuu Update it's ....."
    echo "TODO ......... :/ "

fi

echo " ---------- DONE"
