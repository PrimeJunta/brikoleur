#!/bin/sh
# Convenience script for building the project using Dojo build utilities.
#
echo Brikolaj...
export BRIKOLEUR_HOME=~psulonen/WebstormProjects
cd ~psulonen/Documents/Code/buildbox/
echo Updating build script
cp $BRIKOLEUR_HOME/brikoleur/src/main/assembly/sh/build.sh . # update this file for next time
echo Clearing sandbox
rm -Rf work/
rm -Rf package/
mkdir work
mkdir package
echo Copying resources to source directory
cp -R $BRIKOLEUR_HOME/brikoleur/src/main/app-client/* ../devbox/
cp -RL ../devbox/*  work
chmod u+x build.sh
echo Updating profile
cp $BRIKOLEUR_HOME/brikoleur/src/main/assembly/dojo/brikoleur.profile.js work/dojo
cd work/dojo
# Tag splash screen with date
sed -E "s/%\(date\)/$(date)/g" < primejunta/brikoleur/chargen/controller/templates/_Splash.html > _tmp.html;mv _tmp.html primejunta/brikoleur/chargen/controller/templates/_Splash.html
echo Running Dojo build script
chmod u+x util/buildscripts/build.sh
util/buildscripts/build.sh --profile brikoleur.profile.js
echo Copying assets and index pages into place
cd ../..
mkdir work/package
mkdir work/package/dojo
mv work/release/* work/package/dojo/
mv work/css work/package/
mv work/index.html work/package/
mv work/ikons work/package/
mv work/font-awesome work/package/
sed -E 's/"app-client\/primejunta/"dojo\/primejunta/' < work/package/index.html > work/package/_index.html;mv work/package/_index.html work/package/index.html
sed -E 's/"\/app-client\/primejunta/"..\/primejunta/' < work/package/index.html > work/package/_index.html;mv work/package/_index.html work/package/index.html
sed -E 's/deps : \[\]/deps : \[ "primejunta\/brikoleur" \]/' < work/package/index.html > work/package/_index.html;mv work/package/_index.html work/package/index.html
#cp -R $BRIKOLEUR_HOME/brikoleur/src/main/assets release/
echo Creating package
rm brikoleur.zip
cd work/package/
zip -r ../../brikoleur.zip * > /dev/null
cd ../..
mv work/package .
echo Done. Release is in directory package/ and a zip package in brikoleur.zip.