Requirements:
NodeJs -> https://nodejs.org/en/download/
iMacros for windows -> https://imacros.net/download/

Steps:
NodeJs:
open terminal and go to folder
execute in terminal: `npm i`
execute in terminal: `npm start`
Run iMacros

IMacros:
run iMacros for Internet Explorer
Go to TypeForm and log in
click record
click stop
click edit
paste the content found in the root of `ExtractTypeform` folder(file called `iMacrosScript.txt`)
click save, close window
click play to script

If the process interrupts, check the last file that has been downloaded and look in hubspot for its id. Then delete the previous lines of code(found in file `iMacrosScript.txt`) with the ids already downloaded and start the iMacros process again.
