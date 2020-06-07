#!/bin/bash
cd ~/antonivlev.github.io
rm -r *
cp -r ~/my-svelte-project/public/* .
git add . 
git commit -m 'build'
git push origin master