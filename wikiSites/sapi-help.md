# otdmTools.py -serviceIt

  `-serviceIt` is an argument for otdmTools witch starts various service layers: http, mqtt,... These layers will allow you to request an action from otdmTools using a communication method prefered for your situation.

## status

  working ... but still in progress

## to list your instance's skill set (sapis) and serviceIts

  The newest skill set you can get by `otdmTools.py -serviceIt ?` it will spit everything available on your system. Additional plugins will extend your instance's list. So check it out ...

### serviceIts to start as demons in foreground

  By using `-serviceIt [args,..]` you can use ...

- `mqtt`- arg can be used to start ...mqtt

- `http`- arg can be used to start ...http

- `ws`- arg can be used to start ...ws

- `xmlrpc`- arg can be used to start ...xmlrpc
  
  With all the services there is a way to use otdmSTS system. Which will allow you to build tasks for otdmTools by sending in
  `http` url a certain structure.  For more details [otdm_sapis_README.md](otdm_sapis_README.md)

## using serviceIt examples

* serviceIt starting `http`  communication layer (if more then one use like `http,mqtt`)
  
  ```shell
  otdmTools.py -serviceIt http
  ```
  
  *this will start http api stack on a given ip:port(from your config file) that will handle tasks given in the incoming url.*  

* run in full debug
  
  ```shell
  otdmTools.py -forceHttpIp localhost -forceHttpPort 1991 -serviceIt http -sitDebug 1 -stsDebug 1 -sapisDebug 1
  ```
  
  *this will start http api stack and all debugs*  

* lets start with echo
  Example url: 
  
  ```bash
  curl http://localhost:1991/echo/Hello_from_otdmTools/.json
  ```
  
  **Return** in this case `json`  
  
  ```json
  {\"code\": 200, \"status\": \"success\", \"msg\": \"Hello_from_otdmTools\"}
  ```

* getting some **help** from service
  If you are in the browser go to url: 
  
  ```url
  http://192.168.43.220:1990/help/.html
  ```
  
  You shoud see help build on the fly to *-serviceIt* branche of fitures in otdmTools. You can find **examples** of url's

* pipe progressive data formating/wrapping in HTTP API  
  
  ```bash
  curl http://192.168.43.220:1990/echo/Piping_example/json/getKey/code/divPipe/100/.html
  ```
  
  **Return** in this case `html`
  In this example it's showing how you can delegate work to server site. Getting `echo` as example with argument `Pinging_eaxample` pipe to `json` pipe to `getKey` = `code` then pipe this value to dividing `divPipe` function by `/10` and to `.html`
  
  ```html
  <html><body>2.0</body></html>
  ```

## list of sapis

   - `help`       - need 0 arguments.
			**Return** _raw_/_string_ this help :)
   - `ver`        - need 0 arguments.
			**Return** _spipe_/_json_ with versions of otdm familly
   - `statusChk`  - need 0 arguments.
			**Return** _spipe_/_json_ with status of known stuff is it have connection to otplc, yss, mysql, mqtt, grafana, ...
   - `getConfig`  - need 0 arguments.
			**Return** _json_ current known config of otdm
   - `clipLimit`  - need 1 arguments.
			**Return** otdm cliper last `arg0` entrys
   - `sum`        - need 2 arguments.
			**Return** sume _float_ as sum of `arg0` ,`arg1`
   - `divPipe`    - need 1 arguments.
			**Return** division _float_ incomming `pipe` by `arg0`
   - `div`        - need 2 arguments.
			**Return** division _float of `arg0` by `arg1`
   - `getKey`     - need 1 arguments.
			**Return** value from incomming pipe where `key` of json is =  `arg0`
   - `getKeyInAr` - need 1 arguments.
			**Return** _array_ of _values_ form array of jsons with set key to get
   - `getKeyInArEq` - need 2 arguments.
			
   - `packitsoQ`  - need 1 arguments.
			?|lsWork|yes to interact with `-packitso [action]`
   - `packitsoLsAll` - need 1 arguments.
			`arg0` _string_ _.lsWork=>keyWord_ as from where / what worker
   - `packitsoGET` - need 2 arguments.
			as get data from worker. `arg0` _string_ _keyWord_ to set worker `arg1` _string_ ident use to identyfy work peas
   - `packitsoPOST` - need 2 arguments.
			TODO `arg0` _string_ keyWord, `arg1` _json_ data to POST
   - `otdmTools`  - need 1 arguments.
			**Return** result from otdmTools.py `args...`
   - `mkbackup`   - need 1 arguments.
			**Return** status and some file info at end `arg0` path to file/directory to backup
            Example: # ./otdmTools.py -cliSapi 'mkbackup/%2Ftmp%2Fabc%2F1' -oFile '--'
            where %2F is slash
   - `ping`       - need 0 arguments.
			**Return** `pong`
   - `echo`       - need 1 arguments.
			**Return** given argument back as echo
   - `waitFor`    - need 1 arguments.
			**Return** current otdmTools.py time but with delay in sec from `arg0`
   - `infoPipe`   - need 0 arguments.
			xxxxx**Return** info about pipe
   - `.json`      - need 0 arguments.
			**Return** _json_ from `pipe`
   - `.raw`       - need 0 arguments.
			**Return** _raw_/_string_ from `pipe`
   - `.html`      - need 0 arguments.
			**Return** _raw_/_string_ from `pipe` to wrapt `html`


