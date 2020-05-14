const core = require('@actions/core');
const github = require('@actions/github');
const shell = require('shelljs');

function run() {
    try {
        const environmentsString = core.getInput('environment');
        const environments = environmentsString.split('-');
        const xcode_dir = core.getInput('developer_dir');
        const fastlane_password = core.getInput('fastlane_password');
        const match_password = core.getInput('match_password');
        const slack_release_notes_url = core.getInput('slack_url');

        shell.env["DEVELOPER_DIR"] = xcode_dir;
        shell.env["FASTLANE_PASSWORD"] = fastlane_password;
        shell.env["MATCH_PASSWORD"] = match_password;
        shell.env["SLACK_URL"] = slack_release_notes_url;

        shell.exec("bundle install");
        shell.exec("bundle exec fastlane create_new_temporary_keychain");
        
        environments.forEach(environment =>  build_upload(environment));
        tag_version()
        post_release_notes()
        
    } catch (error) {
        core.setFailed(error.message);
    }
}

function build_upload(environment) {
    fastlaneTestflightResult = shell.exec("fastlane submit_to_testflight env:" + environment);
    if (fastlaneTestflightResult.code !== 0) {
        setFailed(new Error(`Fastlane Testflight failed`));
    }
}

function tag_version() {
    shell.exec("bundle exec fastlane tag_version");
}

function post_release_notes() {
    shell.exec("git fetch --tags");
    fastlaneSlackResult = shell.exec("bundle exec fastlane post_slack_release_notes");
    if (fastlaneTestflightResult.code !== 0) {
        setFailed(new Error(`Fastlane Testflight failed`));
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}
run()