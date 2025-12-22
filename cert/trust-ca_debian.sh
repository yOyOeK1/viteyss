# add to Keychain
if test -d "/usr/local/share/ca-certificates"; then
    sudo security add-trusted -d -r trustRoot -k "/Library/Keychains/System.keychain" ./ca-crt.pem

else
    echo "EE there is no /usr/local/share/ca-certificates directory"
    echo "chk if ou have ca-certificates installed"
    exit -1

fi

if test -f "server.crt"; then
    sudo cp "server.crt" "/usr/local/share/ca-certificates/viteyss_server.crt"
    sudo update-ca-certificates

else

    echo "EE there is no server.crt file"
    echo "run first create-certs.sh"
    exit -1

fi