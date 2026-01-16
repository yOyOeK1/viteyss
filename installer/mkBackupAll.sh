#!/bin/bash

set -e



# nice 
# du ./ | sort -g -r

bList=`find ../viteyss*/package.json | grep -v "viteyssSSLGEN"`
bList="$bList ../mnodehttp/package.json ../node-yss/package.json"
dirS=`pwd`
dirsToBackupCount=`echo "$bList" | wc -w`


#pwd
curBList=`find ../*_tt2*bz2`
curBCount=`echo "$curBList" | wc -l`




echo "[pwd] $dirS"
echo "[i] make backups of ... [ "$dirsToBackupCount" ] ... in 5"

echo "[i] current backups count [ $curBCount ]"
#echo "$curBList"




#echo "exit 11"
#exit 11
sleep 5

dirDone=0
for bDir in `echo "$bList"`;do

    dirNameP=`dirname "$bDir"`
    #clear
    date 

    echo -ne "* ""$dirNameP""\n"
    if test -e "$bDir";then
        
        isMkBack=`cat "$bDir" | grep '"mkBackup"' > /dev/null ; echo "$?"`
        #echo "#isMkBack: $isMkBack"
        if test "0" = "$isMkBack"; then

            tLogPath=`mktemp`
            
            echo "      |"
            echo "      |"
            echo "      |__  [ # $dirDone / $dirsToBackupCount ] mkBackup ... run ... "
            echo "          |"
            echo -n "          |    pushd ... "
            pushd "$dirNameP"
           
            echo "          |   npm run mkBackup ... [ $tLogPath ]"
            npm run mkBackup > "$tLogPath"

            runLog=`cat "$tLogPath" | tail -n 1`
            logLc=$[`cat "$tLogPath" | wc -l`-1]
            fileArchName=`echo "$runLog" | awk '{print $9}'`
            fileArchSize=`echo "$runLog" | awk '{print $5}'`
            echo "          |   files in  ~ ($logLc)"
            #echo "          |   "$runLog
            echo "          |   size of   $fileArchSize "
            echo "          |             $fileArchName"
            

            #sleep .5
        
            echo "          |"
            echo -n "       ___| _ popd ... "
            popd
            echo "      |"


            #if test "$dirDone" -ge "1";then
            #    exit 1
            #    echo "EXIT 1"
            #fi
            #sleep .5
            dirDone=$[$dirDone+1]
        else
            echo "      |    "
            echo "      |    "
            echo "      |__  [ # $dirDone / $dirsToBackupCount ] no mkBackup script  "
            echo "      |    "
            #sleep .5
            dirDone=$[$dirDone+1]

        fi

   
    fi

done