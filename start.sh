#!/usr/bin/env bash


dir=`pwd`
echo $dir
nohup $dir/startDevPortal.sh > $dir/startup.log  2>&1 < /dev/null &


