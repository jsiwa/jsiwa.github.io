title: test-double
tags:
---

Gerard Meszaros is working on a book to capture patterns for using the various Xunit frameworks. One of the awkward things he's run into is the various names for stubs, mocks, fakes, dummies, and other things that people use to stub out parts of a system for testing. To deal with this he's come up with his own vocabulary which I think is worth spreading further.

Gerard Meszaros正在写一本书整理那些使用“Xunit”框架的测试模式。其中他遇到的一件棘手的事就名字繁多，如：stubs，mocks，fakes，dummies以及其它用来测试系统局部的。为了解决这个问题，他发明一系列我认为值得被广泛传播的自创词汇。

The generic term he uses is a Test Double (think stunt double). Test Double is a generic term for any case where you replace a production object for testing purposes. There are various kinds of double that Gerard lists:

他使用的通用术语叫做“测试替身”。这是一个适用于描述任何替换了生产对象来进行测试的场景。

Dummy objects are passed around but never actually used. Usually they are just used to fill parameter lists.

傀儡对象经常被提到事实上却从来没有被用到。通常只是被用来填充参数列表。

Fake objects actually have working implementations, but usually take some shortcut which makes them not suitable for production (an InMemoryTestDatabase is a good example).

伪对象有一些应用实例，但是

Stubs provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test.

Spies are stubs that also record some information based on how they were called. One form of this might be an email service that records how many messages it was sent.


Mocks are pre-programmed with expectations which form a specification of the calls they are expected to receive. They can throw an exception if they receive a call they don't expect and are checked during verification to ensure they got all the calls they were expecting.