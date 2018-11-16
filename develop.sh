#! /bin/bash

if [ $# -eq 0 ];
then
    echo "--------------------------------------------------"
    echo
    echo "Project directory required, use:"
    echo
    echo "    $0 ../og-frontend"
    echo
    echo "--------------------------------------------------"
    exit 1
fi

PROJECT_DIRECTORY=$1

nodemon --watch source/ --exec "yarn build:dev:once && cp dist/index.js $PROJECT_DIRECTORY/node_modules/\@overgear/yup-ast/"
