# WHRHS hillsHack Repository

This will/can serve as a collaborative repository for any students who wishes to leave something behind for future high school students to look at and reference. The intent is to help other students learn by example, so the more code the better!

***Note: all code here will be public domain, this repo is unlicensed - don't push anything here that you're uncomfortable with anyone else copying.***

---
Here is a quick user-friendly (I hope) guide to using git.
1. [create github account](Create a github account.) Note that it is free to have a github account in general and contribute to public repositories (open source), and students can use the fully functional git/github functionality for free (meaning you can use private repositories that are available only to you).
2. Download git (google "download git")
3. Now you can begin contributing to a public repo. First, navigate to a repo you want to contribute to, and click the **Fork** button on the top right hand of the page. This will essentially make a copy of the repo on your account. This creates the **origin** (online) location of your repo.
4. Open terminal and navigate to the directory you want to put your local copy of the repo. For instance, ```cd ~/Desktop```. Then, use the command ```git clone [repo name here]```. For example, if I wanted to clone my repository to my local machine, I would run the command ```git clone https://github.com/x94carbone/hack.git```, which will create a directory called ```hack``` in whatever location I navigated to. 
5. Change directory into the newly created git repository (```cd hack```); you can check that a git repo was successfully initialized within this directory by using ```git status``` which will display the current status of the master branch.
6. Set up an upstream remote branch ```git remote add upstream git@github.com:x94carbone/hack.git``` (this time, you should run exactly that command). This initializes a branch that essentially points to the actual repository that you want to push your changes to; *not* your forked repository. So in summary, origin/master points to *your* remote repo, and origin/upstream points to the original owner's repo.


You're now ready to make local changes to the repo. This is done via branching. You never want to directly modify the master branch, since usually this branch is meant to be always *deployable*. It is supposed to be ready for public use. Therefore, you should make a new branch and make your modifications there. To do this, you should perform the following steps.

1. First, run ```git checkout master``` to ensure you're located on your own local master branch.
2. Next, run ```git pull upstream master```. This does exactly what it sounds like. It will pull the most recent data from the original owner's repo and copy the entire history to your *local* repo. 
3. After that, you want to ensure your *remote* repo is up to date with your local one, so you should push via ```git push origin master```. 
4. Finally, create a local branch via ```git branch -b my-branch-name```.
5. Also, ensure you're actually on the branch ```my-branch-name``` and not ```master``` by running the command ```git status```. If you're not on ```my-branch-name```, then run ```git checkout my-branch-name``` to switch branches. 

Now you can actually do your own coding and modifications to the program. Make sure you commit often and follow proper protocol when writing commit messages. When you're done with your modifications, you're ready to open a pull request to the original owner's repo. Here's how to do that.

1. Push your local branch to your local repo by running ```git push origin my-branch-name```. 
2. Head over to your Github repository. Github has already detected that you might want to merge this new branch of yours into the official, original repo. This is where you should click open pull request, and comment on why your changes are necessary. Then, submit your request.
3. At this point, the repo manager (Matt in this case) will review the changes and decide to either merge the branch into the official master branch (or whatever branch you originally branched out of) or suggest changes you should make before we merge. 
4. Once the merge is accepted, you're done! 







