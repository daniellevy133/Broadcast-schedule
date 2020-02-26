use just launch.json file
rootDir property on tsconfig.json have to be defult path ('.')
the file's path you want debug have to exist on include Array on tsconfig.json file (the root path "./")
add/edit property sourceMap on tsconfig.json to true value