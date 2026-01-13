
for f in `ls | grep '\.c'`;do
    echo "* file [$f]"

    gcc -o "$f"".bin" "$f" -lncurses
    
done
