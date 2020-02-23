# WHRHS hillsHack Repository

This will/can serve as a collaborative repository for any students who wishes to leave something behind for future high school students to look at and reference. The intent is to help other students learn by example, so the more code the better!

***Note: all code here will be public domain, this repo is unlicensed - don't push anything here that you're uncomfortable with anyone else copying.***

---
Here is a quick user-friendly (I hope) guide to using git. See also this [excellent guide](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/) on contributing to a `git` repository!

### Forking a repository

1. [Create a Github account.](https://help.github.com/articles/signing-up-for-a-new-github-account/) Note that it is free to have a github account in general and contribute to public repositories (open source), and students can use the fully functional git/github functionality for free (meaning you can use private repositories that are available only to you).
2. Download git (google "download git"). If you are using Linux, git is likely to be already installed.
3. Now you can begin contributing to a public repo. First, navigate to a repo you want to contribute to, and click the **Fork** button on the top right hand of the page. This will essentially make a copy of the repo on your account. This creates the **origin** (online) location of your repo.
4. Open terminal (```Ctrl+Alt+T``` on Ubuntu Linux) and navigate to the directory you want to put your local copy of the repo. For instance, ```cd ~/Desktop```. Then, use the command ```git clone [repo name here]```. For example, if I wanted to clone my repository to my local machine, I would run the command ```git clone https://github.com/x94carbone/hack```, which will create a directory called ```hack``` in whatever location I navigated to. In your case, you should copy the URL of your git fork ```git clone https://github.com/myusername/hack``` 
5. Change directory into the newly created git repository (```cd hack``` in the case of this repository); you can check that a git repo was successfully initialized within this directory by using ```git status``` which will display the current status of the master branch.
6. Set up an upstream remote branch ```git remote add upstream git@github.com:x94carbone/hack``` (this time, you should run exactly that command). This initializes a branch that essentially points to the actual repository that you want to push your changes to; *not* your forked repository. So in summary, origin/master points to *your* remote repo, and origin/upstream points to the original owner's repo.


### Creating a branch
You're now ready to make local changes to the repo. This is done via branching. You never want to directly modify the master branch, since usually this branch is meant to be always *deployable*. It is supposed to be ready for public use. Therefore, you should make a new branch and make your modifications there. To do this, you should perform the following steps.

1. First, run ```git checkout master``` to ensure you're located on your own local master branch.
2. Next, run ```git pull upstream master```. This does exactly what it sounds like. It will pull the most recent data from the original owner's repo and copy the entire history to your *local* repo. 
3. After that, you want to ensure your *remote* repo is up to date with your local one, so you should push via ```git push origin master```.
4. Finally, create a local branch via ```git checkout -b my-branch-name```.
5. Also, ensure you're actually on the branch ```my-branch-name``` and not ```master``` by running the command ```git status```. If you're not on ```my-branch-name```, then run ```git checkout my-branch-name``` to switch branches. 

### Committing changes

Now you can actually do your own coding and modifications to the program. Every time you make an upgrade/modification to one of the files in the repository (let's say ```file.py```), you should
1. Stage the change with ```git add file.py```.
2. Commit the change ```git commit -m"Short message describing the commit"```. Make sure you commit often and follow proper protocol when writing commit messages. 
3. Push the change to ```git push``` to upload the changes to your repository (the origin master, owned by you, not the upstream master).


### Opening a pull request

When you're done with your modifications, you're ready to open a **pull request** to the original owner's repo. Here's how to do that.

1. Push your local branch to your local repo by running ```git push origin my-branch-name```. 
2. Head over to your Github repository. Github has already detected that you might want to merge this new branch of yours into the official, original repo. This is where you should click open pull request, and comment on why your changes are necessary. Then, submit your request.
3. At this point, the repo manager (Matt in this case) will review the changes and decide to either merge the branch into the official master branch (or whatever branch you originally branched out of) or suggest changes you should make before we merge. 
4. Once the merge is accepted, you're done! 


## Suggestions for future projects

Possible projects:
- Simulate some gambling games, and show the net effect on the long run on the population, and even on winning individuals. Possibly compare with basic results from probability theory.
- Make some simple fun questions from propability theory. Give the analytical result. Check the result numerically.
- Simulate situations of social privilege
- Voting systems. Introduce several electoral systems (D'Hondt, Hare-Niemeyer, Sainte-Laguë, or even sorted by country), and show that no matter what you choose there will always be something wrong.




