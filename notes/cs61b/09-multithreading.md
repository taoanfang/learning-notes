# 多线程

## 一、学习目标

1. 理解进程与线程的概念，能够区分二者区别；
2. 掌握 3 种多线程创建方式，理解各自优缺点与适用场景；
3. 熟悉后台线程（守护线程）的作用与使用规范；
4. 掌握线程 6 种生命周期状态及状态转换规则；
5. 熟练使用线程优先级、休眠、插队、让步、中断等操作方法；
6. 理解多线程安全问题成因，掌握同步代码块、同步方法实现线程同步。

## 二、13.1 进程与线程

### 2.1 进程（Process）

1. **定义**

    进程是**程序的一次运行实例**，是操作系统**资源分配和调度的基本单位**。

- 程序：存放在磁盘的静态二进制文件，不占用系统资源；
- 进程：加载到内存的动态运行体，占用内存、CPU 等资源，程序结束则进程销毁。

2. **多道程序设计技术**

    单核 CPU**同一时刻仅能执行一个进程**。操作系统将 CPU 划分为微小**时间片**，多个进程分时轮流占用 CPU；因时间片极短、CPU 运算速度快，宏观上表现为多个程序并发运行。

### 2.2 线程（Thread）

1. **定义**

    线程是**进程内部的独立执行单元**，也是 CPU 调度的最小单位。

- 一个进程至少包含**一个主线程**；
- 单线程：程序只有一条执行路径；多线程：一个进程内多条执行路径交替运行。

2. **运行特点**

    同进程内的多线程同样依靠 CPU 时间片轮转执行，**微观串行、宏观并发**；线程不拥有独立系统资源，**共享所属进程的全部资源**。

### 2.3 进程与线程对比

表格

|对比项|进程|线程|
|---|---|---|
|核心定位|系统资源分配、调度的基本单位|CPU 独立调度的最小单位|
|资源分配|拥有独立内存、运行状态等资源|共享所在进程的资源，仅保留少量运行栈|
|执行关系|进程之间相互独立|同进程内线程相互依赖、协作运行|
|并发机制|基于多道程序设计，分时占用 CPU|进程内部多条执行路径交替抢占 CPU|

## 三、13.2 线程的创建方式 & 后台线程

Java 提供**三种主流多线程创建方式**，各有适用场景；同时支持后台线程与 Lambda 简化写法。

### 3.1 方式一：继承 `Thread` 类

#### 实现步骤

1. 自定义类继承 `java.lang.Thread`；
2. 重写 `run()` 方法（线程核心执行逻辑）；
3. 创建线程对象，调用 `start()` 启动线程（JVM 自动调用 `run()`）。

#### 代码示例

java

运行

```
public class Example02 {
    public static void main(String[] args) {
        MyThread02 myThread = new MyThread02();
        myThread.start(); // 启动线程，不能直接调用run()

        while (true) {
            System.out.println("main()方法在运行");
        }
    }
}

// 继承Thread类
class MyThread02 extends Thread {
    @Override
    public void run() {
        while (true) {
            System.out.println("MyThread类的run()方法在运行");
        }
    }
}
```

#### 优缺点

- 优点：写法简单，上手容易；
- 缺点：受 **Java 单继承** 限制；多个线程无法天然共享资源（每个子类实例都是独立对象）。

### 3.2 方式二：实现 `Runnable` 接口（推荐）

#### 实现步骤

1. 自定义类实现 `java.lang.Runnable` 接口；
2. 重写 `run()` 方法；
3. 创建 Runnable 实现类对象，传入 `Thread` 构造器；
4. 调用 `Thread` 对象的 `start()` 启动线程。

#### 代码示例

java

运行

```
public class Example03 {
    public static void main(String[] args) {
        // 仅创建一个共享任务对象
        MyThread03 myThread = new MyThread03();
        Thread thread = new Thread(myThread);
        thread.start();

        while (true) {
            System.out.println("main()方法在运行");
        }
    }
}

// 实现Runnable接口
class MyThread03 implements Runnable {
    @Override
    public void run() {
        while (true) {
            System.out.println("MyThread类的run()方法在运行");
        }
    }
}
```

#### 优缺点

- 优点：规避单继承限制；**天然支持多线程共享资源**；代码与数据分离，扩展性强；
- 缺点：写法略繁琐。

#### Lambda 表达式简化（函数式接口特性）

`Runnable` 是函数式接口，可直接简写，无需定义独立实现类：

java

运行

```
Thread t = new Thread(() -> {
    System.out.println("新线程执行逻辑");
});
t.start();
```

#### 资源共享说明

售票案例验证：仅创建**一个 Runnable 任务对象**，多个 `Thread` 线程共用该对象，所有线程操作同一份共享数据，解决资源隔离问题。

### 3.3 方式三：实现 `Callable` 接口（高级用法）

#### 适用场景

`Thread`、`Runnable` 的 `run()` 方法**无返回值、无法抛出受检异常**；`Callable` 专门解决该问题，适用于需要获取线程异步执行结果的场景。

#### 实现步骤

1. 自定义类实现 `java.util.concurrent.Callable<T>` 泛型接口；
2. 重写 `call()` 方法（有返回值、可抛出异常）；
3. 使用 `FutureTask` 封装 `Callable` 对象；
4. 将 `FutureTask` 传入 `Thread` 构造器，调用 `start()` 启动线程；
5. 调用 `FutureTask.get()` 获取线程执行结果（**阻塞方法**）。

#### 代码示例

java

运行

```
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class Example04 {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        MyThread04 myThread = new MyThread04();
        FutureTask<Object> ft1 = new FutureTask<>(myThread);
        Thread thread1 = new Thread(ft1, "thread");
        thread1.start();

        // get() 会阻塞主线程，等待子线程执行完毕
        System.out.println("线程返回结果：" + ft1.get());
        System.out.println("main()方法在运行");
    }
}

// 实现Callable接口
class MyThread04 implements Callable<Object> {
    @Override
    public Object call() throws Exception {
        int i = 0;
        while (i++ < 5) {
            System.out.println(Thread.currentThread().getName() + "的call()方法在运行");
        }
        return i;
    }
}
```

#### Future 接口常用方法

表格

|方法声明|功能描述|
|---|---|
|`boolean cancel(boolean mayInterruptIfRunning)`|取消任务，参数表示是否中断正在运行的任务|
|`boolean isCancelled()`|判断任务是否在完成前被取消|
|`boolean isDone()`|判断任务是否执行完毕|
|`V get()`|阻塞式获取执行结果，等待任务完成|
|`V get(long timeout, TimeUnit unit)`|限时获取结果，超时直接返回|

#### 核心说明

- `FutureTask`：同时实现 `Runnable` 和 `Future`，是连接线程与返回值的桥梁；
- `get()` 阻塞特性：主线程会暂停，直到子线程执行完成才继续运行。

### 3.4 三种创建方式总结

1. **继承 Thread**：写法简单，单继承受限，不适合资源共享；
2. **实现 Runnable**：无继承限制，支持资源共享，**日常开发首选**；
3. **实现 Callable**：支持返回值、抛出异常，用于异步计算、需要获取结果的场景。

### 3.5 后台线程（守护线程 Daemon Thread）

1. **线程分类**

- **前台线程（默认）**：程序运行的核心支柱，只要有一个前台线程存活，Java 进程就不会终止；
- **后台线程**：依附前台线程运行，典型应用：JVM 垃圾回收 (GC)。**所有前台线程结束后，后台线程会被强制终止**。

2. **使用规则（强制）**

    `setDaemon(true)` 设置后台线程 ==**必须在 `start()` 之前调用**==，启动后设置无效且会抛出异常。

3. **判断方法**：`isDaemon()`，返回 `true` 表示为后台线程。


## 四、13.3 线程的生命周期及状态转换

Java 线程生命周期共包含 **6 种核心状态**，线程会根据运行条件在不同状态间切换。

### 4.1 六大状态详解

1. **新建状态（New）**

    仅创建线程对象，未调用 `start()`；JVM 仅分配内存，线程无执行行为。

2. **可运行状态（Runnable / 就绪态）**

    调用 `start()` 后进入该状态，线程具备运行条件，进入队列**等待 CPU 调度**（JVM 将 “运行中” 也归为此状态）。

3. **锁阻塞状态（Blocked）**

    线程尝试获取**同步锁**失败时进入该状态；持有锁的线程释放锁后，当前线程回到可运行状态。

4. **无限等待状态（Waiting）**

    调用无参 `wait()` 等方法进入，**无法自动唤醒**；必须由其他线程调用 `notify()` / `notifyAll()` 唤醒。

5. **计时等待状态（Timed_Waiting）**

    调用 `sleep(long)`、`join(long)`、`wait(long)` 等带时间参数的方法进入；等待超时或被唤醒后，恢复可运行状态。

6. **被终止状态（Terminated）**

    `run()` 方法正常执行完毕，或出现未捕获异常，线程生命周期结束。


### 4.2 核心状态转换规则

1. 新建 → 可运行：调用 `start()`；
2. 可运行 → 锁阻塞：获取同步锁失败；锁阻塞 → 可运行：成功获取锁；
3. 可运行 → 无限等待 / 计时等待：调用对应等待方法；
4. 等待状态 → 可运行：被唤醒 / 等待超时 + 成功获取锁；
5. 所有状态最终均可转为**被终止状态**。

## 五、13.4 线程操作的相关方法

### 5.1 线程优先级

1. 取值范围：`1 ~ 10`，数字越大优先级越高。
2. Thread 静态常量：

- `MIN_PRIORITY = 1`（最低优先级）
- `NORM_PRIORITY = 5`（默认优先级）
- `MAX_PRIORITY = 10`（最高优先级）

3. 设置方法：`setPriority(int newPriority)`。
4. 注意事项：

    优先级仅**提高获取 CPU 时间片的概率**，不保证绝对执行顺序；受操作系统调度影响，**不可作为核心业务逻辑依据**。

### 5.2 线程休眠 `sleep(long ms)`

1. 静态方法，仅作用于**当前执行线程**；
2. 效果：线程进入**计时等待状态**，休眠指定毫秒；休眠结束后进入就绪队列，不会立即运行；
3. 特性：休眠期间**不会释放同步锁**；必须捕获 / 抛出 `InterruptedException`。

### 5.3 线程插队 `join()`

1. 作用：改变执行顺序，让指定线程独占 CPU，并行转为串行。
2. 重载方法：

- 无参 `join()`：当前线程阻塞，**直到被插队线程完全执行完毕**；
- 有参 `join(long ms)`：仅阻塞指定毫秒，超时后线程重新竞争 CPU。

3. 应用场景：主线程需要等待子线程执行完成后，再继续后续逻辑。

### 5.4 线程让步 `yield()`

1. 静态方法，当前线程从**运行态退回就绪态**，主动让出 CPU；
2. 核心特性：线程**不会阻塞**，仍留在就绪队列参与竞争；无法保证其他线程一定获得执行权。

### 5.5 线程中断 `interrupt()`

1. 核心误区：`interrupt()` **不会强制杀死线程**，仅给线程打上**中断标记**（发送停止建议）。
2. 核心方法：

- `interrupt()`：设置中断标记；
- `isInterrupted()`：检测中断标记状态。

3. 执行逻辑：线程需要**主动检测标记**，通过 `break` / `return` 实现优雅退出；未检测则线程继续运行。
4. 补充：已终止的线程，设置中断标记无效。

## 六、13.5 线程同步

### 6.1 线程安全问题

1. **问题现象**（售票案例）：同一张票被多次售卖、卖出票号为 0 或负数。
2. **成因**

- 多线程并发读写**同一共享资源**，无访问限制；
- 资源操作为**非原子操作**（如 `tickets--` 分为：读取 → 自减 → 写回三步，可被打断）；
- `sleep()` 等方法会放大线程竞争问题。

### 6.2 解决方案一：同步代码块

#### 语法格式

java

运行

```
synchronized(锁对象) {
    // 操作共享资源的核心代码
}
```

#### 运行原理

同一时刻**仅允许一个线程进入同步代码块**，其他线程获取锁失败则进入阻塞状态；线程执行完毕后释放锁，其他线程重新竞争。

#### 代码示例（售票案例）

java

运行

```
class Ticket1 implements Runnable {
    private int tickets = 10;
    // 全局唯一锁对象
    private final Object lock = new Object();

    @Override
    public void run() {
        while (true) {
            synchronized (lock) {
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if (tickets > 0) {
                    System.out.println(Thread.currentThread().getName() + "---卖出的票" + tickets--);
                } else {
                    break;
                }
            }
        }
    }
}
```

#### 使用规范

- 锁对象可以是任意 Java 对象，但**所有线程必须共用同一个锁**；
- 锁对象不能在 `run()` 方法内部创建（每个线程生成新锁，同步失效）。

### 6.3 解决方案二：同步方法

#### 语法格式

使用 `synchronized` 修饰整个方法，本质是同步代码块的简化写法。

java

运行

```
// 同步方法
private synchronized void saleTicket() {
    if (tickets > 0) {
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + "---卖出的票" + tickets--);
    }
}
```

#### 锁对象规则

1. 非静态同步方法：默认锁对象为 `this`（当前实例）；
2. 静态同步方法：默认锁对象为**当前类的 Class 对象**。

#### 效果

与同步代码块一致，保证同一时间仅有一个线程执行方法，解决线程安全问题。

## 七、本章总结

1. **基础概念**：进程是资源分配单位，线程是 CPU 调度单位，一个进程可包含多个线程，线程共享进程资源；
2. **线程创建**：3 种方式各有侧重，`Runnable` 为日常首选，`Callable` 用于需要返回值的异步场景；
3. **后台线程**：依附前台线程运行，必须在 `start()` 前设置守护状态；
4. **生命周期**：牢记 6 种线程状态及转换条件，理解线程阻塞、等待、运行的切换逻辑；
5. **线程方法**：优先级、休眠、插队、让步、中断是线程调度核心，重点区分各方法特性与误区；
6. **线程同步**：多线程操作共享资源会引发安全问题，通过 **同步代码块、同步方法**（`synchronized`）实现线程同步，保证数据安全。
