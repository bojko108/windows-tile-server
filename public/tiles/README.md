# Storage for Map Tiles

Here you can store your map tiles arranged in separate directories. This is an example of directories and files structure:

```
📦default
 ┣ 📂1
 ┃ ┗ 📂1
 ┃ ┃ ┗ 📜0.png
 ┣ 📂2
 ┃ ┗ 📂2
 ┃ ┃ ┗ 📜1.png
 ┣ 📂3
 ┃ ┗ 📂4
 ┃ ┃ ┣ 📜2.png
 ┃ ┃ ┗ 📜3.png
 ┣ 📂4
 ┃ ┣ 📂8
 ┃ ┃ ┣ 📜5.png
 ┃ ┃ ┗ 📜6.png
 ┃ ┗ 📂9
 ┃ ┃ ┣ 📜5.png
 ┃ ┃ ┗ 📜6.png
 ┃ ┗ ...
 ┣ ...
📦another
 ┃ ...
```

Each root directory contains one or more subdirectories representing zoom levels. Each directory with zoom levels contains its map tiles.
