
# filePath
# posW width - is from right
# posH 
# scale to width
 


fileToPlay="$1"

Wscreen=$(fbset | grep 'geometry' | awk '{print $2}')
Hscreen=$(fbset | grep 'geometry' | awk '{print $3}')

W=$2


H=$3
Scale=$4

if test "$W" -le "0";then
    echo "W is negative so from right"
    W=$[ $Wscreen + $W - $Scale ]
fi



mplayer "$fileToPlay" -vf scale -zoom -xy $Scale \
-geometry "$W"":""$H" \
-vo fbdev2
