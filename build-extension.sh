#!/bin/bash
pushd extension
rollup -i js/background.js -f iife -o js/dist/background-bundle.js
rollup -i js/dashboard.js -f iife -o js/dist/dashboard-bundle.js
rollup -i js/listener.js -f iife -o js/dist/listener-bundle.js
popd

rm -rfv attention-monster.zip
pushd extension
zip -9 -v -r ../attention-monster.zip *
popd
