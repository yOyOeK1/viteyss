#!/bin/bash


cmdE="$*"
ver="260109.1734"


function tNow(){
    echo $[`date +%s%N`/1000000]
}

echo "#Wrapper cmd [ $cmdE ]"
echo "#argC:        ""$#
#pwd:         $(pwd)
#tNow:        $(tNow)
#wrapper ver: $ver"



WrapState="R" # root 
#
#./root/
#├── +e             file explore
#│   ├── +fTODO             find file
#│   ├── +nTODO             new file
#│   └── oTODO              open folder in def file opener
#├── +fTODO             filter logs
#└── +tTODO             triger in logs
#


openFolderAppPid=0
function openFolderApp(){ 
    lxterminal -e 'mc '"$1" 2>> /dev/null && echo "[i] folder app close" &
    openFolderAppPid=$!
    echo "[i] open folder app pid [ $openFolderAppPid ]"
}

function openLogFiles(){
    #codium "$1" 2>> /dev/null &
    gedit "$1" >> /dev/null && echo "[i] logg files app close" &
    openFolderAppPid=$!
    echo "[i] open log file app pid [ $openFolderAppPid ]"
}

useFilter="fzf"

tStart=$(tNow)
exitCode="NaN"
tLines=0
tWords=0
tDeltaTotal=0

statsAllTime=0 # 0 - as yes 
logRunToTemp=0 # 0 - as yes 
execBuff=""
execBuffSimed=""

function cmdWrapper(){
    cmdExe="$1"
    tStart=$(tNow)
    exitCode="NaN"
    tLines=0
    tWords=0
    execBuff=""
    execBuffSimed=""

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
        execBuff+=$line"\n"
        execBuffSimed+="$tDelta $line\n"
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

function doStatsEcho(){
    echo "#Stats
# pwd               [ $(pwd) ]
# words             [ $tWords ]
# lines:            [ $tLines ]
# time total:       [ $tDeltaTotal ] ms. "
}



function doPromptPrefix(){
    stats=" "
    if test "$statsAllTime" = "0"; then
        stats='s'
    fi
    
    logToTemp=" "
     if test "$logRunToTemp" = "0"; then
        logToTemp='L'
    fi
    


    echo -en "$WrapState]"$stats".\e[1;40m ."$logToTemp"o O\e[0m $ "
    #echo -e '\e[1A\e[Knew line'
}





#cmdWrapper "$cmdE"
tmpP=""
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
        [x] + - toggle stats afrer re-run
        [x] +lr - toggle log re-run to temp file
        [x] olr - open log re-run to temp file
        [x] rrun | rr - re-run it one more time
        [x] rrn N - re-run it N times
        [x] +e - open pwd with openFolderApp 
        [x] +h - filter history commands 
            [x] - to clip board
        [ ] +f - explor files in pwd?
        [ ] +fl - enter filter sub menu   ##grep -m 2 -n a ./isStdi3
        [ ] +t - enter trigger sub menu
        [x] log | l - print out collected log from run
        [x] timeticks | tt - print out collected log from run with time delta

        [x] q - quit
            "

        ;;
    "stats" | "s" )
        echo -e"               ^ stats ... O O ... O O o oo . .OO ... O\n"
        doStatsEcho
        ;;
    "+" )
        if test "0" = "$statsAllTime"; then
            statsAllTime=1
        else
            statsAllTime=0
        fi
        ;;
    "+lr" )
        if test "0" = "$logRunToTemp"; then
            logRunToTemp=1
        else
            logRunToTemp=0
        fi
        ;;
    "olr" ) openLogFiles "$tmpP" ;;
    "+e" ) openFolderApp `pwd` 
        ## find /tmp/ 2>/dev/null | grep -m 5 -n 'tmp' -T
        ;; 
    "+f" ) openFolderApp `pwd` ;;
    "+fl" ) WrapState='fl';;
    "+t" ) WrapState='t';;
    "+h" ) 
        lineSel=`cat ~/.bash_history | uniq | sort | fzf`
        actionSel=`echo -e "to clip board\nok" | fzf`
        echo "#selection: [ $lineSel ] actio [ $actionSel ]"
        if test "$actionSel" = "to clip board";then
            echo "#to clip board"
            echo -n "$lineSel" | xclip -selection clipboard
        fi
        ;;
    "log" | "l" )
        echo -e "$execBuff" 
        ;;
    "timeticks" | "tt" )
        echo -e "$execBuffSimed"
        ;;
    "q" )
        echo "# papa :)"
        exit 0
        ;;
    
    esac



    if [[ "$line" == 'rr' || "$line" == 'rrun' ]]; then
        echo "               ^ re - run .....  [$#] cmd [ $cmdE ]"

        if test "$logRunToTemp" = "0";then
            tmpP=`mktemp`
            cmdWrapper "$cmdE" > "$tmpP"
            echo "#Log run in [ $tmpP ]"
        else
            cmdWrapper "$cmdE"
        fi

        if test "0" = "$statsAllTime"; then
            doStatsEcho
        fi
    
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