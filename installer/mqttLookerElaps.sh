#!/bin/bash

clear


mqHost="192.168.43.1"
mqPort=10883

tPids=`mktemp`
gPos=12
gPosMqttDebug=23
maxW=50

function printEntry(){
    title="$1"
    value="$2"
    valueDesc="$3"
    
    echo -e "$title . . .\t""[ \e[33m$value\e[0m ]\t\e[2m$valueDesc\e[0m"
}


function mqttDebug(){
    #sleep .1
    #mkBgBorder 9 $[$gPosMqttDebug-1] $maxW 3 '41' "mqtt debug - last message:"

    # save cursor pos
    echo -en "\e[s\e["$gPosMqttDebug";10H" 
    echo -en "[d] [ $1 ]         " 
    #restore cursor pos
    echo -en '\e[u'
}

function doLeft(){
    sleep .3
    dlTopic="$1"
    dlDesc="$2"
    mPos=$gPos
    
    mosquitto_sub -t "$dlTopic" -h "$mqHost" -p "$mqPort" -V mqttv311 | \
    while read -r line; do 
        el=`date -u -d "0 $line seconds - 0 seconds" +"%H:%M:%S"`
        #echo -e "e01Mux switch:\t""[ $el ]"
        # save cursor pos
        echo -en "\e[s\e["$mPos";10H"
              
        printEntry "$dlDesc" "$el" "hh:mm:ss"

        #restore cursor pos
        echo -en '\e[u'
        
        mqttDebug "$dlTopic"
        
        
    done &
    pidm=$!
    echo $pidm >> "$tPids"
    echo "* start doLeft - time [ $dlDesc ] $dlTopic with PID $pidm"
}

function doBatNVolt(){
    sleep .3
    mPos=$gPos
    mosquitto_sub -t "$1" -h "$mqHost" -p "$mqPort" -V mqttv311 | \
    while read -r volts; do 
        ## bash round to 
        voltRound=$( printf "%.3f" $volts ); 
        #echo -e "Tesla ""$1"":\t""[ $voltRound ] volts"
        
        
        # save cursor pos
        echo -en "\e[s\e["$mPos";10H" 
              
        printEntry "$2" $voltRound "vol."

        #restore cursor pos
        echo -en '\e[u'
        
        mqttDebug "$1"
        
        
    done &
        pidm=$!
    echo $pidm >> "$tPids"
    echo "* start [ $2 ] $1 with PID $pidm"
}

function doAsIs(){
    sleep .3
    mPos=$gPos
    mosquitto_sub -t "$1" -h "$mqHost" -p "$mqPort" -V mqttv311 | \
    while read -r valueIs; do 
        # save cursor pos
        echo -en "\e[s\e["$mPos";10H"
   
        printEntry "$2" $valueIs ""

        #restore cursor pos
        echo -en '\e[u'
    
        mqttDebug "$1"
        
    done &
        pidm=$!
    echo $pidm >> "$tPids"
    echo "* start [ $2 ]  $1 with PID $pidm"
}


function mkBgBorder(){
    posX=$1
    posY=$[$2-1]
    wid=$3
    heig=$4
    colo='\e['"$5"'m'
    titleBor="$6"
    
    # save cursor pos
    echo -en '\e[s'
    
    for y in `seq 1 $heig`;do
        echo -en "\e["$[$y+posY]";"$posX"H"
        echo -en "$colo"
        
    
        for x in `seq 1 $wid`;do
            echo -en ' '
        
        done

        if test "$y" = "1";then
            if test "$titleBor" != "";then
                echo -en "\e["$[$y+posY]";"$posX"H"
                echo -en "[i] $titleBor"
            fi
        fi

        
        echo -en '\e[0m'
    done
    
    #restore cursor pos
    echo -en '\e[u'
    
}

tCols=$(tput cols)
tRows=$(tput lines)



### testals frame

mkBgBorder 9 $[$gPos-1] $maxW 6 '43' "🔋 Tesla's:"

doAsIs "e01Mux/batSel" "🔛 selected No#" &
gPos=$[$gPos+1]

doLeft "e01Mux/left" "🔀 e01Mux switch" &
gPos=$[$gPos+1]

doBatNVolt "e01MuxFix/teslaBat0Volt" "No# 0\t" &
gPos=$[$gPos+1]

doBatNVolt "e01MuxFix/teslaBat1Volt" "No# 1\t" &
gPos=$[$gPos+1]





### house frame

gPos=$[$gPos+3]
mkBgBorder 9 $[$gPos-1] $maxW 3 '42' "🔋 House:"

doBatNVolt "e01MuxFix/homeBatVolt" "Main\t" &
gPos=$[$gPos+1]


### mqtt debug frame

gPos=$[$gPos+3]
mkBgBorder 9 $[$gPos-1] $maxW 3 '41' "mqtt debug - last message:"




echo "[i] main positions in list [ $gPos ] maxW [ $maxW ]"
echo "[i] current :     "`date`
echo "[i] To Exit press entre, to kill ... pids: "`cat "$tPids"`



#to x y 
#mkBgBorder 10 30 20 4 '43'

#to right
#mkBgBorder $[$tCols-10] 10 10 4 '44'


read quitm

echo "[>] ok exiting, killing ..."
for p in `cat "$tPids"`;do
    kill $p
done
for p in `ps | grep "mosquitto_sub" | awk '{print $1}'`;do
    kill $p
done
echo "[>] DONE exit 0"

