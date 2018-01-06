#!/bin/bash
pushd extension
rollup -i js/background.js -f iife -o build/background-bundle.js
rollup -i js/index.js -f iife -o build/index-bundle.js
rollup -i js/listener.js -f iife -o build/listener-bundle.js
popd

rm -rfv attention-monster.zip
pushd extension
zip -9 -v -r ../attention-monster.zip *
popd
