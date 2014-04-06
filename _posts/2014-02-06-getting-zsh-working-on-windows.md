---
layout: post
title: Getting ZSH Running On Windows
description: "Short instructional guide on how to get ZSH running on Windows"
modified: 2013-05-31
tags: [windows, zsh, snippet]
image:
  feature: abstract-3.jpg
  credit: dargadgetz
  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
comments: true
share: true
---

While trying to get ZSH and it's complimentary framework OhMyZSH up and running on my Windows machine, I encountered a couple of issues that I have documented here in the hope that they will be of use to others trying to acheive the same thing.

Download Cygwin and ensue the following packages are selected:

    * git
    * zsh
    * wget
    * curl

Then run the installer.

Add a new task to ConEmu running this command:

  {% highlight bash %}
  C:\cygwin64\bin\zsh -l -i
  {% endhighlight %}

Install Oh My ZSH manually. Clone the repo, and then copy into C:\cygwin64\home\Andrew.

Replace the .zshrc file with the one in the .oh-my-zsh folder, and run.

## Problems and pitfalls

To get around the issue zsh compinit: insecure directories, run the command:

  {% highlight bash %}
  compaudit | xargs chmod 550
  {% endhighlight %}

If it spits out a load of guff before the command prompt delete .zcompdump in the \home\User directory and restart.

Another solution was to run the command:

  {% highlight bash %}
  rm -f ~/.zcompdump; compinit
  {% endhighlight %}

Useful Links

* [Setting Up CygWin](http://chunlianglyu.com/article/2013/01/cygwin/)
* [https://github.com/robbyrussell/oh-my-zsh/issues/630](https://github.com/robbyrussell/oh-my-zsh/issues/630)
* [A Better Terminal For Windows](http://www.typeof.co/post/a-better-terminal-for-windows)
* [Terminal Happiness In Windows](http://cdewaka.com/2013/06/terminal-happiness-in-windows/)