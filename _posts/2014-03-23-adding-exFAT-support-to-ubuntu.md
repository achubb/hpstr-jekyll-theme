---
layout: post
title: Adding exFAT Support To Ubuntu
description: "Short Snippet to show how to add exFAT support to Ubuntu."
modified: 2013-05-31
tags: [linux, ubuntu, snippet]
image:
  feature: abstract-3.jpg
  credit: dargadgetz
  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
comments: true
share: true
---

You will need the package **exfat-fuse** to allow you to read and write on exFAT drives:

Open a terminal ctrl+alt+t and type the following:

To add the correct repository:

    {% highlight bash %}
    sudo apt-add-repository ppa:relan/exfat
    {% endhighlight %}

To update your package list:

    {% highlight bash %}
    sudo apt-get update
    {% endhighlight %}

To install exfat-fuse and exfat-utils packages:

    {% highlight bash %}
    sudo apt-get install exfat-fuse exfat-utils
    {% endhighlight %}

Afterwards you just need to plug in the HDD and you're good to go.

Just a simple package install really, but I always forget...