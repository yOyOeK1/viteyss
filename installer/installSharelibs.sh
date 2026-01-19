#!/bin/bash 

set -e
echo -e "\n\n## Viteyss past - install  ver: [ $npm_package_version ]\n#\n#"

echo -e "# pwd: [$(pwd)]\n#"


echo -e "#\n# Will do post - installation:
#  - wrapper.sh ass .desktop app
#  - sharelibs directory
#    - mnodehttp
#    - node-yss
#  - vyDialup
#"

echo -e "#\n# .... waiting 5 sec.     All ok?"
sleep 5






function downloadNodeYss(){
    echo " [i] downloading  [node-yss]"; 
    # else internet
    wget --progress=bar:force "https://github.com/yOyOeK1/node-yss/raw/refs/heads/main/node-yss-latest.tgz" > `mktemp`"_wget_node_yss.log"
}











## if its posible to install .desktop ?
if test -d "$HOME""/.local/share/applications";then

    wrapPath="$HOME""/.local/share/applications/vyWrapper.desktop"
    echo "* checking wrapper .desktop ... [ $wrapPath ]"
    if test -e "$wrapPath"; then
        echo "  OK"

    else

        echo "  making it ... from [ $npm_config_local_prefix ]"
        chmod +x "$npm_config_local_prefix""/installer/wrapper.sh"
        echo '[Desktop Entry]
    Name='vyWrapper - $npm_package_version'
    Exec='"$npm_config_local_prefix""/installer/wrapper.sh"' "%F"
    Comment=Profile / wrap any thing
    Terminal=true
    Icon='"$npm_config_local_prefix"'/icons/ico_wrapper_256_256.png
    Type=Application
    MimeType=application/x-shellscript;application/javascript;text/plain;
    Categories=Programming;
    ' > "$wrapPath"
        echo "* vyWrapper - $npm_package_version  ... added to desktop apps"
        
    fi

else
    echo "* no ~/.local/share/applications directory so no gui / grome ? ... skipping "

fi


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
        downloadNodeYss
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

    if test -e '../src/node-yss-latest.tgz';then
        echo "  - .tgz in place"
    else
        echo "  - downloading -latest ...."
        pushd "../src"
        downloadNodeYss
        popd
    fi

    tar -xf '../src/node-yss-latest.tgz' -C './tmp'
    mv ./tmp/package/* ./
    rm -rf ./tmp
    npm install > `mktemp`"_npm_i_node-yss-latest.log"
    cd '..'     

    echo " ... DONE" 
fi


cd '..'


read -p "You want to use vy Dialup a.k.a. site manager [y/N]" aabb
if test "$aabb" = "y"; then
    #echo " uuuu Update it's ....."
    #echo "TODO ......... :/ "
    cd ./installer
    node ./vyDialup.js

fi

echo " ---------- DONE"
