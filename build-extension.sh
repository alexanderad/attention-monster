#!/bin/bash
pushd extension
rollup -i js/collector.js -f iife -o js/dist/collector-bundle.js
rollup -i js/dashboard.js -f iife -o js/dist/dashboard-bundle.js
popd

rm -rfv attention-monster.zip
pushd extension
zip -9 -v -r ../attention-monster.zip *
popd
