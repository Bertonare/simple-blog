#!/bin/bash
set -e

# Directory for dependencies
DEPS_DIR="$(pwd)/.deps"
mkdir -p "$DEPS_DIR"
cd "$DEPS_DIR"

# Install Java 17 (OpenJDK) - Check if already done
if [ ! -d "jdk-17" ]; then
    echo "Downloading Java 17..."
    JAVA_URL="https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_linux-x64_bin.tar.gz"
    curl -L -o jdk.tar.gz "$JAVA_URL"
    tar -xzf jdk.tar.gz
    EXTRACTED_DIR=$(find . -maxdepth 1 -type d -name "jdk-17*" | head -n 1)
    mv "$EXTRACTED_DIR" jdk-17
    rm jdk.tar.gz
    echo "Java installed."
else
    echo "Java 17 already installed."
fi

# Install Maven 3.9.6 - Fix URL
if [ ! -d "maven" ]; then
    echo "Downloading Maven..."
    # Using specific Archive URL which is more stable
    MAVEN_URL="https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz"
    curl -L -o maven.tar.gz "$MAVEN_URL"
    
    echo "Extracting Maven..."
    tar -xzf maven.tar.gz
    
    EXTRACTED_DIR=$(find . -maxdepth 1 -type d -name "apache-maven*" | head -n 1)
    if [ -n "$EXTRACTED_DIR" ]; then
        mv "$EXTRACTED_DIR" maven
        echo "Maven installed to $DEPS_DIR/maven"
    else
        echo "Failed to identify extracted Maven directory"
        exit 1
    fi
    rm maven.tar.gz
else
    echo "Maven already installed."
fi

# Create env setup script
cat > env.sh <<EOF
export JAVA_HOME="$DEPS_DIR/jdk-17"
export M2_HOME="$DEPS_DIR/maven"
export PATH="\$JAVA_HOME/bin:\$M2_HOME/bin:\$PATH"
EOF

echo "Installation complete."
echo "Source env.sh to use: source $DEPS_DIR/env.sh"
