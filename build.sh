#!/usr/bin/env bash

[ -f $GOPATH/bin/statik ] || {
    echo "I require the statik program but it's not installed.  Aborting.";
    echo "You can install it with 'go get github.com/rakyll/statik'";
    exit 1;
}

set -ex

yarn build
statik -f -src build
go build main.go
mkdir -p bin
mv main bin/facet
git checkout statik/statik.go
