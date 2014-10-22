---
layout: post
title: Mail-fun with Mailgun
description: "Building a simple Mailgun contact form in WordPress with jQuery and PHP"
modified: 2014-10-18
tags: [javacript, jQuery, PHP, WordPress]
image:
  feature: dirty_harry_2.jpg
  credit: Dirty Harry (1971)
  creditlink: http://www.imdb.com/title/tt0066999/
comments: true
share: true
---

I was recently asked to implement a simple contact form on an old Wordpress website. This is a typical development task, where rather than reaching for a plugin, I decided to implement a more robust solution. This example uses jQuery.ajax and PHP.

My personal experience with Wordpress plug-ins has been mixed and it has always been my preference too keep things like this lean, no superfluous bloat. I have built and rebuilt many small pieces of form functionality like this, and they can be tricky to build and test locally. Considerations such as how your development and live servers are configured. In particular the sending of email. It was at this point I began looking at [Mailgun](http://www.mailgun.com/).

Mailgun is a web service run by [Rackspace](http://www.rackspace.co.uk/) that basically provides an API for sending out email. Essentially all you need to do is post your form data to Mailgun, and Mailgun itself does all the heavy lifting of actually sending out the email and ensuring it gets delivered. You will need to sign up for Mailgun, your first 10000 emails of the month are free, so for this kind of light form use it is ideal. There are several advantages that Mailgun offers. You can set up mailing lists which allows you to route your form to a number of addresses. Very useful if you find you have to change the recipients of a form on a regular basis. There is also the option to set up routes for mail too, depending on various criteria. Again there are some cases where I can see this coming in useful. It's well worth exploring the Mailgun control panel to see all of the options that are available. 

Anyway back to the example. I have set up a simple form to gather three pieces of data: Name, Email, and Message. I have kept this short for the sake of this example, so a simple form would be marked up like so:

    {% highlight html %}
    <form class="form" id="contact_form" role="form" method="POST">
                
        <label for="contact-name">Name</label>
        <input type="contact-name" id="contact-name" name="contact-name" placeholder="Name">
                    
        <label for="contact-email">Email</label>
        <input type="contact-email" id="contact-email" name="contact-email" placeholder="Email">

        <label for="contact-message">Message</label>
        <textarea id="contact-message" name="contact-message" rows="6" placeholder="Message"></textarea>
                  
        <button type="submit">Send</button>

    </form>
    {% endhighlight %}

We need a JavaScript function to look out for form submissions, serialize the data and post it to our Mailgun form handler. We start out by listening for form submissions, then perform a basic ajax process on it. Serialize the data and post it over to /ajax/mailgun.php (*or wherever you want to place your mailgun process file*). 

There are some short messages in here which inform the user as to what is happening while this process is taking place. These can be worked up later, to improve user experience, but for now they will help to inform us of what is happening. If this worked OK you should have some nicely formatted data making it's way to your Mailgun process file.

    {% highlight javascript %}
    $('#contact_form').on('submit',function(e) {
        e.preventDefault();

        $('#contact_form').prepend('Processing...');

        $.ajax({
            type     : 'POST',
            cache    : false,
            url      : '/ajax/mailgun.php',
            data     : $(this).serialize(),
            success  : function(data) {
                response(data);
            },
            error  : function(data) {
                // Fail
            }
        });

        return false;

    });

    function response(data) {

        data = JSON.parse(data);

        if(data.status === 'success') {
            $('#contact_form').html("You're mail has been successfully sent.");
        } else {
            $('#contact_form').html("Oops, Something went wrong, please contact us directly - mail@someplace.com");
        }

    }
    {% endhighlight %}

Now you have the data from your form, you need to place it into a PHP array, and then send it to Mailgun. There are a couple of functions in this process file that I have picked up that make it easier to implement this. I am not a PHP guy through and through so this could probably be optimised a little bit more, however there is not much to it, here it is.

    {% highlight php %}
    if(empty($_POST) || !isset($_POST)) {
 
        ajaxResponse('error', 'Post is empty.');
 
    } else {
 
        $postData = $_POST;
        $dataString = implode($postData,",");
 
        $mailgun = sendMailgun($postData);
 
        if($mailgun) {
 
            ajaxResponse('success', 'Success.', $postData, $mailgun);
 
        } else {
 
            ajaxResponse('error', 'Mailgun failed to send', $postData, $mailgun);
 
        }
 
    }
    {% endhighlight %}

Here we are checking to see if the submitted data is NOT empty. If it is, we send back an ajax response detailing that. Else we continue on with processing form. "Imploding" the formData that we have gives us a nice comma separated list that we can put in an ajaxResponse. This is the data that gets returned to form page. You can use your favourite Developer Tools to monitor the network and see what is happening with your data. A successful send will have a response of Success, and you will see our success message. If the sendMailgun function (*we'll get on to that in a minute*) fails for some reason then we need to send an error response back. In order to get these to perform correctly though we need to set up a function that returns the data in the correct JSON format, so that our ajax request can interpret what is happening.

    {% highlight php %}
    function ajaxResponse($status, $message, $data = NULL, $mg = NULL) {
        $response = array (
            'status' => $status,
            'message' => $message,
            'data' => $data,
            'mailgun' => $mg
        );
    $output = json_encode($response);
    exit($output);
    }
    {% endhighlight %}

Much of this will be familiar to you if you have worked with JSON in PHP before, but all we are doing here is creating an array with:

* The Status - Success or Error
* The Message - The Friendly message that we put in to detail what the error was.
* The Data - The POST data that we took from the form.
* The Mailgun Data - The Data from the sendMailgun process that we are going to create now.

Finally on to the mailgun send. Firstly there are some variables to set up where you want to put your Mailgun credentials. For the API key, you should be able to get this from your control panel. Then in the api-domain, you can either set this up yourself, or use the sandbox one that is already created for you (it begins with the phrase sandbox and has a long sequence of letters and digits after it). Then in your send_to variable, you simply need to add the email address you want to send to.

Next we need to take the data from post data, which we have just passed into this function. So we do this for the three fields we want to process. Then we can set up the message body itself, I have kept it pretty basic here but you can obviously add in as much as you want here. Now go ahead and set up the remaining email parameters, such as the form, to addresses and subject lines, follow the format that I have laid out here. 

Now, the way we are going to use Mailgun is to cURL our data over to the Mailgun API. So that it receives it in a format that it can understand. Although cURL isn't something I have used much in PHP, you can see here basically what is going on, you are posting over all of the variables you have just set up. There are some other values here that I would leave as they are if you are just utilising Mailgun for some light form use.

    {% highlight php %}
    function sendMailgun($data) {

        $api_key = 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        $api_domain = 'sandboxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.mailgun.org';
        $send_to = 'andrew@mailbox.co.uk';

        $name = $data['name'];
        $email = $data['email'];
        $content = $data['message'];

        $messageBody = "Contact: $name ($email)\n\nMessage: $content";

        $config = array();
        $config['api_key'] = $api_key;
        $config['api_url'] = 'https://api.mailgun.net/v2/'.$api_domain.'/messages';

        $message = array();
        $message['from'] = $email;
        $message['to'] = $send_to;
        $message['h:Reply-To'] = $email;
        $message['subject'] = 'Contact Enquiry';
        $message['text'] = $messageBody;

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $config['api_url']);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, "api:{$config['api_key']}");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS,$message);

        $result = curl_exec($curl);

        curl_close($curl);
        return $result;

    }
    {% endhighlight %}

That's it! Now, providing the above worked correctly then you should be able to submit your form and see emails coming back to your inbox, complete with the form data. 

The idea here is that this is a bare-bones mail process, enough to get you up and running. You now have all the Mailgun filtering and processing options at your fingertips. You can adapt and rework this process to suit your own specific needs

This can easily be adapted to other frameworks/languages. The Mailgun site is full of examples of this being implemented in Ruby, Python, Java and others. My intention is to work up a similar boilerplate for my Django sites. Hopefully this breakdown makes it easier to understand the process, and how you can leverage Mailgun to your advantage.  