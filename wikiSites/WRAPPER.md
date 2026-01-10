# Wrapper for bash

As a frut of one apter noon chat. How it's to debug / profile any app propt reach and runnable in console. So this is it.

Wrapping bash runnable stuff. Base on prints to console puts delta time markers to profile sections. Do helping stuff from shell no bloatwear.

- [x] start with `stdin` commands as console

- [x] time delta for every line from wrapt exec

- [x] re run it `rr` or `rrn 10` it `10 times

- [ ] build in options  
  
  - [x] help | h | ? - this help
  - [x] stats | s - show some numbers after run
  - [x] rrun | rr - re-run it one more time
  - [x] rrn N - re-run it N times
  - [ ] +f - enter filter sub menu
  - [ ] +t - enter trigger sub menu

## dependencies
bash / sh


## example of use

###### Run-it one liner

To start one liner as **run it** one time **basic stdio**

```bash
echo "rr" | ~/Apps/viteyss/installer/wrapper.sh 'uname -r;date;echo "start .1 steps";sleep .1;echo ".";sleep .1;echo ".";sleep .1;echo ".";sleep .1;echo ".";sleep .1;echo ".";sleep .1;echo ".";uptime;free -hm | grep -n Mem;';echo "$?"
```



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
