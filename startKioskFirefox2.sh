
a=$*
echo "args[$a]";
#http://localhost:8080/yss/index.html
#//#pageByName=2%20Qest
#//#pageByName=2%20Qest&0.9577349546151404
firefox -kiosk "$a&resizeTo=450,700&0.275956761970303" 