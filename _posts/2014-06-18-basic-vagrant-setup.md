---
layout: post
title: Basic Vagrant Setup
description: "Basic Vagrant Setup"
modified: 2014-06-18
tags: [vagrant]
image:
  feature: vagrant_header_background.png
comments: true
share: true
---

I've been getting into Vagrant recently, although it can seem a bit daunting I definitely thing that this virtualised approach is the future for web development. Instead of using things like locally installed LAMP stacks, which lets face it have always been a bit fiddly. So this is just a bit of documentation on the basics of setting up and configuring a Vagrant instance. I hope to do more of these little Vagrant guides over the next couple of months as I learn more about it.

Start by heading over to the [Vagrant site](http://www.vagrantup.com), installing Vagrant and [VirtualBox](https://www.virtualbox.org) if you don't already have them installed.

Now this was the first pitfall I fell into. On my system (*Windows 8.1*) no matter how many times I uninstalled and reinstalled both Vagrant and VirtualBox, couldn't get Vagrant to run. After trawling the web for solutions here is what I have found works for me:

Install VirtualBox first and then restart and install Vagrant, then restart again for luck. You should now be able to run the "vagrant init" command from your command prompt. 

Run the "vagrant init" command. This will generate a Vagrantfile for you. At this stage we are going to change this to reflect a basic Vagrant instance.

	{% highlight ruby %}
	Vagrant.configure("2") do |o|
	    o.vm.box = "precise32"
	    o.vm.box_url = "http://files.vagrantup.com/precise32.box"
	    o.vm.synced_folder "./app", "/var/www/", create:true
	    o.vm.network :private_network, ip: "192.168.55.55"
	    o.vm.provision :shell, :path => "setup.sh"
	end
	{% endhighlight %}

So open the Vagrantfile that has just been generated in a text editor, and remove the current contents. We are going to replace it with the above. This is a very basic configuration, but it basically breaks down as follows:

Within the vagrant file config we are giving the box a name (precise32), setting the url of where to download the box from, which was obatained from [vagrantbox.es](http://www.vagrantbox.es). Then we are setting up our directory that we want to sync on our machine with that of the virtual machine. So here in this case we are saying sync app on our machine with the apache root (/var/www/). The create:true instructs Vagrant to create the local directory. Next we assign out virtual box an ip address on our local network. Finally we add in a call to run a basic shell script when the Vagrant instance is being created. This will be where we will install the necessary packages.

	{% highlight bash %}
	sudo apt-get -y update
	sudo apt-get -y install apache2 php5 libapache2-mod-php5
	sudo service apache2 restart
	{% endhighlight %}

So here we are running a global update on the machine. Then on the second line we are installing the components needed for out server. So they are apache2, php5 and the libapache-mod-php5. We then instruct apache to restart once the installation of all the components is complete.

That's it! This should be enough to get a basic virtual apache server that is synced to a directory on our machine and is also available on the network. Type vagrant up, and sit back while your machine is configured in is installed.

Then open your command prompt at the folder where your vagrantfile is situated and run the "vagrant up" command.

When I tried this however I ran into an error which indicated that Vagrant was unable to locate VirtualBox (or more specifically, as I later discovered, VBoxManage). Specifically it seems to be the "VBoxManage" path that it seemed to complain about the most. To add the correct path in simply enter the following in at a command prompt:

	{% highlight bash %}
	PATH=%PATH%;c:\Program Files\Oracle\VirtualBox
	{% endhighlight %}

Once your vagrant up command is run successfully you should have a virtual Apache server running php which you can access on your network (http://192.168.55.55, or however you configured it in your vagrantfile). You should see the default "It works!" apache page.

Finally to finish the session enter "vagrant halt" in your command prompt. This will shutdown the virtual machine.

So this concludes my first steps with Vagrant. I think that although this is still a tricky setup, I can definitely see the benefits once it is up and running. In theory I should be able to take a copy of my vagrantfile and setup.sh, and build the exact same environment on another Vagrant enabled desktop.  

## Resources

* [Intoduction to Vagrant](https://www.youtube.com/watch?v=FSxS6iPJMFw)
* [Vagrant Docs](http://docs.vagrantup.com/v2/share/index.html)
* [Getting Started with Vagrant & VirtualBox](http://openstack.prov12n.com/getting-started-with-vagrant-virtualbox) 