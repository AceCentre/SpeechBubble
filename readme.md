##SpeechBubble

SpeechBubble is a website to allow individuals to search and compare different [communication aid solutions](http://acecentre.org.uk/what-is-a-communication-aid). 


Getting Involved
----------------
There are many ways to contribute to the development of the SpeechBubble. Here are some ideas:

### Use the site!

Use the site currently at http://production.speechbubble.org.uk and if you spot a problem/enhancement use the feedback button at the bottom when you spot a problem. 

### Code

In order to start contributing code and/or designs to the SpeechBubble project, follow the steps below:

1. Fork this repo. For detailed instructions visit [http://help.github.com/fork-a-repo/](http://help.github.com/fork-a-repo/)
2. Install & run locally (see below)
3. Hack away! but please make sure you follow [this branching model] (http://nvie.com/posts/a-successful-git-branching-model/). That means, make your pull requests against the **develop** branch, not the **master** branch.

### Review

Another very useful way to contribute to the SpeechBubble project is to identify any bugs or issues that may still be lurking around. You can also submit requests for the features that you think the SpeechBubble is still missing. To get started, follow the steps below:

1. [Sign up for a fee github account](https://github.com/signup/free) if you don't already have one
2. Report issues and submit feature requests to your heart's content via a the [SpeechBubble issues page](http://github.com/acecentre/speechbubble/issues) 


### Install

#### Install OSX

1. Install homebrew
2. Install nodejs

````
npm install -g grunt-cli
npm install -g bower
gem install sass
gem install compass
npm install
bower install
brew install mongodb
mkdir -m /data/db
sudo chown #{current_user} /data/db
mongod
```

#### Development

`grunt serve`
