#!/bin/bash
pushd extension
rollup -i js/background.js -f iife -o build/background-bundle.js
rollup -i js/index.js -f iife -o build/index-bundle.js
rollup -i js/listener.js -f iife -o build/listener-bundle.js
popd

rm -rfv *.zip
pushd extension
VERSION=`cat manifest.json | grep version | grep -v manifest | awk '{split($0,a,":"); print a[2]}' | sed s/\"//g | sed s/\,//g | sed s/\ //g`
VERSIONED_FILENAME="attention-monster-$VERSION.zip"
zip -9 -v -r "../$VERSIONED_FILENAME" *
popd

echo "**********************************************"
echo "Build complete: $VERSIONED_FILENAME"
echo "**********************************************"