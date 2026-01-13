# Wrapper for ...

<img title="Wrapper.sh logo" src="../icons/ico_wrapper_256_256.png" alt="" style="display:inline"> As a fruit of one apter noon chat. How it's to debug / profile any app prompt reach and run-enable in console. So this is it.

Base on stdio / stderr to console puts delta time markers to profile sections. 

- [x] start with `stdin` commands as console

- [x] time delta for every line from wrapped exec

- [x] re run it `rr` or `rrn 10` it `10 times

- [x] build in battery monitor

- [ ] build in options  
  
  - [x] help | h | ? - this help

```bash
    echo "h" | wrapper.sh
    #Wrapper cmd [  ]
    #argC:        0
    #pwd:         /home/yoyo/Apps/viteyss
    #tNow:        1768058543982
    #wrapper ver: 260109.1734
    R]s. .Lo O $                ^ is help 

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


#___[ 5 ] ms.____
R]🔋39%.s. .Lo O $
```

## dependencies

bash / sh

default settings / editable:

- filtering tool: `fzf`
- folder explorer tool: `mc`
- file editor / opener: `gedit`

## example of use

###### Run-it one liner

To start one liner as **run it** one time **basic stdio**

```bash
echo "rr" | ~/Apps/viteyss/installer/wrapper.sh 'uname -r;date;echo "start .1 steps";sleep .1;echo ".";sleep .1;echo ".";sleep .1;echo ".";sleep .1;echo ".";sleep .1;echo ".";sleep .1;echo ".";uptime;free -hm | grep -n Mem;';echo "$?"
```

###### Profiling script by run-it to temp log file with timeticks in column, echo it on screen.

```bash
app="../tmp.GQo7rjonMJ/sh2.sh";cat `echo -e 'rr' | wrapper.sh "$app" | grep "Log run" | awk '{print $5}'`
``

###### Profiling `sleep .1` command for overhead time.

To start in series **10** times and do **small stats** to see over head 

```bash
echo -ne "rrn 10\ns" | ~/Apps/viteyss/installer/wrapper.sh 'sleep .1';echo "$?"
```

**Return**

```bash
#Wrapper cmd [ sleep .1; ]
#argC:        1
#pwd:         /tmp/tmp.ShF3m69jo4
#tNow:        1767997200450
. . o O $                ^ re - run [ 30 ] times .....  [1] cmd [ sleep .1; ]
# runing ... 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 DONE
# of runs:        [ 30 ]
# total:          [ 4012 ] ms.
# avg per run     [ 133 ] ms.

#___[ 4032 ] ms.____
## . . o O $ # EXIT 0
```

### nice links to know

bash console colors
https://jakob-bagterp.github.io/colorist-for-python/ansi-escape-codes/standard-16-colors/#foreground-text-and-background-colors

---

If you see that this makes sense [ send me a ☕ ](https://ko-fi.com/B0B0DFYGS) | [Master repository](https://github.com/yOyOeK1/oiyshTerminal) | [About SvOiysh](https://www.youtube.com/@svoiysh)