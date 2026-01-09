#!/bin/bash


cmdE="$*"

echo "#Wrapper cmd [ $cmdE ]"

function tNow(){
    echo $[`date +%s%N`/1000000]
}

echo "#argC:        ""$#"
echo "#pwd:         "$(pwd)
echo "#tNow:        "$(tNow)



tStart=$(tNow)
exitCode="NaN"
tLines=0
tWords=0
tDeltaTotal=0


function cmdWrapper(){
    cmdExe="$1"
    tStart=$(tNow)
    exitCode="NaN"
    tLines=0
    tWords=0

    #|| 
    #exitCode=$? && echo '# -------- Inner ExitCode:'$exitCode' << is it [ 0 ]?' 
    #sh -c "$cmdE" && exitCode=$? 
    while IFS="" read -r line; do
        
        tDelta=$[ $(tNow) - $tStart  ]
        #echo -n "start[ $tStart ] "
        echo -n "#[ $tDelta ] "
        #echo -n " code: [$?] "
        echo -n "## "
        echo -ne "\e[35m $line \e[0m"
        #echo -e "\t\t\e[43m]< - in wrapper]\e[0m"
        echo ""
        tLines=$[$tLines+1]    
        tWords=$[$tWords+`echo "$line" | wc -w`]

    done < <(
        sh -c "$cmdExe"
        exitCode=$? 
        echo "--------------- Exit code:  $exitCode"
        exit $exitCode
        
    ) && echo "#Main Exit code:$?"

    tDeltaTotal=$[ $(tNow) - $tStart  ]
}
cmdWrapper "$cmdE"


function doPromptPrefix(){
    echo -en "\e[1;40m. . o O\e[0m $ "
    #echo -e '\e[1A\e[Knew line'
}


doPromptPrefix
while IFS="" read -r line; do
    tStartInt=$(tNow)

    case "$line" in
    '[A') echo UP ;;
    '[B') echo DN ;;
    '[D') echo LEFT ;;
    '[C') echo RIGHT ;;
    "help"|"h"|"?")
        echo "               ^ is help 

        [x] help | h | ? - this help
        [x] stats | s - show some numbers after run
        [x] rrun | rr - re-run it one more time
        [x] rrn N - re-run it N times

        [x] q - quit
            "

        ;;
    "stats" | "s" )
        echo "               ^ stats ... O O ... O O o oo . .OO ... O 

# pwd               [ $(pwd) ]
# words             [ $tWords ]
# lines:            [ $tLines ]
# time total:       [ $tDeltaTotal ] ms.
            "
        ;;
    "q" )
        echo "# papa :)"
        exit 0
        ;;
    
    esac



    if [[ "$line" == 'rr' || "$line" == 'rrun' ]]; then
        echo "               ^ re - run .....  [$#] cmd [ $cmdE ]"
        cmdWrapper "$cmdE"
    
    elif [[ "$line" == rrn* ]]; then
        nTimes=0
        wi=0
        for w in `echo "$line"`;do
            #echo "w: [ $w ]"
            if test "$wi" = "1";then nTimes=$w; fi
            wi=$[$wi+1]
        done
        echo "               ^ re - run [ $nTimes ] times .....  [$#] cmd [ $cmdE ]"
        
        nCount=$nTimes
        tAvgStart=$(tNow)
        echo -n "# runing ... "
        while test "$nTimes" != "0";do
            echo -n $nTimes" "
            nTimes=$[$nTimes-1]
            cmdWrapper "$cmdE" >> /dev/null

        done 
        echo "DONE"
        echo "# of runs:        [ $nCount ]"
        echo "# total:          [ "$[ $(tNow) - $tAvgStart ]" ] ms."
        echo "# avg per run     [ "$[ ( $(tNow) - $tAvgStart) / $nCount ]" ] ms."
        #cmdWrapper "$cmdE"

    fi


    tDeltaInt=$[ $(tNow) - $tStartInt  ]
    #echo -n "start[ $tStart ] "
    echo -e "\n\e[35m#___[ $tDeltaInt ] ms.____\e[0m"
    #echo -n " code: [$?] "
    echo -n "## "
    #echo -n "$line"
    #echo -en "\t\t]< - in wrapper\n"
    doPromptPrefix

done

echo "# EXIT 0"