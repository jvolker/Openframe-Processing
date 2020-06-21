#!/bin/bash
#
# Be VERY Careful. This script may be executed with admin privileges.

echo "Installing Processing extension ..."

if ! [ -z "$TRAVIS" ]; then
    echo "TRAVIS env, don't install"
    exit 0
fi

os=$(uname)
arq=$(uname -m)

# does processing-java already exist?
if hash processing-java 2>/dev/null; then
    echo "processing-java already installed."
    exit 0
fi

if [ $os == "Linux" ]; then

    # on Linux distributions
    # on RaspberryPi
    if [ $arq == "armv7l" ] || [ $arq == "armv6l" ]; then
        curl https://processing.org/download/install-arm.sh | sudo sh
    else
      echo "Install Processing manually from: https://processing.org/download/"
    fi
elif [ $os == "Darwin" ]; then

    # ON MacOX
    echo "Install Processing manually from: https://processing.org/download/"
fi
