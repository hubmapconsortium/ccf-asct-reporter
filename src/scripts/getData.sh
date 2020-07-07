#!/bin/sh
input='src/scripts/scriptdata.csv'
IFS=','

function get_data() {
    if [ -z $1 ] ; then
        while read f1 f2 f3
        do 
            echo "Downloading $f1..."
            downloadURL="https://docs.google.com/spreadsheets/d/${f2}/export?format=csv&gid=${f3}"
            redirectURL=$(curl -w "%{url_effective}\n" -I -L -s -S $downloadURL -o /dev/null)
            outputCSV="src/assets/data/${f1}.csv"

            curl ${redirectURL} --output ${outputCSV}

        done < $input
    else
        while read f1 f2 f3
        do 
            if [ "$f1" == "$1" ]; then
                echo "Downloading $f1..."
                downloadURL="https://docs.google.com/spreadsheets/d/${f2}/export?format=csv&gid=${f3}"
                redirectURL=$(curl -w "%{url_effective}\n" -I -L -s -S $downloadURL -o /dev/null)
                outputCSV="src/assets/data/${f1}.csv"

                curl ${redirectURL} --output ${outputCSV}
            fi
        done < $input
    fi
}

function print_help() {
    echo ""
    echo "ASCT Reporter Data Miner"
    echo ""
	echo "Usage:"
    echo "./getcsv.sh - Updates all the sheets from google sheets."
    echo "./getcsv <sheet>: Download a specific sheet. Options are:"
    echo "\t  spleen"
    echo "\t  kidney"
    echo "\t  liver"
    echo "\t  lymph"
    echo "\t  heart"
    echo "\t  si"
    echo "\t  li"
    echo "\t  skin"
}

if [ -z "$1" ]; then 
    echo "Updating all sheets\n\n"
    get_data
elif [ "$1" == "help" ]; then 
    print_help
else
    echo "Updating $1 sheet"
    get_data $1
fi