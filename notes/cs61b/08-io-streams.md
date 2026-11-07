# 文件与 IO 流

## 第1节：File类——文件与目录操作
### 1.1 核心概念
- **File类本质**：是文件和目录路径名的抽象表示，**不负责文件内容的读写**，仅用于操作文件/目录的元信息（创建、删除、重命名、查询属性等）
- **路径分类**：
- 绝对路径：从文件系统根目录开始的完整路径（如Windows的`C:\`、Linux的`/`），具有唯一性
- 相对路径：相对于当前工作目录（通常是项目根目录）的路径，简洁但依赖运行环境
- **跨平台特性**：自动适配不同系统的路径分隔符（Windows用`\`需转义为`\\`，推荐使用`/`实现跨平台兼容）

### 1.2 构造方法
| 方法签名 | 功能描述 |
|---------|---------|
| `File(String pathname)` | 通过给定的路径名字符串创建File实例 |
| `File(String parent, String child)` | 从父路径字符串和子路径字符串创建File实例 |
| `File(File parent, String child)` | 从父File对象和子路径字符串创建File实例 |

### 1.3 常用方法
- **创建操作**：
- `createNewFile()`：创建新文件，文件已存在则返回false
- `mkdir()`：创建单级目录，父目录不存在则创建失败
- `mkdirs()`：创建多级目录，父目录不存在则一并创建
- **删除操作**：
- `delete()`：删除文件或**空目录**，删除非空目录需先删除目录内所有内容
- **判断操作**：
- `exists()`：判断文件/目录是否存在
- `isFile()`：判断是否为文件
- `isDirectory()`：判断是否为目录
- **获取信息**： - `getAbsolutePath()`：获取绝对路径
- `length()`：获取文件大小（字节数）
- `getName()`：获取文件/目录名称


## 第2节：字节流——InputStream与OutputStream
### 2.1 核心概念 - **字节流特点**：以**字节（byte，8位）**为单位处理数据，可处理所有类型数据（文本、图片、音频、视频等），无编码依赖
- **数据流向**：
	- 输入流（InputStream）：数据从外部流向程序，用于读取数据
	- 输出流（OutputStream）：数据从程序流向外部，用于写入数据

### 2.2 InputStream（字节输入流）
- **抽象父类**：所有字节输入流的超类，不能直接实例化
- **核心方法**：
	- `int read()`：读取1个字节，返回0~255的整数，读到末尾返回-1
	- `int read(byte[] b)`：读取多个字节到数组b，返回实际读取的字节数，末尾返回-1
	- `int read(byte[] b, int off, int len)`：从off位置开始读取len个字节到数组b
	- `close()`：关闭流，释放系统资源（必须执行）
- **常用子类**：
	- `FileInputStream`：从文件读取字节数据
	- `BufferedInputStream`：带缓冲区的字节输入流，提高读取效率
	- `ByteArrayInputStream`：从字节数组读取数据


### 2.3 OutputStream（字节输出流）
- **抽象父类**：所有字节输出流的超类，不能直接实例化
- **核心方法**：
- `void write(int b)`：写入1个字节
- `void write(byte[] b)`：写入整个字节数组
- `void write(byte[] b, int off, int len)`：写入字节数组的一部分
- `flush()`：刷新缓冲区，将数据立即写入目标
- `close()`：关闭流，释放资源（会自动执行flush）
- **常用子类**：
- `FileOutputStream`：向文件写入字节数据
- `BufferedOutputStream`：带缓冲区的字节输出流，提高写入效率
- `ByteArrayOutputStream`：向字节数组写入数据



## 第3节：字符流——Reader与Writer
### 3.1 核心概念
- **字符流特点**：以**字符（char，16位）
- **为单位处理数据，**仅适用于文本文件**，自动处理字符编码，解决字节流读取中文乱码问题 - **本质**：普通字符流底层仍是字节流，只是内置了编码转换器（字节→字符）


### 3.2 Reader（字符输入流）
- **抽象父类**：所有字符输入流的超类
- **核心方法**：
- `int read()`：读取1个字符，返回0~65535的整数，读到末尾返回-1
- `int read(char[] cbuf)`：读取多个字符到数组cbuf
- `int read(char[] cbuf, int off, int len)`：从off位置开始读取len个字符
- `close()`：关闭流
- **常用子类**：
- `FileReader`：读取字符文件的便利类，使用系统默认编码
- `BufferedReader`：带缓冲区的字符输入流，提供`readLine()`方法按行读取文本



### 3.3 Writer（字符输出流）
- **抽象父类**：所有字符输出流的超类
- **核心方法**： - `void write(int c)`：写入1个字符
- `void write(char[] cbuf)`：写入整个字符数组
- `void write(String str)`：写入字符串（最常用）
- `void write(String str, int off, int len)`：写入字符串的一部分
- `flush()`：刷新缓冲区
- `close()`：关闭流
- **常用子类**：
- `FileWriter`：写入字符文件的便利类，使用系统默认编码
- `BufferedWriter`：带缓冲区的字符输出流，提供`newLine()`方法自动适配系统换行符



## 第4节：转换流——字节流与字符流的桥梁
### 4.1 核心作用
- 解决**字符流无法指定编码**的问题，是字节流与字符流之间的转换桥梁
- 实现字节流与字符流的相互转换，支持手动指定字符编码（如UTF-8、GBK），从根本上解决中文乱码问题
- ### 4.2 核心类
- #### 4.2.1 InputStreamReader（字节输入流→字符输入流）

- **功能**：解码过程（字节→字符），将字节输入流转换为字符输入流
- **构造方法**：
- `InputStreamReader(InputStream in)`：使用平台默认编码
- `InputStreamReader(InputStream in, String charsetName)`：显式指定编码（推荐）
- **示例**：
- - ```
- ``
  ```java
  // 将字节输入流转换为UTF-8编码的字符输入流
- InputStreamReader isr = new InputStreamReader(new FileInputStream("test.txt"), "UTF-8");```
  ```


#### 4.2.2 OutputStreamWriter（字节输出流→字符输出流）
- **功能**：编码过程（字符→字节），将字符输出流转换为字节输出流
- **构造方法**：
- `OutputStreamWriter(OutputStream out)`：使用平台默认编码
- `OutputStreamWriter(OutputStream out, String charsetName)`：显式指定编码（推荐）
- **示例**：
  - - ```
    ```java
  // 将字符输出流转换为GBK编码的字节输出流
- OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream("test.txt"), "GBK");```
