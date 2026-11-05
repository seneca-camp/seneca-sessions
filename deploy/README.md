# Seneca Sessions Deployment

This deploy config is meant for managed hosting like Uberspace. Right now only
Uberspace 7 is supported. Create a folder in your space and drop the update.sh
and deployment.conf. Adjust the deployment.conf.example to your needs. Adjust
the supervisor unit file as necessary and copy it in the right place for your
hoster.

Configure a cronjob that runs the update.sh regulary. It will check our release
page for a new version and check the version against what is currently
deployed. If the latest release is newer, it will download the new app, stop
the current app, run the migrations and start the new app.

The database url should be outside the app folder that is created by the
update.sh script, otherwise the db will be reinitialized with each update.

As long as the sessions app is still developed in a private repo, a GitHub
personal access token (can be finegrained with "Contents" permission) needs to
be configured.
