---
layout: post
title: Mail-fun with Mailgun - Part Two
description: "Building a simple Mailgun contact form in WordPress with jQuery and PHP"
modified: 2014-11-8
tags: [javacript, jQuery, PHP, WordPress, MySQL]
image:
  feature: dirty_harry_2.jpg
  credit: Dirty Harry (1971)
  creditlink: http://www.imdb.com/title/tt0066999/
comments: true
share: true
---

### Taking Data to the Database

What follows is a basic tutorial in sending from data to a database, this is a continuation of [part 1](/mail-fun-with-mailgun) of this Mailgun form tutorial.

If your followed [part 1](/mail-fun-with-mailgun) on how to use Mailgun to send basic contact forms, then you are ready for the next step. It is not unkown for simple form mailers to fall at the final hurdle. I have often been in the situation where the the end user email is going unwatched, or someone deletes an email accidentally. So generally it is a good idea to back up your form entries to a database. This can be an advantage in many ways, as well as acting as a backup this will also become a useful source of data which you could later use for things like mailing lists. You can also monitor your form more easily and see how many entires you have recieved and you can also timestamp the entries so you can log the date when the entry was made. As we are already in a PHP, MySQL or Wordpress environment, you can do this fairly easily, so it is well worth the extra work.

Ideally what we would like to do here is save the form data to the database once the email has been sent. This means that we won't have any unsuccesful form completions going into our database. In our mailgun php file we can add in another PHP function called sendToDB, and pass into it the same data that we are passing into the sendMailgun function. Again to make out life easier we should assign all of our data values to variables. In the example I have kept it to the three fields we have on our form.

    {% highlight php startinline %}
    function sendToDB($data) {

        $firstname = $data['name'];
        $surname = $data['email'];
        $title = $data['message'];
    }
    {% endhighlight %}

Then we will need to log into our database. These credentials may already exist if you are building this form out on a Wordpress site, or if you are using another CMS. If you are running the site locally on your machine, then the default credentials will be something like "localhost", "root", "". Many CMS's and frameworks will contain this kind of database configuration somewhere, so it is worth having a look around and seeing how you can access it. When I implement things like this on Wordpress, an easy way to ensure that you have the correct database credentials is to grab them straight from the wp-config file.

Here is how I do it; At the top of the PHP script put a PHP include in to the wp-config file. I usually just drill my way up for the theme directory which can be three or four levels up. You will receive an error if PHP can't find the file. There are more sophisticated ways of including this file, but for me this is cleanest way of including it.

Another advantage of pulling the database credentials into your PHP script in this was is that when you come to deploy the site, you will likely need to pull in different database credentials. This way you can always be sure that you are getting the right credentials.

So now the next step is to set up a link to your database, create a variable called link and add the mysql_connect code, what I am using here is the host, user and pass that I am getting from wp-config. But you can enter your own strings or variables in here. Then we need to select our database. You can set up a new database just for this, but for this example I am using the Wordpress database that already exists. 

    {% highlight php startinline %}
    if($link){
        mysql_select_db("demosite_wp",$link);
    }
    {% endhighlight %}

We should now set up a simple database table to contain our data. You can use any tool you wish for this, personally I use phpMyAdmin if it is already installed on the the server. However you can use whatever you are most comfortable with. Remember if we a are working with a site that currently had a CMS then it will already have a database, where you can store your form contacts. I will continue with the example that we are building this form on a Wordpress site, so we can use the site's MySQL database. 

You should log into the database, using your chosen tool, this could either mean looking in your server's control panel interface for the database, or entering the credentials in the wp-config.php file into a terminal window and opening MySQL. It is beyond the scope of this tutorial to go into the various ways to do this, so I will just leave you with the SQL statement we will need to create a table to store our form data. This table will be called FormSubscribers and will contain an ID field, Name field, Email Field, Message field and a Timestamp to log when the entry was made.

    {% highlight sql %}
    CREATE TABLE `FormSubscribers` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `email` varchar(255) NOT NULL,
        `message` text NOT NULL,
        `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        KEY `id` (`id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
    {% endhighlight %}

Now we need to run a simple SQL query which will place all of our form data into the database. This is standard PHP so nothing to complicated here, make sure you include the table columns and the data values that you want to place within them in the correct order. This should be all you need to copy the form data into the database. You can see here we are placing our SQL statement into a variable called strSQL, and then on the last line we run this query.

    {% highlight php startinline %}
    $strSQL = "INSERT INTO FormSubscribers(Name,Email,Message) VALUES('$name','$email','$message')";

    mysql_query($strSQL) or die(mysql_error());
    {% endhighlight %}

That last step completes the function. All that remains is to call the function in *AFTER* the mail has been sent. In our case we already have somewhere where we can include the call to this function. If you return to the point in our PHP script where we set your success ajaxResponse, we can include a call to our script here, as by this point the sendMailgun function will have completed successfully. 

    {% highlight php startinline %}
    if($mailgun) {

        sendToDB($postData);
        ajaxResponse('success', 'Great success.', $postData, $mailgun);

    } else {
    {% endhighlight %}

So now, if you test your form you should be able to submit data, and receive both an email and update the database. Use a tool like [phpMyAdmin](www.phpmyadmin.net) to check your database table to ensure that it is being updated. 

Now there is nothing cutting edge about what we are doing here, but it is, for me, a simple step that can be taken in order to build a more robust form solution. What we have built here has been kept light and has a low overhead so that we can easily re-purpose it depending on the environment in which we need to use it. 