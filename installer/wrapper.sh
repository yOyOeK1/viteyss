#!/bin/bash




cmdE="$*"
ver="260122.2109"


## change default terminal in X
# sudo update-alternatives --config x-terminal-emulator
# or 
# ln -s /usr/bin/lilyterm /usr/bin/xdg-terminal-exec


function tNow(){
    echo $[`date +%s%N`/1000000]
}

echo "#Wrapper cmd [ $cmdE ]"
echo "#argC:        ""$#
#pwd:         $(pwd)
#tNow:        $(tNow)
#wrapper ver: $ver"



WrapState="R" # rootMenu
#
#./rootMenu/
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
lowBatteryLevel="35" # if -1 not doing it


tStart=$(tNow)
exitCode="NaN"
tLines=0
tWords=0
tDeltaTotal=0

statsAllTime=0 # 0 - as yes 
logRunToTemp=1 # 0 - as yes 
execBuff=""
execBuffSimed=""

trigLine=""
trigTotal=0
trigsStack=""

function cmdWrapper(){
    cmdExe="$1"
    tStart=$(tNow)
    exitCode="NaN"
    tLines=0
    tWords=0
    execBuff=""
    execBuffSimed=""
    trigTotal=0
    trigsStack=""

    #|| 
    #exitCode=$? && echo '# -------- Inner ExitCode:'$exitCode' << is it [ 0 ]?' 
    #sh -c "$cmdE" && exitCode=$? 
    while IFS="" read -r line; do
        
        tDelta=$[ $(tNow) - $tStart  ]
        #echo -n "start[ $tStart ] "
        echo -en "\e[7m#[ $tDelta ] "
        #echo -n " code: [$?] "
        echo -en "##\e[0m\t"
        echo -ne " $line "
        #echo -e "\t\t\e[43m]< - in wrapper]\e[0m"
        echo ""
        execBuff+=$line"\n"
        execBuffSimed+="$tDelta\t$line\n"
        tLines=$[$tLines+1]    
        tWords=$[$tWords+`echo "$line" | wc -w`]


        if test "$trigLine" != "" && \
            test "$trigLine" = "$line"; then
            
            echo -ne "\e[44m#[TRIG ] ""$tDelta"" ms.\e[0m\n"
            trigsStack="$tDelta $trigsStack"
            trigTotal=$[ $trisTotal + $tDelta ]

        fi


    done < <(
        sh -c "$cmdExe" 2>&1
        exitCode=$? 
        echo "--------------- Exit code:  $exitCode"
        exit $exitCode
        
    ) && echo "# Main Exit code:$?" && doPromptPrefix

    tDeltaTotal=$[ $(tNow) - $tStart  ]
}

function doStatsEcho(){
    echo "#Stats
# pwd               [ $(pwd) ]
# words             [ $tWords ]
# lines:            [ $tLines ]
# time total:       [ $tDeltaTotal ] ms. "


if test "$trigLine" != ""; then
    trigsCount=`echo "$trigsStack" | wc -w`
    echo -e "# trigger total\t\t[ $trigTotal ] ms.
#   avg\t\t\t[ $[$trigTotal/$trigsCount] ] ms.
#   in stack\t[ $trigsCount ] count.
#   \e[2m[ $trigsStack]\e[0m"

fi



}


NotesWTFtipsBATTERYINFO="upower --enumerate
upower -i /org/freedesktop/UPower/devices/battery_BAT0
upower -i /org/freedesktop/UPower/devices/line_power_AC
upower -i /org/freedesktop/UPower/devices/DisplayDevice
acpi -b
inxi --battery
inxi -B"


tips=" 
# history dump of current first?
history --help
history -a
tail -n 15 ~/.bash_history
"



function doPromptPrefix(){
    stats=" "
    if test "$statsAllTime" = "0"; then
        stats='s'
    fi
    
    logToTemp=" "
     if test "$logRunToTemp" = "0"; then
        logToTemp='\e[36mL📜\e[0m'
    fi
    
    if test "-1" = "$lowBatteryLevel";then
        battPerc=""
    else
        battPerc=`acpi -b | awk '{print $4}' | replace "%," ""`
        if test "$lowBatteryLevel" -le "$battPerc"; then
            battPerc="🔋\e[0m"$battPerc'%'"\e[0m" # ok battery
        else
            battPerc="🔋\e[41m"$battPerc'%'"\e[0m" #lo battery
        fi
    fi

    if test "$trigLine" != ""; then
        doTrigger="T"
    else
        doTrigger=" "
    fi



    echo -en "$WrapState]$battPerc""."$stats".\e[1;40m ."$logToTemp"o"$doTrigger"O\e[0m $ "
    #echo -e '\e[1A\e[Knew line'
}

function doThisHelp(){
    echo "               ^ is help 

[x]     help | h | ?    - this help
[x]     hf              - filter this help
[x]     stats | s       - show some numbers after run
[x]     +               - toggle stats afrer re-run
[x]     +lr             - toggle log re-run to temp file
[x]     olr             - open log re-run to temp file
[x]     rrun | rr       - re-run it one more time
[x]     rrn N           - re-run it N times
[x]     rrs N           - re-run it every N sec
[x]     rrs 0           - clear intervals re-run
[x]🗃    +e              - open pwd with openFolderApp 
[x]     +h              - filter history commands 
[x]                         - to clip board
                            - to prompt
[x]     +hc             - filter history commands put directly to clip board

[x]     nrun            - filter runs from package.json if exists  

[x]     fifcmd | fifc   - run command comming from fifo 
[x]     fifq            - quit command over fifo                          

[x]     ps              - filter ps Process list on local shell
[x]                         - to clip board
                            - to prompt
[x]     psa             - filter ps -ax Process list global
[x]                         - to clip board
                            - to prompt
                            - kill

[ ]     +f              - explor files in pwd?
[ ]     +fl             - enter filter sub menu   ##grep -m 2 -n a ./isStdi3
[x]     +t              - enter trigger sub menu
[x]     log | l         - print out collected log from run
[x]     timeticks | lt  - print out collected log from run with time delta

[x]     q - quit
    "
}



whilePid=0
fifReadPid=0
whilePidFilePath='/tmp/abccceceec'
rrsIterval=0
# for file to lock intervals rrs N
tLockFile="/tmp/wrapLockIntervals"

function doMenuLine(){
    line="$1"
    
    case "$line" in
    '[A') echo UP ;;
    '[B') echo DN ;;
    '[D') echo LEFT ;;
    '[C') echo RIGHT ;;
    "help"|"h"|"?")
        doThisHelp
        ;;
     "hf" )
        menuCmd=`doThisHelp | fzf | awk '{print $2}'`
        echo "#selected [ $menuCmd ]"
        doMenuLine "$menuCmd"
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
    "fifq" )
        echo "# fifo command - kill / quit "
        if test "0" != "$whilePid";then
            
            echo "# fifo whilePid [ $whilePid ] ... kill"
            kill "$whilePid" || echo "# no fifo main pid"
            
            
            test -e "$whilePidFilePath" && rm "$whilePidFilePath"
            
            #kill "$fifReadPid" || echo "# no fifo main pid"
            
        fi
        
        ;;
    "fifcmd" | "fifc" )
        echo "# fifo command - start ..."
        #fifPoint=`mktemp -u`
        fifPoint="/tmp/wrapFif"
        mkfifo "$fifPoint"
        echo "# fifo point [ $fifPoint ]"
        
        isRunn=1
        isRunnIter=0
        lineC=0
        fifReadPid=0
        fifCmd=0
        whilePidFilePath="$fifPoint""_wppid"
        while [ $isRunn ];do
        
            ## indicator
            echo "#f"$(( $isRunnIter % 2 ))" - $fifCmd of pid [ $$ ]"
        
        
            if test "$fifReadPid" = "0";then
                while test "$fifCmd" = "0";do
                    parentPid=$$
                    echo "# fifo init cat of fifo ... pid [ $parentPid ]"
                    lineF=`cat "$fifPoint"`
                    pTest=`ps "$parentPid" >> /dev/null; echo $?`
                    
                    pidIOk=0
                    echo -e "# testing if pid while file is in place ...\n#  [ $whilePidFilePath ]"
                    for pidI in {0..5};do
                        if test -e "$whilePidFilePath";then
                            echo "# fifo while pid ... OK"
                            pidIOk=1
                            break
                        else
                            echo "# fifo while pid not in place ...( $pidI )"
                            sleep .1                            
                        fi
                        
                        sleep .1
                    done
                    test "$pidIOk" = "0" && echo "# to many iters exit .." && exit 0
                    
                    wTest=`ps $(cat "$whilePidFilePath") >> /dev/null; echo $?`
                    if test "$wTest" != "0" ;then
                        echo -e "\n\n# fifo cat ... [Oiysh1]\n# cat finished but parent is not there [ $parentPid ]"
                        exit 0
                    fi
                    if test "$pTest" != "0" ;then
                        echo -e "\n\n# fifo cat ... [Oiysh2]\n# cat finished but parent is not there [ $parentPid ]"
                        exit 0
                    fi
                    
                    
                    
                    echo "# fifo cmd [ $lineC ] ---- START"
                    echo "# * fcmd ..."
                    echo "# * [ $lineF" ] 
                    
                    if test "$lineF" = "";then
                        echo "#[ee] cmd line is empty  pid [ $$ ]"
                    elif test "$lineF" = ":q";then
                        echo "#[fif:q] - quit with exitCode 0  pid [ $$ ]"
                        exit 0                    
                            
                    else
                    
                        echo "# Cmd is at fifo ... exec START"
                        cmdWrapper "$lineF" && echo "# fifo cmdWrapper ---- END $?"
                        echo "# Cmd is at fifo ... exec END pid [ $$ ]"
                        echo "# fifo cmd [ $lineC ] ---- END"
                    fi
                    
                    sleep 1
                    lineC=$(( $lineC + 1 ))
                done &
                fifReadPid=$!
                echo "# start to read fifo ... pid [ $fifReadPid ]"
                
            fi
        
        
            sleep 1
            isRunnIter=$(( $isRunnIter + 1 ))
            
        done && isRunn=0 &
        whilePid=$!
        echo "$whilePid" > "$whilePidFilePath"
        
        echo "# main while pid [ $whilePid ]"
        
        
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
    "nrun" ) 
        if test -e "./package.json";then
            lineSel=`cat ./package.json | jq .scripts | grep -v '{' | grep -v '}' | fzf | awk '{print $1}' | replace '"' '' | replace ':' ''`
                
            actionSel=`echo -e "to main cmd\nto prompt\nto clip board\nok" | fzf`
            echo "#selection: [ $lineSel ] action [ $actionSel ]"
            if test "$actionSel" = "to main cmd";then
                echo "# to main cmd: [ npm run $lineSel ] "
                cmdE="npm run $lineSel"
            
            elif test "$actionSel" = "to clip board";then
                echo "# to clip board: [ npm run $lineSel ] "
                echo -n "npm run $lineSel" | xclip -selection clipboard
            elif test "$actionSel" = "to prompt";then   
                echo "# [ $lineName ]"
                read -e -i "npm run $lineSel" -p "Press Enter to run: " cmd && eval $cmd 
            fi
            
            
            
        else
            echo "# no ./package.json in spot :("
        fi
    ;;
    "+t" )
        lineTrigger=`echo -e "$execBuffSimed" | grep -n "" | fzf --reverse`
        ## split by line
        lineAt=`echo "$lineTrigger" | replace ":" " " | awk '{print $1}'`
        trigLine=`echo -e "$execBuff" | head -n "$lineAt" | tail -n 1`

        echo -e "# Selected trigger at line $lineAt \n
        [_\e[44m#""$trigLine""\e[0m_]"

        ;;
    
    "psa" | "ps" )
        if test "$line" = "ps"; then
            useCmd="ps"
        else 
            useCmd="ps -ax"
        fi
        lineSel=`$useCmd | grep -v "    PID TTY" | fzf --header="Select to kill"`
        lineKill=`echo "$lineSel" | awk '{print "kill "$1}'`
        lineName=`echo "$lineSel" | awk '{print $5 " " $6 " . . . "}'`
        
        actionSel=`echo -e "kill\nto prompt\nto clip board\nok" | fzf`
        echo -e"# selection: \n#  line selected: [ $lineSel ]\n#  action: [ $actionSel ]"
        if test "$actionSel" = "to clip board";then
            echo "# to clip board kill by PID [ $lineSel ] [ $lineName ]"
            echo -n "$lineKill" | xclip -selection clipboard
        elif test "$actionSel" = "to prompt";then   
            echo "# cmd to exec [ $lineKill ]"
            echo "# sh level [ $SHLVL ]"
            read -e -i "$lineKill" -p "#[Q] Press Enter to run: " cmd && eval $cmd 
        elif test "$actionSel" = "kill";then   
            echo "# exec [ $lineKill ]"
            $lineKill
        fi
        
        
        
       
        ;;
    
    "+hc" )
        lineSel=`cat ~/.bash_history | uniq | fzf --header="Select history row to clip board"`
        echo "#to clip board [ $lineSel ]"
        echo -n "$lineSel" | xclip -selection clipboard
        ;;
    "+h" ) 

        lineSel=`cat ~/.bash_history | uniq | fzf --header="Select history row ..."`
        actionSel=`echo -e "to prompt\nto clip board\nok" | fzf`
        echo "#selection: [ $lineSel ] actio [ $actionSel ]"
        if test "$actionSel" = "to clip board";then
            echo "#to clip board"
            echo -n "$lineSel" | xclip -selection clipboard
        elif test "$actionSel" = "to prompt";then   
            read -e -i "$lineSel" -p "Press Enter to run: " cmd && eval $cmd 
        fi
        ;;
    "log" | "l" )
        echo -e "$execBuff" 
        ;;
    "timeticks" | "lt" )
        echo -e "$execBuffSimed"
        ;;
    "q" )
        rm "$tLockFile" && echo "# * clean [ $tLockFile ]" || echo "# OK897"
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
    
    elif [[ "$line" == rrs* ]]; then
        nTime=0
        wi=0
        for w in `echo "$line"`;do
            #echo "w: [ $w ]"
            if test "$wi" = "1";then nTime=$w; fi
            wi=$[$wi+1]
        done
        echo "               ^ re - run it every [ $nTime ] .....  [$#] cmd [ $cmdE ]"
        rrsIterval=1
        
        
        
        if test "$nTime" = "0";then
        
            echo "# interval set to 0 ... clear all"
            rrsIterval=0
            test -e "$tLockFile" && rm "$tLockFile" && echo "# fifo interval ... rm lock file"
            
            
        else
            
            > "$tLockFile"
            while test "$rrsIterval" = "1";do
                
                if test -e "$tLockFile"; then
                    echo "# interval3 file lock in place ... lock ..."
                else
                    echo -e "# interval4 interval exit no lock file\n# EXIT 2"
                    exit 2
                fi
                
                echo "# * interval ... [ $nTime ]"
                cmdWrapper "$cmdE"
                
                sleep $nTime
                
            done &
             
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
}




#cmdWrapper "$cmdE"
tmpP=""
doPromptPrefix
while IFS="" read -r line; do
    tStartInt=$(tNow)
    doMenuLine "$line"
done

echo "# EXIT 0"
